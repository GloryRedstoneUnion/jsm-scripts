val scriptname = "EnhancingSiteHelper"
val reverse = !GlobalVars.getBoolean(scriptname)
GlobalVars.putBoolean(scriptname, reverse)
Chat.actionbar(
  "§7[§5${scriptname}§7] ${if(GlobalVars.getBoolean(scriptname)) "§aenabled" else "§cdisabled"}",
)
main()
fun main() {
  if (!GlobalVars.getBoolean(scriptname)) return
  // const Listener = JsMacros.on("Event", JavaWrapper.methodToJava(event => {
  //     Chat.log("事件：${event}")
  // }))
  while (GlobalVars.getBoolean(scriptname)) {
    Chat.log("正在运行${scriptname}")
    Client.waitTick(20)
  }
  //Listener.off()
}

fun remove_enhance() {
  Chat.log("[func] remove_enhance start")
  val b = rayBlock()
}

fun traverse_chest(b, operation) {
  if (!is_id(b, "chest")) return -1
}

fun is_id(b, id) = b != null && b.getId() != null && b.getId() == "minecraft:" + id

fun rayBlock() = Player.rayTraceBlock(8, false)

