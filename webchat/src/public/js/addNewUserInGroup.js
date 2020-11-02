function addNewUserInGroup(){
    $(".add-new-user-in-group").unbind("click").on("click",function(){
        let targetId = $(this).data("uid");
        let idGroup = $(this).find("i").data("chat")
       // console.log(targetId);
       // console.log(idGroup);
        $.post("/contact/add-new-user-in-group",{uid: targetId,idGroup:idGroup},function(data){
            // console.log(data); 
            if(data.success){

                increaseNumberMemberGroup(idGroup);
                HtmlUserContact = `<li data-uid="${data.newUserGroup.UserContact._id}">
                                    <span>
                                        <img class="avatar-small" src="/images/users/${data.newUserGroup.UserContact.avatar}" alt=""> 
                                        <strong>${data.newUserGroup.UserContact.username}</strong>
                                        <i class="fa fa-times admin-remove-user-group" data-uid="${data.newUserGroup.UserContact._id}" data-chat="${idGroup}"></i>
                                    </span><br><br>
                                  </li>`
                $(`.number-members[data-chat=${idGroup}]`).find(".infor-member .list-member ul").append(HtmlUserContact); // them vao danh sach thanh vien
                removeUserInGroup();// phuc vu neu xoa nua

                socket.emit("notifi-add-new-user-group",{
                    groupChat:data.newUserGroup.GroupUser,
                    userContact:data.newUserGroup.UserContact,
                });
                socket.emit("show-new-group-chat",{
                    groupChat:data.newUserGroup.GroupUser,
                    targetId:targetId,
                    userInfor:data.newUserGroup.groupConversations,
                    userContact:data.newUserGroup.UserContact
                });
           }
      });

    });
}
$(document).ready(function(){
    socket.on("response-show-group-new-user-add",function(data){
       //  console.log(data.userContact);
    // kiem tra co nhom do chua, phuc vu sau khi xoa user roi them lai
    let checkUser = $("#all-chat").find(`ul a li[data-chat=${data.groupChat._id}]`).hasClass("person");
    if(checkUser){ 
         $('#all-chat').find(`ul a li[data-chat=${data.groupChat._id}]`).remove();
         $("ul.people").find("li")[0].click();
    }
    let showLeft=`<a href="#uid_${data.groupChat._id}" class="room-chat" data-target="#to_${data.groupChat._id}">
        <li class="person group-chat" data-chat="${data.groupChat._id}">
            <div class="left-avatar">
                <img src="images/users/images-group.jpg" alt="">
            </div>
            <span class="name">
                <span class="group-chat-name">Group:</span>
                ${data.groupChat.name}
            </span>
            <span class="time"></span>
            <span class="preview">
            </span>
        </li>
        </a>`;
    $('#all-chat').find('ul').prepend(showLeft);
    $('#group-chat').find('ul').prepend(showLeft);

    let showRight = `<div class="right tab-pane" data-chat="${data.groupChat._id}" id="to_${data.groupChat._id}">
    <div class="top">
        <span> <span class="name">${data.groupChat.name}</span></span>
        <span class="chat-menu-right">
            <a href="javascript:void(0)">&nbsp;</a>
        </span>
        <span class="chat-menu-right">
            <a href="javascript:void(0)"  class="number-members" data-toggle="modal" data-chat="${data.groupChat._id}">
                <span class="show-number-members">${data.groupChat.userAmount}</span>
                <i class="fa fa-users"></i>
                <div class="infor-member">
                    <h3>Danh sách thành viên</h3>
                        <div class="list-member">
                        <ul>
                        </ul>
                        </div>
                </div>  
            </a>
        </span>
        <span class="chat-menu-right">
            <a href="javascript:void(0)">&nbsp;</a>
        </span>
        <span class="chat-menu-right">
            <a href="javascript:void(0)"  class="number-message" data-toggle="modal">
                <span class="show-number-message">${data.groupChat.messageAmount}</span>
                <i class="fa fa-comment"></i>
            </a>
        </span>
    </div>
    <div class="content-chat">
        <div class="chat chat-in-group" data-chat="${data.groupChat._id}" id="to_${data.groupChat._id}">
        </div>
    </div>
    <div class="write" data-chat="${data.groupChat._id}">
        <input type="text" class="write-chat chat-in-group" id="write-chat-${data.groupChat._id}" data-chat="${data.groupChat._id}">
        <div class="icons">
            
            <label for="image-chat-${data.groupChat._id}">
                <input type="file" id="image-chat-${data.groupChat._id}" name="my-image-chat" class="image-chat chat-in-group" data-chat="${data.groupChat._id}">
                <i class="fa fa-photo"></i>
            </label>
            <label for="attach-chat-${data.groupChat._id}">
                <input type="file" id="attach-chat-${data.groupChat._id}" name="my-attach-chat" class="attach-chat chat-in-group" data-chat="${data.groupChat._id}">
                <i class="fa fa-paperclip"></i>
            </label>           
        </div>
    </div>
</div>`;
    $('#screen-chat').prepend(showRight);
    // load message
    loadMessage(data.groupChat._id,true);
    changeScreenChat();    

    data.userInfor.forEach(infor => {
        let userinfor = `<li>
                            <img class="avatar-small" src="/images/users/${infor.avatar}" alt=""> 
                            <strong>${infor.username}</strong>
                        </li><br><br>`
        $('#screen-chat').find(`.number-members[data-chat=${data.groupChat._id}] .list-member ul`).append(userinfor);                
    });
    HtmlUserContact = `<li data-uid="${data.groupChat._id}">
                        <span>
                            <img class="avatar-small" src="/images/users/${data.userContact.avatar}" alt=""> 
                            <strong>${data.userContact.username}"</strong>
                        </span><br><br>
                    </li>`
                $(`.number-members[data-chat=${data.groupChat._id}]`).find(".infor-member .list-member ul").append(HtmlUserContact);
    showMemberGroup();
    removeUserInGroup()
    socket.emit("member-groupid",{groupChatId: data.groupChat._id});
    socket.emit("check-online");
    });
    // gui toi cac thanh vien con lai
    socket.on("response-notifi-add-new-user-group",function(response){
        let idUser = $("#navbar-user").data("uid");
        // console.log(response.groupChat);
        if(response.groupChat.userId != idUser){
            increaseNumberMemberGroup(response.groupChat._id);
            HtmlUserContact = `<li data-uid="${response.groupChat._id}">
                                <span>
                                    <img class="avatar-small" src="/images/users/${response.targetId.avatar}" alt=""> 
                                    <strong>${response.targetId.username}"</strong>
                                </span><br><br>
                              </li>`
            $(`.number-members[data-chat=${response.groupChat._id}]`).find(".infor-member .list-member ul").append(HtmlUserContact);
            removeUserInGroup()
        }
    });
})