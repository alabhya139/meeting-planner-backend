const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const meetingsController = require("../controllers/meetingController")
const appConfig = require("./../../config/appConfig")
const authMiddleware = require('../middlewares/authorization');

module.exports.setRouter = (app) => {


    let baseUrl = `${appConfig.apiVersion}`;

    app.post(`${baseUrl}/createMeeting`, meetingsController.createEvent);

    app.get(`${baseUrl}/get-meetings`, meetingsController.getAllMeetings);

    app.get(`${baseUrl}/get-meeting-by-id/:meetingId`, meetingsController.getMeetingById);

    app.get(`${baseUrl}/get-meetings-by-user/:userId`,meetingsController.getMeetingsByUser);

    app.get(`${baseUrl}/get-meetings-by-admin/:adminId`, meetingsController.getMeetingsByAdmin);

    app.post(`${baseUrl}/editMeeting`, meetingsController.editMeeting);
}