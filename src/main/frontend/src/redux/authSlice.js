import { createSlice } from '@reduxjs/toolkit'
import { jwtDecode } from 'jwt-decode';

const getInitialState = () => {
  let token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')
  let userInfo = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo')

  if (token === null) return { token: null, member: null, isAuthenticated: false };

  try {
    const decodedToken = jwtDecode(token)
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      localStorage.removeItem('accessToken')
      sessionStorage.removeItem('accessToken')
      localStorage.removeItem('userInfo')
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
    sessionStorage.removeItem('accessToken')
    localStorage.removeItem('userInfo')
    sessionStorage.removeItem('userInfo')
    return { token: null, member: null, isAuthenticated: false };
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    loginReducer: (state, action) => {
      // 토큰과 사용자 정보 함께 저장
      state.token = action.payload.token;
      state.member = action.payload.member;
      state.isAuthenticated = true;
      
      localStorage.setItem('accessToken', action.payload.token)
      localStorage.setItem('userInfo', JSON.stringify(action.payload.member))
    },
    logoutReducer: (state) => {
      state.token = null
      state.member = null
      state.isAuthenticated = false
      
      localStorage.removeItem('accessToken')
      localStorage.removeItem('userInfo')
    }
  }
})

export const { loginReducer, logoutReducer } = authSlice.actions
export default authSlice.reducer