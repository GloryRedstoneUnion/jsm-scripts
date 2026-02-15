

/*
2024-08-10 对速度进行了优化，现在遍历完一片田只需要不到一半的时间
2024-08-12 增加了自动补货功能。去除了依赖于inv...mod的自动补货功能。这一改动主要是为了避免在快速进行种植操作时，
来自inv的补货指令频繁而导致的冲突。

*/



Hud.clearDraw3Ds();
// 强制暂停脚本
var closeKey = "key.keyboard.x";
JsMacros.on("Key", JavaWrapper.methodToJava((e, ctx) => {
    if (e.key == closeKey) {
        Chat.log('脚本关闭了。');
        JavaWrapper.stop();//使用此命令等同于在GUI强制停止脚本中的所有线程
    };
}));

// 饿了吃饭
function eat() {
    const player = Player.getPlayer();
    foodLevel = player.getFoodLevel();
    if (foodLevel >= 20) {
        return;
    }

    if (foodLevel < 20) {
        Chat.log(`foodLevel is ${foodLevel} now, eating~`);
        KeyBind.key('key.mouse.right', true);
        Client.waitTick(66);
        KeyBind.key('key.mouse.right', false);
        return;
    }
}


function transferItemsToChest(chestPos, itemsToTransfer) {
    const player = Player.getPlayer();
    Client.waitTick(1);
    moveToBlock(chestPos[0] + 0.5, chestPos[1] + 0.5, chestPos[2] + 0.5);
    Player.getInteractionManager().interactBlock(chestPos[0], chestPos[1], chestPos[2], player.getFacingDirection().getName(), false);

    while (!Hud.isContainer) {
        Client.waitTick();
    }
    Client.waitTick(5);

    const inv = Player.openInventory();
    const mainStartIndex = inv.getMap().main?.at(0);
    const chestEndIndex = mainStartIndex;

    let emptySlots = 0;
    for (let i = 0; i < chestEndIndex; i++) {
        if (inv.getSlot(i).getItemId() == "minecraft:air") {
            emptySlots++;
        }
    }

    let itemSlots = [];
    for (let i = mainStartIndex; i < mainStartIndex + 36; i++) {
        if (itemsToTransfer.includes(inv.getSlot(i).getItemId())) {
            itemSlots.push(i);
        }
    }

    while (emptySlots > 0 && itemSlots.length > 0) {
        inv.quick(itemSlots.pop());
        Client.waitTick();
        emptySlots--;
    }

    Client.waitTick(20);
    inv.closeAndDrop();
    Client.waitTick(20);
}

// Function to check inventory and refill item, including walking to a designated chest if needed
function checkAndRefillItem(chestPos) {
    const player = Player.getPlayer();
    const inv = Player.openInventory();
    const mainHandItem = player.getMainHand();
    const mainHandItemId = "minecraft:paper";

    if (mainHandItem.getCount() <= REFILL_THRESHOLD) {
        Chat.log(`Item count is low. Attempting to refill item with ID: ${mainHandItemId}`); // Debug log

        // Check for the item in the inventory
        const itemSlots = inv.findItem(mainHandItemId);

        // Look for slots with sufficient quantity or slots below the threshold
        let lowSlots = [];
        let selectedSlot = -1;
        for (const slot of itemSlots) {
            const slotItemCount = inv.getSlot(slot).getCount();
            if (slotItemCount > REFILL_THRESHOLD) {
                selectedSlot = slot;
            } else if (slotItemCount > 0 && slotItemCount <= REFILL_THRESHOLD) {
                lowSlots.push(slot);
            }
        }

        // If any slots have items below the threshold, include them in the refill process
        let emptySlots = lowSlots.length;

        // Count actual empty slots in the player's inventory
        const maxSlots = 36; // Number of slots in the player's main inventory
        for (let i = 0; i < maxSlots; i++) {
            if (inv.getSlot(i).getItemId() == "minecraft:air") {
                emptySlots++;
            }
        }

        if (selectedSlot !== -1) {
            Chat.log(`Found item slot with sufficient quantity: ${selectedSlot}`); // Debug log
            inv.swapHotbar(selectedSlot, inv.getSelectedHotbarSlotIndex());
            Client.waitTick(REFILL_WAIT_TICKS); // Wait for the swap to complete
        } else {
            Chat.log(Chat.createTextBuilder().append("Warning:").withColor(255, 0, 0)
                .append(`${mainHandItemId} is exhausted in inventory, moving to chest for replenishment.`).withColor(255, 128, 128).build());

            // Walk to the chest and restock the item
            moveToBlock(chestPos[0] + 0.5, chestPos[1]+ 0.5, chestPos[2]+ 0.5);
            Player.getInteractionManager().interactBlock(chestPos[0], chestPos[1], chestPos[2], player.getFacingDirection().getName(), false);

            // Wait for the chest interface to open
            while (!Hud.isContainer()) {
                Client.waitTick();
            }
            Client.waitTick(5);

            // Open inventory and look for the item in the chest
            const chestInv = Player.openInventory();
            const chestSlots = chestInv.findItem(mainHandItemId);

            if (chestSlots.length > 0) {
                let transferred = 0;
                for (const chestSlot of chestSlots) {
                    if (chestInv.getSlot(chestSlot).getCount() > 0) {
                        const itemCount = chestInv.getSlot(chestSlot).getCount();
                        const stackSize = 64; // Maximum stack size
                        const amountToTransfer = Math.min(emptySlots * stackSize, itemCount);

                        for (let i = 0; i < Math.ceil(amountToTransfer / stackSize); i++) {
                            chestInv.quick(chestSlot);
                            Client.waitTick();
                        }

                        emptySlots -= Math.ceil(amountToTransfer / stackSize);
                        transferred += amountToTransfer;

                        if (emptySlots <= 0) {
                            break;
                        }
                    }
                }

                if (transferred > 0) {
                    Chat.log(`Transferred ${transferred} items from the chest to the inventory.`);

                    // Ensure item is equipped in the main hand after restocking
                    const postChestInv = Player.openInventory();
                    const postChestItemSlots = postChestInv.findItem(mainHandItemId);
                    let postChestSelectedSlot = -1;
                    for (const slot of postChestItemSlots) {
                        const postChestSlotItemCount = postChestInv.getSlot(slot).getCount();
                        if (postChestSlotItemCount > REFILL_THRESHOLD) {
                            postChestSelectedSlot = slot;
                            break;
                        }
                    }

                    if (postChestSelectedSlot !== -1) {
                        postChestInv.swapHotbar(postChestSelectedSlot, postChestInv.getSelectedHotbarSlotIndex());
                        Client.waitTick(REFILL_WAIT_TICKS); // Wait for the swap to complete
                    } else {
                        Chat.log("Error: Could not find item in inventory after chest restock.");
                    }
                } else {
                    Chat.log(Chat.createTextBuilder().append("Error:").withColor(255, 0, 0)
                        .append(`No more ${mainHandItemId} in the chest.`).withColor(255, 128, 128).build());
                }
            } else {
                Chat.log(Chat.createTextBuilder().append("Error:").withColor(255, 0, 0)
                    .append(`No ${mainHandItemId} found in the chest.`).withColor(255, 128, 128).build());
            }

            chestInv.closeAndDrop();
            Client.waitTick();
        }
    }
}

function moveToBlock(x, y, z) {
    const player = Player.getPlayer();
    var targetX = x;
    var targetY = y;
    var targetZ = z;

    var currentX = player.getX();
    var currentY = player.getY();
    var currentZ = player.getZ();

    var dx = targetX - currentX;
    var dz = targetZ - currentZ;

    player.lookAt(targetX, targetY, targetZ);

    dx = targetX - currentX;
    dz = targetZ - currentZ;
    var distance = Math.sqrt(dx * dx + dz * dz);

    while (distance > 3) {
        player.lookAt(targetX, targetY, targetZ);

        currentX = player.getX();
        currentY = player.getY();
        currentZ = player.getZ();
        dx = targetX - currentX;
        dz = targetZ - currentZ;
        distance = Math.sqrt(dx * dx + dz * dz);
        KeyBind.keyBind("key.forward", true);
        KeyBind.keyBind("key.sprint", true); // 冲刺
        Client.waitTick(1);
    }
    KeyBind.keyBind("key.forward", false);
}

function snakeWalk(startPos, endPos, chestPos) {
    const startX = startPos[0];
    const endX = endPos[0];
    const startZ = startPos[2];
    const endZ = endPos[2];

    // 确定x方向的遍历顺序
    const xStep = Math.sign(endX - startX);
    const zStepInitial = Math.sign(endZ - startZ);

    let currentX = startX;
    let group = 0;
    let stepSize = 5;

    while ((xStep > 0 && currentX <= endX) || (xStep < 0 && currentX >= endX)) {
        const middleX = currentX + xStep * Math.floor(5 / 2); // Fixed group size of 5

        // 确定z方向的遍历顺序
        const zStart = (group % 2 === 0) ? startZ : endZ;
        const zEnd = (zStart === startZ) ? endZ : startZ;
        const zStep = (zStart === startZ) ? zStepInitial : -zStepInitial;

        for (let z = zStart; (zStep > 0 && z <= zEnd) || (zStep < 0 && z >= zEnd); z += zStep) {
            for (let localX = currentX;
                (xStep > 0 && localX < currentX + 5 * xStep && localX <= endX) ||
                (xStep < 0 && localX > currentX + 5 * xStep && localX >= endX);
                localX += xStep) {
                moveToBlock(localX + 0.5, startPos[1] + 0.5, z + 0.5);

                checkAndRefillItem(chestPos);

                Player.getInteractionManager().interactBlock(localX, startPos[1], z, 1, false);
                Client.waitTick(1);
            }
        }


        currentX += stepSize * xStep;
        group++;
    }
}

// 物品数量预设值
const REFILL_THRESHOLD = 6; // 物品还剩 个时，补货
const REFILL_WAIT_TICKS = 6; // 补货操作后等待的tick数
const FERTILIZE_WAIT_TICKS = 1; // 施肥操作后等待的tick数


// 鼠标左键点击获取坐标
const posCon = [];

Chat.log(Chat.createTextBuilder().append("Click on the first block to set chest3 position").withColor(0x2).build());

const click_event = JsMacros.on("Key", true, JavaWrapper.methodToJava((event, ctx) => {
    if (event.key == "key.mouse.left" && event.action == 1) {
        event.cancel();
        ctx.releaseLock();
        const block = Player.getInteractionManager().getTargetedBlock().toPos3D();
        if (block != null) {
            if (posCon.length === 0) {
                Chat.log(Chat.createTextBuilder().append(`Chest3 position set to: (${block.x}, ${block.y}, ${block.z})`).withColor(0x2).build());
                Chat.log(Chat.createTextBuilder().append("Now click on the second block as the starting point").withColor(0x2).build());
                posCon.push([block.x, block.y, block.z]);
            } else if (posCon.length === 1) {
                Chat.log(Chat.createTextBuilder().append(`Starting point set to: (${block.x}, ${block.y}, ${block.z})`).withColor(0x2).build());
                posCon.push([block.x, block.y, block.z]);
                click_event.off();

                // 任务相关方块坐标
                const start = posCon[1];
                const end = [276, 56, 329];
                const chest1 = [220, 55, 397];
                const chest2 = [221, 55, 397];
                const chest3 = posCon[0];
                const chest1_1 = [220, 58, 398]; // 在这个箱子清空背包的 培养土
                const chest2_1 = [222, 58, 399]; // 在这个箱子清空背包的 肥料
                const itemsToTransfer = ["minecraft:paper", "minecraft:apple", "minecraft:bread"];

                snakeWalk(start, end, chest1); // 培养土
                transferItemsToChest(chest1_1, itemsToTransfer); // 种完一圈后将剩余的 土 放入箱子
                checkAndRefillItem(chest2); // 清空背包后直接补货
                // TODO副手拿着吃的 右键有时候会冲突，eat()还得优化
                eat();// 饿了吃饭
                Client.waitTick(6);

                snakeWalk(start, end, chest2); // 施肥 
                transferItemsToChest(chest2_1, itemsToTransfer) // 种完一圈后将剩余的 肥料 放入箱子
                checkAndRefillItem(chest3);
                eat();// 饿了吃饭
                Client.waitTick(6);

                snakeWalk(start, end, chest3); // 种植
                transferItemsToChest(chest3, itemsToTransfer); // 种完一圈后将剩余的 种子 放入箱子
                eat();// 饿了吃饭
            }
        }
    }
}));


