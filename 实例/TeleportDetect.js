var scriptname = "TeleportDetect"
const reverse = !GlobalVars.getBoolean(scriptname)
GlobalVars.putBoolean(scriptname, reverse)
Chat.actionbar(GlobalVars.getBoolean(scriptname)?`§7[§5${scriptname}§7] §aenabled`:`§7[§5${scriptname}§7] §cdisabled`)

function main(){
    if(!GlobalVars.getBoolean(scriptname)) return
    const Packet = JsMacros.on("SendPacket", JavaWrapper.methodToJava(event => {
        if(event.type.includes("Teleport")){
            Chat.log("被传送")
        }
    }))
    const Close = JsMacros.on("Key", JavaWrapper.methodToJava(event => {
        if(GlobalVars.getBoolean(scriptname)) return
        Packet.off()
        Close.off()
    })) 
}
main()