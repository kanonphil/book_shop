import { createSlice } from '@reduxjs/toolkit'
import { jwtDecode } from 'jwt-decode';

const getInitialState = () => {
  // rememberMe 플래그 확인
  const rememberMe = localStorage.getItem('rememberMe') === 'true'

  let token, userInfo

  if (rememberMe) {
    // 체크했었으면 localStorage에서 가져오기
    token = localStorage.getItem('accessToken')
    userInfo = localStorage.getItem('userInfo')
  } else {
    // 체크 안 했으면 sessionStorage에서만 가져오기
    token = sessionStorage.getItem('accessToken')
    userInfo = sessionStorage.getItem('userInfo')
  }

  if (token === null) return { token: null, member: null, isAuthenticated: false };

  try {
    const decodedToken = jwtDecode(token)
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      // 만료 시 둘 다 삭제
      localStorage.removeItem('accessToken')
      localStorage.removeItem('userInfo')
      localStorage.removeItem('rememberMe')
      sessionStorage.removeItem('accessToken')
      sessionStorage.removeItem('userInfo')
      return { token: null, member: null, isAuthenticated: false };
    }

    return {
      token: token,
      member: userInfo ? JSON.parse(userInfo) : null,
      isAuthenticated: true
    };
  } catch (error) {
    console.error('토큰 디코딩 실패:', error)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('rememberMe')
    sessionStorage.removeItem('accessToken')
    sessionStorage.removeItem('userInfo')
    return { token: null, member: null, isAuthenticated: false };
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    loginReducer: (state, action) => {
      state.token = action.payload.token;
      state.member = action.payload.member;
      state.isAuthenticated = true;
      
      // Login.jsx에서 이미 저장했으므로 여기서는 생략 가능
    },
    logoutReducer: (state) => {
      state.token = null
      state.member = null
      state.isAuthenticated = false
      
      // 둘 다 삭제
      localStorage.removeItem('accessToken')
      localStorage.removeItem('userInfo')
      localStorage.removeItem('rememberMe')
      sessionStorage.removeItem('accessToken')
      sessionStorage.removeItem('userInfo')
    }
  }
})

export const { loginReducer, logoutReducer } = authSlice.actions
export default authSlice.reducer