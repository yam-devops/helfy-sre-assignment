const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'tidb',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'app',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 4000,
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;

