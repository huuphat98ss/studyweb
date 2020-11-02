function getViewChatGroup(
  currentGroupId,
  name,
  messageAmount,
  userAmount,
  inForUserGroup,
  userId,
  userOnl
) {
  let showLeft = `<a href="#uid_${currentGroupId}" class="room-chat" data-target="#to_${currentGroupId}">
    <li class="person group-chat" data-chat="${currentGroupId}">
        <div class="left-avatar">
            <img src="images/users/images-group.jpg" alt="">
        </div>
        <span class="name">
            <span class="group-chat-name">Group:</span>
            ${name}
        </span>
        <span class="time"></span>
        <span class="preview">
        </span>
    </li>
    </a>`;
  $("#all-chat").find("ul").prepend(showLeft);
  $("#group-chat").find("ul").prepend(showLeft);

  let showRight = `<div class="right tab-pane" data-chat="${currentGroupId}" id="to_${currentGroupId}">
<div class="top">
    <span><span class="name">${name}</span></span>
    <span class="chat-menu-right">
        <a href="javascript:void(0)">&nbsp;</a>
    </span>
    <span class="chat-menu-right">
        <a href="javascript:void(0)"  class="number-members" data-toggle="modal" data-chat="${currentGroupId}">
            <span class="show-number-members">${userAmount}</span>
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
            <span class="show-number-message">${messageAmount}</span>
            <i class="fa fa-comment"></i>
        </a>
    </span>
    <span class="search-add-user-group">                                         
    </span>
    <span class="chat-menu-right">
            <a href="javascript:void(0)">&nbsp;</a>
    </span>
    <span class="chat-menu-right remove-group">
    </span>
</div>
<div class="content-chat">
    <div class="chat chat-in-group" data-chat="${currentGroupId}" id="to_${currentGroupId}">
    </div>
</div>
<div class="write" data-chat="${currentGroupId}">
    <input type="text" class="write-chat chat-in-group" id="write-chat-${currentGroupId}" data-chat="${currentGroupId}">
    <div class="icons">
       
        <label for="image-chat-${currentGroupId}">
            <input type="file" id="image-chat-${currentGroupId}" name="my-image-chat" class="image-chat chat-in-group" data-chat="${currentGroupId}">
            <i class="fa fa-photo"></i>
        </label>
        <label for="attach-chat-${currentGroupId}">
            <input type="file" id="attach-chat-${currentGroupId}" name="my-attach-chat" class="attach-chat chat-in-group" data-chat="${currentGroupId}">
            <i class="fa fa-paperclip"></i>
        </label>                             
    </div>
</div>
</div>`;
  $("#screen-chat").prepend(showRight);
  changeScreenChat();
  if (userOnl == userId) {
    let viewSearch = `<input type="text" class="searchBox" data-chat="${currentGroupId}"  placeholder="Tìm kiếm tên thêm vào nhóm">
        <span class="search-results" data-chat="${currentGroupId}">
            <h3>Kết quả</h3>
            <div class="search_content"  data-chat="${currentGroupId}">
                <ul>                          
                </ul>
            </div>
        </span>`;
    $("#screen-chat")
      .find(`.right[data-chat=${currentGroupId}] .top .search-add-user-group`)
      .append(viewSearch);
    let removeGroup = ` 
     <i class="fa fa-window-close-o admin-remove-group" data-chat="${currentGroupId}"
      data-uid="${userId}" title="xoa nhóm này"></i>
     `;
    $("#screen-chat")
      .find(`.right[data-chat=${currentGroupId}] .top .remove-group`)
      .append(removeGroup);
  }
  inForUserGroup.forEach((infor) => {
    let userinfor = `<li>
                        <span>
                        <img class="avatar-small" src="/images/users/${infor.avatar}" alt=""> 
                        <strong>${infor.username}</strong>
                        </span><br><br>
                    </li>`;
    let userinforadmin = `<li data-uid="${infor._id}">
                            <span>
                            <img class="avatar-small" src="/images/users/${infor.avatar}" alt=""> 
                            <strong>${infor.username}</strong>
                            <i class="fa fa-times admin-remove-user-group" data-uid="${infor._id}" data-chat="${currentGroupId}"></i>
                            </span><br><br>
                        </li>`;
    if (userId == userOnl && infor._id != userId) {
      $("#screen-chat")
        .find(`.number-members[data-chat=${currentGroupId}] .list-member ul`)
        .append(userinforadmin);
    } else {
      $("#screen-chat")
        .find(`.number-members[data-chat=${currentGroupId}] .list-member ul`)
        .append(userinfor);
    }
  });
  showMemberGroup();
  removeUserInGroup();
  removeGroupChat();
  socket.emit("check-online"); // update id group online
}
