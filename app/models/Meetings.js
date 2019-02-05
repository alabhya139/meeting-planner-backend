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