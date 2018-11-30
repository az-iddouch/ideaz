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

IdeaSchema.statics.getIdeas = function() {
  return this.aggregate([
    {
      $project: {
        title: 1,
        body: {
          $substr: ['$body', 0, 100]
        },
        date: 1,
        dateToDisplay: {
          $dateToString: {
            date: '$date',
            format: '%d-%m-%Y'
          }
        }
      }
    },
    { $sort: { date: -1 } }
  ]);
};

module.exports = mongoose.model('Idea', IdeaSchema);
