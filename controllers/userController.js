const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const Model = require('../models/usersModel');
const emailvalidator = require('email-validator');
const sendEmail = require('../services/email');

const redis = require('redis');
const redisPort = 6379;
// it is use the create or add a new data in the Databse
module.exports.create = async function (req, res, next) {
  const email = req.body.email;
  const newpassword = req.body.password;
  const data = new Model({
    name: req.body.name,
    email: req.body.email,
    password: await bcrypt.hash(newpassword, 10),
  });
  try {
    if (!emailvalidator.validate(req.body.email)) {
      // Your call to model here
      res.status(400).send('Invalid Email');
    }
    if (req.body.password !== req.body.confirmPassword) {
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
  // const term = `quotes_author_\\${user}_${page}`;
  // const key = db.scanStream({ count: 5 });
  // console.log(key);
  // const key = 'constant';
  try {
    // const data = await Model.find();
    // // use redis for caching
    // const client = redis.createClient(redisPort);
    // await client.connect();
    // const data = await client.get(key);
    // if (data) {
    //   res.send(JSON.parse(data));
    // } else {
    //   const data = await Model.find();
    //   await client.set(key, JSON.stringify(data));
    //   return res.status(400).res.send(data);
    // }
    // if (req.query.page && req.query.limit)
    Model.paginate({}, { page: req.query.page, limit: req.query.limit })
      .then((response) => {
        res.json({ response });
      })
      .catch((error) => {
        res.json({ message: error.message });
      });
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
