const { Server } = require('socket.io');
const User = require('../models/User');
const messageService = require('./messageService');
const { verifyToken } = require('./tokenService');

async function broadcastRoomUsers(io, roomId) {
  const sockets = await io.in(roomId).fetchSockets();
  const users = [...new Map(
    sockets
      .filter((socket) => socket.data.user)
      .map((socket) => [socket.data.user.id, socket.data.user])
  ).values()];

  io.to(roomId).emit('room:users', users);
}

function initializeSocket(server) {
  const io = new Server(server, {
    cors: { origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (typeof token !== 'string') return next(new Error('Authentication required'));

      const payload = verifyToken(token);
      const user = await User.findById(payload.sub).select('_id username');
      if (!user) return next(new Error('Invalid or expired token'));

      socket.user = user;
      socket.data.user = { id: user.id, username: user.username };
      socket.data.roomIds = new Set();
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
      socket.data.roomIds.add(normalizedRoomId);
      broadcastRoomUsers(io, normalizedRoomId).catch((error) => {
        console.error('Could not update room presence:', error.message);
      });
      return acknowledge({ roomId: normalizedRoomId });
    });

    socket.on('room:typing', (data) => {
      const roomId = data?.roomId;
      if (typeof roomId !== 'string' || !socket.rooms.has(roomId.trim())) return;

      socket.to(roomId.trim()).emit('room:typing', {
        user: socket.data.user,
        isTyping: Boolean(data.isTyping)
      });
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

    socket.on('disconnect', () => {
      for (const roomId of socket.data.roomIds) {
        socket.to(roomId).emit('room:typing', {
          user: socket.data.user,
          isTyping: false
        });
        broadcastRoomUsers(io, roomId).catch((error) => {
          console.error('Could not update room presence:', error.message);
        });
      }
    });
  });

  return io;
}

module.exports = initializeSocket;