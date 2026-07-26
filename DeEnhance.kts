val scriptname = "DeEnhance"
val reverse = !GlobalVars!!.getBoolean(scriptname)
GlobalVars.putBoolean(scriptname, reverse)
Chat.actionbar(
"§7[§5${scriptname}§7] ${if(GlobalVars.getBoolean(scriptname)) "§aenabled" else "§cdisabled"}",
)
