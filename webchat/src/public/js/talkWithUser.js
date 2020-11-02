function talkWithUser(){
    $(".talk-with-user").unbind("click").on("click",function(){
        let targetid = $(this).data("uid");
        let isChatGroup= false;
        if($(this).hasClass("is-group")){
           isChatGroup = true;
        }
       // console.log(targetid);
        //console.log(isChatGroup);
        let dataRequeste ={
            uid:targetid,
            isChatGroup:isChatGroup
        }
         // console.log(isChatGroup);
            $("#contacts").modal("hide");
            // $(".people").find(".person").removeClass("active");
        if($(".room-chat").find(`li[data-chat=${targetid}]`).hasClass("person")){
            $(".room-chat").on("click",function(){
                $(".people").find(".person").removeClass("active");
                $(`.person[data-chat=${targetid}]`).addClass("active");
                $(this).tab("show");
            });
            $(`.person[data-chat=${targetid}]`).trigger("click");
        }else{
            $.post("/contact/talk-with-user",dataRequeste,function(data){
                 //console.log(data);
                // do du lieu left right ra
                if(isChatGroup){
                    let userOnl = $("#navbar-user").data("uid");
                    getViewChatGroup(data.userTalk._id,data.userTalk.name,data.userTalk.messageAmount,data.userTalk.userAmount,data.userTalk.inForGroup,data.userTalk.userId,userOnl);     
                }else{
                    getViewChat(data.userTalk._id,data.userTalk.avatar,data.userTalk.username);
                }
                // load message
                loadMessage(targetid,isChatGroup);

                $(".room-chat").on("click",function(){
                    $(".people").find(".person").removeClass("active");
                    $(`.person[data-chat=${targetid}]`).addClass("active");
                    $(this).tab("show");
                });
                $(`.person[data-chat=${targetid}]`).trigger("click");
                //  set scroll right
                // nineScrollRight(targetid);
                // enableEmojioneArea(targetid);
                // // Bat image message
                // imageChat(targetid);
                // // bat file message
                // attachmentChat(targetid);     
                changeScreenChat();
                socket.emit("check-online");// update id group online  
                // changeScreenChat();
            });
        }
        // bắc sự kiện chat
        changeScreenChat();
    });
}
$(document).ready(function(){
    talkWithUser();
    
});