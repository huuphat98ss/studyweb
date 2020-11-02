let userAdd=[null];
function addorRemoveUserGroup(){ // ham nay dc goi tai finuserContact
    $('ul#group-chat-friends').find('div.add-user').bind("click",function(){
        let targetid = $(this).data("uid");    
            // console.log(userAdd);
        $('ul#group-chat-friends').find(`div.add-user[data-uid=${targetid}]`).remove();
                let result =  userAdd.filter(Add=>{
                    return Add === targetid;
                });
                if(result.length){
                    return '';
                }else{
                    userAdd.push(targetid);
                    // $('ul#group-chat-friends').find(`div.remove-add-user[data-uid=${targetid}]`).css("display","inline-block");
                    let Html=$('#create-group ul#group-chat-friends').find(`li[data-uid=${targetid}]`).get(0).outerHTML;
                    // console.log(Html);
                    $('#create-group .list-user-added').find('ul#friends-added').prepend(Html);
                    $('#create-group .list-user-added').css("display","inline-block");                  
                    // $('ul#group-chat-friends').find(`div.remove-add-user[data-uid=${targetid}]`).remove();
                }
    });

    // $('ul#friends-added').find('.remove-add-user').bind("click",function(){
    //   let targetid=$('.remove-add-user').data("uid");
    //     // let targetid = $(this).data("uid");  
    //          console.log(targetid);
    //          console.log("hello");
    // });
    $('#cancel-group-chat').bind('click', function() {
        $('ul#friends-added').find('li').remove();
        $('#create-group .list-user-added').hide(); 
            userAdd=[null];
            // console.log(userAdd);
    })
    
}

