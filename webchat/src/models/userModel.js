import mongoose from "mongoose";
import bcrypt from "bcrypt";
let Schema = mongoose.Schema;
let UserSchema = new Schema({
    username:String,
    gender:{type:String,default:"male"},
    phone:{type:Number,default:null},
    address:{type:String,default:null},
    avatar:{type:String,default:"avatar-default.jpg"},
    role:{type:String,default:"user"},
    local:{
        email:{type:String,trim:true},
        password:String,
        isActive:{type:Boolean,default:false},
        verifyToken:String
    },
    createdAt:{type:Number,default:Date.now},
    updatedAt:{type:Number,default:null},
    deletedAt:{type:Number,default:null}
});
UserSchema.statics ={
    createNew(item){
        return this.create(item);//tao ban
    },
    findByEmail(email){
        return this.findOne({"local.email": email}).exec();
    },
    removeById(id){
        return this.findByIdAndRemove(id).exec();
    },
    findByToken(token){
        return this.findOne({"local.verifyToken":token}).exec();
    },
    verify(token){
        return this.findOneAndUpdate(
            {"local.verifyToken":token},
            {"local.isActive":true,"local.verifyToken":null}
        ).exec();
    },
    findUserById(id){
        return this.findById(id,{"local.password": 0}).exec();
    },
    findUserByIdforUpdatepw(id){
        return this.findById(id).exec();
    },
    // nin its mean not in
    findAllForAddContact(deprecatedUserIds,keyword){
        return this.find({
            $and:[
                {"_id":{$nin:deprecatedUserIds}},
                {"local.isActive":true},
                {$or:[
                    {"username":{"$regex": new RegExp(keyword,"i") }}, // regex mongo tim key gan vs keyword nhat
                    {"local.email":{"$regex": new RegExp(keyword,"i") }} //  new RegExp(keyword, "i") fix ko phan biet hoa thuong
                ]}
            ]
        },{_id: 1,username: 1, address: 1, avatar: 1, gender:1}).exec(); // 1 la cho phep lay cac value nay'
    },
    findAllUserByid(deprecatedUserIds,keyword){
        return this.find({
            $and:[
                {"_id":{$in:deprecatedUserIds}},
                {"local.isActive":true},
                {$or:[
                    {"username":{"$regex": new RegExp(keyword,"i") }}, 
                    {"local.email":{"$regex": new RegExp(keyword,"i") }} 
                ]}
            ]
        },{_id: 1,username: 1, address: 1, avatar: 1}).exec(); 
    },
    updateUser(id,item){
        return this.findByIdAndUpdate(id,item).exec();// van tra ve data user cu~ sau update
    },
    updatePassword(id,hashedPassword){
        return this.findByIdAndUpdate(id,{"local.password": hashedPassword}).exec();
    },
    getNormalUserDataById(id){
        return this.findById(id,{_id:1, username:1, address:1,avatar:1}).exec();
    }
};
//stactic giup tim bang ghi trong pham vi schema
//khi tim ra roi thi su dung methods de dung du lieu trong bang ghi
//kq tra ve la 1 promise
UserSchema.methods = {
    comparePassword(password){
        return bcrypt.compareSync(password,this.local.password); //compareSync là chức năng của gói bcrypt
    }
};

module.exports= mongoose.model("user",UserSchema);