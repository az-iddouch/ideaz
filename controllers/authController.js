const passport = require('passport');

exports.login = passport.authenticate('local', {
  failureRedirect: '/users/login',
  successRedirect: '/ideas',
  successFlash: 'You are now logged !',
  failureFlash: true
});
