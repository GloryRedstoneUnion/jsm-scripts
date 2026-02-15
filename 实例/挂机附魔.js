/* *Change your font or character set if you cannot see the text below.*

介绍：
使用按键宏触发，按关闭背包/esc退出时自动关闭
意外退出背包时会自动重新打开附魔台
会等待附魔物品、青金石、经验的补充
开始附魔时会选择第1项开始附魔，第2次之后选择第3项附魔
附魔完成后会直接丢出附魔书

(注:此脚本所在服务器有限制，有些附魔太多的附魔书会被阻拦，并退出界面，需要重新打开附魔台并选择其他选项附魔)
(正常服务器也能用，可以修改重新打开时候选择的附魔选项[下方])
*/
//============配置===============
//可以修改下面的延迟避免发包过多或延时过大操作失败
const Delay = 2
//可以修改下面的物品更改附魔对象 [ItemId]
const TargetItem = "minecraft:book"
//打开附魔台的第1次附魔使用第n个选项 [0/1/2]
const FirstIndex = 0

//其余附魔使用的选项[0/1/2]
const EnchantIndex = 2
//退出界面后的等待时间(需要检测按键松开所以不建议太小)
const QuitDelay = 20
//附魔台最远距离
const Distance = 5.0
//优先放入背包 [true/false]
const InventoryFirst = false
//===============================

var scriptname = "enchant"
const reverse = !GlobalVars.getBoolean(scriptname)
GlobalVars.putBoolean(scriptname, reverse)
if(GlobalVars.getBoolean(scriptname)) { Chat.actionbar(`§7[§5${scriptname}§7] §aenabled`) }
else { Chat.actionbar(`§7[§5${scriptname}§7] §cdisabled`) }


function main(){
    
    if(!GlobalVars.getBoolean(scriptname)) return
    const Close = JsMacros.on("Key", JavaWrapper.methodToJava(event => {
        if(event.key == "key.keyboard.escape" || event.key == KeyBind.getKeyBindings().get("key.inventory")){
            Close.off()
            GlobalVars.putBoolean(scriptname, false)
            Chat.actionbar(`§7[§5${scriptname}§7] §cdisabled`)
        }
    }))
    const EnchantTable = World.findBlocksMatching("minecraft:enchanting_table", 2).find(blockPos => {
        if(Player.getPlayer().distanceTo(blockPos) <= Distance){
            return blockPos
        }
    })
    while(GlobalVars.getBoolean(scriptname)){
        let count = 0
        if(Player.openInventory().getType() != "Enchanting Table"){
            Client.waitTick(QuitDelay)
            if(!GlobalVars.getBoolean(scriptname)) break
            Player.getInteractionManager().interactBlock(EnchantTable.getX(), EnchantTable.getY(), EnchantTable.getZ(), "up", false)
            while(Player.openInventory().getType() != "Enchanting Table"){
                Client.waitTick(Delay)
            }
            let inv = Player.openInventory()
            while(Player.openInventory().getType() == "Enchanting Table" && GlobalVars.getBoolean(scriptname)){
                //附魔槽位是否可以附魔
                if(!inv.getItemToEnchant().isEnchantable()){
                    //不能附魔且有东西（产物），丢出
                    if(!inv.getItemToEnchant().isEmpty()){
                        if(InventoryFirst && inv.findFreeInventorySlot() != -1){
                            inv.quick(0)
                            Client.waitTick(Delay)
                        }else{
                            inv.dropSlot(0)
                            Client.waitTick(Delay)
                        }
                        
                    }
                    //放入待附魔物品
                    if(inv.findItem(TargetItem)[0]){
                        inv.quick(inv.findItem(TargetItem)[0])
                        Client.waitTick(Delay)
                    }
                }
                //青金石是否足够
                if(inv.getLapis().getCount() < (count>0?EnchantIndex:FirstIndex) + 1) {
                    if(inv.findItem("minecraft:lapis_lazuli").find(slot => { if( slot > 1 ) return slot })){
                        inv.quick(inv.findItem("minecraft:lapis_lazuli").find(slot => { if( slot > 1 ) return slot }))
                        Client.waitTick(Delay)
                        continue
                    }
                }
                //可附魔
                if(inv.getItemToEnchant().isEnchantable()){
                    //经验>30级
                    if(Player.getPlayer().getXPLevel() < 30){
                        Client.waitTick(Delay)
                        continue
                    }
                    inv.doEnchant(count>0?EnchantIndex:FirstIndex)
                    count ++
                    Chat.actionbar(`附魔:${count}个物品`)
                    Client.waitTick(Delay > 0 ? Delay:1)
                    //请不要修改，速度过快会导致一些不可修复的问题。具体见下方
                    //Caused by: java.lang.IllegalStateException: Accessing LegacyRandomSource from multiple threads
                }
            }
        }
    }
}
main()