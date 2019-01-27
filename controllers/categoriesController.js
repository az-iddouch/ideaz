const mongoose = require('mongoose');
const Categorie = mongoose.model('Categorie');
const Idea = mongoose.model('Idea');

exports.add = async (req, res) => {
  try {
    req.body.owner = req.user._id;
    const categories = await Categorie.find({ owner: req.user._id });
    if (categories.length < 5) {
      const newCateforie = await new Categorie(req.body).save();
      res.json(newCateforie);
    } else {
      res.json({ error: 'to add more Categories!, you need to be a premuim user!' });
    }
  } catch (err) {
    console.log('err');
  }
};

exports.delete = async (req, res) => {
  await Categorie.findOneAndDelete({ _id: req.body.id });
  console.log('categorie deleted');
  res.json({ msg: 'deleted' });
};

exports.showIdeasByCategorie = async (req, res) => {
  try {
    const page = req.params.page || 1;
    const limit = 12;
    const skip = page * limit - limit;
    const ideasPromise = Idea.find({ categorie: req.query.categorie })
      .populate('categorie')
      .skip(skip)
      .limit(limit)
      .sort({ date: -1 });

    const countPromise = Idea.count({ author: req.user._id, categorie: req.query.categorie });
    const categoriePromise = Categorie.findOne({ _id: req.query.categorie });
    const [ideas, categorie, count] = await Promise.all([
      ideasPromise,
      categoriePromise,
      countPromise
    ]);
    const pages = Math.ceil(count / limit);
    if (!ideas.length && skip) {
      res.redirect(`/categories/page/${pages}`);
      return;
    }
    if (categorie) {
      res.render('categories/index', { categorie, ideas, count, pages, page });
    } else {
      req.flash('error', "Categorie doesn't exist");
      res.redirect('/ideas');
    }
  } catch (err) {
    console.log(err);
  }
};
