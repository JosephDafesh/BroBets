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

module.exports = { getLeaderboard };
