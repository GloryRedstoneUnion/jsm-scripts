var scriptname = "PeriodInteract"
const reverse = !GlobalVars.getBoolean(scriptname)
GlobalVars.putBoolean(scriptname, reverse)
Chat.actionbar(GlobalVars.getBoolean(scriptname)?`§7[§5${scriptname}§7] §aenabled`:`§7[§5${scriptname}§7] §cdisabled`)

const delay = 2

while(GlobalVars.getBoolean(scriptname)){
    Player.getInteractionManager().interact()
    Client.waitTick(delay)
}