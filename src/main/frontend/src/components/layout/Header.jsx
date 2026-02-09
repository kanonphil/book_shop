import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Header.module.css'
import ThemeToggle from '../common/ThemeToggle'

// 일반 사용자가 보는 페이지의 헤더 영역

const Header = () => {
  return (
    <div>
      <div className={styles.top_menu}>
        <ul>
          <li><ThemeToggle /></li>
          <li>Login</li>
          <li>
            <Link to='/join'>Join</Link>
          </li>
        </ul>
      </div>
      <div className={styles.banner_div}>
        <img 
          src="/book_banner.PNG" 
          className={styles.banner_img}
        />
        <h3 className={styles.banner_title}>
          BOOK SHOP
        </h3>
      </div>
      <div>
        일반 사용자가 보는 메뉴
      </div>
    </div>
  )
}

export default Header