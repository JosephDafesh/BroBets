const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signin', userController.verifyUser, (req, res) => {
  return res.status(200).json({ message: 'Sign in successfully.' });
});

router.post('/signup', userController.createUser, (req, res) => {
  return res.status(200).json({ message: 'Sign up successfully.' });
});

router.get('/get', userController.getUser, (req, res) =>
  res.status(200).send(res.locals.user)
);

router.get('/signout', (req, res) => {
  res.clearCookie('user_id');
  res.status(200).end();
});

module.exports = router;
