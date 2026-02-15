// author: ChatGPT Bi_Diu
// 自用 服务器刷怪塔经验效率统计

const name = "Exp-statistics";
const enabled = GlobalVars.toggleBoolean(name);

Chat.log(
    Chat.createTextBuilder()
        .append("[").withColor(0x7)
        .append(name).withColor(0xa)
        .append("] ").withColor(0x7)
        .append(enabled ? "§2Enabled" : "§4Disabled")
        .build()
);

const InitialExp = Player.getPlayer().getXP();
const InitialTime = Time.time();

function expToLevel(exp) {
    let level = 0;
    let expLeft = exp;
    while (true) {
        let expForNext;
        if (level >= 32) {
            expForNext = 9 * level - 158;
        } else if (level >= 17) {
            expForNext = 5 * level - 38;
        } else {
            expForNext = 2 * level + 7;
        }
        if (expLeft < expForNext) break;
        expLeft -= expForNext;
        level++;
    }
    return level;
}

function formatTime(ms) {
    let totalSeconds = Math.floor(ms / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;
    if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    } else {
        return `${seconds}s`;
    }
}

function main() {
    let currentExp = Player.getPlayer().getXP();
    let XpIncrease = currentExp - InitialExp;
    let gainedLevel = expToLevel(XpIncrease);

    let elapsedTimeMs = Time.time() - InitialTime;
    let formattedTime = formatTime(elapsedTimeMs);

    Chat.actionbar(
        Chat.createTextBuilder()
            .append(`[${name}] `).withColor(0xa)
            .append(`经验增加: ${XpIncrease} 点, `).withColor(0xb)
            .append(`相当于 0 - `).withColor(0x7)
            .append(`${gainedLevel} 级`).withColor(0xe)
            .append(` ，已用时: `).withColor(0x8)
            .append(formattedTime).withColor(0x9)
            .build()
    );
}

while (GlobalVars.getBoolean(name)) {
    try {
        main();
        Client.waitTick(5);
    } catch (e) {
        Client.waitTick(5);
        Chat.log(`出错: ${e}`);
    }
}