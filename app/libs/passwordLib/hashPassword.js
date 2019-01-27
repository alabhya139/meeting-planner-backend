const bcrypt = require('bcrypt');
const saltRounds = 10;
const response = require('../../libs/responseLib');

let hashPassword = (plainTextPassword)=>{
    return new Promise((resolve,reject)=>{
        bcrypt.hash(plainTextPassword,saltRounds,(err,hash)=>{
            if(err){
                let apiResponse = response.generate(true,"Error in hashing password",400,err);
                reject(apiResponse);
            }else resolve(hash);
        })
    })
}

let comparePassword = (plainTextPassword,hash)=>{
    return new Promise((resolve,reject)=>{
        bcrypt.compare(plainTextPassword,hash,(err,result)=>{
            if(err){
                let apiResponse = response.generate(true,"Error in comparing password",400,err);
                reject(apiResponse);
            }else if(result){
                resolve(result);
            }else {
                let apiResponse = response.generate(true,"Incorrect Password!",400,err);
                reject(apiResponse);
            }
        })
    })
}

module.exports = {
    hashPassword,
    comparePassword
}