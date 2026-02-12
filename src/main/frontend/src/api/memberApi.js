import axios from 'axios';
import axiosInstance from './axiosInstance';
import { store } from '../redux/store';

const API_BASE_URL = 'http://localhost:8080';

// ==================== 회원가입 ====================
export const joinMember = async (memberData) => {
  try {
    const response = await axiosInstance.post('/members/join', memberData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: '회원가입에 실패했습니다.' };
  }
};

// ==================== 이메일 중복 확인 ====================
export const checkEmail = async (email) => {
  try {
    const response = await axiosInstance.get(`/members/check-email/${email}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: '이메일 확인에 실패했습니다.' };
  }
};

export const checkEmailDuplicate = async (email) => {
  try {
    const response = await axiosInstance.get(`/members/check-email/${email}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: '이메일 확인에 실패했습니다.' };
  }
};

// ==================== 로그인 ====================
export const loginMember = async (loginData) => {
  try {
    // 로그인은 axios 직접 사용 (토큰 없이 요청)
    const response = await axios.post(
      `${API_BASE_URL}/member/login`,
      loginData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );

    const data = response.data;

    if (data.success) {
      const member = {
        memEmail: data.memEmail,
        memName: data.memName,
        memRole: data.memRole,
      };

      // localStorage.setItem('userInfo', JSON.stringify(member));

      return {
        data: {
          success: true,
          message: data.message,
          member: member,
          token: data.token  // 토큰 포함
        }
      };
    } else {
      throw new Error(data.message || '로그인에 실패했습니다.');
    }
  } catch (error) {
    throw {
      response: {
        data: {
          success: false,
          message: error.response?.data?.message || '로그인에 실패했습니다.'
        }
      }
    };
  }
};

// ==================== 로그아웃 ====================
export const logout = () => {
  // 둘 다 제거
  localStorage.removeItem('userInfo');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('rememberMe');
  
  sessionStorage.removeItem('userInfo');
  sessionStorage.removeItem('accessToken');
};

// ==================== 회원 정보 조회 ====================
export const getMemberInfo = async (email) => {
  try {
    const response = await axiosInstance.get(`/members/info/${email}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: '회원 정보 조회에 실패했습니다.' };
  }
};

// ==================== 로그인 상태 확인 ====================
export const isLoggedIn = () => {
  const localStorage_userInfo = localStorage.getItem('userInfo');
  const sessionStorage_userInfo = sessionStorage.getItem('userInfo');
  
  return localStorage_userInfo !== null || sessionStorage_userInfo !== null;
};

// ==================== 현재 사용자 정보 가져오기 ====================
export const getCurrentUser = () => {
  // rememberMe 플래그 확인
  const rememberMe = localStorage.getItem('rememberMe') === 'true';
  
  const userInfo = rememberMe 
    ? localStorage.getItem('userInfo')
    : sessionStorage.getItem('userInfo');
    
  return userInfo ? JSON.parse(userInfo) : null;
};

// ==================== 권한 확인 ====================
export const hasRole = (requiredRole) => {
  const userInfo = getCurrentUser();
  if (!userInfo || !userInfo.memRole) return false;

  const role = userInfo.memRole.replace('ROLE_', '');
  return role === requiredRole;
};

export default {
  joinMember,
  checkEmail,
  checkEmailDuplicate,
  loginMember,
  logout,
  getMemberInfo,
  isLoggedIn,
  getCurrentUser,
  hasRole,
};