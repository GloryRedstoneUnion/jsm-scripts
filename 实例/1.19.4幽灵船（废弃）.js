var world = Client.getMinecraft().field_1687
var Pos = Player.getPlayer().getPos()
var BoatEntity = Java.type("net.minecraft.class_1690")
let entity_1 = new BoatEntity (world,Math.floor(Pos.getX())-0.6875-0.3-0.000000011920928,Pos.getY()+1,Math.floor(Pos.getZ())+0.5)
entity_1.method_5838(0)
//Java.type("net.minecraft.class_1690").method_30959(Java.type("net.minecraft.class_1297"),Java.type("net.minecraft.class_1297").field_5960)
//entity_1
world.method_2942(213124, entity_1)


let entity_2 = new BoatEntity (world,Math.floor(Pos.getX())+0.5,Pos.getY()+1,Math.floor(Pos.getZ())-0.6875-0.3-0.000000011920928)
entity_2.method_5838(0)
world.method_2942(213124, entity_2)
let entity_3 = new BoatEntity (world,Pos.getX(),Pos.getY()+3,Pos.getZ())
entity_3.method_5838(0)
world.method_2942(213124, entity_3)

Client.waitTick(20)
world.method_2945(0,Java.type("net.minecraft.class_1297.class_5529").field_26998)

for(let i=0;i<20;i++)
    Player.addInput(Player.createPlayerInput(1,0,135,0,true,false,true))
Client.waitTick(20)