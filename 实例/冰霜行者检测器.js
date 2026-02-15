var scriptname = "冰霜行者检测器"
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
        playerlist = World.getEntities("player")
        for(let i=1;i<playerlist.size();i++){
            playerlist[i].setGlowing(false)
        }
}

while (GlobalVars.getBoolean(scriptname)) {
    playerlist = World.getEntities("player")
    for(let i=1;i<playerlist.size();i++){
        if(playerlist[i].getNBT().resolve("Inventory[{tag:{Enchantments:[{id:\"minecraft:frost_walker\"}]}}]")!=null){
            Chat.actionbar(Chat.createTextBuilder().append("[").withColor(0x7)
                .append("冰霜行者检测器").withColor(0x5)
                .append("]").withColor(0x7).append(" 发现目标:").withColor(0xc)
                .append(playerlist[i].getName()).withColor(0xc).append(playerlist[i].getPos().multiply(10,10,10).divide(10,10,10)).withColor(0xb)
                .build());
            playerlist[i].setGlowingColor(16711935)
            playerlist[i].setGlowing(true)
            break
        }else{
            playerlist[i].setGlowing(false)
        }
    }
    Client.waitTick(5)
}