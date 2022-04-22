const bodyParser = require('body-parser');

const Model = require('../models/usermodel');
// find data with help of single id
module.exports.getOne = async function (req, res, next) {
  try {
    const data = await Model.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
