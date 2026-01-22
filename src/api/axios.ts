import axios from "axios";
import { toast } from "react-toastify";

/**
 * 세션 만료 시 홈으로 리다이렉트
 * 401/403 에러 발생 시
 * 세션 만료로 인해 OAuth 리다이렉트가 발생하면 CORS 에러(Network Error)가 발생하므로 이 경우도 처리
 */
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthError = error.response?.status === 401 || error.response?.status === 403;

    // Network Error는 OAuth 리다이렉트로 인한 CORS 에러일 수 있음
    const isNetworkError = error.code === 'ERR_NETWORK' || error.message === 'Network Error';

    if (isAuthError || isNetworkError) {
      if (window.location.pathname !== '/') {
        toast.warning('세션이 만료되었습니다. 다시 로그인해주세요.', {
          toastId: 'session-expired',
        });
        
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);
export default axios;
