import userModel from "./../models/userModel";
import messageModel from "./../models/messageModel";
import {transErrors} from "./../../lang/vi";
import bcrypt from "bcrypt";
let saltRounds = 7;
let updateUser =(id,item)=>{
   return userModel.updateUser(id,item);
};
// let updateAvatarMess =(id,item)=> {
//     return new Promise (async (resolve,reject)=>{
//        // console.log(typeof item);
//        let idAvatar = await messageModel.model.findIdAvatar(id);
//       //  console.log(idAvatar);
//         idAvatar.forEach(async(avatarId)=>{
//             if(avatarId.senderId == id){
//                // console.log("is sender");
//                 await  messageModel.model.updateAvatarSender(avatarId._id,item);
//             }
//             if(avatarId.receiverId == id){
//                // console.log("is receiver");
//                 await  messageModel.model.updateAvatarReceiver(avatarId._id,item);
//             }
//         });
//         resolve(true);
//     });
// }
let updatePassword=(id,item)=>{
    return new Promise (async (resolve,reject)=>{
        //console.log("item " + item.currentPassword);
           let currentUser= await  userModel.findUserByIdforUpdatepw(id);
           if(!currentUser){
                return reject(transErrors.check_account);
           }
           let checkcurrentPassword = await currentUser.comparePassword(item.currentPassword);
           if(!checkcurrentPassword){
                return reject(transErrors.check_password);
           }
           let salt = bcrypt.genSaltSync(saltRounds); // tao muoi bam :))
           await userModel.updatePassword(id,bcrypt.hashSync(item.newPassword, salt));
           resolve(true);
    });
}
module.exports={
    updateUser:updateUser,
    updatePassword:updatePassword,
    // updateAvatarMess:updateAvatarMess
}