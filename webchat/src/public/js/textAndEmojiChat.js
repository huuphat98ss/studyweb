function textAndEmojiChat(divId){
    $(".emojionearea").unbind("keyup").on("keyup",function(element){
        let currentEmojioneArea = $(this);
        if(element.which === 13){
            let targetId = $(`#write-chat-${divId}`).data("chat");
            let messageVal = $(`#write-chat-${divId}`).val();

            if(!targetId.length || !messageVal.length){
                return false;
            }
            let dataTextEmojiforSend ={
                uid:targetId,
                messageVal:messageVal
            }
            if($(`#write-chat-${divId}`).hasClass("chat-in-group")){
                dataTextEmojiforSend.isChatGroup = true;
            }
            //console.log(targetId);
            //console.log(messageVal);
            //console.log(dataTextEmojiforSend);
            $.post("/message/add-new-text-emoji",dataTextEmojiforSend,function(data){
                //success
                // console.log(data);
                let dataToEmit ={
                    message: data.message,
                    sender: data.sender
                }// xuly socket
                let messageOfme = $(`<div class="bubble me" data-mess-id="${data.message._id}"><span class="notif-chat"></span></div>`);
                    messageOfme.text(data.message.text);
                    
                    let converEmojione =emojione.toImage(messageOfme.html());// toImage thuoc emojione 
                    messageOfme.html(converEmojione);

                if(dataTextEmojiforSend.isChatGroup){
                   messageOfme.append(`<img src="/images/users/${data.sender.avatar}" class="avatar-small">`);
                   increaseNumberMessageGroup(divId);
                   dataToEmit.groupId = targetId; // xu ly socket
                }else{
                    dataToEmit.contactId = targetId; // xu ly socket
                }
                // đưa giao diện vào nơi hiển thị
                $(`.right .chat[data-chat=${divId}]`).append(messageOfme);

                 //dưa time send vao
                let htmlTimeSend=`<div class="time-chat me"  data-mess-id="${data.message._id}"></div>`;
                $(`.right .chat[data-chat=${divId}] .bubble.me[data-mess-id=${data.message._id}]`).before(htmlTimeSend);
               
                let time = moment(data.message.createdAt).locale("vi").format("HH:mm, DD/MM/YYYY");
                //let htmlTimeSend=`<div class="time-chat me"  data-mess-id="${data.message._id}">  ${time} </div>`;
                $(`.right .chat[data-chat=${divId}] .time-chat.me[data-mess-id=${data.message._id}]`).html(time);
                showtimechat(); // gọi event show time send

                nineScrollRight(divId); // set lai thanh scroll 
                // reset input  and emojiarea
                $(`#write-chat-${divId}`).val("");
                currentEmojioneArea.find(".emojionearea-editor").text("");
                // update preview
                $(`.person[data-chat=${divId}]`).find("span.time").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
                $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(data.message.text));
                // chuyen user len top
                $(`.person[data-chat=${divId}]`).on("change",function(){
                    let move = $(this).parent();
                    $(this).closest("ul").prepend(move);
                    $(this).off("change");
                });
                $(`.person[data-chat=${divId}]`).trigger("change");
                // Emit realtime
                socket.emit("chat-text-emoji",dataToEmit);
                // tac typing off
                TypingOff(divId);
                // tac typing trong nhom loi nay moi mo dc 
                let check = $(`.chat[data-chat=${divId}]`).find("div.bubble-typing-gif");
                if(check.length){
                    check.remove();
                }

            }).fail(function(response){
                //error
                console.log(response.responseText);
            });
        }     
    });
}

$(document).ready(function(){
    socket.on("response-chat-text-emoji",function(response){
          //console.log(response);
          //console.log(response.currentUserId);
        // bo sung pha su ly khi nhan vao nut chat trong modal
        let userInList =  $(".room-chat").find(`li[data-chat=${response.currentUserId}]`).hasClass("person");
        if(!response.currentGroupId && !userInList){
            getViewChat(response.currentUserId,response.sender.avatar,response.sender.name);
             //load message
             loadMessageForReceiver(response.currentUserId,response.currentGroupId);
        }
        if(response.currentGroupId){ 
            let groupInList =  $(".room-chat").find(`li[data-chat=${response.currentGroupId}]`).hasClass("person");
            let userOnl = $("#navbar-user").data("uid");
            if(!groupInList){
            getViewChatGroup(response.currentGroupId,response.message.inForGroup.name,response.message.inForGroup.messageAmount,response.message.inForGroup.userAmount,response.message.inForUserGroup,response.message.inForGroup.userId,userOnl);
             //load message
             loadMessageForReceiver(response.message.inForGroup._id,true);
           }
        }
        let divId="";
        let messageOfYou = $(`<div class="bubble you" data-mess-id="${response.message._id}"><span class="notif-chat"></span></div>`);                
                    messageOfYou.text(response.message.text);      
                    let converEmojione =emojione.toImage(messageOfYou.html());// toImage thuoc emojione 
                    messageOfYou.html(converEmojione);
                if(response.currentGroupId){
                   messageOfYou.append(`<img src="/images/users/${response.sender.avatar}" class="avatar-small">`);
                   divId= response.currentGroupId;
                  // increaseNumberMessageGroup(divId);                 
                }else{
                    divId= response.currentUserId;
                }

                if(response.currentUserId !== $("#navbar-user").data("uid")){
                    $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);
                    nineScrollRight(divId); // set lai thanh scroll 
                    increaseNumberMessageGroup(divId);  
                }
                // $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);

                 //dưa time send vao
                 let htmlTimeSend=`<div class="time-chat you"  data-mess-id="${response.message._id}"></div>`;
                 $(`.right .chat[data-chat=${divId}] .bubble.you[data-mess-id=${response.message._id}]`).before(htmlTimeSend);
                
                 let time = moment(response.message.createdAt).locale("vi").format("HH:mm, DD/MM/YYYY");
                 //let htmlTimeSend=`<div class="time-chat me"  data-mess-id="${response.message._id}">  ${time} </div>`;
                 $(`.right .chat[data-chat=${divId}] .time-chat.you[data-mess-id=${response.message._id}]`).html(time);
                 showtimechat(); // gọi event show time send

                // nineScrollRight(divId); // set lai thanh scroll 
                // update preview
                $(`.person[data-chat=${divId}]`).find("span.time").html(moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow());
                $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(response.message.text));
                // chuyen user len top
                $(`.person[data-chat=${divId}]`).on("change",function(){
                    let dataToMove = $(this).parent();
                    $(this).closest("ul").prepend(dataToMove);
                    $(this).off("change");
                });
                $(`.person[data-chat=${divId}]`).trigger("change");
                
    });
});