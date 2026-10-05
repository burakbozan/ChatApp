# ChatApp Backend

Node.js API for registration, login, and realtime room messaging. MongoDB stores users and messages; JWTs authenticate REST and Socket.IO connections.

## Requirements

- Node.js 18 or newer
- MongoDB running locally or a MongoDB connection string

## Run

1. Copy `.env.example` to `.env` and set `MONGODB_URI` and a long random `JWT_SECRET`.
2. Install dependencies with `npm install`.
3. Start the development server with `npm run dev` (or `npm start`).

The API listens on `http://localhost:4000` by default. `GET /health` checks that the HTTP server is responding.

## REST API

- `POST /api/chat/register` with `{ "username", "email", "password" }`
- `POST /api/chat/login` with `{ "email", "password" }`
- `GET /api/chat/messages?roomId=general&limit=50` (JWT required)
- `POST /api/chat/messages` with `{ "roomId", "content" }` (JWT required)

Pass the returned token as `Authorization: Bearer <token>` for protected routes.

## Socket.IO

Connect with the JWT in the Socket.IO auth payload: `{ auth: { token } }`. Emit `room:join` with a room ID; after joining, emit `message:send` with `{ "roomId", "content" }`. Both events accept an acknowledgement callback. New persisted messages are broadcast as `message:new` to all sockets in that room.

Clients can emit `room:typing` with `{ "roomId", "isTyping" }`; other room members receive the same event with the typing user's `{ "id", "username" }`. The server broadcasts `room:users` with the deduplicated online users whenever someone joins or leaves a room.