const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const loginHistory = new Schema({
  device: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});
module.exports = mongoose.model('userlogin', loginHistory);
