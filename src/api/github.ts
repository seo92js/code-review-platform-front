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
        return [];
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
        return null;
    }
}

/**
 * 웹훅 연결 API
 */
export const registerWebhook = async (repository: string) => {
    const response = await axios.post('/api/github/register', null, {
        params: { repository },
        withCredentials: true
    });

    return response.data;
}

/**
 * 리뷰 요청 API
 */
export const requestReview = async (repository: string, prNumber: number) => {
    await axios.post('/api/pull-request/review', null, {
        params: { repository, prNumber },
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

/**
 * 시스템 프롬프트 조회
 */
export const getSystemPrompt = async () => {
    const response = await axios.get('/api/github/prompt', {
        withCredentials: true
    });
    return response.data;
}

/**
 * 시스템 프롬프트 업데이트
 */
export const updateSystemPrompt = async (prompt: string) => {
    const response = await axios.patch('/api/github/prompt', null, {
        params: { prompt },
        withCredentials: true
    });
    return response.data;
}

/**
 * Ignore 패턴 조회
 */
export const getIgnorePatterns = async () => {
    const response = await axios.get('/api/github/ignore', {
        withCredentials: true
    });
    return response.data;
}

/**
 * Ignore 패턴 업데이트
 */
export const updateIgnorePatterns = async (patterns: string[]) => {
    const response = await axios.patch('/api/github/ignore', patterns, {
        withCredentials: true
    });
    return response.data;
}

/**
 * OpenAI 키 조회
 */
export const getOpenAiKey = async () => {
    const response = await axios.get('/api/github/openai', {
        withCredentials: true
    });
    return response.data;
}

/**
 * OpenAI 키 업데이트
 */
export const updateOpenAiKey = async (key: string) => {
    const response = await axios.patch('/api/github/openai', { key }, {
        withCredentials: true
    });
    return response.data;
}