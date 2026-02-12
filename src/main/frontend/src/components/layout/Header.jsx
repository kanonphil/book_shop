import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutReducer } from '../../redux/authSlice'
import styles from './Header.module.css'
import ThemeToggle from '../common/ThemeToggle'
// import { useAuth } from '../../contexts/AuthContext'

// 일반 사용자가 보는 페이지의 헤더 영역

const Header = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  // const { member, logout } = useAuth()
  // const token = useSelector((state) => state.auth.token)  // Redux에서 토큰 가져오기

  // Redux에서 사용자 정보 가져오기
  const { member, isAuthenticated } = useSelector((state) => state.auth)

  // 로그아웃
  const handleLogout = () => {
    dispatch(logoutReducer())  // Redux에서 토큰 제거
    // logout()
    alert('로그아웃 되었습니다')
    navigate('/')
  }
  
  return (
    <div>
      <div className={styles.top_menu}>
        <img 
          src="/symbol2.png" 
          className={styles.logo}
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        />
        <ul>
          <li><ThemeToggle /></li>
          {isAuthenticated ? (
            <>
              <li>{member.memName}님</li>
              <li>반갑습니다</li>
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