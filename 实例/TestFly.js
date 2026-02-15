const state = !GlobalVars.getBoolean("TestFly");
GlobalVars.putBoolean("TestFly", state);
const abilities = Player.getPlayer().getAbilities()
abilities.setAllowFlying(state)
if(!state) abilities.setFlying(false)