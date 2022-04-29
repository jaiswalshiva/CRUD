const express = require('express'); //import express

const router = express.Router();

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/create', userController.create);
router.delete('/delete/:id', userController.delete);
router.patch('/edit/:id', userController.edit);
router.get('/getAll', userController.getAll);
router.get('/getOne/:id', userController.getOne);

router.post('/forgotpassword/', userController.forgotPassword);
router.post('/resetpassword/:email', userController.resetPassword);

module.exports = router; // export to use in server.js
