var scriptname = "fishing";
const reverse = !GlobalVars.getBoolean(scriptname);
GlobalVars.putBoolean(scriptname, reverse);
var flag = true
function main(){
    if(!GlobalVars.getBoolean(scriptname)) return;
    Chat.actionbar(scriptname + " enabled")
    const ScreenListener = JsMacros.on("OpenScreen", JavaWrapper.methodToJava(event => {
        if(event.screenName == "eos.moe.dragoncore.sl" && event.screen.getComponents().get("指针") != null){
            const screen = event.screen
            screen.getClass().getDeclaredMethods()
                for(let i=0;i<100;i++){
                    Chat.actionbar(`指针:${screen.getComponents().get("指针").getValue("x")},目标:${screen.getComponents().get("bg3").getValue("x")}`)
                    if(screen.getComponents().get("指针").getValue("x") >= screen.getComponents().get("bg3").getValue("x")){
                        screen.keyTyped_(" ",57)
                        break
                    }
                    Client.waitTick(1)
                }
        }
    }));


    const Close = JsMacros.on("Key", JavaWrapper.methodToJava(event => {
        //Chat.log(event)
        if(!GlobalVars.getBoolean(scriptname)){
            Chat.actionbar(scriptname + " disabled")
            JsMacros.off(ScreenListener)
            JsMacros.off(Close)
        }
    }));
}
main();
