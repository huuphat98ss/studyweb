function removeUserInGroup() {
  $(".admin-remove-user-group")
    .unbind("click")
    .on("click", function () {
      let result = confirm("xác nhận đưa người này ra khỏi nhóm!!");
      if (result) {
        let targetid = $(this).data("uid");
        let idGroup = $(this).data("chat");
        //console.log(targetid);
        //console.log(idGroup);
        $.ajax({
          url: "/contact/remove-user-in-group",
          type: "delete",
          data: {
            uid: targetid,
            idGroup: idGroup,
          },
          success: function (data) {
            if (data.success) {
              // cap nhat lai so luong thanh vien phai client
              decreateNumberMemberGroup(idGroup);
              $("#screen-chat .right .top")
                .find(
                  `.number-members .list-member ul li[data-uid=${targetid}]`
                )
                .remove();
              socket.emit("update-user-in-Group", {
                currentUserId: data.currentUserId,
                uid: targetid,
                idGroup: idGroup,
              });
            }
          },
        });
      } else {
        return;
      }
    });
}

$(document).ready(function () {
  removeUserInGroup();
  socket.on("response-update-user-in-Group", function (response) {
    let idUser = $("#navbar-user").data("uid");
    //    console.log(idUser);
    if (response.currentUserId != idUser) {
      if (response.targetId === idUser) {
        $("#screen-chat")
          .find(`.write[data-chat=${response.currentGroupId}]`)
          .remove();
        HtmlNotifi = `<div class="bubble-notifi">
                                    <span class="notif-chat"> ban da khong con trong nhom nay !! </span>
                                </div>`;
        $("#screen-chat")
          .find(`.content-chat .chat[data-chat=${response.currentGroupId}]`)
          .append(HtmlNotifi);
        socket.emit("notify-disconnect-user-in-Group", {
          idGroup: response.currentGroupId,
        });
      }
      decreateNumberMemberGroup(response.currentGroupId);
      $("#screen-chat .right .top")
        .find(
          `.number-members .list-member ul li[data-uid=${response.targetId}]`
        )
        .remove();
    }
  });
});
