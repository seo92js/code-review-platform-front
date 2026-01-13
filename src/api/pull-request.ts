import axios from 'axios';

/**
 * PR 조회
 */
export const getPullRequests = async (repositoryName: string) => {
    try {
        const response = await axios.get('/api/pull-requests', {
            params: { repositoryName },
            withCredentials: true
        });
        
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * PR 변경사항 조회
 */
export const getPullRequestWithChanges = async (repository: string, prNumber: number) => {
    try {
        const response = await axios.get('/api/pull-request/changes', {
            params: { repository, prNumber },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('PR 변경사항 조회 실패:', error);
        throw error;
    }
};


/**
 * 리뷰 요청 API
 */
export const requestReview = async (repository: string, prNumber: number, model?: string) => {
    try {
        await axios.post('/api/pull-request/review', null, {
            params: { repository, prNumber, model },
            withCredentials: true
        })
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * 리뷰 결과 조회 API
 */
export const getReview = async (repository: string, prNumber: number) => {
    try {
        const response = await axios.get('/api/pull-request/review', {
            params: { repository, prNumber },
            withCredentials: true
        });

        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}