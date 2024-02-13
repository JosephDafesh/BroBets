const db = require('../models/db');
const bcrypt = require('bcrypt');

const userController = {};

userController.createUser = async (req, res, next) => {
    const {firstName, lastName, email, password} = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    db.query()
    .then(result => {
        console.log('result:', result)
        res.locals.userCreated = 'User created successfully';
        return next();
    })
    .catch(err => next({
        log: 'Express error handler caught unknown middleware error',
        message: { err: 'An error occurred' },
        err
    }))
};

userController.verifyUser = async (req, res, next) => {
    const { username, password } = req.body;
    const inputPassword = password;

    db.query()
    .then(async (hashedPassword) => {
        res.locals.passwordMatches = await bcrypt.compare(inputPassword, hashedPassword.rows[0].password);
        if (res.locals.passwordMatches) {
            res.cookie('token', 'user');
            return next();
        }
    })
    .catch (err => next({
        log: 'Express error handler caught in usercontroller.verifyUser middleware',
        message: { err: 'An error occurred during login' },
        err
    }))
};