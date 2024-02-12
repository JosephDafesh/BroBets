const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// logging the endpoint that got hit
app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  return next();
});

app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../index.html')));

// serving a static html
app.get('/', (req, res) =>
  res.status(200).sendFile(path.join(__dirname, '../index.html'))
);

// 404 Error Handler
app.get('*', (req, res) => res.status(404).send('Page not found'));

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
