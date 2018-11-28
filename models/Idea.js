const mongoose = require('mongoose');

const IdeaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: "the idea 's title is required !"
  },
  body: {
    type: String,
    required: 'you must supply a body for the idea'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Idea', IdeaSchema);
