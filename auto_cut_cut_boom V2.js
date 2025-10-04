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
    }
    Chat.say("#stop")
    Time.sleep(350)
    Player.getPlayer().setPos(dx+xx,dy,dz+zz)
}
function Goto1(dx,dy,dz,xx,yy,zz)//dx dy dz坐标xx yy zz偏移量
{
    gb_tt=Player.getPlayer().getPos()
    Chat.say("#goto "+dx.toString()+" "+dy.toString()+" "+dz.toString())
    while(Math.abs(gb_tt.getX()-dx-xx)>0.4 || Math.abs(gb_tt.getZ()-dz-zz)>0.4 || Math.abs(gb_tt.getY()-dy)>0)
    {
        gb_tt=Player.getPlayer().getPos()
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
    Time.sleep(1600)
     wa=Player.rayTraceBlock(8,false)
    nw=Player.rayTraceBlock(8,false)
    if (wa == null || nw == null) {
        KeyBind.keyBind("key.attack",false)
        return
    }
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
    if(gf==null)
        return 0
    if(gf.getId()!="minecraft:note_block")
        return 0
    return 1
}
//初始化开始点
gb=Player.rayTraceBlock(8,false)
if(gb==null)
{
    Chat.log("666这个入没给初始点,原因gb为null")
}
else if(gb.getX()!=3754131 || gb.getY()!=0 || gb.getId()!="minecraft:crafting_table")
{
    Chat.log("666这个入没给初始点,初始点坐标错误")
}
else
{
    //初始点没啥问题
    //移动初始化
    //定义偏移量
    xx=0.5
    yy=0.0
    zz=0.5
    //坐标初始化
    x=3754131
    y=1
    z=gb.getZ()
    Goto(x,y,z,xx,yy,zz)
    dx=x
    dz=z
    dy=4
    dz++
    dx+=7
    Chat.say("/clook angles 0.0 57.3")
    Time.sleep(100)
    Goto(dx,dy,dz,xx,yy,zz)
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
            Chat.log("有问题!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            Chat.log("有问题!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
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
        exit=null
        exit.getId();
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
        exit=null
        exit.getId();
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
