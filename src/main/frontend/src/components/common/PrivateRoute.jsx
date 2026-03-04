import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children, roles }) => {
  const { isAuthenticated, member } = useSelector(state => state.auth)

  // 비로그인이면 로그인 페이지로
  if (!isAuthenticated) return <Navigate to='/login' />

  // 권한이 맞지 않으면 메인으로
  if (roles && !roles.includes(member?.memRole)) return <Navigate to='/' />
  
  return children
}

export default PrivateRoute