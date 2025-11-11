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

    const getFileStatusColor = (status: string) => {
        switch (status) {
            case 'added':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'modified':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'removed':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'renamed':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const getFileStatusText = (status: string) => {
        switch (status) {
            case 'added':
                return '추가됨';
            case 'modified':
                return '수정됨';
            case 'removed':
                return '삭제됨';
            case 'renamed':
                return '이름변경';
            default:
                return status;
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
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* 헤더 */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleBackToPRList}
                            className="flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-300 bg-slate-700/50 border border-slate-600/50 rounded-lg hover:bg-slate-600/50 hover:border-slate-500/50 hover:text-white transition-all duration-200"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-xl font-bold text-white leading-none">PR #{prNumber} - 변경사항</h1>
                    </div>
                        <button
                            onClick={async () => {
                                if (!repo || !prNumber) return;
                                await requestReview(repo, parseInt(prNumber));
                                toast.success('리뷰 요청이 완료되었습니다. 잠시 후 리뷰를 확인해주세요.');
                                navigate(`/repos/${owner}/${repo}`);
                            }}
                            className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-blue-400 bg-blue-500/20 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 hover:border-blue-400 hover:text-blue-300 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>리뷰 요청</span>
                        </button>
                </div>
            </div>

            {/* 변경사항 목록 */}
            {changedFiles.length === 0 ? (
                <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-white mb-2">변경된 파일이 없습니다</h3>
                </div>
            ) : (
                <div className="mb-8 space-y-4">
                    {changedFiles.map((file, index) => {
                        const isExpanded = expandedFiles.has(index);
                        return (
                            <div key={index} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700/50 overflow-hidden hover:shadow-blue-500/20 hover:shadow-2xl transition-all duration-300 hover:border-blue-500/30">
                                <button
                                    onClick={() => toggleFileExpanded(index)}
                                    className={`w-full flex items-center justify-between px-6 text-left ${isExpanded ? 'pt-6 pb-6' : 'py-6'}`}
                                >
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold text-white mb-2">{file.filename}</h3>
                                        <div className="flex items-center space-x-3">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getFileStatusColor(file.status)}`}>
                                                {getFileStatusText(file.status)}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                +{file.additions} -{file.deletions} ({file.changes} 변경)
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {file.lines} 라인
                                            </span>
                                        </div>
                                    </div>
                                    <svg
                                        className={`w-5 h-5 text-gray-400 flex-shrink-0 ml-4 ${isExpanded ? 'transform rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                
                                <div className={`px-6 overflow-hidden ${isExpanded ? 'max-h-[10000px]' : 'max-h-0 pb-0'}`}>
                                    {/* Patch 내용 */}
                                    {file.patch && (
                                        <div className={`mt-4 ${isExpanded ? '' : 'opacity-0 pointer-events-none'}`}>
                                            <h4 className="text-xs font-medium text-gray-300 mb-3">변경 내용:</h4>
                                            <div className="bg-slate-900/50 rounded-lg border border-slate-700/50 overflow-x-auto">
                                                <div className="p-0 min-w-max">
                                                    {file.patch.split('\n').map((line, lineIndex) => {
                                                        const isAdded = line.startsWith('+');
                                                        const isDeleted = line.startsWith('-');
                                                        const isContext = line.startsWith(' ');
                                                        const isHeader = line.startsWith('@@');
                                                        
                                                        let bgColor = 'bg-white';
                                                        let textColor = 'text-gray-800';
                                                        let borderColor = '';
                                                        
                                                        if (isAdded) {
                                                            bgColor = 'bg-green-50';
                                                            textColor = 'text-green-800';
                                                            borderColor = 'border-l-4 border-green-400';
                                                        } else if (isDeleted) {
                                                            bgColor = 'bg-red-50';
                                                            textColor = 'text-red-800';
                                                            borderColor = 'border-l-4 border-red-400';
                                                        } else if (isHeader) {
                                                            bgColor = 'bg-blue-50';
                                                            textColor = 'text-blue-800';
                                                            borderColor = 'border-l-4 border-blue-400';
                                                        } else if (isContext) {
                                                            bgColor = 'bg-gray-50';
                                                            textColor = 'text-gray-600';
                                                        }
                                                        
                                                        return (
                                                            <div key={lineIndex} className={`${bgColor} ${borderColor} px-4 py-1 text-xs font-mono text-left whitespace-nowrap`}>
                                                                <span className={`${textColor}`}>
                                                                    {line}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* 파일 링크 */}
                                    <div className={`mt-4 flex space-x-2 ${isExpanded ? '' : 'opacity-0 pointer-events-none'}`}>
                                        {file.blobUrl && (
                                            <a
                                                href={file.blobUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                파일 보기
                                            </a>
                                        )}
                                        {file.rawUrl && (
                                            <a
                                                href={file.rawUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                Raw 보기
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* 리뷰 결과 */}
            <div className="mt-8">
                <h2 className="text-xl font-bold text-white mb-4">AI 리뷰 결과</h2>
                {reviewResult ? (
                    <div className="markdown-body text-left text-sm bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700/50 p-6 whitespace-pre-wrap">
                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{reviewResult}</ReactMarkdown>
                    </div>
                ) : (
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700/50 p-6 text-center">
                        <p className="text-gray-400">리뷰 결과가 없습니다.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChangedFilesView;
