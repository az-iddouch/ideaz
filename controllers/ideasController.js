const mongoose = require('mongoose');
// const Idea = mongoose.model('Idea');

exports.addIdea = (req, res) => {
  res.render('ideas/add');
};
