const emailvalidator = require('email-validator');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const Model = require('../models/expenseModel');
const tokenModel = require('../models/tokenModel');
const expense = require('../models/expenseModel');

// it is use the create or add a new data in the Databs
module.exports.create = async function (req, res, next) {
  // let userID;
  let data;
  if (req.headers && req.headers.authorization) {
    const authorization = req.headers.authorization.split(' ')[1];
    // console.log(authorization);
    tokenModel.findOne({ token: authorization }, function (err, user1) {
      if (err) return handleErr(err);

      data = new Model({
        name: req.body.name,
        amount: req.body.amount,
        description: req.body.description,
        date: req.body.date,
        userID: user1.userID,
      });
      try {
        const dataToSave = data.save();
        dataToSave.then(function (result) {
          res.status(200).json(result); // "Some User token"
        });
        //  console.log(dataToSave);
        // res.status(200).json(dataToSave);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    });
  }
};

module.exports.expenseOne = async function (req, res, next) {
  let userID;
  if (req.headers && req.headers.authorization) {
    const authorization = req.headers.authorization.split(' ')[1];
    tokenModel.findOne({ token: authorization }, function (err, user1) {
      if (err) return handleErr(err);
      userID = user1.userID;

      Model.find({ userID: user1.userID })
        .exec()
        .then((user) => {
          //bcrypt password
          if (user.length < 1) {
            return res.status(401).json({
              msg: 'user no exit',
            });
          }
          try {
            res.status(200).json(user); // "Some User token"
          } catch (error) {
            res.status(500).json({ message: error.message });
          }
        });
    });
  }
};

module.exports.expenseAll = async function (req, res, next) {
  //   router.get('/getAll', async (req, res) => {
  try {
    // const data = await tokenModel.find();
    const limitValue = req.query.limit || 5;
    const skipValue = req.query.skip || 0;
    const data = await Model.find().limit(limitValue).skip(skipValue);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//delete expense if you entered wrong

module.exports.expensedelete = async function (req, res, next) {
  try {
    let userId;
    const id = req.params.id;
    if (req.headers && req.headers.authorization) {
      const authorization = req.headers.authorization.split(' ')[1];
      // console.log(authorization);
      tokenModel.findOne({ token: authorization }, function (err, user1) {
        if (err) return handleErr(err);
        userId = user1.userID;

        expense.findOne({ userID: userId }, function (err, user2) {
          if (err) return handleErr(err);
          userId = user2._id;
          // console.log(userId)
          // console.log(id)
          if (userId == id) {
            async function asyncCall() {
              const data = await expense.findByIdAndDelete(req.params.id);
              res.send(`Document with ${data.name} has been deleted..`);
            }
            asyncCall();
          }
        });
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
//update the expense the expense sheet has
module.exports.expenseUpdate = async function (req, res, next) {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };
    let userId;
    if (req.headers && req.headers.authorization) {
      const authorization = req.headers.authorization.split(' ')[1];
      // console.log(authorization);
      tokenModel.findOne({ token: authorization }, function (err, user1) {
        if (err) return handleErr(err);
        userId = user1.userID;

        expense.findOne({ userID: userId }, function (err, user2) {
          if (err) return handleErr(err);
          userId = user2._id;
          // console.log(userId)
          // console.log(id)
          if (userId == id) {
            async function asyncCall() {
              const result = await expense.findByIdAndUpdate(
                id,
                updatedData,
                options
              );

              res.send(result);
            }
            asyncCall();
          }
        });
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
