var isEating = false
const autoEat = () => {
    if (isEating)
        return
    var _player = Player.getPlayer()
    var _foodLevel = 15
    
    if (_player.getFoodLevel() < _foodLevel) {
        if (_player.getOffHand().isFood()) {
            KeyBind.pressKey('key.mouse.right')
            isEating = true
            while (_player.getFoodLevel() < 20 && _player.getOffHand().isFood()) {
                Client.waitTick(5)
            }
            KeyBind.releaseKey('key.mouse.right')
            isEating = false
            Chat.log('[Auto Eat] 食用' + _player.getOffHand().getName().getString())
        } else {
            Chat.log('[Auto Eat] 食物不足')
        }
    }
}

const tickListener = JsMacros.on("Tick", JavaWrapper.methodToJava(() => {
    autoEat()
    Client.waitTick(10)
}))

