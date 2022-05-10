const { Schema, mongoose } = require('mongoose');

const loginHistory = new Schema(
  {
    device: {
      type: String,
      required: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model('userlogin', loginHistory);
