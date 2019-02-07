const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const mongoose = require('mongoose');
const _ = require('lodash');

const hashLib = require('../libs/hashIt');
const check = require('../libs/checkLib');

const password = require('../libs/passwordLib/hashPassword');
const token = require('../libs/tokenLib/tokenLib');
const mailService = require('../libs/sendMail');

const UserModel = mongoose.model('User');
const AuthModel = mongoose.model('Meetings');


const newUser = require('../libs/user-management-libs/newUser');
const login = require('../libs/user-management-libs/loginLib');


// start user signup function


let signUpFunction = (req, res) => {
    newUser.createUser(req, res)
        .then(resolve => {
            let userDetails = resolve.toObject();
            delete userDetails._id;
            delete userDetails.__v;
            let apiResponse = response.generate(false, `User Created Successfully!A verification email has been sent to ${userDetails.email}. Please Verify your account in order to login!`,
                200, userDetails);
            res.send(apiResponse);
        })
        .catch(error => {
            res.send(error);
            console.log("error occured"+error);
        })


} // end user signup function 

// start of login function 
let loginFunction = (req, res) => {
    login.findUser(req, res)
        .then(userDetails => {
            password.comparePassword(req.body.password, userDetails.password)
                .then(result => {
                    login.saveToken(userDetails)
                        .then(result => {
                            let userDetails = result.userDetails.toObject();
                            delete userDetails.__v;
                            delete userDetails._id;
                            let responseBody = {
                                authToken: result.authToken,
                                userDetails
                            }
                            let apiResponse = response.generate(false, "Succefully logged in",
                                200, responseBody);
                            res.send(apiResponse);
                        })
                        .catch(error => res.send(error));

                })
                .catch(error => res.send(error));
        })
        .catch(error => res.send(error));

}


// end of the login function 


let logout = (req, res) => {
    AuthModel.findOneAndDelete({userId:req.params.userId},(err,resp)=>{
        if(err){
            let apiResponse = response.generate(true, "Unable to logout user", 400, err);
            res.send(apiResponse);
        }else{
            let apiResponse = response.generate(false, "User logout successfully", 200, resp);
            res.send(apiResponse);
        }
    })

} // end of the logout function.

let getUser = (req, res) => {
    UserModel.find((err, data) => {
        if (err) {
            let apiResponse = response.generate(true, "Unable to get users", 400, err);
            res.send(apiResponse);
        } else {
            let userDetails = data;
            delete userDetails._id;
            delete userDetails.__v;
            let apiResponse = response.generate(false, "Users found succesfully", 200, data);
            res.send(apiResponse);
        }
    })
}

//verify User

let verifyUser = (req, res) => {
    let userId;
    
    token.verifyTokenWithoutSecret(req.params.token,(err,decodedValue)=>{
        if(err){
            let apiResponse = response.generate(true, "Error in finding email!", 500, err);
            res.send(apiResponse);
        }else{
            userId = decodedValue.data;

            UserModel.findOne({
                userId
            })
            .exec((err, userDetails) => {
                if (err) {
                    let apiResponse = response.generate(true, "Error in finding user!", 500, err);
                    res.send(apiResponse);
                } else if (check.isEmpty(userDetails)) {
                    let apiResponse = response.generate(true, "User not found!", 404, null);
                    res.send(apiResponse);
                } else {
                    if (!userDetails.isVerified) {
                        UserModel.findOneAndUpdate({
                            isVerified: userDetails.isVerified
                        }, {
                            isVerified: true
                        }, (err, success) => {
                            if (err) {
                                let apiResponse = response.generate(true, "Error in verifying user!", 500, err);
                                res.send(apiResponse);
                            } else {
                                res.send(`User Verified Successfully Please Login`)
                            }
                        })
                    } else {
                        let apiResponse = response.generate(true, "Link expired", 400, null);
                        res.send(apiResponse);
                    }
                }
            });
        }
    });
}

let forgotPasswordSendEmail = (req,res)=>{
    let email = req.body.email;
    let tokenForMail;
    token.generateToken(email,(err,tokenDetail)=>{
        if(err){

        }else{
            tokenForMail=tokenDetail.token
            let mailOptions = {
                from: 'meetingplannerapp@gmail.com',
                to: email,
                subject: 'Reset your Password',
                text: `Please change your password by clicking the link below\n\nhttp://meetingplanner.alabhya.me/home/forgot-password-verify-user/${tokenForMail}`
            };
        
            mailService.sendMail(mailOptions)
                .then(resolve=>{
                    let apiResponse = response.generate(false, "Email sent!", 200, null);
                    res.send(apiResponse);
                })
                .catch(reject=>{
                    let apiResponse = response.generate(true, "Unable to change Password", 400, null);
                    res.send(apiResponse);
                });
        }
    })
}

let getUserByUserId = (req,res)=>{
    UserModel.findOne({userId:req.params.userId},(err,resp)=>{
        if(err){
            let apiResponse = response.generate(true, "Unable to find user", 400, null);
            res.send(apiResponse);
        }else{
            let apiResponse = response.generate(false, "User found", 200, resp);
            res.send(apiResponse);
        }
    })
}

let forgotPasswordVerifyUser = (req,res)=>{
    
}

let changePassword = (req,res)=>{
    token.verifyTokenWithoutSecret(req.query.token,(err,decoded)=>{
        if(err){
            let apiResponse = response.generate(false, "Unable to verify user", 500, null);
            res.send(apiResponse);
        }else{
            let hashed;
            password.hashPassword(req.body.password)
                .then(hash=>{
                    UserModel.findOneAndUpdate({email:decoded.data.toLowerCase()},{password:hash},{new:true},(err,resp)=>{
                        if(err){
                            let apiResponse = response.generate(true, "Unable to change Password", 400, err);
                            res.send(apiResponse);
                            console.log(apiResponse)
                        }else{
                            let apiResponse = response.generate(false, "Password Changed Succcesfully", 200, resp);
                            console.log(apiResponse)
                            res.send(apiResponse);
                            
                        }
                    })
                })
                .catch(error=>{
                    res.send(error);
                })
        }
    })
}


module.exports = {

    signUpFunction,
    loginFunction,
    logout,
    getUser,
    verifyUser,
    forgotPasswordSendEmail,
    forgotPasswordVerifyUser,
    changePassword,
    getUserByUserId

} // end exports