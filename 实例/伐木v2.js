//请限制橡木生长,自行填写saplingPos即泥土位置(变量名懒得改了),手持斧子,副手为树苗,想要树苗不断，就要用水流把树苗推到人身边
var blist;
var player = Player.getInteractionManager()
var targetTree = 'minecraft:oak_log'
var targetLeaves = 'minecraft:oak_leaves'
var inv = Player.openInventory()
// 扫描玩家周围 5 格内的目标树木
var treeList = World.getWorldScanner().withStringBlockFilter().contains(targetTree).build().scanAroundPlayer(5);
var leavesList = World.getWorldScanner().withStringBlockFilter().contains(targetLeaves).build().scanAroundPlayer(5);
var maxtime = 10
const saplingPos = {
    x: 15208,
    y: 71,
    z: -18679
}//写上泥土坐标
while (1) {
    treeList = World.getWorldScanner().withStringBlockFilter().contains(targetTree).build().scanAroundPlayer(5);
    leavesList = World.getWorldScanner().withStringBlockFilter().contains(targetLeaves).build().scanAroundPlayer(5);
    for (let i = 0; i < treeList.size(); i++) {
        let treeX = treeList.get(i).getX()
        let treeY = treeList.get(i).getY()
        let treeZ = treeList.get(i).getZ()
        player.breakBlock(treeX, treeY, treeZ)
    }
    for (let i = 0; i < leavesList.size(); i++) {
        let leavesX = leavesList.get(i).getX()
        let leavesY = leavesList.get(i).getY()
        let leavesZ = leavesList.get(i).getZ()
        player.breakBlock(leavesX, leavesY, leavesZ)
    }
    player.interactBlock(saplingPos.x, saplingPos.y, saplingPos.z, 'up', true, true)
    maxtime = 10; // 重置超时时间
    while (maxtime--) {
        Time.sleep(1000)
        if (World.getBlock(saplingPos.x, saplingPos.y + 1, saplingPos.z).getId() == 'minecraft:oak_log') {
            break
        }
        if (maxtime === 0) { // 超时且未检测到树木生长
            break; // 跳出内层循环
        }
    }
    if (maxtime === 0) { // 超时且未检测到树木生长
        Chat.log('未检测到树木生长, 请检查是否有其他错误');
        break; // 跳出外层循环
    }
}