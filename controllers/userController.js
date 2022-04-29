const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const Model = require('../models/usersModel');
const emailvalidator = require('email-validator');
const sendEmail = require('../services/email');
// const Model = require('../models/expenseModel');

// it is use the create or add a new data in the Databse
module.exports.create = async function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const data = new Model({
    name: req.body.name,
    email: req.body.email,
    password: await bcrypt.hash(password, 10),
  });
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

    // sending Email

    if (dataToSave) {
      await sendEmail({
        email,
        subject: 'registered',
        message: 'Congratulations you are Registered',
      });
    }

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

exports.forgotPassword = async (req, res) => {
  const email = req.body.email;
  const data = await Model.findOne({ email });
  if (data) {
    const resetUrl = `http://127.0.0.1:3000/api/resetpassword/${email}`;
    await sendEmail({
      email,
      subject: 'Reset password',
      message: `please click the link ${resetUrl} for reset your password.Otherwise ignore this email`,
    });
  }
  res.status(200).json({
    message: 'Email has been send for reset your password',
  });
};

exports.resetPassword = async (req, res) => {
  const email = req.params;
  if (req.body.newpassword === req.body.confirmpassword) {
    const data = await Model.findOneAndUpdate(email, {
      password: req.body.newpassword,
    });
    console.log(data);
    // if (data) {
    //   const pass = await bcrypt.hash(req.body.newpassword, 10);
    //   data.password = pass;
    //   await Model.save();
    //   res.status(200).json({
    //     message: 'Password has been changed',
    //   });
    // } else {
    //   res.status(200).json({
    //     message: 'invalid user',
    //   });
    // }
  } else {
    res.status(200).json({
      message: 'Password does not match',
    });
  }
};
