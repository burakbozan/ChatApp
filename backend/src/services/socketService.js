const { Server } = require('socket.io');
const User = require('../models/User');
const messageService = require('./messageService');
const { verifyToken } = require('./tokenService');

function initializeSocket(server) {
  const io = new Server(server, {
    cors: { origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000' }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (typeof token !== 'string') return next(new Error('Authentication required'));

      const payload = verifyToken(token);
      const user = await User.findById(payload.sub).select('_id username');
      if (!user) return next(new Error('Invalid or expired token'));

      socket.user = user;
      return next();
    } catch {
      return next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    socket.on('room:join', (roomId, acknowledge = () => {}) => {
      if (typeof roomId !== 'string' || !roomId.trim() || roomId.length > 128) {
        return acknowledge({ error: 'A valid roomId is required' });
      }

      const normalizedRoomId = roomId.trim();
      socket.join(normalizedRoomId);
      return acknowledge({ roomId: normalizedRoomId });
    });

    socket.on('message:send', async (data, acknowledge = () => {}) => {
      try {
        const roomId = data?.roomId;
        const content = data?.content;
        if (typeof roomId !== 'string' || !socket.rooms.has(roomId.trim())) {
          return acknowledge({ error: 'Join the room before sending messages' });
        }
        if (typeof content !== 'string' || !content.trim() || content.trim().length > 5000) {
          return acknowledge({ error: 'Message content must be between 1 and 5000 characters' });
        }

        const message = await messageService.createMessage({
          roomId: roomId.trim(),
          content: content.trim(),
          user: socket.user
        });
        io.to(message.roomId).emit('message:new', message);
        return acknowledge({ message });
      } catch (error) {
        console.error('Could not send socket message:', error.message);
        return acknowledge({ error: 'Could not send message' });
      }
    });
  });

  return io;
}

module.exports = initializeSocket;