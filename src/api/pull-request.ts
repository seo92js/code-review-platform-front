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