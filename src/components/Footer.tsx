import React, { useState } from 'react';

const Footer: React.FC = () => {
    const email = 'seo92js@gmail.com';
    const [copied, setCopied] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);

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
        <>
            <footer className="mt-auto py-4">
                <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
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
                    <span className="text-slate-600">|</span>
                    <button
                        onClick={() => setShowPrivacy(true)}
                        className="hover:text-slate-300 transition-colors cursor-pointer"
                    >
                        privacy
                    </button>
                </div>
            </footer>

            {/* Privacy Modal */}
            {showPrivacy && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={() => setShowPrivacy(false)}
                >
                    <div
                        className="bg-[#0f0f12] border border-white/5 rounded-xl p-6 max-w-md mx-4 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-[13px] font-medium text-white">개인정보처리방침</h2>
                            <button
                                onClick={() => setShowPrivacy(false)}
                                className="text-slate-500 hover:text-white transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5 space-y-4">
                            <p className="text-[12px] text-slate-300">본 서비스는 다음의 정보를 수집합니다</p>
                            <ul className="text-[11px] text-slate-500 space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="mt-0.5">•</span>
                                    <span>GitHub 계정 정보 (OAuth 로그인)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-0.5">•</span>
                                    <span>접속 로그: IP 주소, User-Agent</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-0.5">•</span>
                                    <span>서비스 이용 기록 (페이지 조회)</span>
                                </li>
                            </ul>
                            <p className="text-[10px] text-slate-300 pt-2 ">
                                수집된 정보는 서비스 품질 향상 및 보안 목적으로만 사용됩니다.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Footer;
