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
      'INSERT INTO users (first_name, last_name, email, password) ' +
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

  try {
    // Check if email exists
    const userQueryRes = await db.query(
      'SELECT * FROM users WHERE email = $1;',
      [email]
    );
    if (userQueryRes.rows.length === 0) {
      return res.status(400).send({ message: 'Email not found.' });
    }
    const user = userQueryRes.rows[0];

    // Check if password match
    const storedHashedPassword = user.password;
    const passwordMatch = await bcrypt.compare(
      inputPassword,
      storedHashedPassword
    );
    if (!passwordMatch) {
      return res.status(400).send({ message: 'Password incorrect.' });
    }
    const { user_id } = user;
    res.cookie('user_id', String(user_id));
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

userController.getUser = async (req, res, next) => {
  const user_id = req.cookies.user_id;
  try {
    const userQueryRes = await db.query(
      'SELECT * FROM users WHERE user_id = $1;',
      [user_id]
    );
    res.locals.user = userQueryRes.rows[0];
    return next();
  } catch (e) {
    return next({
      log: 'Express Caught eventController.getUser middleware error' + e,
      message: {
        err: 'An error occurred when getting user' + e,
      },
    });
  }
};

module.exports = userController;
