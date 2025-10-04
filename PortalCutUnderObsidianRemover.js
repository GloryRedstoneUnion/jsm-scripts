class EventEmitter {
    constructor() {
        this.events = {};
}

    on(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }
}


Chat.log("Tip:Use Aim Lock method in Tweakeroo mod to fix your camera facing to prevent unexcepted mouse movement")
Chat.log("Suggest:You have better turn on Light Level Overlay method in Minihud mod to prevent some accidents")
//Time.sleep(1000)
Client.waitTick(20)
Chat.log("Warn:Remover for the Underground Obsidian of the Cut-Portal will work in 3 seconds")
//Time.sleep(3000)
Client.waitTick(60)
Chat.log("Info:Remover is working NOW!!")
Chat.log("Tip:Remove this thread in JsMacros Main Windows to stop this remover!")
//Player.getPlayer()
const obs_y = 4.0
const player_y = obs_y + 1.0
const player_y1 = obs_y + 1.5
const z = Player.getPlayer().getPos().getZ()
Chat.log(z)
//Chat.log(Player.getPlayer().getPos().getY())
Chat.log(Math.floor(Player.getPlayer().getYaw()))
Chat.log(Player.getPlayer().getYaw())
Chat.log(Player.getPlayer().getPitch())
//Player.getPlayer().lookAt(Player.getPlayer().getYaw(),50.0)
//yaw_allow = [0, 90, 180, -180, -90]
Time.sleep(50)

while (1) {
    //isObs = (Player.rayTraceBlock(5,false).getId() == "minecraft:obsidian")
    lb = Player.rayTraceBlock(5,false)
    isWall = isAir = isObs = false
    if (lb == null) isAir = true
    if (!isAir && lb.getId() == "minecraft:obsidian") isObs = true
    if (!isAir && lb.getId() == "minecraft:polished_blackstone_brick_wall") isWall = true
    Chat.log("Log:Is looking at obsidian/air/wall?" + isObs.toString() + "/" + isAir.toString())
    
    if (Player.rayTraceEntity() != null) {
        KeyBind.keyBind("key.back",false)
        KeyBind.keyBind("key.attack",false)
        Chat.log("detected entity, skipping")
        Time.sleep(100)
        continue
    }
    //if (!(Math.floor(Player.getPlayer().getYaw()) in yaw_allow)) {
    py = Math.floor(Player.getPlayer().getYaw())
    if (py != 0 && py != 90 && py != 180 && py != -90) {
        Chat.log("Exiting because your aim is NOT execpeted")
        break
    }
    if (!isObs && !isAir && !isWall) {
        Chat.log("Exiting because the block you look is NOT obsidian")
        KeyBind.keyBind("key.back",false)
        KeyBind.keyBind("key.attack",false)
        break
    }
    //if (player_y <= Player.getPlayer().getPos().getY() <= player_y1) {
        //Chat.log("Exiting because your pos is NOT execpeted")
        //break
    //}
    
    
    if (isAir || isWall){
        KeyBind.keyBind("key.attack",false)
        KeyBind.keyBind("key.back",true)
    }
    if (isObs){
        if (lb.getY() != obs_y) {
            Chat.log("Exiting because the y-asix of obsidian you look is NOT execpeted")
            break
        }
        KeyBind.keyBind("key.back",false)
        KeyBind.keyBind("key.attack",true)
        Time.sleep(1000)
    }
    const HealthChangeEvent = new EventEmitter();
    Player.getPlayer().setPos(Player.getPlayer().getPos().getX(), Player.getPlayer().getPos().getY(), z)
    Time.sleep(100)
}

KeyBind.keyBind("key.attack",false)
KeyBind.keyBind("key.back",false)

Chat.log("EXIT")