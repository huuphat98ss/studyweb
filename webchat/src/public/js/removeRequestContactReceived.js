

function removeRequestContactReceived(){
    $(".user-remove-request-contact-received").unbind("click").on("click",function(){// cach nay dung de tranh nhieu tac vui click huy nhieu  noi
   // $(".user-remove-request-contact-received").bind("click",function(){
        let targetid = $(this).data("uid"); 
       $.ajax({
           url:"/contact/remove-request-contact-received",   //cap nhat them-sent
           type:"delete",
           data:{uid:targetid},
            success: function(data){
               // console.log(data);
            if(data.success){
                
                decreateNumberNotification("noti_contact_counter",1);
                
                decreateNumberNotifContact("count-request-contact-received");
                //xoa cho doi xac nhan 
                 $("#request-contact-received").find(`li[data-uid=${targetid}]`).remove();
                 socket.emit("remove-request-contact-received",{contactid:targetid});
                 }
            }
       })
    });
}
socket.on("response-remove-request-contact-received",function(user){
    $("#find-user").find(`div.user-remove-request-contact-sent[data-uid=${user.id}]`).hide();
    $("#find-user").find(`div.user-add-new-contact[data-uid=${user.id}]`).css("display","inline-block");
                
    //xoa o tab nhan yeu cau ket ban
    $("#request-contact-sent").find(`li[data-uid=${user.id}]`).remove();
    // xoa so thong bao
    decreateNumberNotifContact("count-request-contact-sent");
    
    decreateNumberNotification("noti_contact_counter",1);
});

$(document).ready(function(){
    removeRequestContactReceived();
});