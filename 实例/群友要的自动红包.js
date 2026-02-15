// author: ChatGPT Bi_Diu
// 请勿倒卖
const scriptname = "自动抢红包"
const reverse = !GlobalVars.getBoolean(scriptname);
GlobalVars.putBoolean(scriptname, reverse);
if (reverse) {
    Chat.log(Chat.createTextBuilder().append("[").withColor(0x7).append(scriptname).withColor(0x5).append("]").withColor(0x7).append(" Enabled").withColor(0x2).build());
} else {
    Chat.log(Chat.createTextBuilder().append("[").withColor(0x7).append(scriptname).withColor(0x5).append("]").withColor(0x7).append(" Disabled").withColor(0x4).build());
    JsMacros.disableAllListeners("RecvMessage");
}

if (GlobalVars.getBoolean(scriptname)) {
    JsMacros.on("RecvMessage", JavaWrapper.methodToJava((msg) => {
        const text = msg.text.getString();
        const regex = /\[!\] 玩家.+?发红包啦!.*?\[输入口令 (.+?) 领取\]/;
        const match = text.match(regex);
        if (match) {
            const password = match[1];  // 提取口令
            Chat.say(password);
        }
    }));
}