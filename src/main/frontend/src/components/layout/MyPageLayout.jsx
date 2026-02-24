import React from 'react'
import Header from './Header'
import styles from './MyPageLayout.module.css'
import BasicSide from './BasicSide'
import { Outlet } from 'react-router-dom'

const MyPageLayout = () => {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.main}>
        <div className={styles.side}>
          <BasicSide />
        </div>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default MyPageLayout