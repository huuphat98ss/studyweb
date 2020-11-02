function getViewChat(currentUserId,avatar,name){
    let showLeft=`<a href="#uid_${currentUserId}" class="room-chat"  data-target="#to_${currentUserId}">
            <li class="person" data-chat="${currentUserId}">
                <div class="left-avatar">
                    <img src="images/users/${avatar}" alt="">
                </div>
                <span class="name">
                ${name}
                </span>
                <span class="time"></span>
                <span class="preview notif-chat">
                </span>
            </li>
        </a>`;
        $('#all-chat').find('ul').prepend(showLeft);
        $('#group-chat').find('ul').prepend(showLeft);

    let showRight = `<div class="right tab-pane" data-chat="${currentUserId}" id="to_${currentUserId}">
        <div class="top">
            <span><span class="name">${name}</span></span>
        </div>
        <div class="content-chat">
            <div class="chat" data-chat="${currentUserId}" id="to_${currentUserId}">
            </div>
        </div>
        <div class="write" data-chat="${currentUserId}">
            <input type="text" class="write-chat" id="write-chat-${currentUserId}" data-chat="${currentUserId}">
            <div class="icons">
                <!-- <a href="#" class="icon-chat" data-chat="${currentUserId}"><i class="fa fa-smile-o"></i></a> -->
                <label for="image-chat-${currentUserId}">
                    <input type="file" id="image-chat-${currentUserId}" name="my-image-chat" class="image-chat" data-chat="${currentUserId}">
                    <i class="fa fa-photo"></i>
                </label>
                <label for="attach-chat-${currentUserId}">
                    <input type="file" id="attach-chat-${currentUserId}" name="my-attach-chat" class="attach-chat" data-chat="${currentUserId}">
                    <i class="fa fa-paperclip"></i>
                </label>               
            </div>
        </div>
        </div>`;

        $('#screen-chat').prepend(showRight);   
        socket.emit("check-online");// update id group online 
        changeScreenChat();
}