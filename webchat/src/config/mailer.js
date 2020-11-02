import nodeMailer from "nodemailer";
let adminEmail = 'milorshuynh@gmail.com';
let adminPassword = 'Milos1998';
let mailHost = 'smtp.gmail.com';
let mailPort = 587;

let sendMail =(to,subject,htmlContent)=>{
    let transporter = nodeMailer.createTransport({
        host:mailHost,
        port:mailPort,
        secure:false,
        auth:{
            user:adminEmail,
            pass:adminPassword
        }
    });
    let options ={
        from: adminEmail,
        to:to,
        subject:subject,
        html:htmlContent
    };
    return transporter.sendMail(options);
}
module.exports = sendMail;