import React from 'react'
import styles from './Managerlayout.module.css'
import ManagerHeader from './ManagerHeader'
import ManagerSide from './ManagerSide'

//////////////////////////////////////////////////////////////////////
// - 매니저가 보는 화면의 레이아웃, 매니저 헤더, 매니저 사이드로 3분할 - //
//////////////////////////////////////////////////////////////////////

const ManagerLayout = () => {
  return (
    <div className={styles.manager_layout_container}>
      <ManagerHeader />
      <div className={styles.main}>
        <div className={styles.side}>
          <ManagerSide />
        </div>
        <div className={styles.content}>본문영역</div>
      </div>
    </div>
  )
}

export default ManagerLayout