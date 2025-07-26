# Simple Todo App

A very simple Todo application with a React (Vite) frontend and a Node.js (Express) backend.

## Features

### Frontend (React + Vite)
- Login page (email & password)
- Display a list of todos
- Add a todo
- Edit a todo
- Delete a todo
- State management with Zustand
- Routing with React Router
- API calls with Axios

### Backend (Node.js + Express)
- `POST /login` — Simulates authentication, returns a fake JWT token
- `GET /todos` — Returns a list of todos (in-memory)
- `POST /todos` — Adds a new todo
- `PUT /todos/:id` — Edits an existing todo
- `DELETE /todos/:id` — Deletes a todo
- All data is stored in memory (no database)

## Project Structure

```
frontend/   # React app (Vite)
backend/    # Express API
```

## Getting Started

### 1. Start the backend
```sh
cd backend
npm install
node index.js
```
The backend will run on http://localhost:3001

### 2. Start the frontend
```sh
cd frontend
npm install
npm run dev
```
The frontend will run on http://localhost:5173 (or another port if 5173 is busy)

## Usage
- Open the frontend in your browser.
- Log in with any email and password (authentication is simulated).
- Manage your todos (add, edit, delete).

## API Endpoints

### POST /login
Request: `{ "email": "string", "password": "string" }`
Response: `{ "token": "string" }`

### GET /todos
Headers: `Authorization: Bearer <token>`
Response: `[ { id, text, done } ]`

### POST /todos
Headers: `Authorization: Bearer <token>`
Request: `{ "text": "string" }`
Response: `{ id, text, done }`

### PUT /todos/:id
Headers: `Authorization: Bearer <token>`
Request: `{ "text": "string", "done": true|false }`
Response: `{ id, text, done }`

### DELETE /todos/:id
Headers: `Authorization: Bearer <token>`
Response: `204 No Content`

---

**Note:** This app is for demo purposes only. All data is lost when the backend restarts.
