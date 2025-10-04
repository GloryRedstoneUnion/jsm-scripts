while (true) {
KeyBind.keyBind("key.use",false)
Client.waitTick(2)
KeyBind.keyBind("key.back",true)
Client.waitTick(20)
//Time.sleep(1000)
KeyBind.keyBind("key.back",false)
Client.waitTick(2)
KeyBind.keyBind("key.use",true)
Client.waitTick(150)
//Player.moveBackward(0)
//Player.getPlayer().
}