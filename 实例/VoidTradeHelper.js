const Collections = Java.type("java.util.Collections");
const MerchantScreen = Java.type("net.minecraft.class_492");
const GuiUtils = Java.type("fi.dy.masa.malilib.util.GuiUtils");
const InventoryUtils = Java.type("fi.dy.masa.itemscroller.util.InventoryUtils");
const VillagerDataStorage = Java.type("fi.dy.masa.itemscroller.villager.VillagerDataStorage");
const backCommand = "/back";
let interacted = false;
let tick = 85;
const tickListener = JsMacros.on("Tick", JavaWrapper.methodToJava(() => {
    if (interacted)
        return;
    const player = Player.getPlayer();
    const im = Player.getInteractionManager();
    const villagers = World.getEntities(JavaWrapper.methodToJava((entity) => {
        return entity.distanceTo(player) < 6 && entity.getType() === "minecraft:villager" && entity.asVillager().getProfession() !== "none" && entity.asVillager().getProfession() !== "nitwit";
    }));
    if (!villagers.isEmpty()) {
        Collections.sort(villagers, (v1, v2) => v1.distanceTo(player) > v2.distanceTo(player) ? 1 : -1);
        const villager = villagers.get(0);
        interacted = true;
        im.interactEntity(villager, false);
        Chat.say(backCommand);
        Client.waitTick(tick);
        trade();
        Chat.say(backCommand);
        interacted = false;
    }
}));

event.stopListener = JavaWrapper.methodToJava(() => {
    JsMacros.off(tickListener);
});
function trade() {
    const currentScreen = GuiUtils.getCurrentScreen();
    if (currentScreen instanceof MerchantScreen) {
        const container = currentScreen.method_17577();
        const favorites = VillagerDataStorage.getInstance().getFavoritesForCurrentVillager(container).favorites;
        if (!favorites.isEmpty()) {
            InventoryUtils.villagerTradeEverythingPossibleWithAllFavoritedTrades();
        }
    }
}
