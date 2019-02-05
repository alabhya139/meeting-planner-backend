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
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
        startHour: req.body.startHour,
        endHour: req.body.endHour,
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

let getAllMeetings = (req,res)=>{
    MeetingModel.find((err,meeetings)=>{
        if(err){
            let apiResponse = response.generate(true, "Error in finding meeting", 500, err);
            res.send(apiResponse);
        }else{
            let apiResponse = response.generate(false,"Meetings fetched Succesfully",200,meeetings);
            res.send(apiResponse);
        }
    })
}

let getMeetingById = (req,res)=>{
    console.log(req.params)
    MeetingModel.findOne({meetingId:req.params.meetingId},(err,meeting)=>{
        if(meeting){
            let apiResponse = response.generate(false,"Meeting fetched Succesfully",200,meeting);
            res.send(apiResponse);
        }else{
            let apiResponse = response.generate(true,"Unable to fetch meetings",400,err);
            res.send(apiResponse);
        }
    })
}

let getMeetingsByUser = (req,res)=>{
    MeetingModel.find({userId:req.params.userId},(err,resp)=>{
        if(err){
            let apiResponse = response.generate(true, "Unable to fetch meetings", 400, err);
            res.send(apiResponse);
        }else{
            let apiResponse = response.generate(false, "meetings fetched succesfully", 200, resp);
            res.send(apiResponse);
        }
    })
}

let getMeetingsByAdmin = (req,res)=>{
    MeetingModel.find({adminId:req.params.adminId},(err,resp)=>{
        if(err){
            let apiResponse = response.generate(true, "Unable to fetch meetings", 400, err);
            res.send(apiResponse);
        }else{
            let apiResponse = response.generate(false, "meetings fetched succesfully", 200, resp);
            res.send(apiResponse);
        }
    })
}

module.exports = {
    createEvent,
    getAllMeetings,
    getMeetingById,
    getMeetingsByUser,
    getMeetingsByAdmin
}