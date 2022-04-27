const express = require('express'); //import express

const router = express.Router();

const createController = require('../controllers/createController');
const deleteController = require('../controllers/deleteController');
const editController = require('../controllers/editController');
const findAllController = require('../controllers/findAllController');
const findIDController = require('../controllers/findIDController');
const findLoginController=require('../controllers/login');
router.post('/create', createController.create);
router.delete('/delete/:id', deleteController.delete);
router.patch('/edit/:id', editController.edit);
router.get('/getAll', findAllController.getAll);
router.get('/getOne/:id', findIDController.getOne);
router.post('/login', findLoginController.login);
module.exports = router; // export to use in server.js
