import axios from 'axios';

export const checkLogin = async () => {
    try {
        const response = await axios.get('/api/github/status', {
            withCredentials: true
        });

        return response.data;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export const getRepositories = async () => {
    try {
        const response = await axios.get('/api/github/repositories', {
            withCredentials: true
        });

        return response.data
    } catch (error) {
        console.error(error);
    }
}

export const getUsername = async () => {
    try {
        const response = await axios.get('/api/github/username', {
            withCredentials: true
        });

        return response.data;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export const registerWebhook = async (repository: string) => {
    try {
        const response = await axios.post('/api/github/register', null, {
            params: { repository },
            withCredentials: true
        });
        
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}