const express = require('express');
const passport = require('passport');
const { signup, login, changeUserRoleToAdmin } = require('../controller/authController.js');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.put('/change', changeUserRoleToAdmin);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
