// function talkUser(){
//     $(".user-talk").unbind("click").on("click",function(){
//         let targetid = $(this).data("uid");
//         // console.log(targetid);
//         $("#contacts").modal("hide");
//         $(".people").find(".person").removeClass("active");
//         $(".room-chat").find(`li[data-chat=${targetid}]`).addClass("active"); 
//         $(".room-chat").find(`li[data-chat=${targetid}]`).click();
//         $(this).off("click");
//     });
// }

function removeContact(){
    //  $(".user-remove-request-contact-sent").unbind("click").on("click",function(){// cach nay dung de tranh nhieu tac vui click huy nhieu  noi
    $(".user-remove-contact").bind("click",function(){
        let result = confirm("hủy liên kết bạn bè??");
        if(result){
        let targetid = $(this).data("uid"); 
            $.ajax({
                url:"/contact/remove-contact",  
                type:"delete",
                data:{uid:targetid},
                    success: function(data){
                    // console.log(data);
                        if(data.success){
                            $("#contacts").find(`ul li[data-uid=${targetid}]`).remove();
                            //giam so ban be di 1
                            decreateNumberNotification("count-contacts",1);
                            // remove write
                            $("#screen-chat").find(`.write[data-chat=${targetid}]`).remove();
                            HtmlNotifi= `<div class="bubble-notifi">
                                            <span class="notif-chat"> ban va nguoi nay da khong con la ban nua !! </span>
                                        </div>`
                            $("#screen-chat").find(`.content-chat .chat[data-chat=${targetid}]`).append(HtmlNotifi);
                            socket.emit("remove-contact",{contactid:targetid});
                        }
                    }
            })
        }else{
            return;
        }
    });
}
socket.on("response-remove-contact",function(user){
    
    $("#contacts").find(`ul li[data-uid=${user.id}]`).remove();
    // giap so ban be di 1 
    decreateNumberNotification("count-contacts",1);
    // remove write
    $("#screen-chat").find(`.write[data-chat=${user.id}]`).remove();
                HtmlNotifi= `<div class="bubble-notifi">
                                <span class="notif-chat"> ban va nguoi nay da khong con la ban nua !! </span>
                            </div>`
    $("#screen-chat").find(`.content-chat .chat[data-chat=${user.id}]`).append(HtmlNotifi);
    
});

$(document).ready(function(){
    // talkUser();
    removeContact();
});