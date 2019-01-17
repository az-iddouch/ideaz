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
  categorie: {
    type: mongoose.Schema.ObjectId,
    ref: 'Categorie'
  },
  date: {
    type: Date,
    default: Date.now
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an author'
  }
});

// IdeaSchema.statics.getIdeas = function() {
//   return this.aggregate([
//     {
//       $project: {
//         title: 1,
//         body: {
//           $substr: ['$body', 0, 100]
//         },
//         date: 1,
//         dateToDisplay: {
//           $dateToString: {
//             date: '$date',
//             format: '%d-%m-%Y'
//           }
//         }
//       }
//     },
//     { $sort: { date: -1 } }
//   ]);
// };

// this is for fixing displayed text problem in Ideas cards
IdeaSchema.virtual('preview').get(function() {
  if (this.body.split(' ').length < 19) {
    return this.body;
  } else {
    return this.body
      .split(' ')
      .slice(0, 19)
      .join(' ')
      .concat(' ...');
  }
});

// this is for fixing the displayed text problem in the ideas title
IdeaSchema.virtual('titleToDisply').get(function() {
  if (this.body.split(' ').length < 19) {
    return this.title;
  } else {
    return this.title
      .split(' ')
      .slice(0, 3)
      .join(' ')
      .concat(' ...');
  }
});

module.exports = mongoose.model('Idea', IdeaSchema);
