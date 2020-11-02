// khi tao 1 contact se co count number
function increateNumberNotifContact(className){
    let currentValue = +$(`.${className}`).find("em").text();// ket qua sau + la String khi co + la int co the dung parseInt()
    //console.log(currentValue);
    //console.log(typeof currentValue);
    currentValue +=1;
    if(currentValue===0){
        $(`.${className}`).html("");
    }else{
        $(`.${className}`).css("display","inline-block").html(`(<em>${currentValue}</em>)`);
    }
}


function addContact(){ // ham nay dc goi tai finuserContact
    $(".user-add-new-contact").bind("click",function(){
        let targetid = $(this).data("uid"); // data-uid trong the main/section/_find...
       //  console.log(targetid);
       $.post("/contact/add-new",{uid: targetid},function(data){
             //console.log(data); 
             if(data.success){
                $("#find-user").find(`div.user-add-new-contact[data-uid=${targetid}]`).hide();
                $("#find-user").find(`div.user-remove-request-contact-sent[data-uid=${targetid}]`).css("display","inline-block");
                // xu ly readtime
                increateNumberNotification("noti_contact_counter",1);//show count thong bao bên ngoài navbar

                 increateNumberNotifContact("count-request-contact-sent");// show count bên trong modal yeu cau ket ban    
                // lay su kien them ban de bac realtime
                let userInfoHtml = $("#find-user").find(`ul li[data-uid=${targetid}]`).get(0).outerHTML;
                //console.log(userInfoHtml);// lay html do vao dau trong modal yeu cau
                 $("#request-contact-sent").find("ul").prepend(userInfoHtml);// chèn lên đầu tiên
                removeRequestContactSent(); // xoa ben doi xac nhan ket ban 
               socket.emit("add-new-contact",{contactid:targetid});
            }
       });
    });
}

socket.on("response-add-new-contact",function(user){
    increateNumberNotifContact("count-request-contact-received");
    // hien count number ngoai navbar
    increateNumberNotification("noti_contact_counter",1);
    // them ben nhan yeu cau
    let userInfoHtml = `<li class="_contactList" data-uid="${user.id}">
        <div class="contactPanel">
            <div class="user-avatar">
                <img src="images/users/${user.avatar}" alt="">
            </div>
            <div class="user-name">
                <p>
                ${user.username}
                </p>
            </div>
            <br>
            <div class="user-address">
                <span>${user.address}</span>
            </div>
            <div class="user-approve-request-contact-received" data-uid="${user.id}">
                Chấp nhận
            </div>
            <div class="user-remove-request-contact-received action-danger" data-uid="${user.id}">
                Xóa yêu cầu
            </div>
        </div>
    </li>`;
    genderhtml=``;
    if(user.gender === "male"){
        genderhtml = `<i class="fa fa-mars"></i>`;
    }else{
        genderhtml = `<i class="fa fa-venus"></i>`;
    }
    $("#request-contact-received").find("ul").prepend(userInfoHtml);
    $("#request-contact-received").find(`ul li[data-uid=${user.id}] .user-name`).append(genderhtml);
    removeRequestContactReceived();// goi ham xoa yeu cau ket ban 
    approveRequestContactReceived(); // js/approveRequestContactReceived.js
});