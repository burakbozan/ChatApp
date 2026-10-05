const Message = require('../models/Message');

async function getMessages(roomId, limit) {
  const messages = await Message.find({ roomId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('sender', 'username');

  return messages.reverse();
}

async function createMessage({ roomId, content, user }) {
  const message = await Message.create({ roomId, content, sender: user._id });
  return message.populate('sender', 'username');
}

module.exports = { getMessages, createMessage };