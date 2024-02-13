const db = require('../models/db.js');

const getLeaderboard = async (req, res, next) => {
  const { event_id } = req.params;
  try {
    const scoreQueryRes = await db.query(
      'SELECT * FROM scores WHERE event_id = $1;',
      [event_id]
    );
    const scores = scoreQueryRes.rows;
    const userIds = scores.map((row) => row.user_id);
    const userQueryRes = await db.query(
      'SELECT user_id, username FROM users WHERE user_id = ANY($1::int[])',
      [userIds]
    );
    const users = userQueryRes.rows;
    users.forEach(({ user_id, username }) => {
      const score = scores.find((item) => item.user_id === user_id);
      score.username = username;
    });
    res.locals.leaderboard = scores;
    return next();
  } catch (err) {
    return next({
      log:
        'Express Caught eventController.getLeaderboard middleware error' + err,
      message: {
        err: 'An error occurred when getting leaderboard' + err,
      },
    });
  }
};

const newEvent = (req, res, next) => {
  const { user_id } = req.params;
  const { event_title, last_call } = req.body;
  return db
    .query(
      'INSERT INTO events ' +
        '(event_title, last_call, has_ended, admin, total_points, created_at) ' +
        'VALUES($1, $2, $3, $4, $5, $6);',
      [event_title, last_call, false, user_id, 0, new Date().toISOString()]
    )
    .then(() => next())
    .catch((err) =>
      next({
        log: 'Express Caught eventController.newEvent middleware error' + err,
        message: {
          err: 'An error occurred when adding a new event' + err,
        },
      })
    );
};

const newBet = async (req, res, next) => {
  const { event_id } = req.params;
  const { type, question, points } = req.body;
  try {
    // add a row of new bet to table
    await db.query(
      'INSERT INTO bets ' +
        '(event_id, type, question, points) ' +
        'VALUES($1, $2, $3, $4);',
      [event_id, type, question, points]
    );
    // update total_points in events table
    await db.query(
      'UPDATE events SET total_points = total_points + $1 WHERE event_id = $2;',
      [points, event_id]
    );
    return next();
  } catch (e) {
    return next({
      log: 'Express Caught eventController.newBet middleware error' + e,
      message: {
        err: 'An error occurred when adding a new bet to an event' + e,
      },
    });
  }
};

const updateCorrectAnswer = async (req, res, next) => {
  try {
    const { bet_id } = req.params;
    const { correct_answer } = req.body;

    const betQueryRes = await db.query(
      'UPDATE bets SET correct_answer = $1 WHERE bet_id = $2 RETURNING event_id, points;',
      [correct_answer, bet_id]
    );
    const { event_id, points } = betQueryRes.rows[0];

    // Update scores for players
    const answerQueryRes = await db.query(
      'SELECT user_id, answer FROM answers WHERE bet_id = $1;',
      [bet_id]
    );
    const answers = answerQueryRes.rows;
    const newLeaderboard = [];
    for (const { user_id, answer } of answers) {
      const scoreQueryRes = await db.query(
        'UPDATE scores SET score = score + $1 WHERE user_id = $2 AND event_id = $3 RETURNING user_id, score;',
        [answer === correct_answer ? points : 0, user_id, event_id]
      );
      newLeaderboard.push(scoreQueryRes.rows[0]);
    }
    res.locals.newLeaderboard = newLeaderboard;
    return next();
  } catch (e) {
    return next({
      log:
        'Express Caught eventController.updateCorrectAnswer middleware error' +
        e,
      message: {
        err: 'An error occurred when updating correct answer for a bet' + e,
      },
    });
  }
};

const setEventEnd = async (req, res, next) => {
  const { event_id } = req.params;
  try {
    await db.query('UPDATE events SET has_ended = $1 WHERE event_id = $2;', [
      true,
      event_id,
    ]);
    return next();
  } catch (e) {
    return next({
      log: 'Express Caught eventController.setEventEnd middleware error' + e,
      message: {
        err: 'An error occurred when setting an event to be "has_ended"' + e,
      },
    });
  }
};

const updateRanking = async (req, res, next) => {
  const { playerRanking } = req.body;
  try {
    for (const { user_id, place } of playerRanking) {
      await db.query(
        'UPDATE scores SET place = $1 WHERE user_id = $2 AND event_id = $3;',
        [place, user_id, event_id]
      );
    }
    return next();
  } catch (e) {
    return next({
      log: 'Express Caught eventController.updateRanking middleware error' + e,
      message: {
        err: 'An error occurred when updating ranking of an event' + e,
      },
    });
  }
};

const getQuestionnaire = async (req, res, next) => {
  const { event_id } = req.params;
  try {
    const betQueryRes = await db.query(
      'SELECT type, question, points FROM bets WHERE event_id = $1;',
      [event_id]
    );
    res.locals.questionnaire = betQueryRes.rows;
    return next();
  } catch (e) {
    return next({
      log:
        'Express Caught eventController.getQuestionnaire middleware error' + e,
      message: {
        err: 'An error occurred when getting the questionnaire of an event' + e,
      },
    });
  }
};

module.exports = {
  getLeaderboard,
  newEvent,
  newBet,
  updateCorrectAnswer,
  setEventEnd,
  getQuestionnaire,
  updateRanking,
};
