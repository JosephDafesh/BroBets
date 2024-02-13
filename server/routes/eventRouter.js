const express = require('express');
const router = express.Router();

const eventController = require('../controllers/eventController');

router.get(
  '/leaderboard/:eventId',
  eventController.getLeaderboard,
  (req, res) => res.status(200).send(res.locals.leaderboard)
);

router.post('/new/:userId', eventController.newEvent, (req, res) =>
  res.status(200).send({})
);

module.exports = router;
