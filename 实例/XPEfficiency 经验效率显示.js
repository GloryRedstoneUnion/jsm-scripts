// ==JsMacros v1==
// @name XPEfficiency
// @description 经验效率监控（30秒采样，5秒刷新，含等级/min）

const scriptName = 'XPEfficiency';

// 日志函数
const log = (msg) => Chat.log(`[XP] ${msg}`);

const toggle = () => {
    const state = !GlobalVars.getBoolean(scriptName);
    GlobalVars.putBoolean(scriptName, state);
    log(state ? "✅ 启用" : "❌ 禁用");
    return state;
};

if (!toggle()) exit();

// ========== HUD 设置 ==========
const hud = Hud.createDraw2D();
const lines = [];
const padding = 10;
const lineHeight = 12;

hud.register();

function addText(text, x, y, color = 0x00FFFF, shadow = true, scale = 0.7) {
    try {
        return hud.addText(text, x, y, color, shadow, scale, 0);
    } catch (e) {
        log("HUD 添加文本失败: " + e);
        return null;
    }
}

// ========== 数据 ==========
let data = {
    level: 0,
    totalXP: 0,
    xpPerMin: 0,
    levelsPerMin: 0,  // 新增：等级/分钟
    history: []
};

// ========== 获取经验 ==========
function getXPData() {
    try {
        const player = Player.getPlayer();
        if (!player) return null;
        const nbt = player.getNBT();
        if (!nbt) return null;

        const level = nbt.get('XpLevel').asNumber();
        const totalXP = nbt.get('XpTotal').asNumber();

        return { level, totalXP };
    } catch (e) {
        log("获取经验失败: " + e);
        return null;
    }
}

// ========== 计算效率 + 等级/分钟 ==========
function updateEfficiency() {
    const now = Date.now();
    const current = getXPData();
    if (!current) return;

    // 添加新数据
    data.history.push({
        xp: current.totalXP,
        level: current.level,
        time: now
    });

    // 🔥 只保留最近 30 秒
    const cutoff = now - 30000;
    while (data.history.length > 0 && data.history[0].time < cutoff) {
        data.history.shift();
    }

    // 计算 XP/min 和 Levels/min
    if (data.history.length >= 2) {
        const first = data.history[0];
        const last = data.history[data.history.length - 1];
        const deltaTime = (last.time - first.time) / 1000; // 秒
        if (deltaTime >= 1) {
            const deltaXP = last.xp - first.xp;
            data.xpPerMin = Math.round((deltaXP / deltaTime) * 60 * 10) / 10;

            // 🔥 计算等级/分钟
            const deltaLevel = last.level - first.level;
            data.levelsPerMin = (deltaLevel / deltaTime) * 60; // 每分钟
            data.levelsPerMin = Math.round(data.levelsPerMin * 100) / 100; // 保留2位小数
        }
    }

    data.level = current.level;
    data.totalXP = current.totalXP;
}

// ========== 更新显示 ==========
function updateDisplay() {
    try {
        const texts = [
            `⚡ 效率 (30s)`,
            `等级: ${data.level}`,
            `总经验: ${data.totalXP}`,
            `速度: ${data.xpPerMin} XP/min`,
            `升级: ${data.levelsPerMin} Lvl/min`  // ✅ 新增行
        ];

        let height = 1080;
        try {
            height = hud.getHeight() || 1080;
        } catch (e) {}

        const baseY = height - lineHeight * texts.length - padding;

        for (let i = 0; i < texts.length; i++) {
            if (i >= lines.length) {
                const line = addText(texts[i], padding, baseY + lineHeight * i);
                if (line) lines.push(line);
            } else {
                try {
                    lines[i].setText(texts[i]);
                    lines[i].setPos(padding, baseY + lineHeight * i);
                } catch (e) {}
            }
        }
    } catch (e) {
        log("显示失败: " + e);
    }
}

// ========== 主循环：每5秒更新一次 ==========
log("💡 每5秒刷新，基于最近30秒数据，含等级/分钟");

while (GlobalVars.getBoolean(scriptName)) {
    try {
        updateEfficiency();
        updateDisplay();
        Time.sleep(5000);
    } catch (e) {
        if (String(e).includes("cancelled")) continue;
        log("主循环错误: " + e);
        Time.sleep(1000);
    }
}

// ========== 清理 ==========
try { hud.unregister(); } catch (e) {}
try { lines.forEach(l => l?.remove?.()); } catch (e) {}
log("👋 脚本已停止");