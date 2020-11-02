
// const socket = io();
const socket = io.connect('http://localhost:8888');

function nineScrollLeft() {
  $('.left').niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
}
// resize lai scroll
function resizeScrollLeft(){
  $(".left").getNiceScroll().resize();
}

function nineScrollRight(divId) {
  $(`.right .chat[data-chat=${divId}]`).niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
  // fix phan scroll neu ko kiem tra coi da co user trong view chua thi se bi warned scrollHeight
  if($(".room-chat").find(`li[data-chat=${divId}]`).hasClass("person")){    
    $(`.right .chat[data-chat=${divId}]`).scrollTop($(`.right .chat[data-chat=${divId}]`)[0].scrollHeight);
  }
}

function enableEmojioneArea(divId) {
  $(`#write-chat-${divId}`).emojioneArea({
    standalone: false,
    pickerPosition: 'top',
    filtersPosition: 'bottom',
    tones: false,
    autocomplete: false,
    inline: true,
    hidePickerOnBlur: true,
    search: false,
    shortnames: false,
    events: {
      keyup: function(editor, event) {
        $(`#write-chat-${divId}`).val(this.getText());//gan gia tri vao trong the input
      },
      click: function(){
        textAndEmojiChat(divId); // goi gui tn 
        TypingOn(divId);// goi typing on
      },
      blur: function(){
        TypingOff(divId); // goi typing off
      }
    },
  });
  // $('.icon-chat').bind('click', function(event) {
  //   event.preventDefault();
  //   $('.emojionearea-button').click();
  //   $('.emojionearea-editor').focus();
  // });
}
// convert emoji-text to image
function addimageIcon(){
  $(".notif-chat").each(function() {
    let original = $(this).html();
   // console.log(original);
    let converted =  emojione.toImage(original);
    $(this).html(converted);
});
}

function showModalContacts() {
  $('#show-modal-request').click(function() {
    $(this).find('.noti_contact_counter').fadeOut('slow');
  });
  $('#show-modal-contacts').click(function() {
    $(this).find('.count-contacts').fadeOut('slow');
  });
}

function gridPhotos(layoutNumber) {
  $(".show-images").unbind("click").on("click",function(){
    let href = $(this).attr("href");
    let modalImagesid = href .replace("#",""); // lay chuoi bo dau #
   //console.log(modalImagesid);
   let originDataImage = $(`#${modalImagesid}`).find("div.modal-body").html();
   let countRows = Math.ceil($(`#${modalImagesid}`).find("div.all-images>img").length / layoutNumber);
   let layoutStr = new Array(countRows).fill(layoutNumber).join("");

   $(`#${modalImagesid}`).find("div.all-images").photosetGrid({
     highresLinks: true,
     rel: "withhearts-gallery",
     gutter: "2px",
     layout: layoutStr,
     onComplete: function() {
       $(`#${modalImagesid}`).find(".all-images").css({
         "visibility": "visible"
       });
       $(`#${modalImagesid}`).find(".all-images a").colorbox({
         photo: true,
         scalePhotos: true,
         maxHeight: "90%",
         maxWidth: "90%"
       });
     }
   });

   // even dong modal
   $(`#${modalImagesid}`).on("hidden.bs.modal",function(){
    $(this).find("div.modal-body").html(originDataImage);
   });
  });
}

function changeScreenChat(){
  $(".room-chat").unbind("click").on("click",function(){
    let divId= $(this).find("li").data("chat");
    $(".person").removeClass("active");
    $(`.person[data-chat=${divId}]`).addClass("active");
    $(this).tab("show");// dung' hien thi noi dung chat ben phai data-target
    // cau hinh thanh cuong scroll 
    //console.log(divId);
    nineScrollRight(divId);
    // // show thong tin user trong nhom 
    // showUserGroup(divId);
    // Bật emoji, tham số truyền vào là id của box nhập nội dung tin nhắn
    enableEmojioneArea(divId);
    // Bat image message
    imageChat(divId);
    // bat file message
    attachmentChat(divId);
    // find user add group
    findNewUserAddGroup(divId);
  });
}

function showProfile() {
  $('.password').bind('click', function() {
    $('#seting-profile').fadeOut('fast', function() {
        $('#password-profile').fadeIn('fast');
          $('#title-profile').html('Thay đổi mật khẩu');
    });
    //$('.alert').removeClass('alert alert-danger').html('');
  })
  $('.profile').bind('click', function() {
    $('#password-profile').fadeOut('fast', function() {
        $('#seting-profile').fadeIn('fast');
          $('#title-profile').html('Tài khoản cá nhân');
    });
  //$('.alert').removeClass('alert alert-danger').html('');
  })
}

// infor-memberGroup
function showMemberGroup() {
  $('.number-members').unbind("click").on("click",function() {
    $('.infor-member').fadeIn('fast', 'linear');
    // $('.infor-member').fadeToggle('fast', 'linear');
    //$('.list-member').fadeOut('slow');
    return false;
  });
  $(document).click(function() {
    $('.infor-member').fadeOut('fast', 'linear');
    // tac tab ket qua khi tim add them user vao group
    $('.search-results').fadeOut('fast', 'linear');
    // tac tab ket qua khi tim user chat
    $('.search-user-list-results').fadeOut('fast', 'linear');
  });
}
// show time send
function showtimechat() {
  $('.bubble').unbind("click").on("click",function() {
   let message = $(this).data("mess-id");
   $('.chat').find(`.time-chat[data-mess-id=${message}]`).fadeIn('fast');
  //  console.log(message);
   return false;
  })
  $(document).click(function() {
    $('.chat').find(`.time-chat`).fadeOut('fast');
  });
}
//su ly file phan chat gui hinh file encoded arraybuffer to base64
// function bufferToBase64(buffer){
//   return btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte),"") );
// }

function bufferToBase64(buffer) {
  let binary = '';
  let bytes = new Uint8Array(buffer); // chuyển từ mảng buffer về mảng uint
  let len = bytes.byteLength; // lấy độ dài của mảng uint
  for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]); // chuyển uint thành string 
  }
  return window.btoa(binary); // chuyển từ string thành base64
}

//zoom image
function zoomImage(){
    $("#screen-chat .content-chat .bubble-image-file .show-image-chat").bind('click',function(){
      let getSrc = $(this).attr("src");
        // console.log(getSrc);
      $('#overlay #showzoom').attr('src',`${getSrc}`);  
      $('#overlay')
        .addClass('open')
        .one('click', function() { $(this).removeClass('open'); });

       
    });
}
$(document).ready(function() {
  showtimechat();
  //show Profile
  showProfile();
  // Hide số thông báo trên đầu icon mở modal contact
  showModalContacts();

  // Bật thông tin thành viên trong nhóm
  showMemberGroup();
  // Cấu hình thanh cuộn
  nineScrollLeft();

  // Hiển thị hình ảnh grid slide trong modal tất cả ảnh, tham số truyền vào là số ảnh được hiển thị trên 1 hàng.
  // Tham số chỉ được phép trong khoảng từ 1 đến 5
  gridPhotos(5);

  // right thai doi mang hinh chat
  changeScreenChat();
  // chuyen uinc thanh image icon 
  addimageIcon();
  // hien thi active nguoi dau tien  ben left 
  if($("ul.people").find("li").length > 1){
    $("ul.people").find("li")[0].click();
  }
  //zoom image
  zoomImage();
});
