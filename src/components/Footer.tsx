import React, { useState } from 'react';

const Footer: React.FC = () => {
    const email = 'seo92js@gmail.com';
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <footer className="mt-auto py-4">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <span>contact:</span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-slate-700/50 transition-colors cursor-pointer"
                    title="클릭하면 복사됩니다"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-slate-400">{email}</span>
                    {copied && (
                        <span className="text-emerald-400 text-xs ml-1">복사됨</span>
                    )}
                </button>
            </div>
        </footer>
    );
};

export default Footer;
