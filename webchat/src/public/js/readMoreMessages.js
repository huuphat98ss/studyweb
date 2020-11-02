function readMoreMessages(){
    $('.right .chat').unbind().scroll(function(){
        if($(this).scrollTop() === 0){
            let messageLoading =`<img src="images/chat/message-loading.gif" class="message-loading" />`;
            $(this).prepend(messageLoading);
            // let userId = $('#navbar-user').data('uid');
            let targetId = $(this).data("chat");
            let skipMessage = $(this).find("div.bubble").length;
            let chatInGroup = $(this).hasClass("chat-in-group") ? true: false;
           // console.log(targetId);
            // console.log(skipMessage);
            // console.log(chatInGroup);
            $.get(`/message/read-more?skipMessage=${skipMessage}&targetId=${targetId}&chatInGroup=${chatInGroup}`,function(data){
                 //console.log(data);               
                 if(data.trim()===""){
                    alert("het tin nhan roi");
                    $(".right .chat").find(".message-loading").remove();  
                    return false;
                }
                $(`.right .chat[data-chat=${targetId}]`).prepend(data); 
                $(".right .chat").find(".message-loading").remove(); 
                // set image icon emoji
                addimageIcon();
                // set zoom image
                zoomImage();
                showtimechat(); // gọi event show time send
            });            
        }
    });
};
 
$(document).ready(function(){
    readMoreMessages();
})