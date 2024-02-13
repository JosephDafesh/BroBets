const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();



router.post('/signin', userController.createUser, (req, res) => {
    return res.status(200).json(res.locals.passwordMatches);
})

router.post('/signup', userController.verifyUser, (req,res) => {
    return res.status(200).json(res.locals.userCreated);
})

module.exports = router;