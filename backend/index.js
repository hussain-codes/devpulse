const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { initDB, pool } = require('./db');
const apiRoutes = require('./routes/api');

const app = express();
app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  const start = Date.now();
  res.on('finish', async () => {
    const duration = Date.now() - start;
    try {
      await pool.query(
        'INSERT INTO request_logs (method, endpoint, status_code, response_time) VALUES ($1, $2, $3, $4)',
        [req.method, req.path, res.statusCode, duration]
      );
    } catch (e) {}
  });
  next();
});

app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;

initDB().then(() => {
  app.listen(PORT, () => console.log(`DevPulse API running on port ${PORT}`));
});