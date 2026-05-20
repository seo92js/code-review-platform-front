export interface Repository {
    id: number;
    name: string;
    private: boolean;
    description: string;
    html_url: string;
    owner: string;
    permissions?: {
        admin?: boolean;
        maintain?: boolean;
        push?: boolean;
        pull?: boolean;
        triage?: boolean;
    };
}

export interface RepositoryResponse {
    repository: Repository;
    hasWebhook: boolean;
    existsOpenPullRequest: boolean;
}
