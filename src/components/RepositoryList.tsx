import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkLogin, getRepositories, getUsername, registerWebhook } from '../api/github';
import Header from './Header';
import LoadingSpinner from './LoadingSpinner';
import SystemPromptModal from './SystemPromptModal';
import type { RepositoryResponse } from '../types/repository';

const RepositoryList: React.FC = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);
    const [repositories, setRepositories] = useState<RepositoryResponse[]>([]);
    const [username, setUsername] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);

    useEffect(() => {
        const fetchLoginStatus = async () => {
            try {
                const status = await checkLogin();
                setIsLogin(status);

                if (status) {
                    const repos = await getRepositories();
                    const name = await getUsername();

                    setUsername(name);
                    setRepositories(repos);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLoginStatus();
    }, []);

    const handleWebhookConnect = async (repositoryName: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await registerWebhook(repositoryName);
            alert('웹훅이 성공적으로 연결되었습니다!');
            window.location.reload();
        } catch (error) {
            alert('웹훅 연결에 실패했습니다.');
            console.error('웹훅 연결 오류:', error);
        }
    };

    const handleCardClick = (owner: string, repositoryName: string) => {
        navigate(`/repos/${owner}/${repositoryName}`);
    };

    const RepositoryCard = ({ repo, isSkeleton = false }: { repo?: RepositoryResponse; isSkeleton?: boolean }) => {
    return (
            <div 
                className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border overflow-hidden flex flex-col ${
                    isSkeleton 
                        ? 'border-slate-700/50 animate-pulse' 
                        : `group hover:shadow-blue-500/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer hover:border-blue-500/30 ${
                            repo!.existsOpenPullRequest 
                                ? 'border-1 animate-border-pulse' 
                                : 'border-slate-700/50'
                        }`
                }`}
                onClick={() => !isSkeleton && handleCardClick(repo!.repository.owner, repo!.repository.name)}
            >
                {/* Header section */}
                <div className="p-6 border-b border-slate-700/50">
                    <div className="flex flex-col items-center space-y-3 mb-3">
                        <div className="flex-1 min-w-0">
                            {isSkeleton ? (
                                <div className="h-6 bg-slate-700 rounded w-3/4"></div>
                            ) : (
                                <h3 className="text-white font-bold truncate">
                                    {repo!.repository.name}
                                </h3>
                            )}
                        </div>
                        <div className="flex items-center space-x-2 flex-wrap gap-2">
                            {isSkeleton ? (
                                <>
                                    <div className="h-6 bg-slate-700 rounded-full w-16"></div>
                                    <div className="h-6 bg-slate-700 rounded-full w-20"></div>
                                </>
                            ) : (
                                <>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        repo!.repository.private
                                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    }`}>
                                        {repo!.repository.private ? '🔒 Private' : '🌍 Public'}
                                    </span>
                                    {repo!.hasWebhook ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                            🔗 Webhook 연결됨
                                        </span>
                                    ) : (
                                        <button
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-orange-500/30 hover:border-orange-400 hover:text-orange-300 transition-all duration-200"
                                            onClick={(e) => handleWebhookConnect(repo!.repository.name, e)}
                                        >
                                            🔗 Webhook 연결하기
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Description section */}
                <div className="p-6 flex-1">
                    {isSkeleton ? (
                        <div className="space-y-2">
                            <div className="h-4 bg-slate-700 rounded w-full"></div>
                            <div className="h-4 bg-slate-700 rounded w-5/6"></div>
                            <div className="h-4 bg-slate-700 rounded w-4/6"></div>
                        </div>
                    ) : (
                        <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                            {repo!.repository.description || '저장소에 대한 설명이 없습니다.'}
                        </p>
                    )}
                </div>

                {/* Footer section */}
                <div className="px-6 py-4 bg-slate-800/50 border-t border-slate-700/50 mt-auto">
                    {isSkeleton ? (
                        <div className="flex items-center justify-between">
                            <div className="h-4 bg-slate-700 rounded w-20"></div>
                            <div className="h-8 bg-slate-700 rounded-lg w-24"></div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-sm text-gray-400">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                <span>{repo!.repository.owner}</span>
                            </div>
                            <a
                                href={repo!.repository.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-400 bg-blue-500/20 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 hover:border-blue-400 hover:text-blue-300 transition-all duration-200"
                                onClick={(e) => e.stopPropagation()}
                            >
                                GitHub
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (isLoading) {
        return <LoadingSpinner message="저장소 목록을 불러오는 중..." />;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <Header isLogin={isLogin} username={username} />
            
            {isLogin && (
                <div className="mb-6 flex justify-end">
                    <button
                        onClick={() => setIsPromptModalOpen(true)}
                        className="inline-flex items-center bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 hover:border-purple-400 font-semibold py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        AI 리뷰 설정
                    </button>
                </div>
            )}
            
            {repositories.length !== 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {repositories.map((repo) => (
                        <RepositoryCard key={repo.repository.id} repo={repo} />
                    ))}
                </div>
            )}
            
            <SystemPromptModal 
                isOpen={isPromptModalOpen} 
                onClose={() => setIsPromptModalOpen(false)} 
            />
        </div>
    );
};

export default RepositoryList;