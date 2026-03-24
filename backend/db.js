const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS request_logs (
      id SERIAL PRIMARY KEY,
      method VARCHAR(10),
      endpoint VARCHAR(255),
      status_code INT,
      response_time INT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
};

module.exports = { pool, initDB };