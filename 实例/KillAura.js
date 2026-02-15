var scriptname = "KillAura"
const reverse = !GlobalVars.getBoolean(scriptname);
GlobalVars.putBoolean(scriptname, reverse);
if(GlobalVars.getBoolean(scriptname))
Chat.actionbar("KillAura Enabled")
else
Chat.actionbar("KillAura Disabled")

while(GlobalVars.getBoolean(scriptname)){
    //const list = World.getEntities(5,"player")
    const list = World.getEntities(5)
    list.forEach(entity=>{
        if (entity.getName().toString() == Player.getPlayer().getName().toString()) return; //起到不攻击玩家自己的作用
        if (entity.getType() == Player.getPlayer().getType()) return; //如果要开启PVP把这行注释掉
        //不能攻击非法实体否则会被踢出游戏
        try {
            if (entity.getHealth() > 0) {
                entity.setGlowing(true);
                Player.getInteractionManager().attack(entity);
                Client.waitTick(10);
            }
        } catch (error) {
            Chat.actionbar("KillAura 已过滤非法实体: " + entity.getType()); //嫌吵注释掉这行
        }
    });

    Client.waitTick(1)
}