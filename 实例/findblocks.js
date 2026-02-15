var scriptname = "findblocks"
const reverse = !GlobalVars.getBoolean(scriptname);
GlobalVars.putBoolean(scriptname, reverse);
if (reverse) {
    Chat.actionbar(Chat.createTextBuilder().append("[").withColor(0x7)
        .append(scriptname).withColor(0x5)
        .append("]").withColor(0x7).append(" enabled").withColor(0xc)
        .build());
} else {
    Chat.actionbar(Chat.createTextBuilder().append("[").withColor(0x7)
        .append(scriptname).withColor(0x5)
        .append("]").withColor(0x7).append(" disabled").withColor(0xc)
        .build());
    Hud.clearDraw3Ds()
}
//===========config=================//
var blocks = ["minecraft:copper_grate","minecraft:copper_bulb"]//方块ids
var distance = 50       //显示距离
var wait = 10           //闪烁&扫描时间间隔
var size = 0.25         //方块大小
var cull = false        //是否会被遮挡(false / true)
//=================================//
//这个可以用来矿透，但我更多用于建筑时候查看光源方块和屏障的位置

var player = Player.getPlayer()
var color = 6749952
while (GlobalVars.getBoolean(scriptname)) {
    if(color == 6749952){
        color = 16711935
    }else{
        color = 6749952
    }
var blist = World.findBlocksMatching(blocks, 8)
Hud.clearDraw3Ds()
for(let i = 0;i < blist.size();i++){
    if(player.distanceTo(blist[i].getX(), blist[i].getY(), blist[i].getZ()) < distance)
    Hud.createDraw3D().register().addBox(blist[i].getX()+0.5*(1-size), blist[i].getY()+0.5*(1-size), blist[i].getZ()+0.5*(1-size), blist[i].getX()+0.5+size*0.5, blist[i].getY()+0.5+size*0.5, blist[i].getZ()+0.5+size*0.5, color, 255, color, 16, true, cull)
    //Hud.createDraw3D().register().addTraceLine(blist[i].getX()+0.5, blist[i].getY()+0.5, blist[i].getZ()+0.5, 6749952)
    //跟踪线
}
Client.waitTick(wait)
Hud.clearDraw3Ds()
}