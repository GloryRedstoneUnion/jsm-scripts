//  README!  //
// 在左侧下界砖上面启动 可以开伪潜行
// 开平坦挖掘和禁挖下界砖！

const scriptname = "BlazeCutter";
// const reverse = !GlobalVars.getBoolean(scriptname);
const debug_mode = false;
var p = Player.getPlayer();

// GlobalVars.putBoolean(scriptname, reverse);
// Chat.actionbar(
//   `§7[§5${scriptname}§7] ${GlobalVars.getBoolean(scriptname) ? `§aenabled` : `§cdisabled`}`,
// );
main();
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
  targetPos: Pos3D;
}

type StepFunction = (ctx: TaskContext) => StepResult;

var init_pos: Pos3D = p!.getPos().add(0, -1, 0).toBlockPos().toPos3D();

function main() {
  init();
  const startupCtx: TaskContext = {
    currentStepIndex: 0,
    currentSubStepIndex: 0,
    retryCount: 0,
    maxRetries: 5,
    targetPos: init_pos,
  };
}

// Init
function init() {
  Chat.say("#setting allowBreak false");
  Time.sleep(500);
  init_pos = p!.getPos().add(0, -1, 0).toBlockPos().toPos3D();
  log_info(init_pos.toString());
  goto(init_pos.add(10, 1, 0).toBlockPos(), newP(0, 0, 0));
}

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
    pos = newPb(dx, dy, dz).toPos3D();
  }
  return World.getBlock(pos)?.getId() == "minecraft:" + name;
}

function goto(i: BlockPosHelper, d: Pos3D) {
  var q = i.toPos3D();
  var s = p!.getPos();
  Chat.say(`#goto ${q.x.toString()} ${q.y.toString()} ${q.z.toString()}`);
  while (
    Math.abs(s.x - q.x - d.x) > 0.7 ||
    Math.abs(s.z - q.z - d.z) > 0.7 ||
    Math.abs(s.y - q.y) > 0
  ) {
    Time.sleep(50);
    refresh();
    s = p!.getPos();
    // Chat.log(s.toString());
    // Chat.log(s.x - q.x - d.x);
    // Chat.log(s.z - q.z - d.z);
    // Chat.log(s.y - q.y);
  }
  Chat.say("#stop");
  Time.sleep(350);
  p!.setPos(q.add(d.x, 0, d.z));
}

function newPb(x: int, y: int, z: int): BlockPosHelper {
  return PositionCommon.createBlockPos(x, y, z);
}

function newP(x: double, y: double, z: double): Pos3D {
  return PositionCommon.createPos(x, y, z);
}

function refresh() {
  p = Player.getPlayer();
}

function pb_backup() {
  log_info("脚本自动备份", true);
  Chat.say("!!pb make 烈焰人自动备份");
}

function log_info(str: string, say = false) {
  const s = `§7[§5${scriptname}§7] INFO|` + str;
  if (say) Chat.say(s);
  else Chat.log(s);
}
function log_err(str: string, say = false) {
  const s = `§7[§5${scriptname}§7] ERROR|` + str;
  if (say) Chat.say(s);
  else Chat.log(s);
}
function log_warn(str: string, say = false) {
  const s = `§7[§5${scriptname}§7] WARN|` + str;
  if (say) Chat.say(s);
  else Chat.log(s);
}
function log_debug(str: string, say = false) {
  if (!debug_mode) return;
  const s = `§7[§5${scriptname}§7] DEBUG|` + str;
  if (say) Chat.say(s);
  else Chat.log(s);
}
