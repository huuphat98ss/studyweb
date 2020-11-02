import passport from "passport";
import passportLocal from "passport-local";
import UserModel from "./../models/userModel";
import {transErrors} from "./../../lang/vi";
import ChatGroupModel from "./../models/chatGroupModel";
let LocalStrategy =passportLocal.Strategy;
let initPassportLocal = () =>{
    passport.use(new LocalStrategy({
        // mặc định local strategy sử dụng username và password,
        // chúng ta cần cấu hình lại
        usernameField:"email",
        passwordField:"password",
        passReqToCallback: true // cho phép chúng ta gửi reqest lại hàm callback
    },async(req,email,password,done)=>{
        try{
            let user = await UserModel.findByEmail(email);
            if(!user){
                return done(null,false,req.flash("errors",transErrors.login_failed));
            }
            if(!user.local.isActive){
                return done(null,false,req.flash("errors",transErrors.account_not_active));
            }
            let checkPassword = await user.comparePassword(password);
            if(!checkPassword){
                return done(null,false,req.flash("errors",transErrors.login_failed));
            }
            return done(null,user);
            
        }catch(error){
            console.log(error +" phan dang nhap file controller/local");
            return done(null,false,req.flash("errors",transErrors.server_error));
        }
    }));
    // ghi thong tin vao session
    passport.serializeUser((user,done)=>{
        done(null,user._id);
    });
    // luu thong tin user vao req.user quan trong
    // passport.deserializeUser((id,done)=>{
    //     UserModel.findUserById(id)
    //     .then(user=>{
    //         return done(null,user);
    //     })
    //     .catch(error =>{
    //         return done(error,null);
    //     });
    // });
    passport.deserializeUser(async(id,done)=>{
        try{
            let user = await UserModel.findUserById(id);
            let getChatGroupIds = await ChatGroupModel.getChatGroupIdsByUser(user._id);
            user= user.toObject();
            user.ChatGroupIds=getChatGroupIds;
            return done(null,user);
        }catch(error){
            return done(error,null);
        }     
    });
};

module.exports = initPassportLocal;