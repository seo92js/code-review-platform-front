import axios from './axios';

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
export const registerWebhook = async (owner: string, repository: string) => {
    const response = await axios.post('/api/github/register', null, {
        params: { owner, repository },
        withCredentials: true
    });

    return response.data;
}

// 리뷰 설정 타입 정의
export type ReviewTone = 'FRIENDLY' | 'STRICT' | 'NEUTRAL';
export type ReviewFocus = 'PRAISE_ONLY' | 'IMPROVEMENT_ONLY' | 'BOTH';
export type DetailLevel = 'CONCISE' | 'STANDARD' | 'DETAILED';

export interface ReviewSettings {
    tone: ReviewTone;
    focus: ReviewFocus;
    detailLevel: DetailLevel;

    autoReviewEnabled: boolean;
    autoPostToGithub: boolean;
    openaiModel: string;
}

/**
 * 리뷰 설정 조회
 */
export const getReviewSettings = async (owner: string, repository: string): Promise<ReviewSettings> => {
    const response = await axios.get('/api/github/review-settings', {
        params: { owner, repository },
        withCredentials: true
    });
    return response.data;
}

/**
 * 리뷰 설정 업데이트
 */
export const updateReviewSettings = async (owner: string, repository: string, settings: ReviewSettings): Promise<number> => {
    const response = await axios.patch('/api/github/review-settings', settings, {
        params: { owner, repository },
        withCredentials: true
    });
    return response.data;
}

/**
 * Ignore 패턴 조회
 */
export const getIgnorePatterns = async (owner: string, repository: string) => {
    const response = await axios.get('/api/github/ignore', {
        params: { owner, repository },
        withCredentials: true
    });
    return response.data;
}

/**
 * Ignore 패턴 업데이트
 */
export const updateIgnorePatterns = async (owner: string, repository: string, patterns: string[]) => {
    const response = await axios.patch('/api/github/ignore', patterns, {
        params: { owner, repository },
        withCredentials: true
    });
    return response.data;
}

/**
 * OpenAI 키 조회
 */
export const getOpenAiKey = async (owner: string, repository: string) => {
    const response = await axios.get('/api/github/openai', {
        params: { owner, repository },
        withCredentials: true
    });
    return response.data;
}

/**
 * OpenAI 키 업데이트
 */
export const updateOpenAiKey = async (owner: string, repository: string, key: string) => {
    const response = await axios.patch('/api/github/openai', { key }, {
        params: { owner, repository },
        withCredentials: true
    });
    return response.data;
}

/**
 * OpenAI 키 유효성 검증
 */
export const validateOpenAiKey = async (key: string): Promise<boolean> => {
    const response = await axios.post('/api/github/openai/validate', { key }, {
        withCredentials: true
    });
    return response.data;
}
