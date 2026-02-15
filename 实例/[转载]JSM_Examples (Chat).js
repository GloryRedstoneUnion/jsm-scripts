/*  转载自JsMacros的discord频道, 外国大佬写的聊天各类功示例

原文本: 
I made this script like a year ago but never posted it here. It's a simple script that doesn't do anything useful, lol, but just shows how basic things work.
Maybe it'll be useful for newbies.

作者: ╲⎝⧹尺卂乙尺匚尺卂千ㄒ⧸⎠╱ 2025.2.19
*/

/**
 * JSMacros Examples
 * @description Simple examples of some Chat methods and a few related events, that show how to 
 * set and get chat messages, title, subtitle, actionbar, and toast.
 * @author RazrCraft
 * @borrows some code from other users on the JSMacros Discord server. :P
 * @since 2024-02-25
 * @todo BossBar stuff
 */

// Just an example variable to be used in some methods
let str = "JSMacros"

/* 
    Library: Chat
    Class: xyz.wagyourtail.jsmacros.client.api.library.impl.FChat extends BaseLibrary
*/

// -=*=- Methods -=*=-

/**
 * @name log
 * @description Display a message in chat locally, it is not sent.
 * @param message Object - the message to log
 */
Chat.log("This is a local message in the chat.")

/**
 * @name logf
 * @description Logs the formatted message to the player's chat. The message is formatted using the 
 * default java {@link https://docs.oracle.com/javase/8/docs/api/index.html?java/lang/String.html String#format(java.lang.String,java.lang.Object...)} syntax.
 * @param message String - the message to format and log
 * @param args Object[] - the arguments used to format the message
 */
Chat.logf("This is a formatted message. %s is great!", str)

/**
 * @name logColor
 * @description log with auto wrapping with {@link https://jsmacros.wagyourtail.xyz/?/1.9.0/xyz/wagyourtail/jsmacros/client/api/library/impl/FChat.html#ampersandToSectionSymbol-String- FChat#ampersandToSectionSymbol(java.lang.String)}
 * @param message String - the message to log
 */
Chat.logColor("&aThis is a local message in the chat with green color.")

/**
 * @name say
 * @description Say to server as player.
 * @param message String 
 */
Chat.say("This is a message sent to the server. And you can also send commands.")
Chat.say("/list")

/**
 * @name sayf
 * @description Sends the formatted message to the server. The message is formatted using the 
 * default java {@link https://docs.oracle.com/javase/8/docs/api/index.html?java/lang/String.html String#format(java.lang.String,java.lang.Object...)} syntax.
 * @param message String - the message to format and send to the server
 * @param args Object[] - the arguments used to format the message
 */
Chat.sayf("This is a formatted message sent to the server, using %s.", str)

/**
 * @name title
 * @description Display a Title to the player.
 * @param title Object 
 * @param subtitle Object 
 * @param fadeIn int 
 * @param remain int 
 * @param fadeOut int 
 */
Chat.title('§4Red title','§cRed subtitle', 10, 10, 10)
const blue = [
    Chat.createTextHelperFromJSON(JSON.stringify({"text":"Blue title","color":"dark_blue"})),
    Chat.createTextHelperFromJSON(JSON.stringify({"text":"This is a blue subtitle","color":"blue"})),
]
Chat.title(blue[0], blue[1], 10, 10, 10)
const green = [
    Chat.createTextBuilder()
        .withColor(0,100,0)
        .append('Green title')
        .build(),
    Chat.createTextBuilder()
        .withColor(100, 255, 100)
        .append('This is a green subtitle')
        .build()
]
Chat.title(green[0], green[1], 10, 10, 10)

/**
 * @name actionbar
 * @description Display text in the Actionbar
 * @param text Object 
 */
Chat.actionbar("This is the ActionBar")

/**
 * @name actionbar
 * @description Display the smaller title that's above the actionbar.
 * @param text Object
 * @param tinted boolean
 */
Chat.actionbar("This is the ActionBar again", true)

/**
 * @name toast
 * @description Display a toast.
 * @param title Object
 * @param desc Object
 */
Chat.toast("Toast title", "This is a toast description")


// -=*=- Related Events -=*=-

/**
 * @event SendMessage
 * @description Triggered when you send something in the chat.
 * @field message String 
 * @see https://jsmacros.wagyourtail.xyz/?/1.9.0/xyz/wagyourtail/jsmacros/client/api/event/impl/EventSendMessage.html
 */
const smListener = JsMacros.on("SendMessage", true, JavaWrapper.methodToJava((e) => {
    const message = e.message

}));

/**
 * @event RecvMessage
 * @description Triggered when you receive something in the chat.
 * @field text TextHelper
 * @field signature byte[]
 * @field messageType String 
 * @see https://jsmacros.wagyourtail.xyz/?/1.9.0/xyz/wagyourtail/jsmacros/client/api/event/impl/EventRecvMessage.html
 */
const rmListener = JsMacros.on("RecvMessage", true, JavaWrapper.methodToJava((e) => {
    const text = e.text
    const signature = e.signature
    const messageType = e.messageType

}));

/**
 * @event Title
 * @description Triggered when the title is displayed.
 * @field type String - Possible values: 'TITLE' | 'SUBTITLE' | 'ACTIONBAR'"
 * @field message TextHelper
 * @see https://jsmacros.wagyourtail.xyz/?/1.9.0/xyz/wagyourtail/jsmacros/client/api/event/impl/EventTitle.html
 */
const tListener = JsMacros.on("Title", true, JavaWrapper.methodToJava((e) => {
    const type = e.type
    const message = e.message

    Chat.logColor(`&bEvent Title&f: The type is &9${type}&f and the message is &a${message}&f.`)

}));


// @ts-ignore
event.stopListener = JavaWrapper.methodToJava(() => {
    JsMacros.off(smListener)
    JsMacros.off(rmListener)
    JsMacros.off(tListener)
});

// Test Tittle Event
Time.sleep(1000);
Chat.say('/title @a title "Title"');
Chat.say('/title @a subtitle "Subtitle"');
