const bcrypt = require('bcrypt');
const saltRounds = 10;
const response = require('../libs/responseLib');

let hash = (plainText)=>{
    return new Promise((resolve,reject)=>{
        bcrypt.hash(plainText,saltRounds,(err,hash)=>{
            if(err){
                let apiResponse = response.generate(true,"Error in hashing password",400,err);
                reject(apiResponse);
            }else resolve(hash);
        })
    })
}

let compareHash = (plainText,hash)=>{
    return new Promise((resolve,reject)=>{
        bcrypt.compare(plainText,hash,(err,result)=>{
            if(err){
                let apiResponse = response.generate(true,"Error in comparing hash to text",400,err);
                reject(apiResponse);
            }else if(result){
                resolve(result);
            }else {
                let apiResponse = response.generate(true,"Link is not valid!",400,err);
                reject(apiResponse);
            }
        })
    })
}

module.exports = {
    hash,
    compareHash
}