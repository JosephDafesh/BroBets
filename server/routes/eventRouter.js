const express = require('express');
const router = express.Router();

router.get('/leaderboard/:eventId', (req, res) =>
  res.status(200).send(res.locals.leaderboard)
);

module.exports = router;
