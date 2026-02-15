Hud.clearDraw3Ds();
// player.attack();

// 强制暂停脚本
var closeKey = "key.keyboard.x";
JsMacros.on("Key", JavaWrapper.methodToJava((e, ctx) => {
        if (e.key == closeKey) {
            Chat.log('脚本关闭了。');
            JavaWrapper.stop();//使用此命令等同于在GUI强制停止脚本中的所有线程
        };
}));



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



// 蛇形遍历并收割
function snakeWalk(startX, startY, startZ, endX, endY, endZ) {
    const player = Player.getPlayer();

    var minX = Math.min(startX, endX);
    var maxX = Math.max(startX, endX);
    var minZ = Math.min(startZ, endZ);
    var maxZ = Math.max(startZ, endZ);

    var forwardX = (endX >= startX); // Determine direction for x
    var forwardZ = (endZ >= startZ); // Determine direction for z

    var x = startX;
    var z = startZ;

    // 获取findCenters函数中的中心坐标列表
    var centers = findCenters([startX, startY, startZ], [endX, endY, endZ]);

    while ((forwardX && x <= endX) || (!forwardX && x >= endX)) {
        // 判断当前坐标是否在center列表中
        if (centers.some(center => center[0] === x && center[2] === z) || x === 234 || x === 245) {
            x += (forwardX ? 1 : -1);
            continue;
        }

        // Output debugging information
        // Chat.log("Processing x: " + x + ", z: " + z); // 种植输出日志debug

        if (forwardZ) {
            for (var zIter = minZ; zIter <= maxZ; zIter++) {
                moveToBlock(x + 0.5, startY + 0.5, zIter + 0.5);
                // Player.getInteractionManager().attack(x, startY, z, 1, false);
                Player.getInteractionManager().attack();
                // player.attack(x, startY, z, 1, false);
                Client.waitTick(FERTILIZE_WAIT_TICKS); // Waiting time after fertilization
            }
        } else {
            for (var zIter = maxZ; zIter >= minZ; zIter--) {
                moveToBlock(x + 0.5, startY + 0.5, zIter + 0.5);
                Player.getInteractionManager().attack();
                // Player.getInteractionManager().attack(x, startY, z, 1, false);
                // player.attack(x, startY, z, 1, false);
                Client.waitTick(FERTILIZE_WAIT_TICKS); // Waiting time after fertilization
            }
        }

        forwardZ = !forwardZ; // Toggle direction for z-axis
        x += (forwardX ? 1 : -1); // Move x in the current direction
    }
}

function findCenters(start, end) {
    const centers = [];
    let x = start[0];
    let z = start[2];
    let stepSize = 5; // 初始步长为5
    let alternateStep = true; // 用于交替步长

    while (x <= end[0] - 2 && z <= end[2] - 2) {
        // 添加当前中心坐标
        centers.push([x + 2, start[1], z + 2]);
        
        // 更新 x 和 z 坐标
        x += stepSize;
        if (x > end[0] - 2) {
            x = start[0];
            z += 5;
        }

        // 交替更新步长
        stepSize = alternateStep ? 6 : 5;
        alternateStep = !alternateStep;
    }
    return centers;
}



const FERTILIZE_WAIT_TICKS = 1; // 点击操作后等待的tick数

//moveToBlock(224.5, 63.5, 366.5); // 目标方块坐标 (224, 63, 366) +-0.5
// 默认的土地起点坐标：(224, 63, 366)
// const start = [224, 63, 366];

// 鼠标左键点击获取起点坐标
const posCon = [];

Chat.log(Chat.createTextBuilder().append("Click on the first block as the starting point").withColor(0x2).build());
const click_event = JsMacros.on("Key", true, JavaWrapper.methodToJava((event, ctx) => {
    if (event.key == "key.mouse.left" && event.action == 1) {
        event.cancel();
        ctx.releaseLock();
        const block = Player.getInteractionManager().getTargetedBlock().toPos3D();
        if (block != null) {
            posCon.push([block.x, block.y, block.z]);
            Chat.log((Chat.createTextBuilder().append(`Block selected at: (${block.x}, ${block.y}, ${block.z})`)).withColor(0x2).build());
            click_event.off();
            // Chat.log((Chat.createTextBuilder().append(`Block pos: [${posCon}]`)).withColor(0x2).build());

            //起点坐标
            const start = [posCon[0][0], posCon[0][1], posCon[0][2]];
            // 终点坐标 (255,63, 400)
            const end = [255,63, 400];
            snakeWalk(start[0], start[1], start[2], end[0], end[1], end[2]); // 遍历并收割
        }
    }
}));


// 2024-8-10 浇水的坐标不点击，防止收菜的时候打掉浇水方块

