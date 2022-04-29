const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tokens = new Schema({
  token: {
    type: String,
    required: true,
    
  },
  email: {
    type: String,
    required: true,
    
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    
  },
});
module.exports = mongoose.model('token', tokens);
