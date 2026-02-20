import React, { useEffect, useState } from 'react'
import styles from './BasicLayout.module.css'
import Header from './Header'
import { Outlet } from 'react-router-dom'
import BestSellerSlider from '../../pages/book/BestSellerSlider'
import { getRandomBooks } from '../../api/bookApi'

////////////////////////////////////////////////////////////////////
// - 일반 회원이 보는 화면의 레이아웃, 상단 헤더만 존재 (2분할 화면) - //
////////////////////////////////////////////////////////////////////

const BasicLayout = () => {
  const [bestBooks, setBestBooks] = useState([])

  useEffect(() => {
    const fetchBestBooks = async () => {
      try {
        const response = await getRandomBooks()
        if (response.success) {
          setBestBooks(response.data)
        }
      } catch (error) {
        console.error('베스트세러 조회 실패:', error)
      }
    }
    fetchBestBooks()
  }, [])
  
  return (
    <div className={styles.basic_layout_container}>
      <Header />
      {bestBooks.length > 0 && <BestSellerSlider books={bestBooks} />}
      <div style={{marginTop: '20px'}}>
        <Outlet />
      </div>
    </div>
  )
}

export default BasicLayout