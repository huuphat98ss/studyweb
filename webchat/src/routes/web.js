import express from "express";
import authController from "./../controllers/authController";
import homeController from "./../controllers/homeController";
import contactController from "./../controllers/contactController";
import userController from "./../controllers/userController";
import authValidation from "./../validation/authValidation";// check dang ky
import userValidation from "./../validation/userValidation";
import passport from "passport";
import initPassportLocal from "./../controllers/passPortLocal";
import messageValidation from "./../validation/messageValidation";
import GroupChatValidation from "./../validation/GroupChatValidation";
import GroupChatController from "./../controllers/GroupChatController";
import messageController from "./../controllers/messageController";
initPassportLocal();
let router = express.Router();

let initRouter = (app) =>{
    router.get("/",authController.checkLoggedIn,homeController.getHome);
    router.get("/login-register",authController.checkLoggedOut,authController.getLoginRegister);
    router.post("/register",authController.checkLoggedOut,authValidation.register,authController.postRegister);

    router.get("/verify/:token",authController.checkLoggedOut,authController.verifyAccount);
    
    //authenticate xac thuc theo kieu "local"
    router.post("/login",authController.checkLoggedOut,passport.authenticate("local",{
        successRedirect: "/",
        failureRedirect:"/login-register",
        successFlash:true,
        failureFlash: true
    }));
    router.get("/logout",authController.checkLoggedIn,authController.getLogout);
    router.get("/contact/find-users/:keyword",authController.checkLoggedIn,contactController.findUsersContact);
    router.post("/contact/add-new",authController.checkLoggedIn,contactController.addNew);
    router.delete("/contact/remove-request-contact-sent",authController.checkLoggedIn,contactController.removeRequestContactSent);
    router.delete("/contact/remove-request-contact-received",authController.checkLoggedIn,contactController.removeRequestContactReceived);
    router.put("/contact/approve-request-contact-received",authController.checkLoggedIn,contactController.approveRequestContactReceived);
    router.delete("/contact/remove-contact",authController.checkLoggedIn,contactController.removeContact);
    router.get("/contact/read-more",authController.checkLoggedIn,contactController.readMoreContacts);
    // update infor 
    router.put("/user/update-avatar",authController.checkLoggedIn,userController.updateAvatar);
    router.put("/user/update-infor",authController.checkLoggedIn,userValidation.checkUpdateInfor,userController.updateInfor);
    router.put("/user/update-password",authController.checkLoggedIn,userValidation.updatePassword,userController.updatePassword);
    //xu ly gui tin nhan
    router.post("/message/add-new-text-emoji",authController.checkLoggedIn,messageValidation.checkMessageLength,messageController.addNewTextEmoji);
    router.post("/message/add-new-image",authController.checkLoggedIn,messageController.addNewImage);
    router.post("/message/add-new-attach",authController.checkLoggedIn,messageController.addNewAttach);
    router.get("/message/read-more",authController.checkLoggedIn,messageController.readMoreMessage);
    
    router.get("/contact/find-user-add-group/:keyword",authController.checkLoggedIn,contactController.findUserAddGroup);
    router.post("/contact/create-group-chat",authController.checkLoggedIn,GroupChatValidation.createChatGroup,GroupChatController.createGroupChat);
    router.get("/message/read-more-user-all-chat",authController.checkLoggedIn,messageController.readMoreUserAllChat);
    router.post("/contact/find-new-user-group",authController.checkLoggedIn,GroupChatController.findNewUserAddGroup);
    router.post("/contact/add-new-user-in-group",authController.checkLoggedIn,GroupChatController.addNewUserGroup);
    router.delete("/contact/remove-user-in-group",authController.checkLoggedIn,GroupChatController.removeUserInGroup);
    router.put("/contact/remove-group-chat",authController.checkLoggedIn,GroupChatController.removeGroupChat);
    router.post("/contact/talk-with-user",authController.checkLoggedIn,messageController.talkWithUser);
    router.get("/contact/find-user-chat/:keyword",authController.checkLoggedIn,messageController.getUserorGroupChat);
    router.post("/message/request-data-chat",authController.checkLoggedIn,messageController.loadMessage);
    router.post("/message/request-data-chat-receiver",authController.checkLoggedIn,messageController.loadMessageForReceiver);
    return app.use("/",router);
}
module.exports = initRouter;