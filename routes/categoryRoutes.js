const express = require('express'); //import express

const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { route } = require('./userroutes');

router.post('/categoryCreate', categoryController.categoryCreate);
router.get('/categoryAll', categoryController.categoryAll);
router.patch('/categoryUpdate/:id', categoryController.categoryUpdate);
router.delete('/categorydelete/:id', categoryController.categorydelete);

module.exports = router;
