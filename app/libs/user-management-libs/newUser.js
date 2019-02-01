const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('../timeLib');
const response = require('../../libs/responseLib')
const logger = require('../loggerLib');
const validateInput = require('../paramsValidationLib');
const check = require('../checkLib');
const hashPassword = require('../passwordLib/hashPassword');
const mailServer = require('../sendMail');

/* Models */
const UserModel = mongoose.model('User')
var hashedPassword;


let createUser = (req, res) => {
    let data = req.body;
    return new Promise((resolve, reject) => {
        UserModel.findOne({
                email: data.email
            })
            .exec((err, retrievedDetails) => {
                if (err) {
                    let apiResponse = response.generate(false,
                        "Something went wrong!", 400, err);
                    reject(apiResponse)
                } else if (check.isEmpty(retrievedDetails)) {
                    hashPassword.hashPassword(data.password, res)
                        .then(hash => {
                            let user = new UserModel({
                                userId: shortid.generate(),
                                firstName: data.firstName,
                                lastName: data.lastName,
                                password: hash,
                                email: data.email,
                                mobileNumber: data.mobileNumber,
                                createdOn: time.now()
                            });

                            console.log(user)
                        
                            console.log("email"+data.email)
                            let mailOptions = {
                                from: 'meetingplannerapp@gmail.com',
                                to: data.email,
                                subject: 'Verify Your Account',
                                text: `Please verify your account by clicking on the link below\n\nhttp://localhost:3000/verifyAccount?userId=${user.userId}`
                            };

                            console.log(mailOptions)

                            mailServer.sendMail(mailOptions)
                                .then(user.save((err, newUser) => {
                                        console.log("mail sent")
                                        if (err) {
                                            console.log(err);
                                            let apiResponse = response.generate(true,
                                                "Failed to create user", 400, err);
                                            reject(apiResponse);
                                        } else if (newUser) {
                                            resolve(newUser);
                                            console.log("user created")
                                        }
                                    })
                                )
                                .catch(error => {
                                    reject(error)
                                    console.log(error);
                                })
                            
                        })
                        .catch(error => {
                            res.send(error);
                        })
                } else {
                    let apiResponse = response.generate(false,
                        "User Already Registered", 403, null);
                    reject(apiResponse);
                }
            })
    });
}

module.exports = {
    createUser
}