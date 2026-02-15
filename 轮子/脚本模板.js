const scriptname = "scriptname"
const reverse = !GlobalVars.getBoolean(scriptname)
GlobalVars.putBoolean(scriptname, reverse)
Chat.actionbar(`§7[§5${scriptname}§7] ${GlobalVars.getBoolean(scriptname)?`§aenabled`:`§cdisabled`}`)
main()
function main(){
    if(!GlobalVars.getBoolean(scriptname)) return
    // const Listener = JsMacros.on("Event", JavaWrapper.methodToJava(event => {
    //     Chat.log(`事件：${event}`)
    // }))
    while(GlobalVars.getBoolean(scriptname)){
        Chat.log(`正在运行${scriptname}`)
        Client.waitTick(20)
    }
    //Listener.off()
}