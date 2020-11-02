import moment from "moment";
// chuyen file hinh tu binary ve base64
export let bufferBase64 = (bufferFrom) =>{
    return Buffer.from(bufferFrom).toString("base64");
};
// hien thi tn vua gui ben left
export let lastItemOfArray = (array) =>{
    if(!array.length){
        return [];
    }
    return array[array.length - 1];
}
// tao time gui tin nhan ban moment
export let convertTimes = (timestamp)=>{
    if(!timestamp){
        return"";
    }
    return moment(timestamp).locale("vi").startOf("seconds").fromNow();
}
// time to send mess
export let timeSendMess = (timeSend) =>{
    return moment(timeSend).locale("vi").format("HH:mm, DD/MM/YYYY");
}