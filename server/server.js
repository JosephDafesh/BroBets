const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

const cookieParser = require('cookie-parser');

const eventRouter = require('./routes/eventRouter');
const userRouter = require('./routes/userRouter');

// logging the endpoint that got hit
app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  return next();
});

app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../build')));

// serving a static html
app.get('/', (req, res) =>
  res.status(200).sendFile(path.join(__dirname, '../build/index.html'))
);

app.use('/event', eventRouter);
app.use('/user', userRouter);

app.get('*', (req, res) => res.redirect('/'));

// Global Error Handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error' + err,
    status: 500,
    message: { err: 'An error occurred' + err },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
