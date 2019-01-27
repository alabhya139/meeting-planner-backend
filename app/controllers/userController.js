const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const mongoose = require('mongoose');
const _ = require('lodash');

const password = require('../libs/hashPassword');

const UserModel = mongoose.model('User');


const newUser = require('../libs/newUser');
const login = require('../libs/loginLib');


// start user signup function


let signUpFunction = (req, res) => {

    newUser.createUser(req, res)
        .then((resolve) => {
            let userDetails = resolve.toObject();
            delete userDetails._id;
            delete userDetails.__v;
            let apiResponse = response.generate(false, "User Created Successfully", 
            200, userDetails);
            res.send(apiResponse);
        })
        .catch(error => {
            res.send(error);
            console.log(error);
        });


} // end user signup function 

// start of login function 
let loginFunction = (req, res) => {
    login.findUser(req, res)
        .then(userDetails=>{
            password.comparePassword(req.body.password, userDetails.password)
            .then(result=>{
                login.saveToken(userDetails)
                .then(result => {
                    console.log(result)
                    let apiResponse = response.generate(false, "Succefully logged in",
                    200, result);
                    res.send(apiResponse);
                })
                .catch(error => res.send(error));
                
            })
            .catch(error => res.send(error));
        })
        .catch(error => res.send(error));
        
}


// end of the login function 


let logout = (req, res) => {

} // end of the logout function.

let getUser = (req, res) => {
    UserModel.find((err, data) => {
        if (err) {
            let apiResponse = response.generate(true, "Unable to get users", 400, err);
            res.send(apiResponse);
        } else {
            let userDetails = data;
            delete userDetails._id;
            delete userDetails.__v;
            let apiResponse = response.generate(false, "Users found succesfully", 200, data);
            res.send(apiResponse);
        }
    })
}


module.exports = {

    signUpFunction: signUpFunction,
    loginFunction: loginFunction,
    logout: logout,
    getUser

} // end exports