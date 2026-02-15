var scriptname = "kill"
const reverse = !GlobalVars.getBoolean(scriptname);
GlobalVars.putBoolean(scriptname, reverse);
if(GlobalVars.getBoolean(scriptname))
Chat.actionbar("killaura enabled")
else
Chat.actionbar("killaura disabled")

while(GlobalVars.getBoolean(scriptname)){
const list = World.getEntities(5,"player")
list.forEach(player=>{
    if(player.getName().toString() == Player.getPlayer().getName().toString()) return;
    Player.getInteractionManager().attack(player)
    Client.waitTick(10)
})
Client.waitTick(1)
}