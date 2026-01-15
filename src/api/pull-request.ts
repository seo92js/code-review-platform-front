import axios from 'axios';

/**
 * PR 조회
 */
export const getPullRequests = async (repositoryName: string) => {
    const response = await axios.get('/api/pull-requests', {
        params: { repositoryName },
        withCredentials: true
    });

    return response.data;
}

/**
 * PR 변경사항 조회
 */
export const getPullRequestWithChanges = async (repository: string, prNumber: number) => {
    const response = await axios.get('/api/pull-request/changes', {
        params: { repository, prNumber },
        withCredentials: true
    });
    return response.data;
};


/**
 * 리뷰 요청 API
 */
export const requestReview = async (repository: string, prNumber: number, model?: string) => {
    await axios.post('/api/pull-request/review', null, {
        params: { repository, prNumber, model },
        withCredentials: true
    });
}

/**
 * 리뷰 결과 조회 API
 */
export const getReview = async (repository: string, prNumber: number) => {
    const response = await axios.get('/api/pull-request/review', {
        params: { repository, prNumber },
        withCredentials: true
    });

    return response.data;
}