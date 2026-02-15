var _player = Player.getPlayer()
var _foodLevel = 10

if (_player.getFoodLevel() < _foodLevel) {
    if (Player.getPlayer().getOffHand().isFood()) {
        KeyBind.key('key.mouse.right', true)
        while (_player.getFoodLevel() < 20) {
            Client.waitTick(5)
        }
        KeyBind.key('key.mouse.right', false)
        Chat.log('[Auto Eat] 食用' + Player.getPlayer().getOffHand().getName().getString())
    } else {
        Chat.log('[Auto Eat] 食物不足')
    }
}
