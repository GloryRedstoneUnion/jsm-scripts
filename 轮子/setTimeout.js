function setTimeout(callback, ms) {
    JavaWrapper.methodToJavaAsync(() => {
        Time.sleep(ms);
        callback();
    }).run();
}

// 示例
setTimeout(() => {
    Chat.log("1");
}, 1000);

setTimeout(say, 1000);

function say(){
    Chat.log("2")
}