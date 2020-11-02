import {check} from "express-validator";
import {transValidation} from "./../../lang/vi";
// check lay theo name
let checkUpdateInfor = [
    check("username",transValidation.update_username)
    .optional() // optionnal cho phep nha ngia tri null
    .isLength({min:3,max:17})
    .matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/),

    check("gender",transValidation.update_gender).optional().isIn(["male","female"]),
    
    check("address",transValidation.update_address)
    .optional()
    .isLength({min:3,max:30}),
    
    check("phone",transValidation.update_phone)
    .optional()
    .matches(/^(0)[0-9]{9,10}$/),
];
let updatePassword = [
    check("currentPassword",transValidation.update_password)
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
    check("newPassword",transValidation.update_password)
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
    check("confirmNewPassword",transValidation.update_confirm_password)
        .custom((value,{req})=>{
            return value === req.body.newPassword;
        })
]
    


module.exports={
    checkUpdateInfor:checkUpdateInfor,
    updatePassword:updatePassword
}