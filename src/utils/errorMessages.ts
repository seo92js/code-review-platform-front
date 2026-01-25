const ERROR_MESSAGES: Record<string, string> = {
    GITHUB_ACCOUNT_NOT_FOUND: 'GitHub 계정을 찾을 수 없습니다.',
    PULL_REQUEST_NOT_FOUND: 'Pull Request를 찾을 수 없습니다.',
    RUNTIME_EX: '요청 처리 중 오류가 발생했습니다.',
    OPEN_AI_KEY_NOT_SET: 'OpenAI API 키가 설정되지 않았습니다. 설정에서 키를 등록해주세요.',
    INVALID_GITHUB_TOKEN: 'GitHub 토큰이 유효하지 않습니다. 다시 로그인해주세요.',
    SECURITY_VIOLATION: '보안 검증에 실패했습니다.',
    GITHUB_API_ERROR: 'GitHub API 호출 중 오류가 발생했습니다.',
    WEBHOOK_PROCESSING_ERROR: '웹훅 처리 중 오류가 발생했습니다.',
    TOKEN_ENCRYPTION_ERROR: '토큰 암호화 중 오류가 발생했습니다.',
    WEBHOOK_REGISTRATION_ERROR: '웹훅 등록에 실패했습니다.',
};

import axios from 'axios';

export const getErrorMessage = (error: unknown): string => {
    let errorCode: string | undefined;

    if (axios.isAxiosError(error)) {
        errorCode = error.response?.data?.code;
    }

    return (errorCode && ERROR_MESSAGES[errorCode]) || ERROR_MESSAGES.RUNTIME_EX;
};
