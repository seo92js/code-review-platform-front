export interface PullRequest {
    prNumber: number;
    title: string;
    action: string;
    status: string;
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
    file: string;
    line: number;
    comment: string;
}

export interface AiReviewResult {
    generalReview: string;
    comments: ReviewComment[];
}
