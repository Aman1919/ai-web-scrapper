const API_BASE = 'http://localhost:4000/api';

const SOURCES = {
    maps: { label: 'Google Maps', accent: 'text-sky-400', ring: 'ring-sky-400/40', dot: 'bg-sky-400' },
    justdial: { label: 'JustDial', accent: 'text-amber-400', ring: 'ring-amber-400/40', dot: 'bg-amber-400' },
    internshala:{ label: 'Internshala', accent: 'text-purple-400', ring: 'ring-purple-400/40', dot: 'bg-purple-400' },
};

const STATUS_STYLES = {
    queued: 'text-slate-400 border-slate-700',
    running: 'text-lime-400 border-lime-400/40',
    completed: 'text-emerald-400 border-emerald-400/40',
    failed: 'text-rose-400 border-rose-400/40',
};

export { API_BASE, SOURCES, STATUS_STYLES };