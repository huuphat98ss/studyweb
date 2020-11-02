function createGroupChat() {
  $("#create-group-chat").bind("click", function () {
    let nameGroup = $(".list-user-added").find("#name-group-chat").val();
    let userNumber = $("#friends-added").find("li").length;
    //    console.log(nameGroup);
    let regexKeyword = new RegExp(
      /^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/
    );
    if (!nameGroup.length) {
      alert("chua nhap chu nao het ??");
      return false;
    }
    if (nameGroup.length < 5 || nameGroup.length > 30) {
      alert("ten nhom toi thieu 5 ki tu toi da 30 ki tu");
      return false;
    }
    if (!regexKeyword.test(nameGroup)) {
      alert("nhap ten khong phu hop");
      return false;
    }
    if (userNumber < 2) {
      alert("1 nhom chat phai co tu 3 thanh vien tro len");
      return false;
    }
    let arrayIds = [];
    $("#friends-added")
      .find("li")
      .each(function (index, item) {
        arrayIds.push({ userId: $(item).data("uid") });
      });
    //    console.log(arrayIds);
    $.post(
      "/contact/create-group-chat",
      {
        arrayIds: arrayIds,
        nameGroup: nameGroup,
      },
      function (data) {
        //console.log(data.groupChat.groupConversations);
        $("#name-group-chat").val("");
        $("#cancel-group-chat").click();
        $("#create-group").modal("hide");

        let showLeft = `<a href="#uid_${data.groupChat.newGroup._id}" class="room-chat" data-target="#to_${data.groupChat.newGroup._id}">
                <li class="person group-chat" data-chat="${data.groupChat.newGroup._id}">
                    <div class="left-avatar">
                        <img src="images/users/images-group.jpg" alt="">
                    </div>
                    <span class="name">
                        <span class="group-chat-name">Group:</span>
                        ${data.groupChat.newGroup.name}
                    </span>
                    <span class="time"></span>
                    <span class="preview">
                    </span>
                </li>
                </a>`;
        $("#all-chat").find("ul").prepend(showLeft);
        $("#group-chat").find("ul").prepend(showLeft);

        let showRight = `<div class="right tab-pane" data-chat="${data.groupChat.newGroup._id}" id="to_${data.groupChat.newGroup._id}">
            <div class="top">
                <span><span class="name">${data.groupChat.newGroup.name}</span></span>
                <span class="chat-menu-right">
                    <a href="javascript:void(0)">&nbsp;</a>
                </span>
                <span class="chat-menu-right">
                    <a href="javascript:void(0)"  class="number-members" data-toggle="modal" data-chat="${data.groupChat.newGroup._id}">
                        <span class="show-number-members">${data.groupChat.newGroup.userAmount}</span>
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
                        <span class="show-number-message">${data.groupChat.newGroup.messageAmount}</span>
                        <i class="fa fa-comment"></i>
                    </a>
                </span>
                <span class="search-add-user-group">
                <input type="text" class="searchBox" data-chat="${data.groupChat.newGroup._id}"  placeholder="Tìm kiếm tên thêm vào nhóm">
                   <span class="search-results" data-chat="${data.groupChat.newGroup._id}">
                       <h3>Kết quả</h3>
                       <div class="search_content"  data-chat="${data.groupChat.newGroup._id}">
                           <ul>                          
                           </ul>
                       </div>
                   </span>                                                 
                </span>
            </div>
            <div class="content-chat">
                <div class="chat chat-in-group" data-chat="${data.groupChat.newGroup._id}" id="to_${data.groupChat.newGroup._id}">
                </div>
            </div>
            <div class="write" data-chat="${data.groupChat.newGroup._id}">
                <input type="text" class="write-chat chat-in-group" id="write-chat-${data.groupChat.newGroup._id}" data-chat="${data.groupChat.newGroup._id}">
                <div class="icons">
                   
                    <label for="image-chat-${data.groupChat.newGroup._id}">
                        <input type="file" id="image-chat-${data.groupChat.newGroup._id}" name="my-image-chat" class="image-chat chat-in-group" data-chat="${data.groupChat.newGroup._id}">
                        <i class="fa fa-photo"></i>
                    </label>
                    <label for="attach-chat-${data.groupChat.newGroup._id}">
                        <input type="file" id="attach-chat-${data.groupChat.newGroup._id}" name="my-attach-chat" class="attach-chat chat-in-group" data-chat="${data.groupChat.newGroup._id}">
                        <i class="fa fa-paperclip"></i>
                    </label>                             
                </div>
            </div>
        </div>`;
        $("#screen-chat").prepend(showRight);
        changeScreenChat();

        data.groupChat.groupConversations.forEach((infor) => {
          let userinfor = `<li>
                                    <img class="avatar-small" src="/images/users/${infor.avatar}" alt=""> 
                                    <strong>${infor.username}</strong>
                                </li><br><br>`;
          $("#screen-chat")
            .find(
              `.number-members[data-chat=${data.groupChat.newGroup._id}] .list-member ul`
            )
            .append(userinfor);
        });
        showMemberGroup();

        // xu ly socket
        socket.emit("show-new-group-chat", {
          groupChat: data.groupChat.newGroup,
          userInfor: data.groupChat.groupConversations,
        });
        socket.emit("check-online"); // update id group online
      }
    ).fail(function (response) {
      //error
      console.log(response.responseText);
    });
  });
}
$(document).ready(function () {
  createGroupChat();
  socket.on("response-show-new-group-chat", function (data) {
    // console.log(data.userInfor);

    let showLeft = `<a href="#uid_${data.groupChat._id}" class="room-chat" data-target="#to_${data.groupChat._id}">
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
    $("#all-chat").find("ul").prepend(showLeft);
    $("#group-chat").find("ul").prepend(showLeft);

    let showRight = `<div class="right tab-pane" data-chat="${data.groupChat._id}" id="to_${data.groupChat._id}">
    <div class="top">
        <span><span class="name">${data.groupChat.name}</span></span>
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
    $("#screen-chat").prepend(showRight);
    changeScreenChat();

    data.userInfor.forEach((infor) => {
      let userinfor = `<div>
                            <img class="avatar-small" src="/images/users/${infor.avatar}" alt=""> 
                            <strong>${infor.username}</strong>
                        </div><br><br>`;
      $("#screen-chat")
        .find(`.number-members[data-chat=${data.groupChat._id}] .list-member`)
        .append(userinfor);
    });
    showMemberGroup();

    socket.emit("member-groupid", { groupChatId: data.groupChat._id });
    socket.emit("check-online");
  });
});
