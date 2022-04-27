const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
var mongoose = require('mongoose');

const Model = require('../models/usersModel');
const jwt=require('jsonwebtoken');

module.exports.login=(req, res, next) => {
    Model.find({email:req.body.email})
    .exec()
    .then(user=>{
        if(user.length<1){
            return res.status(401).json({
                msg:'user no exit'
            })
        }
        bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
            if(!result){
                return res.status(401).json({
                    msg:'password matching failed'
                })
            }
            if(result){
                const token=jwt.sign({
                    _id:user[0]._id,
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
                    _id:user[0]._id,
                    userType:user[0].userType,
                    email:user[0].email,
                    name:user[0].name,
                    token:token

                })
            }
        })
    })
    
        }
   
    