const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
userSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('User', userSchema);
