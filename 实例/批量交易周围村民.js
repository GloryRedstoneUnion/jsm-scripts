const input = ["minecraft:string"]
const output = "minecraft:emerald"

const delay = 2
const distance = 5.0

World.getEntities(distance, "villager").forEach(villager => {
    Player.getInteractionManager().interactEntity(villager, false)
    Client.waitTick(delay)
    let inv = Player.openInventory()
    if(inv.getType() == "Villager"){
        let tradeList = inv.getTrades()
        tradeList.forEach(trade =>{
            if(trade.getInput().length != input.length) return
            if(trade.getLeftInput().getItemId() != input[0]) return
            if(input.length >1 && trade.getRightInput().getItemId() != input[0]) return
            if(trade.getOutput().getItemId() != output) return
            while(trade.isAvailable()){
                trade.select()
                if(inv.getSlot(2).getItemId() == "minecraft:air") return
                inv.quick(2)
                Client.waitTick(delay)
            }
        })
    }
    inv.close()
    Client.waitTick(delay)
})