const mongoose = require('mongoose');
const randomColor = require('randomcolor');

const CategorieSchema = new mongoose.Schema({
  text: {
    type: String,
    required: 'you must supply a text for the categorie'
  },
  color: {
    type: String
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    requred: 'the owner is requred for the categorie'
  }
});

CategorieSchema.pre('save', function(next) {
  this.color = randomColor();
  next();
});

module.exports = mongoose.model('Categorie', CategorieSchema);
