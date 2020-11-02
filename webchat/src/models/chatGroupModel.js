import mongoose from "mongoose";
let Schema = mongoose.Schema;
let ChatGroupSchema = new Schema({
   name:String,
   userAmount:{type:Number,min:3,max:150},
   messageAmount:{type:Number,default:0},
   userId:String,
   members:[
       {userId:String}
   ],
    createdAt:{type:Number,default:Date.now},
    updatedAt:{type:Number,default:Date.now},
    deletedAt:{type:Boolean,default:false} // neu true nghia la nhom da bi xoa
});
ChatGroupSchema.statics = {
    createNew(item){
        return this.create(item);//tao ban
    }, 
    getChatGroups(userId,limit){
        return this.find({
            $and:[
                {"members":{$elemMatch:{"userId":userId}} },
                {"deletedAt":false }
            ]
        }).sort({"updatedAt": -1}).limit(limit).exec();
    },// elemMatch lam viec vs mang trong mongo kq tra ve la 1 mang thoa dk trong elemMatch
    getChatGroupById(id){
        return this.findById(id).exec();
    },
    updateMessage(id,newMessageAmount){
        return this.findByIdAndUpdate(id,{
            "messageAmount": newMessageAmount,
            "updatedAt": Date.now()
        }).exec();
    },
    getChatGroupIdsByUser(userId){
        return this.find({
            $and:[
                {"members":{$elemMatch:{"userId":userId}} },
                {"deletedAt":false }
            ]
        },{_id: 1}).exec();
    },
    getIdMember(idGroup){
        return this.findById(idGroup,{members:1,_id:0}).exec();
    },
    readMoreChatGroup(userId,skip,limit){
        return this.find({
            $and:[
                {"members":{$elemMatch:{"userId":userId}} },
                {"deletedAt":false }
            ]
        }).sort({"updatedAt": -1}).skip(skip).limit(limit).exec();
    },
    checkAdmin(idGroup,userId){
        return this.findOne({
            $and:[
                {"_id": idGroup},
                {"userId": userId}
            ]
        }).exec();
    },
    addNewUserGroup(idGroup,Id){
        return this.findByIdAndUpdate(
            idGroup,
            {$push: {
                members:{
                    $each:
                      [ { userId:Id } ]            
            }} 
    }).exec();
    },
    updateUserAmount(id,userAmount){
        return this.findByIdAndUpdate(id,{
            "userAmount": userAmount,
        }).exec();
    },
    checkUserInGroup(idGroup,userId){
        return this.findOne({
            $and:[
                {"_id": idGroup},
                {"members":{ $elemMatch:{"userId":userId} } }
            ]
        }).exec();
    },
    removeUserInGroup(idGroup,userId){
        return this.update(
            {"_id": idGroup},
            {
                $pull: {members: { userId: userId } }
            }
            ).exec();
    },
    removeGroupUpdateDelete(idGroup){
        return this.findByIdAndUpdate(
            idGroup,
            {"deletedAt": true }
        ).exec();
    },
    findAllGroupByid(currentUserId,keyword){
        return this.find({
            $and:[
                {"members":{$elemMatch:{"userId":currentUserId}} },
                {"name":{"$regex": new RegExp(keyword,"i") }},
                {"deletedAt":false }
            ]
        },{_id: 1,name: 1,members: 1}).exec(); 
    },
    updatedate(id){
        return this.findByIdAndUpdate(id,{
            "updatedAt": Date.now()
        }).exec();
    },
}
module.exports= mongoose.model("chat-group",ChatGroupSchema);