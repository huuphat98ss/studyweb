$(document).ready(function(){
    $("#link-read-more-contacts").bind("click", function(){
        let skipNumber = $("#contacts").find("li").length;
        $("#link-read-more-contacts").css("display","none");
       // $(".read-more-contacts-loader").css("display", "inline-block");
        //console.log(skipNumber);
        $.get(`/contact/read-more?skipNumber=${skipNumber}`,function(readmore){
            if(!readmore.length){
                $(".read-more-contacts").css("display","none");  
                return false;
            }
            readmore.forEach(function(user){
                //console.log(user);
               $("#contacts")
                    .find("ul")
                    .append(`<li class="_contactList" data-uid="${user._id}">
                                <div class="contactPanel">
                                    <div class="user-avatar">
                                        <img src="images/users/${user.avatar}" alt="err">
                                    </div>
                                    <div class="user-name">
                                        <p>
                                            ${user.username}
                                        </p>
                                    </div>
                                    <br>
                                    <div class="user-address">
                                        <span>&nbsp ${user.address}</span>
                                    </div>
                                    <div class="user-talk" data-uid="${user._id}">
                                        Trò chuyện
                                    </div>
                                    <div class="user-remove-contact action-danger" data-uid="${user._id}">
                                        Xóa liên hệ
                                    </div>
                                </div>
                            </li>`);
            });
            $("#link-read-more-contacts").css("display","inline");
           // $(".read-more-contacts-loader").css("display", "none");
           talkUser();
        });
    });
});