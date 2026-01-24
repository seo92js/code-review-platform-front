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
export const getRules = async (): Promise<Rule[]> => {
    const response = await axios.get('/api/rules', {
        withCredentials: true
    });
    return response.data;
}

/**
 * 룰 생성
 */
export const createRule = async (rule: RuleRequest): Promise<Rule> => {
    const response = await axios.post('/api/rules', rule, {
        withCredentials: true
    });
    return response.data;
}

/**
 * 룰 수정
 */
export const updateRule = async (ruleId: number, rule: RuleRequest): Promise<Rule> => {
    const response = await axios.put(`/api/rules/${ruleId}`, rule, {
        withCredentials: true
    });
    return response.data;
}

/**
 * 룰 삭제
 */
export const deleteRule = async (ruleId: number): Promise<void> => {
    await axios.delete(`/api/rules/${ruleId}`, {
        withCredentials: true
    });
}

/**
 * 룰 토글 (ON/OFF)
 */
export const toggleRule = async (ruleId: number): Promise<Rule> => {
    const response = await axios.patch(`/api/rules/${ruleId}/toggle`, null, {
        withCredentials: true
    });
    return response.data;
}
