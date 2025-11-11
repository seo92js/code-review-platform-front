import axios from 'axios';

/**
 * 로그인 상태 조회 API
 */
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

/**
 * Github 저장소 조회 API
 */
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

/**
 * 사용자 이름 조회 API
 */
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

/**
 * 웹훅 연결 API
 */
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

/**
 * 리뷰 요청 API
 */
export const requestReview = async (repository: string, prNumber: number) => {
    try {
        await axios.post('/api/pull-request/review', null, {
            params: { repository, prNumber },
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

/**
 * 시스템 프롬프트 조회
 */
export const getSystemPrompt = async () => {
    try {
        const response = await axios.get('/api/github/prompt', {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * 시스템 프롬프트 업데이트
 */
export const updateSystemPrompt = async (prompt: string) => {
    try {
        const response = await axios.patch('/api/github/prompt', { 
            params: { prompt },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}