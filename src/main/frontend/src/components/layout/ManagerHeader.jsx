import React from 'react'
import styles from './ManagerHeader.module.css'
import { Link, useNavigate } from 'react-router-dom'
import ThemeToggle from '../common/ThemeToggle'

const ManagerHeader = () => {
  const navigate = useNavigate()
  
  return (
    <div className={styles.manager_header_container}>
      <img 
        src="/symbol2.png" 
        className={styles.logo}
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer' }}
      />
      <ul>
        <li><ThemeToggle /></li>
        <li>Login</li>
        <li>
          <Link to="/manage/join">Join</Link>
        </li>
      </ul>
    </div>
  )
}

export default ManagerHeader