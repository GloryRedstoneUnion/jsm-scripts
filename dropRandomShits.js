/*
创造模式批量丢出随机物品脚本
仅限创造模式
在游戏中通过按键宏启动脚本

1.丢弃控制
每次丢多少物品可以自己控制
*/
function itemCount(maxCount){
    //return Math.ceil(maxCount*Math.random()) //返回最大堆叠以下的随机数量
    //return 1 //固定一个
    return Math.ceil(maxCount/2) //最大堆叠的一半
    //return maxCount* (6 + Math.floor(Math.random()-0.5)*2) //4组或6组物品
}
/*
2.物品也不一定按顺序扔，可以随机↓
*/
function random(i, maxLength){
    return i
    //return Math.floor(Math.random()*maxLength)
}
/*
*要改代码的话就在要去掉的语句前面加 // 注释掉， 去掉要添加语句前面的 // 取消注释

3.记录进度
脚本会从上次停止的位置继续(通过全局变量)
按快捷键B恢复(在下方修改↓)
*/ const TriggerKey = "key.keyboard.x"/* (你可以在https://zh.minecraft.wiki/w/%E9%94%AE%E6%8E%A7%E4%BB%A3%E7%A0%81 找到详细信息)

4.修改丢弃速度
编辑 */const ms = 1 /*，数值越大丢弃间隔越长（单位：毫秒）

5.修改物品筛选规则
编辑 vaild() 函数中的条件判断，可以自定义哪些物品应该被过滤掉
*/
function vaild(item){
    //if(item.getMaxCount() <= 1) return false //是否丢不可堆叠
    //if(item.getMaxCount() > 1) return false   //只丢不可堆叠
    if(item.getCreativeTab().length ==0) return false
    if(item.getCreativeTab()[0].getJson().includes("spawnEgg")) return false
    let id = item.getId()
    if(!id.includes("minecraft")) return false
    if(id.includes("map")) return false
    if(id.includes("painting")) return false
    if(id.includes("infested")) return false
    if(id.includes("bedrock")) return false
    if(id.includes("budding_amethyst")) return false
    if(id.includes("dirt_path")) return false
    if(id.includes("farmland")) return false
    if(id.includes("large_fern")) return false
    if(id.includes("tall_grass")) return false
    if(id.includes("chorus_plant")) return false
    if(id.includes("frogspawn")) return false
    if(id.includes("player_head")) return false
    if(id.includes("vault")) return false
    if(id.includes("tipped_arrow")) return false
    if(id.includes("reinforced_deepslate")) return false
    if(id.includes("end_portal_frame")) return false
    if(id.includes("debug_stick")) return false
    return true
}/*

安全提示
请注意不要影响其他玩家
大量物品实体可能导致游戏性能下降
这个脚本主要适用于创造模式下的娱乐和测试用途，使用时请注意周围环境和游戏性能影响。

*/

var scriptname = "DropRandomShit"
const reverse = !GlobalVars.getBoolean(scriptname)
GlobalVars.putBoolean(scriptname, reverse)

if(GlobalVars.getBoolean(scriptname)){
    Chat.actionbar(`§7[§5${scriptname}§7] §aenabled`)
}else{
    Chat.actionbar(`§7[§5${scriptname}§7] §cdisable`)
}
const inv = Player.openInventory()
if(inv.getType() == "Creative Inventory" && GlobalVars.getBoolean(scriptname)){
    const Reset = JsMacros.on("Key", JavaWrapper.methodToJava(event => {
        if(event.key === TriggerKey && event.action === 1){
            GlobalVars.putInt("item_index", 0)
        }
    }))
    const Close = JsMacros.on("Key", JavaWrapper.methodToJava(event => {
        if(GlobalVars.getBoolean(scriptname)) return
        Close.off()
        Reset.off()
    }))
    //const ItemStackHelper = Java.type("xyz.wagyourtail.jsmacros.client.api.helpers.inventory.ItemStackHelper")
    const ItemList = Client.getRegisteredItems()
    const length = ItemList.length
    let i = GlobalVars.getInt("item_index")
    let indexCount = 0
    if(!i || i >= length) {
        GlobalVars.putInt("item_index", 0)
        i=0
    }
    while(GlobalVars.getBoolean(scriptname)){
        if(i >= length) break
        let r = random(i, length)//
        
        let randomItem = ItemList[r]
        let id = randomItem.getId()
        let maxCount = randomItem.getMaxCount()
        if(vaild(randomItem)){
            let count = itemCount(maxCount)
            while( count > 0 ){
                let item = ItemList.find(item => {return item.getId() == id}).getDefaultStack().getCreative().setCount(Math.min(maxCount, count))
                //let item = new ItemStackHelper(id, Math.min(maxCount, count))
                inv.setStack(36, item)
                inv.dropSlot(36, true)
                Time.sleep(ms)
                count -= maxCount
            }
        }
        i++
        indexCount++
        Chat.actionbar(`计数:${indexCount}`)
        GlobalVars.putInt("item_index", i)
    }
}
