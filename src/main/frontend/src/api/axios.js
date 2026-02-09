import axios from "axios";

const instance = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 요청 인터셉터
instance.interceptors.request.use(
  config => config,
  error => Promise.reject(error)
)

// 응답 인터셉터
instance.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
)

export default instance