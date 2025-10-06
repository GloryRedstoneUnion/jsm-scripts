bypass_confirm = 1
breaker_name = "bot_breaker"

original_block = null
obx = null
oby = null
obz = null

pause_mode = 0

//TODO: 第一行release时记得改

function self_description(){
    function alpha_warn(){
        Chat.log("WARNING:THIS IS A ALPHA VERSION!!")
        Chat.log("WARNING:THIS IS A ALPHA VERSION!!")
        Chat.log("WARNING:THIS IS A ALPHA VERSION!!")
        Time.sleep(1000)
    }

    Chat.log("Tip:Log Format:##[INFO]  @@[WARN]  !![ERROR]")
    
    alpha_warn()
    Chat.log("###########################################")
    Chat.log("Auto Cut Cut Boom Version 4 - Left Side")
    Chat.log("(Fork from V3Rev1, made by _XuanMing_, contributed by frsFallingSand)")
    Chat.log("[Build id 1 - Date 2025/10/04]")
    Time.sleep(1000)
}


//lock chain:execute in minecraft:the_nether run tp @s 3754396.32 4.00 -3751108.29 -2919.10 65.53

function warn(){
    delay = 1
    if (bypass_confirm){
        delay = 0
    }
    delay_ms = delay * 1000

    Chat.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
    Chat.log("@@  ⚠️警告⚠️")
    Chat.log("@@  请务必认真阅读以下文字至少一次")
    Time.sleep(delay_ms)
    Chat.log("@@ 0.第一次使用前必须在完全相同的镜像环境中测试！")
    Time.sleep(delay_ms)
    Chat.log("@@ 1.务必确保当前状态完全符合所选模式的状态要求，否则将不可避免地碎门")
    Time.sleep(delay_ms)
    Chat.log("@@ 2.确保已安装mod:clientcommand、baritone、double_hotbar")
    Time.sleep(delay_ms)
    Chat.log("@@ 3.切门前后请备份！切门千万条，备份第一条。pb忘记make，群友两行泪！")
    Time.sleep(delay_ms)
    Chat.log("@@ 4.必须启用自动补货、白名单挖掘限制（允许且最好只允许lever,obsidian）")
    Time.sleep(delay_ms)
    Chat.log("@@ 5.名为bot_breaker的假人主手中应有稿子，如欲更改请更改脚本第二行变量")
    Time.sleep(delay_ms)
    Chat.log("@@ 6.携带足够的黑曜石、确保饱食度足够，脚本不会进行这方面的检测！")
    Chat.log("@@ 6.以及，脚本只会基本地检测地狱门是否成功生成、链子有无熄灭")
    Time.sleep(delay_ms)
    Chat.log("@@ 7.为了安全，本脚本支持并建议启动伪潜行、装备鞘翅")
    Time.sleep(delay_ms)
    Chat.log("@@ 8.物品栏顺序:(1-6)稿子,黑曜石,点火装置,海龟蛋,岩浆块,拉杆")
    Chat.log("@@ 8.物品栏顺序:(倒数第二列3-6)粘液块,红石块,活塞,粘性活塞")
    Time.sleep(delay_ms)
    Chat.log("@@ 9.请在支链最远端最后一个顶黑曜石的右下一格放置一个熔炉以定位")
    Time.sleep(delay_ms)
    Chat.log("@@ 10.使用脚本时需确保外在环境安全！！同时双手离开键盘鼠标除非脚本已暂停")
    Chat.log("@@ 在2s内跳跃两次以确认我已阅读并且使用此脚本产生的全部责任均由您承担")
    if(!bypass_confirm) Chat.log("@@ 如您想跳过确认与延迟 请将脚本第一行的“0”修改为“1”")
    //Chat.log(Client.getLoadedMods())
    if (!bypass_confirm && jump_count(40) < 2) exit()
    Chat.log("@@ 您已同意！")
    Chat.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
}



function check_mod(){
    baritone = Client.getMod("baritone")
    dh = Client.getMod("double_hotbar")
    tweakeroo = Client.getMod("tweakeroo")
    cc = Client.getMod("clientcommands")
    if (baritone && dh && tweakeroo && cc) return
    print("!! 模组未完全安装")
    stop()
}


function stop(){
    Chat.log("==  结  束  ==")
    Chat.log("==  结  束  ==")
    Chat.log("==  结  束  ==")
    null.正在使用报错退出()
}


function is_jump(){
    //return Player.getPlayer().input.jumping
    return Player.getCurrentPlayerInput().jumping
}

// 获取一定tick内（以tick为单位）跳跃了多少次
function jump_count(tick){
    // while (1){
        // Chat.log(is_jump())
        // Time.sleep(50)
    // }
    jumped = 0
    jumped_count = 0
    ms = tick * 50
    while(ms > 0){
        if (is_jump() && !jumped) {
            jumped = 1
            jumped_count ++
        }
        if (!is_jump()) {
            jumped = 0
        }
        Time.sleep(1)
        ms --
    }
    return jumped_count
}

function wait_for_jump(need_count=2){
    jumped = 0
    while (need_count > 0){
        if (is_jump() && !jumped) {
            jumped = 1
            need_count --
        }
        if (!is_jump()) {
            jumped = 0
        }
        Time.sleep(1)
    }
    Time.sleep(50)
}

function is_near_block(x, y, z){
    pos = Player.getPlayer().getPos()
    //Chat.log(pos.getY() - (y + 1) == 0.0)
    //Chat.log(Math.abs(pos.getX() - (x + 0.5)))
    //Chat.log(Math.abs(pos.getZ() - (z + 0.5)))
    if (pos.getY() - (y + 1) != 0.0) return false
    if (Math.abs(pos.getX() - (x + 0.5)) > 0.2 || Math.abs(pos.getZ() - (z + 0.5)) > 0.2) return false
    return true
}

function set_origin(){
    original_block = Player.getPlayer().rayTraceBlock(8,false)
    if (original_block == null || original_block.getX() != 3754396 || original_block.getY() != 3 || original_block.getId() != "minecraft:crafting_table"){
        Chat.log("!! 初始方块错误！！")
        stop()
    }
    Chat.say("/cglow block 3754396 4 " + original_block.getZ() + " 3")
    obx = original_block.getX()
    oby = original_block.getY()
    obz = original_block.getZ()
    goto_origin()
}

function action_switch(force = 0){
    if (!force) pause()
    if (force) stop()
}

function is_looking_down(){
    if (Player.getPlayer().getPitch() == 90.0) return 1
    return 0
}

function goto_origin(){
    Goto1(obx - 1, oby + 1, obz, 0.5, 0, 0.5)
    Goto1(obx, oby + 1, obz, 0.5, 0, 0.5)
}

function check_player_status(force = 0){
    if (Player.getPlayer().getPos().getY() != 4.0) {
        Chat.log("!! 玩家坐标有误!")
        action_switch(force)
    }
}

function must_is_null(){
    return Player.rayTraceBlock(8,false)==null && Player.rayTraceBlock(8,false)==null && Player.rayTraceBlock(8,false)==null && Player.rayTraceBlock(8,false)==null && Player.rayTraceBlock(8,false)==null && Player.rayTraceBlock(8,false)==null && Player.rayTraceBlock(8,false)==null && Player.rayTraceBlock(8,false)==null && Player.rayTraceBlock(8,false)==null && Player.rayTraceBlock(8,false)==null
}

function maybe_is(id){
    return Player.rayTraceBlock(8,false).getId()==id || Player.rayTraceBlock(8,false).getId()==id || Player.rayTraceBlock(8,false).getId()==id || Player.rayTraceBlock(8,false).getId()==id || Player.rayTraceBlock(8,false).getId()==id || Player.rayTraceBlock(8,false).getId()==id || Player.rayTraceBlock(8,false).getId()==id || Player.rayTraceBlock(8,false).getId()==id || Player.rayTraceBlock(8,false).getId()==id || Player.rayTraceBlock(8,false).getId()==id
}

function pause(){
    Chat.log("@@ 出现故障 已暂停！！")
    Chat.log("@@ 出现故障 已暂停！！")
    Chat.log("@@ 请手动*排*查*完*故*障*后*并确认在脚本暂停的位置和状态后跳跃两次")
    while(!is_near_block(original_block.getX(), original_block.getY(), original_block.getZ())){
        Time.sleep(50)
    }
    wait_for_jump()
}

function look_at_lever() {Chat.say("/clook angles -1117.77 65.59")}



function phase_info(){
    Chat.say("/clook angles -1996.28 32.82")
    Chat.log("##########################################")
    Chat.log("## 模式选择（站在对应高亮方块上）")

    Chat.say("/cglow block 3754396 4 " + (obz - 1) + " 2")
    Chat.log("## 1.放置黑曜石框架")
    Time.sleep(2000)

    Chat.say("/cglow block 3754395 4 " + (obz - 1) + " 2")
    Chat.log("## 2.切门")
    Time.sleep(2000)

    Chat.say("/cglow block 3754395 4 " + (obz - 2) + " 2")
    Chat.log("## 3.挖黑曜石框架")
    Time.sleep(2000)

    Chat.say("/cglow block 3754395 4 " + (obz - 3) + " 2")
    Chat.log("## 4.换底")
    Time.sleep(2000)

    Chat.log("## 如要在每次切换模式时暂停 请将头完全低下再跳跃")
    Chat.log("## 跳跃一次以启动对应的模式及其以下模式")
    Chat.log("##########################################")
}

function phase_select(){
    phase_num = 0
    // global:pause_mode = 0
    pause_end = 0

    outside = 0
    //上升沿触发函数，订阅事件查询函数， *下降沿触发函数
    function rs(trigger_up, subscribe, trigger_down){
        if (!outside && subscribe()){
            outside = 1
            trigger_up()
        }
        if (outside && !subscribe()){
            outside = 0
            if (trigger_down != null) trigger_down()
        }
        return outside
    }

    function pause_trigger_up() {Chat.log("## 已启用暂停模式")}
    function pause_trigger_down() {Chat.log("## 已禁用暂停模式")}

    function pause_rs() {pause_end = rs(pause_trigger_up, is_looking_down, pause_trigger_down)}

    function not_at_at_all() {return !is_near_block(3754396, 3, obz-1) && !is_near_block(3754395, 3, obz-1) && !is_near_block(3754395, 3, obz-2) && !is_near_block(3754395, 3, obz-3)}

    //[左右/上下]全部顺序对应 P1 - P4
    while(true){
        pause_rs()

        if (phase_num != 1 && is_near_block(3754396, 3, obz-1)) {
            Chat.log("已选择模式1")
            phase_num = 1
            switch_end = 1
        }
        if (phase_num != 2 && is_near_block(3754395, 3, obz-1)){
            Chat.log("已选择模式2")
            phase_num = 2
            switch_end = 1
        }
        if (phase_num != 3 && is_near_block(3754395, 3, obz-2)){
            Chat.log("已选择模式3")
            phase_num = 3
            switch_end = 1
        }
        if (phase_num != 4 && is_near_block(3754395, 3, obz-3)){
            Chat.log("已选择模式4")
            phase_num = 4
            switch_end = 1
        }
        if ((phase_num == 1 || phase_num == 2 || phase_num == 3 || phase_num == 4) && not_at_at_all()){
            Chat.log("已退出模式选择")
            phase_num = 0
            switch_end = 0
        }
        if (jump_count(1)){
            Chat.log("你的选择是：" + phase_num)
            if (phase_num != 1 && phase_num != 2 && phase_num != 3 && phase_num != 4){
                stop()
            }
            if (phase_num = 1){
                pause_mode = pause_end
                print("@@ 在脚本警告要求的基础上")
                print("@@ 严禁在场地中脚本要放置的方块位置防止多余方块（脚本不会判断这里是否已有方块） 顶部预铺设的除外")
                phase1()
            }
            if (phase_num = 2){
                pause_mode = pause_end
                print("@@ 在脚本警告要求的基础上")
                print("@@ 确保除了脚本放置的拉杆之外没有其他会使链子不正常工作的方块")
                phase2()
            }
            if (phase_num = 3){
                pause_mode = pause_end
                print("@@ 在脚本警告要求的基础上")
                print("@@ 无其他额外要求")
                phase3()
            }
            if (phase_num = 4){
                pause_mode = pause_end
                print("@@ 在脚本警告要求的基础上")
                print("@@ 严禁在场地中脚本要放置的方块位置防止多余方块（脚本不会判断这里是否已有方块）")
                phase4()
            }
        }
        
    }
}






function Goto(dx,dy,dz,xx,yy,zz)//dx dy dz坐标xx yy zz偏移量
{
    gb_tt=Player.getPlayer().getPos()
    Chat.say("#goto "+dx.toString()+" "+dy.toString()+" "+dz.toString())
    while(Math.abs(gb_tt.getX()-dx-xx)>0.4 || Math.abs(gb_tt.getZ()-dz-zz)>0.4 || Math.abs(gb_tt.getY()-dy)>0)
    {
        nw=Player.rayTraceBlock(8,false)
        if(nw!=null)
        {
                if(nw.getId()=="minecraft:furnace")
                {
                        Chat.say("#stop")
                        return 1
                }
        } 
        gb_tt=Player.getPlayer().getPos()
        Time.sleep(50)
    }
    Chat.say("#stop")
    Time.sleep(350)
    Player.getPlayer().setPos(dx+xx,dy,dz+zz)
    return 0
}
function Goto1(dx,dy,dz,xx,yy,zz)//dx dy dz坐标xx yy zz偏移量
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
function Attack()
{
    KeyBind.keyBind("key.hotbar.1",true)
    wa=Player.rayTraceBlock(8,false)
    KeyBind.keyBind("key.attack",true)
    Time.sleep(1650)
     wa=Player.rayTraceBlock(8,false)
    nw=Player.rayTraceBlock(8,false)
    if (wa == null) return
    while(wa.getX()==nw.getX() &&  wa.getY()==nw.getY() && wa.getZ()==nw.getZ())
    {
        nw=Player.rayTraceBlock(8,false)
        if(nw==null)
            break
    }
    KeyBind.keyBind("key.attack",false)
    Chat.log("ok")
}
function Chack(p)
{
    if(p==null)
        return 1
    else if(p.getId()!="minecraft:obsidian" || p.getY()!=3)
        return 1
     return 0
}
function Check_first_obsidian(dx,dy,dz,xx,yy,zz)
{
    dx-=23
    nw=Player.rayTraceBlock(8,false)
    Chat.say("#goto "+(nx-23).toString()+" "+ny.toString()+" "+nz.toString())
    while(Chack(nw))
    {
        nw=Player.rayTraceBlock(8,false)
    }
    Chat.say("#stop")
    Time.sleep(350)
    nw=Player.getPlayer().getPos()
    nx=Math.floor(nw.getX())
    ny=nw.getY()
    nz=Math.floor(nw.getZ())
    Player.getPlayer().setPos(nx+xx,ny,nz+zz)
}
function CheckBlock()
{
    gf=Player.rayTraceBlock(8,false)//get floor检查是否能换底
    if(gf==null && Player.rayTraceBlock(8,false)==null && Player.rayTraceBlock(8,false)==null && Player.rayTraceBlock(8,false)==null && Player.rayTraceBlock(8,false)==null && Player.rayTraceBlock(8,false)==null && Player.rayTraceBlock(8,false)==null && Player.rayTraceBlock(8,false)==null && Player.rayTraceBlock(8,false)==null && Player.rayTraceBlock(8,false)==null)
        return 0
    if(gf.getId()!="minecraft:note_block" && Player.rayTraceBlock(8,false).getId()!="minecraft:note_block" && Player.rayTraceBlock(8,false).getId()!="minecraft:note_block" && Player.rayTraceBlock(8,false).getId()!="minecraft:note_block" && Player.rayTraceBlock(8,false).getId()!="minecraft:note_block" && Player.rayTraceBlock(8,false).getId()!="minecraft:note_block" && Player.rayTraceBlock(8,false).getId()!="minecraft:note_block" && Player.rayTraceBlock(8,false).getId()!="minecraft:note_block" && Player.rayTraceBlock(8,false).getId()!="minecraft:note_block" && Player.rayTraceBlock(8,false).getId()!="minecraft:note_block")
        return 0
    return 1
}
function exit()
{
    Chat.log("强制结束")
    exit_=null
    exit_.getId()
}

function phase0(){
    self_description()
    warn()
    check_player_status(1)
    check_mod()
    set_origin()
    phase_info()
    phase_select()
}

function main(){
    // Chat.log(jump_count(40))
    // Chat.log(is_near_block(3754395, 3, -3751075))
    phase0()
}
//初始化开始点
////////////////////////////////////////////////////////////////////////////////
//程序的开始

main()
stop()

gb=Player.rayTraceBlock(8,false)
if(gb==null)
{
    Chat.log("666这个入没给初始点,原因gb为null")
}
else if(gb.getX()!=3754131 || gb.getY()!=0 || gb.getId()!="minecraft:crafting_table")
{
    Chat.log("666这个入没给初始点,初始点坐标错误")
}
else//main函数(懒得写成函数了反正一样的)
{
    //初始点没啥问题
    //移动初始化
    //定义偏移量
    //V3内容插入.txt
    xx=0.5
    yy=0.0
    zz=0.5
    //坐标初始化
    x=3754131
    y=1
    z=gb.getZ()
    Goto(x,y,z,xx,yy,zz)
    
    Chat.say("/clook angles 8.9 35.4")
    Time.sleep(100)
    KeyBind.keyBind("key.hotbar.6",true)
    KeyBind.keyBind("key.use",true)
    KeyBind.keyBind("key.use",false)
    Time.sleep(100)
    KeyBind.keyBind("key.use",true)
    KeyBind.keyBind("key.use",false)
    Time.sleep(1000)
    if(Player.rayTraceBlock(8,false).getId()!="minecraft:lever")//检测是否放上了拉杆
    {
        Chat.log("可能你的延迟太高了")
        exit()
    }
    
    dx=x
    dz=z
    dy=4
    dz++
    dx+=7
    Goto(dx,dy,dz,xx,yy,zz)
    cx=dx
    cy=dy
    cz=dz
    
    KeyBind.keyBind("key.hotbar.2",true)
    Time.sleep(100)
    Chat.say("/clook angles 17.1 60.2")
    Time.sleep(300)
    KeyBind.keyBind("key.use",true)
    KeyBind.keyBind("key.use",false)
    Time.sleep(100)
    Chat.say("/clook angles 26.6 61.5")
    Time.sleep(100)
    KeyBind.keyBind("key.use",true)
    KeyBind.keyBind("key.use",false)
    Time.sleep(100)
    Chat.say("/clook angles 26.6 54.4")
    Time.sleep(100)
    KeyBind.keyBind("key.use",true)
    KeyBind.keyBind("key.use",false)
    Time.sleep(100)
    
    do
    {
        Chat.say("/clook angles 0.0 62.6")
        Time.sleep(100)
        KeyBind.keyBind("key.sneak",true)
        Time.sleep(100)
        KeyBind.keyBind("key.use",true)
        KeyBind.keyBind("key.use",false)
        Time.sleep(100)
        KeyBind.keyBind("key.sneak",false)
        Chat.say("/clook angles -43.8 41.4")
        Time.sleep(100)
        cx++
    }
    while(Goto(cx,cy,cz,xx,yy,zz)!=1)
    Goto1(cx,cy,cz,xx,yy,zz)
    Chat.say("/clook angles 0.0 62.6")
    Time.sleep(100)
    KeyBind.keyBind("key.sneak",true)
    Time.sleep(100)
    KeyBind.keyBind("key.use",true)
    KeyBind.keyBind("key.use",false)
    Time.sleep(100)
    KeyBind.keyBind("key.sneak",false)
    
    KeyBind.keyBind("key.hotbar.2",true)
    Time.sleep(100)
    Chat.say("/clook angles -17.1 60.2")
    Time.sleep(300)
    KeyBind.keyBind("key.use",true)
    KeyBind.keyBind("key.use",false)
    Time.sleep(100)
    Chat.say("/clook angles -26.6 61.5")
    Time.sleep(100)
    KeyBind.keyBind("key.use",true)
    KeyBind.keyBind("key.use",false)
    Time.sleep(100)
    Chat.say("/clook angles -26.6 54.4")
    Time.sleep(100)
    KeyBind.keyBind("key.use",true)
    KeyBind.keyBind("key.use",false)
    Time.sleep(100)
    
    Goto(x,y,z,xx,yy,zz)
    Chat.say("/clook angles 8.9 35.4")
    Time.sleep(100)
    KeyBind.keyBind("key.use",true)
    KeyBind.keyBind("key.use",false)
    Time.sleep(300)
    Attack()
    Time.sleep(500)
    
    Chat.say("/clook angles 0.0 57.3")
    Time.sleep(100)
    Goto(dx,dy,dz,xx,yy,zz)
    
    //exit()
    //初始化完毕
    pos=0
    flag=0
    flag1=0
    while(1)
    {
        dx+=21
        if(Goto(dx,dy,dz,xx,yy,zz))
            break
        KeyBind.keyBind("key.hotbar.2",true)
        Chat.say("/clook angles 0.0 68.7")
        Time.sleep(100)
        if(Player.rayTraceBlock(8,false).getY()==1)//检测是否合法,如果不合法输出三个有个问题并强制结束(用空指针)
        {
            Chat.log("特殊情况")
            flag1=1
            break
        }
        KeyBind.keyBind("key.use",true)
        KeyBind.keyBind("key.use",false)
        Time.sleep(100)
        Chat.say("/clook angles 0.0 64.1")
        KeyBind.keyBind("key.use",true)
        KeyBind.keyBind("key.use",false)
        Time.sleep(100)
        Chat.say("/clook angles 0.0 57.3")
        KeyBind.keyBind("key.use",true)
        KeyBind.keyBind("key.use",false)
        Time.sleep(100)
        if(Goto(dx-1,dy,dz,xx,yy,zz))
            break
        KeyBind.keyBind("key.hotbar.3",true)
        Chat.say("/clook angles 0.0 68.7")
        KeyBind.keyBind("key.use",true)
        KeyBind.keyBind("key.use",false)
        Chat.say("/clook angles 0.0 64.1")
        Time.sleep(700)
        if(Player.rayTraceBlock(8,false).getId()!="minecraft:nether_portal")//检测是否合法,如果不合法输出三个有个问题并强制结束(用空指针)
        {
            Chat.log("有问题!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            Chat.log("有问题!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            Chat.log("有问题!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            flag=1
            break
        }
        Time.sleep(100)
        Chat.say("/clook angles -25.3 54.7")
        while(Player.rayTraceBlock(8,false).getId()!="minecraft:powered_rail") 
        {
                Attack()
                Time.sleep(100)
        }
        Time.sleep(400)
        KeyBind.keyBind("key.hotbar.2",true)
        Time.sleep(100)
        Chat.say("/clook angles 0.0 68.7")
        KeyBind.keyBind("key.use",true)
        KeyBind.keyBind("key.use",false)
        Time.sleep(100)
        Chat.say("/clook angles 0.0 64.1")
        KeyBind.keyBind("key.use",true)
        KeyBind.keyBind("key.use",false)
        Time.sleep(100)
        Chat.say("/clook angles 0.0 57.3")
        KeyBind.keyBind("key.use",true)
        KeyBind.keyBind("key.use",false)
        Time.sleep(100)
        if(Goto(dx,dy,dz,xx,yy,zz))
            break
        Chat.say("/clook angles 0.0 57.3")
        Time.sleep(100)
        pos++
    }
    if(flag==1)
    {
        exit()
    }
    Chat.log("到头了")
    //处理最后一条
    nw=Player.getPlayer().getPos()
    nx=Math.floor(nw.getX())
    ny=nw.getY()
    nz=Math.floor(nw.getZ())
    Chat.log(nx)
    Chat.log(ny)
    Chat.log(nz)
    Goto1(nx,ny,nz,xx,yy,zz)
    if(flag1==0)//非为21倍数的特殊情况
        Goto1(nx-2,ny,nz,xx,yy,zz)
    else
        Goto1(nx-1,ny,nz,xx,yy,zz)
    KeyBind.keyBind("key.hotbar.3",true)
    Chat.say("/clook angles 0.0 68.7")
    KeyBind.keyBind("key.use",true)
    KeyBind.keyBind("key.use",false)
    Chat.say("/clook angles 0.0 64.1")
    Time.sleep(700)
    if(Player.rayTraceBlock(8,false).getId()!="minecraft:nether_portal")//检测是否合法,如果不合法输出三个有个问题并强制结束(用空指针)
    {
        Chat.log("有问题!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        Chat.log("有问题!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        Chat.log("有问题!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        exit()
    }
    Time.sleep(100)
    Chat.say("/clook angles -25.3 54.7")
    while(Player.rayTraceBlock(8,false).getId()!="minecraft:powered_rail") 
    {
            Attack()
            Time.sleep(100)
    }
    //往回走&&处理上面两个
    //寻找第一个
    pos++
    while(pos--)
    {
        Chat.say("/clook angles 0.0 57.3")
        Time.sleep(100)
        Chat.log(pos)
        Check_first_obsidian(nx,ny,nz,xx,yy,zz)
        Chat.say("/clook angles -25.3 54.7")
        Time.sleep(100)
        nlk=Player.rayTraceBlock(8,false)
        npos=Player.getPlayer().getPos();
        if(nlk.getId()!="minecraft:obsidian" || (nlk.getId()=="minecraft:obsidian" && nlk.getY()!=3))//要不要往前走一格
        {
            Chat.log(npos.getX())
            Chat.log(npos.getY())
            Chat.log(npos.getZ())
            //exit=null
            //exit.getId();
            Goto1(npos.getX()-1,npos.getY(),npos.getZ(),0,0,0)
        }
        Chat.say("/clook angles -25.3 54.7")
        Time.sleep(100)
        while(Player.rayTraceBlock(8,false).getId()!="minecraft:powered_rail") 
        {
            Attack()
            Time.sleep(100)
        }
        Chat.log(Player.rayTraceBlock(8,false).getId())
    }
    //切门完成
    //开始处理切顶切底
    ps=Player.getPlayer().getPos()
    px=ps.getX()
    px=Math.floor(px)
    py=ps.getY()
    py=Math.floor(py)
    pz=ps.getZ()
    pz=Math.floor(pz)
    Goto1(px+2,py,pz,xx,yy,zz)
    px+=2
    //clook angles 0 70
    Chat.say("/clook angles 0 70")
    Time.sleep(100)
    while(Player.rayTraceBlock(8,false)!=null)
    {
        Attack()
        Time.sleep(500)
        while(Player.rayTraceBlock(8,false)!=null)
        {
            Attack()
        }  
        //clook angles 0 42.2
        Chat.say("/clook angles 0 42.2")
        Time.sleep(100)
        Attack()
        Time.sleep(500)
        while(Player.rayTraceBlock(8,false).getId()=="minecraft:obsidian")
        {
            Attack()
        } 
        px++
        Goto1(px,py,pz,xx,yy,zz)
        Chat.say("/clook angles 0 70")
        Time.sleep(100)
    }
    px-=1
    Goto1(px,py,pz,xx,yy,zz)
    //v2内容：换底
    for(;;)
    {
        KeyBind.keyBind("key.hotbar.4",true)
        KeyBind.keyBind("key.sneak",true)
        Chat.say("/clook angles 12.6 60.7")
        Time.sleep(300)
        if(CheckBlock())
        {
            KeyBind.keyBind("key.use",true)
            KeyBind.keyBind("key.use",false)
        }
        else
        {
            KeyBind.keyBind("key.sneak",false)
            break
        }
        Time.sleep(300)
        KeyBind.keyBind("key.sneak",false)
        px-=3
        Goto1(px,py,pz,xx,yy,zz)
        KeyBind.keyBind("key.sneak",true)
        KeyBind.keyBind("key.hotbar.5",true)
        Chat.say("/clook angles -12.6 60.7")
        Time.sleep(400)
        if(CheckBlock())
        {
            KeyBind.keyBind("key.use",true)
            KeyBind.keyBind("key.use",false)
        }
        else
        {
            KeyBind.keyBind("key.sneak",false)
            break
        }
        Time.sleep(200)
        KeyBind.keyBind("key.sneak",false)
        Time.sleep(900)
    }
    //程序结束
    Goto(x,y,z,xx,yy,zz)
    Chat.log("----over----")
}
