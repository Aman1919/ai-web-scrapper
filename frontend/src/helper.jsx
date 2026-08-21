import {useState} from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export function formatDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}



/** A table cell that copies its raw value on click and shows brief feedback. */
export function CopyableCell({ value }) {




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


 function isUrl(value) {
    return typeof value === 'string' && /^https?:\/\//i.test(value);
}


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
