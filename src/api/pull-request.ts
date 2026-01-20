import axios from 'axios';

/**
 * PR 조회
 */
export const getPullRequests = async (repositoryId: number) => {
    const response = await axios.get('/api/pull-requests', {
        params: { repositoryId },
        withCredentials: true
    });

    return response.data;
}

/**
 * PR 변경사항 조회
 */
export const getPullRequestWithChanges = async (repositoryId: number, prNumber: number) => {
    const response = await axios.get('/api/pull-request/changes', {
        params: { repositoryId, prNumber },
        withCredentials: true
    });
    return response.data;
};


/**
 * 리뷰 요청 API
 */
export const requestReview = async (repositoryId: number, prNumber: number, model?: string) => {
    await axios.post('/api/pull-request/review', null, {
        params: { repositoryId, prNumber, model },
        withCredentials: true
    });
}

/**
 * 리뷰 결과 조회 API
 */
export const getReview = async (repositoryId: number, prNumber: number) => {
    const response = await axios.get('/api/pull-request/review', {
        params: { repositoryId, prNumber },
        withCredentials: true
    });

    return response.data;
}