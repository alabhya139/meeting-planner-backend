const jwt = require('jsonwebtoken');
const shortId = require('shortid');

const secretKey = "aHJBAxGvvCCggIjCSCHifjhv798Ghh8Fb&458(@@2@@@@@tzttffzggfffvvrf^^%%^^zvhhhx77yggd"

let generateToken = (data,callback)=>{
    try{
        let claims = {
            jwtId: shortId.generate(),
            iat:Date.now(),
            exp: Math.floor(Date.now()/1000) + (60*60*24), //24 hours
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

let verifyToken = (token,callback)=>{
    jwt.verify(token,secretKey, function(error,verified){
        if(error){
            console.log(error);
            callback(error,null);
        }else{
            console.log("user verfied!");
            callback(null,verified);
        }
    });
}

module.exports = {
    generateToken,
    verifyToken
}