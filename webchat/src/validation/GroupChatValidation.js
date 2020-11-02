import {check} from "express-validator";
import {transValidation} from "./../../lang/vi";
// check lay theo name
let createChatGroup = [
    check("arrayIds",transValidation.add_user_group)
    .custom((value)=>{
        if(!Array.isArray(value)){
            return false;
        }
        if(value.length<2){
            return false;
        }
        return true;
    }), 
    check("nameGroup",transValidation.create_name_group)
    .isLength({min:5,max:30})
    .matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/)
];

module.exports={
    createChatGroup:createChatGroup
}