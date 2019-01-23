const mongoose = require('mongoose');
const Categorie = mongoose.model('Categorie');

exports.add = async (req, res) => {
  try {
    req.body.owner = req.user._id;
    const newCateforie = await new Categorie(req.body).save();
    res.json(newCateforie);
    console.log('categorie inserted into db ✔✔✔');
  } catch (err) {
    console.log('err');
  }
};
