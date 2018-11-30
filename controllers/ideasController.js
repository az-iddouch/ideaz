const mongoose = require('mongoose');
const Idea = mongoose.model('Idea');

exports.addIdea = (req, res) => {
  res.render('ideas/add');
};

exports.validateAdd = (req, res, next) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({ text: 'please add a title !' });
  }
  if (!req.body.body) {
    errors.push({ text: 'please add a body !' });
  }
  if (errors.length > 0) {
    res.render('ideas/add', { errors, title: req.body.title, body: req.body.body });
    return;
  } else {
    next();
  }
};
exports.validateUpdate = (req, res, next) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({ text: 'please add a title !' });
  }
  if (!req.body.body) {
    errors.push({ text: 'please add a body !' });
  }
  if (errors.length > 0) {
    res.render('ideas/edit', { errors, title: req.body.title, body: req.body.body });
    return;
  } else {
    next();
  }
};

exports.submitIdea = async (req, res) => {
  try {
    await new Idea(req.body).save();
    res.redirect('/ideas');
  } catch (err) {
    console.log(err);
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

exports.updateIdea = async (req, res) => {
  try {
    const idea = await Idea.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true, // return the new store
      runValidators: true
    }).exec();
    res.send('updated !');
  } catch (err) {
    console.log(err);
  }
};
