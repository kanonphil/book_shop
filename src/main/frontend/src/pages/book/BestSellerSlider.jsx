import React, { useCallback, useEffect, useState } from 'react'
import styles from './BestSellerSlider.module.css'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import { IoCaretBackOutline, IoCaretForwardOutline } from 'react-icons/io5'

const BestSellerSlider = ({ books }) => {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sliding, setSliding] = useState(false)
  const [direction, setDirection] = useState('next')
  const visibleCount = 4

  const slide = useCallback((dir) => {
    if (sliding) return
    setDirection(dir)
    setSliding(true)
    // 인덱스를 먼저 바꾸고 애니메이션 실행
    setCurrentIndex(prev =>
      dir === 'next'
        ? (prev + 1) % books.length
        : (prev - 1 + books.length) % books.length
    )
    setTimeout(() => setSliding(false), 400)
  }, [sliding, books.length])

  useEffect(() => {
    const timer = setInterval(() => slide('next'), 3000)
    return () => clearInterval(timer)
  }, [slide])

  // visibleBooks는 다시 4개로
  const visibleBooks = Array.from({ length: visibleCount + 2 }, (_, i) =>
    books[(currentIndex - 1 + i + books.length) % books.length]
  )

  return (
    <div className={styles.sliderWrapper}>
      <h2 className={styles.title}>베스트셀러</h2>
      <div className={styles.sliderContainer}>
        <Button
          variant='icon'
          onClick={() => slide('prev')}
        >
          <IoCaretBackOutline />
        </Button>

        <div className={styles.sliderOuter}>
          <div className={`${styles.bookList} ${sliding ? styles[direction] : ''}`}>
            {visibleBooks.map((book, index) => {
              const mainImg = book?.images?.[0]?.uploadFileName
              return (
                <div
                  key={`${currentIndex}-${index}`}
                  className={styles.bookItem}
                  onClick={() => navigate(`/books/${book.bookNum}`)}
                >
                  <span className={styles.rank}>{(currentIndex + index) % books.length + 1}</span>
                  <img
                    src={mainImg ? `/upload/${mainImg}` : '/placeholder.jpg'}
                    alt={book.bookTitle}
                    className={styles.bookImage}
                  />
                  <div className={styles.bookMeta}>
                    <div className={styles.titleWrapper}>
                      <p className={styles.bookTitle}>{book.bookTitle}</p>
                    </div>
                    <p className={styles.bookPrice}>{book.bookPrice?.toLocaleString()}원</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <Button
          variant='icon'
          onClick={() => slide('next')}
        >
          <IoCaretForwardOutline />
        </Button>
      </div>

      {/* <div className={styles.indicators}>
        {books.map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div> */}
    </div>
  )
}

export default BestSellerSlider