import lodash from "lodash"; // uniqBy loc cac gia tri trung' trong mang
import ChatGroupModel from "./../models/chatGroupModel";
import userModel from "./../models/userModel";
import contactModel from "./../models/contactModel";
let createGroupChat=(currentUserId,arrayMemberIds,groupChatName)=>{
    return new Promise (async (resolve,reject)=>{
        try{
            //dua user vao mang id member
            arrayMemberIds.unshift({userId:`${currentUserId}`}); //currentUserId chuyen ve String vi ban dau la ndag Object
            arrayMemberIds = lodash.uniqBy(arrayMemberIds,"userId");// gom phan tu trung lai
            // console.log(arrayMemberIds);
            let CreateNewGroup ={
                name:groupChatName,
                userAmount:arrayMemberIds.length,             
                userId:`${currentUserId}`,
                members:arrayMemberIds                  
            };
            let newGroup = await ChatGroupModel.createNew(CreateNewGroup);
            //console.log(newGroup);
            let groupConversationPromise = newGroup.members.map(async(Group)=>{
                    let UserInfor = await userModel.getNormalUserDataById(Group.userId);
                    return UserInfor;
            });
        let groupConversations = await Promise.all(groupConversationPromise);
            //console.log(groupConversations);
            // console.log(newGroup);
            resolve({
                newGroup:newGroup,
                groupConversations:groupConversations
            });
        }catch(error){
            reject(error);
        }
    });
};
let findNewUserAddGroup=(currentUserId,idGroup,nameUser)=>{
    return new Promise (async (resolve,reject)=>{
        try{
            let checkAdminGroup = await ChatGroupModel.checkAdmin(idGroup,currentUserId);
         
            if(checkAdminGroup){
                let getIdUserInGroup = await ChatGroupModel.getIdMember(idGroup);
                    let idUser = getIdUserInGroup.members.map(member=>{
                        let id = member.userId;
                        return id;
                    })
                    idUser  =  idUser.filter(id=>{
                        return id !== currentUserId.toString();
                    })
                    //console.log(idUser);
                    let contactsByUser = await contactModel.findAllContactedForaddNewUserInGroup(currentUserId,idUser);
                  //  console.log(contactsByUser);
                  let deprecatedUserIds =[];
                  contactsByUser.forEach(item => {
                    if(item.userId == currentUserId){
                        deprecatedUserIds.push(item.contactId);
                    }
                    if(item.contactId == currentUserId){
                        deprecatedUserIds.push(item.userId);
                    }
                });
                deprecatedUserIds = lodash.uniqBy(deprecatedUserIds);
                deprecatedUserIds  =  deprecatedUserIds.filter(id=>{
                    return id !== currentUserId.toString();
                })
               // console.log(deprecatedUserIds);
               let InForUser = await userModel.findAllUserByid(deprecatedUserIds,nameUser);
               //console.log(InForUser);
                resolve(InForUser);
            }else{
                reject(false);
            }
           
        }catch(error){
            reject(error);
        }
    });
}
let addNewUserGroup = (currentUserId,contactId,idGroup)=>{
    return new Promise(async (resolve,reject)=>{
        let checkAdminGroup = await ChatGroupModel.checkAdmin(idGroup,currentUserId);
        
        if(checkAdminGroup){
             let UserContact = await userModel.getNormalUserDataById(contactId);
                 await ChatGroupModel.updateUserAmount(idGroup,checkAdminGroup.userAmount + 1);
             let GroupUser= await ChatGroupModel.addNewUserGroup(idGroup,contactId);
            // console.log(checkAdminGroup);
            // console.log(checkAdminGroup.userAmount);
            let groupConversationPromise = GroupUser.members.map(async(Group)=>{
                let UserInfor = await userModel.getNormalUserDataById(Group.userId);
                return UserInfor;
            });
    let groupConversations = await Promise.all(groupConversationPromise);
            resolve({GroupUser:GroupUser,UserContact:UserContact,groupConversations:groupConversations});
        }else{
            reject(false);
        }     
    });
}
let removeUsernGroup = (currentUserId,contactId,idGroup)=>{
    return new Promise(async (resolve,reject)=>{
        let checkAdminGroup = await ChatGroupModel.checkAdmin(idGroup,currentUserId);  
        let checkUserIsInGroup = await ChatGroupModel.checkUserInGroup(idGroup,contactId);
        if(checkAdminGroup && checkUserIsInGroup){
                await ChatGroupModel.updateUserAmount(idGroup,checkAdminGroup.userAmount - 1);
            let removeUserInGroup = await ChatGroupModel.removeUserInGroup(idGroup,contactId);
            resolve(removeUserInGroup);
        }else{
            reject(false);
        }     
    });
}
let removeGroupChat = (currentUserId,idGroup)=>{
    return new Promise(async (resolve,reject)=>{
        let checkAdminGroup = await ChatGroupModel.checkAdmin(idGroup,currentUserId);  
        if(checkAdminGroup){
            await ChatGroupModel.removeGroupUpdateDelete(idGroup);          
            resolve(true);
        }else{
            reject(false);
        }     
    });
}
module.exports={
    createGroupChat:createGroupChat,
    findNewUserAddGroup:findNewUserAddGroup,
    addNewUserGroup:addNewUserGroup,
    removeUsernGroup:removeUsernGroup,
    removeGroupChat:removeGroupChat
}