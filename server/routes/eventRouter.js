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
  res.status(200).json(res.locals.newBet)
);

router.post(
  '/update-correct-answer/:bet_id',
  eventController.updateCorrectAnswer,
  (req, res) => res.status(200).send(res.locals.newLeaderboard)
);

router.post('/end/:event_id', eventController.setEventEnd, (req, res) =>
  res.status(200).send({ message: 'set an event to be ended successfully' })
);

router.post(
  '/update-ranking/:event_id',
  eventController.updateRanking,
  eventController.getLeaderboard,
  (req, res) => res.status(200).send(res.locals.leaderboard)
);

router.get(
  '/get-questionnaire/:event_id',
  eventController.getQuestionnaire,
  (req, res) => res.status(200).json(res.locals.questionnaire)
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

router.get(
  '/join-game/:user_id/:event_id',
  eventController.checkDuplicateUserInEvent,
  (req, res) => res.status(200).send({ message: 'User can join the game' })
);

router.get(
  '/admin-events/:user_id',
  eventController.getAdminEvents,
  (req, res) => res.status(200).send(res.locals.adminEvents)
);

router.delete('/:event_id', eventController.deleteEvent, (req, res) => {
  res.status(200).send({ message: res.locals.message });
});

module.exports = router;
