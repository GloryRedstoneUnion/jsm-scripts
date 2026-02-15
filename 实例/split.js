const clickDelay = 0
const splitDelay = 0
const cycleDelay = 20

const minCount = 171

const inv = Player.openInventory()

const air = "minecraft:air"
const containerName = "尘埃制造机"
const EnableContainerName = false
var material = ""

var containerEmptySlots = []
var materialSlots = new Map()
var emptySlots = []

var inventorySlots = inv.getSlots("main").concat(inv.getSlots("hotbar"))
var containerSlots = inv.getSlots("container")

function init() {

    material = ""
    containerEmptySlots = []
    materialSlots = new Map()
    emptySlots = []

    if(inv.getContainerTitle() != containerName&&EnableContainerName)return
    let itemCount = inv.getItemCount()
    let maxValue = 0
    
    itemCount.forEach((key, value) => {
        if ((value > maxValue)&&value>=minCount) {
            maxValue = value;
            material = key;
        }
    });//获取最多的物品material
    //Chat.log(material)
    containerSlots.forEach(value => {
        if(inv.getSlot(value).getItemId() == air) {
            containerEmptySlots.push(value)
        }
    });
    inventorySlots.forEach(value => {
        if(inv.getSlot(value).getItemId() == material) {
            materialSlots.set(value,inv.getSlot(value).getCount())
        }
        if(inv.getSlot(value).getItemId() == air) {
            emptySlots.push(value)
        }
    });
}
function update(){

    let itemCount = inv.getItemCount()
    let maxValue = 0

    material = ""
    materialSlots = new Map()
    emptySlots = []

    itemCount.forEach((key, value) => {
        if ((value > maxValue)&&value>170) {
            maxValue = value;
            material = key;
        }
    });//获取最多的物品material

    inventorySlots.forEach(value => {
        if(inv.getSlot(value).getItemId() == material) {
            materialSlots.set(value,inv.getSlot(value).getCount())
        }
        if(inv.getSlot(value).getItemId() == air) {
            emptySlots.push(value)
        }
    });
}
function pickup(){

    let maxValue = 0
    let slot = 36
    materialSlots.forEach((value, key) => {
        if ((value > maxValue)) {
            maxValue = value;
            slot = key;
        }
    });
    inv.click(slot,0)
    Client.waitTick(clickDelay)
    materialSlots.delete(slot)
    emptySlots.push(slot)
}
function putdown(){
    materialSlots.forEach((value, key) => {
        if(value<64){
            if(inv.getHeld().getCount()>0){
                inv.click(key,0)
                Client.waitTick(clickDelay)
            }
        }
    });
    if(inv.getHeld().getCount()>0){
        if(emptySlots.length>0){
            let slot = emptySlots.pop()
            inv.click(slot,0)
            Client.waitTick(clickDelay)
        }
        if(inv.getHeld().getCount()>0){
            inv.click(-999,0)
            Client.waitTick(clickDelay)
        }
    }
}
function split(task){
    if(!Player.openInventory().isContainer()||task.length<=0) return
    update()
    pickup()
    inv.dragClick(task,1)
    update()
    putdown()
}
function main() {
let task = [...containerEmptySlots]
task.pop()
while(Player.openInventory().isContainer()) {
    split(task)
    task.pop()
    Client.waitTick(splitDelay)
    if(task.length == 0){
        task = containerEmptySlots
        split(task)
        break
    }
}

}
function cycle(){
    if(GlobalVars.getBoolean("splitIsRunning")) return
    GlobalVars.putBoolean("splitIsRunning", true);
    while(Player.openInventory().isContainer()){
        if(inv.getContainerTitle() != containerName&&EnableContainerName) break
        init()
        if(material == "") break
        main()
        Client.waitTick(cycleDelay)
    }
    GlobalVars.putBoolean("splitIsRunning", false)
}
cycle()


