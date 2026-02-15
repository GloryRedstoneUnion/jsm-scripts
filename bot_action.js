// /player bot_jz1_1 kill

function for_runner(func, start, statement, iterator) {
    a = start
    Chat.log(start)
    // Chat.log(a)
    while (statement(a)){
        Chat.log(a)
        func(a)
        a = iterator(a)
    }
}

function bot_a(a, b, c){
    Chat.say("/player bot_jz" + a + "_" + b + " " + c)
}


function bot_a_kill_all(){
    bot_a_kill_row(1)
    bot_a_kill_row(2)
    bot_a_kill_row(3)
    bot_a_kill_row(4)
    bot_a_kill_row(5)
}

function bot_a_kill_row(n){
    for_runner(function(a){bot_a(a, n, "kill")}, 1, function(a){return a<=5}, function(a){return a+1})
}

function main(){
    Chat.log("start")
    bot_a_kill_all()
}

main()
