import React from 'react'
import styles from './ManagerHeader.module.css'

const ManagerHeader = () => {
  return (
    <div className={styles.container}>
      <img 
        src="/logo3.png" 
        className={styles.logo}
      />
      <ul>
        <li>Login</li>
        <li>Join</li>
      </ul>
    </div>
  )
}

export default ManagerHeader