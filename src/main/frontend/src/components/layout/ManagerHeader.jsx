import React from 'react'
import styles from './ManagerHeader.module.css'
import { Link } from 'react-router-dom'
import ThemeToggle from '../common/ThemeToggle'

const ManagerHeader = () => {
  return (
    <div className={styles.container}>
      <img 
        src="/logo3.png" 
        className={styles.logo}
      />
      <ul>
        <li><ThemeToggle /></li>
        <li>Login</li>
        <li>
          <Link to="/join">Join</Link>
        </li>
      </ul>
    </div>
  )
}

export default ManagerHeader