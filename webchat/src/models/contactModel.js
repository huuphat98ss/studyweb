import mongoose from "mongoose";
let Schema=mongoose.Schema;
let contactSchema = new Schema({
    userId:String,     //nguoi gui
    contactId:String, // nguoi nhan
    status:{type:Boolean,default:false},
    createdAt:{type:Number,default:Date.now},
    updatedAt:{type:Number,default:null},
    deletedAt:{type:Number,default:null}
});
contactSchema.statics={
    createNew(item){
        return this.create(item);
    },
    findAllByUser(userId){
        return this.find({
            $or:[
                {"userId": userId},
                {"contactId": userId}
            ]
        }).exec();
    },
    findAllContacted(userId){
        return this.find({
           $and:[ 
                {$or:[
                    {"userId":userId},
                    {"contactId":userId}
                ]},
                {"status": true}
            ]
        }).exec();
    },
    findAllContactedForaddNewUserInGroup(userId,idUser){
        return this.find({
           $and:[ 
                {$or:[
                    {$and:[
                        {"userId":{$nin:idUser}},
                        {"contactId":userId}
                    ]},
                    {$and:[
                        {"userId":userId},
                        {"contactId":{$nin:idUser}}
                    ]}
                ]},
                {"status": true}
            ]
        }).exec();
    },
    checkExists(userId,contactId){
        return this.findOne({
            $or:[
                {$and:[
                    {"userId":userId},
                    {"contactId":contactId}
                ]},
                {$and:[
                    {"userId":contactId},
                    {"contactId":userId}
                ]}
            ]
        }).exec();
    },
    // xoa ket ban da chap nhan roi
    removeContact(userId,contactId){
        return this.deleteOne({
            $or:[
                {$and:[
                    {"userId":userId},
                    {"contactId":contactId},
                    {"status":true}
                ]},
                {$and:[
                    {"userId":contactId},
                    {"contactId":userId},
                    {"status":true}
                ]}
            ]
        }).exec();
    },
    // xoa tu ben gui yeu cau 
    removeRequestContactSent(userId,contactId){
        return this.deleteOne({
            $and:[
                {"userId": userId},
                {"contactId": contactId},
                {"status":false}
            ]
        }).exec();
    },   
    removeRequestContactReceived(userId,contactId){
        return this.deleteOne({
            $and:[
                {"contactId": userId},
                {"userId": contactId},
                {"status":false}
            ]
        }).exec();
    },  
    approveRequestContactReceived(userId,contactId){
        return this.update({
            $and:[
                {"contactId": userId},
                {"userId": contactId},
                {"status":false}
            ]
        },{"status":true,
           "updatedAt":Date.now() 
        }).exec();
    },  
    getContacts(userId,limit){
        return this.find({
            $and:[
                {$or:[
                    {"userId":userId},
                    {"contactId":userId}
                ]},
                {"status": true}
            ]
        }).sort({"updatedAt": -1}).limit(limit).exec();
    },
    getContactsSent(userId,limit){
        return this.find({
            $and:[
                {"userId":userId},
                {"status": false}
            ]
        }).sort({"createdAt": -1}).limit(limit).exec();
    },
    getContactsReceived(userId,limit){
        return this.find({
            $and:[
                {"contactId":userId},
                {"status": false}
            ]
        }).sort({"createdAt": -1}).limit(limit).exec();
    },
    countAllcontacts(userId){
        return this.count({
            $and:[
                {$or:[
                    {"userId":userId},
                    {"contactId":userId}
                ]},
                {"status": true}
            ]
        }).exec();
    },
    countAllcontactsSent(userId){
        return this.count({
            $and:[
                {"userId":userId},
                {"status": false}
            ]
        }).exec();
    },
    countAllcontactsReceived(userId){
        return this.count({
            $and:[
                {"contactId":userId},
                {"status": false}
            ]
        }).exec();
    },
    readMoreContacts(userId,skip,limit){
        return this.find({
            $and:[
                {$or:[
                    {"userId":userId},
                    {"contactId":userId}
                ]},
                {"status": true}
            ]
        }).sort({"updatedAt": -1}).skip(skip).limit(limit).exec();
    },
    updateMessage(userId,contactId){
        return this.update({
            $or:[
                {$and:[
                    {"userId":userId},
                    {"contactId":contactId},
                    {"status":true} // phai la ban be thi moi chat dc 
                ]},
                {$and:[
                    {"userId":contactId},
                    {"contactId":userId},
                    {"status":true}
                ]}
            ]
        },{
            "updatedAt":Date.now()
        }).exec();
    },
    findUsertalk(userId,contactId){
        return this.findOne({
            $or:[
                {$and:[
                    {"userId":userId},
                    {"contactId":contactId},
                    {"status":true}
                ]},
                {$and:[
                    {"userId":contactId},
                    {"contactId":userId},
                    {"status":true}
                ]}
            ]
        }).exec();
    },
}
module.exports= mongoose.model("contact",contactSchema);