const express = require('express');
const router = express.Router();
const userController = require("./../../app/controllers/userController");
const appConfig = require("./../../config/appConfig")

const authMiddleware = require('../middlewares/authorization');

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}`;

    // defining routes.

    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/signup api for user signup.
     *
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     * @apiParam {string} mobileNumber mobile number of the user. (body params) (required)
     * @apiParam {string} firstName password of the user. (body params) (required)
     * @apiParam {string} lastName password of the user. (body params) (required)
     * @apiParam {boolean} isAdmin password of the user. (body params) (required)
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
    "error": false,
    "message": "User Created Successfully!A verification email has been sent to alabhya0@gmail.com. Please Verify your account in order to login!",
    "status": 200,
    "data": {
        "userId": "OjFtpQqnp",
        "firstName": "Alabhya",
        "lastName": "Pandey",
        "email": "alabhya0@gmail.com",
        "mobileNumber": 9457483864,
        "isVerified": false,
        "isAdmin": false,
        "createdOn": "2019-02-07T18:55:57.000Z",
        "password": "$2b$10$vuA7ZXQ364mN45QXzIrXl.iAufMl3d5J7NwjAxuEOkEqA7Zf.W5Du"
    }
}
    */


    // params: firstName, lastName, email, mobileNumber, password
    app.post(`${baseUrl}/signup`, userController.signUpFunction);

    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/login api for user login.
     *
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Login Successful",
            "status": 200,
            "data": {
                "authToken": "eyJhbGciOiJIUertyuiopojhgfdwertyuVCJ9.MCwiZXhwIjoxNTIwNDI29tIiwibGFzdE5hbWUiE4In19.hAR744xIY9K53JWm1rQ2mc",
                "userDetails": {
                "mobileNumber": 2234435524,
                "email": "someone@mail.com",
                "lastName": "Sengar",
                "firstName": "Rishabh",
                "userId": "-E9zxTYA8"
            }

        }
    */

    // params: email, password.
    app.post(`${baseUrl}/login`, userController.loginFunction);

    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/logout to logout user.
     *
     * @apiParam {string} userId userId of the user. (auth headers) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Logged Out Successfully",
            "status": 200,
            "data": null

        }
    */
    // auth token params: userId.
    app.post(`${baseUrl}/logout/:userId`, userController.logout);

    

    app.get(`${baseUrl}/verifyUser/:token`, userController.verifyUser);

    app.get(`${baseUrl}/getUsers`, authMiddleware.isAuthorized, userController.getUser);
    app.get(`${baseUrl}/getUsersById/:userId`, userController.getUserByUserId);

    app.post(`${baseUrl}/forgot-password-send-email`, userController.forgotPasswordSendEmail);
    app.get(`${baseUrl}/forgot-password-verify-user/:token`, userController.forgotPasswordVerifyUser);
    app.post(`${baseUrl}/change-password`, userController.changePassword);

}
