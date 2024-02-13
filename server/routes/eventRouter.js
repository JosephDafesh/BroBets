const express = require('express');
const router = express.Router();

const eventController = require('../controllers/eventController');

router.get(
  '/leaderboard/:event_id',
  eventController.getLeaderboard,
  (req, res) => res.status(200).send(res.locals.leaderboard)
);

router.post('/new/:user_id', eventController.newEvent, (req, res) =>
  res.status(200).send({ message: 'added a new event successfully' })
);

router.post('/new-bet/:event_id', eventController.newBet, (req, res) =>
  res.status(200).send({ message: 'added a new bet to event successfully' })
);

router.post(
  '/update-correct-answer/:bet_id',
  eventController.newBet,
  (req, res) => res.status(200).send(res.locals.newLeaderboard)
);

router.post(
  '/end/:event_id',
  eventController.setEventEnd,
  eventController.getLeaderboard,
  (req, res) => res.status(200).send(res.locals.leaderboard)
);

module.exports = router;
