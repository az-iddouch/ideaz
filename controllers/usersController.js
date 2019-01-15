const { body, validationResult, check } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const promisify = require('es6-promisify');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = mongoose.model('User');
const Categorie = mongoose.model('Categorie');

exports.showLogin = (req, res) => {
  res.render('users/login');
};
exports.showRegister = (req, res) => {
  res.render('users/register');
};

exports.validateRegister = [
  sanitizeBody('name'),
  sanitizeBody('email'),
  sanitizeBody('password'),
  sanitizeBody('passwordConfirm'),
  body('name')
    .isLength({ min: 1 })
    .withMessage('you must specify a name .'),
  body('email')
    .isLength({ min: 4 })
    .withMessage('email is required .')
    .isEmail()
    .withMessage('your email is not correct .')
    .normalizeEmail({
      remove_dots: false,
      remove_extention: false,
      gmail_remove_subaddress: false
    }),
  body('password')
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 characters.')
    .custom((value, { req, loc, path }) => {
      if (value !== req.body.passwordConfirm) {
        // trow error if passwords do not match
        throw new Error('your passwords must match');
      } else {
        return value;
      }
    })
];

exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  const infos = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  };
  if (!errors.isEmpty()) {
    // return res.json({ errors: errors.mapped() });
    return res.render('users/register', { errors: errors.mapped(), infos });
  } else {
    const testUser = await User.findOne({ email: req.body.email });
    if (testUser) {
      req.flash('error', 'email already exists ! try another email.');
      res.render('users/register', { flashes: req.flash(), infos });
    }
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) throw err;
        user.password = hash;
        user
          .save()
          .then(user => {
            const cat1 = new Categorie({
              text: 'Business',
              owner: user._id
            }).save();
            const cat2 = new Categorie({
              text: 'Personal',
              owner: user._id
            }).save();
            return Promise.all([cat1, cat2]);
          })
          .then(res => {
            next();
          })
          .catch(err => console.log(err));
      });
    });
  }
};

exports.account = (req, res) => {
  res.render('users/account');
};

exports.updateAccount = async (req, res) => {
  const updates = {
    name: req.body.name,
    email: req.body.email
  };

  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: updates },
    { new: true, runValidators: true }
  );
  req.flash('success', 'profil successfully updated !');
  res.redirect('/ideas');
};
