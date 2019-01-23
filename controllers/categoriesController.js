const mongoose = require('mongoose');
const Categorie = mongoose.model('Categorie');

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
