Chat.log("start")
const TradeIndex = 9
const delay = 20

const LoadVillager = JsMacros.on("EntityLoad",JavaWrapper.methodToJava(event=>{
    if(event.entity.getType() == "minecraft:villager"){
        Player.getInteractionManager().interactEntity(event.entity, false)
    }
}))

const UnloadVillager = JsMacros.on("EntityUnload",JavaWrapper.methodToJava(event=>{
    if(event.entity.getType() == "minecraft:villager"){
        Client.waitTick(delay)
        //Chat.log(event.entity.getName())
        let inv = Player.openInventory()
        if(inv.getType() != "Villager") return
        let tradeList = inv.getTrades()
        while(tradeList[TradeIndex].isAvailable()){
            tradeList[TradeIndex].select()
            if(inv.getSlot(2).getItemId() == "minecraft:air") break
            inv.quick(2)
            Client.waitTick(1)
        }
        let slots = inv.getSlots("main").concat(inv.getSlots("hotbar"))
        slots.forEach(slot => {
            if(inv.getSlot(slot).getItemId() == tradeList[TradeIndex].getOutput().getItemId()){
                inv.dropSlot(slot, true)
            }
        })
        inv.close()
        Player.getInteractionManager().interact()
    }
}))

const OFF = JsMacros.on("Key",JavaWrapper.methodToJava(event=>{
    if(event.key == "key.keyboard.x"){
        Chat.log("stop")
        LoadVillager.off()
        UnloadVillager.off()
        OFF.off()
    }
}))