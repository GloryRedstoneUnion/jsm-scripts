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
  }
  function init() {
    Chat.say("#setting allowBreak false");
    Time.sleep(500);
    init_pos = p.getPos().add(0, -1, 0).toBlockPos().toPos3D();
    log_info(init_pos.toString());
    goto(init_pos.add(10, 1, 0).toBlockPos(), newP(0, 0, 0));
  }
  function goto(i, d) {
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
  }
  function log_info(str, say = false) {
    const s = `\xA77[\xA75${scriptname}\xA77] INFO|` + str;
    if (say) Chat.say(s);
    else Chat.log(s);
  }
})();
