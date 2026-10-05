# ChatApp Frontend

React 19 client built with Vite 8, React Router, Tailwind CSS 4, and Socket.IO Client.

## Requirements and Setup

Vite 8 requires Node.js 20.19+ or 22.12+. Start the backend first if you want to sign in or use realtime chat.

From this directory, copy `.env.example` to `.env`, then install and start the development server:

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

The app is served at `http://localhost:5173` by default.

## Configuration

- `VITE_API_URL`: backend origin; defaults to `http://localhost:4000`

The backend's `CLIENT_ORIGIN` must allow the frontend origin. See [the backend guide](../backend/README.md) for server setup and API details.

## Routes

- `/login`: sign in with email and password
- `/register`: create an account with username, email, and password
- `/chat/:roomId`: authenticated room view

The current room navigation is a fixed list: `general`, `design`, `engineering`, and `random`. The session JWT and user profile are stored in browser local storage. Protected REST calls and the Socket.IO handshake use that token.

## Chat Events

The room view loads message history over REST and connects to Socket.IO. It joins the selected room, sends new messages with `message:send`, and listens for `message:new`, `room:users`, and `room:typing`. The backend persists messages and requires a running MongoDB instance.

## Scripts

- `npm run dev`: start Vite's development server
- `npm run lint`: run ESLint
- `npm run build`: create a production build in `dist/`
- `npm run preview`: preview the production build
