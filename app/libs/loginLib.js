const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib');
const check = require('../libs/checkLib');
const hashPassword = require('../libs/hashPassword');
const token = require('../libs/tokenLib');

/* Models */
const UserModel = mongoose.model('User');
const AuthModel = mongoose.model('AuthModel');


let findUser = (req, res) => {
    let data = req.body;
    return new Promise((resolve, reject) => {
        UserModel.findOne({
                email: data.email
            })
            .exec((error, userDetails) => {
                if (error) {
                    let apiResponse = response.generate(true, "Unable to find User", 404, error);
                    reject(apiResponse);
                } else if (check.isEmpty(userDetails)) {
                    let apiResponse = response.generate(true, "Unable to find User", 404, null);
                    reject(apiResponse);
                } else {
                    hashPassword.comparePassword(data.password, userDetails.password)
                        .then(result => {
                            if (result) {
                                let tokenData = {
                                    userId: userDetails.userId,
                                    userName: `${userDetails.firtName} ${userDetails.lastName}`
                                }

                                token.generateToken(tokenData, (error, tokenDetails) => {
                                    if (error) {
                                        let apiResponse = response.generate(true, "Error in generating Token", 400, error);
                                        reject(apiResponse);
                                    } else {
                                        AuthModel.findOne({userId: userDetails.userId})
                                        .exec((err,tokenResult)=>{
                                            if(error){
                                                let apiResponse = response.generate(true, "Error in finding Token", 400, error);
                                                reject(apiResponse);
                                            }else if(check.isEmpty(tokenResult)){
                                                let token = new AuthModel({
                                                    userId: userDetails.userId,
                                                    authToken: tokenDetails.token,
                                                    tokenSecret: tokenDetails.tokenSecret,
                                                    issuedTime: time.now()
                                                })

                                                token.save((err,result)=>{
                                                    if(err){
                                                        let apiResponse = response.generate(true, "Error in saving Token", 400, err);
                                                        reject(apiResponse);
                                                    }else {
                                                        let loginResponse = {
                                                            authToken: result.authToken,
                                                            userDetails
                                                        }
        
                                                        let apiResponse = response.generate(false, "Succesfully logged in", 200, loginResponse);
                                                        resolve(apiResponse);
                                                    }
                                                })
                                            }else {
                                                let loginResponse = {
                                                    authToken: tokenResult.authToken,
                                                    userDetails
                                                }

                                                let apiResponse = response.generate(false, "Succesfully logged in", 200, loginResponse);
                                                resolve(apiResponse);
                                            }
                                        })

                                    }
                                })

                            }
                        })
                }
            })
    })
}

module.exports = {
    findUser
}