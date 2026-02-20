import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './BookCard.module.css'

const BookCard = ({ book }) => {
  const navigate = useNavigate()

  // 대표 이미지 파일명 가져오기
  const mainImg = book.images?.[0]?.uploadFileName

  const handleClick = () => {
    navigate(`/books/${book.bookNum}`)
  }

  return (
    <div className={styles.card} onClick={handleClick}>
      {/* 상품 이미지 */}
      <div className={styles.imageContainer}>
        <img 
          src={mainImg ? `/upload/${mainImg}` : 'placeholder.jpg'}
          alt={book.bookTitle}
          className={styles.image}
        />
        <div className={styles.overlay}>
          <span className={styles.overlayText}>상세보기</span>
        </div>
      </div>

      <div className={styles.textContainer}>
        {/* 도서명 */}
        <div className={styles.titleWrapper}>
          <h3 className={styles.title}>
            {book.bookTitle}
          </h3>
        </div>
  
        {/* 가격 */}
        <p className={styles.price}>
          {book.bookPrice?.toLocaleString()}원
        </p>
      </div>
    </div>
  )
}

export default BookCard