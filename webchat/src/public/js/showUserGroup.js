function showUserGroup(){
    $(".number-members").unbind("click").on("click",function(){
        let idGroup = $(this).data("chat");
       // console.log(idGroup);
        $.get(`/message/userGroup?idGroup=${idGroup}`,function(data){
          //  console.log(data);
          data.forEach(infor => {
              // console.log(infor.username);
            let InforUserhtml = ` <span>    
            <strong>${infor.username}</strong> 
            </span><br><br><br> `
            $(`#member-group-${idGroup}`).find(".list-member").append(InforUserhtml);
          });
            
        });
    });
};
// $(document).ready(function() {
//     showUserGroup();
// })