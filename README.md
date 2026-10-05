# ChatApp

| Project | Language/Stack | Why It’s Popular | Difficulty |
| --- | --- | --- | --- |
| **Chat App (Realtime)** | JavaScript/TypeScript + Node.js + React | WebSockets, frontend/backend integration | Intermediate |

# Realtime Chat App

A modern chat application with real-time messaging, built using Node.js, React, and WebSockets.

## 🚀 Features
- User registration & JWT authentication
- Real-time messaging with Socket.IO
- Chat rooms & private messaging
- Message persistence with MongoDB
- Typing indicators & online status
- Docker-ready deployment

## 🛠️ Tech Stack
- Frontend: React + Vite/Next.js
- Backend: Node.js + Express + Socket.IO
- Database: MongoDB, Redis (optional for scaling)
- Auth: JWT/OAuth2
- Deployment: Docker, Kubernetes-ready

## Project Structure
- `backend/`: Express REST API, MongoDB models, JWT auth, and Socket.IO messaging
- `frontend/`: React + Vite chat client with Tailwind CSS
- `ARCHITECTURE.md`: application architecture overview

## Getting Started
Use Node.js 20.19 or newer for Vite and start each app in a separate terminal.

### Backend
1. In `backend/`, copy `.env.example` to `.env` and configure MongoDB and a long random `JWT_SECRET`.
2. Run `npm install`, then `npm run dev`.

### Frontend
1. In `frontend/`, copy `.env.example` to `.env`.
2. Run `npm install`, then `npm run dev`.

The frontend opens at `http://localhost:5173` and connects to the API at `http://localhost:4000` by default. See [backend/README.md](backend/README.md) for API and Socket.IO details.

## 📌 Roadmap
- [ ] Add file sharing
- [ ] Push notifications
- [ ] Role-based access
- [ ] CI/CD pipeline

