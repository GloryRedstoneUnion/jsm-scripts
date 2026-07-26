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
    init_pos = p.getPos().add(0, -1, 0).toBlockPos().toPos3D();
    log_info(init_pos.toString());
    goto(init_pos.toBlockPos(), newP(0, 0, 0));
  }
  function goto(q, d) {
    var p2 = q.toPos3D();
    Chat.say(`#goto ${p2.x.toString()} ${p2.y.toString()} ${p2.z.toString()}`);
  }
  function newP(x, y, z) {
    return PositionCommon.createPos(x, y, z);
  }
  function log_info(str, say = false) {
    const s = `\xA77[\xA75${scriptname}\xA77] INFO|` + str;
    if (say) Chat.say(s);
    else Chat.log(s);
  }
})();
