// 事件 - 打开界面
// author: Bi_Diu
// 一个一个填的, 可能有点慢

const itemId = "minecraft:iron_nugget";
const targetAmount = [0, 18, 1, 1, 1]; // 空就填0
const delay = 10; // 单位ms 服务器回弹就调高

// 返回当前漏斗槽的物品数量
function getSlotCount(inv, slotIndex) {
    let slot = inv.getSlot(slotIndex);
    if (slot.getItemId() === itemId) {
        return slot.getCount();
    } else {
        return 0;
    }
}

// 检查漏斗内物品是否满足需求
function isFulfilled(inv) {
    for (let i = 0; i < 5; i++) {
        if (getSlotCount(inv, i) !== targetAmount[i]) {
            return false;
        }
    }
    return true;
}

// 将物品拿到鼠标上
function fillSlot(inv, slotIndex) {
    if (inv.getContainerTitle() !== "漏斗") {
        Chat.log("容器被关闭! 中断");
        return false;
    }

    let currentCount = getSlotCount(inv, slotIndex);
    let target = targetAmount[slotIndex];

    if (currentCount === target) {
        return true; // 该槽已满足条件
    }

    // 找背包里对应物品
    let itemSlot = null;
    for (let i = 5; i <= 40; i++) {
        let s = inv.getSlot(i);
        if (s.getItemId() === itemId) {
            itemSlot = i;
            break;
        }
    }

    if (itemSlot === null) {
        Chat.log("未找到足够物品，停止");
        return false;
    }

    // 拿起物品
    inv.click(itemSlot, 0);
    Time.sleep(20);


    // 少了, 放一个
    if (currentCount < target) {
        inv.click(slotIndex, 1);
        Time.sleep(delay); // 服务器回弹就调高
    } else {
        // 多了，拿回来重放
        inv.click(itemSlot, 0);
        //inv.dropSlot(slotIndex, true);
        inv.quick(slotIndex)
        Time.sleep(30);
    }

    return true;
}

function putItemsLoop() {
    let inv = Player.openInventory();
    if (!inv || inv.getContainerTitle() !== "漏斗") {
        Chat.log("漏斗关闭，终止");
        return;
    }

    while (true) {
        if (inv.getContainerTitle() !== "漏斗") {
            Chat.log("容器被关闭，退出");
            break;
        }

        if (isFulfilled(inv)) {
            Chat.log("漏斗已填充完毕");
            break;
        }

        for (let i = 0; i < 5; i++) {
            if (!fillSlot(inv, i)) {
                // 若缺少物品或容器关闭，跳出循环
                return;
            }
        }

        // 循环延迟
        Time.sleep(10);
    }
}

if (World.isWorldLoaded() && Player.openInventory().getContainerTitle() == "漏斗") {
    putItemsLoop();
}