const scriptname = "假人转转转"
const reverse = !GlobalVars.getBoolean(scriptname)
GlobalVars.putBoolean(scriptname, reverse)
Chat.actionbar(`§7[§5${scriptname}§7] ${GlobalVars.getBoolean(scriptname)?`§aenabled`:`§cdisabled`}`)

    const name = "bot_1"

while (GlobalVars.getBoolean(scriptname)) {
    Chat.say(`/player ${name} turn 0 90`)
    Client.waitTick(1)
}

    