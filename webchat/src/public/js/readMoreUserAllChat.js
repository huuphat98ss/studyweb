$(document).ready(function () {
  $("#link-read-more-user-chat-all").bind("click", function () {
    let skipPersonal = $("#all-chat").find("li:not(.group-chat)").length;
    let skipGroup = $("#all-chat").find("li.group-chat").length;
    //  console.log(skipPersonal);
    //  console.log(skipGroup);

    $.get(
      `/message/read-more-user-all-chat?skipPersonal=${skipPersonal}&skipGroup=${skipGroup}`,
      function (data) {
        // console.log(data);
        //console.log(data.right);
        if (data.left.trim() === "") {
          $("#link-read-more-user-chat-all").remove();
          return false;
        }
        // add load vao left
        $("#all-chat").find("ul").append(data.left);
        resizeScrollLeft();
        nineScrollLeft();
        // add load vao right
        $("#screen-chat").append(data.right);
        // show user in group
        showMemberGroup();
        changeScreenChat();
        // read more message
        readMoreMessages();
        // emoji icon image
        addimageIcon();
        //zoomimage
        zoomImage();
        // check onl
        showtimechat(); // gọi event show time send
        //xoa nhom
        removeGroupChat();
        //xoa thanh vien trong nhom
        removeUserInGroup();
        socket.emit("check-online");
      }
    );
  });
});
