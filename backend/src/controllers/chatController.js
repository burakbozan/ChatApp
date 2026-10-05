const User = require('../models/User');
const messageService = require('../services/messageService');
const { createToken } = require('../services/tokenService');

async function register(req, res, next) {
  try {
    const username = req.body.username?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!username || !email || typeof password !== 'string') {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: 'Email or username is already in use' });
    }

    const user = await User.create({ username, email, password });
    const token = createToken(user);

    return res.status(201).json({
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Email or username is already in use' });
    }
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!email || typeof password !== 'string') {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.json({
      token: createToken(user),
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    return next(error);
  }
}

async function getMessages(req, res, next) {
  try {
    const roomId = req.query.roomId;
    if (typeof roomId !== 'string' || !roomId.trim()) {
      return res.status(400).json({ message: 'roomId is required' });
    }

    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 50, 1), 100);
    const messages = await messageService.getMessages(roomId.trim(), limit);
    return res.json({ messages });
  } catch (error) {
    return next(error);
  }
}

async function sendMessage(req, res, next) {
  try {
    const { roomId, content } = req.body;
    if (typeof roomId !== 'string' || !roomId.trim() || typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ message: 'roomId and content are required' });
    }

    const message = await messageService.createMessage({
      roomId: roomId.trim(),
      content: content.trim(),
      user: req.user
    });

    req.app.get('io').to(message.roomId).emit('message:new', message);
    return res.status(201).json({ message });
  } catch (error) {
    return next(error);
  }
}

module.exports = { register, login, getMessages, sendMessage };