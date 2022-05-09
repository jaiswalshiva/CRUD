const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

// it is use the create or add a new data in the Databs
module.exports.create = async function (req, res, next) {
  const data = new Model({
    name: req.body.name,
    amount: req.body.amount,
    description: req.body.description,
    date: req.body.date,
    userID: req.params.id,
  });
  // console.log(data);

const userExpense = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
userExpense.plugin(mongoosePaginate);

module.exports = mongoose.model('Record', userExpense);
