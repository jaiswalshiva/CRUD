const express = require('express'); //import express

const router = express.Router();
const expenseController = require('../controllers/expenseController');

router.post('/createExpense', expenseController.create);
router.get('/expenseOne/:id', expenseController.expenseOne);
router.get('/expenseAll', expenseController.expenseAll);
router.delete('/expensedelete/:id', expenseController.expensedelete);
router.patch('/expenseUpdate/:id', expenseController.expenseUpdate);
router.get('/expence', expenseController.me);


module.exports = router;
