function decreateNumberNotifContact(className){
    let currentValue = +$(`.${className}`).find("em").text();// ket qua sau + la String khi co + la int co the dung parseInt()
    //console.log(currentValue);
    //console.log(typeof currentValue);
    currentValue -=1;
    if(currentValue===0){
        $(`.${className}`).html("");
    }else{
        $(`.${className}`).html(`(<em>${currentValue}</em>)`);
    }
}

function removeRequestContactSent (){
     $(".user-remove-request-contact-sent").unbind("click").on("click",function(){// cach nay dung de tranh nhieu tac vui click huy nhieu  noi
   // $(".user-remove-request-contact-sent").bind("click",function(){
        let targetid = $(this).data("uid"); 
       $.ajax({
           url:"/contact/remove-request-contact-sent",   //cap nhat them-sent
           type:"delete",
           data:{uid:targetid},
            success: function(data){
               // console.log(data);
            if(data.success){
                $("#find-user").find(`div.user-remove-request-contact-sent[data-uid=${targetid}]`).hide();
                $("#find-user").find(`div.user-add-new-contact[data-uid=${targetid}]`).css("display","inline-block");
                // xu ly readtime
                decreateNumberNotification("noti_contact_counter",1);
                
                  decreateNumberNotifContact("count-request-contact-sent");
                //xoa cho doi xac nhan 
                 $("#request-contact-sent").find(`li[data-uid=${targetid}]`).remove();
                 socket.emit("remove-request-contact-sent",{contactid:targetid});
                 }
            }
       })
    });
}
socket.on("response-remove-request-contact-sent",function(user){
    //xoa o tab nhan yeu cau ket ban
    $("#request-contact-received").find(`li[data-uid=${user.id}]`).remove();
    // xoa so thong bao
    decreateNumberNotifContact("count-request-contact-received");
    
    decreateNumberNotification("noti_contact_counter",1);
});

$(document).ready(function(){
    removeRequestContactSent();
});