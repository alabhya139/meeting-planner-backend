const mongoose = require('mongoose');
const time = require('../timeLib');
const response = require('../../libs/responseLib')
const check = require('../checkLib');
const hashPassword = require('../passwordLib/hashPassword');
const token = require('../tokenLib/tokenLib');

/* Models */
const UserModel = mongoose.model('User');
const AuthModel = mongoose.model('AuthModel');


/**
 * find user from mongodb database using find query!
 * 
 * @param req request body for http request
 * @param res response body for http request
 */

let findUser = (req, res) => {
    let data = req.body;
    return new Promise((resolve, reject) => {
        UserModel.findOne({
                email: data.email.toLowerCase()
            })
            .exec((error, userDetails) => {
                if (error) {
                    let apiResponse = response.generate(true, "Unable to find User", 404, error);
                    reject(apiResponse);
                } else if (check.isEmpty(userDetails)) {
                    let apiResponse = response.generate(true, "Unable to find User", 404, null);
                    reject(apiResponse);
                } else {
                    resolve(userDetails)
                }
            });//end of exec
    });//end of promise
}//end of findUser function

/**
 * function to save token in the @AuthModel for authorization purpose
 * 
 * @param userDetails Details of user
 */

let saveToken = (userDetails)=>{
    return new Promise((resolve,reject)=>{
        AuthModel.findOne({userId: userDetails.userId})
            .exec((error,tokenDetails)=>{
                if(error){
                    let apiResponse = response.generate(true,"Unable to find token details",
                    400,error);
                    reject(apiResponse);
                }else if(check.isEmpty(tokenDetails)){
                    let tokenInfo;
                    token.generateToken(userDetails.userId,(err,token)=>{
                        if(err){
                            let apiResponse = response.generate(true,"Unable to generate token",
                            400,err);
                            reject(apiResponse);
                        }else{
                            tokenInfo = token;
                        }
                    });//end of generateToken
                    let authDetails = new AuthModel({
                        userId: userDetails.userId,
                        authToken: tokenInfo.token,
                        tokenSecret: tokenInfo.tokenSecret,
                        issuedTime: time.now()
                    });

                    authDetails.save((err,token)=>{
                        if(err){
                            let apiResponse = response.generate(true,"Unable to save token",
                            400,err);
                            reject(apiResponse);
                        }else {
                            let data = {
                                authToken: token.authToken,
                                userDetails: userDetails
                            }
                            resolve(data);
                        }
                    });//end of save
                }else {
                    let data = {
                        authToken: tokenDetails.authToken,
                        userDetails: userDetails
                    }

                    resolve(data);
                }
            });//end of exec
    });//end of promise
}


module.exports = {
    findUser,
    saveToken
}