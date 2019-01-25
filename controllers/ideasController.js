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
    req.body.author = req.user._id;
    await new Idea(req.body).save();
    req.flash('success', 'your idea has been successfully created.');
    res.redirect('/ideas');
  } catch (err) {
    console.log(err);
  }
};

exports.showIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find({ author: req.user._id })
      .populate('categorie')
      .sort({ date: -1 });
    res.render('ideas/index', { ideas });
    // res.json(ideas);
  } catch (err) {
    console.log(err);
  }
};

// show a single idea
exports.showIdea = async (req, res) => {
  const idea = await Idea.findOne({ _id: req.params.id }).populate('categorie');
  res.render('ideas/showIdea', { idea });
};

const confirmOwner = (idea, user) => {
  if (!idea.author.equals(user._id)) {
    req.flash('error', 'Not authorized !');
    res.render('/ideas');
  }
};

exports.editIdea = async (req, res) => {
  try {
    const idea = await Idea.findOne({
      _id: req.params.id
    }).populate('categorie');
    // protect ideas Edit route
    confirmOwner(idea, req.user);
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

exports.searchIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find(
      {
        // we use $text because in our Index in Idea model we set it as text
        $text: {
          $search: req.query.q
        }
      },
      {
        // add field to our result (project)
        // $meta : some metadata provided by mongoDb
        score: {
          $meta: 'textScore'
        }
      }
      //sort them by $meta score
    )
      .sort({
        score: {
          $meta: 'textScore'
        }
      })
      // limit to 5 top results
      .limit(5);
    res.json(ideas);
  } catch (err) {
    console.log(err);
  }
};
