import axios from "axios";

/**
 * 401 또는 403 에러가 발생하면 로그인 페이지로 리다이렉트
 */
axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        window.location.href = '/oauth2/authorization/github';
      }
      return Promise.reject(error);
    }
);