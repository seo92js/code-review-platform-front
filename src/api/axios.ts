import axios from "axios";
import { toast } from "react-toastify";

/**
 * 401 또는 403 에러가 발생하면 토스트 알림 후 홈으로 리다이렉트
 */
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (window.location.pathname !== '/') {
        toast.warning('세션이 만료되었습니다. 다시 로그인해주세요.', {
          toastId: 'session-expired',
          onClose: () => {
            window.location.href = '/';
          }
        });
      }
    }
    return Promise.reject(error);
  }
);
export default axios;
