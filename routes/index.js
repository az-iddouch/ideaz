const express = require('express');
const router = express.Router();
const ideasController = require('../controllers/ideasController');
const usersController = require('../controllers/usersController');
const authController = require('../controllers/authController');

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
router.post('/users/login', authController.login);

// register
router.get('/users/register', usersController.showRegister);
router.post('/users/register', usersController.validateRegister, usersController.register);

module.exports = router;
