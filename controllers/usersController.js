const { body, validationResult, check } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.showLogin = (req, res) => {
  res.render('users/login');
};
exports.showRegister = (req, res) => {
  res.render('users/register');
};

exports.validateRegister = (req, res, next) => {
  return [
    sanitizeBody('name'),
    sanitizeBody('email'),
    sanitizeBody('password'),
    sanitizeBody('password-confirm'),
    body('name').isLength({ min: 1 }),
    body('email')
      .isLength({ min: 4 })
      .isEmail()
      .normalizeEmail({
        emove_dots: false,
        remove_extention: false,
        gmail_remove_subaddress: false
      }),
    body('password').length({ min: 6 }),
    check('password-confirm', 'your passwords must match !').equals(req.body.password)
  ];
  // try {
  //   validationResult(req).throw();
  //   // Oh look at ma' success! All validations passed!
  //   next();
  // } catch (err) {
  //   console.log(err.mapped()); // Oh noes!
  // }
};

exports.register = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  // User.create({
  //   username: req.body.username,
  //   password: req.body.password
  // }).then(user => res.json(user));
  // res.send('it passed');
};
