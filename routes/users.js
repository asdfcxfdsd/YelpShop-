const express = require('express');
const passport = require('passport');
const router = express.Router(); 
const path = require('path'); 
const User = require('../models/user'); 

const catchAsync = require('../utils/catchAsync');

const users = require('../controllers/users');




router.get('/register', users.showRegisterForm); 


router.post('/register', catchAsync(users.createNewUser));


router.get('/login', users.renderLoginForm);

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), users.login);

router.get('/logout',  users.logout); 

module.exports = router; 