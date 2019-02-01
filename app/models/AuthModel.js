const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let authModel = new Schema({
    userId:{
        type: String,
        unique: true,
        required: true,
        default: ''
    },
    authToken:{
        type: String,
        unique:true,
        default: '',
        required: true
    },
    tokenSecret:{
        type: String,
        default: '',
        required: true
    },
    issuedTime:{
        type: String,
        default: '',
        required: true
    }
});

mongoose.model('AuthModel',authModel);