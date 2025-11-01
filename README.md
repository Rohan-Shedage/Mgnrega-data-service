
## Backend (Express + MySQL)

A simple Express backend has been added under `/server`.
- Run backend locally:
  ```bash
  cd server
  npm install
  cp .env.example .env   # then edit .env with your DB credentials
  npm run dev
  ```
- API endpoints:
  - `GET /api/districts`
  - `GET /api/districts/:id`
- The backend uses `mysql2/promise` pool and expects a `districts` table. Adjust queries in `server/routes/api.js` as needed.

## Deploying Backend on Vercel or Render
- Vercel: Deploy as a separate Serverless Function or use a Platform like Render/Heroku for persistent server.
- Set DB credentials as environment variables in your hosting provider.
