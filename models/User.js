const mongoose = require('mongoose');
const validator = require('validator');
const md5 = require('md5');

const userSchema = new mongoose.Schema({
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
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

userSchema.virtual('gravatar').get(function() {
  const hash = md5(this.email);
  return `https://gravatar.com/avatar/${hash}?s=200`;
});

module.exports = mongoose.model('User', userSchema);
