export interface Repository {
    id: number;
    name: string;
    private: boolean;
    description: string;
    html_url: string;
    owner: string;
}

export interface RepositoryResponse {
    repository: Repository;
    hasWebhook: boolean;
    existsOpenPullRequest: boolean;
}
