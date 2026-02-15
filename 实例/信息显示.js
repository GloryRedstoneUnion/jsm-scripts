// 服务脚本在启用时会随Minecraft启动，并且是持久性的脚本。
JsMacros.assertEvent(event, "Service");

// 创建一个2D HUD对象
const d2d = Hud.createDraw2D();
let playerCountDisplay = null;
let tpsmeter = null;
let nearbyPlayersTitle = null;
let aroundPlayers = [];
let playerTextObjects = [];

// 获取屏幕宽度和高度
const w = d2d.getWidth();
const h = d2d.getHeight();

// 设置显示文本的位置（在右侧显示）
const x_position = w - 70; // HUD 在屏幕右侧，距右边缘70像素
const y_position_first_line = 40; // 第一行的 Y 坐标
const y_position_second_line = 50; // 第二行的 Y 坐标
const y_position_start_players = 70; // 附近玩家列表起始位置

// 初始化HUD
d2d.setOnInit(JavaWrapper.methodToJava(() => {
    // 显示TPS和在线人数
    tpsmeter = d2d.addText('TPS: ' + World.getServerTPS(), x_position, y_position_second_line, 0xFFFFFF, true);
    playerCountDisplay = d2d.addText("在线人数: " + World.getPlayers().size(), x_position, y_position_first_line, 0xFFFFFF, true);
    
    // 添加"附近玩家:"标题
    nearbyPlayersTitle = d2d.addText("附近玩家:", x_position, 60 , 0xFFFFFF, true);
}));

// 监听每个Tick事件以更新显示
const tickListener = JsMacros.on("Tick", JavaWrapper.methodToJava(() => {
    // 更新TPS和在线人数
    playerCountDisplay?.setText("在线人数: " + World.getPlayers().size());
    tpsmeter?.setText('TPS: ' + World.getServerTPS());

    // 获取附近玩家信息
    aroundPlayers = [];
    for(let i = 0; i < World.getEntities().length; i++){
        if(World.getEntities()[i].getType() === 'minecraft:player'){
            aroundPlayers.push(World.getEntities()[i].getPlayerName());
        }
    }

    // 清除旧的玩家显示对象
    playerTextObjects.forEach(textObj => d2d.removeText(textObj));
    playerTextObjects = [];

    // 添加新的玩家显示对象
    let y_position_current = y_position_start_players;
    aroundPlayers.forEach(playerName => {
        let playerText = d2d.addText(playerName, x_position, y_position_current, 0xFFFFFF, true);
        playerTextObjects.push(playerText);
        y_position_current += 10; // 每个玩家文本向下移动10像素
    });
}));

// 注册HUD
d2d.register();

// 服务停止时的操作
event.stopListener = JavaWrapper.methodToJava(() => {
    d2d.unregister(); // 取消HUD注册
    JsMacros.off(tickListener); // 取消Tick事件监听
});
