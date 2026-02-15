const FILL_CONTRNIS_TITLE = "原始物质制造器";
const COMMON_TITLE= "合成"
const MAX_COUNT = 36
const ROWS=4;
function getAndMoveOne(SlotA,SlotB){
    Player.openInventory().click(SlotA,0) ;
    Player.openInventory().click(SlotB,1) ;
    //1是每个格子分配一个
    //0是均分
    Player.openInventory().click(SlotA,0) ;
}
function getAndMoveMulti(SlotA,SlotB,Num){
    
    var num2=Player.openInventory().getSlot(SlotA).getCount();
    var num3=Num;
    Num=Math.min(Num,num2);
    var left=0;
    

    if(Num<num3){
        left=num3-Num
    }
    Player.openInventory().click(SlotA,0) ;
    for( let i=0;i<Num;++i){
    Player.openInventory().click(SlotB,1) ;
    }
    //1是每个格子分配一个
    //0是均分
    Player.openInventory().click(SlotA,0) ;
    Client.waitTick(2);
    //自定义延迟
    return left;
}
function getIdSlot(Id){
    var slots= Player.openInventory().findItem(Id)
    if (slots.length<=0){
       return -1;
    }
    else{
        for(let i=0;i<slots.length;++i){
            if (slots[i]>=9*ROWS){
                return slots[i];
            }
        }
        return -1;
    }
}
function getIdAndMove(Id,SlotB,Num){

        var i3=getIdSlot(Id);
    if (i3==-1){
        return -1;
    }
    Num=getAndMoveMulti(i3,SlotB,Num);
      
    
    while(Num>0){
        Client.waitTick(1);
 
            var i3=getIdSlot(Id);
            if (i3==-1){
                return -1;
            }
      
        Num=getAndMoveMulti(i3,SlotB,Num);
      
        
    }
    return 0;
}
function waitUntilOpen(){
    while (COMMON_TITLE == Player.openInventory().getContainerTitle()) {
        Client.waitTick(5);
      }
}
function checkTitle(Title){
    if(Player.openInventory().getContainerTitle()==Title){
        return true ;
    }
    else return false;
}
function ErrorTitle(Title){
    if(Player.openInventory().getContainerTitle()!=Title){
        throw new Error("已关闭界面")
    }
}
function checkIfOver(){
    var i1=Player.openInventory().findItem("minecraft:end_crystal");
    var i2=Player.openInventory().findItem("minecraft:wheat_seeds");
    if(i1.length>0 && i1[0]<36){
        //player.openInventory().dropSlot(i1[0]);
        return true
    }
    else if (i2.length>0 && i2[0]<36){
        return true
    }
    else return false;
}
function checkSlotNum(slot,num){
    if(Player.openInventory().getSlot(slot).getCount()!=num){
        return false;
    }
    return true;
}
function main(){

    waitUntilOpen();
    while(true){
        if(checkTitle(FILL_CONTRNIS_TITLE)){
            for (let i=0;i<9*ROWS;++i){
                if (Player.openInventory().getSlot(i).getItemId()!="minecraft:air"){
                    Player.openInventory().dropSlot(i,true);
                    
                }
            }
            if(Player.openInventory().getContainerTitle()!=FILL_CONTRNIS_TITLE){
                return 0;
            }
            //Client.waitTick(10);
            for(let i=0;i<3;++i){
                for(let j=0;j<9;++j){
                    var slotid=9*i+j;
                   var num_s=10-(j+1)
                   
                    if(getIdAndMove("minecraft:cobblestone",slotid,num_s)==-1){
                        return -1;
                    }
                    //Client.waitTick(2);
                  

                    
                    if(Player.openInventory().getContainerTitle()!=FILL_CONTRNIS_TITLE){
                        return 0;
                    }
                }
            }
            while(!checkIfOver()){
                Client.waitTick(4);
                if(Player.openInventory().getContainerTitle()!=FILL_CONTRNIS_TITLE){
                    return 0;
                }
            }
            
            if(Player.openInventory().getContainerTitle()!=FILL_CONTRNIS_TITLE){
                return 0;
            }
            Client.waitTick(15);
        }
        else break; 
    }
    return 0;
    
}
var a=main();
Chat .log("main func return with "+a.toString());
