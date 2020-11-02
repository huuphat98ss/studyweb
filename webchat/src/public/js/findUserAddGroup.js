function findUserAddGroup(element){
    // 13 laf key su kien enter
    if(element.which=== 13|| element.type === "click"){
        let keyword = $("#btn-search-friend-to-add-group-chat").val();
       // console.log(keyword);
       let regexKeyword = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
           if(!keyword.length){
               alert("chua nhap chu nao het ??");
               return false;
           }
           if(!regexKeyword.test(keyword)){
               alert("nhap ten khong dung");
               return false;
           }
           $.get(`/contact/find-user-add-group/${keyword}`,function(data){
               //console.log(data);
              $("#create-group ul#group-chat-friends").html(data); // add html vao the div co id la find-user chua the ul 
              addorRemoveUserGroup();
              
           });
    }
}
$(document).ready(function(){
    $("#btn-search-friend-to-add-group-chat").bind("keypress", findUserAddGroup);
    $("#btn-search-friend").bind("click", findUserAddGroup);
});