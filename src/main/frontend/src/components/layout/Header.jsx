import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './Header.module.css'
import ThemeToggle from '../common/ThemeToggle'
import { useAuth } from '../../contexts/AuthContext'

// 일반 사용자가 보는 페이지의 헤더 영역

const Header = () => {
  const navigate = useNavigate()
  const { member, logout } = useAuth()

  // 로그아웃
  const handleLogout = () => {
    logout()
    alert('로그아웃 되었습니다')
    navigate('/')
  }
  
  return (
    <div>
      <div className={styles.top_menu}>
        <ul>
          <li><ThemeToggle /></li>
          {member ? (
            <>
              <li>{member.memName}님</li>
              <li onClick={handleLogout}>Logout</li>
            </>
          ) : (
            <>
              <li onClick={() => navigate('/login')}>Login</li>
              <li onClick={() => navigate('/join')}>Join</li>
            </>
          )}
        </ul>
      </div>
      <div className={styles.banner_div}>
        <img 
          src="/book_banner.PNG" 
          className={styles.banner_img}
          alt="Book Shop Banner"
        />
        <h3 className={styles.banner_title}>
          BOOK SHOP
        </h3>
      </div>
    </div>
  )
}

export default Header