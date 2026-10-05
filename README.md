# ChatApp

A full-stack realtime chat app with a React client and a Node.js API. Users can register and sign in, join preset rooms, exchange persisted messages, and see room presence and typing activity.

## Implemented

- Registration and login with JWT authentication; passwords are hashed before storage.
- Protected REST endpoints for loading and sending messages.
- Authenticated Socket.IO connections with room joining, realtime message delivery, typing updates, and online user lists.
- Responsive React room UI with message history, room navigation, and connection status.

Private messaging, room creation, file sharing, and horizontal Socket.IO scaling are not implemented yet.

## Stack

- Frontend: React 19, Vite 8, React Router, Tailwind CSS 4, Socket.IO Client
- Backend: Node.js, Express 5, Socket.IO 4
- Persistence and authentication: MongoDB with Mongoose, bcrypt, and JWT

## Project Structure

- `frontend/`: Vite client; setup and routes are documented in [frontend/README.md](frontend/README.md)
- `backend/`: REST and Socket.IO server; see [backend/README.md](backend/README.md)
- `ARCHITECTURE.md`: implemented components, request flows, and current scaling limits

## Local Setup

MongoDB must be running locally or reachable through a MongoDB connection string. The backend requires Node.js 18.11 or newer. Vite 8 requires Node.js 20.19+ or 22.12+.

In the first terminal, configure and start the backend:

```powershell
cd backend
Copy-Item .env.example .env
# Set MONGODB_URI and replace JWT_SECRET in .env
npm install
npm run dev
```

In a second terminal, start the frontend:

```powershell
cd frontend
Copy-Item .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`. The frontend uses `http://localhost:4000` for the API by default; set `VITE_API_URL` in `frontend/.env` to change it. `CLIENT_ORIGIN` controls the backend's allowed browser origin.

## Roadmap

- Persist room definitions and support room creation and access rules.
- Add private messaging, file sharing, and push notifications.
- Add a Redis Socket.IO adapter for multi-instance presence and messaging.
- Add deployment configuration and automated integration tests.

