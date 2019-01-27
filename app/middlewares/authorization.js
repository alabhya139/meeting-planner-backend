const token = require('../libs/tokenLib/tokenLib');
const mongoose = require('mongoose');
const response = require('../libs/responseLib');
const check = require('../libs/checkLib');

const AuthModel = mongoose.model('AuthModel');

let isAuthorized = (req,res,next)=>{
    if(req.body.authToken || req.params.authToken || 
        req.header('authToken') || req.query.authToken)
    {
        AuthModel.findOne({authToken: req.body.authToken || req.params.authToken || 
            req.query.authToken || req.header('authToken')})
            .exec((err,authDetails)=>{
                if(err){
                    let apiResponse = response.generate(true,"Invalid auth token",400,err);
                    res.send(apiResponse)
                }else if(check.isEmpty(authDetails)){
                    let apiResponse = response.generate(true,"Invalid auth details",400,null);
                    res.send(apiResponse)
                }else {
                    token.verifyToken(authDetails.authToken,authDetails.tokenSecret,
                        (err,verified)=>{
                            if(err){
                                let apiResponse = response.generate(true,
                                    "Invalid auth details",400,err);
                                res.send(apiResponse);
                            }else {
                                req.user = {
                                    userId: verified.data.userId
                                }
                                next()
                            }
                        });//end of verifyToken
                }
            });//end of exec
    }else {
        let apiResponse = response.generate(true,"Authorization token missing",400,null);
        res.send(apiResponse)
    }
}

module.exports = {
    isAuthorized
}