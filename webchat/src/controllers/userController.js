import multer from "multer";//tao duong dan va ten file anh
import {app} from "./../config/app";
import {transErrors,transSuccess} from "./../../lang/vi";
import uuidv4 from "uuid/v4"; // dung cho phan phan biet 2 anh khac nhau trung ten
import userService from "./../services/userService";
import fsExtra from "fs-extra";// xu ly xoa hinh
import {validationResult} from "express-validator";//kiem tra check 
// chi noi luu hinh
let storageAvatar = multer.diskStorage({
    destination:(req, file, callback)=>{
        callback(null, app.avatar_directory);
    },
    filename:(req,file, callback)=>{
        let math=app.avatar_type;
        if(math.indexOf(file.mimetype)=== -1){ //js thuần 
            return callback(transErrors.avatar_type,null);
        }
        let avatarName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
        callback(null,avatarName);
    }
});
let avatarUploadFile = multer({
    storage: storageAvatar,
    limits: {fileSize: app.avatar_limit_size}
}).single("avatar"); // giong voi formData ben updateUser.js, avatar trung vs nảm trong input file name

let updateAvatar = (req,res) =>{
    avatarUploadFile(req, res, async(error)=>{
        if(error){
            //console.log(error);
            //console.log(error.message);
            if(error.message){
                return res.status(500).send(transErrors.avatar_size);
            }
          //  console.log(error);
            return res.status(500).send(error);;
        }
        //console.log(req.file);
        try{
            let updateUserItem = {
                avatar: req.file.filename,
                updatedAt: Date.now()
            };
            //console.log(updateUserItem.avatar);
            //update image
            // await userService.updateAvatarMess(req.user._id,updateUserItem.avatar);
            
       let userUpdate = await userService.updateUser(req.user._id,updateUserItem);

            // remove image
            if(userUpdate.avatar != "avatar-default.jpg"){
                await fsExtra.remove(`${app.avatar_directory}/${userUpdate.avatar}`);
            }
            let result ={
                message:transSuccess.avatar_updated,
                imageSrc:`images/users/${req.file.filename}`
            };
            return res.status(200).send(result);
        }catch(error){
            return res.status(500).send(error);
        }
    });
}
let updateInfor = async(req,res) =>{
    let errorArr =[];
  
   let validationErrors = validationResult(req);
   if(!validationErrors.isEmpty()){
        let errors = Object.values(validationErrors.mapped());
        errors.forEach(item=>{
            errorArr.push(item.msg);
        });
        //console.log(errorArr);  
        return res.status(500).send(errorArr);
   }
    try{
        let updateUserItem =req.body;
        await userService.updateUser(req.user._id,updateUserItem );
        let result ={
            message:transSuccess.userInfor_updated,
        };
        return res.status(200).send(result);
    }catch(error){
        return res.status(500).send(error);
    }
}
let updatePassword = async(req,res)=>{
    let errorArr =[];
  
    let validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()){
         let errors = Object.values(validationErrors.mapped());
         errors.forEach(item=>{
             errorArr.push(item.msg);
         });
         //console.log(errorArr);  
         return res.status(500).send(errorArr);
    }
    try{
        let updateUserItem =req.body;
       // console.log(updateUserItem);
        await userService.updatePassword(req.user._id,updateUserItem );
        let result ={
            message:transSuccess.user_update_password,
        };
        return res.status(200).send(result);
    }catch(error){
        return res.status(500).send(error);
    }
}
module.exports ={
    updateAvatar:updateAvatar,
    updateInfor:updateInfor,
    updatePassword:updatePassword
};