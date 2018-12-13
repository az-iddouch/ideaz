const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const crypto = require('crypto');
const mail = require('../mail');
const bcrypt = require('bcryptjs');

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
    req.flash('success', 'a password reset email has been sent to, please go check your email!');
    // 4. redirect to login page
    res.redirect('/');
  } catch (err) {
    console.log(err);
  }
};

exports.reset = async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
      req.flash('error', 'password reset is invalid or expired');
      res.redirect('/users/login');
      return;
    }
    // if all's good render form
    res.render('users/reset');
  } catch (err) {
    console.log(err);
  }
};

exports.passwordConfirmed = (req, res, next) => {
  if (req.body.password === req.body.passwordConfirm) {
    next();
    return;
  }
  req.flash('error', 'your passwords does not match !');
  res.redirect('back');
};

exports.updatePassword = async (req, res) => {
  try {
    // PROBLEM
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() } //$gt ==> greater than
    });

    if (!user) {
      req.flash('error', 'password reset is invalid or has expired!');
      res.redirect('/users/login');
      return;
    }

    // set user password to typed password
    user.password = req.body.password;

    // set password reset token, and expiry to null
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // hash password and save user
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) throw err;
        user.password = hash;
        user
          .save()
          .then(user => {
            req.flash('success', 'your password has been successfully updated !');
            res.redirect('/users/login');
          })
          .catch(err => console.log(err));
      });
    });
  } catch (err) {
    console.log(err);
  }
};
