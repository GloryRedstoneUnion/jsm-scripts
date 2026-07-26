//  README!  //
// 在左侧下界砖上面启动 可以开伪潜行
// 开平坦挖掘和禁挖下界砖！

const scriptname = "BlazeCutter";
const reverse = !GlobalVars.getBoolean(scriptname);
const debug_mode = false;
const p = Player.getPlayer();

GlobalVars.putBoolean(scriptname, reverse);
Chat.actionbar(
  `§7[§5${scriptname}§7] ${GlobalVars.getBoolean(scriptname) ? `§aenabled` : `§cdisabled`}`,
);
// main();
// function main() {
//   if (!GlobalVars.getBoolean(scriptname)) return;
//   // const Listener = JsMacros.on("Event", JavaWrapper.methodToJava(event => {
//   //     Chat.log(`事件：${event}`)
//   // }))
//   while (GlobalVars.getBoolean(scriptname)) {
//     Chat.log(`正在运行${scriptname}`);
//     Client.waitTick(20);
//   }
//   //Listener.off()
// }

enum StepResult {
  SUCCESS = "SUCCESS", // 进入下一步
  RETRY = "RETRY", // 但允许重试
  FATAL = "FATAL", // 必须终止
  ABORT = "ABORT", // 主动中断
}

interface TaskContext {
  currentStepIndex: number;
  currentSubStepIndex: number;
  retryCount: number;
  maxRetries: number;
  targetPos: { x: number; y: number; z: number }; // 示例：目标位置
}

type StepFunction = (ctx: TaskContext) => StepResult;

const init_pos: Pos3D = p!.getPos();

// Init
function init() {}

// Step 1
function place_frame(ctx: TaskContext): StepResult {
  return StepResult.SUCCESS;
}

// Tool Functions
function verify_item(item: string, hotbar = 0): boolean {
  if ((hotbar = 0))
    return p?.getMainHand().getName().toString() == "minecraft:" + item;
  const inv = Player.openInventory();
  return (
    inv
      .getSlot(hotbar + 27)
      .getName()
      .toString() ==
    "minecraft:" + item
  );
}

function verify_block(
  name: string,
  dx: number,
  dy: number,
  dz: number,
  delta = true,
): boolean {
  var pos: Pos3D;
  if (delta) {
    pos = p!.getPos().toBlockPos().toPos3D();
    pos.add(dx, dy, dz);
  } else {
    pos = PositionCommon.createBlockPos(dx, dy, dz).toPos3D();
  }
  return World.getBlock(pos)?.getId() == "minecraft:" + name;
}

function pb_backup() {
  log_info("脚本自动备份", true);
  Chat.say("!!pb make 烈焰人自动备份");
}

function log_info(str: string, say = false) {
  const s = "§7[§5${scriptname}§7] INFO|" + str;
  if (say) Chat.say(s);
  else Chat.log(s);
}
function log_err(str: string, say = false) {
  const s = "§7[§5${scriptname}§7] ERROR|" + str;
  if (say) Chat.say(s);
  else Chat.log(s);
}
function log_warn(str: string, say = false) {
  const s = "§7[§5${scriptname}§7] WARN|" + str;
  if (say) Chat.say(s);
  else Chat.log(s);
}
function log_debug(str: string, say = false) {
  if (!debug_mode) return;
  const s = "§7[§5${scriptname}§7] DEBUG|" + str;
  if (say) Chat.say(s);
  else Chat.log(s);
}
