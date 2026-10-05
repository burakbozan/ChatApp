# ChatApp Backend

Express REST API and Socket.IO server for user authentication and persisted room messaging.

## Requirements and Setup

- Node.js 18.11 or newer
- MongoDB running locally or a MongoDB connection string

From this directory, copy `.env.example` to `.env`, set `MONGODB_URI`, and replace `JWT_SECRET` with a long random value. Then run:

```powershell
npm install
npm run dev
```

`npm run dev` uses Node's built-in watch mode. Use `npm start` to run without watch mode. The server listens on port `4000` by default; set `PORT` to change it. `GET /health` returns `{ "status": "ok" }` when the HTTP server is running.

## Environment

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: signing secret for access tokens
- `JWT_EXPIRES_IN`: token lifetime; defaults to `7d`
- `PORT`: HTTP port; defaults to `4000`
- `CLIENT_ORIGIN`: allowed browser origin for REST and Socket.IO CORS; defaults to `http://localhost:5173`

## REST API

| Method | Path | Authentication | Request |
| --- | --- | --- | --- |
| `POST` | `/api/chat/register` | None | `{ "username": "Jordan", "email": "jordan@example.com", "password": "at-least-8-chars" }` |
| `POST` | `/api/chat/login` | None | `{ "email": "jordan@example.com", "password": "at-least-8-chars" }` |
| `GET` | `/api/chat/messages?roomId=general&limit=50` | Bearer JWT | `roomId` required; `limit` defaults to 50 and is capped at 100 |
| `POST` | `/api/chat/messages` | Bearer JWT | `{ "roomId": "general", "content": "Hello" }` |

Registration and login return `{ "token", "user": { "id", "username", "email" } }`. Send the token in `Authorization: Bearer <token>` for protected routes. Message history is returned in chronological order. REST message sends are persisted and broadcast to connected sockets in that room.

## Socket.IO Events

Connect with the JWT in the Socket.IO auth payload: `{ auth: { token } }`.

| Direction | Event | Payload | Behavior |
| --- | --- | --- | --- |
| Client to server | `room:join` | Room ID string | Joins the room; acknowledgement returns `{ "roomId" }` or `{ "error" }` |
| Client to server | `message:send` | `{ "roomId", "content" }` | Requires room membership; persists then broadcasts the message; acknowledgement returns `{ "message" }` or `{ "error" }` |
| Client to server | `room:typing` | `{ "roomId", "isTyping" }` | Relays typing state to other sockets in the joined room |
| Server to client | `message:new` | Persisted message | Broadcast to all sockets in the room, including the sender |
| Server to client | `room:users` | Array of `{ "id", "username" }` | Deduplicated online members, broadcast after room joins and disconnects |
| Server to client | `room:typing` | `{ "user": { "id", "username" }, "isTyping" }` | Typing update from another room member |

There is no Redis adapter or persistent room model yet. Presence and room broadcasts currently belong to this server instance.