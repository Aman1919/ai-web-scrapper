import { PlaywrightCrawler } from 'crawlee';

/**
 * Scrapes JustDial for businesses matching a category/search URL.
 * @param {Object} opts
 * @param {string} opts.searchUrl - a full JustDial search results URL
 * @param {number} opts.targetCount - how many listings to try to collect
 * @param {(msg: string) => void} opts.onLog - called with each progress line
 * @returns {Promise<Array<object>>} scraped results
 */
export async function scrapeJustDial({ searchUrl, targetCount = 50, onLog = () => {} }) {
    const results = [];
    let placeUrls = [];

    // ---------- PASS 1: Collect listing URLs ----------
    const listCrawler = new PlaywrightCrawler({
        requestHandlerTimeoutSecs: 180,
        async requestHandler({ page, log }) {
            await page.waitForSelector('div[aria-label^="contract info of"]', { timeout: 20000 });

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
                await page.waitForTimeout(1200);
            }

            log.info(`Pass 1: found ${previousCount} listing cards`);

            const links = await page.$$eval(
                'div[aria-label^="contract info of"] .resultbox_title_anchorbox',
                (anchors) => anchors.map((a) => a.href).filter(Boolean)
            );

            placeUrls = [...new Set(links)].slice(0, targetCount);
            onLog(`[justdial] Pass 1 complete — ${placeUrls.length} unique URLs`);
        },
        maxRequestsPerCrawl: 1,
    });

    onLog(`[justdial] Starting search: ${searchUrl}`);
    await listCrawler.run([searchUrl]);

    if (placeUrls.length === 0) {
        onLog('[justdial] No URLs collected — aborting before Pass 2');
        return results;
    }

    // ---------- PASS 2: Visit each listing, extract details ----------
    const detailCrawler = new PlaywrightCrawler({
        requestHandlerTimeoutSecs: 60,
        maxConcurrency: 3,
        async requestHandler({ page, request, log }) {
            try {
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