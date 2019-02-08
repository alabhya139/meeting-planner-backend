const mongoose = require('mongoose');
const shortId = require('shortid');
const time = require('../libs/timeLib');

const MeetingModel = mongoose.model('Meetings');

const response = require('../libs/responseLib');


let createEvent = (req, res) => {
    let meeting = new MeetingModel({
        meetingId: shortId.generate(),
        userId: req.body.userId,
        adminId: req.body.adminId,
        startDate: req.body.startDate,
        endDate: req.body.startDate,
        startHour: req.body.startHour,
        endHour: req.body.endHour,
        e_hour: req.body.e_hour,
        e_min: req.body.e_min,
        e_time: req.body.e_time,
        s_hour: req.body.s_hour,
        s_min: req.body.s_min,
        s_time: req.body.s_time,
        meetingPlace: req.body.meetingPlace,
        meetingTitle: req.body.meetingTitle,
        meetingDescription: req.body.meetingDescription,
        createdAt: time.now()
    });

    meeting.save((err, result) => {
        if (err) {
            let apiResponse = response.generate(true, "Error in creating meeting", 500, err);
            res.send(apiResponse);
        } else {
            let meetingInfo = result.toObject();
            delete meetingInfo.__v;
            delete meetingInfo._id;
            let apiResponse = response.generate(false, "Meeting created successfully", 200, meetingInfo);
            res.send(apiResponse);
        }
    });
}

let getAllMeetings = (req, res) => {
    MeetingModel.find((err, meeetings) => {
        if (err) {
            let apiResponse = response.generate(true, "Error in finding meeting", 500, err);
            res.send(apiResponse);
        } else {
            let apiResponse = response.generate(false, "Meetings fetched Succesfully", 200, meeetings);
            res.send(apiResponse);
        }
    })
}

let getMeetingById = (req, res) => {
    console.log(req.params)
    MeetingModel.findOne({
        meetingId: req.params.meetingId
    }, (err, meeting) => {
        if (meeting) {
            let apiResponse = response.generate(false, "Meeting fetched Succesfully", 200, meeting);
            res.send(apiResponse);
        } else {
            let apiResponse = response.generate(true, "Unable to fetch meetings", 400, err);
            res.send(apiResponse);
        }
    })
}

let getMeetingsByUser = (req, res) => {
    MeetingModel.find({
        userId: req.params.userId
    }, (err, resp) => {
        if (err) {
            let apiResponse = response.generate(true, "Unable to fetch meetings", 400, err);
            res.send(apiResponse);
        } else {
            let apiResponse = response.generate(false, "meetings fetched succesfully", 200, resp);
            res.send(apiResponse);
        }
    })
}

let getMeetingsByAdmin = (req, res) => {
    MeetingModel.find({
        adminId: req.params.adminId
    }, (err, resp) => {
        if (err) {
            let apiResponse = response.generate(true, "Unable to fetch meetings", 400, err);
            res.send(apiResponse);
        } else {
            let apiResponse = response.generate(false, "meetings fetched succesfully", 200, resp);
            res.send(apiResponse);
        }
    })
}

let deleteMeetingById = (req,res)=>{
    MeetingModel.findByIdAndRemove({meetingId:req.params.meetingId || req.query.meetingId},(err,apiResponse)=>{
        if(err){
            let apiResponse = response.generate(true, "Unable to delete meetings", 400, err);
            res.send(apiResponse);
        }else{
            let apiResponse = response.generate(false, "Meetings deleted successfully!", 200, resp);
            res.send(apiResponse);
        }
    })
}

let editMeeting = (req, res) => {
    MeetingModel.findOneAndRemove({
        meetingId: req.query.meetingId
    }, (err, resp) => {
        if (err) {
            let apiResponse = response.generate(true, "Error in editing meeting",
                500, null);
            res.send(apiResponse);
        } else {
            let meeting = new MeetingModel({
                meetingId: shortId.generate(),
                userId: req.body.userId,
                adminId: req.body.adminId,
                startDate: req.body.startDate,
                endDate: req.body.startDate,
                startHour: req.body.startHour,
                endHour: req.body.endHour,
                e_hour: req.body.e_hour,
                e_min: req.body.e_min,
                e_time: req.body.e_time,
                s_hour: req.body.s_hour,
                s_min: req.body.s_min,
                s_time: req.body.s_time,
                meetingPlace: req.body.meetingPlace,
                meetingTitle: req.body.meetingTitle,
                meetingDescription: req.body.meetingDescription,
                createdAt: time.now()
            });

            meeting.save((err, result) => {
                if (err) {
                    let apiResponse = response.generate(true, "Error in editing meeting",
                        500, null);
                    res.send(apiResponse);
                } else {
                    let meetingInfo = result.toObject();
                    delete meetingInfo.__v;
                    delete meetingInfo._id;
                    let apiResponse = response.generate(false, "Meeting edited successfully",
                        200, meetingInfo);
                    res.send(apiResponse);
                }
            });
        }
    })
}

module.exports = {
    createEvent,
    getAllMeetings,
    getMeetingById,
    getMeetingsByUser,
    getMeetingsByAdmin,
    editMeeting,
    deleteMeetingById
}