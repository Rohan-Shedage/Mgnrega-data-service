# Mgnrega - React + Vite + Tailwind (Vercel-ready)

This project contains a MGNREGA district performance dashboard built with React + Vite + Tailwind.

## Features
- API-ready: `src/api.js` uses `VITE_API_BASE_URL` environment variable.
- Graceful fallback to mock data if API endpoints are not available.
- Tailwind CSS for styling.
- Vercel deployment friendly.

## Quick start
1. Install dependencies:
```bash
npm install
```
2. Run locally:
```bash
npm run dev
```
3. Build for production:
```bash
npm run build
```

## API Contract (expected endpoints)
- `GET /api/districts` -> returns `[{ id, name, lat, lng }, ...]`
- `GET /api/districts/:id` -> returns:
```json
{
  "current": { "month": "...", "households": 0, "personDays": 0, "activeWorks": 0, "completedWorks": 0, "expenditure": 0, "avgWage": 0, "womenParticipation": 0, "performanceScore": 0, "lastUpdated": "..." },
  "historical": [{ "month": "May", "households": 12345, "score": 78 }, ...]
}
```

## Vercel
- Set `VITE_API_BASE_URL` in Project Environment Variables (if your API is hosted elsewhere).
- Build command: `npm run build`
- Output directory: `dist`

