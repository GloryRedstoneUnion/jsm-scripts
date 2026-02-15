var scriptname = "MessageBlocker"
const reverse = !GlobalVars.getBoolean(scriptname)
GlobalVars.putBoolean(scriptname, reverse)

function main(){
    if(!GlobalVars.getBoolean(scriptname)) return
    Chat.actionbar(`§7[§5${scriptname}§7] §aenabled`)
    function blacklist(event){
        let text = event.text
        let string = text.getString()
        let json = text.getJson()
        //return string.includes("[公告] 恭喜") && string.includes("获得")
        return json.includes(`"text":"公告"`) && json.includes(`"color":"red"`)
    }
    const Logger = Chat.getLogger()
    const MessageListener = JsMacros.on("RecvMessage", true, JavaWrapper.methodToJava(event => {
            //Logger.info(`\n[Info] [RecvMessage] ${event.text.getJson()}`)
            //在日志里看信息格式
            if (blacklist(event)){
                event.cancel()
            }
    }))

    const Close = JsMacros.on("Key", JavaWrapper.methodToJava(event => {
		if(!GlobalVars.getBoolean(scriptname)){
			Chat.actionbar(`§7[§5${scriptname}§7] §cdisabled`)
            MessageListener.off()
			Close.off()
		}
	}))
}
main()