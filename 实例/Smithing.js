//放在事件下面，选择"打开界面"

const delay = 1 //物品操作延时
const drop = true//是否丢出合成产物

const leftInput = "minecraft:netherite_upgrade_smithing_template"//模板
const rightInput = "minecraft:netherite_ingot"//材料
const target = "minecraft:diamond_pickaxe"//工具

const air = "minecraft:air"//空气
var inv = Player.openInventory()
while(inv.getType() == "Smithing Table"){
    inv = Player.openInventory()
    let slots = inv.getSlots("main").concat(inv.getSlots("hotbar"))
    var found = false
    slots.forEach(s=>{
        if(inv.getSlot(s).getItemId() == target) found = true
        if((inv.getSlot(0).getItemId() == air && inv.getSlot(s).getItemId() == leftInput)||(inv.getSlot(2).getItemId() == air && inv.getSlot(s).getItemId() == rightInput)||(inv.getSlot(1).getItemId() == air && inv.getSlot(s).getItemId() == target))
            {
                inv.quick(s)
                Client.waitTick(delay)
            }
        if(inv.getSlot(3).getItemId() != air){
            if(drop){
                inv.dropSlot(3)
            }else{
                inv.quick(3)
            }
            Client.waitTick(delay)
        }
        
    })
    if(!found) break
    Client.waitTick(delay)
}