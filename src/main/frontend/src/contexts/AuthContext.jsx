import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [member, setMember] = useState(() => {
    const savedMember = localStorage.getItem('member')
    return savedMember ? JSON.parse(savedMember) : null
  })

  const login = (memberData) => {
    localStorage.setItem('member', JSON.stringify(memberData))
    setMember(memberData)
  }

  const logout = () => {
    localStorage.removeItem('member')
    setMember(null)
  }

  return (
    <AuthContext.Provider value={{ member, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}