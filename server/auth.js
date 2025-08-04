const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'mysecret';

function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1h' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}

module.exports = { generateToken, verifyToken };

