var emailvalidator = require("email-validator");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const Model = require('../models/usersModel');


// it is use the create or add a new data in the Databse
module.exports.create = async function (req, res, next) {
  const newPassword=req.body.password;
  const data = new Model({
    name: req.body.name,
    age: req.body.age,
    email: req.body.email,
    password: awaitbcrypt.hash(newPassword,10)
 
  });
  // console.log(data);
  
  try {
    if(!emailvalidator.validate(req.body.email)){
      // Your call to model here
      res.status(400).send('Invalid Email');
}
    if ( req.body.password !==  req.body.password2){

      return res.status(400).send("Passwords dont match");
    } 
    let user = await Model.findOne({ email: req.body.email });
    if (user) return res.status(400).json("User already registered.");
    if(req.body.password.length < 8) {
      return res.status(400).json("password must be.");
  }
  

    const dataToSave = await data.save();
    // console.log(dataToSave);
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};