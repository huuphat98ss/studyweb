function searchListUserChat(){
    $(`.search-contact-list`).unbind("keypress").on("keypress",function(element){
    // 13 la key su kien enter
    if(element.which=== 13){
        // let currenUserId = $(this).data("uid");
        let keyword = $(`.search-contact-list`).val();
        // console.log(keyword);
        // console.log(currenUserId);
       
        //console.log(addUserGroup);
       let regexKeyword = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
           if(!keyword.length){
               alert("hay nhap ten can tìm");
               return false;
           }
           if(!regexKeyword.test(keyword)){
               alert("nhap tu khoa khong hop le");
               return false;
           }
           $.get(`/contact/find-user-chat/${keyword}`,function(data){
            // console.log(data);
             $("#search-contact").find(".search-user-list-content").html(data);
             $("#search-contact").find(".search-user-list-results").css("display","block");
             $(".search-contact-list").val("");
             talkWithUser();
         });
    }
    });
}
$(document).ready(function(){
    searchListUserChat();
});