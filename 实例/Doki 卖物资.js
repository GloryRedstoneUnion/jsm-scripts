// 部分代码是好久之前写的，可能有点烂
// 好多代码是以前从群里抄的，谢谢群友！
// 写的有点烂，泛用性不强
// Bi_Diu

// #blocksToAvoid spruce_fence_gate
// #allowBreak false

const Pos3D = Java.type("xyz.wagyourtail.jsmacros.client.api.classes.math.Pos3D");

const baritone1 = new Pos3D(28977, 20, 14008);
const baritone2 = new Pos3D(28977, 20, 13992);
const shopPos = new Pos3D(641, 10, -968);
const signPos = new Pos3D(641, 11, -967);

const distance = 4.0;
const itemToTake = "minecraft:cactus";

const scriptName = "Doki 卖物资";
const enabled = GlobalVars.toggleBoolean(scriptName);

if (enabled) {
    Chat.log(Chat.createTextBuilder().append("[").withColor(0x7).append(scriptName).withColor(0x9).append("]").withColor(0x7).append(" Enabled").withColor(0x2).build());
    if (World.getDimension() !== "minecraft:askyblock") {
        Chat.log("请在岛上启用本脚本！");
        GlobalVars.putBoolean(scriptName, false);
        JavaWrapper.stop();
    }
} else {
    // Chat.log(Chat.createTextBuilder().append("[").withColor(0x7).append(scriptName).withColor(0x9).append("]").withColor(0x7).append(" Disabled").withColor(0x4).build());
    // Chat.say("#c")
}

const BaritoneAPI = Java.type("baritone.api.BaritoneAPI");
const GoalBlock = Java.type("baritone.api.pathing.goals.GoalBlock");

let done = false;

if (enabled && !Player.openInventory().getSlot(44).getName().getString().includes("主菜单")) {
    Chat.log("未发现主菜单，请把主菜单放到9号快捷栏")
    GlobalVars.putBoolean(scriptName, false);
    JavaWrapper.stop();
} else {
    Player.openInventory().setSelectedHotbarSlotIndex(0);
}

function isEnabled() {
    return GlobalVars.getBoolean(scriptName);
}

function waitScreen(name) {
    let tt = 0;
    while (isEnabled() && !Player.openInventory().getContainerTitle().includes(name) && tt <= 5000) {
        Time.sleep(50)
        tt += 50
    }
    if (tt > 5000) {
        Chat.log("等待界面超时：" + name)
    }
}

function interactBlock(pos) {
    Player.getInteractionManager().interactBlock(pos.getX(), pos.getY(), pos.getZ(), Player.getPlayer().getFacingDirection().getName(), false)
}

function findBlock(block, distance) {
    let posList = []
    World.findBlocksMatching(block, 2).forEach(pos => {
        if (Player.getPlayer().distanceTo(pos) < distance) {
            posList.push(pos)
        }
    })
    return posList
}

function takeBlocksFromNearbyChest() {
    const posList = findBlock("minecraft:chest", distance)

    for (pos of posList) {
        Client.waitTick(1)
        interactBlock(pos)
        waitScreen("箱子")
        Client.waitTick(2)

        let inv = Player.openInventory()
        for (let i = 0; i <= 53; i++) {
            if (inv.findFreeInventorySlot() === -1) {
                Chat.log("包满，拿取完毕")
                done = true
                inv.close()
                break
            }
            if (inv.getSlot(i).getItemId() === itemToTake) {
                inv.quick(i)
                Time.sleep(25)
            }
        }
        if (done) break
    }
    if (done) return
}

function baritoneGoto(pos) {
    const baritone = BaritoneAPI.getProvider().getPrimaryBaritone();
    const goalProcess = baritone.getCustomGoalProcess();
    const goal = new GoalBlock(pos.x, pos.y, pos.z);
    goalProcess.setGoalAndPath(goal);
}

function waitForBaritone() {
    let t = 0;
    while (BaritoneAPI.getProvider().getPrimaryBaritone().getCustomGoalProcess().isActive() && isEnabled() && t < 1200) { // 最多等 60s
        Time.sleep(50);
        t++;
    }
}

function gotoShopAndSell() {
    Chat.log("前往卖出物资");
    done = false;
    Player.openInventory().setSelectedHotbarSlotIndex(8); // 选中主菜单
    Client.waitTick(5);
    Player.getInteractionManager().interactItem(false);
    waitScreen("梦落岛");
    Client.waitTick(5);
    Player.openInventory().click(33);
    waitScreen("商店");
    Client.waitTick(20);
    Player.openInventory().click(10);
    while (World.getDimension() !== "minecraft:spawn" && isEnabled()) {
        Time.sleep(100);
    }
    Client.waitTick(20);
    Player.openInventory().setSelectedHotbarSlotIndex(0);
    baritoneGoto(shopPos);
    waitForBaritone();
    Chat.log("到达卖物资地点，开始出售");
    Player.getInteractionManager().attack(signPos.getX(), signPos.getY(), signPos.getZ(), Player.getPlayer().getFacingDirection().getName());
    Time.sleep(55);
    Player.getInteractionManager().attack(signPos.getX(), signPos.getY(), signPos.getZ(), Player.getPlayer().getFacingDirection().getName());
    waitScreen("出售");
    Client.waitTick(5);
    Player.openInventory().quick(31);
    Time.sleep(1000);
    Chat.log("物资已卖出");
}

if (isEnabled()) {
    const Close = JsMacros.on("Key", JavaWrapper.methodToJava(event => {
        if (!GlobalVars.getBoolean(scriptName)) {
            Chat.log(Chat.createTextBuilder().append("[").withColor(0x7).append(scriptName).withColor(0x9).append("]").withColor(0x7).append(" Disabled").withColor(0x4).build());

            Chat.say("#c")
            Close.off()
            JavaWrapper.stop();
        }
    }))
}


while (GlobalVars.getBoolean(scriptName)) {

    baritoneGoto(baritone1)
    waitForBaritone();
    takeBlocksFromNearbyChest()
    Player.openInventory().close();
    if (done) {
        Time.sleep(1000);
        gotoShopAndSell();
        Chat.say("/is");
        while (World.getDimension() !== "minecraft:askyblock" && isEnabled()) {
            Time.sleep(100);
        }
        Time.sleep(1000);
        continue;
    }
    if (!GlobalVars.getBoolean(scriptName)) break

    baritoneGoto(baritone2)
    waitForBaritone();
    takeBlocksFromNearbyChest();
    Player.openInventory().close();
    if (done) {
        Time.sleep(1000);
        gotoShopAndSell();
        Chat.say("/is");
        while (World.getDimension() !== "minecraft:askyblock" && isEnabled()) {
            Time.sleep(100);
        }
        Time.sleep(1000);
        continue;
    }


    Time.sleep(2000);
    Chat.say("/is");
    Time.sleep(10000);
    if (!GlobalVars.getBoolean(scriptName)) break;
}


