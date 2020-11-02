import mongoose from "mongoose";
let Schema = mongoose.Schema;
let MessageSchema = new Schema({
    senderId:String,
    receiverId:String, 
    conversationType:String,
    messageType:String,
    text:String,
    file:{ data: Buffer, contentType:String, fileName:String},
    createdAt:{type:Number,default:Date.now},
    updatedAt:{type:Number,default:null},
    deletedAt:{type:Number,default:null}
});
MessageSchema.statics = {
    createNew(item){
        return this.create(item);
    },
    // lay noi dung chat personal
    getMessages(senderId,receiverId,limit){
        return this.find({
            $or:[
                {$and:[
                    {"senderId":senderId},
                    {"receiverId":receiverId}
                ]},
                {$and:[
                    {"receiverId":senderId},
                    {"senderId":receiverId}
                ]}
            ]
        }).sort({"createdAt": -1}).limit(limit).exec();
    },
    // lay noi dung chat Group
    getMessagesInGroup(receiverId,limit){
        return this.find({"receiverId":receiverId}).sort({"createdAt": -1}).limit(limit).exec();
    },
    // lay toan bo file gom ca hinh
    getMessagesFileInGroup(receiverId){
        return this.find({$and:[
            {"receiverId":receiverId},
            {messageType:{$nin:"text"}}
                         ]},{file:1,messageType:1}).sort({"createdAt": -1}).exec();
    },
    getMessagesFile(senderId,receiverId){
        return this.find(
        {$and:[
            {
            $or:[
                {$and:[
                    {"senderId":senderId},
                    {"receiverId":receiverId}
                ]},
                {$and:[
                    {"receiverId":senderId},
                    {"senderId":receiverId}
                ]}
            ]
            },{messageType:{$nin:"text"}}
        ]}
        ,{file:1,messageType:1}).sort({"createdAt": -1}).exec();
    },

    readMoreMessagesPersonal(senderId,receiverId,skip,limit){
        return this.find({
            $or:[
                {$and:[
                    {"senderId":senderId},
                    {"receiverId":receiverId}
                ]},
                {$and:[
                    {"receiverId":senderId},
                    {"senderId":receiverId}
                ]}
            ]
        }).sort({"createdAt": -1}).skip(skip).limit(limit).exec();
    },
    readMoreMessagesInGroup(receiverId,skip,limit){
        return this.find({"receiverId":receiverId}).sort({"createdAt": -1}).skip(skip).limit(limit).exec();
    },
    // findIdAvatar(id){
    //     return this.find({
    //         $or:[
    //             {"senderId":id},
    //             {"receiverId":id}
    //         ]
    //     },{senderId:1,receiverId:1}).exec();
    // },
    // updateAvatarSender(id,avatar){
    //     return this.findByIdAndUpdate(id,{"sender.avatar":avatar}).exec();
    // },
    // updateAvatarReceiver(id,avatar){
    //     return this.findByIdAndUpdate(id,{"receiver.avatar":avatar}).exec();
    // }
};

const MESSAGE_CONVERSATION_TYPES = {
    PERSONAL: "personal",
    GROUP:  "group"
};
const MESSAGE_TYPES={
    TEXT: "text",
    IMAGE: "image",
    FILE: "file"
}
module.exports= {
    model:mongoose.model("message",MessageSchema),
    conversationTypes:MESSAGE_CONVERSATION_TYPES,
    messageTypes:MESSAGE_TYPES
};