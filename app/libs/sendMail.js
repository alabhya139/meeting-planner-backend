var nodemailer = require('nodemailer');

let sendMail = (mailOptions)=>{
    return new Promise((resolve,reject)=>{
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'meetingplannerapp@gmail.com',
              pass: 'meeting@123'
            }
          });
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              reject(error);
            } else {
              resolve(info);
            }
          });
    })
}

module.exports = {sendMail}