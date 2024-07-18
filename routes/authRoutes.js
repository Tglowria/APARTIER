const express = require('express');
const passport = require('passport');
const { signup, login } = require('../controller/authController.js');

const router = express.Router();

router.get('/signup', signup);
router.get('/login', login);

module.exports = router
