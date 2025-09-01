import { useState, useEffect } from 'react';
import { getPullRequests } from '../api/pull-request';

interface PullRequest {
    prNumber: number;
    title: string;
    action: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

interface PullRequestListProps {
    repositoryName: string;
    onBack: () => void;
}

const PullRequestList: React.FC<PullRequestListProps> = ({ repositoryName, onBack }) => {
    const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPullRequests = async () => {
            try {
                const data = await getPullRequests(repositoryName);
                setPullRequests(data);
            } catch (error) {
                console.error('PR 조회 실패:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPullRequests();
    }, [repositoryName]);

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
                return 'bg-green-100 text-green-800 border-green-200';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
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

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">PR 목록을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* 헤더 */}
            <div className="mb-8">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={onBack}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-3xl font-bold text-white">{repositoryName}</h1>
                </div>
            </div>

            {/* PR 목록 */}
            {pullRequests.length === 0 ? (
                <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-white mb-2">PR이 없습니다</h3>
                </div>
            ) : (
                <div className="space-y-4">
                    {pullRequests.map((pr) => (
                        <div key={pr.prNumber} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                            #{pr.prNumber}
                                        </span>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(pr.status)}`}>
                                            {getStatusText(pr.status)}
                                        </span>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                                            {pr.action}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{pr.title}</h3>
                                    <div className="text-sm text-gray-500 space-y-1">
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
