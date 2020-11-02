let userAvatar= null;
let userInfo = {};
let originAvatarSrc = null;
let originUserInfor= {}; //lay infor hien tai
let userUpdatePassword = {};
function updateUserInfo(){
    $("#input-change-avatar").bind("change",function(){
        let fileData = $(this).prop("files")[0];// prop la phan tu dau tien tuong ung
        let math=["image/png","image/jpg","image/jpeg"];
        let limit=1048576; // byte = 1MB
        // kq tra ve la -1 la ko khop vs math
        if($.inArray(fileData.type,math)===-1){ // inArray so sanh .type voi math neu ko co kq = -1
            alert("file ko hop le");
            $(this).val(null);
            return false;
        }
        if(fileData.size >limit){
            alert("kich thuoc file phai nho hon 1 MB");
            $(this).val(null);
            return false;
        }
        
        //console.log(fileData);
        // FileReader show anh truoc khi luu
        if(typeof (FileReader) != "undefined"){
            let fileReader= new FileReader();
            fileReader.onload = function(){
                $('#user-modal-avatar').remove();
                let datafile ='<img src="'+fileReader.result+'" id="user-modal-avatar" class="avatar img-circle" alt="avatar" >'
                $("#image-edit-profile").append(datafile);
            }
            fileReader.readAsDataURL(fileData);

            let formData = new FormData();
            formData.append("avatar",fileData);
            userAvatar=formData;
           //console.log(userAvatar.get("avatar"));
        }else{
            alert("trinh duyet ko ho tro file reader");
        }
    });
    $("#input-update-username").bind("change",function(){
        let username = $(this).val();
        // let regexUsername = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
       
        // if(!regexUsername.text(username)){
        //     alert("ten khong hop le");
        //     $(this).val(originUserInfor.username);
        //     delete userInfo.username;
        //     return false;
        // }
        userInfo.username = username;      
    });
    $("#input-update-gender-male").bind("click",function(){
        userInfo.gender = $(this).val();      
    });
    $("#input-update-gender-female").bind("click",function(){
        userInfo.gender = $(this).val();      
    });
    $("#input-update-address").bind("change",function(){
        userInfo.address = $(this).val();      
    });
    $("#input-update-phone").bind("change",function(){
        userInfo.phone = $(this).val();      
    });
    $("#input-update-password").bind("change",function(){
        let currentPassword =  $(this).val(); 
        // let regexPassword =new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);
        // if(!regexPassword.test(currentPassword)){
        //     alert("password ko dung");
        //     $(this).val(null);
        //     delete   userUpdatePassword.currentPassword;
        //     return false; 
        // }
        userUpdatePassword.currentPassword = currentPassword;      
    });
    $("#input-update-new-password").bind("change",function(){
        let newPassword =  $(this).val(); 
        // let regexPassword =new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);
        // if(!regexPassword.test(newPassword)){
        //     alert("password ko dung");
        //     $(this).val(null);
        //     delete   userUpdatePassword.newPassword;
        //     return false; 
        // }
        userUpdatePassword.newPassword = newPassword;       
    });
    $("#input-update-confirm-new-password").bind("change",function(){
        let confirmNewPassword =  $(this).val(); 
        
        // if(!userUpdatePassword.newPassword){
        //     alert("ban chua confirm password");
        //     $(this).val(null);
        //     delete   userUpdatePassword.confirmNewPassword;
        //     return false; 
        // }
        // if(confirmNewPassword !== userUpdatePassword.newPassword){
        //     alert("password confrim khong dung");
        //     $(this).val(null);
        //     delete   userUpdatePassword.confirmNewPassword;
        //     return false; 
        // }
        userUpdatePassword.confirmNewPassword = confirmNewPassword;       
    });
}

function callUpdateAvatar(){
    $.ajax({
        url: "/user/update-avatar",
        type: "put",
        cache: false,
        contentType: false,
        processData: false,
        data: userAvatar,
        success: function(result){
            //console.log(result);
            $(".user-modal-alert-success").find("span").text(result.message);
            $(".user-modal-alert-success").css("display","block");
            //update avatar navbar
            $("#navbar-avatar").attr("src",result.imageSrc);
            //update arigin
            originAvatarSrc = result.imageSrc;//luu duong dan hinh moi
            //reset all 
            $("#input-btn-cancel-update-user").click();
        },
        error: function(error){
           // console.log(error);
            $(".user-modal-alert-error").find("span").text(error.responseText);
            $(".user-modal-alert-error").css("display","block");
            //reset all 
            $("#input-btn-cancel-update-user").click();
        }
       });
}

function callUpdateUserInfor(){
    $.ajax({
        url: "/user/update-infor",
        type: "put",
        // cache: false,
        // contentType: false,
        // processData: false,
        data: userInfo,
        success: function(result){
            //console.log(result);
            $(".user-modal-alert-success").find("span").text(result.message);
            $(".user-modal-alert-success").css("display","block");
            
            originUserInfor = Object.assign(originUserInfor,userInfo); // update dk cungf key
            //update name navbar
            $("#navbar-username").text(originUserInfor.username);
            //reset all 
            //$("#input-btn-cancel-update-user").click();
        },
        error: function(error){
           // console.log(error);
            $(".user-modal-alert-error").find("span").text(error.responseText);
            $(".user-modal-alert-error").css("display","block");
            //reset all 
            $("#input-btn-cancel-update-user").click();
        }
       });
}
function callupdateUserPassword(){
    $.ajax({
        url: "/user/update-password",
        type: "put",
        // cache: false,
        // contentType: false,
        // processData: false,
        data: userUpdatePassword,
        success: function(result){
            //console.log(result);
            $(".user-modal-alert-password-success").find("span").text(result.message);
            $(".user-modal-alert-password-success").css("display","block");

            //reset all 
            $("#input-btn-cancel-update-user-password").click();
        },
        error: function(error){
           // console.log(error);
            $(".user-modal-alert-password-error").find("span").text(error.responseText);
            $(".user-modal-alert-password-error").css("display","block");
            //reset all 
            $("#input-btn-cancel-update-user-password").click();
        }
       });
}
$(document).ready(function(){
   
    originAvatarSrc = $("#user-modal-avatar").attr("src"); // lay duong dan hinh 
    originUserInfor={
        username: $("#input-update-username").val(),
        gender: ( $("#input-update-gender-male").is(":checked") ? $("#input-update-gender-male").val() : $("#input-update-gender-female").val() ),
        address:$("#input-update-address").val(),
        phone:  $("#input-update-phone").val()
    };
    //console.log(originUserInfor);
    //console.log(originAvatarSrc);
    updateUserInfo();
   $("#input-btn-update-user").bind("click",function(){
       if($.isEmptyObject(userInfo) && !userAvatar){ // isEmptyObject kiem tra rỏng
            alert("can thai doi truoc khi cap nhat");
            return false;
       }
    // console.log(userAvatar);
    // console.log(userInfo);
       if(userAvatar){
           callUpdateAvatar();
       }
       if(!$.isEmptyObject(userInfo)){
           callUpdateUserInfor();
       }
   });

   $("#input-btn-cancel-update-user").bind("click",function(){
        userAvatar= null;
        userInfo= {};
        $("#user-modal-avatar").attr("src",originAvatarSrc);
        $("#input-update-username").val(originUserInfor.username);
        (originUserInfor.gender === "male") ? $("#input-update-gender-male").click() : $("#input-update-gender-famale").click();
        $("#input-update-address").val(originUserInfor.address);
        $("#input-update-phone").val(originUserInfor.phone);
   });
   $("#input-btn-update-user-password").bind("click",function(){
        //console.log(userUpdatePassword);
        if(!userUpdatePassword.currentPassword || !userUpdatePassword.newPassword || !userUpdatePassword.confirmNewPassword){
            alert("ban chua thai doi thong tin");
            return false;
        }
        ///console.log("client " + userUpdatePassword);
        callupdateUserPassword();
    });

    $("#input-btn-cancel-update-user-password").bind("click",function(){
        userUpdatePassword={};
        $("#input-update-password").val(null);
        $("#input-update-new-password").val(null);
        $("#input-update-confirm-new-password").val(null);
        
    });
});