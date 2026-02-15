// 群友Mity需要的, 花了25大洋写的, 经本人同意发群里分享
// Bi_Diu
// 请勿倒卖
// 附魔部分好多都是我新手时期写的() 可能很烂, 不过写这个的时候已经改了一下了
// 还有很多代码来自群里大佬, 感谢大佬们的实例!
// 顺带一提 我不接单了() 写这个有点费劲

const scriptname = "往返经验池刷附魔等级";
const enabled = GlobalVars.toggleBoolean(scriptname);

const level = 35;
const backLevel = 30;
const item = "minecraft:golden_sword";
const enchant = 3;

// 填写你的 附魔台 砂轮 装着青金石的箱子 的位置
const enchPos = [-1016, 92, 3582];
const grindPos = [-1015, 93, 3584];
const chestPos = [-1018, 93, 3582];



if (enabled) {
    Chat.log(Chat.createTextBuilder().append("[").withColor(0x7).append(scriptname).withColor(0x9).append("]").withColor(0x7).append(" Enabled").withColor(0x2).build());
} else {
    Chat.log(Chat.createTextBuilder().append("[").withColor(0x7).append(scriptname).withColor(0x9).append("]").withColor(0x7).append(" Disabled").withColor(0x4).build());
}

// 靠坐标检测在经验池还是在家
function atXpPool() {
    if (Player.getPlayer().distanceTo(50091, 63, -50037) <= 25) {
        return true;
    } else {
        return false;
    }
}

function atHome() {
    if (Player.getPlayer().distanceTo(-1013, 92, 3582) <= 15) {
        return true;
    } else {
        return false;
    }
}

function waitUntilOpen() {
    let totaltime = 0; // 防止一直卡在这里
    while (Player.openInventory().getContainerTitle() === "合成" && totaltime <= 7000) {
        Time.sleep(20);
        totaltime = totaltime + 20;
    }
}

function enchantSlot(slot) {
    let inv = Player.openInventory();
    while (inv.getSlot(0).getItemId() !== "minecraft:air" && inv.getType() !== "Enchanting Table") {
        Time.sleep(10);
        inv = Player.openInventory();
    }

    inv = Player.openInventory();
    if (inv.getType() !== "Enchanting Table") return;
    if (Player.openInventory().getSlot(1).getItemId() === "minecraft:air") {
        inv.quick(inv.findItem("minecraft:lapis_lazuli")[0]);
        Chat.log("补放青金石");
    }
    inv.quick(slot);

    if (Player.getPlayer().getXPLevel() < backLevel) return;
    let levels = Player.openInventory().getRequiredLevels();

    inv = Player.openInventory();
    if (inv.findFreeInventorySlot() == -1) return
    Time.sleep(10);

    for (let j = enchant - 1; j <= 2; j++) {
        if (levels[j] <= Player.getPlayer().getXPLevel() && levels[j] != -1) {
            inv.doEnchant(j);
            Time.sleep(10);
            break;
        }
        Client.waitTick(1);
    }

    while (!inv.getSlot(0).isEnchanted() && inv.getType() == "Enchanting Table" && inv.getSlot(0).getItemId() != "minecraft:enchanted_book") {
        Time.sleep(10);
        for (let k = enchant - 1; k <= 2; k++) {
            if (levels[k] <= Player.getPlayer().getXPLevel() && levels[k] != -1) {
                inv.doEnchant(k);
                Time.sleep(10);
                break;
            }
            Client.waitTick(1);
        }

        Client.waitTick(1);
        inv = Player.openInventory();
    }
    inv.quick(0);
    while (inv.getSlot(0).getItemId() != "minecraft:air" && inv.getType() == "Enchanting Table") {
        Time.sleep(5);
        inv = Player.openInventory();
    }

    return;
}

function takeLapis() {
    let lapisCount = 0;
    Player.getPlayer().tryLookAt(chestPos[0], chestPos[1], chestPos[2]);
    Client.waitTick(2);
    Player.getInteractionManager().interactBlock(chestPos[0], chestPos[1], chestPos[2], Player.getPlayer().getFacingDirection().getName(), false);
    waitUntilOpen();
    Client.waitTick(5);
    for (let i = 0; i < Player.openInventory().getTotalSlots(); i++) {
        if (lapisCount >= 9) return;
        let slot = Player.openInventory().getSlot(i);
        if (slot.getItemId() === "minecraft:lapis_lazuli") {
            Player.openInventory().quick(i);
            lapisCount++;
            Time.sleep(10);
        }
    }
    Client.waitTick(1);
    Player.openInventory().close();
    Client.waitTick(1);
}

function beginGrind() {
    let inv = Player.openInventory();
    let player = Player.getPlayer();
    inv.close();
    Client.waitTick(2);
    Player.getPlayer().tryLookAt(grindPos[0], grindPos[1], grindPos[2]);
    Client.waitTick(2);
    Player.getInteractionManager().interactBlock(grindPos[0], grindPos[1], grindPos[2], player.getFacingDirection().getName(), false);
    waitUntilOpen();
    inv = Player.openInventory();
    grind();
    inv.close();
}

function grind() {
    waitUntilOpen();
    Client.waitTick(5);
    let inv = Player.openInventory();
    for (let i = 38; i >= 3; i--) {
        let slot = inv.getSlot(i);
        if (slot.getItemId() !== item && slot.isEnchanted()) {
            Chat.log("警报! 差点祛魔你装备");
            continue;
        }
        if (slot.isEnchanted()) {
            // 进行祛魔
            inv.quick(i);
            inv.quick(2);
            //Time.sleep(100);
            while (inv.getSlot(0).getItemId() !== "minecraft:air" && inv.getSlot(1).getItemId() !== "minecraft:air") {
                Time.sleep(20);
            }
            Time.sleep(100);
        }
    }
}

function main() {
    let player = Player.getPlayer();
    let inv = Player.openInventory();
    Client.waitTick(1);
    if (!World.isWorldLoaded()) return;
    if (Player.getPlayer() == null) return;
    if (Player.openInventory() == null) return;


    player.tryLookAt(enchPos[0], enchPos[1], enchPos[2]);
    Client.waitTick(2);
    Player.getInteractionManager().interactBlock(enchPos[0], enchPos[1], enchPos[2], player.getFacingDirection().getName(), false);

    waitUntilOpen();
    Client.waitTick(1);
    inv = Player.openInventory();

    if (inv.getType() != "Enchanting Table") return;
    Client.waitTick(1);

    let haveEnchItem = false;
    for (let i = 2; i <= 37; i++) {
        let slot = inv.getSlot(i);
        if (slot.getItemId() !== item) continue;
        if (slot.getItemId() === item && slot.isEnchanted()) continue;
        haveEnchItem = true;
        if ((slot.isEnchantable() && !slot.isEnchanted())) {
            inv = Player.openInventory();
            for (let i = 0; i < inv.getTotalSlots(); i++) {
                if (i === 1 && inv.getSlot(i).getCount() >= 5) break;
                if (i === 1) continue;
                if (inv.getSlot(i).getCount() <= 5) continue;
                if (inv.getSlot(i).getItemId() === "minecraft:lapis_lazuli") {
                    Client.waitTick(1);
                    inv.quick(i);
                    break;
                }
            }

            Client.waitTick(1);
            let existLapis = false
            for (let i = 0; i <= inv.getTotalSlots() - 1; i++) {
                if (inv.getSlot(i).getCount() <= 5) continue;
                if (inv.getSlot(i).getItemId() === "minecraft:lapis_lazuli") {
                    existLapis = true;
                    // Chat.log("true");
                    break;
                }
            }
            if (!existLapis) {
                Chat.actionbar("青金石不够");
                inv.close();
                Client.waitTick(20);
                takeLapis();
                Client.waitTick(20);
                inv = Player.openInventory();
                return;
            }

            if (player.getXPLevel() < backLevel) {
                Chat.log("经验不足! 去经验池");
                Chat.say("/home jy");
                while (!Chat.getHistory().getRecvLine(0).getText().getString().includes("领地主人")) {
                    Time.sleep(10);
                }
                Client.waitTick(20);
                break;
            }

            enchantSlot(i);

            inv = Player.openInventory();
            if (inv.getType() != "Enchanting Table") {
                // Chat.log("return, inv closed; t = " + t)
                Client.waitTick(5);
                return;
            }
        }
    }
    if (haveEnchItem == false) {
        inv.close();
        beginGrind();
        Client.waitTick(3);
        t = 0;
        return;
    }
}


while (GlobalVars.getBoolean(scriptname)) {
    while (!World.isWorldLoaded()) {
        Client.waitTick(5);
    }
    if (atXpPool()) {
        if (Player.getPlayer().getXPLevel() < level) {
            Client.waitTick(20);
            continue;
        } else {
            Chat.say("/home fm");
            // 等到传回领地
            while (!Chat.getHistory().getRecvLine(0).getText().getString().includes("领地主人")) {
                Time.sleep(10);
            }
            Client.waitTick(20);
            continue;
        }
    }

    if (atHome()) {
        main();
        Client.waitTick(1);
    }
    Client.waitTick(5);
}