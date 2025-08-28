import { registerWebhook } from '../api/github';

interface RepositoryResponse {
    repository: Repository;
    hasWebhook: boolean;
}

interface Repository {
    id: number;
    name: string;
    private: boolean;
    description: string;
    html_url: string;
    owner: string;
}

interface RepositoryListProps {
    repositories: RepositoryResponse[];
    isLoading?: boolean;
}

const RepositoryList: React.FC<RepositoryListProps> = ({ repositories, isLoading = false }) => {
    
    const RepositoryCard = ({ repo, isSkeleton = false }: { repo?: RepositoryResponse; isSkeleton?: boolean }) => {
        
        const handleWebhookConnect = async (repositoryName: string) => {
            try {
                await registerWebhook(repositoryName);
                alert('웹훅이 성공적으로 연결되었습니다!');
                window.location.reload();
            } catch (error) {
                alert('웹훅 연결에 실패했습니다.');
                console.error('웹훅 연결 오류:', error);
            }
        };
        
        return (
            <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col ${
                !isSkeleton ? 'group hover:shadow-xl transition-all duration-300 hover:-translate-y-1' : 'animate-pulse'
            }`}>
                {/* 헤더 */}
                <div className="p-6 border-b border-gray-50">
                    <div className="flex flex-col items-center space-y-3 mb-3">
                        <div className="flex-1 min-w-0">
                            {isSkeleton ? (
                                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                            ) : (
                                <h3 className="text-black font-bold truncate">
                                    {repo!.repository.name}
                                </h3>
                            )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            {isSkeleton ? (
                                <>
                                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                                </>
                            ) : (
                                <>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        repo!.repository.private 
                                            ? 'bg-red-100 text-red-800 border border-red-200' 
                                            : 'bg-green-100 text-green-800 border border-green-200'
                                    }`}>
                                        {repo!.repository.private ? '🔒 Private' : '🌍 Public'}
                                    </span>
                                    
                                    {repo!.hasWebhook ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                            🔗 Webhook 연결됨
                                        </span>
                                    ) : (
                                        <button 
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200 hover:bg-yellow-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => handleWebhookConnect(repo!.repository.name)}
                                        >
                                           🔗 Webhook 연결
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* 설명 */}
                <div className="p-6 flex-1">
                    {isSkeleton ? (
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                        </div>
                    ) : (
                        <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                            {repo!.repository.description || '저장소에 대한 설명이 없습니다.'}
                        </p>
                    )}
                </div>
                
                {/* 푸터 */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 mt-auto">
                    {isSkeleton ? (
                        <div className="flex items-center justify-between">
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                            <div className="h-8 bg-gray-200 rounded-lg w-24"></div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                <span>{repo!.repository.owner}</span>
                            </div>
                            
                            <a 
                                href={repo!.repository.html_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
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
    
    const renderContent = () => {
        if (isLoading) {
            return (
                <>
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-white-800 mb-2">저장소를 불러오는 중 입니다</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <RepositoryCard isSkeleton={true} />
                        <RepositoryCard isSkeleton={true} />
                        <RepositoryCard isSkeleton={true} />
                    </div>
                </>
            );
        }
        
        return (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {repositories.map((repo) => (
                        <RepositoryCard key={repo.repository.id} repo={repo} />
                    ))}
                </div>
            </>
        );
    };
    
    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {renderContent()}
        </div>
    );
};

export default RepositoryList;