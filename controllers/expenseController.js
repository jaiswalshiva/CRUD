const emailvalidator = require('email-validator');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const Model = require('../models/expenseModel');
const tokenModel = require('../models/tokenModel');
const expense = require('../models/expenseModel');
const redis = require('redis');
const redisPort = 6379;

// it is use the create or add a new data in the Databs
module.exports.create = async function (req, res, next) {
  let userID;
  let data;
  if (req.headers && req.headers.authorization) {
    const authorization = req.headers.authorization.split(' ')[1];
   // console.log(authorization);
    tokenModel.findOne({token: authorization}, function(err, user1){
      if(err)return handleErr(err);
  

   
   data = new Model({
    name: req.body.name,
    amount: req.body.amount,
    description: req.body.description,
    date: req.body.date,
    userID:user1.userID,
    category: req.body.category,
  });
  try {
    const dataToSave =  data.save();
    dataToSave.then(function(result) {
      res.status(200).json(result); // "Some User token"
   })
    //  console.log(dataToSave);
    // res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
})
}

};

module.exports.expenseOne = async function (req, res, next) { 
  try{   
      let userID;
    if (req.headers && req.headers.authorization) {
      const authorization = req.headers.authorization.split(' ')[1];
      tokenModel.findOne({token: authorization}, function(err, user1){
        if(err)return handleErr(err);
        userID=user1.userID;
      
   const key = userID.toString();
  
      
      const client = redis.createClient(redisPort);
     // console.log(client);
       client.connect();
        // const data = await Model.find();
      // use redis for caching
      client.expire(key, 2)
      var val;
      const foo = async () => {

      const data = await client.get(key);
      if (data) {
  
        res.json(JSON.parse(data));
      } else {
       // console.log(userID);
       
        expense.paginate({}, { page: req.query.page, limit: req.query.limit })
     {
     const data= expense.find({ userID }).limit(req.query.limit)

      .exec()
      .then((data) => {
        //bcrypt password
      
        const foo1 = async () => {
        await client.set(key, JSON.stringify(data));
        return res.json(data);
        }
        foo1();
      
    })
      
      //console.log(client);
      
      }}
    
    
    }
    foo();
  })
  }
       
    }
    catch(error){
      console.log(error)
    }

  }


module.exports.expenseAll = async function (req, res, next) {
  //   router.get('/getAll', async (req, res) => {
    const key = 'coodsoooghffsgoho';
    try {
      const client = redis.createClient(redisPort);
     // console.log(client);
       client.connect();
       client.expire(key, 2)
        // const data = await Model.find();
      // use redis for caching
      var val;
      const data = await client.get(key);

      if (data) {
  
        res.json(JSON.parse(data));
      } else {
       
        Model.paginate({}, { page: req.query.page, limit: req.query.limit })
     {
      const data = await expense.find(  ).limit(req.query.limit);
      //console.log(client);
      await client.set(key, JSON.stringify(data));
      return res.json(data);
      }}
       } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
//delete expense if you entered wrong

module.exports.expensedelete = async function (req, res, next) {

  try {
    let userId;
    const id = req.params.id;
    if (req.headers && req.headers.authorization) {
      const authorization = req.headers.authorization.split(' ')[1];
     // console.log(authorization);
      tokenModel.findOne({token: authorization}, function(err, user1){
        if(err)return handleErr(err);
         userId=user1.userID;
      
       
        expense.findOne({userID: userId}, function(err, user2){
          if(err)return handleErr(err);
          userId=user2._id;
          console.log(userId)
           console.log(id)
          if(userId.toString()==id){
          
            async function asyncCall(){
            const data  =await  expense.findByIdAndDelete(req.params.id);
            res.send(`Document with ${data.name} has been deleted..`);
                  }
                  asyncCall()
            }
            else{
              res.send(`param or token invalid..`);
            }
            
        })
      })
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
      tokenModel.findOne({token: authorization}, function(err, user1){
        if(err)return handleErr(err);
         userId=user1.userID;
      
       
        expense.findOne({userID: userId}, function(err, user2){
          if(err)return handleErr(err);
          userId=user2._id;
          // console.log(userId)
          // console.log(id)
          if(userId==id){
          
            async function asyncCall(){
              const result = await expense.findByIdAndUpdate(id, updatedData, options);
            
    res.send(result);
                  }
                  asyncCall()
            }
            
        })
      })
    }
   
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
