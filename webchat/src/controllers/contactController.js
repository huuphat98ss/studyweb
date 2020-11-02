import contactService from "./../services/contactService";
let findUsersContact = async (req,res)=>{
    try{
        let currentUserId = req.user._id; 
        let keyword = req.params.keyword;
        // console.log(currentUserId);
        // console.log(keyword);
        let users = await contactService.findUsersContact(currentUserId,keyword);
        return res.render("main/find/_find",{users});
    }catch(error){
        return res.status(500).send(error);
    }
}
let findUserAddGroup = async(req,res)=>{
    try{
        let currentUserId = req.user._id; 
        let keyword = req.params.keyword;
        let users = await contactService.findUserAddGroup(currentUserId,keyword);
        return res.render("main/createGroup/_finduseraddgroup",{users});
    }catch(error){
        return res.status(500).send(error);
    }
}
let addNew = async (req,res)=>{
    try{
        let currentUserId = req.user._id;
        let contactId = req.body.uid ;
        //console.log(currentUserId);
       // console.log(contactId);
        let newContact = await contactService.addNew(currentUserId,contactId);
          //console.log(newContact);
       // console.log(!!newContact); true 
        return res.status(200).send({success: !!newContact});
    }catch(error){
        return res.status(500).send(error);
    }
}
let removeContact = async (req,res)=>{
    try{
        let currentUserId= req.user._id;
        let contactId=req.body.uid;
        let removeContact = await contactService.removeContact(currentUserId,contactId);  
       return res.status(200).send({success: !!removeContact});
    }catch(error){
        return res.status(500).send(error);
    }
}
let removeRequestContactSent = async (req,res)=>{
    try{
        let currentUserId= req.user._id;
        let contactId=req.body.uid;
        let removeRequest = await contactService.removeRequestContactSent(currentUserId,contactId);  
       return res.status(200).send({success: !!removeRequest});
    }catch(error){
        return res.status(500).send(error);
    }
}
let removeRequestContactReceived = async (req,res)=>{
    try{
        let currentUserId= req.user._id;
        let contactId=req.body.uid;
        let removeRequest = await contactService.removeRequestContactReceived(currentUserId,contactId);  
       return res.status(200).send({success: !!removeRequest});
    }catch(error){
        return res.status(500).send(error);
    }
}
let readMoreContacts = async(req,res) =>{
    try{
       // console.log(typeof req.query.skipNumber);
        let skipnumberContacts = +(req.query.skipNumber);
       // console.log(typeof skipnumberContacts);
        let newcontactUsers = await contactService.readMoreContacts(req.user._id,skipnumberContacts);
        return res.status(200).send(newcontactUsers);
    }catch(error){
        return res.status(500).send(error);
    }
}
let approveRequestContactReceived = async (req,res)=>{
    try{
        let currentUserId= req.user._id;
        let contactId=req.body.uid;
        let approveRequest = await contactService.approveRequestContactReceived(currentUserId,contactId);  
       return res.status(200).send({
            success: true,
            approveRequest:approveRequest
        });
    }catch(error){
        return res.status(500).send(error);
    }
}
module.exports ={
    findUsersContact:findUsersContact,
    findUserAddGroup:findUserAddGroup,
    addNew:addNew,
    removeRequestContactSent:removeRequestContactSent,
    removeRequestContactReceived:removeRequestContactReceived,
    readMoreContacts:readMoreContacts,
    approveRequestContactReceived:approveRequestContactReceived,
    removeContact:removeContact,
    
};