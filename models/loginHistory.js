const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const loginHistory = new Schema({
  name: {
    type: String,
    required: true,
  },
  user_id: {},
});

module.exports = mongoose.model('Record', userExpense);
