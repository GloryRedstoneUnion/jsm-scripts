//  README!  //
// 在左侧下界砖上面启动 可以开伪潜行
// 开平坦挖掘和禁挖下界砖！

const scriptname = "BlazeCutter";
// const reverse = !GlobalVars.getBoolean(scriptname);
const debug_mode = false;
var p = Player.getPlayer();
const i = Player.getInteractionManager();

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
  place_frame(startupCtx);
}

// Init
function init() {
  Chat.say("#setting allowBreak false");
  Time.sleep(500);
  init_pos = p!.getPos().add(0, -1, 0).toBlockPos().toPos3D();
  log_info(init_pos.toString());
}

// Step 1
function place_frame(ctx: TaskContext): StepResult {
  init();
  // SubStep 1
  function init() {
    goto(init_pos.add(0, 1, 0).toBlockPos(), newP(0.2, 0, 0.5));
    look(90, 80);
    Time.sleep(500);
    if (!verify_item("Obsidian", 2)) {
      log_err("未检测到黑曜石");
      return StepResult.FATAL;
    }
    // i?.interactBlock()
  }
  return StepResult.SUCCESS;
}

// Tool Functions
function verify_item(item: string, hotbar = 0): boolean {
  if (hotbar == 0) return p!.getMainHand().getName().getString() == item;
  const inv = Player.openInventory();
  // Chat.log(hotbar);
  // Chat.log(
  //   inv
  //     .getSlot(hotbar + 35)
  //     .getName()
  //     .getString(),
  // );
  return (
    inv
      .getSlot(hotbar + 35)
      .getName()
      .getString() == item
  );
}

function verify_block(name: string, d: BlockPosHelper, delta = true): boolean {
  var pos: Pos3D;
  if (delta) {
    pos = p!.getPos().toBlockPos().toPos3D();
    pos.add(d.toPos3D());
  } else {
    pos = d.toPos3D();
  }
  return World.getBlock(pos)?.getId() == "minecraft:" + name;
}

function goto(
  i: BlockPosHelper,
  d: Pos3D = PositionCommon.createPos(0.5, 0, 0.5),
) {
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

enum direction {
  L = 1,
  R = 2,
  FWD = 0,
  REV = -1,
}

function d2Input(d: direction): [int, int] {
  switch (d) {
    case direction.L:
      return [0, 1];

    case direction.R:
      return [0, -1];

    case direction.FWD:
      return [1, 0];

    case direction.REV:
      return [-1, 0];
  }
}

function go_x(x: int, dx: number = 0.5, d: direction = direction.FWD) {
  const s = refresh();
  const r = s!.getPos().toBlockPos().toPos3D().x;
  const [a, b] = d2Input(d);

  while (
    Math.abs(Math.abs(refresh()!.getPos().x - r) - Math.abs(x) - dx) > 0.7
  ) {
    Player.addInput(Player.createPlayerInput(a, b, p!.getYaw()));
    // Player.addInput(Player.createPlayerInput(1, 0, p!.getYaw()));
    Time.sleep(50);
  }
  Player.clearInputs();
  Time.sleep(350);
  p!.setPos(r + x + dx, s!.getPos().y, s!.getPos().z);
}

function go_z(z: int, dz: number = 0.5, d: direction = direction.FWD) {
  const s = refresh();
  const r = s!.getPos().toBlockPos().toPos3D().z;
  const [a, b] = d2Input(d);

  while (
    Math.abs(Math.abs(refresh()!.getPos().z - r) - Math.abs(z) - dz) > 0.7
  ) {
    Player.addInput(Player.createPlayerInput(a, b, p!.getYaw()));
    // Player.addInput(Player.createPlayerInput(1, 0, p!.getYaw()));
    Time.sleep(50);
  }
  Player.clearInputs();
  Time.sleep(350);
  p!.setPos(s!.getPos().x, s!.getPos().y, r + z + dz);
}

function setPos(
  x: number | null,
  y: number | null,
  z: number | null,
  d = true,
) {
  refresh();
  if (!d) {
    p!.setPos(
      x === null ? p!.getPos().x : x,
      y === null ? p!.getPos().y : y,
      z === null ? p!.getPos().z : z,
    );
  } else {
    p!.setPos(
      p!.getPos().x + (x === null ? 0 : x),
      p!.getPos().y + (y === null ? 0 : y),
      p!.getPos().z + (z === null ? 0 : z),
    );
  }
}

function newPb(x: int, y: int, z: int): BlockPosHelper {
  return PositionCommon.createBlockPos(x, y, z);
}

function newP(x: double, y: double, z: double): Pos3D {
  return PositionCommon.createPos(x, y, z);
}

function refresh(): ClientPlayerEntityHelper | null {
  p = Player.getPlayer();
  return p;
}

function look(a: number, b: number) {
  Chat.say(`/clook angles ${a} ${b}`);
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
