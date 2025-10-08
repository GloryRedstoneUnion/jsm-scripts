original_block = null
obx = null
oby = null
obz = null


function Goto1(dx,dy,dz,xx = 0.5,yy = 0,zz = 0.5)//dx dy dz坐标xx yy zz偏移量
{
    // if (xx == null) xx == 0.5 Shit
    // if (yy == null) yy == 0.5
    // if (zz == null) zz == 0.5
    gb_tt=Player.getPlayer().getPos()
    Chat.say("#goto "+dx.toString()+" "+dy.toString()+" "+dz.toString())
    while(Math.abs(gb_tt.getX()-dx-xx)>0.4 || Math.abs(gb_tt.getZ()-dz-zz)>0.4 || Math.abs(gb_tt.getY()-dy)>0)
    {
        gb_tt=Player.getPlayer().getPos()
        Time.sleep(50)
    }
    Chat.say("#stop")
    Time.sleep(350)
    Player.getPlayer().setPos(dx+xx,dy,dz+zz)
}

function set_origin(){
    original_block = Player.getPlayer().rayTraceBlock(8,false)
    if (original_block == null || original_block.getZ() != -3751273 || original_block.getY() != 3 || original_block.getId() != "minecraft:smooth_stone"){
        Chat.log("!! 初始方块错误！！")
        stop()
    }
    Chat.say("/cglow block " + original_block.getX() +" 4 -3751273 3")
    obx = original_block.getX()
    oby = original_block.getY()
    obz = original_block.getZ()
    goto_origin()
}

function goto_origin(){
    Goto1(obx, oby + 1, obz, 0.8, 0, 0.5)
}

function stop(){
    Chat.log("==  结  束  ==")
    Chat.log("==  结  束  ==")
    Chat.log("==  结  束  ==")
    null.正在使用报错退出()
}

function look(){
    Chat.say("/clook angles 270 77")
}


function main(){
    set_origin()
}

main()
stop()