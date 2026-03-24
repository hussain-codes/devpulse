const express = require('express');
const router = express.Router();
const { pool } = require('../db');

const startTime = Date.now();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: Math.floor((Date.now() - startTime) / 1000) });
});

router.get('/stats', async (req, res) => {
  const total = await pool.query('SELECT COUNT(*) FROM request_logs');
  const byEndpoint = await pool.query(`
    SELECT endpoint, COUNT(*) as hits
    FROM request_logs
    GROUP BY endpoint
    ORDER BY hits DESC
    LIMIT 10
  `);
  const avgResponse = await pool.query('SELECT AVG(response_time) as avg FROM request_logs');
  const recentRequests = await pool.query(`
    SELECT method, endpoint, status_code, response_time, created_at
    FROM request_logs
    ORDER BY created_at DESC
    LIMIT 10
  `);
  res.json({
    total_requests: parseInt(total.rows[0].count),
    uptime: Math.floor((Date.now() - startTime) / 1000),
    avg_response_time: Math.round(avgResponse.rows[0].avg || 0),
    endpoints: byEndpoint.rows,
    recent: recentRequests.rows,
  });
});

router.get('/logs', async (req, res) => {
  const logs = await pool.query(`
    SELECT * FROM request_logs ORDER BY created_at DESC LIMIT 50
  `);
  res.json(logs.rows);
});

module.exports = router;