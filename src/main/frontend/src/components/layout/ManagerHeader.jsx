import React from 'react'
import styles from './ManagerHeader.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutReducer } from '../../redux/authSlice'
import ThemeToggle from '../common/ThemeToggle'
import { useAuth } from '../../contexts/AuthContext'

const ManagerHeader = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { member, isAuthenticated } = useSelector((state) => state.auth)
  // const { member, logout } = useAuth()
  // const token = useSelector((state) => state.auth.token)
  
  // 로그아웃 핸들러
  const handleLogout = () => {
    dispatch(logoutReducer())
    // logout()
    alert('로그아웃 되었습니다')
    navigate('/')
  }

  return (
    <div className={styles.manager_header_container}>
      <img 
        src="/symbol2.png" 
        className={styles.logo}
        onClick={() => navigate('/manage')}
        style={{ cursor: 'pointer' }}
      />
      <ul>
        <li><ThemeToggle /></li>
        {isAuthenticated ? (
          <>
            <li>{member.memName}님</li>
            <li onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</li>
          </>
        ) : (
          <>
            <li onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>Login</li>
            <li onClick={() => navigate('/join')} style={{ cursor: 'pointer' }}>Join</li>
          </>
        )}
      </ul>
    </div>
  )
}

export default ManagerHeader