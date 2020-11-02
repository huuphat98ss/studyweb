let socketChat = (io) =>{
    let clients= {};
    io.on("connection",(socket)=>{
        // console.log("socket.request");
        // console.log(socket.request.user);
        let currentUserId = socket.request.user._id;
        if(clients[currentUserId]){
            clients[currentUserId].push(socket.id);
        }else{
            clients[currentUserId] = [socket.id];
        }
        socket.request.user.ChatGroupIds.forEach(group=>{
            let currentUserId = group._id;
            if(clients[currentUserId]){
                clients[currentUserId].push(socket.id);
            }else{
                clients[currentUserId] = [socket.id];
            }
        });
        //  console.log(clients);

        //tao nhom chat moi 
        socket.on("show-new-group-chat",(data) =>{
            let currentUserId = data.groupChat._id;
                if(clients[currentUserId]){
                    clients[currentUserId].push(socket.id);
                }else{
                    socket.request.user.ChatGroupIds.push({_id:currentUserId});
                    clients[currentUserId] = [socket.id];
                }
                //xoa trung'
                clients[currentUserId] = Array.from(new Set(clients[currentUserId]));
                // console.log(clients);
            let response = {
                groupChat:data.groupChat,        
                userInfor:data.userInfor
            };
                //  console.log(response);
                //  console.log(response.members);
                //  console.log(data.groupChat.members);
                
             if(data.targetId){
                response.userContact = data.userContact;
                
                if(clients[data.targetId]){ 
                    clients[data.targetId].forEach(socketId => {
                        io.sockets.connected[socketId].emit("response-show-group-new-user-add",response);// nho la co' s sau socket - - 
                    });
                }
                // return;
             }
            else{ 
                data.groupChat.members.forEach(member =>{
                    if(clients[member.userId] && member.userId != socket.request.user._id){
                        // console.log(member.userId);
                        
                            clients[member.userId].forEach(socketId => {
                                io.sockets.connected[socketId].emit("response-show-new-group-chat",response); 
                            });
                
                    }
                });
            }
        });

        socket.on("member-groupid",(data)=>{
            let currentUserId = data.groupChatId;
                if(clients[currentUserId]){
                     socket.request.user.ChatGroupIds.push({_id:currentUserId});
                    clients[currentUserId].push(socket.id);
                }else{
                    clients[currentUserId] = [socket.id];
                }
            // console.log("sau them group");
            // console.log( clients);
        });
        // notify new user add group
        socket.on("notifi-add-new-user-group",(data)=>{
            let response = {
                targetId:data.userContact,
                groupChat:data.groupChat
            };
            if(clients[data.groupChat._id]){
                clients[data.groupChat._id].forEach(socketId => {
                    io.sockets.connected[socketId].emit("response-notifi-add-new-user-group",response);// nho la co' s sau socket - - 
                });
            }
        });
        // gui tin dang text va emoji
        socket.on("chat-text-emoji",(data) =>{
            //console.log(socket.request.user); // neu chua cau hinh passportSocketIo  cookieparser thi kq undefinded
            if(data.groupId){
                let response = {
                    currentGroupId:data.groupId,
                    currentUserId:socket.request.user._id,
                    message:data.message,
                    sender:data.sender
                };
                if(clients[data.groupId]){
                    clients[data.groupId].forEach(socketId => {
                        io.sockets.connected[socketId].emit("response-chat-text-emoji",response);// nho la co' s sau socket - - 
                    });
                }
            }
            if(data.contactId){
                let response = {
                    currentUserId:socket.request.user._id,
                    message:data.message,
                    sender:data.sender
                };
                if(clients[data.contactId]){
                    clients[data.contactId].forEach(socketId => {
                        io.sockets.connected[socketId].emit("response-chat-text-emoji",response);// nho la co' s sau socket - - 
                    });
                }
            }
            
        });

        // gui tin dang image
        socket.on("chat-image",(data) =>{
            //console.log(data);
            //console.log(socket.request.user); // neu chua cau hinh passportSocketIo  cookieparser thi kq undefinded
            if(data.groupId){
                let response = {
                    currentGroupId:data.groupId,
                    currentUserId:socket.request.user._id,
                    message:data.message,
                    sender:data.sender
                };
                if(clients[data.groupId]){
                    clients[data.groupId].forEach(socketId => {
                        
                        io.sockets.connected[socketId].emit("response-chat-image",response);// nho la co' s sau socket - - 
                    });
                }
            }
            if(data.contactId){
                let response = {
                    currentUserId:socket.request.user._id,
                    message:data.message,
                    sender:data.sender
                };
                if(clients[data.contactId]){
                    clients[data.contactId].forEach(socketId => {
                        io.sockets.connected[socketId].emit("response-chat-image",response);// nho la co' s sau socket - - 
                    });
                }
            }
            
        });
        // gui tin dang file 
        socket.on("chat-attach",(data) =>{
            //console.log(data);
            //console.log(socket.request.user); // neu chua cau hinh passportSocketIo  cookieparser thi kq undefinded
            if(data.groupId){
                let response = {
                    currentGroupId:data.groupId,
                    currentUserId:socket.request.user._id,
                    message:data.message,
                    sender:data.sender
                };
                if(clients[data.groupId]){
                    clients[data.groupId].forEach(socketId => {
                        io.sockets.connected[socketId].emit("response-chat-attach",response);// nho la co' s sau socket - - 
                    });
                }
            }
            if(data.contactId){
                let response = {
                    currentUserId:socket.request.user._id,
                    message:data.message,
                    sender:data.sender
                };
                if(clients[data.contactId]){
                    clients[data.contactId].forEach(socketId => {
                        io.sockets.connected[socketId].emit("response-chat-attach",response);// nho la co' s sau socket - - 
                    });
                }
            }
            
        });
        // bat su kien nhap phim'
        socket.on("user-is-typing",(data) =>{
            //console.log(data);
            //console.log(socket.request.user); // neu chua cau hinh passportSocketIo  cookieparser thi kq undefinded
            if(data.groupId){
                let response = {
                    currentGroupId:data.groupId,
                    currentUserId:socket.request.user._id,
                   
                };
                if(clients[data.groupId]){
                    clients[data.groupId].forEach(socketId => {
                        io.sockets.connected[socketId].emit("response-user-is-typing",response);// nho la co' s sau socket - - 
                    });
                }
            }
            if(data.contactId){
                let response = {
                    currentUserId:socket.request.user._id,
                };
                if(clients[data.contactId]){
                    clients[data.contactId].forEach(socketId => {
                        io.sockets.connected[socketId].emit("response-user-is-typing",response); 
                    });
                }
            }
            
        });
        // tac su kien nhap phim'
        socket.on("user-is-off-typing",(data) =>{
            // console.log("typing ");
            // console.log(clients);
            if(data.groupId){
                let response = {
                    currentGroupId:data.groupId,
                    currentUserId:socket.request.user._id,
                   
                };
                if(clients[data.groupId]){
                    clients[data.groupId].forEach(socketId => {
                        io.sockets.connected[socketId].emit("response-user-is-off-typing",response); 
                    });
                }
            }
            if(data.contactId){
                let response = {
                    currentUserId:socket.request.user._id,
                };
                if(clients[data.contactId]){
                    clients[data.contactId].forEach(socketId => {
                        io.sockets.connected[socketId].emit("response-user-is-off-typing",response); 
                    });
                }
            }
            
        });
        // check online user or group
        socket.on("check-online",()=>{
            let listUserOnl = Object.keys(clients); // id user đang onl
           // console.log(listUserOnl); 
        // gui id user dang onl truc tiep, tới người mới onl
            socket.emit("list-user-onl",listUserOnl);
        // gui id user moi dang nhap tru user do ra
            socket.broadcast.emit("new-user-onl",socket.request.user._id);
        });
        // update user in-group 
        socket.on("update-user-in-Group",(data) =>{
                let response = {
                    currentUserId:data.currentUserId,
                    currentGroupId:data.idGroup,
                    targetId:data.uid
                };
                if(clients[data.idGroup]){
                    clients[data.idGroup].forEach(socketId => {
                        io.sockets.connected[socketId].emit("response-update-user-in-Group",response);// nho la co' s sau socket - - 
                    });
                }
        });
        //disconnect User remove group 
        socket.on("notify-disconnect-user-in-Group",(data)=>{
            let currentUserId = data.idGroup;    
                    socket.request.user.ChatGroupIds.forEach(group=>{
                        if(clients[group._id] === clients[currentUserId]){
                            clients[group._id] =  clients[group._id].filter(socketId=>{
                                return socketId !== socket.id;
                            });
                        }
                    });
                    
                // console.log("sau khi xoa user khoi group");
                // console.log(clients);
        })
        // remove Group chat
        socket.on("remove-group-chat",(data) =>{
            let response = {
                currentGroupId:data.idGroup,
                currentUserId:data.currentUserId
            };
            if(clients[data.idGroup]){
                clients[data.idGroup].forEach(socketId => {
                    io.sockets.connected[socketId].emit("response-remove-group-chat",response);// nho la co' s sau socket - - 
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
            // console.log("sau disconnect user")
            // console.log(clients);
            socket.request.user.ChatGroupIds.forEach(group=>{
                clients[group._id] =  clients[group._id].filter(socketId=>{
                    return socketId !== socket.id;
                });
                if(!clients[group._id].length){
                    delete clients[group._id];
                }
            });
            // console.log("sau disconnect")
            // console.log(clients);
            // gui id user moi thoat disconnect
            socket.broadcast.emit("new-user-offline",socket.request.user._id);
        });
        // console.log("end")
        // console.log(clients);
    });
}
module.exports = socketChat;