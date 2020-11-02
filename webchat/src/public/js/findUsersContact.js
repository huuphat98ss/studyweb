function callFindUser(element){
    // 13 laf key su kien enter
    if(element.which=== 13|| element.type === "click"){
        let keyword = $("#input-find-users-contact").val();
       // console.log(keyword);
       let regexKeyword = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
           if(!keyword.length){
               alert("chua nhap chu nao het ??");
               return false;
           }
           if(!regexKeyword.test(keyword)){
               alert("nhap ko chinh xac");
               return false;
           }
           $.get(`/contact/find-users/${keyword}`,function(data){
              // console.log(data);
              $("#input-find-users-contact").val("");
              $("#find-user-new ul").html(data); // add html vao the div co id la find-user chua the ul 
              addContact(); // js/addContact.js
              removeRequestContactSent();
              $("#find-user").modal('show');
           });
    }
}
$(document).ready(function(){
    $("#input-find-users-contact").bind("keypress", callFindUser);
    // $("#btn-find-users-contact").bind("click", callFindUser);
});