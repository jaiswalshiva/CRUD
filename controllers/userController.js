const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const validator = require('email-validator');
const Model = require('../models/usersModel');
// const Model = require('../models/expenseModel');

// it is use the create or add a new data in the Databse
module.exports.create = async function (req, res, next) {
  const newpassword = req.body.password;
  const data = new Model({
    name: req.body.name,
    email: req.body.email,
    password: await bcrypt.hash(newpassword, 10),
  });
  // console.log(data);
  try {
    const dataToSave = await data.save();
    // console.log(dataToSave);
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.getOne = async function (req, res, next) {
  try {
    const data = await Model.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports.getAll = async function (req, res, next) {
  //   router.get('/getAll', async (req, res) => {
  try {
    const data = await Model.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports.edit = async function (req, res, next) {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };

    const result = await Model.findByIdAndUpdate(id, updatedData, options);

    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports.delete = async function (req, res, next) {
  try {
    const id = req.params.id;
    const data = await Model.findByIdAndDelete(id);
    res.send(`Document with ${data.name} has been deleted..`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
