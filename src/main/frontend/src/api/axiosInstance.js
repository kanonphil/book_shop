import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 요청 인터셉터: 모든 요청에 JWT 토큰 자동 추가
axiosInstance.interceptors.request.use(
  (config) => {
    // sessionStorage 또는 localStorage에서 토큰 가져오기
    const token = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
    
    // 토큰이 있으면 Authorization 헤더에 추가
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization 헤더 추가됨:', config.headers.Authorization.substring(0, 20) + '...');
    } else {
      console.warn('토큰이 없습니다!');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 토큰 만료 등 에러 처리
axiosInstance.interceptors.response.use(
  (response) => {
    // 정상 응답은 그대로 반환
    return response;
  },
  (error) => {
    // 401 Unauthorized - 토큰 만료 또는 인증 실패
    if (error.response?.status === 401) {
      alert('로그인이 만료되었습니다.');
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = '/login';
    }

    if (error.response?.status === 403) {
      alert('이 작업을 수행할 권한이 없습니다.');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;