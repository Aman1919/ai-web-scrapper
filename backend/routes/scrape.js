import { Router } from 'express';
import { jobManager } from '../jobs/jobmanager.js';
import { scrapeGoogleMaps } from '../scrapers/googlemapsScraper.js';
import { scrapeJustDial } from '../scrapers/justdialScraper.js';

export const scrapeRouter = Router();

function buildJustDialUrl(category, city = 'Delhi') {
    // Mirrors the pattern from the original script. For production you'd
    // want a lookup table of category -> JustDial's nct code, but this
    // covers the common "search by free text" flow.
    const term = encodeURIComponent(category);
    const slug = category.replace(/\s+/g, '-');
    return `https://www.justdial.com/${city}/${slug}?term=${term}`;
}

// POST /api/scrape  { source: 'maps' | 'justdial', query, targetCount }
scrapeRouter.post('/scrape', (req, res) => {
    const { source, query, targetCount = 50 } = req.body;

    if (!source || !['maps', 'justdial'].includes(source)) {
        return res.status(400).json({ error: 'source must be "maps" or "justdial"' });
    }
    if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'query is required' });
    }

    const job = jobManager.create({ source, query });
    res.status(202).json({ jobId: job.id });

    // Run the scrape in the background — response has already been sent.
    runJob(job.id, source, query, targetCount).catch((err) => {
        jobManager.appendLog(job.id, `Fatal error: ${err.message}`);
        jobManager.setError(job.id, err);
    });
});

async function runJob(jobId, source, query, targetCount) {
    jobManager.setStatus(jobId, 'running');
    jobManager.appendLog(jobId, `Job started (${source}): "${query}"`);

    const onLog = (msg) => jobManager.appendLog(jobId, msg);

    const results =
        source === 'maps'
            ? await scrapeGoogleMaps({ query, targetCount, onLog })
            : await scrapeJustDial({ searchUrl: buildJustDialUrl(query), targetCount, onLog });

    jobManager.setResults(jobId, results);
    jobManager.setStatus(jobId, 'completed');
    jobManager.appendLog(jobId, `Job completed — ${results.length} results`);
}

// GET /api/scrape/jobs — list all jobs (most recent first)
scrapeRouter.get('/scrape/jobs', (req, res) => {
    res.json(jobManager.list());
});

// GET /api/scrape/:id — status + logs + results for one job
scrapeRouter.get('/scrape/:id', (req, res) => {
    const job = jobManager.get(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
});

// GET /api/scrape/:id/logs?since=<index> — only new log lines, for polling
scrapeRouter.get('/scrape/:id/logs', (req, res) => {
    const job = jobManager.get(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    const since = parseInt(req.query.since ?? '0', 10);
    res.json({ logs: job.logs.slice(since), total: job.logs.length, status: job.status });
});

// GET /api/scrape/:id/csv — download results as CSV
scrapeRouter.get('/scrape/:id/csv', (req, res) => {
    const job = jobManager.get(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (!job.results.length) return res.status(400).json({ error: 'No results yet' });

    const headers = Object.keys(job.results[0]);
    const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = job.results.map((r) => headers.map((h) => escape(r[h])).join(','));
    const csv = '\uFEFF' + [headers.join(','), ...rows].join('\n'); // BOM for Excel

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${job.source}-${job.id}.csv"`);
    res.send(csv);
});