import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './BookCard.module.css'

const BookCard = ({ book }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/books/${book.bookNum}`)
  }

  return (
    <div className={styles.card} onClick={handleClick}>
      {/* 상품 이미지 */}
      <div className={styles.imageContainer}>
        <img 
          src="/main_react.jpg"
          alt={book.bookTitle}
          className={styles.image}
        />
      </div>

      {/* 도서명 */}
      <h3 className={styles.title}>
        {book.bookTitle}
      </h3>

      {/* 가격 */}
      <p className={styles.price}>
        {book.bookPrice?.toLocaleString()}원
      </p>
    </div>
  )
}

export default BookCard