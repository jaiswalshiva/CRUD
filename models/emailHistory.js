const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userExpense = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  user_id: {},
});

module.exports = mongoose.model('Record', userExpense);
