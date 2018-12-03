const mongoose = require('mongoose');
const Idea = mongoose.model('Idea');

exports.addIdea = (req, res) => {
  res.render('ideas/add');
};

exports.validateAdd = (req, res, next) => {
  let errors = {};

  if (!req.body.title) {
    errors.title = 'please add a title !';
  }
  if (!req.body.body) {
    errors.body = 'please add a body !';
  }
  if (Object.keys(errors).length > 0) {
    res.render('ideas/add', { errors, title: req.body.title, body: req.body.body });
    return;
  } else {
    next();
  }
};
exports.validateUpdate = async (req, res, next) => {
  let errors = {};

  if (!req.body.title) {
    errors.title = 'please add a title !';
  }
  if (!req.body.body) {
    errors.body = 'please add a body !';
  }
  if (Object.keys(errors).length > 0) {
    const idea = await Idea.findOne({ _id: req.params.id });
    res.render('ideas/edit', { errors, idea });
    return;
  } else {
    next();
  }
};

exports.submitIdea = async (req, res) => {
  try {
    await new Idea(req.body).save();
    req.flash('success', 'your idea has been successfully created.');
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
    req.flash('success', 'your idea is successfully updated !');
    res.redirect('/ideas');
  } catch (err) {
    console.log(err);
  }
};

exports.deleteIdea = async (req, res) => {
  try {
    const idea = await Idea.findOneAndRemove({ _id: req.params.id });
    req.flash('success', 'your ideas is successfuly deleted .');
    res.redirect('/ideas');
  } catch (err) {
    console.log(err);
  }
};
