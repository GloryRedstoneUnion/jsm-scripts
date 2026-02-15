var scriptname = "aim"
const reverse = !GlobalVars.getBoolean(scriptname)
GlobalVars.putBoolean(scriptname, reverse)

function angle(e1, e2) {
    let pos1 = e1.getEyePos()
    let pos2 = e2.getEyePos()
    let vecToTarget = PositionCommon.createVec(pos1.getX(),pos1.getY(),pos1.getZ(), pos2.getX(), pos2.getY(), pos2.getZ()).normalize()
    let lookVec = PositionCommon.createLookingVector(e1).normalize()
    let dot = vecToTarget.dotProduct(lookVec)
    let angleDeg = Math.acos(dot) * (180 / Math.PI)
    return angleDeg
}
const mindis = 8.0 // 实体最远距离
const minAng = 5.0 // 视线与实体最大夹角
while(GlobalVars.getBoolean(scriptname)){
    let list = World.getEntities(mindis)
    let target = null
    let min = 512
    for(let i = 0; i<list.length; i++){
        if(list[i].toString() != Player.getPlayer().toString() && list[i].isAlive()){
        let a = angle(Player.getPlayer(), list[i])
        if(a <= minAng && a < min){
            target = list[i]
            min = a
        }
      }
    }
    if(target != null)
    Player.getPlayer().lookAt(target.getPos().getX(), target.getEyePos().getY(), target.getPos().getZ())
}