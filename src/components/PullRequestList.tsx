import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPullRequests } from '../api/pull-request';
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
                console.error('PR 조회 실패:', error);
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
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return {
                    bg: 'bg-emerald-500/15',
                    text: 'text-emerald-400',
                    border: 'border-emerald-500/20',
                    icon: (
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    ),
                    label: '리뷰 완료'
                };
            case 'PENDING':
                return {
                    bg: 'bg-amber-500/15',
                    text: 'text-amber-400',
                    border: 'border-amber-500/20',
                    icon: (
                        <svg className="w-3 h-3 mr-1 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    ),
                    label: '리뷰 대기 중'
                };
            default:
                return {
                    bg: 'bg-slate-500/15',
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleBackToRepos}
                        className="flex items-center justify-center w-10 h-10 rounded-xl glass hover:bg-white/10 transition-all duration-200"
                    >
                        <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <div className="flex items-center space-x-2 text-sm text-slate-400 mb-1">
                            <span>{owner}</span>
                            <span>/</span>
                            <span className="text-primary-400 font-medium">{repo}</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white">Pull Requests</h1>
                    </div>
                </div>
            </div>

            {/* PR List */}
            {pullRequests.length === 0 ? (
                <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-800/50 mb-4">
                        <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">PR 목록이 없습니다</h3>
                    <p className="text-slate-400">Webhook이 연결되지 않았거나 아직 PR이 생성되지 않았습니다</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {pullRequests.map((pr) => {
                        const statusConfig = getStatusConfig(pr.status);
                        return (
                            <div
                                key={pr.prNumber}
                                className="group relative rounded-2xl overflow-hidden glass cursor-pointer hover:scale-[1.01] hover:shadow-glow transition-all duration-500 hover:border-primary-500/30"
                                onClick={() => handlePRClick(pr.prNumber, pr.status)}
                            >
                                {/* Gradient overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-indigo-600/0 group-hover:from-primary-500/5 group-hover:to-indigo-600/5 transition-all duration-500" />

                                <div className="relative p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            {/* Badges */}
                                            <div className="flex items-center flex-wrap gap-2 mb-3">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/15 text-blue-400 border border-blue-500/20">
                                                    #{pr.prNumber}
                                                </span>
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                                                    {statusConfig.icon}
                                                    {statusConfig.label}
                                                </span>
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-500/15 text-primary-400 border border-primary-500/20">
                                                    {pr.action}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-primary-300 transition-colors">
                                                {pr.title}
                                            </h3>

                                            {/* Meta */}
                                            <div className="flex items-center space-x-6 text-sm text-slate-500">
                                                <div className="flex items-center space-x-1.5">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span>생성: {formatDate(pr.createdAt)}</span>
                                                </div>
                                                <div className="flex items-center space-x-1.5">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                    </svg>
                                                    <span>수정: {formatDate(pr.updatedAt)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        <div className="ml-4 flex-shrink-0">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary-500/20 transition-all duration-300">
                                                <svg className="w-5 h-5 text-slate-400 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
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