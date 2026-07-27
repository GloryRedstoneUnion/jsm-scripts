(() => {
  // scripts/切门/烈焰人.ts
  var scriptname = "BlazeCutter";
  var p = Player.getPlayer();
  main();
  var init_pos = p.getPos().add(0, -1, 0).toBlockPos().toPos3D();
  function main() {
    init();
    const startupCtx = {
      currentStepIndex: 0,
      currentSubStepIndex: 0,
      retryCount: 0,
      maxRetries: 5,
      targetPos: init_pos
    };
    place_frame(startupCtx);
  }
  function init() {
    Chat.say("#setting allowBreak false");
    Time.sleep(500);
    init_pos = p.getPos().add(0, -1, 0).toBlockPos().toPos3D();
    log_info(init_pos.toString());
  }
  function place_frame(ctx) {
    init2();
    function init2() {
      goto(init_pos.add(0, 1, 0).toBlockPos(), newP(0.2, 0, 0.5));
      look(90, 80);
      Time.sleep(500);
      if (!verify_item("Obsidian", 2)) {
        log_err("\u672A\u68C0\u6D4B\u5230\u9ED1\u66DC\u77F3");
        return "FATAL" /* FATAL */;
      }
    }
    return "SUCCESS" /* SUCCESS */;
  }
  function verify_item(item, hotbar = 0) {
    if (hotbar == 0) return p.getMainHand().getName().getString() == item;
    const inv = Player.openInventory();
    return inv.getSlot(hotbar + 35).getName().getString() == item;
  }
  function goto(i, d = PositionCommon.createPos(0.5, 0, 0.5)) {
    var q = i.toPos3D();
    var s = p.getPos();
    Chat.say(`#goto ${q.x.toString()} ${q.y.toString()} ${q.z.toString()}`);
    while (Math.abs(s.x - q.x - d.x) > 0.7 || Math.abs(s.z - q.z - d.z) > 0.7 || Math.abs(s.y - q.y) > 0) {
      Time.sleep(50);
      refresh();
      s = p.getPos();
    }
    Chat.say("#stop");
    Time.sleep(350);
    p.setPos(q.add(d.x, 0, d.z));
  }
  function newP(x, y, z) {
    return PositionCommon.createPos(x, y, z);
  }
  function refresh() {
    p = Player.getPlayer();
    return p;
  }
  function look(a, b) {
    Chat.say(`/clook angles ${a} ${b}`);
  }
  function log_info(str, say = false) {
    const s = `\xA77[\xA75${scriptname}\xA77] INFO|` + str;
    if (say) Chat.say(s);
    else Chat.log(s);
  }
  function log_err(str, say = false) {
    const s = `\xA77[\xA75${scriptname}\xA77] ERROR|` + str;
    if (say) Chat.say(s);
    else Chat.log(s);
  }
})();
