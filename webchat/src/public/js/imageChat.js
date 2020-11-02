// function bufferToBase64(buffer){
//    return btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte),"") );
// }
function imageChat(divId){
    $(`#image-chat-${divId}`).unbind("change").on("change",function(){
        let fileData = $(this).prop("files")[0];
        //console.log(fileData);
        let math=["image/png","image/jpg","image/jpeg"];
        let limit=1048576; // byte = 1MB
        // kq tra ve la -1 la ko khop vs math
        if($.inArray(fileData.type,math)===-1){
            alert("file ko hop le");
            $(this).val(null);
            return false;
        }
        if(fileData.size >limit){
            alert("kich thuoc file phai nho hon 1 MB");
            $(this).val(null);
            return false;
        }
        let targetId =$(this).data("chat");
        let isChatGroup = false; // phuc vu xu ly socket
        let messageformData = new FormData();
        messageformData.append("my-image-chat",fileData);   
        messageformData.append("uid",targetId);
        
        if($(this).hasClass("chat-in-group")){
            messageformData.append("isChatGroup",true);      
            isChatGroup =true;
        }
        $.ajax({
            url: "/message/add-new-image",
            type: "post",
            cache: false, // yêu cầu khi gửi form
            contentType: false, // yêu cầu khi gửi form
            processData: false, // yêu cầu khi gửi form
            data: messageformData, // dữ liệu đã được tạo từ formdata
            success: function(data){
               //console.log(data);
              let dataToEmit ={
                message: data.message,
                sender:data.sender
              }// xuly socket
            let messageOfme = $(`<div class="bubble me bubble-image-file" data-mess-id="${data.message._id}"><span class="notif-chat"></span></div>`);
            
            let imageChat = `<img src="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}" class="show-image-chat">`;
            
            messageOfme.html(imageChat);
            if(isChatGroup){
               messageOfme.prepend(`<img src="/images/users/${data.sender.avatar}" class="avatar-small">`);
               increaseNumberMessageGroup(divId);
               dataToEmit.groupId = targetId; // xu ly socket
            }else{
                dataToEmit.contactId = targetId; // xu ly socket
            }
            
            $(`.right .chat[data-chat=${divId}]`).append(messageOfme);
            //dưa time send vao
            let htmlTimeSend=`<div class="time-chat me"  data-mess-id="${data.message._id}"></div>`;
            $(`.right .chat[data-chat=${divId}] .bubble.me[data-mess-id=${data.message._id}]`).before(htmlTimeSend);
           
            let time = moment(data.message.createdAt).locale("vi").format("HH:mm, DD/MM/YYYY");
            //let htmlTimeSend=`<div class="time-chat me"  data-mess-id="${data.message._id}">  ${time} </div>`;
            $(`.right .chat[data-chat=${divId}] .time-chat.me[data-mess-id=${data.message._id}]`).html(time);
            showtimechat(); // gọi event show time send

            nineScrollRight(divId); // set lai thanh scroll     
            // update preview
            $(`.person[data-chat=${divId}]`).find("span.time").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
            $(`.person[data-chat=${divId}]`).find("span.preview").text("bạn gửi 1 ảnh");

             // chuyen user len top
             $(`.person[data-chat=${divId}]`).on("change",function(){
                let dataToMove = $(this).parent();
                $(this).closest("ul").prepend(dataToMove);
                $(this).off("change");
            });
            $(`.person[data-chat=${divId}]`).trigger("change");
            // Emit realtime
            socket.emit("chat-image",dataToEmit);
            // // dua anh vao list 
            // let addImageChatModal = `<img src="data:${data.message.file.contentType}; base64,${bufferToBase64(data.message.file.data.data)}">`;
            // $(`#imagesModal_${divId}`).find("div.all-images").append(addImageChatModal);
            // show zoom image
            zoomImage();
            },
            error: function(error){
               console.log(error.responseText);
            }
           });
    });
}
$(document).ready(function(){
    socket.on("response-chat-image",function(response){
        //console.log(response.message);
        // console.log(response.message.file.data.data);
        // console.log(response.message.inForGroup);
        // fix loi luc chat response chua co trong list chat
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
        let messageOfYou = $(`<div class="bubble you bubble-image-file" data-mess-id="${response.message._id}"><span class="notif-chat"></span></div>`);           
        let imageChat = `<img src="data:${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)}" class="show-image-chat">`;                      
         messageOfYou.html(imageChat);                  
                if(response.currentGroupId){
                   messageOfYou.prepend(`<img src="/images/users/${response.sender.avatar}" class="avatar-small">`);
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
                
                //dưa time send vao
                let htmlTimeSend=`<div class="time-chat you"  data-mess-id="${response.message._id}"></div>`;
                $(`.right .chat[data-chat=${divId}] .bubble.you[data-mess-id=${response.message._id}]`).before(htmlTimeSend);
               
                let time = moment(response.message.createdAt).locale("vi").format("HH:mm, DD/MM/YYYY");
                //let htmlTimeSend=`<div class="time-chat me"  data-mess-id="${response.message._id}">  ${time} </div>`;
                $(`.right .chat[data-chat=${divId}] .time-chat.you[data-mess-id=${response.message._id}]`).html(time);
                showtimechat(); // gọi event show time send

                // update preview
                $(`.person[data-chat=${divId}]`).find("span.time").html(moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow());
                $(`.person[data-chat=${divId}]`).find("span.preview").text("đã gửi 1 ảnh");
                // chuyen user len top
                $(`.person[data-chat=${divId}]`).on("change",function(){
                    let dataToMove = $(this).parent();
                    $(this).closest("ul").prepend(dataToMove);
                    $(this).off("change");
                });
                $(`.person[data-chat=${divId}]`).trigger("change");
                // // dua anh vao list 
                // if(response.currentUserId !== $("#navbar-user").data("uid")){
                //     let addImageChatModal = `<img src="data:${response.message.file.contentType}; base64,${bufferToBase64(response.message.file.data.data)}">`;
                //     $(`#imagesModal_${divId}`).find("div.all-images").append(addImageChatModal);
                // }
                 // show zoom image
                zoomImage();
               
    });
});