const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IdeaSchema = new Schema({
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
