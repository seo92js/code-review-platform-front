import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPullRequests } from '../api/pull-request';
import { getErrorMessage } from '../utils/errorMessages';
import { toast } from 'react-toastify';
import LoadingSpinner from './LoadingSpinner';
import type { PullRequest } from '../types/pullRequest';

const PullRequestList: React.FC = () => {
    const { owner, repo } = useParams<{ owner: string; repo: string }>();
    const navigate = useNavigate();
    const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPullRequests = async () => {
            if (!owner || !repo) return;

            try {
                setIsLoading(true);
                const data = await getPullRequests(repo);
                setPullRequests(data);
            } catch (error) {
                toast.error(getErrorMessage(error));
            } finally {
                setIsLoading(false);
            }
        };

        fetchPullRequests();
    }, [owner, repo]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return {
                    bg: 'bg-emerald-500/10',
                    text: 'text-emerald-400',
                    border: 'border-emerald-500/20',
                    icon: null,
                    label: '리뷰 완료'
                };
            case 'IN_PROGRESS':
                return {
                    bg: 'bg-blue-500/10',
                    text: 'text-blue-400',
                    border: 'border-blue-500/20',
                    icon: null,
                    label: '리뷰 진행 중'
                };
            case 'PENDING':
                return {
                    bg: 'bg-amber-500/10',
                    text: 'text-amber-400',
                    border: 'border-amber-500/20',
                    icon: null,
                    label: '리뷰 대기 중'
                };
            case 'FAILED':
                return {
                    bg: 'bg-red-500/10',
                    text: 'text-red-400',
                    border: 'border-red-500/20',
                    icon: null,
                    label: '리뷰 실패'
                };
            case 'NEW_CHANGES':
                return {
                    bg: 'bg-purple-500/10',
                    text: 'text-purple-400',
                    border: 'border-purple-500/20',
                    icon: null,
                    label: '새 변경사항'
                };
            default:
                return {
                    bg: 'bg-slate-500/10',
                    text: 'text-slate-400',
                    border: 'border-slate-500/20',
                    icon: null,
                    label: status
                };
        }
    };

    const handlePRClick = (prNumber: number, status: string) => {
        navigate(`/repos/${owner}/${repo}/pulls/${prNumber}`, {
            state: { status }
        });
    };

    const handleBackToRepos = () => {
        navigate('/');
    };

    if (isLoading) {
        return <LoadingSpinner message="PR 목록을 불러오는 중..." />;
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-8">
                <button
                    onClick={handleBackToRepos}
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
                        <span className="text-blue-400 font-medium">{repo}</span>
                    </div>
                    <h1 className="text-xl font-semibold text-white">Pull Requests</h1>
                </div>
            </div>

            {/* PR List */}
            {pullRequests.length === 0 ? (
                <div className="text-center py-20 bg-white/[0.02] rounded-xl border border-white/5">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 mb-4">
                        <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h3 className="text-[15px] font-medium text-white mb-1">PR이 없습니다</h3>
                    <p className="text-[13px] text-slate-500">새로운 Pull Request가 생성되면 이곳에 표시됩니다.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {pullRequests.map((pr) => {
                        const statusConfig = getStatusConfig(pr.status);
                        return (
                            <div
                                key={pr.prNumber}
                                className="group relative rounded-xl transition-all duration-200 bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 cursor-pointer"
                                onClick={() => handlePRClick(pr.prNumber, pr.status)}
                            >
                                <div className="p-5">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            {/* Badges */}
                                            <div className="flex items-center flex-wrap gap-2 mb-2.5">
                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                    #{pr.prNumber}
                                                </span>
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                                                    {statusConfig.icon}
                                                    {statusConfig.label}
                                                </span>
                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
                                                    {pr.action}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-[15px] font-medium text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">
                                                {pr.title}
                                            </h3>

                                            {/* Meta */}
                                            <div className="flex items-center space-x-4 text-[12px] text-slate-500">
                                                <div className="flex items-center space-x-1.5">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span>{formatDate(pr.createdAt)}</span>
                                                </div>
                                                {pr.updatedAt !== pr.createdAt && (
                                                    <div className="flex items-center space-x-1.5">
                                                        <span>•</span>
                                                        <span>수정됨</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        <div className="ml-4 flex-shrink-0 self-center">
                                            <svg className="w-5 h-5 text-slate-600 group-hover:text-slate-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default PullRequestList;