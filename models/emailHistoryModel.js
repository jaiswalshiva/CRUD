const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const emailHistory = new Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  staus: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Email', emailHistory);