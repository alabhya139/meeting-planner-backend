const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('../timeLib');
const response = require('../../libs/responseLib')
const logger = require('../loggerLib');
const validateInput = require('../paramsValidationLib');
const check = require('../checkLib');
const hashPassword = require('../passwordLib/hashPassword');

/* Models */
const UserModel = mongoose.model('User')
var hashedPassword;


let createUser = (req,res) => {
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
                    hashPassword.hashPassword(data.password,res)
                    .then(hash=>{
                        let user = new UserModel({
                            userId: shortid.generate(),
                            firstName: data.firstName,
                            lastName: data.lastName,
                            password: hash,
                            email: data.email,
                            mobileNumber: data.mobileNumber,
                            createdOn: time.now()
                        });

                        user.save((err, newUser) => {
                            if (err) {
                                console.log(err);
                                let apiResponse = response.generate(false, 
                                    "Failed to create user", 400, err);
                                reject(apiResponse);
                            } else if (newUser) {
                                resolve(newUser);
                            }
                        });
                    })
                    .catch(error=>{
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