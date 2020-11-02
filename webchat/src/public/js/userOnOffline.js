socket.emit("check-online");

// bat online doi vs nguoi dang truc tiep onl
socket.on("list-user-onl",function(listUserId){
    listUserId.forEach(userId=>{
        $(`.person[data-chat=${userId}]`).find("img").addClass("online");
        // attr('id', 'online');
    });
});
// bat onl vs nguoi vua dang nhap
socket.on("new-user-onl",function(userId){ 
    $(`.person[data-chat=${userId}]`).find("img").addClass("online");
});
// tac onl va bat off vs nguoi vua disconnect
socket.on("new-user-offline",function(userId){ 
    $(`.person[data-chat=${userId}]`).find("img").removeClass("online");
});
