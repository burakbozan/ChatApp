const jwt = require('jsonwebtoken');

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  return secret;
}

function createToken(user) {
  return jwt.sign(
    { username: user.username },
    getSecret(),
    { subject: user.id, expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function verifyToken(token) {
  return jwt.verify(token, getSecret());
}

module.exports = { createToken, verifyToken };