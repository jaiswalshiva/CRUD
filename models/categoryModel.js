const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const category = new Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('cate', category);
