# Architecture Overview

## Current Scope

ChatApp is a single-backend-instance room chat application. The browser client is built with React, Vite, React Router, Tailwind CSS, and Socket.IO Client. The server uses Express, Socket.IO, Mongoose, MongoDB, JWT, and bcrypt.

## Components

- **Frontend**: `/login` and `/register` handle authentication; `/chat/:roomId` is protected and hosts the room UI. The current navigation contains `general`, `design`, `engineering`, and `random` rooms.
- **Auth API**: registration stores a bcrypt password hash and login returns a signed JWT. The client stores the session in local storage and sends the token as a bearer token for protected REST requests.
- **Chat API**: Express exposes message history and message-send endpoints. MongoDB stores messages with a room ID, sender reference, content, and timestamps.
- **Socket.IO**: connections are authenticated with the same JWT. Clients join a room before sending realtime messages. Socket sends persist to MongoDB before the server broadcasts `message:new`.
- **Presence and typing**: the socket service publishes deduplicated room users on join/disconnect and relays typing state to other members of the room.
- **Persistence**: MongoDB stores users and messages. There is no persistent room model; room IDs are strings and the frontend currently supplies a fixed list.

## Message Flow

1. A client registers or logs in over REST and receives a JWT.
2. It loads room history over the protected REST API and connects to Socket.IO with the JWT.
3. It emits `room:join`; the server joins the socket and broadcasts the updated `room:users` list.
4. It emits `message:send`; the server validates room membership, stores the message, then broadcasts `message:new`.
5. Typing state is sent with `room:typing` and relayed to other sockets in that room.

REST message sends are also persisted and broadcast to currently connected sockets in the target room.

## Security and Operations

- Passwords are hashed with bcrypt; password hashes are excluded from normal user queries and selected explicitly during login.
- REST message routes and Socket.IO connections require a valid JWT.
- Configure `JWT_SECRET`, `MONGODB_URI`, and `CLIENT_ORIGIN` in the backend environment.
- Presence currently uses the local Socket.IO server's connected sockets. There is no Redis adapter, so online-user lists and room broadcasts are not shared across multiple backend instances.
- Room IDs do not currently have ownership, membership, or access-control rules beyond requiring a client to join the room before sending over its socket.

## Planned Extensions

- Persist room definitions and enforce room membership/access rules.
- Add private messaging, file sharing, push notifications, and end-to-end encryption.
- Add a Redis Socket.IO adapter and deployment configuration for horizontal scaling.
- Add automated API and realtime integration tests.
