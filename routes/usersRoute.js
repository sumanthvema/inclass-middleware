const express = require('express');
const usersController = require('../controller/usersController');
const router = express.Router();

// Register a new user
router.post('/register', usersController.register);

// Login
router.post('/login', usersController.login);

module.exports = router