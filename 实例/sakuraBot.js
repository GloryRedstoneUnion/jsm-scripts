//脚本启停变量
var scriptname = "SakuraBot";
const reverse = !GlobalVars.getBoolean(scriptname);
GlobalVars.putBoolean(scriptname, reverse);

// 正则表达式分解说明：
// - ^<([^>]+)> : 匹配以 < 开头，捕获直到 > 之前的内容（即用户名）
// - \s*        : 匹配用户名后的任意空格（包括无空格）
// - (.*)$      : 捕获剩余部分作为消息内容（直到字符串末尾）
const messageRegex = /^<([^>]+)>\s*(.*)$/;
const gotoRegex = /^\s*\SakuraBot\s+前往\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s*$/;

//Baritone Goto命令
function goto(x, y, z){
    Chat.say("正在前往目标地点: " + x + " " + y + " " + z);
    Chat.say("#goto " + x + " " + y + " " + z);
}

//聊天命令解析
function commandManage(sender, message){
    Chat.log("收到来自" + sender + "的消息: " + message)
    //判断是否是机器人主人发送的消息
    if (sender == "SakuraNeko_")
    {
        var match = message.match(gotoRegex);
        if (match) {
            //Chat.log("1 " + match[1]);
            //Chat.log("2 " + match[2]);
            //Chat.log("3 " + match[3]);
            goto(match[1], match[2], match[3]);
        }
    }
}

function main(){
	if(!GlobalVars.getBoolean(scriptname)) return;
	//开启脚本提示
	Chat.actionbar(Chat.createTextBuilder().append("[").withColor(0x7).append(scriptname).withColor(0x5).append("]").withColor(0x7).append(" enabled").withColor(0xa).build());

	//关闭脚本&监听器
	const Close = JsMacros.on("Key", JavaWrapper.methodToJava(event => {
		if(!GlobalVars.getBoolean(scriptname)){
            //关闭脚本提示
			Chat.actionbar(Chat.createTextBuilder().append("[").withColor(0x7).append(scriptname).withColor(0x5).append("]").withColor(0x7).append(" disabled").withColor(0xc).build());
            //关闭监听器
			Close.off();
		}
	}));

    // 监听接收到的聊天消息（包括其他玩家、系统消息）
    var lastCreationTick;
    while (GlobalVars.getBoolean(scriptname)){
        var sender, message = "";
        try {
            const ChatHistoryManager = Chat.getHistory();
            var jsonString = ChatHistoryManager.getRecvLine(0).toString().replace("ChatHudLineHelper:", "");
            var jsonObj = JSON.parse(jsonString);
            var rawMessage = jsonObj.text;
            var creationTick = jsonObj.creationTick;

            if (lastCreationTick != creationTick) {
                lastCreationTick = creationTick;
            }
            else {
                continue;
            }

            //Chat.log("收到消息: " + rawMessage)
            var match = rawMessage.match(messageRegex);
            if (match){
                sender = match[1];
                message = match[2];
            }
            else
            {
                sender = "";
                message = rawMessage;
            }
        } catch (error) {
            Chat.say(error.message)
        }

        //Chat.log("收到来自" + sender + "的消息: " + message)
        //Chat.log(message || sender);
        if (message || sender)
        {
            //Chat.log("收到来自" + sender + "的消息: " + message)
            commandManage(sender, message);
        }
    }
}

main();