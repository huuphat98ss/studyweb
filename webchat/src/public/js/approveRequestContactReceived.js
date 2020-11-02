

function approveRequestContactReceived(){
      $(".user-approve-request-contact-received").unbind("click").on("click",function(){// cach nay dung de tranh nhieu tac vui click huy nhieu  noi
    //$(".user-approve-request-contact-received").bind("click",function(){
        let targetid = $(this).data("uid"); 
       $.ajax({
           url:"/contact/approve-request-contact-received",  
           type:"put",
           data:{uid:targetid},
            success: function(data){
               // console.log(data);
            if(data.success){

               // console.log(data.approveRequest);
               // console.log(data.approveRequest.userInforReceived);
                let userInfo = $("#request-contact-received").find(`ul li[data-uid = ${targetid}]`);//lay infor trong the ul li
                $(userInfo).find("div.user-approve-request-contact-received").remove(); // xoa nut chap nhan
                $(userInfo).find("div.user-remove-request-contact-received").remove(); 
                $(userInfo).find("div.contactPanel")
                .append(`
                <div class="talk-with-user" data-uid="${targetid}">
                    Trò chuyện
                </div>
                <div class="user-remove-contact action-danger" data-uid="${targetid}">
                    Xóa liên hệ
                </div>`);
                let userInfoHtml = userInfo.get(0).outerHTML; // lay toan bo the va noi dung cua userInfo
                $("#contacts").find("ul").prepend(userInfoHtml);
                $(userInfo).remove();
                decreateNumberNotifContact("count-request-contact-received");
                // increateNumberNotifContact("count-contacts");
                increateNumberNotification("count-contacts",1);
                decreateNumberNotification("noti_contact_counter",1);
                removeContact();// huy ket ban
                // kiem tra co user do chua, phuc vu sau khi huy ket ban roi ket ban lai
                let checkUser = $("#all-chat").find(`ul a li[data-chat=${targetid}]`).hasClass("person");
                if(checkUser){ 
                     $('#all-chat').find(`ul a li[data-chat=${targetid}]`).remove();
                     $("ul.people").find("li")[0].click();
                }
                // do du lieu left right ra
                let showLeft=`<a href="#uid_${data.approveRequest.userInforSent._id}" class="room-chat"  data-target="#to_${data.approveRequest.userInforSent._id}">
                                <li class="person" data-chat="${data.approveRequest.userInforSent._id}">
                                    <div class="left-avatar">
                                        <img src="images/users/${data.approveRequest.userInforSent.avatar}" alt="">
                                    </div>
                                    <span class="name">
                                    ${data.approveRequest.userInforSent.username}
                                    </span>
                                    <span class="time"></span>
                                    <span class="preview notif-chat">
                                    </span>
                                </li>
                            </a>`;
                    $('#all-chat').find('ul').prepend(showLeft);
                    $('#group-chat').find('ul').prepend(showLeft);
                
                let showRight = `<div class="right tab-pane data-chat="${data.approveRequest.userInforSent._id}" id="to_${data.approveRequest.userInforSent._id}">
                    <div class="top">
                        <span><span class="name">${data.approveRequest.userInforSent.username}</span></span>
                    </div>
                    <div class="content-chat">
                        <div class="chat" data-chat="${data.approveRequest.userInforSent._id}" id="to_${data.approveRequest.userInforSent._id}">
                        </div>
                    </div>
                    <div class="write" data-chat="${data.approveRequest.userInforSent._id}">
                        <input type="text" class="write-chat" id="write-chat-${data.approveRequest.userInforSent._id}" data-chat="${data.approveRequest.userInforSent._id}">
                        <div class="icons">
                           
                            <label for="image-chat-${data.approveRequest.userInforSent._id}">
                                <input type="file" id="image-chat-${data.approveRequest.userInforSent._id}" name="my-image-chat" class="image-chat" data-chat="${data.approveRequest.userInforSent._id}">
                                <i class="fa fa-photo"></i>
                            </label>
                            <label for="attach-chat-${data.approveRequest.userInforSent._id}">
                                <input type="file" id="attach-chat-${data.approveRequest.userInforSent._id}" name="my-attach-chat" class="attach-chat" data-chat="${data.approveRequest.userInforSent._id}">
                                <i class="fa fa-paperclip"></i>
                            </label>         
                                
                        </div>
                    </div>
                </div>`;
                    $('#screen-chat').prepend(showRight);
                    // load message
                    loadMessage(targetid,false);
                    changeScreenChat();    

                socket.emit("approve-request-contact-received",{
                    contactid:targetid,
                    userInforReceived: data.approveRequest.userInforReceived
                });
                socket.emit("check-online");// update id group online
            }
            }
       })
    });
}
socket.on("response-approve-request-contact-received",function(user){
    
    //console.log(user.userInforReceived);
    decreateNumberNotification("noti_contact_counter",1);
    increateNumberNotification("count-contacts",1);

    decreateNumberNotifContact("count-request-contact-sent");
    //increateNumberNotifContact("count-contacts");

    $("#request-contact-sent").find(`ul li[data-uid=${user.currentUser.id}]`).remove();
    $("#find-user").find(`ul li[data-uid=${user.currentUser.id}]`).remove();

    let userInfoHtml = `<li class="_contactList" data-uid="${user.currentUser.id}">
                            <div class="contactPanel">
                                <div class="user-avatar">
                                    <img src="images/users/${user.currentUser.avatar}" alt="err">
                                </div>
                                <div class="user-name">
                                    <p>
                                         ${user.currentUser.username}
                                    </p>
                                </div>
                                <br>
                                <div class="user-address">
                                    <span>&nbsp ${user.currentUser.address}</span>
                                </div>
                                <div class="talk-with-user" data-uid="${user.currentUser.id}">
                                    Trò chuyện
                                </div>
                                <div class="user-remove-contact action-danger" data-uid="${user.currentUser.id}">
                                    Xóa liên hệ
                                </div>
                            </div>
                        </li>`;

    genderhtml=``;
            if(user.gender === "male"){
                    genderhtml = `<i class="fa fa-mars"></i>`;
            }else{
                    genderhtml = `<i class="fa fa-venus"></i>`;
            }                   
   $("#contacts").find("ul").prepend(userInfoHtml);
   $("#contacts").find(`ul li[data-uid=${user.currentUser.id}] .user-name`).append(genderhtml);
    removeContact();// huy ket ban
    // kiem tra co user do chua, phuc vu sau khi huy ket ban roi ket ban lai
    let checkUser = $("#all-chat").find(`ul a li[data-chat=${user.currentUser.id}]`).hasClass("person");
    if(checkUser){ 
         $('#all-chat').find(`ul a li[data-chat=${user.currentUser.id}]`).remove();
         $("ul.people").find("li")[0].click();
    }
    
        let showLeft=`<a href="#uid_${user.userInforReceived._id}" class="room-chat"  data-target="#to_${user.userInforReceived._id}">
                                <li class="person" data-chat="${user.userInforReceived._id}">
                                    <div class="left-avatar">
                                        <img src="images/users/${user.userInforReceived.avatar}" alt="">
                                    </div>
                                    <span class="name">
                                    ${user.userInforReceived.username}
                                    </span>
                                    <span class="time"></span>
                                    <span class="preview notif-chat">
                                    </span>
                                </li>
                            </a>`;
                    $('#all-chat').find('ul').prepend(showLeft);
                    $('#group-chat').find('ul').prepend(showLeft);
                
        let showRight = `<div class="right tab-pane data-chat="${user.userInforReceived._id}" id="to_${user.userInforReceived._id}">
                    <div class="top">
                        <span>To: <span class="name">${user.userInforReceived.username}</span></span>
                    </div>
                    <div class="content-chat">
                        <div class="chat" data-chat="${user.userInforReceived._id}" id="to_${user.userInforReceived._id}">
                        </div>
                    </div>
                    <div class="write" data-chat="${user.userInforReceived._id}">
                        <input type="text" class="write-chat" id="write-chat-${user.userInforReceived._id}" data-chat="${user.userInforReceived._id}">
                        <div class="icons">
                           
                            <label for="image-chat-${user.userInforReceived._id}">
                                <input type="file" id="image-chat-${user.userInforReceived._id}" name="my-image-chat" class="image-chat" data-chat="${user.userInforReceived._id}">
                                <i class="fa fa-photo"></i>
                            </label>
                            <label for="attach-chat-${user.userInforReceived._id}">
                                <input type="file" id="attach-chat-${user.userInforReceived._id}" name="my-attach-chat" class="attach-chat" data-chat="${user.userInforReceived._id}">
                                <i class="fa fa-paperclip"></i>
                            </label>         
                           
                        </div>
                    </div>
                </div>`;
                    $('#screen-chat').prepend(showRight);
                     // load message
                     loadMessage(user.currentUser.id,false);
                     changeScreenChat();    

                    socket.emit("check-online");// update id group online
});

$(document).ready(function(){
    approveRequestContactReceived();
});