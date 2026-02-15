//事件 - 打开界面
function craft(){

    //合成物品id列表
    const craftlist = ["minecraft:gold_ingot_from_nuggets","minecraft:gold_block"]
    //合成延时
    const delay = 2

    var inv = Player.openInventory()
    if(!inv.is("Crafting Table")){
        return
    }
    
    var recipes
    craftlist.forEach(id => {
        if(inv.findFreeSlot("output") == -1){
            Chat.actionbar("无法取出合成产物")
            return
        }
        recipes = inv.getCraftableRecipes()
        Chat.log(recipes)
        for(let i = 0; i < recipes.length; i++){
            if(recipes[i].getId() == id){
                while(recipes[i].canCraft()){
                    recipes[i].craft(true)
                    Client.waitTick(delay)
                    inv.quick(0)
                    Client.waitTick(delay)
                    if(inv.findFreeSlot("output") == -1){
                        Chat.actionbar("无法取出合成产物")
                        return
                    }
                }
                break
            }
        }
    })
    
}
if (World.isWorldLoaded() && Player.openInventory() != null)
    craft()