import { useState, useEffect, useRef, useCallback } from 'react';

const API_BASE = 'http://localhost:4000/api';

const SOURCES = {
    maps: { label: 'Google Maps', accent: 'text-sky-400', ring: 'ring-sky-400/40', dot: 'bg-sky-400' },
    justdial: { label: 'JustDial', accent: 'text-amber-400', ring: 'ring-amber-400/40', dot: 'bg-amber-400' },
};

const STATUS_STYLES = {
    queued: 'text-slate-400 border-slate-700',
    running: 'text-lime-400 border-lime-400/40',
    completed: 'text-emerald-400 border-emerald-400/40',
    failed: 'text-rose-400 border-rose-400/40',
};

function formatDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

function isUrl(value) {
    return typeof value === 'string' && /^https?:\/\//i.test(value);
}

/** A table cell that copies its raw value on click and shows brief feedback. */
function CopyableCell({ value }) {
    const [copied, setCopied] = useState(false);
    const text = value === undefined || value === null || value === '' ? '' : String(value);

    const handleCopy = async () => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch {
            // clipboard API unavailable — silently ignore
        }
    };

    if (!text) {
        return <span className="text-slate-700">—</span>;
    }

    return (
        <div className="group relative flex items-center gap-1.5">
            {isUrl(text) ? (
                <a
                    href={text}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-sky-400 hover:text-sky-300 underline decoration-sky-400/30 underline-offset-2 whitespace-nowrap"
                >
                    Visit ↗
                </a>
            ) : (
                <span className="truncate" title={text}>
                    {text}
                </span>
            )}
            <button
                onClick={handleCopy}
                title="Copy"
                className="opacity-0 group-hover:opacity-100 transition shrink-0 text-slate-600 hover:text-lime-400"
            >
                {copied ? (
                    <span className="text-[10px] font-mono text-lime-400">copied</span>
                ) : (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                )}
            </button>
        </div>
    );
}

export default function ScraperDashboard() {
    const [source, setSource] = useState('maps');
    const [query, setQuery] = useState('');
    const [targetCount, setTargetCount] = useState(50);
    const [jobId, setJobId] = useState(null);
    const [job, setJob] = useState(null);
    const [logs, setLogs] = useState([]);
    const [starting, setStarting] = useState(false);
    const [elapsedMs, setElapsedMs] = useState(0);
    const [finalDurationMs, setFinalDurationMs] = useState(null);

    const logCursor = useRef(0);
    const logEndRef = useRef(null);
    const pollRef = useRef(null);
    const timerRef = useRef(null);
    const startTimeRef = useRef(null);

    const isRunning = job?.status === 'running' || job?.status === 'queued';

    const startScrape = async () => {
        if (!query.trim()) return;
        setStarting(true);
        setLogs([]);
        setJob(null);
        setFinalDurationMs(null);
        setElapsedMs(0);
        logCursor.current = 0;

        try {
            const res = await fetch(`${API_BASE}/scrape`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ source, query, targetCount: Number(targetCount) }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to start job');

            startTimeRef.current = Date.now();
            setJobId(data.jobId);
        } catch (err) {
            setLogs([`[error] ${err.message}`]);
        } finally {
            setStarting(false);
        }
    };

    const poll = useCallback(async () => {
        if (!jobId) return;
        const [logRes, jobRes] = await Promise.all([
            fetch(`${API_BASE}/scrape/${jobId}/logs?since=${logCursor.current}`),
            fetch(`${API_BASE}/scrape/${jobId}`),
        ]);
        const logData = await logRes.json();
        const jobData = await jobRes.json();

        if (logData.logs?.length) {
            setLogs((prev) => [...prev, ...logData.logs]);
            logCursor.current = logData.total;
        }
        setJob(jobData);

        if (jobData.status === 'completed' || jobData.status === 'failed') {
            clearInterval(pollRef.current);
            if (startTimeRef.current) {
                setFinalDurationMs(Date.now() - startTimeRef.current);
            }
        }
    }, [jobId]);

    // Job status/results polling
    useEffect(() => {
        if (!jobId) return;
        pollRef.current = setInterval(poll, 1500);
        poll();
        return () => clearInterval(pollRef.current);
    }, [jobId, poll]);

    // Elapsed-time ticker — runs only while a job is queued/running
    useEffect(() => {
        if (!isRunning || !startTimeRef.current) {
            clearInterval(timerRef.current);
            return;
        }
        timerRef.current = setInterval(() => {
            setElapsedMs(Date.now() - startTimeRef.current);
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [isRunning]);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const results = job?.results ?? [];
    const columns = results.length ? Object.keys(results[0]) : [];
    const displayedDuration = finalDurationMs ?? elapsedMs;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
            <div className="max-w-6xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="mb-8 flex items-baseline justify-between border-b border-slate-800 pb-6">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
                            Lead Extractor
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Pull business listings from Google Maps or JustDial and export as CSV.
                        </p>
                    </div>
                    <span className="text-xs font-mono text-slate-600">v1.0</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Controls */}
                    <div className="lg:col-span-2 space-y-5">
                        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs uppercase tracking-wider text-slate-500 font-medium">
                                    Source
                                </label>
                                {isRunning && (
                                    <span className="text-[10px] font-mono text-slate-600">locked while running</span>
                                )}
                            </div>
                            <div className="mt-2 grid grid-cols-2 gap-2">
                                {Object.entries(SOURCES).map(([key, cfg]) => (
                                    <button
                                        key={key}
                                        onClick={() => !isRunning && setSource(key)}
                                        disabled={isRunning}
                                        title={isRunning ? 'Cannot switch source while a scrape is running' : ''}
                                        className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition ${
                                            source === key
                                                ? `border-slate-700 bg-slate-800 ${cfg.accent} ring-1 ${cfg.ring}`
                                                : 'border-slate-800 text-slate-500 hover:text-slate-300'
                                        } ${isRunning ? 'opacity-40 cursor-not-allowed hover:text-inherit' : ''}`}
                                    >
                                        <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                                        {cfg.label}
                                    </button>
                                ))}
                            </div>

                            <label className="text-xs uppercase tracking-wider text-slate-500 font-medium mt-5 block">
                                {source === 'maps' ? 'Search query' : 'Category'}
                            </label>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                disabled={isRunning}
                                placeholder={
                                    source === 'maps' ? 'e.g. technology companies in delhi' : 'e.g. software companies'
                                }
                                className="mt-2 w-full rounded-md bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-lime-400/50 focus:border-lime-400/50 disabled:opacity-50"
                            />

                            <label className="text-xs uppercase tracking-wider text-slate-500 font-medium mt-5 block">
                                Target count
                            </label>
                            <input
                                type="number"
                                value={targetCount}
                                onChange={(e) => setTargetCount(e.target.value)}
                                disabled={isRunning}
                                min={1}
                                max={200}
                                className="mt-2 w-32 rounded-md bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-lime-400/50 focus:border-lime-400/50 disabled:opacity-50"
                            />

                            <button
                                onClick={startScrape}
                                disabled={starting || isRunning || !query.trim()}
                                className="mt-6 w-full rounded-md bg-lime-400 text-slate-950 font-medium text-sm py-2.5 transition hover:bg-lime-300 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed"
                            >
                                {isRunning ? 'Running…' : starting ? 'Starting…' : 'Start scrape'}
                            </button>
                        </div>

                        {job && (
                            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-5 space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Status</span>
                                    <span
                                        className={`px-2 py-0.5 rounded border text-xs font-mono ${STATUS_STYLES[job.status]}`}
                                    >
                                        {job.status}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">{isRunning ? 'Elapsed' : 'Time taken'}</span>
                                    <span className="font-mono text-slate-300 tabular-nums">
                                        {formatDuration(displayedDuration)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Results</span>
                                    <span className="font-mono text-slate-300">{results.length}</span>
                                </div>
                                {job.status === 'completed' && results.length > 0 && (
                                    <a
                                        href={`${API_BASE}/scrape/${jobId}/csv`}
                                        className="block text-center mt-2 rounded-md border border-slate-700 py-2 text-xs font-mono text-slate-300 hover:border-lime-400/50 hover:text-lime-400 transition"
                                    >
                                        Download CSV
                                    </a>
                                )}
                                {job.error && <p className="text-rose-400 text-xs font-mono">{job.error}</p>}
                            </div>
                        )}
                    </div>

                    {/* Live log terminal */}
                    <div className="lg:col-span-3">
                        <div className="relative bg-black/60 border border-slate-800 rounded-lg h-72 overflow-hidden">
                            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_0%,rgba(163,230,53,0.02)_50%,transparent_100%)] bg-[length:100%_4px]" />
                            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-950/80">
                                <span className="text-xs font-mono text-slate-500">live log</span>
                                <div className="flex items-center gap-3">
                                    {isRunning && (
                                        <span className="text-xs font-mono text-slate-400 tabular-nums">
                                            {formatDuration(elapsedMs)}
                                        </span>
                                    )}
                                    {isRunning && (
                                        <span className="flex items-center gap-1.5 text-xs font-mono text-lime-400">
                                            <span className="h-1.5 w-1.5 rounded-full bg-lime-400 animate-pulse" />
                                            streaming
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="h-[calc(100%-2.5rem)] overflow-y-auto px-4 py-3 font-mono text-xs leading-relaxed">
                                {logs.length === 0 ? (
                                    <p className="text-slate-600">Logs will appear here once a job starts.</p>
                                ) : (
                                    logs.map((line, i) => (
                                        <p key={i} className="text-slate-400">
                                            {line}
                                        </p>
                                    ))
                                )}
                                <div ref={logEndRef} />
                            </div>
                        </div>

                        {/* Results table */}
                        {results.length > 0 && (
                            <div className="mt-6 bg-slate-900/60 border border-slate-800 rounded-lg overflow-hidden">
                                <div className="px-4 py-2 border-b border-slate-800 text-xs font-mono text-slate-500 flex justify-between">
                                    <span>{results.length} results</span>
                                    <span className="text-slate-600">hover a cell to copy</span>
                                </div>
                                <div className="overflow-x-auto max-h-96 overflow-y-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-900 sticky top-0 z-10">
                                            <tr>
                                                {columns.map((col) => (
                                                    <th
                                                        key={col}
                                                        className="text-left px-4 py-2 text-xs uppercase tracking-wider text-slate-500 font-medium whitespace-nowrap"
                                                    >
                                                        {col}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800 z-8">
                                            {results.map((row, i) => (
                                                <tr key={i} className="border-t border-slate-800/60 hover:bg-slate-800/30">
                                                    {columns.map((col) => (
                                                        
                                                        <td key={col} className="px-4 py-2 text-slate-300 max-w-xs">
                                                            <CopyableCell value={row[col]} />
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}