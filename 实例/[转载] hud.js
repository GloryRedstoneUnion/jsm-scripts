// 转载自JsMacros的discord频道, 外国大佬写的运行中脚本列表
// 原文本: Simple Toggleable macro that shows all running macros in hud. Useful when you run many services automatically in background and want to keep track of them. Register in "Keys" tab. 
// 发布者: MrKvic 2025.3.4

// Title: Running Macros HUD
// Description: Displays a list of running macros on the screen
const posY = 40;
const posX = 1;
const textSize = 0.6;
const RESET_INTERVAL = 1000; // 1 second refresh interval

// Get the draw2D object or create a new one
const draw2dGlobalKey = "DRAW2D_HUD_MACROS";
let textElements = [];
let lastResetTime = Time.time();
let draw2d = GlobalVars.getObject(draw2dGlobalKey) || Hud.createDraw2D();
draw2d.unregister();

function safeRemoveText(textElement) {
    try {
        if (textElement && typeof textElement.remove === 'function') {
            textElement.remove();
            return true;
        }
    } catch (e) {
        Chat.log("[HUD] Error removing text element: " + e);
    }
    return false;
}

function updateDisplay() {
    let currentMacros = [];
    
    // Get current running macros
    for (const context of JsMacros.getOpenContexts()) {
        let path = context.getContainedFolder().toString();
        let file = context.getFile().toString();
        let fileName = file.replace(path, "");
        currentMacros.push(fileName);
    }
    
    // Clear existing elements
    textElements.forEach(element => safeRemoveText(element));
    textElements = [];
    
    // Create new elements
    draw2d.addText("Running Macros:", posX, posY - textSize * 10, 0xFFFFFF, true, textSize, 1.0);
    currentMacros.forEach((macroName, index) => {
        const yPos = posY + (index * textSize * 10);
        const xPos = posX;
        const newText = draw2d.addText(macroName, xPos, yPos, 0xFFFFFF, true, textSize, 1.0);
        textElements.push(newText);
    });
}

function main() {
    const on = GlobalVars.toggleBoolean(file.getPath());
    if (!on) return;

    // Initial setup
    draw2d.register();
    updateDisplay();

    while (GlobalVars.getBoolean(file.getPath())) {
        if (Time.time() - lastResetTime > RESET_INTERVAL) {
            draw2d.unregister();
            draw2d = Hud.createDraw2D();
            GlobalVars.putObject(draw2dGlobalKey, draw2d);
            draw2d.register();
            updateDisplay();
            lastResetTime = Time.time();
            //Chat.log("[HUD] Reset draw2D");
        }
        Time.sleep(100);
    }

    // Cleanup when disabled
    draw2d.unregister();
    GlobalVars.remove(draw2dGlobalKey);
}

main();