import { PlaywrightCrawler } from 'crawlee';

const NOT_FOUND = 'Not found';
const NO_WEBSITE = 'No website';
const UNREACHABLE = 'Site unreachable';

/**
 * Google sometimes serves website links wrapped in its own redirect,
 * e.g. "/url?q=https://pslaw.co.in/&opi=...&sa=U&ved=...&usg=...".
 * Unwrap it to get the real destination URL.
 */
function unwrapGoogleRedirect(href) {
    if (!href) return '';
    try {
        const url = new URL(href, 'https://www.google.com');
        if (url.pathname === '/url' && url.searchParams.has('q')) {
            return url.searchParams.get('q');
        }
        return href;
    } catch {
        return href;
    }
}

/**
 * Extracts contact-ish info from whatever page is currently loaded.
 * Tries structured sources first (mailto/tel links, schema.org markup),
 * then falls back to regex over the visible page text.
 */
async function extractContactFromPage(page) {
    return page.evaluate(() => {
        const bodyText = document.body.innerText || '';

        // ---- Email ----
        let email = document.querySelector('a[href^="mailto:"]')?.getAttribute('href') || '';
        email = email ? email.replace('mailto:', '').split('?')[0].trim() : '';
        if (!email) {
            const match = bodyText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
            email = match ? match[0] : '';
        }

        // ---- Phone ----
        let phone = document.querySelector('a[href^="tel:"]')?.getAttribute('href') || '';
        phone = phone ? phone.replace('tel:', '').trim() : '';
        if (!phone) {
            // loose international/local phone pattern
            const match = bodyText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/);
            phone = match ? match[0].trim() : '';
        }

        // ---- Address ----
        let address = document.querySelector('[itemtype*="PostalAddress"]')?.innerText?.trim() || '';
        if (!address) {
            address = document.querySelector('address')?.innerText?.trim() || '';
        }

        // ---- Opening hours ----
        let hours = document.querySelector('[itemprop="openingHours"]')?.getAttribute('content') || '';
        if (!hours) {
            const dayWord =
                '(Mon(day)?|Tue(sday)?|Wed(nesday)?|Thu(rsday)?|Fri(day)?|Sat(urday)?|Sun(day)?)';
            const hoursRegex = new RegExp(
                `${dayWord}[a-zA-Z,\\s-]{0,20}\\d{1,2}[:.]?\\d{0,2}\\s?(AM|PM|am|pm)?\\s?-\\s?\\d{1,2}[:.]?\\d{0,2}\\s?(AM|PM|am|pm)?`
            );
            const match = bodyText.match(hoursRegex);
            hours = match ? match[0].trim() : '';
        }

        return {
            websiteEmail: email || '',
            websitePhone: phone || '',
            websiteAddress: address || '',
            websiteHours: hours || '',
        };
    });
}

/**
 * Visits a business's website (and, if key fields are still missing, a
 * likely "contact" page) and pulls email/phone/address/hours.
 * Every field independently falls back to a status string so a partial
 * scrape (e.g. found email but no hours) isn't lost.
 */
async function scrapeWebsiteContactInfo(context, websiteUrl, onLog, label) {
    if (!websiteUrl) {
        return {
            websiteEmail: NO_WEBSITE,
            websitePhone: NO_WEBSITE,
            websiteAddress: NO_WEBSITE,
            websiteHours: NO_WEBSITE,
        };
    }

    const page = await context.newPage();
    try {
        await page.goto(websiteUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
        let data = await extractContactFromPage(page);

        // If the important fields are still missing, try a contact page.
        if (!data.websiteEmail || !data.websitePhone) {
            const contactHref = await page
                .$$eval('a', (anchors) => {
                    const match = anchors.find(
                        (a) => /contact/i.test(a.href) || /contact/i.test(a.textContent || '')
                    );
                    return match ? match.href : null;
                })
                .catch(() => null);

            if (contactHref) {
                try {
                    await page.goto(contactHref, { waitUntil: 'domcontentloaded', timeout: 12000 });
                    const contactData = await extractContactFromPage(page);
                    data = {
                        websiteEmail: data.websiteEmail || contactData.websiteEmail,
                        websitePhone: data.websitePhone || contactData.websitePhone,
                        websiteAddress: data.websiteAddress || contactData.websiteAddress,
                        websiteHours: data.websiteHours || contactData.websiteHours,
                    };
                    onLog(`[maps] ${label} — checked contact page for missing fields`);
                } catch {
                    // homepage data stands if contact page fails
                }
            }
        }

        return {
            websiteEmail: data.websiteEmail || NOT_FOUND,
            websitePhone: data.websitePhone || NOT_FOUND,
            websiteAddress: data.websiteAddress || NOT_FOUND,
            websiteHours: data.websiteHours || NOT_FOUND,
        };
    } catch (err) {
        onLog(`[maps] ${label} — website unreachable (${err.message})`);
        return {
            websiteEmail: UNREACHABLE,
            websitePhone: UNREACHABLE,
            websiteAddress: UNREACHABLE,
            websiteHours: UNREACHABLE,
        };
    } finally {
        await page.close().catch(() => {});
    }
}

/**
 * Scrapes Google Maps for businesses matching a query, then visits each
 * business's own website to pull email / phone / address / opening hours.
 * @param {Object} opts
 * @param {string} opts.query - e.g. "technology companies in delhi"
 * @param {number} opts.targetCount - how many listings to try to collect
 * @param {boolean} opts.scrapeWebsites - visit each place's website for contact info (default true)
 * @param {(msg: string) => void} opts.onLog - called with each progress line
 * @returns {Promise<Array<object>>} scraped results
 */
export async function scrapeGoogleMaps({ query, targetCount = 50, scrapeWebsites = true, onLog = () => {} }) {
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
                    if (seen.size >= targetCount) break;
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

            placeUrls = [...seen.keys()].slice(0, targetCount);
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

    // ---------- PASS 2: Visit each place, extract details (+ its website) ----------
    const detailCrawler = new PlaywrightCrawler({
        requestHandlerTimeoutSecs: 90,
        maxConcurrency: 3,
        async requestHandler({ page, request, log }) {
            try {
                await page.waitForSelector('h1', { timeout: 10000 });

                const name = await page.locator('h1').first().innerText().catch(() => '');
                const address = await page.locator('button[data-item-id="address"]').innerText().catch(() => '');
                const phone = await page.locator('button[data-item-id^="phone:tel:"]').innerText().catch(() => '');
                const rawWebsiteHref = await page
                    .locator('a[data-item-id="authority"]')
                    .getAttribute('href')
                    .catch(() => '');
                const website = unwrapGoogleRedirect(rawWebsiteHref);
                const rating = await page
                    .locator('div.F7nice span[aria-hidden="true"]')
                    .first()
                    .innerText()
                    .catch(() => '');

                log.info(`Scraped: ${name}`);
                onLog(`[maps] Pass 2 — scraped "${name}" (${results.length + 1}/${placeUrls.length})`);

                let websiteInfo = {
                    websiteEmail: NO_WEBSITE,
                    websitePhone: NO_WEBSITE,
                    websiteAddress: NO_WEBSITE,
                    websiteHours: NO_WEBSITE,
                };

                if (scrapeWebsites) {
                    onLog(`[maps] "${name}" — visiting website for contact info`);
                    websiteInfo = await scrapeWebsiteContactInfo(page.context(), website, onLog, `"${name}"`);
                }

                results.push({
                    name,
                    address,
                    phone,
                    website: website || NO_WEBSITE,
                    rating,
                    mapsUrl: request.url,
                    ...websiteInfo,
                });
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