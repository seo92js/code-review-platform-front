import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPullRequestWithChanges } from '../api/pull-request';
import LoadingSpinner from './LoadingSpinner';
import type { ChangedFile } from '../types/pullRequest';
import { requestReview, getReview } from '../api/pull-request';
import { getErrorMessage } from '../utils/errorMessages';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

const ChangedFilesView: React.FC = () => {
    const { owner, repo, prNumber } = useParams<{ owner: string; repo: string; prNumber: string }>();
    const navigate = useNavigate();
    const [changedFiles, setChangedFiles] = useState<ChangedFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedFiles, setExpandedFiles] = useState<Set<number>>(new Set());
    const [reviewResult, setReviewResult] = useState<any>(null);
    const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');

    useEffect(() => {
        const fetchChangedFiles = async () => {
            if (!owner || !repo || !prNumber) return;

            try {
                setIsLoading(true);
                const changes = await getPullRequestWithChanges(repo, parseInt(prNumber));
                setChangedFiles(changes);
            } catch (error) {
                toast.error(getErrorMessage(error));
            } finally {
                setIsLoading(false);
            }
        };

        fetchChangedFiles();
    }, [owner, repo, prNumber]);

    useEffect(() => {
        const fetchReview = async () => {
            if (!repo || !prNumber) return;

            try {
                const review = await getReview(repo, parseInt(prNumber));
                setReviewResult(review);
            } catch (error) {
                toast.error(getErrorMessage(error));
                setReviewResult(null);
            }
        };

        fetchReview();
    }, [repo, prNumber]);

    const getFileStatusConfig = (status: string) => {
        switch (status) {
            case 'added':
                return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', label: '추가됨' };
            case 'modified':
                return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', label: '수정됨' };
            case 'removed':
                return { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', label: '삭제됨' };
            case 'renamed':
                return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', label: '이름변경' };
            default:
                return { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20', label: status };
        }
    };

    const handleBackToPRList = () => {
        navigate(`/repos/${owner}/${repo}`);
    };

    const toggleFileExpanded = (index: number) => {
        setExpandedFiles(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    if (isLoading) {
        return <LoadingSpinner message="변경사항을 불러오는 중..." />;
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleBackToPRList}
                            className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div>
                            <div className="flex items-center space-x-2 text-[13px] text-slate-500 mb-0.5">
                                <span>{owner}</span>
                                <span className="text-slate-600">/</span>
                                <span>{repo}</span>
                                <span className="text-slate-600">/</span>
                                <span className="text-blue-400 font-medium">#{prNumber}</span>
                            </div>
                            <h1 className="text-xl font-semibold text-white">변경사항</h1>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="px-3 py-2 text-[13px] font-medium text-slate-300 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all hover:bg-white/10"
                        >
                            <option value="gpt-4o-mini" className="bg-[#1a1a1f]">gpt-4o-mini</option>
                        </select>
                        <button
                            onClick={async () => {
                                if (!repo || !prNumber) return;
                                try {
                                    await requestReview(repo, parseInt(prNumber), selectedModel);
                                    toast.success('리뷰 요청이 완료되었습니다.');
                                    navigate(`/repos/${owner}/${repo}`);
                                } catch (error) {
                                    toast.error(getErrorMessage(error));
                                }
                            }}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-[13px] text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm shadow-blue-500/20"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>리뷰 요청</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Changed Files List */}
            {changedFiles.length === 0 ? (
                <div className="text-center py-20 bg-white/[0.02] rounded-xl border border-white/5">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 mb-4">
                        <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-[15px] font-medium text-white mb-1">변경된 파일이 없습니다</h3>
                </div>
            ) : (
                <div className="mb-8 space-y-3">
                    {changedFiles.map((file, index) => {
                        const isExpanded = expandedFiles.has(index);
                        const statusConfig = getFileStatusConfig(file.status);

                        return (
                            <div key={index} className="rounded-xl overflow-hidden bg-white/[0.02] border border-white/5 transition-all duration-300">
                                <button
                                    onClick={() => toggleFileExpanded(index)}
                                    className={`w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.04] transition-colors`}
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-3 mb-1.5">
                                            <h3 className="text-[13px] font-medium text-slate-200 font-mono break-all">
                                                {file.filename}
                                            </h3>
                                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                                                {statusConfig.label}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <div className="flex items-center space-x-2 text-[11px]">
                                                <span className="text-emerald-400 font-medium">+{file.additions}</span>
                                                <span className="text-rose-400 font-medium">-{file.deletions}</span>
                                            </div>
                                            <span className="text-[11px] text-slate-500">({file.changes} changes, {file.lines} lines)</span>
                                        </div>
                                    </div>
                                    <svg
                                        className={`w-4 h-4 text-slate-500 flex-shrink-0 ml-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {isExpanded && (
                                    <div className="border-t border-white/5 bg-[#0d1117]">
                                        {/* Patch Content */}
                                        {file.patch && (
                                            <div className="overflow-x-auto">
                                                <div className="p-4">
                                                    {file.patch.split('\n').map((line, lineIndex) => {
                                                        const isAdded = line.startsWith('+');
                                                        const isDeleted = line.startsWith('-');
                                                        const isHeader = line.startsWith('@@');

                                                        let bgColor = 'bg-transparent';
                                                        let textColor = 'text-slate-400';

                                                        if (isAdded) {
                                                            bgColor = 'bg-emerald-500/10';
                                                            textColor = 'text-emerald-400';
                                                        } else if (isDeleted) {
                                                            bgColor = 'bg-rose-500/10';
                                                            textColor = 'text-rose-400';
                                                        } else if (isHeader) {
                                                            bgColor = 'bg-blue-500/10';
                                                            textColor = 'text-blue-400';
                                                        }

                                                        return (
                                                            <div key={lineIndex} className={`${bgColor} px-3 py-0.5 text-[12px] font-mono leading-5 text-left flex`}>
                                                                <span className="select-none w-6 text-right mr-4 text-slate-600 opacity-50 text-[11px]">{lineIndex + 1}</span>
                                                                <span className={`${textColor} break-all whitespace-pre-wrap`}>
                                                                    {line || ' '}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* File Links */}
                                        <div className="px-4 py-3 bg-white/[0.02] border-t border-white/5 flex flex-wrap gap-2">
                                            {file.blobUrl && (
                                                <a
                                                    href={file.blobUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-2.5 py-1.5 text-[11px] font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded hover:bg-blue-500/20 transition-colors"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                    Github에서 파일 보기
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* AI Review Result */}
            <div className="mt-8">
                <div className="flex items-center space-x-2 mb-4">
                    <h2 className="text-[15px] font-semibold text-white">AI 리뷰 결과</h2>
                </div>

                {reviewResult ? (
                    <div className="markdown-body text-left rounded-xl bg-white/[0.02] border border-white/5 p-6 text-[13px]">
                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{reviewResult}</ReactMarkdown>
                    </div>
                ) : (
                    <div className="rounded-xl bg-white/[0.02] border border-white/5 p-12 text-center">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 mb-3">
                            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </div>
                        <p className="text-[13px] text-slate-500">리뷰 결과가 없습니다. 리뷰를 요청해주세요.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChangedFilesView;
