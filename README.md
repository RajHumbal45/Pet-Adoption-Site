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

If `5173` is already busy, Vite will move to the next open port automatically.

## Environment

Create local environment files before running the app:

- `backend/.env` based on `backend/.env.example`
- `frontend/.env` based on `frontend/.env.example`

`ADMIN_SETUP_KEY` is optional and only needed if you want registration to mint an admin account.
Run MongoDB locally on `mongodb://127.0.0.1:27017/pet_adoption` for seeded pet data and adoption flows.

## Auth Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/auth/admin-check`

## Pet Endpoints

- `GET /api/pets`
- `GET /api/pets/:id`
- `GET /api/pets/admin/all`
- `POST /api/pets`
- `PUT /api/pets/:id`
- `PATCH /api/pets/:id/status`
- `DELETE /api/pets/:id`

## Adoption Endpoints

- `POST /api/adoptions`
- `GET /api/adoptions/me`
- `GET /api/adoptions/admin/all`
- `PATCH /api/adoptions/:id/status`
