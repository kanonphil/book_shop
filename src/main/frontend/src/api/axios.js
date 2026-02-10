// axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 요청 인터셉터 - 토큰이 있다면 자동으로 헤더에 추가
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// 응답 인터셉터 - 에러 처리
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // 인증 실패 시 로그인 페이지로 리다이렉트 등
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default instance