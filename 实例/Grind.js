const delay = 0
function isExpensive(item){
    return (
        item.getRepairCost() > 1 ||
        !item.getLore().isEmpty() ||
        item.getDefaultName().toString() != item.getName().toString()
    )
}
const book = "minecraft:enchanted_book"
const air = "minecraft:air"
function main(){
    const inv = Player.openInventory()
    var count = 0
    inv.getSlots("main").concat(inv.getSlots("hotbar")).forEach(slot => {
        let item = inv.getSlot(slot)
        if((item.isEnchanted()||item.getItemId() == book) && !isExpensive(item)){
            let itemCount = item.getCount()
            if(itemCount == 1){
                inv.quick(slot)
                inv.quick(2)
                count++
            }else{
                inv.click(slot, 0)
                for(let i = 0; i < itemCount; i++){
                    inv.click(0, 1)
                    inv.quick(2)
                    count++
                }
            }
        }
        Client.waitTick(delay)
    })
    if(count > 0)Chat.actionbar("成功祛魔"+count+"个物品")
    else Chat.actionbar("没有匹配的物品")
    inv.close()
}
if(event.screenName == "Grindstone") main()