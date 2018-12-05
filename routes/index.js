const express = require('express');
const router = express.Router();
const ideasController = require('../controllers/ideasController');
const usersController = require('../controllers/usersController');

const { body, validationResult, check } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// ROUTES
// index route
router.get('/', (req, res) => {
  res.render('index');
});

// about
router.get('/about', (req, res) => {
  res.render('about');
});

// add idea
router.get('/ideas/add', ideasController.addIdea);
router.post('/ideas', ideasController.validateAdd, ideasController.submitIdea);

// update
router.get('/edit/:id', ideasController.editIdea);
router.post('/update/:id', ideasController.validateUpdate, ideasController.updateIdea);

// delete idea
router.post('/delete/:id', ideasController.deleteIdea);

// show ideas
router.get('/ideas', ideasController.showIdeas);

// User Routes
router.get('/users/login', usersController.showLogin);

// register
router.get('/users/register', usersController.showRegister);
router.post(
  '/users/register',
  [
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
    body('password').isLength({ min: 6 }),
    check('password-confirm', 'your passwords must match !').matches('password')
  ],
  usersController.register
);

module.exports = router;
