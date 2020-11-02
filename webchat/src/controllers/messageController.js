import {validationResult} from "express-validator";
import messageService from "./../services/messageService";
import multer from "multer";//tao duong dan va ten file anh
import {app} from "./../config/app";
import {transErrors} from "./../../lang/vi";
import fsExtra from "fs-extra";// xu ly xoa hinh
import ejs from "ejs"; // dung renderfile tra ve 1 str HTML
import {bufferBase64,lastItemOfArray,convertTimes,timeSendMess} from "./../helpers/clientHelper";
let addNewTextEmoji = async(req,res)=>{
    let errorArr = [];
    let validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()){
        let errors = Object.values(validationErrors.mapped());
        errors.forEach(item=>{
            errorArr.push(item.msg);
        });
        return res.status(500).send(errorArr);
    }
    try{
        let sender ={
            id:req.user._id,
            name:req.user.username,
            avatar:req.user.avatar
        };
        let receiverId = req.body.uid;
        let messageVal = req.body.messageVal;
        let isChatGroup = req.body.isChatGroup;
        // console.log(receiverId);
        // console.log(messageVal);
        // console.log(isChatGroup);
        let newMessage = await messageService.addNewTextEmoji(sender.id,receiverId,messageVal,isChatGroup);
        return res.status(200).send({
            message:newMessage,
            sender:sender
        });
    } catch(error){
        return res.status(500).send(error);
    }
} 
// chi noi luu hinh
let storageImageChat = multer.diskStorage({
    destination:(req, file, callback)=>{
        callback(null, app.image_message_directory);
    },
    filename:(req,file, callback)=>{
        let math=app.image_message_type;
        if(math.indexOf(file.mimetype)=== -1){ 
            return callback(transErrors.image_message_type,null);
        }
        let imageName = `${file.originalname}`;//ten tep tren may tinh 
        callback(null,imageName);
    }
});
let imageMessUploadFile = multer({
    storage: storageImageChat,
    limits: {fileSize: app.image_message_limit_size}
}).single("my-image-chat"); 

let addNewImage = (req,res)=>{
    imageMessUploadFile(req,res ,async(error)=>{
        if(error){
            if(error.message){
                return res.status(500).send(transErrors.image_message_size);
            }
          //  console.log(error);
            return res.status(500).send(error);
        }
        try{
            let sender ={
                id:req.user._id,
                name:req.user.username,
                avatar:req.user.avatar
            };
            let receiverId = req.body.uid;
            let messageVal = req.file;
            let isChatGroup = req.body.isChatGroup;
            // console.log(receiverId);
            // console.log(messageVal);
            // console.log(isChatGroup);
            let newMessage = await messageService.addNewImage(sender.id,receiverId,messageVal,isChatGroup);
            //xoa hinh 
            await fsExtra.remove(`${app.image_message_directory}/${newMessage.file.fileName}`);
            return res.status(200).send({
                message:newMessage,
                sender:sender
            });
        } catch(error){
            return res.status(500).send(error);
        }
    });
} 
// luu file 
let storageAttachChat = multer.diskStorage({
    destination:(req, file, callback)=>{
        callback(null, app.attach_message_directory);
    },
    filename:(req,file, callback)=>{
        // let math=app.image_message_type;
        // if(math.indexOf(file.mimetype)=== -1){
        //     return callback(transErrors.image_message_type,null);
        // }
        let attachName = `${file.originalname}`;
        callback(null,attachName);
    }
});
let attachMessUploadFile = multer({
    storage: storageAttachChat,
    limits: {fileSize: app.attach_message_limit_size}
}).single("my-attach-chat"); 

let addNewAttach = (req,res)=>{
    attachMessUploadFile(req,res ,async(error)=>{
        if(error){
            if(error.message){
                return res.status(500).send(transErrors.image_message_size);
            }
          //  console.log(error);
            return res.status(500).send(error);;
        }
        try{
            let sender ={
                id:req.user._id,
                name:req.user.username,
                avatar:req.user.avatar
            };
            let receiverId = req.body.uid;
            let messageVal = req.file;
            let isChatGroup = req.body.isChatGroup;
            // console.log(receiverId);
            // console.log(messageVal);
            // console.log(isChatGroup);
            let newMessage = await messageService.addNewAttach(sender.id,receiverId,messageVal,isChatGroup);
            //xoa file
            await fsExtra.remove(`${app.attach_message_directory}/${newMessage.file.fileName}`);
            return res.status(200).send({
                message:newMessage,
                sender:sender
            });
        } catch(error){
            return res.status(500).send(error);
        }
    });
} 
let readMoreMessage =async (req,res)=>{
        try{
            let skipMessage = +(req.query.skipMessage);
            let targetId =  req.query.targetId;
            let chatInGroup = (req.query.chatInGroup === "true"); // chuyen String thanh boolean

            // console.log(targetId);
            // console.log(skipMessage);
            // console.log(chatInGroup);
            // console.log( typeof chatInGroup);
            // return;
            let newMessage = await messageService.readMoreMessage(req.user._id, skipMessage,targetId,chatInGroup);
            return res.render("main/home/loadMore/_readMoreMessage",{bufferBase64:bufferBase64,timeSendMess:timeSendMess,user:req.user,newMessage});
            //return res.status(200).send({readMore:newMessage});
        } catch(error){
            return res.status(500).send(error);
        }
} 
let readMoreUserAllChat = async (req,res)=>{
    try{
        let skipPersonal = +(req.query.skipPersonal);
        let skipGroup =  +(req.query.skipGroup);
        
        //console.log(skipPersonal);
        //console.log(skipGroup);     
        //return;
        let newUserAllChat = await messageService.readMoreUserAllChat(req.user._id,skipPersonal,skipGroup);   
        let dataToRender ={
            newUserAllChat:newUserAllChat,
            lastItemOfArray:lastItemOfArray,
            convertTimes:convertTimes,
            bufferBase64:bufferBase64,
            timeSendMess:timeSendMess,
            user:req.user

        }
        let left;
        let right;
        ejs.renderFile("src/views/main/home/loadMore/_left.ejs", dataToRender,{}, function(err, str){
            if(err){
                console.log(err);
                return;
            }
            // str => Rendered HTML string
            // console.log(str);
           left = str;
        }); 
        //console.log(left);
        ejs.renderFile("src/views/main/home/loadMore/_right.ejs", dataToRender,{}, function(err, str){
                if(err){
                    console.log(err);
                    return;
                }
                // str => Rendered HTML string
                    //console.log(str);
                    right = str;
                }); 
                
        return res.status(200).send({
            left:left,
            right:right
        });
    } catch(error){
        return res.status(500).send(error);
    }
} 
let talkWithUser = async (req,res)=>{
    try{
        let targetId = req.body.uid;
        // let isChatGroup = req.body.isChatGroup;
        let isChatGroup = (req.body.isChatGroup === "true"); // chuyen String thanh boolean
         // console.log(targetId);
        //  console.log(isChatGroup);
        let userTalk = await messageService.talkWithUser(req.user._id,targetId,isChatGroup);
       // console.log(userTalk);
        return res.status(200).send({
            userTalk:userTalk
        });
    } catch(error){
        return res.status(500).send(error);
    }
    
}
let getUserorGroupChat = async(req,res)=>{
    try{
        let currentUserId = req.user._id; 
        let keyword = req.params.keyword;
        //console.log(keyword);
        let userChat = await messageService.getUserorGroupChat(currentUserId,keyword);
        // console.log(userChat);
       return res.render("main/home/loadMore/_showUserChat",{userChat:userChat});
    }catch(error){
        return res.status(500).send(error);
    }
}
let loadMessage = async(req,res)=>{
    let targetId = req.body.targetId;
    //let isChatGroup =req.body.isChatGroup;
    let isChatGroup = (req.body.isChatGroup === "true"); // chuyen String thanh boolean
    //  console.log(targetId);
      //console.log(typeof isChatGroup);
    //  console.log(isChatGroup);
    let newMessage = await messageService.getMessage(req.user._id,targetId,isChatGroup);
    //console.log(newMessage);
    return res.render("main/home/loadMore/_readMoreMessage",{bufferBase64:bufferBase64,timeSendMess:timeSendMess,user:req.user,newMessage});
}
let loadMessageForReceiver = async(req,res)=>{
    let targetId = req.body.targetId;
    let isChatGroup = (req.body.isChatGroup === "true"); // chuyen String thanh boolean
    let newMessage = await messageService.getMessageForReceiver(req.user._id,targetId,isChatGroup);
    //console.log(newMessage);
    return res.render("main/home/loadMore/_readMoreMessage",{bufferBase64:bufferBase64,timeSendMess:timeSendMess,user:req.user,newMessage});
}
module.exports={
    addNewTextEmoji:addNewTextEmoji,
    addNewImage:addNewImage,
    addNewAttach:addNewAttach,
    readMoreMessage:readMoreMessage,
    readMoreUserAllChat:readMoreUserAllChat,
    talkWithUser:talkWithUser,
    getUserorGroupChat:getUserorGroupChat,
    loadMessage:loadMessage,
    loadMessageForReceiver:loadMessageForReceiver
}