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
        'VALUES($1, $2, $3, $4, $5, $6) RETURNING event_id;',
      [event_title, last_call, false, user_id, 0, new Date().toISOString()]
    )
    .then((data) => {
      console.log('newEvent rows:', data.rows);
      res.locals.newEvent_id = data.rows[0];
      console.log('newEvent:', res.locals.newEvent);
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
    const newBetData = await db.query(
      `INSERT INTO bets 
        (event_id, type, question, points)
        VALUES($1, $2, $3, $4)
        RETURNING *;`,
      [event_id, type, question, points]
    );
    res.locals.newBet = newBetData.rows[0];
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

const getEventTitleAndCreator = async (req, res, next) => {
  const { event_id } = req.params;
  try {
    const eventQueryRes = await db.query(
      'SELECT event_title, admin FROM events where event_id = $1;',
      [event_id]
    );
    const { event_title, admin } = eventQueryRes.rows[0];
    const userQueryRes = await db.query(
      'SELECT first_name, last_name FROM users WHERE user_id = $1;',
      [admin]
    );
    const { first_name, last_name } = userQueryRes.rows[0];
    res.locals.eventTitleAndCreator = {
      title: event_title,
      creator: `${first_name} ${last_name}`,
    };
    return next();
  } catch (e) {
    return next({
      log:
        'Express Caught eventController.getEventTitleAndCreator middleware error' +
        e,
      message: {
        err:
          'An error occurred when getting the title and creator of an event' +
          e,
      },
    });
  }
};

const getQuestionnaire = async (req, res, next) => {
  const { event_id } = req.params;
  try {
    const betQueryRes = await db.query(
      'SELECT type, question, points, bet_id FROM bets WHERE event_id = $1;',
      [event_id]
    );
    res.locals.questionnaire = betQueryRes.rows;
    console.log(res.locals.questionnaire);
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
      'SELECT last_call FROM events WHERE event_id = $1;',
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
        'SELECT event_title, created_at, has_ended, total_points, players_count, last_call ' +
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

const checkDuplicateUserInEvent = async (req, res, next) => {
  const { user_id, event_id } = req.params;
  try {
    const scoreQueryRes = await db.query(
      'SELECT * FROM scores WHERE user_id = $1 AND event_id = $2;',
      [user_id, event_id]
    );
    if (scoreQueryRes.rows.length > 0)
      return res
        .status(400)
        .send({ message: 'You have already joined the event.' });
    return next();
  } catch (e) {
    return next({
      log:
        'Express Caught eventController.checkDuplicateUserInEvent middleware error' +
        e,
      message: {
        err:
          'An error occurred when checking if a user has participated in an event' +
          e,
      },
    });
  }
};

const getAdminEvents = async (req, res, next) => {
  const { user_id } = req.params;
  try {
    const eventsQueryRes = await db.query(
      'SELECT * FROM events WHERE admin = $1;',
      [user_id]
    );
    const adminEvents = eventsQueryRes.rows;
    res.locals.adminEvents = [];
    for (const adminEvent of adminEvents) {
      const scoreQueryRes = await db.query(
        'SELECT * FROM scores WHERE user_id = $1 AND event_id = $2;',
        [user_id, adminEvent.event_id]
      );
      res.locals.adminEvents.push({ ...adminEvent, ...scoreQueryRes.rows[0] });
    }
    return next();
  } catch (e) {
    return next({
      log: 'Express Caught eventController.getAdminEvents middleware error' + e,
      message: {
        err: 'An error occurred when getting admin events for a user' + e,
      },
    });
  }
};

const deleteEvent = async (req, res, next) => {
  console.log('deleteEvent')
  const { event_id } = req.params;
  try {
    await db.query('DELETE FROM events WHERE event_id = $1;', [event_id]);
    res.locals.message = 'Event deleted successfully';
    return next();
  } catch (e) {
    console.error('Delete event error:', e);
    return next({
      log: 'Express Caught eventController.deleteEvent middleware error' + e,
      message: {
        err: 'An error occurred when deleting an event' + e,
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
  getEventTitleAndCreator,
  checkDuplicateUserInEvent,
  getAdminEvents,
  deleteEvent,
};
