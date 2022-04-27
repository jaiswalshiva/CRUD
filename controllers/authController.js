const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const emailvalidator = require('email-validator');
const Model = require('../models/usersModel');
const jwt = require('jsonwebtoken');
// user login
module.exports.login = (req, res, next) => {
  Model.find({ email: req.body.email })
    .exec()
    .then((user) => {
      //bcrypt password
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (!result) {
          return res.status(401).json({
            msg: 'password matching failed',
          });
        }
        // genrate token
        if (result) {
          const token = jwt.sign(
            {
              _id: user[0]._id,
              email: user[0].email,
              name: user[0].name,
              userType: user[0].userType,
            },
            'this is dumy text',
            //expire time
            {
              expiresIn: '24h',
            }
          );
          //final response
          res.status(200).json({
            _id: user[0]._id,
            userType: user[0].userType,
            email: user[0].email,
            name: user[0].name,
            token: token,
          });
        }
      });
    });
};

// user LogOut
