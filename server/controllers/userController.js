const db = require('../models/db');
const bcrypt = require('bcrypt');

const userController = {};

userController.createUser = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Check if email is in use
    const userQueryRes = await db.query(
      'SELECT * FROM users WHERE email = $1;',
      [email]
    );

    if (userQueryRes.rows.length > 0) {
      return res.status(400).send({ message: 'Email is in use' });
    }

    await db.query(
      'INSERT INTO users (first_name, last_name, email, passowrd) ' +
        'VALUES($1, $2, $3, $4);',
      [firstName, lastName, email, hashedPassword]
    );
    return next();
  } catch (e) {
    return next({
      log: 'Express Caught eventController.createUser middleware error' + e,
      message: {
        err: 'An error occurred when creating new user' + e,
      },
    });
  }
};

userController.verifyUser = async (req, res, next) => {
  const { email, password } = req.body;
  const inputPassword = password;

  db.query()
    .then(async (hashedPassword) => {
      res.locals.passwordMatches = await bcrypt.compare(
        inputPassword,
        hashedPassword.rows[0].password
      );
      if (res.locals.passwordMatches) {
        res.cookie('token', 'user');
        return next();
      }
    })
    .catch((err) =>
      next({
        log: 'Express error handler caught in usercontroller.verifyUser middleware',
        message: { err: 'An error occurred during login' },
        err,
      })
    );
};
