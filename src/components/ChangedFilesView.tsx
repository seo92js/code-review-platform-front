import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPullRequestWithChanges } from '../api/pull-request';
import LoadingSpinner from './LoadingSpinner';
import type { ChangedFile } from '../types/pullRequest';
import { requestReview, getReview } from '../api/pull-request';
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
                console.error('PR 변경사항 조회 실패:', error);
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
                console.error('리뷰 결과 조회 실패:', error);
                setReviewResult(null);
            }
        };

        fetchReview();
    }, [repo, prNumber]);

    const getFileStatusConfig = (status: string) => {
        switch (status) {
            case 'added':
                return { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/20', label: '추가됨' };
            case 'modified':
                return { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/20', label: '수정됨' };
            case 'removed':
                return { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/20', label: '삭제됨' };
            case 'renamed':
                return { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/20', label: '이름변경' };
            default:
                return { bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-500/20', label: status };
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleBackToPRList}
                            className="flex items-center justify-center w-10 h-10 rounded-xl glass hover:bg-white/10 transition-all duration-200"
                        >
                            <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div>
                            <div className="flex items-center space-x-2 text-sm text-slate-400 mb-1">
                                <span>{owner}/{repo}</span>
                                <span className="text-primary-400">#{prNumber}</span>
                            </div>
                            <h1 className="text-xl sm:text-2xl font-bold text-white">변경사항</h1>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="px-4 py-2.5 text-sm font-medium text-slate-300 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
                        >
                            <option value="gpt-4o-mini">gpt-4o-mini</option>
                        </select>
                        <button
                            onClick={async () => {
                                if (!repo || !prNumber) return;
                                await requestReview(repo, parseInt(prNumber), selectedModel);
                                toast.success('리뷰 요청이 완료되었습니다. 잠시 후 리뷰를 확인해주세요.');
                                navigate(`/repos/${owner}/${repo}`);
                            }}
                            className="group relative inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-primary-500 via-indigo-500 to-primary-600" />
                            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-primary-400 via-indigo-400 to-primary-500 blur-lg" />
                            <span className="relative flex items-center space-x-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>리뷰 요청</span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Changed Files List */}
            {changedFiles.length === 0 ? (
                <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-800/50 mb-4">
                        <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">변경된 파일이 없습니다</h3>
                </div>
            ) : (
                <div className="mb-8 space-y-4">
                    {changedFiles.map((file, index) => {
                        const isExpanded = expandedFiles.has(index);
                        const statusConfig = getFileStatusConfig(file.status);

                        return (
                            <div key={index} className="rounded-2xl overflow-hidden glass transition-all duration-300">
                                <button
                                    onClick={() => toggleFileExpanded(index)}
                                    className={`w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors`}
                                >
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold text-white mb-2 break-all leading-tight font-mono">
                                            {file.filename}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                                                {statusConfig.label}
                                            </span>
                                            <span className="text-xs text-emerald-400 font-medium">+{file.additions}</span>
                                            <span className="text-xs text-rose-400 font-medium">-{file.deletions}</span>
                                            <span className="text-xs text-slate-500">({file.changes} changes)</span>
                                            <span className="text-xs text-slate-500">{file.lines} lines</span>
                                        </div>
                                    </div>
                                    <svg
                                        className={`w-5 h-5 text-slate-400 flex-shrink-0 ml-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {isExpanded && (
                                    <div className="px-5 pb-5 border-t border-white/5">
                                        {/* Patch Content */}
                                        {file.patch && (
                                            <div className="mt-4">
                                                <h4 className="text-xs font-medium text-slate-400 mb-3">변경 내용</h4>
                                                <div className="bg-space-900/50 rounded-xl border border-white/5 overflow-x-auto">
                                                    <div className="p-0">
                                                        {file.patch.split('\n').map((line, lineIndex) => {
                                                            const isAdded = line.startsWith('+');
                                                            const isDeleted = line.startsWith('-');
                                                            const isHeader = line.startsWith('@@');

                                                            let bgColor = 'bg-transparent';
                                                            let textColor = 'text-slate-400';
                                                            let borderColor = '';

                                                            if (isAdded) {
                                                                bgColor = 'bg-emerald-500/10';
                                                                textColor = 'text-emerald-300';
                                                                borderColor = 'border-l-2 border-emerald-500';
                                                            } else if (isDeleted) {
                                                                bgColor = 'bg-rose-500/10';
                                                                textColor = 'text-rose-300';
                                                                borderColor = 'border-l-2 border-rose-500';
                                                            } else if (isHeader) {
                                                                bgColor = 'bg-blue-500/10';
                                                                textColor = 'text-blue-300';
                                                                borderColor = 'border-l-2 border-blue-500';
                                                            }

                                                            return (
                                                                <div key={lineIndex} className={`${bgColor} ${borderColor} px-4 py-0.5 text-xs font-mono text-left`}>
                                                                    <span className={`${textColor} break-all`}>
                                                                        {line || ' '}
                                                                    </span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* File Links */}
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {file.blobUrl && (
                                                <a
                                                    href={file.blobUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-400 bg-blue-500/15 border border-blue-500/20 rounded-lg hover:bg-blue-500/25 transition-colors"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                    파일 보기
                                                </a>
                                            )}
                                            {file.rawUrl && (
                                                <a
                                                    href={file.rawUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/25 transition-colors"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                    Raw 보기
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
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-white">AI 리뷰 결과</h2>
                </div>

                {reviewResult ? (
                    <div className="markdown-body text-left rounded-2xl glass p-6">
                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{reviewResult}</ReactMarkdown>
                    </div>
                ) : (
                    <div className="rounded-2xl glass p-8 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-800 mb-3">
                            <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </div>
                        <p className="text-slate-400">리뷰 결과가 없습니다. 리뷰를 요청해주세요.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChangedFilesView;
