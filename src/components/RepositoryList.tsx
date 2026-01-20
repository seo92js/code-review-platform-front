import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { checkLogin, getRepositories, getUsername, registerWebhook } from '../api/github';
import { getErrorMessage } from '../utils/errorMessages';
import Header from './Header';
import LoadingSpinner from './LoadingSpinner';
import type { RepositoryResponse } from '../types/repository';

const RepositoryList: React.FC = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);
    const [repositories, setRepositories] = useState<RepositoryResponse[]>([]);
    const [username, setUsername] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    useEffect(() => {
        const savedTime = localStorage.getItem('repoLastUpdated');
        if (savedTime) {
            setLastUpdated(savedTime);
        }
        fetchLoginStatus();
    }, []);

    const fetchLoginStatus = async () => {
        try {
            const status = await checkLogin();
            setIsLogin(status);

            if (status) {
                const repos = await getRepositories();
                const name = await getUsername();

                setUsername(name);
                setRepositories(repos);

                // Update timestamp
                const now = new Date();
                const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                setLastUpdated(timeString);
                localStorage.setItem('repoLastUpdated', timeString);
            }
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    const handleRefresh = async () => {
        if (isRefreshing) return;
        setIsRefreshing(true);
        try {
            await axios.post('/api/github/repositories/refresh');
            await fetchLoginStatus();
            toast.success('저장소 목록을 갱신했습니다.');
        } catch (error) {
            toast.error('저장소 목록 갱신에 실패했습니다.');
            setIsRefreshing(false);
        }
    };

    const handleWebhookConnect = async (repositoryName: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await registerWebhook(repositoryName);
            toast.success('웹훅이 성공적으로 연결되었습니다!');
            setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleCardClick = (owner: string, repositoryName: string, repositoryId: number) => {
        navigate(`/repos/${owner}/${repositoryName}`, { state: { repositoryId } });
    };

    const RepositoryCard = ({ repo, isSkeleton = false }: { repo?: RepositoryResponse; isSkeleton?: boolean }) => {
        return (
            <div
                className={`group relative rounded-xl overflow-hidden transition-all duration-300 border h-[160px] flex flex-col ${isSkeleton
                    ? 'bg-white/[0.02] border-white/5 animate-pulse'
                    : `bg-white/[0.02] border-white/5 cursor-pointer hover:bg-white/[0.04] hover:border-white/10 ${repo!.existsOpenPullRequest
                        ? 'border-emerald-500/50 animate-border-pulse'
                        : ''
                    }`
                    }`}
                onClick={() => !isSkeleton && handleCardClick(repo!.repository.owner, repo!.repository.name, repo!.repository.id)}
            >
                {/* Content */}
                <div className="p-4 flex flex-col h-full">
                    {/* Top row: name + visibility */}
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            {isSkeleton ? (
                                <div className="h-5 bg-white/10 rounded w-3/4"></div>
                            ) : (
                                <h3 className="text-[14px] font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                                    {repo!.repository.name}
                                </h3>
                            )}
                        </div>
                        {!isSkeleton && (
                            <div className="flex items-center space-x-2 ml-3">
                                {repo!.existsOpenPullRequest && (
                                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded border text-emerald-400 border-emerald-500/30 bg-emerald-500/5 animate-pulse">
                                        Open PR
                                    </span>
                                )}
                                <span className={`text-[10px] px-1.5 py-0.5 rounded border text-slate-500 border-slate-600/50`}>
                                    {repo!.repository.private ? 'Private' : 'Public'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="mt-3">
                        {isSkeleton ? (
                            <div className="space-y-2">
                                <div className="h-3 bg-white/5 rounded w-full"></div>
                                <div className="h-3 bg-white/5 rounded w-4/5"></div>
                            </div>
                        ) : (
                            <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-2 text-left">
                                {repo!.repository.description || '설명 없음'}
                            </p>
                        )}
                    </div>

                    {/* Bottom row: webhook status */}
                    <div className="flex items-center pt-3 mt-auto border-t border-white/5">
                        {isSkeleton ? (
                            <div className="h-5 bg-white/5 rounded w-24"></div>
                        ) : (
                            <>
                                {repo!.hasWebhook ? (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (window.confirm('이미 연결된 웹훅입니다. 설정을 갱신하시겠습니까?\n(DB 초기화 등으로 시크릿이 변경된 경우 갱신이 필요합니다.)')) {
                                                handleWebhookConnect(repo!.repository.name, e);
                                            }
                                        }}
                                        className="text-[10px] font-medium px-2 py-1 text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 rounded-md flex items-center hover:bg-emerald-500/10 transition-all cursor-pointer"
                                        title="클릭하여 웹훅 설정 갱신"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                                        Webhook Connected
                                    </button>
                                ) : (
                                    <button
                                        onClick={(e) => handleWebhookConnect(repo!.repository.name, e)}
                                        className="text-[10px] font-medium px-2 py-1 rounded-md text-blue-400 bg-blue-500/15 border border-blue-500/20 hover:bg-blue-500/25 hover:border-blue-500/30 transition-all duration-200"
                                    >
                                        + Webhook Connect
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (isLoading) {
        return <LoadingSpinner message="저장소 목록을 불러오는 중..." />;
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col flex-1">
            <Header isLogin={isLogin} username={username} />

            {isLogin && (
                <>
                    {/* Title bar with settings */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="flex flex-col items-start">
                                <h2 className="text-lg font-medium text-white">Repositories</h2>
                                {lastUpdated && (
                                    <span className="text-[11px] text-slate-500">Updated: {lastUpdated}</span>
                                )}
                            </div>
                            <button
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                className={`p-1.5 rounded-lg transition-all ${isRefreshing
                                    ? 'text-slate-600 bg-slate-800/50 cursor-not-allowed'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                                title="목록 새로고침"
                            >
                                <svg
                                    className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                        </div>

                        <button
                            onClick={() => navigate('/settings')}
                            className="flex items-center space-x-2 px-3 py-1.5 text-[13px] text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>Settings</span>
                        </button>
                    </div>
                </>
            )}

            {/* Not logged in state */}
            {!isLogin && (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 mb-6">
                            <svg className="w-8 h-8 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-medium text-white mb-2">GitHub로 시작하기</h2>
                        <p className="text-[14px] text-slate-500">
                            GitHub 연동으로 PR 코드 리뷰 자동화를 시작하세요
                        </p>
                    </div>
                </div>
            )}

            {/* Repository Grid */}
            {repositories.length !== 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {repositories.map((repo) => (
                        <RepositoryCard key={repo.repository.id} repo={repo} />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {isLogin && repositories.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-slate-500">저장소가 없습니다</p>
                </div>
            )}
        </div>
    );
};

export default RepositoryList;