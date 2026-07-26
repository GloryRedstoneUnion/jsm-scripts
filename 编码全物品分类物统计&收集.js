/*
全物品分类物记录&收集脚本
在游戏中通过按键宏启动脚本

1.启动脚本
使用预设的按键宏启动脚本
启动后会在聊天栏显示提示信息：[SignChestManager] 已启用 - 右键告示牌开始记录

2. 创建物品分类
放置一个告示牌并写上分类名称（如"F-1"、"MT-1"等）
右键点击告示牌开始记录模式
脚本会清除该告示牌之前的记录，开始新的记录

3. 记录箱子内容
打开要记录的箱子（会自动检测）
脚本会扫描并记录箱子中的所有物品
每个告示牌可以关联多个箱子
如果需要指定填充物(特殊命名物品)，更改下面的名称(注意不要与原版物品名字有重复，如："命" 与 "命名牌"重复)
*/const SPECIAL_ITEM = "ENCODER"/*
4. 收集物品
按住 Alt 键并使用鼠标滚轮选择告示牌分类
按下 B 键 (在下方更改↓)开始收集 
*/ const TriggerKey = "key.keyboard.b"/* (你可以在https://zh.minecraft.wiki/w/%E9%94%AE%E6%8E%A7%E4%BB%A3%E7%A0%81 找到详细信息)
脚本会自动从附近箱子中检索并丢出该分类下的所有物品(包括填充物等)

*/


var scriptname = "SignChestManager"
const reverse = !GlobalVars.getBoolean(scriptname)
GlobalVars.putBoolean(scriptname, reverse)

// 数据存储文件路径
const dataFilePath = "config/SignChestManager.json"

// 数据结构
let signData = {} // 存储告示牌数据 {signText: {chests: [], items: {}}}
let currentSign = null // 当前选中的告示牌
let signList = [] // 所有告示牌列表
let currentSignIndex = 0 // 当前选中的告示牌索引
let isRecording = false // 是否正在记录模式
let isCollecting = false // 是否正在收集模式

const Delay = 0

function main() {
    if (!GlobalVars.getBoolean(scriptname)) return
    
    // 启动时加载数据
    loadData()
    
    Chat.actionbar(`§7[§5${scriptname}§7] §a已启用 - 右键告示牌开始记录`)
    
    // 右键告示牌事件
    const RightClick = JsMacros.on("InteractBlock", JavaWrapper.methodToJava(event => {
        if (!GlobalVars.getBoolean(scriptname)) return
        
        const block = event.block
        if (block.getId().includes("sign")) {
            handleSignClick(block)
        }
    }))
    
    // 打开容器事件
    const OpenContainer = JsMacros.on("OpenScreen", true, JavaWrapper.methodToJava(event => {
        if (!GlobalVars.getBoolean(scriptname) || !isRecording) return
        
        Client.waitTick(2)
        if (!Player.openInventory().isContainer()) return
        
        const inv = Player.openInventory()
        const pos = getCurrentChestPos()
        recordChestItems(inv, pos)
    }))
    
    // 滚轮切换告示牌
    const ScrollWheel = JsMacros.on("MouseScroll", true, JavaWrapper.methodToJava(event => {
        if (!GlobalVars.getBoolean(scriptname)) return
        
        if (KeyBind.getPressedKeys().contains("key.keyboard.left.alt")) {
            event.cancel()
            switchSign(event.deltaY > 0)
        }
    }))
    
    // 收集快捷键
    const CollectKey = JsMacros.on("Key", JavaWrapper.methodToJava(event => {
        if (!GlobalVars.getBoolean(scriptname)) return
        
        if (event.key == TriggerKey && event.action == 1) {
            startCollecting()
        }
    }))
    
    // // 手动保存数据快捷键 (例如 P 键)
    // const SaveKey = JsMacros.on("Key", JavaWrapper.methodToJava(event => {
    //     if (!GlobalVars.getBoolean(scriptname)) return
        
    //     if (event.key == "key.keyboard.p" && event.action == 1) {
    //         saveData()
    //         Chat.log(`§7[§5${scriptname}§7] §a手动保存数据完成`)
    //     }
    // }))
    
    // 关闭脚本
    const Close = JsMacros.on("Key", JavaWrapper.methodToJava(event => {
        if (!GlobalVars.getBoolean(scriptname)) {
            Chat.actionbar(`§7[§5${scriptname}§7] §c已禁用`)
            
            // 关闭前自动保存数据
            saveData()
            
            isRecording = false
            isCollecting = false
            currentSign = null
            RightClick.off()
            OpenContainer.off()
            ScrollWheel.off()
            CollectKey.off()
            //SaveKey.off()
            Close.off()
        }
    }))
}

// 加载数据
function loadData() {
    try {
        
        if (FS.exists(dataFilePath)) {
            const file = FS.open(dataFilePath)
            const content = file.read()
            const data = JSON.parse(content)
            
            signData = data.signData || {}
            signList = data.signList || []
            currentSignIndex = data.currentSignIndex || 0
            
            // 恢复 currentSign
            if (signList.length > 0 && currentSignIndex < signList.length) {
                currentSign = signList[currentSignIndex]
            }
            
            Chat.log(`§7[§5${scriptname}§7] §a加载数据成功: §e${signList.length}个告示牌`)
            updateDisplay()
        } else {
            Chat.log(`§7[§5${scriptname}§7] §7数据文件不存在，使用默认设置`)
        }
    } catch (error) {
        Chat.log(`§7[§5${scriptname}§7] §c加载数据失败: ${error.message}`)
        // 重置为默认值
        signData = {}
        signList = []
        currentSignIndex = 0
        currentSign = null
    }
}

// 保存数据
function saveData() {
    try {
        const data = {
            signData: signData,
            signList: signList,
            currentSignIndex: currentSignIndex,
            lastSaved: new Date().toISOString()
        }
        
        const file = FS.open(dataFilePath)
        file.write(JSON.stringify(data, null, 2))
        
        //Chat.log(`§7[§5${scriptname}§7] §a数据保存成功`)
    } catch (error) {
        Chat.log(`§7[§5${scriptname}§7] §c保存数据失败: ${error.message}`)
    }
}

// 处理告示牌点击
function handleSignClick(block) {
    const signText = getSignText(block)
    const signKey = signText.join(" | ")
    
    // 清空该告示牌的记录，重新开始
    signData[signKey] = {
        chests: [],
        items: {},
        signPos: {
            x: block.getBlockPos().getX(),
            y: block.getBlockPos().getY(),
            z: block.getBlockPos().getZ()
        }
    }
    
    currentSign = signKey
    if (!signList.includes(signKey)) {
        signList.push(signKey)
    }
    currentSignIndex = signList.indexOf(signKey)
    
    isRecording = true
    Chat.log(`§7[§5${scriptname}§7] §a开始记录告示牌: §e${signKey}`)
    updateDisplay()
    
    // 自动保存数据
    saveData()
}

// 获取告示牌文本
function getSignText(block) {
    const blockEntity = World.getBlock(block.getBlockPos())?.getNBT()?.get("front_text")?.get("messages")?.asListHelper()
    if (blockEntity) {
        const lines = []
        for (let i = 0; i < 4; i++) {
            
            if(blockEntity.get(i).isNull() || blockEntity.get(i).asString() == `""`) continue
            const line = blockEntity.get(i).asString().slice(1, blockEntity.get(i).asString().length -1)
            if (line && line != "") {
                lines.push(line.trim())
            }
        }
        return lines.filter(line => line.length > 0)
    }
    return ["未知告示牌"]
}

// 获取当前箱子坐标
function getCurrentChestPos(block) {
    const player = Player.getPlayer()
    const lookingAt = player.rayTraceBlock(5.0, false)
    
    if (lookingAt) {
        return lookingAt.getBlockPos()
    }
    return null
}

// 获取物品的完整标识符（包含NBT信息）
function getItemIdentifier(item) {
    const itemId = item.getItemId()
    const itemName = item.getName().getString()
    
    // 如果是蓝色玻璃板且名字包含特殊标识符
    if (itemName.includes(SPECIAL_ITEM)) {
        return SPECIAL_ITEM
    }
    
    // 其他情况使用普通的itemId
    return itemId
}

// 记录箱子物品
function recordChestItems(inv, pos) {
    if (!currentSign || !pos) return
    
    const chestKey = `${pos.getX()}_${pos.getY()}_${pos.getZ()}`
    const signInfo = signData[currentSign]
    
    // 检查是否是重复箱子，如果是则删除旧记录
    const existingIndex = signInfo.chests.findIndex(chest => 
        isConnectedChest(chest.pos, pos) || chest.key === chestKey
    )
    
    if (existingIndex >= 0) {
        // 删除旧记录的物品统计
        const oldChest = signInfo.chests[existingIndex]
        Object.keys(oldChest.items).forEach(itemIdentifier => {
            signInfo.items[itemIdentifier] = (signInfo.items[itemIdentifier] || 0) - oldChest.items[itemIdentifier]
            if (signInfo.items[itemIdentifier] <= 0) {
                delete signInfo.items[itemIdentifier]
            }
        })
        signInfo.chests.splice(existingIndex, 1)
    }
    
    // 收集新的物品数据
    const chestItems = {}
    inv.getSlots("container").forEach(slot => {
        const item = inv.getSlot(slot)
        if (item.getItemId() !== "minecraft:air") {
            const itemIdentifier = getItemIdentifier(item) // 使用新的标识符函数
            const count = item.getCount()
            chestItems[itemIdentifier] = (chestItems[itemIdentifier] || 0) + count
            signInfo.items[itemIdentifier] = (signInfo.items[itemIdentifier] || 0) + count
        }
    })
    
    // 添加新箱子记录
    signInfo.chests.push({
        key: chestKey,
        pos: {
            x: pos.getX(),
            y: pos.getY(),
            z: pos.getZ()
        },
        items: chestItems
    })
    
    Chat.log(`§7[§5${scriptname}§7] §a记录箱子: §e${chestKey} §a(${Object.keys(chestItems).length}种物品)`)
    updateDisplay()
    
    // 自动保存数据
    saveData()
}

// 判断是否是相连的大箱子
function isConnectedChest(pos1, pos2) {
    const dx = Math.abs(pos1.x - pos2.getX())
    const dy = Math.abs(pos1.y - pos2.getY())
    const dz = Math.abs(pos1.z - pos2.getZ())
    
    // 首先检查是否相邻
    if (dy !== 0 || !((dx === 1 && dz === 0) || (dx === 0 && dz === 1))) {
        return false
    }
    
    // 检查两个位置是否都是箱子
    const block1 = World.getBlock(pos1.x, pos1.y, pos1.z)
    const block2 = World.getBlock(pos2.getX(), pos2.getY(), pos2.getZ())
    
    if (!block1 || !block2 || 
        !block1.getId().includes("chest") || 
        !block2.getId().includes("chest")) {
        return false
    }
    
    // 检查箱子的朝向是否相同（大箱子的两部分朝向必须一致）
    const nbt1 = block1.getNBT()
    const nbt2 = block2.getNBT()
    
    if (!nbt1 || !nbt2) return false
    
    const facing1 = nbt1.get("facing")?.asString()
    const facing2 = nbt2.get("facing")?.asString()
    
    if (facing1 !== facing2) return false
    
    // 检查 type 属性来确定是否是大箱子的一部分
    const type1 = nbt1.get("type")?.asString()
    const type2 = nbt2.get("type")?.asString()
    
    // 如果都是 "single" 类型，说明是两个独立的小箱子
    if (type1 === "single" && type2 === "single") {
        return false
    }
    
    // 如果一个是 "left" 一个是 "right"，说明是大箱子的两部分
    if ((type1 === "left" && type2 === "right") || 
        (type1 === "right" && type2 === "left")) {
        return true
    }
    
    return false
}

// 切换告示牌
function switchSign(up) {
    if (signList.length === 0) return
    
    if (up) {
        currentSignIndex = (currentSignIndex + 1) % signList.length
    } else {
        currentSignIndex = (currentSignIndex - 1 + signList.length) % signList.length
    }
    
    currentSign = signList[currentSignIndex]
    updateDisplay()
    
    // 保存当前选中的告示牌索引
    saveData()
}

// 更新显示
function updateDisplay() {
    if (!currentSign) return
    
    const signInfo = signData[currentSign]
    const itemCount = Object.keys(signInfo.items).length
    const chestCount = signInfo.chests.length
    
    const displayText = `§7[§e${currentSign}§7] §a物品:§e${itemCount} §a箱子:§e${chestCount}`
    
    // 在左上角显示 (使用 HUD 或 actionbar)
    Chat.actionbar(displayText)
}

// 开始收集物品
function startCollecting() {
    if (!currentSign) {
        Chat.log(`§7[§5${scriptname}§7] §c请先选择一个告示牌`)
        return
    }
    
    if (!currentSign || isCollecting) return
    Chat.log(`§7[§5${scriptname}§7] §a开始收集`)
    // 这里需要实现物品搜索和收集逻辑
    // 由于涉及到复杂的背包操作和物品搜索，需要根据具体需求进一步实现
    collectItemsFromNearbyChests()
}

function getChestPoses(){
    let list = []
    for(let x = -10; x < 10; x++){
        for(let y = 0; y < 5; y++){
            for(let z = -3; z < 3; z++){
                let px = Player.getPlayer().getBlockPos().getX()
                let py = Player.getPlayer().getBlockPos().getY()
                let pz = Player.getPlayer().getBlockPos().getZ()
                if(World.getBlock(px+x,py+y,pz+z)?.getId() == "minecraft:chest") list.push(PositionCommon.createPos(px+x,py+y,pz+z))
            }
        }
    }
    return list
}

// 修改收集物品的函数
function collectItemsFromNearbyChests() {
    if (!currentSign || isCollecting) return
    isCollecting = true

    const signInfo = signData[currentSign]
    const player = Player.getPlayer()
    const playerPos = player.getBlockPos()
    const chests = getChestPoses()//World.findBlocksMatching("minecraft:chest", 10)
    
    // 缓存需要收集的物品列表
    const itemsToCollect = new Map()
    signInfo.chests.forEach(chest => {
        const items = chest.items
        for (const itemIdentifier in items) {
            const currentCount = itemsToCollect.get(itemIdentifier) || 0
            itemsToCollect.set(itemIdentifier, currentCount + items[itemIdentifier])
        }
    })
    
    Chat.log(`§7[§5${scriptname}§7] §a开始收集 ${itemsToCollect.size} 种物品`)
    
    // 记录已处理的箱子位置（避免重复处理大箱子）
    const processedChests = new Set()
    
    // 遍历附近的箱子
    for (const chestPos of chests) {
        // ... 省略箱子检查逻辑 ...
        
        const chestKey = `${chestPos.getX()}_${chestPos.getY()}_${chestPos.getZ()}`
        if (processedChests.has(chestKey)) continue
        
        // 检查是否是大箱子的另一半
        let isConnectedChest = false
        for (const processedKey of processedChests) {
            const [x, y, z] = processedKey.split('_').map(Number)
            if (isConnectedChestPos(chestPos, { x, y, z })) {
                isConnectedChest = true
                break
            }
        }
        if (isConnectedChest) continue
        
        const distance = player.distanceTo(chestPos.add(0.5, 0.5, 0.5))
        
        if (distance <= Player.getReach()) {
            try {
                // 交互打开箱子
                Player.getInteractionManager().interactBlock(
                    chestPos.getX(), 
                    chestPos.getY(), 
                    chestPos.getZ(), 
                    "up", 
                    false
                )
                
                // 等待箱子打开
                let waitTicks = 0
                while (!Player.openInventory().getType().includes("Chest") && 
                       GlobalVars.getBoolean(scriptname) && 
                       waitTicks < 20) {
                    Client.waitTick(1)
                    waitTicks++
                }
                
                if (!Player.openInventory().getType().includes("Chest")) {
                    Chat.log(`§7[§5${scriptname}§7] §c无法打开箱子: ${chestKey}`)
                    continue
                }
                
                Client.waitTick(2)
                const inv = Player.openInventory()
                
                // 遍历箱子中的物品
                inv.getSlots("container").forEach(slot => {
                    const item = inv.getSlot(slot)
                    const itemId = item.getItemId()
                    
                    if (itemId !== "minecraft:air") {
                        const itemIdentifier = getItemIdentifier(item) // 使用新的标识符函数
                        if(itemIdentifier.includes(SPECIAL_ITEM)) Chat.log(item)
                        if (itemsToCollect.has(itemIdentifier)) {
                            let neededCount = itemsToCollect.get(itemIdentifier)
                            const availableCount = item.getCount()
                            
                            // 计算实际要丢出的数量
                            const dropCount = Math.min(neededCount, availableCount)
                            
                            if (dropCount > 0) {
                                // 丢出指定数量的物品
                                for (let i = 0; i < dropCount; i++) {
                                    if (inv.getSlot(slot).getCount() > 0) {
                                        inv.dropSlot(slot)
                                        Client.waitTick(Delay)
                                    }
                                }
                                
                                // 更新需要收集的数量
                                const remainingCount = neededCount - dropCount
                                if (remainingCount > 0) {
                                    itemsToCollect.set(itemIdentifier, remainingCount)
                                } else {
                                    itemsToCollect.delete(itemIdentifier)
                                }
                            }
                        }
                    }
                })
                
                inv.close()
                Client.waitTick(Delay)
                
                // 标记这个箱子已处理
                processedChests.add(chestKey)
                
            } catch (error) {
                Chat.log(`§7[§5${scriptname}§7] §c处理箱子 ${chestKey} 时出错: ${error.message}`)
            }
        }
        
        // 如果所有物品都已收集完毕，提前结束
        if (itemsToCollect.size === 0) {
            Chat.log(`§7[§5${scriptname}§7] §a所有物品收集完毕！`)
            break
        }
    }
    
    // 检查是否有未收集完的物品
    if (itemsToCollect.size > 0) {
        Chat.log(`§7[§5${scriptname}§7] §c以下物品未能完全收集:`)
        itemsToCollect.forEach((count, itemIdentifier) => {
            Chat.log(`§7[§5${scriptname}§7] §c  ${itemIdentifier}: 还需要 ${count} 个`)
        })
    }
    
    isCollecting = false
}

function isConnectedChestPos(pos1, pos2) {
    const dx = Math.abs(pos1.getX() - pos2.x)
    const dy = Math.abs(pos1.getY() - pos2.y)
    const dz = Math.abs(pos1.getZ() - pos2.z)
    
    // 首先检查是否相邻
    if (dy !== 0 || !((dx === 1 && dz === 0) || (dx === 0 && dz === 1))) {
        return false
    }
    
    // 检查两个位置是否都是箱子
    const block1 = World.getBlock(pos1.getX(), pos1.getY(), pos1.getZ())
    const block2 = World.getBlock(pos2.x, pos2.y, pos2.z)
    
    if (!block1 || !block2 || 
        !block1.getId().includes("chest") || 
        !block2.getId().includes("chest")) {
        return false
    }
    
    // 检查箱子的朝向是否相同（大箱子的两部分朝向必须一致）
    const nbt1 = block1.getNBT()
    const nbt2 = block2.getNBT()
    
    if (!nbt1 || !nbt2) return false
    
    const facing1 = nbt1.get("facing")?.asString()
    const facing2 = nbt2.get("facing")?.asString()
    
    if (facing1 !== facing2) return false
    
    // 检查 type 属性来确定是否是大箱子的一部分
    const type1 = nbt1.get("type")?.asString()
    const type2 = nbt2.get("type")?.asString()
    
    // 如果都是 "single" 类型，说明是两个独立的小箱子
    if (type1 === "single" && type2 === "single") {
        return false
    }
    
    // 如果一个是 "left" 一个是 "right"，说明是大箱子的两部分
    if ((type1 === "left" && type2 === "right") || 
        (type1 === "right" && type2 === "left")) {
        return true
    }
    
    return false
}
// 输出数据到剪贴板（调试用）
function outputData() {
    const data = {
        currentSign: currentSign,
        signList: signList,
        signData: signData
    }
    Utils.copyToClipboard(JSON.stringify(data, null, 2))
    Chat.log(`§7[§5${scriptname}§7] §a数据已复制到剪贴板`)
}

// 清理数据功能 - 可选择性删除告示牌数据
function clearSignData(signKey) {
    if (signKey && signData[signKey]) {
        delete signData[signKey]
        const index = signList.indexOf(signKey)
        if (index > -1) {
            signList.splice(index, 1)
        }
        
        // 重新调整当前选中的告示牌
        if (currentSign === signKey) {
            if (signList.length > 0) {
                currentSignIndex = Math.min(currentSignIndex, signList.length - 1)
                currentSign = signList[currentSignIndex]
            } else {
                currentSign = null
                currentSignIndex = 0
            }
        }
        
        saveData()
        Chat.log(`§7[§5${scriptname}§7] §a已删除告示牌数据: §e${signKey}`)
        updateDisplay()
    }
}

main()