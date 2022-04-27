const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
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
    if (!emailvalidator.validate(req.body.email)) {
      // Your call to model here
      res.status(400).send('Invalid Email');
    }
    if (req.body.password !== req.body.password2) {
      return res.status(400).send('Passwords dont match');
    }
    let user = await Model.findOne({ email: req.body.email });
    if (user) return res.status(400).json('User already registered.');
    if (req.body.password.length < 8) {
      return res.status(400).json('password must be.');
    }

    const dataToSave = await data.save();
    // console.log(dataToSave);
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// get th single data with the help of id
module.exports.getOne = async function (req, res, next) {
  try {
    const data = await Model.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get All the data with the help of id
module.exports.getAll = async function (req, res, next) {
  //   router.get('/getAll', async (req, res) => {
  try {
    const data = await Model.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// updated the data
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
//Deleted the data help of id
module.exports.delete = async function (req, res, next) {
  try {
    const id = req.params.id;
    const data = await Model.findByIdAndDelete(id);
    res.send(`Document with ${data.name} has been deleted..`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
