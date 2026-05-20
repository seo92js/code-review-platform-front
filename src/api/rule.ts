import axios from './axios';

export interface Rule {
    id: number;
    content: string;
    isEnabled: boolean;
    targetFilePattern?: string;
}

export interface RuleRequest {
    content: string;
    targetFilePattern?: string;
}

/**
 * 룰 목록 조회
 */
export const getRules = async (owner: string, repository: string): Promise<Rule[]> => {
    const response = await axios.get('/api/rules', {
        params: { owner, repository },
        withCredentials: true
    });
    return response.data;
}

/**
 * 룰 생성
 */
export const createRule = async (owner: string, repository: string, rule: RuleRequest): Promise<Rule> => {
    const response = await axios.post('/api/rules', rule, {
        params: { owner, repository },
        withCredentials: true
    });
    return response.data;
}

/**
 * 룰 수정
 */
export const updateRule = async (owner: string, repository: string, ruleId: number, rule: RuleRequest): Promise<Rule> => {
    const response = await axios.put(`/api/rules/${ruleId}`, rule, {
        params: { owner, repository },
        withCredentials: true
    });
    return response.data;
}

/**
 * 룰 삭제
 */
export const deleteRule = async (owner: string, repository: string, ruleId: number): Promise<void> => {
    await axios.delete(`/api/rules/${ruleId}`, {
        params: { owner, repository },
        withCredentials: true
    });
}

/**
 * 룰 토글 (ON/OFF)
 */
export const toggleRule = async (owner: string, repository: string, ruleId: number): Promise<Rule> => {
    const response = await axios.patch(`/api/rules/${ruleId}/toggle`, null, {
        params: { owner, repository },
        withCredentials: true
    });
    return response.data;
}
