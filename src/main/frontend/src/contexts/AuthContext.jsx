import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // localStorage에서 초기 상태 로드
  const [member, setMember] = useState(() => {
    try {
      const savedMember = localStorage.getItem('userInfo');
      return savedMember ? JSON.parse(savedMember) : null;
    } catch (error) {
      console.error('Failed to parse user info from localStorage:', error);
      localStorage.removeItem('userInfo');
      return null;
    }
  });

  // 로그인
  const login = (memberData) => {
    setMember(memberData);
    localStorage.setItem('userInfo', JSON.stringify(memberData));
  };

  // 로그아웃
  const logout = () => {
    setMember(null);
    localStorage.removeItem('userInfo');
    localStorage.removeItem('accessToken');
  };

  return (
    <AuthContext.Provider value={{ member, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;