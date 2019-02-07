const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let MeetingSchema = new Schema({
    meetingId: {
        type: String,
        unique: true,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    adminId: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        default: ""
    },
    startHour: {
        type: Number,
        default: ""
    },
    endHour: {
        type: Number,
        default: ""
    },
    s_hour:{
        type: String,
        default: ""
    },
    s_min:{
        type: String,
        default: ""
    },
    s_time:{
        type: String,
        default: ""
    },
    e_hour:{
        type: String,
        default: ""
    },
    e_min:{
        type: String,
        default: ""
    },
    e_time:{
        type: String,
        default: ""
    },
    allDay:{
        type:Boolean,
        default: true
    },
    meetingTitle: {
        type: String,
        required: true
    },
    meetingPlace: {
        type: String,
        default: ""
    },
    meetingDescription: {
        type: String,
        default: ""
    },
    createdAt: {
        type: String,
        required: true
    }
});

mongoose.model('Meetings', MeetingSchema);