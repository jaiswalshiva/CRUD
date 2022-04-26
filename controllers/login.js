const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
var mongoose = require('mongoose');

const Model = require('../models/usersModel');
const jwt=require('jsonwebtoken');

module.exports.login=(req, res, next) => {
    Model.find({email:req.body.email})
    .exec()
    .then(user=>{
     
        
        bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
            if(!result){
                return res.status(401).json({
                    msg:'password matching failed'
                })
            }
            if(result){
                const token=jwt.sign({
                    email:user[0].email,
                    name:user[0].name,
                    userType:user[0].userType
                },
                'this is dumy text',
                {
                    expiresIn:"24h"

                }
                );
                res.status(200).json({
                    userType:user[0].userType,
                    email:user[0].email,
                    name:user[0].name,
                    token:token

                })
            }
        })
    })
    
        }
   
    