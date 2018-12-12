const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const crypto = require('crypto');
const mail = require('../mail');

exports.login = (req, res, next) => {
  passport.authenticate('local', {
    failureRedirect: '/users/login',
    successRedirect: '/ideas',
    successFlash: 'You are now logged !',
    failureFlash: true
  })(req, res, next);
};

exports.isLoggedIn = (req, res, next) => {
  // first check if the user is authenticated
  if (req.isAuthenticated()) {
    next(); // carry on
    return;
  }
  req.flash('error', 'Ooops ! you must be logged in .');
  res.redirect('/users/login');
};

exports.logout = async (req, res) => {
  req.logout();
  req.flash('success', 'your now logged out !');
  res.redirect('/users/login');
};

exports.showForgot = (req, res) => {
  res.render('users/forgot');
};

exports.forgot = async (req, res) => {
  try {
    // 1. see if the user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      req.flash('error', 'No account with that email exists !');
      res.redirect('/users/login');
    }
    // 2. set reset tokens and expiry on their accounts
    user.resetPasswordToken = crypto.randomBytes(25).toString('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // an hour from now
    await user.save();

    // 3. send them an email with the tokens
    const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
    await mail.send({
      user,
      filename: 'password-reset',
      subject: 'password reset',
      resetURL
    });
    req.flash('success', `now you can go to your email to get you password reset Link ${resetURL}`);
    // 4. redirect to login page
    res.redirect('/');
  } catch (err) {
    console.log(err);
  }
};
