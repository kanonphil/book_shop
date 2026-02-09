import React, { createContext, useContext, useEffect, useState } from 'react'

// Context 생성
const ThemeContext = createContext()

// Provider 컴포넌트
export const ThemeProvider = ({ children }) => {
  // localStorage에서 이전 설정 불러오기 (없으면 'light')
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light'
  })

  // theme이 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('theme', theme)
    // html 태그에 data-theme 속성 추가
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // 다크모드 토글 함수
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom Hook
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context
}