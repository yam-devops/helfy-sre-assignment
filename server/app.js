const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const log4js = require('log4js');
const pool = require('./db');
const { generateToken, verifyToken } = require('./auth');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const logger = log4js.getLogger();
logger.level = 'info';

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = rows[0];
    const token = generateToken(user);

    // Log login
    logger.info(JSON.stringify({ timestamp: new Date(), userId: user.id, action: 'login', ip }));

    // Save token in DB
    await pool.query('INSERT INTO tokens (user_id, token) VALUES (?, ?)', [user.id, token]);

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/profile', async (req, res) => {
  const token = req.headers['authorization'];
  const decoded = verifyToken(token);

  if (!decoded) return res.status(403).json({ error: 'Invalid token' });

  try {
    const [rows] = await pool.query('SELECT id, email FROM users WHERE id = ?', [decoded.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));

