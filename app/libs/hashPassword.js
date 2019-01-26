const bcrypt = require('bcrypt');
const saltRounds = 10;

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
            }else reject(result);
        })
    })
}

module.exports = {
    hashPassword,
    comparePassword
}