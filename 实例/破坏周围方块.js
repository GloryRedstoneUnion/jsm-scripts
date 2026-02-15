const scriptname = "breakblocks"
const reverse = !GlobalVars.getBoolean(scriptname);
GlobalVars.putBoolean(scriptname, reverse);
if (reverse) {
    Chat.actionbar(`${scriptname}启动`);
} else {
    Chat.actionbar(`${scriptname}关闭`);
}
//===========config=================//
const blocks = ["minecraft:soul_sand","minecraft:soul_soil"]//方块ids
const distance = 5.0
const legal = false
//=================================//
const player = Player.getPlayer()
while (GlobalVars.getBoolean(scriptname)) {
    const blist = World.findBlocksMatching(blocks, 2)
    let count = 0
    for(let i = 0;i < blist.size();i++){
        if(player.distanceTo(blist[i].getX(), blist[i].getY(), blist[i].getZ()) < distance){
            count++
            if(player.distanceTo(blist[i].getX(), blist[i].getY(), blist[i].getZ()) < distance)
            Player.getInteractionManager().attack(blist[i].getX(), blist[i].getY(), blist[i].getZ(), 0, legal)
        }
    }
    Chat.actionbar(count)
}