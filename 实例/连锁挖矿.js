const scriptname = "Ultimine"
//用法：按键宏 '`' 反单引号/重音符号 按下触发

const illegal = true //是否超距破坏

function main(){
    if(Player.getPlayer() == null || !World.isWorldLoaded()) { return }
    var TargetBlock = new Map()
    var Processing = false

    const Render = JsMacros.on("Tick", JavaWrapper.methodToJava(event => {
        
        let target = Player.getPlayer().rayTraceBlock(Player.getReach(), false)
        let RenderList = []
        let blocks = []
        if(target != null && target?.getId() !== "minecraft:air"){
            blocks = bfsSearchConnectedBlocks(target.getBlockPos(), target.getId(), 256)
            Chat.actionbar(`§f连锁§a${blocks.length}§f个方块§b[${target?.getName().getString()}]`)
            
            blocks.forEach(blockPos => {
                let box = addBox()
                box.setPos(blockPos.getX()-0, blockPos.getY()-0, blockPos.getZ()-0, blockPos.getX()+1, blockPos.getY()+1, blockPos.getZ()+1)
                box.setFillColor(rgb2int(255, 255, 255), Math.floor(( Math.sin(World.getTime()*0.5)+1)*2 ))
                box.setColor(rgb2int(80, 255, 255), 255)
                
                RenderList.push(box)
            })
            Hud.clearDraw3Ds()
            RenderList.forEach(box=>{
                Hud.createDraw3D().register().addBox(box)
            })
            RenderList = []
        }else{
            Hud.clearDraw3Ds()
            Chat.actionbar(`§f连锁§a0§f个方块`)
        }
    }))

    const Break = JsMacros.on("AttackBlock", JavaWrapper.methodToJava(event => {

        if(Processing) { return } // || event.block.getId() !== "minecraft:air"
        Processing = true
        let pos = event.block.getBlockPos()
        let target = TargetBlock.get(pos.toString())
        let id = target?.getId()
        let blocks = bfsSearchConnectedBlocks(pos, id, 256)
        if(Player.getGameMode() === "creative"){
            blocks.forEach(blockPos => {
                if(canBreak(blockPos) || illegal){ Player.getInteractionManager().attack(blockPos.getX(), blockPos.getY(), blockPos.getZ(), "up") }
            })
        }else{
            Player.getInteractionManager().breakBlock(pos)
            blocks.forEach(blockPos => {
                if(canBreak(blockPos) || illegal){ Player.getInteractionManager().breakBlock(blockPos) }
            })
        }
        
        Client.waitTick(2)//防止自己触发自己（虽然问题不大
        Processing = false
    }))

    const Record = JsMacros.on("Key", JavaWrapper.methodToJava(event => {
        if(event.key === "key.mouse.left" && event.action === 1){
            let target = Player.getPlayer().rayTraceBlock(Player.getReach(), false)
            if(target != null && target?.getId() !== "minecraft:air"){
                TargetBlock.set(target.getBlockPos().toString(), target)
            }
        }
    }))

    const Close = JsMacros.on("Key", JavaWrapper.methodToJava(event => {
        if(event.key === "key.keyboard.grave.accent" && event.action === 0){
            Hud.clearDraw3Ds()
            Chat.actionbar("")
            Render.off()
            Break.off()
            Record.off()
            Close.off()
        }
    }))

}

const Directions = [
    [-1, -1, -1], [0, -1, -1], [1, -1, -1],
    [-1,  0, -1], [0,  0, -1], [1,  0, -1],
    [-1,  1, -1], [0,  1, -1], [1,  1, -1],
    
    [-1, -1,  0], [0, -1,  0], [1, -1,  0],
    [-1,  0,  0],              [1,  0,  0],
    [-1,  1,  0], [0,  1,  0], [1,  1,  0],

    [-1, -1,  1], [0, -1,  1], [1, -1,  1],
    [-1,  0,  1], [0,  0,  1], [1,  0,  1],
    [-1,  1,  1], [0,  1,  1], [1,  1,  1],
];

/**
 * BFS 搜索同种方块（切比雪夫距离=1，相邻26格），最大数量为 limit
 * @param {BlockPos} startPos - 起点方块位置
 * @param {string} targetId - 目标方块的 ID（如 "minecraft:stone"）
 * @param {int} limit - 最多搜索多少个方块（默认 256）
 * @return {BlockPos[]} - 满足条件的方块位置列表
 */
function bfsSearchConnectedBlocks(startPos, targetId, limit = 256) {
    const visited = new Set();
    const queue = [];
    const result = [];

    const toKey = (pos) => pos.toString();
    visited.add(toKey(startPos));
    queue.push(startPos);
    result.push(startPos);

    while (queue.length > 0 && result.length < limit) {
        const current = queue.shift();
        for (const [dx, dy, dz] of Directions) {
            const neighbor = addBlockPos(current, PositionCommon.createPos(dx,dy,dz))
            const key = neighbor.toString()
            if (visited.has(key)) continue;
            visited.add(key);

            const block = World.getBlock(neighbor);
            const id = block.getId()

            if (id === targetId) {
                queue.push(neighbor);
                result.push(neighbor);

                if (result.length >= limit) break;
            }
        }
    }

    return result;
}
function addBlockPos(blockPos, pos3D){
    return blockPos.toPos3D().add(pos3D).toBlockPos()
}


const Box = Java.type("xyz.wagyourtail.jsmacros.client.api.classes.render.components3d.Box")
function addBox(){
    return new Box(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0, true, false);
    //                x     y     z         x    y    z     line face fill cull
}

function rgb2int(r, g, b) {
    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) 
        throw new Error("RGB values must be in the range 0-255");
    return (r << 16) | (g << 8) | b;
}
function canBreak(blockPos){
    return Player.getReach()+1.7 >= blockPos.distanceTo(Player.getPlayer().getEyePos())
}
function distance3D(pos1, pos2){
    
    return Math.sqrt((x2-x1)*(x2-x1)+(z2-z1)*(z2-z1))
}

main()