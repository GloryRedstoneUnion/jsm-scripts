//脚本启停变量
var scriptname = "autoFish";
const reverse = !GlobalVars.getBoolean(scriptname);
GlobalVars.putBoolean(scriptname, reverse);

const targetItemId = "minecraft:fishing_rod"
const robber = "minecraft:fishing_bobber"
//==================================================================//
//                                                                  //
    const delay = 1000  //抛竿延时 (过快可能导致钩到上一次的战利品
    const forceFishing = true;  //强制钓鱼 (只要手持鱼竿，就会一直抛钩
//                                                                  //
//==================================================================//
//检查玩家手持物品
function isHoldingInMainhand(){
	return Player.getPlayer().getMainHand().getItemId() == targetItemId;
}
function isHoldingInOffhand(){
	return Player.getPlayer().getOffHand().getItemId() == targetItemId;
}

//检查鱼钩是否已经存在
function IsFishing(){
    return Player.getPlayer().getFishingBobber() != null;
}

//使用鱼竿
function useFishingRod(){
    //如果鱼竿在主手
    if(isHoldingInMainhand()) {
		Player.getInteractionManager().interactItem(false);
	}
    //如果鱼竿在副手
	if(isHoldingInOffhand()) {
		Player.getInteractionManager().interactItem(true);
	}
}
function onBobberLoad(entity){
    let exist = false;
    //如果是鱼钩实体 且 鱼钩是玩家自己的
    if(entity.getType() == robber && Player.getPlayer().getFishingBobber().getUUID() == entity.getUUID()){
        exist = true
        
        //检测鱼钩是否消失
        const EntityUnload = JsMacros.on("EntityUnload", JavaWrapper.methodToJava(event => {
            if(event.entity.getType() == robber && event.entity.getUUID() == entity.getUUID() && forceFishing){
                exist = false
            }
        }))
        //循环检测是否上钩
        while(exist && GlobalVars.getBoolean(scriptname)){
            if(entity.hasCaughtFish()){
                useFishingRod();
                exist = false
            }
            Client.waitTick(1)
        }

        EntityUnload.off()
        //等待一定时间(过快会勾到上次钓鱼的战利品)
        Time.sleep(delay)

        //接着钓鱼
        if(!IsFishing()){
            useFishingRod();
        }
    }
}
function main(){
	if(!GlobalVars.getBoolean(scriptname)) return;
	//开启脚本提示
	Chat.actionbar(Chat.createTextBuilder().append("[").withColor(0x7).append(scriptname).withColor(0x5).append("]").withColor(0x7).append(" enabled").withColor(0xa).build());

    //检查开启脚本时是否手持钓竿，并抛钩
	if(!IsFishing()){
        useFishingRod();
    }
    if(Player.getPlayer().getFishingBobber() != null && forceFishing){
        onBobberLoad(Player.getPlayer().getFishingBobber())
    }
    //检查切换物品时，是否手持钓竿，并抛钩
	const HeldItemChange = JsMacros.on("HeldItemChange", JavaWrapper.methodToJava(event => {
		if(!IsFishing()){
			useFishingRod();
		}
	}));

    //监听鱼钩实体的生成
    const BobberListener = JsMacros.on("EntityLoad", JavaWrapper.methodToJava(event => {
        onBobberLoad(event.entity)
    }))


	//关闭脚本&监听器
	const Close = JsMacros.on("Key", JavaWrapper.methodToJava(event => {
		if(!GlobalVars.getBoolean(scriptname)){
            //关闭脚本提示
			Chat.actionbar(Chat.createTextBuilder().append("[").withColor(0x7).append(scriptname).withColor(0x5).append("]").withColor(0x7).append(" disabled").withColor(0xc).build());

            //关闭监听器
			HeldItemChange.off();
            BobberListener.off();
			Close.off();
		}
	}));
}


main();