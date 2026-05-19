export interface PullRequest {
    prNumber: number;
    title: string;
    action: string;
    status: string;
    prState?: 'OPEN' | 'CLOSED' | 'MERGED';
    headSha?: string;
    reviewStartedHeadSha?: string;
    reviewCompletedHeadSha?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ChangedFile {
    filename: string;
    status: string;
    additions: number;
    deletions: number;
    changes: number;
    lines: number;
    sha: string;
    blobUrl: string;
    rawUrl: string;
    contentsUrl: string;
    patch: string;
}

export interface ReviewComment {
    path?: string;
    file?: string;
    line?: number | null;
    codeSnippet?: string;
    body?: string;
    comment?: string;
}

export interface AiReviewResult {
    generalReview: string;
    comments: ReviewComment[];
}
