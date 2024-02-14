const express = require('express');
const router = express.Router();

const eventController = require('../controllers/eventController');

router.get(
  '/leaderboard/:event_id',
  eventController.getLeaderboard,
  (req, res) => res.status(200).send(res.locals.leaderboard)
);

router.post('/new/:user_id', eventController.newEvent, (req, res) =>
  res.status(200).send(res.locals.newEvent_id)
);

router.post('/new-bet/:event_id', eventController.newBet, (req, res) =>
  res.status(200).send({ message: 'added a new bet to event successfully' })
);

router.post(
  '/update-correct-answer/:bet_id',
  eventController.newBet,
  (req, res) => res.status(200).send(res.locals.newLeaderboard)
);

router.post('/end/:event_id', eventController.setEventEnd, (req, res) =>
  res.status(200).send({ message: 'set an event to be ended successfully' })
);

router.post(
  '/update-ranking/:event_id',
  eventController.updateRanking,
  eventController.getLeaderboard
);

router.get(
  '/get-questionnaire/:event_id',
  eventController.getQuestionnaire,
  (req, res) => res.status(200).send(res.locals.questionnaire)
);

router.post('/post-answers', eventController.postAnswers, (req, res) =>
  res.status(200).send({ message: 'posted answers successfully' })
);

router.get(
  '/events-for/:user_id',
  eventController.getEventsForUser,
  (req, res) => res.status(200).send(res.locals.events)
);

router.get(
  '/title-and-creator/:event_id',
  eventController.getEventTitleAndCreator,
  (req, res) => res.status(200).send(res.locals.eventTitleAndCreator)
);

module.exports = router;
