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
//Showing login form
// app.get('/login', function (req, res) {
//   res.render('login');
// });

// //Handling user login
// app.post(
//   '/login',
//   passport.authenticate('local', {
//     successRedirect: '/secret',
//     failureRedirect: '/login',
//   }),
//   function (req, res) {}
// );

// //Handling user logout
// app.get('/logout', function (req, res) {
//   req.logout();
//   res.redirect('/');
// });

// function isLoggedIn(req, res, next) {
//   if (req.isAuthenticated()) return next();
//   res.redirect('/login');
// }
module.exports = router; // export to use in server.js
