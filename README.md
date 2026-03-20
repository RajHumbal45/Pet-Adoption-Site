# Pet Adoption Management System

Monorepo starter for a MERN pet adoption platform with separate `frontend` and `backend` apps.

## Apps

- `frontend`: Vite + React client
- `backend`: Express API

## Quick Start

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` and backend runs on `http://localhost:5000`.

## Environment

Create local environment files before running the app:

- `backend/.env` based on `backend/.env.example`
- `frontend/.env` based on `frontend/.env.example`

`ADMIN_SETUP_KEY` is optional and only needed if you want registration to mint an admin account.

## Auth Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/auth/admin-check`
