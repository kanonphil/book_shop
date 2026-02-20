import styles from './BasicLayout.module.css'
import Header from './Header'
import { Outlet } from 'react-router-dom'

////////////////////////////////////////////////////////////////////
// - 일반 회원이 보는 화면의 레이아웃, 상단 헤더만 존재 (2분할 화면) - //
////////////////////////////////////////////////////////////////////

const BasicLayout = () => {
  
  
  return (
    <div className={styles.basic_layout_container}>
      <Header />
      <div style={{marginTop: '20px'}}>
        <Outlet />
      </div>
    </div>
  )
}

export default BasicLayout