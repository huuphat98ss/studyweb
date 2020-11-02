//file dung hien thi so luong thong bao 
function increateNumberNotification(className,number){
    let currentValue = +$(`.${className}`).text();// ket qua sau + la String khi co + la int co the dung parseInt()
    currentValue +=number;
    if(currentValue===0){
        $(`.${className}`).css("display","none").html("");
    }else{
        $(`.${className}`).css("display","block").html(currentValue);
    }
    
}

function decreateNumberNotification(className,number){
    let currentValue = +$(`.${className}`).text();
    //console.log(currentValue);
    currentValue -=number;
    //console.log(currentValue);
    if(currentValue===0){
        $(`.${className}`).css("display","none").html("");
    }else{
        $(`.${className}`).css("display","block").html(currentValue);
    }
    
}