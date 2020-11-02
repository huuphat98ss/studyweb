function findNewUserAddGroup(divId){
    $(`.searchBox[data-chat=${divId}]`).unbind("keypress").on("keypress",function(element){
    // 13 la key su kien enter
    if(element.which=== 13){
        let keyword = $(`.searchBox[data-chat=${divId}]`).val();
        //console.log(keyword);
        //console.log(divId);
        let addUserGroup = {
            idGroup: divId,
            nameUser: keyword
        }
        //console.log(addUserGroup);
       let regexKeyword = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
           if(!keyword.length){
               alert("hay nhap ten can them");
               return false;
           }
           if(!regexKeyword.test(keyword)){
               alert("nhap tu khoa khong hop le");
               return false;
           }
           $.post("/contact/find-new-user-group",addUserGroup,function(data){
               //console.log(data);
                $(`.search-add-user-group`).find(`.search_content[data-chat=${divId}]`).html(data);
                $(`.search-results[data-chat=${divId}]`).css("display","block");
                $(`.searchBox[data-chat=${divId}]`).val("");
                addNewUserInGroup();
           });
    }
    });
}
// $(document).ready(function(){
//     addNewUserInGroup();
// });