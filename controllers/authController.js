const passport = require('passport');

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
