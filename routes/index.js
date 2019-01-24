const express = require('express');
const router = express.Router();
const ideasController = require('../controllers/ideasController');
const usersController = require('../controllers/usersController');
const authController = require('../controllers/authController');
const categoriesController = require('../controllers/categoriesController');

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
router.get('/ideas/add', authController.isLoggedIn, ideasController.addIdea);
router.post(
  '/ideas',
  authController.isLoggedIn,
  ideasController.validateAdd,
  ideasController.submitIdea
);

// update
router.get('/edit/:id', authController.isLoggedIn, ideasController.editIdea);
router.post(
  '/update/:id',
  authController.isLoggedIn,
  ideasController.validateUpdate,
  ideasController.updateIdea
);

// delete idea
router.post('/delete/:id', authController.isLoggedIn, ideasController.deleteIdea);

// show ideas
router.get('/ideas', authController.isLoggedIn, ideasController.showIdeas);

// User Routes
router.get('/users/login', usersController.showLogin);
router.post('/users/login', authController.login);

// register
router.get('/users/register', usersController.showRegister);
router.post(
  '/users/register',
  usersController.validateRegister,
  usersController.register,
  authController.login
);

// Logout
router.get('/users/logout', authController.logout);

// Account
router.get('/account', authController.isLoggedIn, usersController.account);
router.post('/account', usersController.updateAccount);
router.get('/account/forgot', authController.showForgot);
router.post('/account/forgot', authController.forgot);
router.get('/account/reset/:token', authController.reset);
router.post(
  '/account/reset/:token',
  authController.passwordConfirmed,
  authController.updatePassword
);

// Categories
router.get('/categories/:id', categoriesController.showIdeasByCategorie);

// Categories Routes | API
router.post('/categories/add', categoriesController.add);
router.delete('/categories/delete', categoriesController.delete);
module.exports = router;
