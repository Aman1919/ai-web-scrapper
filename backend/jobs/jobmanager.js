import { randomUUID } from 'crypto';
import { EventEmitter } from 'events';

/**
 * Simple in-memory job store. Swap this for BullMQ/Redis later without
 * touching the route or scraper code — same shape, different backend.
 */
class JobManager extends EventEmitter {
    constructor() {
        super();
        this.jobs = new Map(); // id -> { id, source, query, status, logs, results, error, createdAt }
    }

    create({ source, query }) {
        const id = randomUUID();
        const job = {
            id,
            source, // 'maps' | 'justdial'
            query,
            status: 'queued', // queued | running | completed | failed
            logs: [],
            results: [],
            error: null,
            createdAt: new Date().toISOString(),
        };
        this.jobs.set(id, job);
        return job;
    }

    get(id) {
        return this.jobs.get(id);
    }

    list() {
        return [...this.jobs.values()]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map(({ results, ...meta }) => ({ ...meta, resultCount: results.length }));
    }

    setStatus(id, status) {
        const job = this.jobs.get(id);
        if (!job) return;
        job.status = status;
        this.emit(`update:${id}`, job);
    }

    appendLog(id, message) {
        const job = this.jobs.get(id);
        if (!job) return;
        const line = `[${new Date().toLocaleTimeString()}] ${message}`;
        job.logs.push(line);
        this.emit(`log:${id}`, line);
    }

    setResults(id, results) {
        const job = this.jobs.get(id);
        if (!job) return;
        job.results = results;
    }

    setError(id, error) {
        const job = this.jobs.get(id);
        if (!job) return;
        job.status = 'failed';
        job.error = error?.message || String(error);
        this.emit(`update:${id}`, job);
    }
}

// Singleton — shared across routes
export const jobManager = new JobManager();