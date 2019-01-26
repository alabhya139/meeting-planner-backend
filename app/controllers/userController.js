const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');


const newUser = require('../libs/newUser');
const login = require('../libs/loginLib');


// start user signup function


let signUpFunction = (req, res) => {

    newUser.createUser(req,res)
        .then((resolve) => {
            let apiResponse = response.generate(false, "User Created Successfully", 200, resolve);
            res.send(apiResponse);
        })
        .catch(error => {
            res.send(error);
            console.log(error);
        });


} // end user signup function 

// start of login function 
let loginFunction = (req, res) => {
    login.findUser(req,res)
    .then(result=>{
        let apiResponse = response.generate(false,"Succesfully logged in!",200,result);
        res.send(apiResponse);
    })
    .catch(error=>{
        res.send(error);
    })
}


// end of the login function 


let logout = (req, res) => {

} // end of the logout function.


module.exports = {

    signUpFunction: signUpFunction,
    loginFunction: loginFunction,
    logout: logout

} // end exports