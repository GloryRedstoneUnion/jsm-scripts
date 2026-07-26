const scriptname = "EnhancingSiteHelper";
const reverse = !GlobalVars.getBoolean(scriptname);
GlobalVars.putBoolean(scriptname, reverse);
Chat.actionbar(
  `§7[§5${scriptname}§7] ${GlobalVars.getBoolean(scriptname) ? `§aenabled` : `§cdisabled`}`,
);
main();
function main() {
  if (!GlobalVars.getBoolean(scriptname)) return;
  // const Listener = JsMacros.on("Event", JavaWrapper.methodToJava(event => {
  //     Chat.log(`事件：${event}`)
  // }))
  while (GlobalVars.getBoolean(scriptname)) {
    Chat.log(`正在运行${scriptname}`);
    Client.waitTick(20);
  }
  //Listener.off()
}

function remove_enhance() {
  Chat.log(`[func] remove_enhance start`);
  const b = rayBlock();
}

function traverse_chest(b, operation) {
  if (!is_id(b, "chest")) return -1;
}

function is_id(b, id) {
  return b != null && b.getId() != null && b.getId() == "minecraft:" + id;
}

function rayBlock() {
  return Player.rayTraceBlock(8, false);
}
