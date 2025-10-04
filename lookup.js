while (1){
    lb = Player.rayTraceBlock(7, false)
    
    if (lb != null && lb.getY() == 2 && lb.getId() == "minecraft:iron_trapdoor") Chat.say("/clook angles ~ ~-1")
    
    Time.sleep(5)
}