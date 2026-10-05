const User = require('../models/User');
const { verifyToken } = require('../services/tokenService');

async function authenticate(req, res, next) {
  try {
    const authorization = req.headers.authorization || '';
    const [scheme, token] = authorization.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const payload = verifyToken(token);
    const user = await User.findById(payload.sub).select('_id username email');
    if (!user) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = authenticate;