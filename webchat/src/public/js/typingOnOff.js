function TypingOn(divId){
    let targetId = $(`#write-chat-${divId}`).data("chat");
    if($(`#write-chat-${divId}`).hasClass("chat-in-group")){
        socket.emit("user-is-typing",{groupId:targetId});
    }else{
        socket.emit("user-is-typing",{contactId:targetId});
    }
}

function TypingOff(divId){
    let targetId = $(`#write-chat-${divId}`).data("chat");
      // bac typing off
    if($(`#write-chat-${divId}`).hasClass("chat-in-group")){
        socket.emit("user-is-off-typing",{groupId:targetId});
    }else{
        socket.emit("user-is-off-typing",{contactId:targetId});
    }
}

$(document).ready(function(){
    // bat typing on
    socket.on("response-user-is-typing",function(response){
            let messageTyping = `<div class="bubble you bubble-typing-gif">
            <img src="/images/chat/typing.gif">
            </div>`;
            if(response.currentGroupId){
                if(response.currentUserId !== $("#navbar-user").data("uid")){
                    let check = $(`.chat[data-chat=${response.currentGroupId}]`).find("div.bubble-typing-gif");
                        if(check.length){
                            return false;
                        }
                    $(`.chat[data-chat=${response.currentGroupId}]`).append(messageTyping);
                    nineScrollRight(response.currentGroupId); // set lai thanh scroll 
                }
            }else{
                //console.log(response.currentUserId);
                let check = $(`.chat[data-chat=${response.currentUserId}]`).find("div.bubble-typing-gif");
                    if(check.length){
                        return false;
                    }
                $(`.chat[data-chat=${response.currentUserId}]`).append(messageTyping);
                nineScrollRight(response.currentUserId); // set lai thanh scroll 
            }    
    });
    // bat typing off
    socket.on("response-user-is-off-typing",function(response){
        if(response.currentGroupId){
            if(response.currentUserId !== $("#navbar-user").data("uid")){
                $(`.chat[data-chat=${response.currentGroupId}]`).find("div.bubble-typing-gif").remove();
                nineScrollRight(response.currentGroupId); // set lai thanh scroll 
            }
        }else{
            $(`.chat[data-chat=${response.currentUserId}]`).find("div.bubble-typing-gif").remove();
            nineScrollRight(response.currentUserId); // set lai thanh scroll 
        }
    });
});