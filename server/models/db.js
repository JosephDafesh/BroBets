const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.PG_URI,
});

module.exports = {
  query: (text, params) => {
    console.log('executed query', text);
    return pool.query(text, params).catch((e) => {
      console.error('Error executing query', e.stack);
      throw e;
    });
  },
  end: pool.end,
};