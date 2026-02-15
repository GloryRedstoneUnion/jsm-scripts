// 自用脚本: baritone自动拾取周围特定物品
// 不准拿去卖钱
// Bi_Diu
// 不少代码来源于群内脚本, 感谢各位群友的实例!

const scriptname = "baritone auto collect"
const reverse = !GlobalVars.getBoolean(scriptname);
GlobalVars.putBoolean(scriptname, reverse);
if (reverse) {
    Chat.log(Chat.createTextBuilder().append("[").withColor(0x7).append(scriptname).withColor(0x5).append("]").withColor(0x7).append(" Enabled").withColor(0xc).build());
} else {
    Chat.log(Chat.createTextBuilder().append("[").withColor(0x7).append(scriptname).withColor(0x5).append("]").withColor(0x7).append(" Disabled").withColor(0xc).build());
}

//================config=================//
const whitelist = ["钻石", "青金石"];  // 掉落物名白名单 注意是名字! 不是物品id

const radius = 30;                    // 搜索半径
const pickRange = 1.4;                // 拾取半径
//=======================================//

const player = Player.getPlayer();

function checkName(item) {
    for (let name of whitelist) {
        if (item.getName().getString() === name) {
            return true;
        }
    }
    return false;
}

function goPickUp(item) {
    let x = item.getX().toFixed(2);
    let y = item.getY().toFixed(2);
    let z = item.getZ().toFixed(2);
    Chat.actionbar(`前往拾取: ${item.getName().getString()} @ (${x}, ${y}, ${z})`);
    Chat.say(`#goto ${x} ${y} ${z}`);
    while (player.distanceTo(item.getX(), item.getY(), item.getZ()) > pickRange && GlobalVars.getBoolean(scriptname)) {
        Time.sleep(50);
        if (!item.isAlive()) {
            Chat.actionbar("物品无效或已被拾取, 停止寻路");
            //Chat.say("#cancel")
            break;
        }
    }
}

while (GlobalVars.getBoolean(scriptname)) {
    let itemList = World.getEntities(radius, "item");
    if (itemList.isEmpty()) {
        Time.sleep(100);
        continue;
    }

    // 找距离玩家最近且在白名单的物品
    let nearestItem = null;
    let nearestDist = Infinity;
    for (let i = 0; i < itemList.size(); i++) {
        let item = itemList.get(i);
        if (!checkName(item)) {
            item.setGlowing(false);
            continue;
        }
        let dist = player.distanceTo(item.getX(), item.getY(), item.getZ());
        if (dist < nearestDist && dist > pickRange) {
            nearestDist = dist;
            nearestItem = item;
        }
    }

    if (nearestItem) {
        // 只给最近的物品发光
        nearestItem.setGlowing(true);
        goPickUp(nearestItem);
        nearestItem.setGlowing(false);
        Time.sleep(20);
    } else {
        // 如果没有符合条件的物品，全部熄灭发光
        for (let i = 0; i < itemList.size(); i++) {
            itemList.get(i).setGlowing(false);
        }
        Time.sleep(100);
    }

    Client.waitTick(1);

    if (!GlobalVars.getBoolean(scriptname)) {
        for (let i = 0; i < itemList.size(); i++) {
            itemList.get(i).setGlowing(false);
        }
    }
}