original_block = null
obx = null
oby = null
obz = null


function must_is_null(){
    return Player.rayTraceBlock(8,false)==null && Player.rayTraceBlock(8,false)==null && Player.rayTraceBlock(8,false)==null && Player.rayTraceBlock(8,false)==null && Player.rayTraceBlock(8,false)==null && Player.rayTraceBlock(8,false)==null && Player.rayTraceBlock(8,false)==null && Player.rayTraceBlock(8,false)==null && Player.rayTraceBlock(8,false)==null && Player.rayTraceBlock(8,false)==null
}

function maybe_is(id){
    function a(){
        try {
            return Player.rayTraceBlock(8,false) == null ? 0 : Player.rayTraceBlock(8,false).getId()==id
        } catch (error) {
            return 0
        }
    }
    return a() || a() || a() || a() || a() || a() || a() || a() || a() || a() || a() || a() || a() || a() || a() || a() || a() || a() || a() || a() || a() || a() || a() || a() || a() || a() || a() || a() || a() || a()
}

function show_tips(){
    Chat.log("放墙脚本开始工作")
    Chat.log("脚本不要求快捷栏顺序，出现意外立刻选择空快捷栏即可")
    Time.sleep(1000)
}


function Goto1(dx,dy,dz,xx = 0.5,yy = 0,zz = 0.5)//dx dy dz坐标xx yy zz偏移量
{
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

function goto_for_place_block(delta_z = 0) {Goto1(obx, oby + 1, obz + delta_z, 0.8, 0, 0.5)}

function pb_make() {Chat.say("!!pb make 放墙脚本自动备份")}

function goto_origin() {goto_for_place_block()}

function stop(){
    Chat.log("==  结  束  ==")
    Chat.log("==  结  束  ==")
    Chat.log("==  结  束  ==")
    null.正在使用报错退出()
}

function look() {Chat.say("/clook angles 270 77")}

function is_end() {return maybe_is("minecraft:purple_stained_glass")}

// 0 normal 1 already 2 stop
function check(count){
    count ++
    if(count > 20) return 1
    //if(count > 20) return 2
    b = Player.getPlayer().rayTraceBlock(8, false)
    if (b == null) check(count)
    Chat.log(b.getId())
    if (b.getId() == "minecraft:magma_block") return 0
    if (b.getId() == "minecraft:purple_stained_glass") return 1
    if (b.getId() != "minecraft:nether_portal" && b.getY() != 0) return 2
    return 1
}

function place_action(){
    chk = check()
    Chat.log(chk)
    if (chk == 0){
        KeyBind.keyBind("key.use",true)
        KeyBind.keyBind("key.use",false)
        return chk
    }
    if (chk == 1){
        return chk
    }
    if (chk == 2){
        stop()
        return chk
    }
}

function single_place_loop(delta_z = 0){
    goto_for_place_block(delta_z)
    look()
    Time.sleep(200)
    place_action()
    Time.sleep(200)
    return is_end() ? 0 : single_place_loop(delta_z + 1)
}

function move(){
    Chat.say("/clook angles 90.0 46.41")
    KeyBind.keyBind("key.use",true)
    KeyBind.keyBind("key.use",false)
    Time.sleep(700)
    KeyBind.keyBind("key.use",true)
    KeyBind.keyBind("key.use",false)
    Time.sleep(700)
    KeyBind.keyBind("key.use",true)
    KeyBind.keyBind("key.use",false)
    Time.sleep(700)
}

function main(){
    show_tips()
    set_origin()
    while(1) {
        single_place_loop()
        pb_make()
        Time.sleep(20000)
        goto_origin()
        Time.sleep(500)
        move()
    }
}

main()
stop()