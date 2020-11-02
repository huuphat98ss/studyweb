import contactService from "./../services/contactService";
import messageService from "./../services/messageService";
import {bufferBase64,lastItemOfArray,convertTimes,timeSendMess} from "./../helpers/clientHelper";
let getHome = async(req,res)=>{
    //console.log(req.user._id);
    //console.log(req.user.ChatGroupIds);
    //contacts
    let contacts = await contactService.getContacts(req.user._id);
    //contacts sent
    let contactsSent = await contactService.getContactsSent(req.user._id);
    //contact receiced
    let contactsReceived = await contactService.getContactsReceived(req.user._id);
    //count contact
    let countAllcontacts =await contactService.countAllcontacts(req.user._id);
    let countAllcontactsSent =await contactService.countAllcontactsSent(req.user._id);
    let countAllcontactsReceived =await contactService.countAllcontactsReceived(req.user._id);
    // su ly lay noi dung chat
    let getAllConversationItems = await messageService.getAllConversationItems(req.user._id);
   // let allConversations = getAllConversationItems.allConversations;
    // let allConversationWithMessageFiles = getAllConversationItems.allConversationWithMessageFiles; 
    //console.log(allConversationWithMessageFiles);
    let allConversationWithMessages = getAllConversationItems.allConversationWithMessages;
        // allConversationWithMessages.forEach(function(conversation){
        //    console.log(conversation.messages);
        // })
    //console.log(allConversationWithMessages);
    return res.render("main/master",{
        // errors: req.flash("errors"),
        // success: req.flash("success"),
        user:req.user,
        contacts: contacts,
        contactsSent:contactsSent,
        contactsReceived:contactsReceived,
        countAllcontacts:countAllcontacts,
        countAllcontactsSent:countAllcontactsSent,
        countAllcontactsReceived:countAllcontactsReceived,
        //allConversations:allConversations,
        // allConversationWithMessageFiles:allConversationWithMessageFiles,
        allConversationWithMessages:allConversationWithMessages,
        bufferBase64:bufferBase64,
        lastItemOfArray:lastItemOfArray,
        convertTimes:convertTimes,
        timeSendMess:timeSendMess
    });
};
module.exports ={getHome:getHome};