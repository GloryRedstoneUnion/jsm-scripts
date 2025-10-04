//Chat.say("/cghostblock fill 3754390 1 -3751244 3754266 1 -3751273 minecraft:iron_trapdoor[half=top]")
x2 = 3754138
y2 = 2
z2 = -3751273

x1 = 3754390
y1 = y2
z1 = Math.floor(Player.getPlayer().getPos().getZ())

Chat.say("/cghostblock fill " + x1.toString() + " " + y1.toString() + " " + z1.toString() + " " + x2.toString() + " " + y2.toString() + " " + z2.toString() + " minecraft:iron_trapdoor[half=bottom]")