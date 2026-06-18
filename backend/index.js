const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const { chromium } = require('playwright');
const { getJson } = require('serpapi');

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '127.0.0.1';
const SERPAPI_KEY = process.env.SERPAPI_KEY;
const DEFAULT_LOCATION = process.env.SERPAPI_LL || '@28.6139,77.2090,12z';
const DEFAULT_LIMIT = 20;
const TEST_RESULTS_FILE = path.join(__dirname, 'results.csv');

const phoneRegex = /(\+?\d{1,3}[\s-]?)?\(?\d{3,5}\)?[\s-]?\d{3,5}[\s-]?\d{3,5}/;
const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(payload));
}

function getMapsResults(query, ll) {
  return new Promise((resolve, reject) => {
    getJson(
      {
        engine: 'google_maps',
        type: 'search',
        q: query,
        ll,
        google_domain: 'google.com',
        hl: 'en',
        api_key: SERPAPI_KEY,
      },
      (json) => {
        if (json?.error) {
          reject(new Error(json.error));
          return;
        }

        resolve(json);
      }
    );
  });
}

function mapPlace(place) {
  return {
    name: place.title || 'N/A',
    phone_maps: place.phone || 'N/A',
    phone_website: 'N/A',
    email: 'N/A',
    website: place.website || 'N/A',
    rating: place.rating || 'N/A',
    reviews: place.reviews || 0,
    address: place.address || 'N/A',
    type: place.type || 'N/A',
    hours: place.hours || 'N/A',
  };
}

function parseCsvLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' && nextChar === '"') {
      current += '"';
      i += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
}

function readTestResults() {
  const csv = fs.readFileSync(TEST_RESULTS_FILE, 'utf8').trim();
  const lines = csv.split(/\r?\n/);
  const rows = lines.slice(1).map(parseCsvLine);

  return rows.map((row) => ({
    name: row[0] || 'N/A',
    phone_maps: row[1] || 'N/A',
    phone_website: row[2] || 'N/A',
    email: row[3] || 'N/A',
    website: row[4] || 'N/A',
    rating: row[5] || 'N/A',
    reviews: 0,
    address: row[6] || 'N/A',
    type: 'N/A',
    hours: 'N/A',
  }));
}

function normalizeHrefValue(value, prefix) {
  if (!value) return null;
  return value.replace(prefix, '').split('?')[0].trim();
}

async function readContactInfoFromPage(page) {
  return page.evaluate(
    ({ phonePattern, emailPattern }) => {
      const phoneRegex = new RegExp(phonePattern);
      const emailRegex = new RegExp(emailPattern);
      const phoneLink = document.querySelector('a[href^="tel:"]');
      const emailLink = document.querySelector('a[href^="mailto:"]');
      const bodyText = document.body?.innerText || '';

      const phoneFromLink =
        phoneLink?.textContent?.trim() ||
        phoneLink?.getAttribute('href')?.replace('tel:', '').trim();
      const emailFromLink =
        emailLink?.textContent?.trim() ||
        emailLink?.getAttribute('href')?.replace('mailto:', '').split('?')[0].trim();

      return {
        phone: phoneFromLink || bodyText.match(phoneRegex)?.[0]?.trim() || null,
        email: emailFromLink || bodyText.match(emailRegex)?.[0] || null,
      };
    },
    {
      phonePattern: phoneRegex.source,
      emailPattern: emailRegex.source,
    }
  );
}

async function extractContactInfo(url, browser) {
  if (!url || url === 'N/A') {
    return { phone: 'N/A', email: 'N/A' };
  }

  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });

    const contactInfo = await readContactInfoFromPage(page);
    const baseUrl = page.url() || url;
    const contactUrls = [
      new URL('/contact', baseUrl).href,
      new URL('/contact-us', baseUrl).href,
      new URL('/contacts', baseUrl).href,
    ];

    for (const contactUrl of contactUrls) {
      if (contactInfo.phone && contactInfo.email) break;

      try {
        await page.goto(contactUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
        const extra = await readContactInfoFromPage(page);
        contactInfo.phone ||= extra.phone;
        contactInfo.email ||= extra.email;
      } catch (_) {
        // Some websites do not have all contact URL variants.
      }
    }

    return {
      phone: normalizeHrefValue(contactInfo.phone, 'tel:') || 'N/A',
      email: normalizeHrefValue(contactInfo.email, 'mailto:') || 'N/A',
    };
  } catch (err) {
    return {
      phone: 'N/A',
      email: `Error: ${err.message.slice(0, 80)}`,
    };
  } finally {
    await page.close();
  }
}

async function scrapeResults(places) {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  try {
    for (const place of places) {
      const entry = mapPlace(place);

      if (entry.website !== 'N/A') {
        const contactInfo = await extractContactInfo(entry.website, browser);
        entry.phone_website = contactInfo.phone;
        entry.email = contactInfo.email;
      }

      results.push(entry);
    }
  } finally {
    await browser.close();
  }

  return results;
}

async function handleSearch(req, res, url) {
  const query = url.searchParams.get('query')?.trim() || url.searchParams.get('q')?.trim();
  const ll = url.searchParams.get('ll')?.trim() || DEFAULT_LOCATION;
  const limit = Math.min(
    Number.parseInt(url.searchParams.get('limit') || DEFAULT_LIMIT, 10) || DEFAULT_LIMIT,
    20
  );

  if (!query) {
    sendJson(res, 400, { error: 'Missing required query param: query' });
    return;
  }

  if (!SERPAPI_KEY) {
    sendJson(res, 500, {
      error: 'Missing SERPAPI_KEY environment variable',
      example: 'SERPAPI_KEY=your_key npm start',
    });
    return;
  }

  try {
    const mapsData = await getMapsResults(query, ll);
    const places = (mapsData.local_results || []).slice(0, limit);
    const results = await scrapeResults(places);

    sendJson(res, 200, {
      query,
      ll,
      count: results.length,
      results,
    });
  } catch (err) {
    sendJson(res, 500, { error: err.message });
  }
}

function handleTestResults(res) {
  try {
    const results = readTestResults();

    sendJson(res, 200, {
      query: 'Technology companies in delhi',
      source: 'backend/results.csv',
      count: results.length,
      results,
    });
  } catch (err) {
    sendJson(res, 500, { error: `Could not load test results: ${err.message}` });
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {});
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/search') {
    await handleSearch(req, res, url);
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/test-results') {
    handleTestResults(res);
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/health') {
    sendJson(res, 200, { ok: true });
    return;
  }

  sendJson(res, 404, { error: 'Not found' });
});

server.listen(PORT, HOST, () => {
  console.log(`Backend API running at http://${HOST}:${PORT}`);
  console.log(`Search endpoint: http://${HOST}:${PORT}/api/search?query=Technology%20companies%20in%20delhi`);
  console.log(`Test data endpoint: http://${HOST}:${PORT}/api/test-results`);
});
