import { PlaywrightCrawler } from 'crawlee';

/**
 * Scrapes Google Maps for businesses matching a query.
 * @param {Object} opts
 * @param {string} opts.query - e.g. "technology companies in delhi"
 * @param {number} opts.targetCount - how many listings to try to collect
 * @param {(msg: string) => void} opts.onLog - called with each progress line
 * @returns {Promise<Array<object>>} scraped results
 */
export async function scrapeGoogleMaps({ query, targetCount = 50, onLog = () => {} }) {
    const results = [];
    let placeUrls = [];

    // ---------- PASS 1: Collect place URLs ----------
    const listCrawler = new PlaywrightCrawler({
        requestHandlerTimeoutSecs: 180,
        async requestHandler({ page, log }) {
            const feedSelector = 'div[role="feed"]';
            await page.waitForSelector(feedSelector, { timeout: 15000 });

            const seen = new Map();
            let stagnantRounds = 0;
            let previousCount = 0;

            while (seen.size < targetCount && stagnantRounds < 5) {
                const cards = await page.$$eval('div[role="feed"] > div a[href*="/maps/place/"]', (links) =>
                    links.map((el) => ({ name: el.getAttribute('aria-label') || '', url: el.href }))
                );

                for (const c of cards) {
                    if (c.name && !seen.has(c.url)) seen.set(c.url, c.name);
                }

                await page.evaluate((sel) => {
                    document.querySelector(sel)?.scrollBy(0, 1000);
                }, feedSelector);
                await page.waitForTimeout(1500);

                if (seen.size === previousCount) stagnantRounds++;
                else stagnantRounds = 0;
                previousCount = seen.size;

                log.info(`Collected so far: ${seen.size}`);
                onLog(`[maps] Pass 1 — collected ${seen.size}/${targetCount} listings`);
            }

            placeUrls = [...seen.keys()];
        },
        maxRequestsPerCrawl: 1,
    });

    const convertedQuery = query.replace(/\s+/g, '+');
    const listUrl = `https://www.google.com/maps/search/${convertedQuery}/@28.637933,77.2308992,15z`;

    onLog(`[maps] Starting search: "${query}"`);
    await listCrawler.run([listUrl]);
    onLog(`[maps] Pass 1 complete — found ${placeUrls.length} place URLs`);

    if (placeUrls.length === 0) {
        onLog('[maps] No URLs found — aborting before Pass 2');
        return results;
    }

    // ---------- PASS 2: Visit each place, extract details ----------
    const detailCrawler = new PlaywrightCrawler({
        requestHandlerTimeoutSecs: 60,
        maxConcurrency: 3,
        async requestHandler({ page, request, log }) {
            try {
                await page.waitForSelector('h1', { timeout: 10000 });

                const name = await page.locator('h1').first().innerText().catch(() => '');
                const address = await page.locator('button[data-item-id="address"]').innerText().catch(() => '');
                const phone = await page.locator('button[data-item-id^="phone:tel:"]').innerText().catch(() => '');
                const website = await page.locator('a[data-item-id="authority"]').getAttribute('href').catch(() => '');
                const rating = await page
                    .locator('div.F7nice span[aria-hidden="true"]')
                    .first()
                    .innerText()
                    .catch(() => '');

                log.info(`Scraped: ${name}`);
                onLog(`[maps] Pass 2 — scraped "${name}" (${results.length + 1}/${placeUrls.length})`);

                results.push({ name, address, phone, website, rating, mapsUrl: request.url });
            } catch (err) {
                log.error(`Failed on ${request.url}: ${err.message}`);
                onLog(`[maps] Failed on ${request.url}: ${err.message}`);
            }
        },
    });

    await detailCrawler.run(placeUrls);
    onLog(`[maps] Done — ${results.length} businesses extracted`);

    return results;
}