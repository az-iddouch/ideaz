const mongoose = require('mongoose');
const validator = require('validator');
const passportLocalMongoose = require('passport-local-mongoose');

const userScheme = new mongoose.Schema({
  name: {
    type: String,
    required: 'the name of the user is required',
    trim: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid email address'],
    required: 'the user email is required'
  },
  password: {
    type: String,
    required: 'user must have a password'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

userScheme.plugin(passportLocalMongoose, { usernameField: 'email' });
module.exports = mongoose.model('User', userScheme);
