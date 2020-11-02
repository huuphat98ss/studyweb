import contactModel from "./../models/contactModel";
import userModel from "./../models/userModel";
import chatGroupModel from "./../models/chatGroupModel";
import messAgeModel from "./../models/messageModel";
import lodash from "lodash"; // sort du lieu
import {transErrors} from "./../../lang/vi";
import fsExtra from "fs-extra";// xu ly xoa hinh

const LIMIT_CONVERSATIONS_TAKEN = 2;
const LIMIT_MESSAGES_TAKEN = 15;
let getAllConversationItems = (currentUserId) =>{
    return new Promise(async(resolve,reject) => {
        try{
            let contacts = await contactModel.getContacts(currentUserId,LIMIT_CONVERSATIONS_TAKEN);
            let userConversationPromise = contacts.map(async(contact)=>{
                if(contact.contactId == currentUserId ){
                   let getUserContact = await userModel.getNormalUserDataById(contact.userId);
                   getUserContact.updatedAt = contact.updatedAt; // dung de xac dinh nguoi nao dc uu tin trong chat
                   return getUserContact;
                }else{
                   let getUserContact = await userModel.getNormalUserDataById(contact.contactId);
                   getUserContact.updatedAt = contact.updatedAt;
                   return getUserContact;
                }
            });
            // Promise.all dung de tra ve tat ca cac tac vu ko dong bo cung 1 luc
            //console.log("show danh sach");
            //console.log(userConversationPromise); 
            let userConversations = await Promise.all(userConversationPromise);
            let groupConversation = await chatGroupModel.getChatGroups(currentUserId,LIMIT_CONVERSATIONS_TAKEN);
            // add infor user 
            let groupConversationPromise = groupConversation.map(async(Group)=>{
                    Group = Group.toObject(); 
                let userGroup = Group.members.map(async(id)=>{
                    let UserInfor = await userModel.getNormalUserDataById(id.userId);
                    return UserInfor;
                });
                    let userInGroup = await Promise.all(userGroup);
                    //console.log(userInGroup);
                Group.Infor = userInGroup;
                return Group;
            });
            let groupConversations = await Promise.all(groupConversationPromise);
            let allConversations =userConversations.concat(groupConversations);// concat thanh 1 chuoi
             //console.log(allConversations);
             //console.log(userConversations);
             //console.log(groupConversations);
            allConversations = lodash.sortBy(allConversations,(item)=>{
                return -item.updatedAt;// sx tu cao den thap theo date 
            });
           
            // lay noi dung tin nhan
            let allConversationWithMessagesPromise = allConversations.map(async(conversation)=>{
               //conversation = conversation.toObject(); // chuyen ve object
                if(conversation.members){
                    let getMessages = await messAgeModel.model.getMessagesInGroup(conversation._id,LIMIT_MESSAGES_TAKEN);             
                    conversation.messages = lodash.reverse(getMessages); //dao chieu mang
                }else{
                    let getMessages = await messAgeModel.model.getMessages(currentUserId,conversation._id,LIMIT_MESSAGES_TAKEN);             
                    conversation.messages = lodash.reverse(getMessages); 
                    //conversation.messages = getMessages.reverse(); 
                }          
                return conversation;
            });
            
            //console.log(allConversationWithMessagesPromise);
            let allConverter = await Promise.all(allConversationWithMessagesPromise);
                // allConversationWithMessages = lodash.sortBy(allConversationWithMessages,(item)=>{
                //     return -item.updatedAt;
                // });
                //console.log(allConversationWithMessages);
                // add infor user chat hineer thị thông tin người chat avatar
                let allConver = allConverter.map(async(users)=>{
                            let convers = users.messages.map(async(mess)=>{
                                let userinFor = await userModel.getNormalUserDataById(mess.senderId);
                                mess.inForUser = userinFor;
                                return mess;
                            });
                            let converte = await Promise.all(convers);
                            users.messages = converte;
                            return users;
                })
                let allConversationWithMessages = await Promise.all(allConver);
                // console.log(allConversationWithMessages);
                // console.log("///////////////////////");
                // allConversationWithMessages.forEach(id=>{
                    
                //     console.log(id.messages);
                // })
                // console.log("///////////////////////");
                // allConversationWithMessages.forEach(id=>{
                //     id.messages.forEach(m=>{
                //         console.log(m.inForUser);
                //     });
                // }) 

                allConversationWithMessages = lodash.sortBy(allConversationWithMessages,(item)=>{
                    return -item.updatedAt;
                });

                //messages file image
            // let allConversation = userConversations.concat(groupConversation);
            // let allConversationWithMessageFilePromise = allConversation.map(async(conversation)=>{
            //      conversation = conversation.toObject(); // chuyen ve object
            //     if(conversation.members){
            //         let getMessages = await messAgeModel.model.getMessagesFileInGroup(conversation._id);             
            //         conversation.messages = lodash.reverse(getMessages); //dao chieu mang
            //     }else{
            //         let getMessages = await messAgeModel.model.getMessagesFile(currentUserId,conversation._id);             
            //         conversation.messages = lodash.reverse(getMessages); 
            //         //conversation.messages = getMessages.reverse(); 
            //     }          
            //     return conversation;
            // });

            resolve({
                //allConversations:allConversations,
                allConversationWithMessages:allConversationWithMessages,      
            });
        } catch(error){
            reject(error);
        }
    });
};
let addNewTextEmoji = (senderId,receiverId,messageVal,isChatGroup)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            if(isChatGroup){
                let getChatGroupReceiver = await chatGroupModel.getChatGroupById(receiverId);
                if(!getChatGroupReceiver){
                    return reject(transErrors.conversation_not_found);
                }
                // phuc vu cho viet chat khi chua co tren view list
                let getInforUserGroup = getChatGroupReceiver.members.map(async(member)=>{
                    let userInGroup = await userModel.getNormalUserDataById(member.userId);
                    return userInGroup;
                });
                 let getInforGroup = await Promise.all(getInforUserGroup);
                //console.log(getInforGroup);
                
                let newMessageItem = {              
                    senderId:senderId,
                    receiverId:receiverId,
                    conversationType:messAgeModel.conversationTypes.GROUP,
                    messageType:messAgeModel.messageTypes.TEXT,
                    text:messageVal,
                    createdAt:Date.now()               
                };
                let newMessage= await messAgeModel.model.createNew(newMessageItem);
                newMessage = newMessage.toObject();
                newMessage.inForGroup = getChatGroupReceiver;
                newMessage.inForUserGroup = getInforGroup;
                  //console.log(newMessage);
                // cap nhat Group chat
                await chatGroupModel.updateMessage(getChatGroupReceiver._id,getChatGroupReceiver.messageAmount + 1);
                resolve(newMessage);
            }else{
                let getUserReceiver = await userModel.getNormalUserDataById(receiverId);
                if(!getUserReceiver){
                    return reject(transErrors.conversation_not_found);
                }
                let newMessageItem = { 
                    senderId:senderId,
                    receiverId:receiverId,
                    conversationType:messAgeModel.conversationTypes.PERSONAL,
                    messageType:messAgeModel.messageTypes.TEXT,
                    text:messageVal,
                    createdAt:Date.now()               
                };
                let newMessage= await messAgeModel.model.createNew(newMessageItem);
                 
                 await contactModel.updateMessage(senderId,getUserReceiver._id);// cap nhat lai date 
                resolve(newMessage);
            }
        }catch(error){
            reject(error);
        }
    });
};
let addNewImage = (senderId,receiverId,messageVal,isChatGroup)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            //console.log(messageVal);
            if(isChatGroup){
                let getChatGroupReceiver = await chatGroupModel.getChatGroupById(receiverId);
                if(!getChatGroupReceiver){
                    return reject(transErrors.conversation_not_found);
                }
                  // phuc vu cho viet chat khi chua co tren view list
                let getInforUserGroup = getChatGroupReceiver.members.map(async(member)=>{
                    let userInGroup = await userModel.getNormalUserDataById(member.userId);
                    return userInGroup;
                });
                let getInforGroup = await Promise.all(getInforUserGroup);
                //console.log(messageVal);
                let imageBuffer = await fsExtra.readFile(messageVal.path);
                //console.log(imageBuffer);
                let imageContentType = messageVal.mimetype;
                let imageName = messageVal.originalname;
                let newMessageItem = {
                    senderId:senderId,
                    receiverId:receiverId, 
                    conversationType:messAgeModel.conversationTypes.GROUP,
                    messageType:messAgeModel.messageTypes.IMAGE,
                    file:{ data: imageBuffer, contentType:imageContentType, fileName:imageName},
                    createdAt:Date.now()               
                };
                let newMessage= await messAgeModel.model.createNew(newMessageItem);
                //console.log(typeof newMessage);
                //bo sung cho phan view chat khi ko co trong list hien tai.
                newMessage = newMessage.toObject();
                newMessage.inForGroup = getChatGroupReceiver;
                newMessage.inForUserGroup = getInforGroup;
                newMessage.file.data = imageBuffer;
                //console.log(newMessage);
                // cap nhat Group chat
                await chatGroupModel.updateMessage(getChatGroupReceiver._id,getChatGroupReceiver.messageAmount + 1);
                resolve(newMessage);
            }else{
                let getUserReceiver = await userModel.getNormalUserDataById(receiverId);
                if(!getUserReceiver){
                    return reject(transErrors.conversation_not_found);
                }
                
                let imageBuffer = await fsExtra.readFile(messageVal.path);
                let imageContentType = messageVal.mimetype;
                let imageName = messageVal.originalname;

                let newMessageItem = {
                    senderId:senderId,
                    receiverId:receiverId,
                    conversationType:messAgeModel.conversationTypes.PERSONAL,
                    messageType:messAgeModel.messageTypes.IMAGE,
                    file:{ data: imageBuffer, contentType:imageContentType, fileName:imageName},
                    createdAt:Date.now()               
                };
                let newMessage= await messAgeModel.model.createNew(newMessageItem);
                // newMessage = newMessage.toObject();
                 await contactModel.updateMessage(senderId,getUserReceiver._id);// cap nhat lai date 
                resolve(newMessage);
            }
        }catch(error){
            reject(error);
        }
    });
};
let addNewAttach = (senderId,receiverId,messageVal,isChatGroup)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            if(isChatGroup){
                let getChatGroupReceiver = await chatGroupModel.getChatGroupById(receiverId);
                if(!getChatGroupReceiver){
                    return reject(transErrors.conversation_not_found);
                }
                // let receiver = {
                //     id: getChatGroupReceiver._id,
                //     name:getChatGroupReceiver.name,
                //     avatar:app.general_avatar_group_chat // gan duong dan anh
                // };
                // phuc vu cho viet chat khi chua co tren view list
                let getInforUserGroup = getChatGroupReceiver.members.map(async(member)=>{
                    let userInGroup = await userModel.getNormalUserDataById(member.userId);
                    return userInGroup;
                });
                 let getInforGroup = await Promise.all(getInforUserGroup);
                //console.log(getInforGroup);

                let attachBuffer = await fsExtra.readFile(messageVal.path);
                let attachContentType = messageVal.mimetype;
                let attachName = messageVal.originalname;
                let newMessageItem = {
                    senderId:senderId,
                    receiverId:receiverId,
                    // senderId:sender.id,
                    // receiverId:receiver.id, 
                    conversationType:messAgeModel.conversationTypes.GROUP,
                    messageType:messAgeModel.messageTypes.FILE,
                    // sender:sender,
                    // receiver:receiver,
                    file:{ data: attachBuffer, contentType:attachContentType, fileName:attachName},
                    createdAt:Date.now()               
                };
                let newMessage= await messAgeModel.model.createNew(newMessageItem);
                //bo sung phan view chat khi chua co trong list 
                newMessage = newMessage.toObject();
                newMessage.inForGroup = getChatGroupReceiver;
                newMessage.inForUserGroup = getInforGroup;
                newMessage.file.data = attachBuffer;
                // cap nhat Group chat
                await chatGroupModel.updateMessage(getChatGroupReceiver._id,getChatGroupReceiver.messageAmount + 1);
                resolve(newMessage);
            }else{
                let getUserReceiver = await userModel.getNormalUserDataById(receiverId);
                if(!getUserReceiver){
                    return reject(transErrors.conversation_not_found);
                }
                // let receiver = {
                //     id: getUserReceiver._id,
                //     name:getUserReceiver.username,
                //     avatar:getUserReceiver.avatar 
                // };
                
                let attachBuffer = await fsExtra.readFile(messageVal.path);
                let attachContentType = messageVal.mimetype;
                let attachName = messageVal.originalname;

                let newMessageItem = {
                    // senderId:sender.id,
                    // receiverId:receiver.id, 
                    senderId:senderId,
                    receiverId:receiverId,
                    conversationType:messAgeModel.conversationTypes.PERSONAL,
                    messageType:messAgeModel.messageTypes.FILE,
                    // sender:sender,
                    // receiver:receiver,
                    file:{ data: attachBuffer, contentType:attachContentType, fileName:attachName},
                    createdAt:Date.now()               
                };
                let newMessage= await messAgeModel.model.createNew(newMessageItem);
                 
                 await contactModel.updateMessage(senderId,getUserReceiver._id);// cap nhat lai date 
                resolve(newMessage);
            }
        }catch(error){
            reject(error);
        }
    });
};
let readMoreMessage = (currentUserId, skipMessage,targetId,chatInGroup)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            if(chatInGroup){
                let messAges = await messAgeModel.model.readMoreMessagesInGroup(targetId,skipMessage,LIMIT_MESSAGES_TAKEN);             
                messAges = lodash.reverse(messAges); //dao chieu mang
                
               // console.log(messAges);
               // them thong tin nguoi gui  vao de hien thi ra view sender
                let conVertMessage = messAges.map(async(message)=>{
                    let convert = await userModel.getNormalUserDataById(message.senderId);
                    message.sender= convert;
                    return message;
                })
                let getMessages = await Promise.all(conVertMessage);
                //console.log(getMessages);
                return resolve(getMessages);
            }

            let getMessages = await messAgeModel.model.readMoreMessagesPersonal(currentUserId,targetId,skipMessage,LIMIT_MESSAGES_TAKEN);             
            getMessages = lodash.reverse(getMessages); 
            
            return resolve(getMessages);
             
        }catch(error){
            reject(error);
        }
    });
};
let readMoreUserAllChat =(currentUserId,skipPersonal,skipGroup)=>{
    return new Promise(async(resolve,reject) => {
        try{
            let contacts = await contactModel.readMoreContacts(currentUserId,skipPersonal,LIMIT_CONVERSATIONS_TAKEN);
            let userConversationPromise = contacts.map(async(contact)=>{
                if(contact.contactId == currentUserId ){
                   let getUserContact = await userModel.getNormalUserDataById(contact.userId);
                   getUserContact.updatedAt = contact.updatedAt;
                   return getUserContact;
                }else{
                   let getUserContact = await userModel.getNormalUserDataById(contact.contactId);
                   getUserContact.updatedAt = contact.updatedAt;
                   return getUserContact;
                }
            });
            // Promise.all dung de tra ve tat ca cac tac vu ko dong bo cung 1 luc
            //console.log("show danh sach");
            //console.log(userConversationPromise); 
            let userConversations = await Promise.all(userConversationPromise);

            let groupConversation = await chatGroupModel.readMoreChatGroup(currentUserId,skipGroup,LIMIT_CONVERSATIONS_TAKEN);
            // add infor user 
            let groupConversationPromise = groupConversation.map(async(Group)=>{
                    Group = Group.toObject(); 
                let userGroup = Group.members.map(async(id)=>{
                    let UserInfor = await userModel.getNormalUserDataById(id.userId);
                    return UserInfor;
                });
                    let userInGroup = await Promise.all(userGroup);
                    //console.log(userInGroup);
                Group.Infor = userInGroup;
                return Group;
            });
            let groupConversations = await Promise.all(groupConversationPromise);
            let allConversations =userConversations.concat(groupConversations);// concat thanh 1 chuoi
             //console.log(allConversations);
             //console.log(userConversations);
             //console.log(groupConversations);
            allConversations = lodash.sortBy(allConversations,(item)=>{
                return -item.updatedAt;// sx tu cao den thap theo date 
            });
           
            // lay noi dung tin nhan
            let allConversationWithMessagesPromise = allConversations.map(async(conversation)=>{
               //conversation = conversation.toObject(); // chuyen ve object
                if(conversation.members){
                    let getMessages = await messAgeModel.model.getMessagesInGroup(conversation._id,LIMIT_MESSAGES_TAKEN);             
                    conversation.messages = lodash.reverse(getMessages); //dao chieu mang
                }else{
                    let getMessages = await messAgeModel.model.getMessages(currentUserId,conversation._id,LIMIT_MESSAGES_TAKEN);             
                    conversation.messages = lodash.reverse(getMessages); 
                    //conversation.messages = getMessages.reverse(); 
                }          
                return conversation;
            });
            let allConverter = await Promise.all(allConversationWithMessagesPromise);
            //lay infor user trong chat
            let allConver = allConverter.map(async(users)=>{
                let convers = users.messages.map(async(mess)=>{
                    let userinFor = await userModel.getNormalUserDataById(mess.senderId);
                    mess.inForUser = userinFor;
                    return mess;
                });
                let converte = await Promise.all(convers);
                users.messages = converte;
                return users;
             })
            //console.log(allConversationWithMessagesPromise);
            let allConversationWithMessages = await Promise.all(allConver);
                allConversationWithMessages = lodash.sortBy(allConversationWithMessages,(item)=>{
                    return -item.updatedAt;
                });
                // console.log(allConversationWithMessages);

            resolve(allConversationWithMessages);
        } catch(error){
            reject(error);
        }
    });
};
let talkWithUser = (currentUserId,targetId,isChatGroup)=>{
    return new Promise(async(resolve,reject)=>{
        try{
             //console.log(typeof isChatGroup);
            if(isChatGroup){
               
                let getChatGroupReceiver = await chatGroupModel.getChatGroupById(targetId);
                if(!getChatGroupReceiver){
                    return reject(transErrors.conversation_not_found);
                }
                //phuc vu cho viet chat khi chua co tren view list
                let getInforUserGroup = getChatGroupReceiver.members.map(async(member)=>{
                    let userInGroup = await userModel.getNormalUserDataById(member.userId);
                    return userInGroup;
                });
                 let getInforGroup = await Promise.all(getInforUserGroup);
                 getChatGroupReceiver = getChatGroupReceiver.toObject();
                 getChatGroupReceiver.inForGroup = getInforGroup;
                 //console.log(getChatGroupReceiver);
                  // cap nhat Group chat
                await chatGroupModel.updatedate(getChatGroupReceiver._id);
                return resolve(getChatGroupReceiver);
            }
      
                let getUserReceiver = await userModel.getNormalUserDataById(targetId);
                if(!getUserReceiver){
                    return reject(transErrors.conversation_not_found);
                }
                //console.log(getUserReceiver);
                await contactModel.updateMessage(currentUserId,getUserReceiver._id);// cap nhat lai date 
                return resolve(getUserReceiver);
            
        }catch(error){
            reject(error);
        }
    });
};
let getUserorGroupChat =(currentUserId,keyword)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            let deprecatedUserIds =[];
            let contactsByUser = await contactModel.findAllContacted(currentUserId);
            contactsByUser.forEach(item => {
                if(item.userId == currentUserId){
                    deprecatedUserIds.push(item.contactId);
                }
                if(item.contactId == currentUserId){
                    deprecatedUserIds.push(item.userId);
                }
            });
            //console.log(deprecatedUserIds);
         deprecatedUserIds = lodash.uniqBy(deprecatedUserIds);
         //console.log(deprecatedUserIds);
         let users = await userModel.findAllUserByid(deprecatedUserIds,keyword);

         let group = await chatGroupModel.findAllGroupByid(currentUserId,keyword);
         let allConversations =group.concat(users);// concat thanh 1 chuoi
            //console.log(allConversations);
            resolve(allConversations);
        }catch(error){
            reject(error);
        }
    });
};
let getMessage =(currentUserId,targetId,isChatGroup)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            //console.log(typeof isChatGroup);
            //console.log(targetId);
            if(isChatGroup){  
                let getMessageGroup = await messAgeModel.model.getMessagesInGroup(targetId,LIMIT_MESSAGES_TAKEN);      
                   getMessageGroup = lodash.reverse(getMessageGroup); //dao chieu mang
                 //console.log(getMessageGroup);
                let conVertMessage = getMessageGroup.map(async(message)=>{
                        let senderInfor = await userModel.getNormalUserDataById(message.senderId);
                        message.sender = senderInfor;
                        return message;
                })
                let getMessages = await Promise.all(conVertMessage);        
                //console.log(getMessages);      
                return resolve(getMessages);
            }
                let getMessageUser = await messAgeModel.model.getMessages(currentUserId,targetId,LIMIT_MESSAGES_TAKEN);    
                getMessageUser = lodash.reverse(getMessageUser); //dao chieu mang 
                return resolve(getMessageUser);
        }catch(error){
            reject(error);
        }
    });
};
let getMessageForReceiver =(currentUserId,targetId,isChatGroup)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            //console.log(typeof isChatGroup);
            //console.log(targetId);
            if(isChatGroup){  
                let getMessageGroup = await messAgeModel.model.readMoreMessagesInGroup(targetId,1,LIMIT_MESSAGES_TAKEN);       
                   getMessageGroup = lodash.reverse(getMessageGroup); //dao chieu mang
                 //console.log(getMessageGroup);
                let conVertMessage = getMessageGroup.map(async(message)=>{
                        let senderInfor = await userModel.getNormalUserDataById(message.senderId);
                        message.sender = senderInfor;
                        return message;
                })
                let getMessages = await Promise.all(conVertMessage);        
                //console.log(getMessages);      
                return resolve(getMessages);
            }
                let getMessageUser = await messAgeModel.model.readMoreMessagesPersonal(currentUserId,targetId,1,LIMIT_MESSAGES_TAKEN);    
                getMessageUser = lodash.reverse(getMessageUser); //dao chieu mang 
                return resolve(getMessageUser);
        }catch(error){
            reject(error);
        }
    });
};
module.exports ={
    getAllConversationItems:getAllConversationItems,
    addNewTextEmoji:addNewTextEmoji,
    addNewImage:addNewImage,
    addNewAttach:addNewAttach,
    readMoreMessage:readMoreMessage,
    readMoreUserAllChat:readMoreUserAllChat,
    talkWithUser:talkWithUser,
    getUserorGroupChat:getUserorGroupChat,
    getMessage:getMessage,
    getMessageForReceiver:getMessageForReceiver
}
