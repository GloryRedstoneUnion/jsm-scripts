Chat.log("Obsidian Remover is working!")
Time.sleep(3000)

l = r = false

l = true
//r = true
empty = 0

while (true){
    lb = Player.rayTraceBlock(5,false)
    isAir = isObs = false
    if (lb == null) isAir = true
    if (!isAir && lb.getId() == "minecraft:obsidian") isObs = true
    if (!isObs) empty ++
    if (isObs){
        KeyBind.keyBind("key.attack",true)
        Time.sleep(2000)
        KeyBind.keyBind("key.attack",false)
        empty = 0
    }
    
    if (r){
        KeyBind.keyBind("key.right",true)
        Time.sleep(20)
        KeyBind.keyBind("key.right",false)
    }
    
    if (l){
        KeyBind.keyBind("key.left",true)
        Time.sleep(20)
        KeyBind.keyBind("key.left",false)
    }
    if (empty >= 100){
        Chat.log("EXIT!!")
        break
    }
}