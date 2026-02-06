import React, { useState } from 'react'
import styles from './ManagerSide.module.css'
import { 
  IoAddCircleOutline, 
  IoCalendarOutline, 
  IoCartOutline, 
  IoChevronDownOutline, 
  IoChevronUpOutline, 
  IoCreateOutline, 
  IoCubeOutline, 
  IoListOutline, 
  IoPeopleOutline, 
  IoPersonOutline, 
  IoReceiptOutline, 
  IoStatsChartOutline, 
  IoStorefrontOutline, 
  IoToggleOutline
} from "react-icons/io5";

const ManagerSide = () => {
  const [openMenu, setOpenMenu] = useState({
    product: true,
    purchase: true,
    member: true
  })

  const toggleMenu = (menu) => {
    setOpenMenu({
      ...openMenu,
      [menu]: !openMenu[menu]
    })
  }

  return (
    <div className={styles.container}>
      {/* 상품관리 */}
      <div className={styles.menu_section}>
        <div 
          className={styles.menu_title}
          onClick={() => toggleMenu('product')}
        >
          <IoStorefrontOutline /> 상품관리
          {openMenu.product ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
        </div>
        {openMenu.product && (
          <ul className={styles.sub_menu}>
            <li><IoListOutline /> 카테고리관리</li>
            <li><IoAddCircleOutline /> 상품등록</li>
            <li><IoCubeOutline /> 상품재고관리</li>
            <li><IoCreateOutline /> 상품정보수정</li>
          </ul>
        )}
      </div>

      {/* 구매관리 */}
      <div className={styles.menu_section}>
        <div 
          className={styles.menu_title}
          onClick={() => toggleMenu('purchase')}
        >
          <IoCartOutline /> 구매관리
          {openMenu.purchase ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
        </div>
        {openMenu.purchase && (
          <ul className={styles.sub_menu}>
            <li><IoReceiptOutline /> 구매내역조회</li>
            <li><IoCalendarOutline /> 월별매출관리</li>
            <li><IoStatsChartOutline /> 주간매출관리</li>
          </ul>
        )}
      </div>
      {/* 회원관리 */}
      <div className={styles.menu_section}>
        <div 
          className={styles.menu_title}
          onClick={() => toggleMenu('member')}
        >
          <IoPeopleOutline /> 회원관리
          {openMenu.member ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
        </div>
        {openMenu.member && (
          <ul className={styles.sub_menu}>
            <li><IoPersonOutline /> 회원정보조회</li>
            <li><IoToggleOutline /> 회원상태변경</li>
          </ul>
        )}
      </div>
    </div>
  )
}

export default ManagerSide