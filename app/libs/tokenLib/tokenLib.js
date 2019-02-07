const jwt = require('jsonwebtoken');
const shortId = require('shortid');

const secretKey = "aHJBAxGvvCCggIjCSCHifjhv798Ghh8Fb&458(@@2@@@@@tzttffzggfffvvrf^^%%^^zvhhhx77yggd"

let generateToken = (data,callback)=>{
    try{
        let claims = {
            jwtId: shortId.generate(),
            iat:Date.now(),
            sub: 'auth-token',
            iss: 'alabhya',
            data: data
        }

        let tokenDetails = {
            token: jwt.sign(claims,secretKey),
            tokenSecret: secretKey
        }

        callback(null,tokenDetails);

    }catch(error){
        console.log(error);
        callback(error,null);
    }

}

let verifyToken = (token, secretKey, callback)=>{
    jwt.verify(token,secretKey, function(error,verified){
        if(error){
            console.log(error);
            callback(error,null);
        }else{
            callback(null,verified);
        }
    });
}

let generateTokenForEmail = (userId,callback)=>{
    try{
        let claims = {
            jwtId: shortId.generate(),
            iat:Date.now(),
            sub: 'auth-token',
            iss: 'alabhya',
            data: userId
        }

        let tokenDetails = {
            token: jwt.sign(claims,secretKey),
            tokenSecret: secretKey
        }

        callback(null,tokenDetails);

    }catch(error){
        console.log(error);
        callback(error,null);
    }
}

let verifyTokenWithoutSecret = (token, callback)=>{
    jwt.verify(token,secretKey, function(error,verified){
        if(error){
            console.log(error);
            callback(error,null);
        }else{
            callback(null,verified);
        }
    });
}

module.exports = {
    generateToken,
    verifyToken,
    generateTokenForEmail,
    verifyTokenWithoutSecret
}