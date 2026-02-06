import React from 'react'
import styles from './ManagerHeader.module.css'
import { Link } from 'react-router-dom'

const ManagerHeader = () => {
  return (
    <div className={styles.container}>
      <img 
        src="/logo3.png" 
        className={styles.logo}
      />
      <ul>
        <li>Login</li>
        <li>
          <Link to="/join">Join</Link>
        </li>
      </ul>
    </div>
  )
}

export default ManagerHeader