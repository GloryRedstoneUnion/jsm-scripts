var scriptname = "AngelBlock"
const reverse = !GlobalVars.getBoolean(scriptname)
GlobalVars.putBoolean(scriptname, reverse)

function main(){
    if (!GlobalVars.getBoolean(scriptname)) return
    Chat.actionbar(`§7[§5${scriptname}§7] §aenabled`)
    const Click = JsMacros.on("Key", JavaWrapper.methodToJava( event => {
        if(event.key === "key.mouse.right" && event.action === 1){
            let player = Player.getPlayer()
            let pos = player.getEyePos()
            let vec = PositionCommon.createLookingVector(player)
            let hit = player.rayTraceBlock(Player.getReach(), false)
            if(!hit){
                event.cancel()
                let mainHand = player.getMainHand().getItem().isBlockItem()
                let reach = 2
                let air = pos.add(vec.normalize().getEnd().multiply(reach,reach,reach)).toBlockPos()
                if(mainHand){
                    Player.getInteractionManager().setTarget(air)
                }
            }
        }
        if(event.key === "key.mouse.right" && event.action === 0){
            Player.getInteractionManager().clearTargetOverride()
        }
    }))
    const Close = JsMacros.on("Key", JavaWrapper.methodToJava(_ => {
        if (GlobalVars.getBoolean(scriptname)) return
        Click.off()
        Close.off()
        Chat.actionbar(`§7[§5${scriptname}§7] §cdisabled`)
    }))
}
main()