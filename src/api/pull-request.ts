import axios from 'axios';

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