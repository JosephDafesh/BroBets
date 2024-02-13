const db = require('../models/db.js');

const getLeaderboard = async (req, res, next) => {
  const { eventId } = req.params;
  try {
    const scoreQueryRes = await db.query(
      'SELECT * FROM scores WHERE event_id = $1;',
      [eventId]
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

const newEvent = async (req, res, next) => {
  const { userId } = req.params;
  const { event_title, final_bets_in } = req.body;
  return db
    .query(
      'INSERT INTO events ' +
        '(event_title, final_bets_in, has_ended, admin, total_points) ' +
        'VALUES($1, $2, $3, $4, $5) ' +
        'RETURNING *;',
      [event_title, final_bets_in, false, userId, 0]
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

module.exports = { getLeaderboard, newEvent };
