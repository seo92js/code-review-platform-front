import axios from './axios';

/**
 * PR 조회
 */
export const getPullRequests = async (owner: string, repo: string) => {
    const response = await axios.get(`/api/pull-request/${owner}/${repo}`, {
        withCredentials: true
    });

    return response.data;
}

/**
 * PR 변경사항 조회
 */
export const getPullRequestWithChanges = async (owner: string, repo: string, prNumber: number) => {
    const response = await axios.get(`/api/pull-request/${owner}/${repo}/${prNumber}/changes`, {
        withCredentials: true
    });
    return response.data;
};


/**
 * 리뷰 요청 API
 */
export const requestReview = async (owner: string, repo: string, prNumber: number, model?: string) => {
    await axios.post(`/api/pull-request/${owner}/${repo}/${prNumber}/review`, null, {
        params: { model },
        withCredentials: true
    });
}

/**
 * 리뷰 결과 조회 API
 */
export const getReview = async (owner: string, repo: string, prNumber: number) => {
    const response = await axios.get(`/api/pull-request/${owner}/${repo}/${prNumber}/review`, {
        withCredentials: true
    });

    return response.data;
}