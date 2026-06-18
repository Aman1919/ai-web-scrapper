# AI Web Scraper

AI Web Scraper finds businesses from Google Maps through SerpApi, visits each business website with Playwright, extracts contact details, and shows the results in a React frontend.

## Features

- Search businesses by query, for example `Technology companies in delhi`.
- Fetch Google Maps business data using SerpApi.
- Scrape each listed website for phone numbers and email addresses.
- Show results in a frontend table.
- Load saved sample results instantly with the **Test Data** button.

## Project Structure

```txt
backend/
  index.js       Node API server
  test.js        Original scraping experiment and large sample data
  results.csv    Saved sample results used by Test Data

client/
  src/App.jsx    React UI
  src/index.css  Styles
```

## Backend API

Base URL in local development:

```txt
http://localhost:5000
```

### Live Search

```txt
GET /api/search?query=Technology%20companies%20in%20delhi
```

Optional query params:

- `query` or `q`: business search query.
- `ll`: SerpApi Google Maps location string. Defaults to Delhi.
- `limit`: number of results to process. Maximum is 20.

### Test Data

```txt
GET /api/test-results
```

This loads `backend/results.csv` immediately, so the frontend can preview the table without waiting for live scraping.

### Health Check

```txt
GET /api/health
```

## Response Format

Both live search and test data return this shape:

```json
{
  "query": "Technology companies in delhi",
  "count": 20,
  "results": [
    {
      "name": "Business name",
      "phone_maps": "Phone from Google Maps",
      "phone_website": "Phone scraped from website",
      "email": "Email scraped from website",
      "website": "https://example.com",
      "rating": 4.8,
      "reviews": 52,
      "address": "Business address",
      "type": "Software company",
      "hours": "Open 24 hours"
    }
  ]
}
```

## Local Setup

Install backend dependencies:

```bash
cd backend
npm install
```

Start the backend:

```bash
SERPAPI_KEY=your_serpapi_key npm start
```

Install frontend dependencies:

```bash
cd client
npm install
```

Start the frontend:

```bash
npm run dev
```

Open the Vite URL shown in the terminal, usually:

```txt
http://localhost:5173
```

## Environment Variables

Backend:

```txt
SERPAPI_KEY=your_serpapi_key
PORT=5000
HOST=127.0.0.1
SERPAPI_LL=@28.6139,77.2090,12z
```

Frontend:

```txt
VITE_API_BASE_URL=http://localhost:5000
```

Only `SERPAPI_KEY` is required for live scraping. The **Test Data** button works from the saved CSV file.

## Deployment Notes

The frontend can be deployed on Vercel for free on the Hobby plan.

The backend should not be deployed to Vercel in its current form because it is a long-running Node server using `server.listen(...)`, and the live scraper uses Playwright with Chromium. Vercel is optimized for serverless functions, and Playwright browser binaries can be large and slow for that environment.

Recommended setup:

- Deploy `client/` on Vercel.
- Deploy `backend/` on Render, Railway, Fly.io, Google Cloud Run, Replit, or a VPS.
- Set `VITE_API_BASE_URL` in Vercel to the deployed backend URL.
- Set `SERPAPI_KEY` on the backend host.

If you want everything on Vercel, the backend would need to be rewritten as Vercel serverless functions, and the Playwright scraping part may need a remote browser service such as Browserless.

## Useful Commands

Check backend syntax:

```bash
cd backend
node --check index.js
```

Build frontend:

```bash
cd client
npm run build
```
