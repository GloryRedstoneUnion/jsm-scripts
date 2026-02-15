var delay = 0   //网非常卡才需要加的延时
var level = 30     //等级下限
var enchant = 3 //附魔第n个选项
var anticheat = 1//如果你发包过多被踢出了，那么这个改成1
var ThrowOut = 1 //1：背包满了会将附魔产物丢出; 0：背包满了会停止附魔



function EnchantSlot(i){
    inv = Player.openInventory()
    inv.quick(i)
    let levels = Player.openInventory().getEnchantmentLevels();
    while(inv.getSlot(0).getItemId() == "minecraft:air"&&inv.getType() == "Enchanting Table"){
        Client.waitTick(1)
        inv = Player.openInventory()
    }
    inv = Player.openInventory()
    if(inv.findFreeInventorySlot() == -1&&!ThrowOut) return
    Client.waitTick(1)
    for(let i = enchant-1; i >= 0; i--){
        if(levels[i] != -1) {
            inv.doEnchant(i)
            break
        }
    }
    while(!inv.getSlot(0).isEnchanted()&&inv.getType() == "Enchanting Table"&&inv.getSlot(0).getItemId() != "minecraft:enchanted_book"){
        Client.waitTick(anticheat)
        for(let i = enchant-1; i >= 0; i--){
            if(levels[i] != -1) {
                inv.doEnchant(i)
                break
            }
        }
        inv = Player.openInventory()
    }
    Client.waitTick(anticheat)
    if(inv.findFreeInventorySlot() == -1)
        inv.dropSlot(0)
    else
        inv.quick(0)
    while(inv.getSlot(0).getItemId()!="minecraft:air"&&inv.getType() == "Enchanting Table"){
        Client.waitTick(1)
        inv = Player.openInventory()
    }
    return 
}

function main(){
    if(!World.isWorldLoaded())return
    if(Player.getPlayer()==null)return
    if(Player.openInventory()==null)return
    Client.waitTick(delay)
    var inv = Player.openInventory()
    if(inv.getType() != "Enchanting Table") return
    var player = Player.getPlayer()
    if(player.getXPLevel() < level){
        Chat.actionbar("等级不够")
        inv.close()
        return
    }
    var t=0
    for(let i = 2; i < 38; i++){
        let slot = inv.getSlot(i)
        if((slot.isEnchantable() && !slot.isEnchanted()) || slot.getItemId() == "minecraft:book"){
        let Count = slot.getCount()
        for(let k = 0; k < Count; k++){
            for(let j = 2; j < 38; j++){
                if(inv.getLapis().getCount() > 5)break
                let slot = inv.getSlot(j)
                if(slot.getItemId() == "minecraft:lapis_lazuli"){
                    inv.quick(j)
                    Client.waitTick(delay)
                    if(inv.getLapis().getCount() > 5)break
                }
            }
            if(inv.getLapis().getCount() < 3){
                Chat.actionbar("青金石不够")
                inv.close()
                return
            }
            t++
            EnchantSlot(i)
            if(player.getXPLevel()<level){
                Chat.actionbar("等级不够")
                inv.close()
                return
            }
        }
        Client.waitTick(delay)
        }
        
    }
    Client.waitTick(1)
    if(t>0)Chat.actionbar("成功附魔"+t+"个物品")
    else Chat.actionbar("没有匹配的物品")
    inv.close()
}
main()
