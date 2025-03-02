interface Repository {
    id: number;
    name: string;
    fullName: string;
    private: boolean;
    description: string;
    html_url: string;
}

interface RepositoryListProps {
    repositories: Repository[];
}

const RepositoryList: React.FC<RepositoryListProps> = ({ repositories }) => {
    return (
        <div className="max-w-4xl mx-auto">
            <ul className="space-y-4">
                {repositories.map((repo) => (
                    <li key={repo.id} className="repository-item p-4 border rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                        <div>
                            <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-lg font-medium text-blue-600 hover:text-blue-800">
                                {repo.name}
                            </a>

                            <span className={`text-sm ${repo.private ? 'text-red-500' : 'text-green-500'}`}>
                                {repo.private ? ' <Private>' : ' <Public>'}
                            </span>
                        </div>
                        <p className="text-gray-600 mt-2">{repo.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default RepositoryList;