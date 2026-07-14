# Lead Extractor

A lead-generation tool that scrapes business listings from **Google Maps** and **JustDial**, optionally follows each business's website to pull contact info (email, phone, address, opening hours), and shows everything in a live-updating dashboard with CSV export.

## How it works

```
React dashboard  →  Express API  →  in-memory job store  →  Playwright/Crawlee scrapers
   (poll every        (POST /api/scrape        (JobManager)      (Google Maps / JustDial)
    1.5s)               starts job,
                        returns immediately)
```

1. You pick a source (Maps or JustDial), a query, and a target count in the dashboard.
2. The API creates a job and kicks off the scrape **in the background** — the HTTP request returns instantly with a job ID.
3. The frontend polls `GET /api/scrape/:id/logs` and `GET /api/scrape/:id` every 1.5s to stream logs and update status/results live.
4. Once the job completes, results show in a table and can be downloaded as CSV.

Jobs currently live in server memory (a `Map`), so they don't survive a server restart. This is intentional for now — see [Roadmap](#roadmap).

## Project structure

```
backend/
  scrapers/
    googleMapsScraper.js   # Pass 1: collect place URLs → Pass 2: scrape each place + its website
    justdialScraper.js     # Pass 1: collect listing URLs → Pass 2: scrape each listing
  jobs/
    jobManager.js          # In-memory job store (status, logs, results) + EventEmitter
  routes/
    scrape.js              # POST /api/scrape, GET /api/scrape/:id, /logs, /csv
  server.js                # Express app entry point (port 4000)

frontend/
  ScraperDashboard.jsx      # React + Tailwind dashboard: form, live log terminal, results table
```

## What each scraper does

### Google Maps (`googleMapsScraper.js`)
- **Pass 1** — searches Maps for the query, scrolls the results feed, collects place URLs up to `targetCount`.
- **Pass 2** — visits each place page, extracts name / address / phone / website / rating from the Maps listing itself.
- **Website pass** (when `scrapeWebsites: true`, the default) — for each place with a website, opens it in a second tab and extracts:
  - `websiteEmail`, `websitePhone`, `websiteAddress`, `websiteHours`
  - Tries `mailto:`/`tel:` links and schema.org markup first, falls back to regex over page text, and checks a "contact" page if key fields are still missing.
  - Each field independently resolves to a real value or one of: `No website`, `Site unreachable`, `Not found` — so a partial failure on one field doesn't wipe out the rest.
- Also unwraps Google's `/url?q=...` redirect wrapper so the `website` column contains the real URL, not a Google tracking link.

### JustDial (`justdialScraper.js`)
- **Pass 1** — scrolls a JustDial category search page, collects listing URLs.
- **Pass 2** — visits each listing, extracts name / phone / rating / address / website / GSTIN / categories / years in business / business summary.

## Setup

### Prerequisites
- Node.js 18+
- Chromium (installed automatically by Playwright, see below)

### 1. Backend

```bash
cd backend
npm init -y
npm install express cors crawlee playwright
npx playwright install chromium

node server.js
# → Server running on http://localhost:4000
```

### 2. Frontend

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install -D tailwindcss @tailwindcss/vite
```

In `vite.config.js`, add the Tailwind plugin:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

In `src/index.css`, replace contents with:
```css
@import "tailwindcss";
```

Copy `ScraperDashboard.jsx` into `src/`, then in `src/App.jsx`:
```jsx
import ScraperDashboard from './ScraperDashboard'

function App() {
  return <ScraperDashboard />
}

export default App
```

```bash
npm run dev
# → http://localhost:5173
```

The dashboard talks to `http://localhost:4000/api` — update `API_BASE` at the top of `ScraperDashboard.jsx` if your backend runs elsewhere.

## API reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/scrape` | Start a job. Body: `{ source: 'maps' \| 'justdial', query, targetCount }`. Returns `{ jobId }` immediately (202). |
| `GET` | `/api/scrape/jobs` | List all jobs, most recent first. |
| `GET` | `/api/scrape/:id` | Full job state: status, logs, results, error. |
| `GET` | `/api/scrape/:id/logs?since=N` | Log lines after index `N` — used for incremental polling. |
| `GET` | `/api/scrape/:id/csv` | Download results as CSV (UTF-8 BOM for Excel). |

## Known limitations

- **In-memory jobs** — restarting the server loses all job history. Fine for local/dev use, not for production.
- **Single process, no real concurrency limits** — two jobs started at once both run inline; nothing queues excess load.
- **Website scraping is heuristic** — arbitrary business websites vary wildly (WordPress contact forms instead of visible emails, JS-only rendering, slow hosts). Expect a meaningful share of `Not found` / `Site unreachable` in practice.
- **JustDial URL building** is a simplification (`buildJustDialUrl` in `routes/scrape.js`) — it constructs search URLs from free text, not JustDial's actual category (`nct`) codes, so results may be less precise for less common categories.

## Roadmap

- [ ] Replace `JobManager` (in-memory `Map`) with **BullMQ + Redis** so jobs survive restarts, get real concurrency limits, and get automatic retries with backoff.
- [ ] Toggle in the dashboard UI for `scrapeWebsites` (skip the website pass for faster runs).
- [ ] JustDial category → `nct` code lookup table for more precise search URLs.
- [ ] Proxy rotation for scaling past Google/JustDial's block thresholds.