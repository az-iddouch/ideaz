const mongoose = require('mongoose');
const Idea = mongoose.model('Idea');

exports.addIdea = (req, res) => {
  res.render('ideas/add');
};

exports.submitIdea = async (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({ text: 'please add a title !' });
  }
  if (!req.body.body) {
    errors.push({ text: 'please add a body !' });
  }
  if (errors.length > 0) {
    res.render('ideas/add', { errors, title: req.body.title, body: req.body.body });
  } else {
    try {
      await new Idea(req.body).save();
      res.redirect('/ideas');
    } catch (err) {
      console.log(err);
    }
  }
};

exports.showIdeas = async (req, res) => {
  try {
    const ideas = await Idea.getIdeas();
    res.render('ideas/index', { ideas });
  } catch (err) {
    console.log(err);
  }
};

exports.editIdea = async (req, res) => {
  try {
    const idea = await Idea.findOne({
      _id: req.params.id
    });
    res.render('ideas/edit', { idea });
  } catch (err) {
    console.log(err);
  }
};
