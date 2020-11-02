let socketContact = (io) =>{
    let clients= {};
    io.on("connection",(socket)=>{
        let currentUserId = socket.request.user._id;
        //console.log(currentUserId);
        if(clients[currentUserId]){
            clients[currentUserId].push(socket.id);
        }else{
            clients[currentUserId] = [socket.id];
        }
        //console.log(clients);
        // them ban 
        socket.on("add-new-contact",(data) =>{
            //console.log(data);
            //console.log(socket.request.user); // neu chua cau hinh passportSocketIo  cookieparser thi kq undefinded
            
            let currentUser = {
                id:socket.request.user._id,
                username: socket.request.user.username,
                avatar:socket.request.user.avatar,
                address:socket.request.user.address
            };
            if(clients[data.contactid]){
                clients[data.contactid].forEach(socketId => {
                    io.sockets.connected[socketId].emit("response-add-new-contact",currentUser);// nho la co' s sau socket - - 
                });
            }
        });
        // chap nhan yeu cau ket ban 
        socket.on("approve-request-contact-received",(data) =>{
            //console.log(data);
            //console.log(socket.request.user); // neu chua cau hinh passportSocketIo  cookieparser thi kq undefinded
            let userInforReceived = data.userInforReceived; // infor nguoi nhan yeu cau
            let currentUser = {
                id:socket.request.user._id,
                username: socket.request.user.username,
                avatar:socket.request.user.avatar,
                address:socket.request.user.address
            };
            if(clients[data.contactid]){
                clients[data.contactid].forEach(socketId => {
                    io.sockets.connected[socketId].emit("response-approve-request-contact-received",{
                        currentUser:currentUser,
                        userInforReceived:userInforReceived
                    });// nho la co' s sau socket - - 
                });
            }
        });

        // huy ket ban 
        socket.on("remove-contact",(data) =>{
            //console.log(data);
            //console.log(socket.request.user); // neu chua cau hinh passportSocketIo  cookieparser thi kq undefinded
            
            let currentUser = {
                id:socket.request.user._id,
            };
            if(clients[data.contactid]){
                clients[data.contactid].forEach(socketId => {
                    io.sockets.connected[socketId].emit("response-remove-contact",currentUser);// nho la co' s sau socket - - 
                });
            }
        });
        // huy yeu cau ket ban da nhan
        socket.on("remove-request-contact-received",(data) =>{
            //console.log(data);
            //console.log(socket.request.user); // neu chua cau hinh passportSocketIo  cookieparser thi kq undefinded
            
            let currentUser = {
                id:socket.request.user._id,
            };
            if(clients[data.contactid]){
                clients[data.contactid].forEach(socketId => {
                    io.sockets.connected[socketId].emit("response-remove-request-contact-received",currentUser);// nho la co' s sau socket - - 
                });
            }
        });
        //huy yeu cau ket ban da gui
        socket.on("remove-request-contact-sent",(data) =>{
            //console.log(data);
            //console.log(socket.request.user); // neu chua cau hinh passportSocketIo  cookieparser thi kq undefinded
            
            let currentUser = {
                id:socket.request.user._id,
            };
            if(clients[data.contactid]){
                clients[data.contactid].forEach(socketId => {
                    io.sockets.connected[socketId].emit("response-remove-request-contact-sent",currentUser);// nho la co' s sau socket - - 
                });
            }
        });
        
        socket.on("disconnect",()=>{
            clients[currentUserId] =  clients[currentUserId].filter(socketId=>{
                return socketId !== socket.id;
            });// filter dung tra ve cac gia tri thoa dieu kien tao thanh mang moi 
            if(!clients[currentUserId].length){
                delete clients[currentUserId];
            }
        });
       // console.log(clients);
    });
}
module.exports = socketContact;