import { PlaywrightCrawler } from 'crawlee';

// Resource types we never need for text/link extraction. Blocking these
// speeds up page loads AND reduces per-page memory footprint — useful on
// low-RAM machines where every open tab counts.
const BLOCKED_RESOURCE_TYPES = new Set(['image', 'media', 'font', 'stylesheet']);

async function blockHeavyResources(page) {
    await page.route('**/*', (route) => {
        const type = route.request().resourceType();
        if (BLOCKED_RESOURCE_TYPES.has(type)) return route.abort();
        return route.continue();
    });
}

// JustDial frequently shows a location-confirm or cookie-consent overlay
// that sits on top of the results feed. If it's there, the feed selector
// never appears and waitForSelector times out — looking like "no results"
// when it's actually just a blocked popup. Try a few common close patterns.
async function dismissPopups(page, onLog) {
    const closeSelectors = [
        'button[aria-label="Close"]',
        '[class*="close" i]',
        'button:has-text("Close")',
        'button:has-text("Not Now")',
        'button:has-text("×")',
    ];
    for (const sel of closeSelectors) {
        try {
            const el = page.locator(sel).first();
            if (await el.isVisible({ timeout: 800 })) {
                await el.click({ timeout: 800 });
                onLog(`[justdial] Dismissed a popup matching "${sel}"`);
                await page.waitForTimeout(300);
            }
        } catch {
            // selector not present or not clickable — ignore and move on
        }
    }
}

// Shared crawler config. Forcing HTTP/1.1 alone didn't fix the
// ERR_HTTP2_PROTOCOL_ERROR you saw — the connection was being reset
// mid-stream after a delay, which is the classic signature of anti-bot
// protection reacting to Playwright's default headless fingerprint
// (navigator.webdriver flag, default UA string) rather than a plain
// network issue. This masks the most common tells.
const REALISTIC_UA =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

const NETWORK_SAFE_OPTIONS = {
    launchContext: {
        launchOptions: {
            args: ['--disable-http2', '--disable-quic', '--disable-blink-features=AutomationControlled'],
        },
    },
    navigationTimeoutSecs: 45,
    preNavigationHooks: [
        async ({ page }, gotoOptions) => {
            gotoOptions.waitUntil = 'domcontentloaded';
            await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-IN,en;q=0.9' });
            await page.addInitScript((ua) => {
                Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
                Object.defineProperty(navigator, 'userAgent', { get: () => ua });
            }, REALISTIC_UA);
        },
    ],
};

/**
 * Scrapes JustDial for businesses matching a category/search URL.
 * @param {Object} opts
 * @param {string} opts.searchUrl - a full JustDial search results URL
 * @param {number} opts.targetCount - how many listings to try to collect
 * @param {number} opts.maxConcurrency - parallel detail-page tabs (default 2 — safe for 8GB RAM)
 * @param {(msg: string) => void} opts.onLog - called with each progress line
 * @returns {Promise<Array<object>>} scraped results
 */
export async function scrapeJustDial({ searchUrl, targetCount = 50, maxConcurrency = 2, onLog = () => {} }) {
    const results = [];
    let placeUrls = [];

    // ---------- PASS 1: Collect listing URLs ----------
    const listCrawler = new PlaywrightCrawler({
        requestHandlerTimeoutSecs: 180,
        ...NETWORK_SAFE_OPTIONS,
        async requestHandler({ page, log }) {
            await blockHeavyResources(page);

            try {
                await dismissPopups(page, onLog);
                await page.waitForSelector('div[aria-label^="contract info of"]', { timeout: 20000 });
            } catch (err) {
                // Diagnostics — this is the part that tells us WHY it's empty
                // instead of just silently returning nothing.
                const title = await page.title().catch(() => 'unknown');
                const currentUrl = page.url();
                const bodySnippet = await page
                    .locator('body')
                    .innerText()
                    .then((t) => t.slice(0, 300))
                    .catch(() => '(could not read body)');

                onLog(`[justdial] Pass 1 FAILED — feed selector never appeared`);
                onLog(`[justdial] Page title: "${title}"`);
                onLog(`[justdial] Final URL: ${currentUrl}`);
                onLog(`[justdial] Page text snippet: ${bodySnippet}`);
                throw err;
            }

            let previousCount = 0;
            let stagnantRounds = 0;

            while (stagnantRounds < 4) {
                const count = await page.locator('div[aria-label^="contract info of"]').count();
                if (count === previousCount) stagnantRounds++;
                else stagnantRounds = 0;
                previousCount = count;

                onLog(`[justdial] Pass 1 — collected ${previousCount} cards`);
                if (previousCount >= targetCount) break;

                await page.evaluate(() => window.scrollBy(0, 1500));
                await page.waitForTimeout(1000);
            }

            log.info(`Pass 1: found ${previousCount} listing cards`);

            const links = await page.$$eval(
                'div[aria-label^="contract info of"] .resultbox_title_anchorbox',
                (anchors) => anchors.map((a) => a.href).filter(Boolean)
            );

            if (previousCount > 0 && links.length === 0) {
                // Cards exist but the anchor selector matched nothing — the
                // link selector itself has likely gone stale, not the feed.
                onLog(
                    `[justdial] WARNING: ${previousCount} cards found but 0 links matched ".resultbox_title_anchorbox" — JustDial's DOM structure for the link may have changed. Check selectors.`
                );
            }

            placeUrls = [...new Set(links)].slice(0, targetCount);
            onLog(`[justdial] Pass 1 complete — ${placeUrls.length} unique URLs`);
        },
        maxRequestsPerCrawl: 1,
    });

    onLog(`[justdial] Starting search: ${searchUrl}`);
    try {
        await listCrawler.run([searchUrl]);
    } catch (err) {
        onLog(`[justdial] Pass 1 crawler error: ${err.message}`);
    }

    if (placeUrls.length === 0) {
        onLog('[justdial] No URLs collected — aborting before Pass 2');
        return results;
    }

    // ---------- PASS 2: Visit each listing, extract details ----------
    const detailCrawler = new PlaywrightCrawler({
        requestHandlerTimeoutSecs: 60,
        maxConcurrency, // default 2 — keeps memory in check on 8GB machines
        ...NETWORK_SAFE_OPTIONS,
        async requestHandler({ page, request, log }) {
            try {
                await blockHeavyResources(page);
                await page.waitForSelector('h1.compney', { timeout: 15000 });

                const data = await page.evaluate(() => {
                    const name = document.querySelector('h1.compney')?.innerText?.trim() || '';
                    const phone = document.querySelector('a[href^="tel:"]')?.innerText?.trim() || '';
                    const ratingRaw = document.querySelector('.vendbox_rateavg')?.innerText || '';
                    const rating = ratingRaw.replace(/\D.*$/, '').trim();
                    const ratingCount = document.querySelector('.vendbox_ratecount')?.innerText?.trim() || '';
                    const address = document.querySelector('address.vendorinfo_address')?.innerText?.trim() || '';
                    const websiteEl = document.querySelector('[data-tracker-id="section_rhs_visit_our_website"]');
                    const website = websiteEl?.closest('a')?.href || '';
                    const gstText = document.querySelector('.gst_address_link')?.innerText || '';
                    const gstin = gstText.replace('GSTIN :', '').trim();
                    const categories = Array.from(
                        document.querySelectorAll('.company_info_listed_items .listed_item_anchor')
                    )
                        .map((el) => el.innerText.trim())
                        .filter(Boolean)
                        .join(' | ');
                    const operationTexts = Array.from(document.querySelectorAll('.operation')).map((el) =>
                        el.innerText.trim()
                    );
                    const yearsInBusiness = operationTexts.find((t) => t.includes('Years in Business')) || '';
                    const summaryLabel = Array.from(document.querySelectorAll('.dtl_labeltext')).find((el) =>
                        el.innerText.includes('Business summary')
                    );
                    const businessSummary = summaryLabel?.nextElementSibling?.innerText?.trim() || '';

                    return {
                        name,
                        phone,
                        rating,
                        ratingCount,
                        address,
                        website,
                        gstin,
                        categories, 
                        yearsInBusiness,
                        businessSummary,
                    };
                });

                log.info(`Pass 2: scraped ${data.name}`);
                onLog(`[justdial] Pass 2 — scraped "${data.name}" (${results.length + 1}/${placeUrls.length})`);

                results.push({ ...data, sourceUrl: request.url });
            } catch (err) {
                log.error(`Pass 2: failed on ${request.url}: ${err.message}`);
                onLog(`[justdial] Failed on ${request.url}: ${err.message}`);
            }
        },
    });

    await detailCrawler.run(placeUrls);
    onLog(`[justdial] Done — ${results.length} businesses extracted`);

    return results;
}
