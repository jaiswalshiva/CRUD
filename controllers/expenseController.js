const Model = require('../models/expenseModel');

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

  try {
    const dataToSave = await data.save();
    // console.log(dataToSave);
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.expenseOne = async function (req, res, next) {
  try {
    const data = await Model.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports.expenseAll = async function (req, res, next) {
  //   router.get('/getAll', async (req, res) => {
  try {
    const limitValue = req.query.limit || 5;
    const skipValue = req.query.skip || 0;
    const data = await Model.find().limit(limitValue).skip(skipValue);
    // const data = await Model.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//delete expense if you entered wrong

module.exports.expensedelete = async function (req, res, next) {
  try {
    const id = req.params.id;
    const data = await Model.findByIdAndDelete(id);
    res.send(`Document with ${data.name} has been deleted..`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
//update the expense the expense sheet has
module.exports.expenseUpdate = async function (req, res, next) {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };

    const result = await Model.findByIdAndUpdate(id, updatedData, options);

    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
