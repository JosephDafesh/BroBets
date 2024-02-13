const db = require('../models/db.js');

const getLeaderboard = async (req, res, next) => {
  const { event_id } = req.params;
  try {
    const scoreQueryRes = await db.query(
      'SELECT * FROM scores WHERE event_id = $1;',
      [event_id]
    );
    res.locals.leaderboard = scoreQueryRes.rows[0];
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
    .then((data) => {
      res.locals.newEvent = data.rows[0];
      return next();
    })
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

const postAnswers = async (req, res, next) => {
  const { user_id, nickname, event_id, answers } = req.body;

  try {
    // Check if missed last_call
    const eventQueryRes = await db.query(
      'SELECT last_call FROM events WHERE events_id = $1;',
      [event_id]
    );
    const { last_call } = eventQueryRes.rows[0];
    if (Date.now() > new Date(last_call).getTime()) {
      return res.status(400).send({ message: 'You missed the last call.' });
    }

    // Update the players_count in events table
    await db.query(
      'UPDATE events SET players_count = players_count + 1 WHERE event_id = $1;',
      [event_id]
    );

    // Insert a row in scores
    await db.query(
      'INSERT INTO scores (user_id, nickname, event_id) ' +
        'VALUES( $1, $2, $3);',
      [user_id, nickname, event_id]
    );

    // Insert into answers table
    for (const { bet_id, answer } of answers) {
      await db.query(
        'INSERT INTO answers (user_id, bet_id, answer) ' +
          'VALUES($1, $2, $3);',
        [user_id, bet_id, answer]
      );
    }
    return next();
  } catch (e) {
    return next({
      log: 'Express Caught eventController.postAnswers middleware error' + e,
      message: {
        err: 'An error occurred when getting the postAnswers of an event' + e,
      },
    });
  }
};

const getEventsForUser = async (req, res, next) => {
  const { user_id } = req.params;
  try {
    const scoreQueryRes = await db.query(
      'SELECT * FROM scores WHERE user_id = $1;',
      [user_id]
    );
    const events = scoreQueryRes.rows;
    res.locals.events = [];
    for (const { event_id } of events) {
      const eventQueryRes = await db.query(
        'SELECT event_title, created_at, has_ended, total_points, players_count ' +
          'FROM events WHERE event_id = $1;',
        [event_id]
      );
      const event = events.find((item) => (item.event_id = event_id));
      res.locals.events.push({ ...event, ...eventQueryRes.rows[0] });
    }
    return next();
  } catch (e) {
    return next({
      log:
        'Express Caught eventController.getEventsForUser middleware error' + e,
      message: {
        err: 'An error occurred when getting events that user participated' + e,
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
  postAnswers,
  getEventsForUser,
};
