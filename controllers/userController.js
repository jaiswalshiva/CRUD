const bcrypt = require('bcrypt');
const Model = require('../models/usersModel');
const emailvalidator = require('email-validator');
const sendEmail = require('../services/email');
const tokenModel = require('../models/tokenModel');
const redis = require('redis');
const redisPort = 6379;

// const redis = require('redis');

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
  const limitValue = req.query.limit || 2;
  let skipValue = req.query.skip || 0;
  const key = 'getAll' + skipValue.toString() + limitValue.toString();
  try {
    const client = redis.createClient(redisPort);
    // console.log(client);
    client.connect();
    // const data = await Model.find();
    // use redis for caching
    client.expire(key, 10);
    var val;
    const data = await client.get(key);
    if (data) {
      res.json(JSON.parse(data));
    } else {
      Model.paginate({}, { page: req.query.skip, limit: req.query.limit });

      {
        skipValue = skipValue * limitValue;
        const data = await Model.find().limit(limitValue).skip(skipValue);
        //console.log(client);
        await client.set(key, JSON.stringify(data));
        return res.json(data);
      }
    }
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
module.exports.changePassword = async function (req, res, next) {
  try {
    const email = req.body.email;
    let password = req.body.password;
    let tokemEmailId;
    let tokemPassword;
    let newpassword = req.body.newpassword;
    const options = { new: true };

    const incryptPassword = await bcrypt.hash(req.body.newpassword, 10);
    const updatedData = { password: incryptPassword };
    if (req.headers && req.headers.authorization) {
      const authorization = req.headers.authorization.split(' ')[1];
      // console.log(authorization);
      tokenModel.findOne({ token: authorization }, function (err, user1) {
        if (err) return handleErr(err);
        tokemEmailId = user1.email;

        //  console.log(tokemEmailId)
        //  console.log(email)

        if (tokemEmailId == email) {
          Model.findOne({ email: email }, function (err, user2) {
            if (err) return handleErr(err);
            //console.log(user2.password);
            tokemPassword = user2.password;
            const id = user2._id;
            //console.log(id)
            bcrypt.compare(req.body.password, tokemPassword, (err, result) => {
              if (!result) {
                return res.status(401).json({
                  msg: 'password matching failed',
                });
              } else {
                user2.password = incryptPassword;
                const asyncCall = async function () {
                  const result = await Model.findByIdAndUpdate(
                    id,
                    updatedData,
                    options
                  );
                };

                asyncCall();

                console.log(user2.password);
                return res.status(401).json({
                  msg: 'password changed',
                });
              }
            });
          });
        } else {
          return res.status(401).json({
            msg: 'wrong email id',
          });
        }
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
