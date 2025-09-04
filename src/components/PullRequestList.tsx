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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'PENDING':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return '리뷰 완료';
            case 'PENDING':
                return '리뷰 대기 중';
            default:
                return status;
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
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* 헤더 */}
            <div className="mb-8">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleBackToRepos}
                        className="flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-300 bg-slate-700/50 border border-slate-600/50 rounded-lg hover:bg-slate-600/50 hover:border-slate-500/50 hover:text-white transition-all duration-200"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-bold text-white leading-none">{repo} - pull requests</h1>
                </div>
            </div>

            {/* PR 목록 */}
            {pullRequests.length === 0 ? (
                <div className="text-center py-12">
                    <h3 className="text-base font-medium text-white mb-2">PR 목록이 없거나 Webhook이 연결되지 않았습니다</h3>
                </div>
            ) : (
                <div className="space-y-4">
                    {pullRequests.map((pr) => (
                        <div 
                            key={pr.prNumber} 
                            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700/50 p-6 hover:shadow-blue-500/20 hover:shadow-2xl transition-all duration-300 cursor-pointer hover:border-blue-500/30 hover:-translate-y-1"
                            onClick={() => handlePRClick(pr.prNumber, pr.status)}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                            #{pr.prNumber}
                                        </span>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(pr.status)}`}>
                                            {getStatusText(pr.status)}
                                        </span>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                                            {pr.action}
                                        </span>
                                    </div>
                                    <h3 className="text-l font-semibold text-white mb-2">{pr.title}</h3>
                                    <div className="text-xs text-gray-400 space-y-1">
                                        <p>생성: {formatDate(pr.createdAt)}</p>
                                        <p>수정: {formatDate(pr.updatedAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PullRequestList;