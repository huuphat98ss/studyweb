function removeGroupChat() {
        $(".admin-remove-group").bind("click",function(){
            let result = confirm("bạn có chắc chắng chưa");
            if(result){
                let currentUserId =  $(this).data("uid");
                let idGroup = $(this).data("chat");
                // console.log(targetid);
                // console.log(idGroup);
                $.ajax({
                    url:"/contact/remove-group-chat",  
                    type:"put",
                    data:{
                        idGroup:idGroup
                    },
                    success: function(data){
                        if(data.success){
                            $("#screen-chat").find(`.write[data-chat=${idGroup}]`).remove();
                            $("#screen-chat").find(`.remove-group`).remove();
                            HtmlNotifi= `<div class="bubble-notifi">
                                            <span class="notif-chat"> nhom nay da bi khoa se mat ngay sau khi load trang !! </span>
                                        </div>`
                            $("#screen-chat").find(`.content-chat .chat[data-chat=${idGroup}]`).append(HtmlNotifi);
                            socket.emit("remove-group-chat",{
                                currentUserId:currentUserId,
                                idGroup:idGroup
                            });
                        }
                    }
                });

            }else{
                return;
            }
        }); 
}
$(document).ready(function(){
    removeGroupChat();
    socket.on("response-remove-group-chat",function(response){
        let idUser = $("#navbar-user").data("uid");
        if(response.currentUserId != idUser){
            $("#screen-chat").find(`.write[data-chat=${response.currentGroupId}]`).remove();
            HtmlNotifi= `<div class="bubble-notifi">
                            <span class="notif-chat"> nhom nay da bi khoa se mat ngay sau khi load trang !! </span>
                        </div>`
            $("#screen-chat").find(`.content-chat .chat[data-chat=${response.currentGroupId}]`).append(HtmlNotifi);
        }
    })
});