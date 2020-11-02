// cap nhat so luong tin nhan ngoai view 
function increaseNumberMessageGroup(divId){
    let currentValue = +$(`.right[data-chat=${divId}]`).find("span.show-number-message").text();
    currentValue +=1;
    $(`.right[data-chat=${divId}]`).find("span.show-number-message").html(currentValue);
}
// cap nhat so luong thanh vien ngoai view 
function increaseNumberMemberGroup(divId){
    let currentValue = +$(`.right[data-chat=${divId}]`).find("span.show-number-members").text();
    currentValue +=1;
    $(`.right[data-chat=${divId}]`).find("span.show-number-members").html(currentValue);
}
//giam so luong thanh vie nsau khi remove
function decreateNumberMemberGroup(divId){
    let currentValue = +$(`.right[data-chat=${divId}]`).find("span.show-number-members").text();
    currentValue -=1;
    $(`.right[data-chat=${divId}]`).find("span.show-number-members").html(currentValue);
    
}