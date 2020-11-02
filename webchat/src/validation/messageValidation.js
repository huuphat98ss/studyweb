import {check} from "express-validator";
import{transValidation} from "./../../lang/vi";

let checkMessageLength =[
    check("messageVal", transValidation.message_text_emoji)
    .isLength({min:1,max:400})
];

module.exports = {
    checkMessageLength:checkMessageLength
}