function loadMessage(targetId,isChatGroup){
   
    // if(typeof isChatGroup === 'string'){
    //      isChatGroup = (isChatGroup == 'true');
    // }
    //console.log(typeof isChatGroup);
    let datarequest ={
        targetId:targetId,
        isChatGroup:isChatGroup
    }
    $.post("/message/request-data-chat",datarequest,function(data){
        $(`.right .chat[data-chat=${targetId}]`).prepend(data); 
        // set image icon emoji
        addimageIcon();
        // set zoom image
        zoomImage();
        // read more 
        readMoreMessages();
        showtimechat(); // gọi event show time send
        nineScrollRight(targetId); // set lai thanh scroll
    }).fail(function(response){
        //error
        console.log(response.responseText);
    });
}
function loadMessageForReceiver(targetId,isChatGroup){
   
    // if(typeof isChatGroup === 'string'){
    //      isChatGroup = (isChatGroup == 'true');
    // }
    //console.log(typeof isChatGroup);
    let datarequest ={
        targetId:targetId,
        isChatGroup:isChatGroup
    }
    $.post("/message/request-data-chat-receiver",datarequest,function(data){
        $(`.right .chat[data-chat=${targetId}]`).prepend(data); 
        // set image icon emoji
        addimageIcon();
        // set zoom image
        zoomImage();
        // read more 
        readMoreMessages();
        showtimechat(); // gọi event show time send
        nineScrollRight(targetId); // set lai thanh scroll
    }).fail(function(response){
        //error
        console.log(response.responseText);
    });
}