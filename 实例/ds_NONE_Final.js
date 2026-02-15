const CONTAINER_TITLE = "NONE 制造器";
const OUTPUT_SLOT = 13; // 输出槽位索引（第14格）
const DELAY = 100;      // 推荐操作间隔（毫秒）
const MAX_ATTEMPTS = 30;// 最大等待次数
const SHORTAGE_TIMEOUT = 30000; // 30秒超时

// 物品配置（槽位索引0-8）
const PATTERN = {
    first: [
        {id:"minecraft:cobblestone", count:9},
        {id:"minecraft:stone", count:8},
        {id:"minecraft:cobblestone_wall", count:7},
        {id:"minecraft:cobblestone_stairs", count:6},
        {id:"minecraft:stone_stairs", count:5},
        {id:"minecraft:stone_brick_stairs", count:4},
        {id:"minecraft:stone_brick_wall", count:3},
        {id:"minecraft:stone_bricks", count:2},
        {id:"minecraft:smooth_stone", count:1}
    ],
    second: [
        {id:"minecraft:smooth_stone", count:9},
        {id:"minecraft:stone_bricks", count:8},
        {id:"minecraft:stone_brick_wall", count:7},
        {id:"minecraft:stone_brick_stairs", count:6},
        {id:"minecraft:stone_stairs", count:5},
        {id:"minecraft:cobblestone_stairs", count:4},
        {id:"minecraft:cobblestone_wall", count:3},
        {id:"minecraft:stone", count:2},
        {id:"minecraft:cobblestone", count:1}
    ]
};

let shortageStart = 0;  // 短缺计时器
let lastWarning = 0;    // 最后警告时间

// ================== 核心函数 ==================
function isContainerOpen() {
    try {
        return Player.openInventory().getContainerTitle() === CONTAINER_TITLE;
    } catch(e) {
        return false;
    }
}

function clearSlots() {
    [0,1,2,3,4,5,6,7,8,13].forEach(slot => {
        if(isContainerOpen() && Player.openInventory().getSlot(slot).getItemId() !== "minecraft:air") {
            Player.openInventory().dropSlot(slot);
            Time.sleep(DELAY);
        }
    });
}

function getInventoryItem(itemId) {
    return Player.openInventory().findItem(itemId)
        .filter(slot => slot >= 18)
        .map(slot => ({
            slot: slot,
            count: Player.openInventory().getSlot(slot).getCount()
        }));
}

function checkMaterials() {
    const allItems = [...PATTERN.first, ...PATTERN.second];
    return allItems.every(need => 
        getInventoryItem(need.id).reduce((sum, i) => sum + i.count, 0) >= need.count
    );
}

function handleShortage() {
    const now = Date.now();
    
    // 初始化计时器
    if(shortageStart === 0) {
        shortageStart = now;
        lastWarning = now;
        Chat.log("§c物品不足！30秒内补足材料...");
    }
    
    // 超时判断
    if(now - shortageStart > SHORTAGE_TIMEOUT) {
        Chat.log("§c等待超时，停止运行");
        return false;
    }
    
    // 周期提醒（每5秒）
    if(now - lastWarning > 5000) {
        const remain = Math.ceil((SHORTAGE_TIMEOUT - (now - shortageStart))/1000);
        Chat.log(`§e剩余等待时间：§6${remain}秒`);
        lastWarning = now;
    }
    
    // 检测是否补足
    if(checkMaterials()) {
        Chat.log("§a材料已补足，继续运行");
        shortageStart = 0;
        return true;
    }
    
    return true; // 继续等待
}

function transferItems(targetSlot, itemId, required) {
    if(!isContainerOpen()) return false;
    
    let remaining = required;
    while(remaining > 0) {
        const sources = getInventoryItem(itemId);
        if(sources.length === 0) break;

        const source = sources[0];
        const moveAmount = Math.min(source.count, remaining);

        Player.openInventory().click(source.slot, 0);
        Time.sleep(DELAY);
        for(let i=0; i<moveAmount; i++) {
            Player.openInventory().click(targetSlot, 1);
            Time.sleep(DELAY/2);
        }
        Player.openInventory().click(source.slot, 0);
        Time.sleep(DELAY);

        remaining -= moveAmount;
    }
    return remaining === 0;
}

function waitForOutput() {
    let attempts = 0;
    while(isContainerOpen() && attempts++ < MAX_ATTEMPTS) {
        const item = Player.openInventory().getSlot(OUTPUT_SLOT);
        if(item.getItemId() === "minecraft:black_wool") {
            Player.openInventory().dropSlot(OUTPUT_SLOT);
            Time.sleep(DELAY);
            return true;
        }
        Time.sleep(DELAY);
    }
    return false;
}

function executePattern(pattern) {
    for(let slot=0; slot<9; slot++) {
        if(!isContainerOpen()) return false;
        const {id, count} = pattern[slot];
        
        if(!transferItems(slot, id, count)) {
            // 进入短缺处理流程
            while(isContainerOpen()) {
                if(!handleShortage()) return false;
                Time.sleep(1000);
                if(checkMaterials()) break;
            }
            if(!transferItems(slot, id, count)) return false;
        }
    }
    return waitForOutput();
}

// ================== 主流程 ==================
function main() {
    if(!isContainerOpen()) {
        Chat.log("§c错误：请先打开目标容器");
        return;
    }

    Chat.log("§a脚本启动成功");
    while(isContainerOpen()) {
        clearSlots();
        
        // 执行第一模式
        if(!executePattern(PATTERN.first)) break;
        
        // 执行第二模式
        if(!executePattern(PATTERN.second)) break;
        
        Chat.log("§b完整循环已完成");
    }
    Chat.log("§c脚本已停止");
}

// 启动脚本
main();
