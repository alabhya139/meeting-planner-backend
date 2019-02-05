/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const validator = require('validator');

let userSchema = new Schema({
  userId: {
    type: String,
    default: '',
    unique: true
  },
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    default: '',
    validate:{
      validator:validator.isEmail,
      message:console.log("No an Email")
    }
  },
  mobileNumber: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default:false
  },
  createdOn :{
    type:Date,
    default:""
  }


})


mongoose.model('User', userSchema);