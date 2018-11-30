const express = require('express');
const router = express.Router();
const ideasController = require('../controllers/ideasController');

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

// show ideas
router.get('/ideas', ideasController.showIdeas);

module.exports = router;
