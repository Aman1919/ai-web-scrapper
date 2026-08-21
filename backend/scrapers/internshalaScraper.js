// internshalaScraper.js
//
// Extends your JustDial / Google Maps lead-gen pipeline to Internshala.
// Same two-stage shape as your JustDial scraper:
//
//   Stage 1 (Playwright) -> load the listing URL(s), scroll to trigger
//                            Internshala's infinite-scroll loading, pull out
//                            internship cards, and build a
//                            companyName -> companyProfileUrl map from the
//                            "Top Companies" backlinks block at the bottom
//                            of the page.
//   Stage 2 (Cheerio)    -> for each unique company, visit its Internshala
//                            company page (or the internship detail page as
//                            a fallback), pull mailto:/tel: links + any
//                            external "official website" link, then follow
//                            that website (home + a handful of likely
//                            contact-page paths) and run the same
//                            mailto:/tel:/email-regex extraction there.
//
// ASSUMPTIONS I could NOT verify against live Internshala HTML (I only had
// the search-results page you pasted, not a company profile page or an
// internship detail page) — sanity-check these in devtools before relying
// on this at volume:
//
//   1. The structure of /company/<slug>/careers/ pages. Stage 2 doesn't
//      assume any specific structure there beyond "look for mailto:/tel:
//      links and external hrefs", which should degrade gracefully even if
//      the real markup differs, but it's worth eyeballing a real page.
//   2. The exact AJAX endpoint Internshala calls for infinite scroll (the
//      page ships `infiniteScollPageNumber` / `scroll_page_number` globals,
//      confirming it's client-side driven, but not the endpoint shape).
//      This version sidesteps that by scrolling in a real browser instead
//      of guessing the XHR — slower, but robust to markup/endpoint changes.
//   3. Internshala rarely publishes a company's email/phone directly on
//      platform — recruiters are contacted through Internshala's own
//      chat/apply flow. Expect a meaningful share of companies to come back
//      with just a profile URL and no emails/phones; that's the platform,
//      not a bug in this scraper.
//   4. Scraping Internshala is very likely against their Terms of Service
//      (same category of risk as the JustDial/Akamai block you hit before)
//      — keep concurrency low and treat this as a small research batch tool
//      rather than something you run continuously.
//
// Deps: `npm i crawlee playwright && npx playwright install chromium`

import { PlaywrightCrawler, CheerioCrawler } from 'crawlee';

const BASE = 'https://internshala.com';

const CONTACT_PATHS = [
  '/', '/contact', '/contact-us', '/contactus', '/about', '/about-us',
  '/aboutus', '/reach-us', '/get-in-touch',
];

const SOCIAL_DOMAINS = {
  linkedin: /linkedin\.com/i,
  twitter: /(twitter\.com|x\.com)/i,
  instagram: /instagram\.com/i,
  facebook: /facebook\.com/i,
  youtube: /youtube\.com/i,
};

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const IGNORED_EMAIL_DOMAINS = ['internshala.com', 'example.com', 'sentry.io', 'wixpress.com'];

// ---------------------------------------------------------------------------
// URL resolution
// ---------------------------------------------------------------------------

function normalizeUrl(url) {
  const u = new URL(url, BASE);
  if (u.protocol === 'http:') u.protocol = 'https:';
  return u.toString();
}

/**
 * `query` can be:
 *  - a full Internshala search URL, or an array of them — e.g. the samples
 *    you gave:
 *      https://internshala.com/internships/computer-science-internship/stipend-10000
 *      https://internshala.com/jobs/work-from-home/
 *      https://internshala.com/internships/mba-internship/
 *      https://internshala.com/internships/internship-in-delhi/
 *      https://internshala.com/internships/marketing-internship/
 *    Prefer this — it's the reliable path.
 *  - a plain keyword string. We guess `/internships/<slug>-internship/`,
 *    which matches 3 of the 5 samples above (computer-science, mba,
 *    marketing) but will NOT work for location- or type-based queries like
 *    "delhi" or "work from home" — pass a full URL for those instead.
 */
function resolveStartUrls(query) {
  if (Array.isArray(query)) return query.map(normalizeUrl);
  if (typeof query === 'string' && /^https?:\/\//i.test(query)) return [normalizeUrl(query)];

  const slug = String(query)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return [normalizeUrl(`/internships/${slug}-internship/`)];
}

// ---------------------------------------------------------------------------
// Stage 1: listing page -> internship cards + company profile URL map
// ---------------------------------------------------------------------------

async function autoScrollUntil(page, { targetCount, maxIdleRounds = 4, roundDelayMs = 900 } = {}) {
  let idleRounds = 0;
  let lastCount = 0;

  while (idleRounds < maxIdleRounds) {
    const count = await page.locator('.individual_internship').count();
    if (targetCount && count >= targetCount) break;

    await page.mouse.wheel(0, 3000);
    await page.waitForTimeout(roundDelayMs);

    const newCount = await page.locator('.individual_internship').count();
    if (newCount <= lastCount) {
      idleRounds += 1;
    } else {
      idleRounds = 0;
    }
    lastCount = newCount;
  }
}

async function extractCards(page) {
  return page.$$eval('.individual_internship', (nodes) =>
    nodes.map((el) => {
      const text = (sel) => el.querySelector(sel)?.textContent?.trim() || null;
      const attr = (sel, name) => el.querySelector(sel)?.getAttribute(name) || null;

      const durationRow = [...el.querySelectorAll('.row-1-item')].find((r) =>
        r.querySelector('.ic-16-calendar')
      );

      return {
        internshipId: el.id || null,
        title: text('.job-title-href'),
        detailUrl: attr('.job-title-href', 'href'),
        companyName: text('.company-name'),
        locations: [...el.querySelectorAll('.locations a')].map((a) => a.textContent.trim()),
        workMode: el.querySelector('.locations .ic-16-home')
          ? 'work_from_home'
          : el.querySelector('.office_days_popover')
          ? 'hybrid'
          : 'onsite',
        stipend: text('.stipend'),
        duration: durationRow?.querySelector('span')?.textContent?.trim() || null,
        skills: [...el.querySelectorAll('.job_skills .job_skill')].map((s) => s.textContent.trim()),
        aboutJob: text('.about_job .text'),
        posted: text('.status-success span') || text('.status-info span'),
        ppo: text('.ppo_status span'),
        activelyHiring: !!el.querySelector('.actively-hiring-badge'),
      };
    })
  );
}

async function extractCompanyProfileMap(page) {
  return page
    .$$eval('.card.top_companies .backlink-data a', (anchors) => {
      const map = {};
      anchors.forEach((a) => {
        const name = a.textContent.trim().toLowerCase();
        const href = a.getAttribute('href');
        if (name && href) map[name] = href;
      });
      return map;
    })
    .catch(() => ({}));
}

async function fetchListingCards({ startUrls, targetCount, onLog, headless }) {
  const cards = [];
  const companyProfileMap = {};

  const crawler = new PlaywrightCrawler({
    maxRequestsPerCrawl: startUrls.length,
    requestHandlerTimeoutSecs: 180,
    launchContext: { launchOptions: { headless } },
    async requestHandler({ page, request }) {
      onLog(`Opening ${request.url}`);
      await page.waitForSelector('.individual_internship', { timeout: 30000 }).catch(() => {
        onLog(`No internship cards showed up on ${request.url} within 30s — page structure may have changed, or this listing is empty.`);
      });

      await autoScrollUntil(page, { targetCount });

      const pageCards = await extractCards(page);
      const profileMap = await extractCompanyProfileMap(page);
      Object.assign(companyProfileMap, profileMap);

      onLog(`Found ${pageCards.length} internship cards on ${request.url}`);
      cards.push(...pageCards.map((c) => ({ ...c, sourceUrl: request.url })));
    },
    failedRequestHandler({ request }, error) {
      onLog(`Failed to load ${request.url}: ${error?.message || error}`);
    },
  });

  await crawler.run(startUrls);

  return { cards, companyProfileMap };
}

function groupCardsByCompany(cards, companyProfileMap) {
  const byCompany = new Map();

  for (const card of cards) {
    if (!card.companyName) continue;
    const displayName = card.companyName.trim();
    const key = displayName.toLowerCase();
    const detailUrl = card.detailUrl ? normalizeUrl(card.detailUrl) : null;
    const profileHref = companyProfileMap[key];
    const profileUrl = profileHref ? normalizeUrl(profileHref) : null;

    if (!byCompany.has(key)) {
      byCompany.set(key, {
        companyName: displayName,
        companyProfileUrl: profileUrl,
        detailUrl, // fallback crawl target when we couldn't resolve a profile URL
        internships: [],
        locations: new Set(),
      });
    }

    const entry = byCompany.get(key);
    entry.internships.push({
      title: card.title,
      url: detailUrl,
      stipend: card.stipend,
      duration: card.duration,
      workMode: card.workMode,
    });
    (card.locations || []).forEach((loc) => entry.locations.add(loc));
    if (!entry.companyProfileUrl && profileUrl) entry.companyProfileUrl = profileUrl;
  }

  return [...byCompany.values()].map((c) => ({ ...c, locations: [...c.locations] }));
}

// ---------------------------------------------------------------------------
// Stage 2: company page -> mailto:/tel:/website -> follow website for contacts
// ---------------------------------------------------------------------------

function extractContactSignals(html) {
  const emails = new Set();
  const phones = new Set();
  const social = {};
  let website = null;

  for (const m of html.matchAll(/href=["']mailto:([^"'?]+)/gi)) {
    emails.add(m[1].trim().toLowerCase());
  }
  for (const m of html.matchAll(/href=["']tel:([^"']+)/gi)) {
    phones.add(m[1].trim());
  }
  for (const e of html.match(EMAIL_RE) || []) {
    emails.add(e.toLowerCase());
  }

  for (const m of html.matchAll(/href=["']([^"']+)["']/gi)) {
    const href = m[1];
    if (!/^https?:\/\//i.test(href)) continue;

    let host;
    try {
      host = new URL(href).hostname.replace(/^www\./, '');
    } catch {
      continue;
    }
    if (host.includes('internshala.com')) continue;

    const socialHit = Object.entries(SOCIAL_DOMAINS).find(([, re]) => re.test(host));
    if (socialHit) {
      social[socialHit[0]] = social[socialHit[0]] || href;
      continue;
    }

    if (!website) website = href; // first external, non-social link = best guess at "official site"
  }

  const cleanEmails = [...emails].filter(
    (e) => !IGNORED_EMAIL_DOMAINS.some((d) => e.endsWith(`@${d}`))
  );

  return { emails: cleanEmails, phones: [...phones], social, website };
}

async function enrichCompanies({ companies, onLog, maxConcurrency }) {
  const results = new Map();
  const maxRequestsPerCrawl = Math.max(50, companies.length * (CONTACT_PATHS.length + 1));

  const crawler = new CheerioCrawler({
    maxConcurrency,
    maxRequestsPerCrawl,
    requestHandlerTimeoutSecs: 60,
    async requestHandler({ body, request }) {
      const { label, companyKey } = request.userData;
      const html = body.toString();
      const signals = extractContactSignals(html);

      const existing = results.get(companyKey) || {
        emails: new Set(),
        phones: new Set(),
        social: {},
        website: null,
      };

      signals.emails.forEach((e) => existing.emails.add(e));
      signals.phones.forEach((p) => existing.phones.add(p));
      Object.assign(existing.social, signals.social);

      if (label === 'INTERNSHALA_COMPANY_PAGE' && signals.website && !existing.website) {
        existing.website = signals.website;
        onLog(`Found candidate website for ${companyKey}: ${signals.website}`);

        const origin = new URL(signals.website).origin;
        const followUps = CONTACT_PATHS.map((path) => {
          const url = new URL(path, origin).toString();
          return { url, userData: { label: 'EXTERNAL_SITE', companyKey }, uniqueKey: url };
        });
        await crawler.addRequests(followUps);
      }

      results.set(companyKey, existing);
    },
    failedRequestHandler({ request }) {
      onLog(`Could not fetch ${request.url} (${request.userData?.companyKey || 'unknown company'})`);
    },
  });

  const startRequests = companies
    .filter((c) => c.companyProfileUrl || c.detailUrl)
    .map((c) => {
      const url = c.companyProfileUrl || c.detailUrl;
      return { url, userData: { label: 'INTERNSHALA_COMPANY_PAGE', companyKey: c.companyName }, uniqueKey: url };
    });

  await crawler.run(startRequests);

  const out = {};
  for (const [companyKey, data] of results.entries()) {
    out[companyKey] = {
      emails: [...data.emails],
      phones: [...data.phones],
      social: data.social,
      website: data.website,
    };
  }
  return out;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * @param {Object} opts
 * @param {string|string[]} opts.query - Internshala listing URL(s), or a plain
 *   keyword (best-effort — see resolveStartUrls above).
 * @param {number} [opts.targetCount=50] - rough ceiling on how many unique
 *   companies to attempt contact-enrichment for. Also loosely bounds the
 *   listing-page scroll (which counts internship cards, not companies, so
 *   you'll usually end up with somewhat fewer than targetCount companies).
 * @param {(msg: string) => void} [opts.onLog] - progress callback, same shape
 *   as your existing job log polling.
 * @param {boolean} [opts.headless=true] - set false to watch the browser
 *   while debugging selector/anti-bot issues.
 * @param {number} [opts.enrichConcurrency=4] - concurrency for the Stage 2
 *   Cheerio crawler (company pages + external company websites). Keep this
 *   low — you're hitting a lot of different small sites, not one target.
 * @returns {Promise<{ internships: object[], companies: object[] }>}
 */
export async function scrapeInternshala({
  query,
  targetCount = 50,
  onLog = () => {},
  headless = true,
  enrichConcurrency = 4,
} = {}) {
  const startUrls = resolveStartUrls(query);
  console.log(startUrls)
  onLog(`Resolved ${startUrls.length} start URL(s): ${startUrls.join(', ')}`);

  const { cards, companyProfileMap } = await fetchListingCards({
    startUrls,
    targetCount,
    onLog,
    headless,
  });
  console.log("cards && cards length: ",cards[0].companyName,cards.length)
  onLog(`Collected ${cards.length} internship cards across ${startUrls.length} listing page(s).`);

  let companies = groupCardsByCompany(cards, companyProfileMap);
  onLog(`Deduped down to ${companies.length} unique companies.`);

  
if (targetCount) companies = companies.slice(0, targetCount);

  const contactData = await enrichCompanies({ companies, onLog, maxConcurrency: enrichConcurrency });

  const enriched = companies.map((c) => ({
    ...c,
    ...(contactData[c.companyName] || { emails: [], phones: [], social: {}, website: null }),
    scrapedAt: new Date().toISOString(),
  }));

  const withContact = enriched.filter((c) => c.emails.length || c.phones.length).length;
  onLog(`Done. ${withContact}/${enriched.length} companies came back with at least one email or phone.`);
const res = enriched.filter((c) => c.emails.length || c.phones.length).length
console.log("companies && companies length: ",enriched,companies)

  return { internships: cards, companies: enriched };
}

// ---------------------------------------------------------------------------
// Example usage:
//
// const { companies } = await scrapeInternshala({
//   query: 'https://internshala.com/internships/computer-science-internship/stipend-10000',
//   targetCount: 30,
//   onLog: (msg) => console.log('[internshala]', msg),
// });
// console.table(
//   companies.map((c) => ({
//     name: c.companyName,
//     website: c.website,
//     emails: c.emails.join(', '),
//     phones: c.phones.join(', '),
//   }))
// );