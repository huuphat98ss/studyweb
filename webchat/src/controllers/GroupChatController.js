import {validationResult} from "express-validator";//kiem tra check 
import groupChatService from "./../services/groupChatService";
let createGroupChat = async(req,res)=>{
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
        let currentUserId =req.user._id;
        let arrayMemberIds = req.body.arrayIds;
        let groupChatName = req.body.nameGroup; 

        let newGroupChat= await groupChatService.createGroupChat(currentUserId,arrayMemberIds,groupChatName);
        //console.log(newGroupChat.newGroup);
        //console.log(newGroupChat.groupConversations);
        
        return res.status(200).send({groupChat:newGroupChat});
    }catch(error){
        return res.status(500).send(error);
    }
}
let findNewUserAddGroup = async (req,res)=>{
    try{
        let currentUserId = req.user._id; 
        let idGroup= req.body.idGroup;
        let nameUser = req.body.nameUser;
        // console.log(currentUserId);
        // console.log(idGroup);
         //console.log(nameUser);
        
        let useradd = await groupChatService.findNewUserAddGroup(currentUserId,idGroup,nameUser);
        //return res.status(200).send(useradd);
       return res.render("main/home/loadMore/_find",{useradd:useradd,idGroup:idGroup});
    }catch(error){
        return res.status(500).send(error);
    }
}
let addNewUserGroup = async (req,res)=>{
    try{
        let currentUserId = req.user._id;
        let contactId = req.body.uid ;
        let idGroup = req.body.idGroup;
        //console.log(currentUserId);
       // console.log(idGroup);
        let newUserGroup = await groupChatService.addNewUserGroup(currentUserId,contactId,idGroup);
          //console.log(newContact);
       // console.log(!!newContact); true 
        return res.status(200).send({success: !!newUserGroup,newUserGroup:newUserGroup});
    }catch(error){
        return res.status(500).send(error);
    }
}
let removeUserInGroup = async(req,res)=>{
    try{
        let currentUserId = req.user._id;
        let contactId = req.body.uid ;
        let idGroup = req.body.idGroup;
        // console.log(currentUserId);
        // console.log(contactId);
        // console.log(idGroup);
        let removeUserInGroup = await groupChatService.removeUsernGroup(currentUserId,contactId,idGroup);
        return res.status(200).send({
                success: !!removeUserInGroup,
                currentUserId:currentUserId
            });
    }catch(error){
        return res.status(500).send(error);
    }
}
let removeGroupChat = async(req,res)=>{
    try{
        let currentUserId = req.user._id;
        let idGroup = req.body.idGroup;
        // console.log(currentUserId);
        // console.log(idGroup);
        let removeGroupChat = await groupChatService.removeGroupChat(currentUserId,idGroup);
        return res.status(200).send({
                success: removeGroupChat
            });
    }catch(error){
        return res.status(500).send(error);
    }
}
module.exports= {
    createGroupChat:createGroupChat,
    findNewUserAddGroup:findNewUserAddGroup,
    addNewUserGroup:addNewUserGroup,
    removeUserInGroup:removeUserInGroup,
    removeGroupChat:removeGroupChat
}