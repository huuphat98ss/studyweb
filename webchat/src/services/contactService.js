import contactModel from "./../models/contactModel";
import userModel from "./../models/userModel";
import lodash from "lodash"; // uniqBy loc cac gia tri trung' trong mang

const LIMIT_NUMBER_TAKEN = 10;

let findUsersContact = (currentUserId,keyword) =>{
    return new Promise(async(resolve,reject)=>{
        let deprecatedUserIds =[currentUserId];
        let contactsByUser = await contactModel.findAllByUser(currentUserId);
        contactsByUser.forEach(item => {
            deprecatedUserIds.push(item.userId);
            deprecatedUserIds.push(item.contactId);
        });
        //console.log(deprecatedUserIds);
     deprecatedUserIds = lodash.uniqBy(deprecatedUserIds);
     //console.log(deprecatedUserIds);
     let users = await userModel.findAllForAddContact(deprecatedUserIds,keyword);
     resolve(users);
    });
}
let findUserAddGroup =(currentUserId,keyword)=>{
    return new Promise(async(resolve,reject)=>{
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
        //console.log(users);
     resolve(users);
    });
}
let addNew = (currentUserId,contactId)=>{
    return new Promise(async (resolve,reject)=>{
        let contactExists = await contactModel.checkExists(currentUserId,contactId);
           // console.log(contactExists);
        if(contactExists){
            return reject(false);
        }
        //create contact
        let newContactItem={
            userId: currentUserId,
            contactId:contactId 
        };
        let newContact = await contactModel.createNew(newContactItem);

        //create notification
        // let notificationItem ={
        //     senderid:currentUserId,
        //     receiverid:contactId,
        //     type:NotificationModel.types.ADD_CONTACT,
        // }
       // await NotificationModel.model.createNew(notificationItem);
        resolve(newContact);       
    });
}
let removeContact =(currentUserId,contactId)=>{
    return new Promise(async (resolve,reject)=>{
         await contactModel.removeContact(currentUserId,contactId);
      resolve(true); 
  });
}
let removeRequestContactSent = (currentUserId,contactId)=>{
    return new Promise(async (resolve,reject)=>{
          let removeRequest = await contactModel.removeRequestContactSent(currentUserId,contactId);
         //console.log("ket qua re sent "+ removeRequest.result); 
        //  if(removeRequest.result.n === 0){
        //      return reject(false);
        //  }
        //remove notification
        //await NotificationModel.model.removeRequestContactSentNotificaiton(currentUserId,contactId,NotificationModel.types.ADD_CONTACT);
        
        resolve(true); 
    });
}
let removeRequestContactReceived = (currentUserId,contactId)=>{
    return new Promise(async (resolve,reject)=>{
          let removeRequest = await contactModel.removeRequestContactReceived(currentUserId,contactId);
         //console.log("ket qua re sent "+ removeRequest.result); 
        //  if(removeRequest.result.n === 0){
        //      return reject(false);
        //  }
        
        resolve(true); 
    });
}
//chap nhan keu cau kb
let approveRequestContactReceived = (currentUserId,contactId)=>{
    return new Promise(async (resolve,reject)=>{
          let approveRequest = await contactModel.approveRequestContactReceived(currentUserId,contactId);
          //lay infor user gui yeu cau contactId
          let userInforSent = await userModel.getNormalUserDataById(contactId);
          //lay infor user nhan yeu cau currensUserId
          let userInforReceived = await userModel.getNormalUserDataById(currentUserId);
         //console.log("ket qua re sent "+ approveRequest.nModified); //nModified
         if(approveRequest.nModified === 0){
             return reject(false);
         }  
        // resolve(true); 
        resolve({
            userInforSent:userInforSent,
            userInforReceived:userInforReceived
        }); 
    });
}
let getContacts = (currentUserId)=>{
    return new Promise(async (resolve,reject)=>{
        try{
            let contacts = await contactModel.getContacts(currentUserId,LIMIT_NUMBER_TAKEN);
            let users = contacts.map(async(contact)=>{
                //console.log(typeof contact.contactId); //kieu string
               // console.log(typeof currentUserId); // kieu object
               // nen ko the dung === (can cung kieu du lieu moi dc)
                if(contact.contactId == currentUserId ){
                    return await userModel.findUserById(contact.userId);
                }else{
                    return await userModel.findUserById(contact.contactId);
                }
            });
            resolve(await Promise.all(users));
        }catch(error){
            reject(error);
        }
    });
}

let getContactsSent = (currentUserId)=>{
    return new Promise(async (resolve,reject)=>{
        try{
            let contacts = await contactModel.getContactsSent(currentUserId,LIMIT_NUMBER_TAKEN);
            let users = contacts.map(async(contact)=>{
                return await userModel.findUserById(contact.contactId);
            });
            resolve(await Promise.all(users));
        }catch(error){
            reject(error);
        }
    });
}
let getContactsReceived = (currentUserId)=>{
    return new Promise(async (resolve,reject)=>{
        try{
            let contacts = await contactModel.getContactsReceived(currentUserId,LIMIT_NUMBER_TAKEN);
            let users = contacts.map(async(contact)=>{
                return await userModel.findUserById(contact.userId);
            });
            resolve(await Promise.all(users));
        }catch(error){
            reject(error);
        }
    });
}
let countAllcontacts = (currentUserId)=>{
    return new Promise(async (resolve,reject)=>{
        try{
            let count = await contactModel.countAllcontacts(currentUserId);
            resolve(count);
        }catch(error){
            reject(error);
        }
    });
}
let countAllcontactsSent = (currentUserId)=>{
    return new Promise(async (resolve,reject)=>{
        try{
            let count = await contactModel.countAllcontactsSent(currentUserId);
            resolve(count);
        }catch(error){
            reject(error);
        }
    });
}
let countAllcontactsReceived = (currentUserId)=>{
    return new Promise(async (resolve,reject)=>{
        try{
            let count = await contactModel.countAllcontactsReceived(currentUserId);
            resolve(count);
        }catch(error){
            reject(error);
        }
    });
}
let readMoreContacts = (currentUserId,skipnumberContacts)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            let newContacts = await contactModel.readMoreContacts(currentUserId,skipnumberContacts,LIMIT_NUMBER_TAKEN);
            let users = newContacts.map(async(contact)=>{
                if(contact.contactId == currentUserId ){
                    return await userModel.findUserById(contact.userId);
                }else{
                    return await userModel.findUserById(contact.contactId);
                }
            });
            resolve(await Promise.all(users));
        }catch(error){
            reject(error);
        }
    });
}

module.exports = {
    findUsersContact:findUsersContact,
    findUserAddGroup:findUserAddGroup,
    addNew:addNew,
    removeRequestContactSent:removeRequestContactSent,
    removeRequestContactReceived:removeRequestContactReceived,
    getContacts:getContacts,
    getContactsSent:getContactsSent,
    getContactsReceived:getContactsReceived,
    countAllcontacts:countAllcontacts,
    countAllcontactsSent:countAllcontactsSent,
    countAllcontactsReceived:countAllcontactsReceived,
    readMoreContacts:readMoreContacts,
    approveRequestContactReceived:approveRequestContactReceived,
    removeContact:removeContact
}