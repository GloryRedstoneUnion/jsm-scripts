var scriptname = "ChatResponder"
const reverse = !GlobalVars.getBoolean(scriptname)
GlobalVars.putBoolean(scriptname, reverse)

function main() {
    if (!GlobalVars.getBoolean(scriptname)) return
    Chat.actionbar(`§7[§5${scriptname}§7] §aenabled`)

    const cooldownSeconds = 1
    const lastTriggerTime = {}

    // 关键词与回复定义区
    const replies = [
        { keys: ["你好", "hi"], replies: ["Ciallo～(∠・ω< )⌒★"] },
        { keys: ["查询存活"], replies: ["在挂机喵", "似了有一会儿了"] }
    ]

    const myName = Player.getPlayer().getName().getString()

    const MessageListener = JsMacros.on("RecvMessage", true, JavaWrapper.methodToJava(event => {
        const fullText = event.text.getString()

        // 忽略自己发的消息
        if (fullText.startsWith(`<${myName}>`)) return

        for (const entry of replies) {
            for (const key of entry.keys) {
                if (fullText.includes(key)) {

                    // 如果 replies 是数组，随机选一个
                    const response = Array.isArray(entry.replies)
                        ? entry.replies[Math.floor(Math.random() * entry.replies.length)]
                        : entry.replies

                    Chat.say(response)
                    return
                }
            }
        }
    }))

    const Close = JsMacros.on("Key", JavaWrapper.methodToJava(event => {
        if (!GlobalVars.getBoolean(scriptname)) {
            Chat.actionbar(`§7[§5${scriptname}§7] §cdisabled`)
            MessageListener.off()
            Close.off()
        }
    }))
}

main()
