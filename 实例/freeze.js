const reverse = !GlobalVars.getBoolean("freeze");
GlobalVars.putBoolean("freeze", reverse);
if (reverse) {
    Chat.say("/tick freeze")
} else {
    Chat.say("/tick unfreeze")
}