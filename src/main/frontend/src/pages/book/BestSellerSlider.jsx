import React, { useCallback, useEffect, useState } from 'react'
import styles from './BestSellerSlider.module.css'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import { IoCaretBackOutline, IoCaretForwardOutline } from 'react-icons/io5'
import { getBestSellers } from '../../api/bookApi'

const BestSellerSlider = () => {
  const navigate = useNavigate()
  const [books, setBooks] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sliding, setSliding] = useState(false)
  const [direction, setDirection] = useState('next')
  const [isHovered, setIsHovered] = useState(false)
  const visibleCount = 4

  // 베스트셀러 조회
  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await getBestSellers(8)
        console.log('베스트셀러 응답:', response)
        if (response.success) {
          setBooks(response.data)
        }
      } catch (error) {
        console.error('베스트셀러 조회 실패:', error)
      }
    }
    fetchBestSellers()
  }, [])

  const slide = useCallback((dir) => {
    if (sliding || books.length === 0) return
    setDirection(dir)
    setSliding(true)
    setCurrentIndex(prev =>
      dir === 'next'
        ? (prev + 1) % books.length
        : (prev - 1 + books.length) % books.length
    )
    setTimeout(() => setSliding(false), 400)
  }, [sliding, books.length])

  // 자동 슬라이드
  useEffect(() => {
    if (isHovered || books.length === 0) return
    const timer = setInterval(() => slide('next'), 3000)
    return () => clearInterval(timer)
  }, [slide, isHovered, books.length])

  if (books.length === 0) return null

  const visibleBooks = Array.from({ length: visibleCount + 2 }, (_, i) => {
    const bookIndex = (currentIndex - 1 + i + books.length) % books.length
    return { book: books[bookIndex], rank: bookIndex + 1 }
  })

  return (
    <div className={styles.sliderWrapper}>
      <h2 className={styles.title}>Best Top {books.length}</h2>
      <div
        className={styles.sliderContainer}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Button variant='icon' onClick={() => slide('prev')}>
          <IoCaretBackOutline />
        </Button>

        <div className={styles.sliderOuter}>
          <div className={`${styles.bookList} ${sliding ? styles[direction] : ''}`}>
            {visibleBooks.map(({book, rank}, index) => {
              const mainImg = book?.images?.[0]?.uploadFileName
              return (
                <div
                  key={`${currentIndex}-${index}`}
                  className={styles.bookItem}
                  onClick={() => navigate(`/books/${book.bookNum}`)}
                >
                  <span className={styles.rank}>{rank}</span>
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

        <Button variant='icon' onClick={() => slide('next')}>
          <IoCaretForwardOutline />
        </Button>
      </div>
    </div>
  )
}

export default BestSellerSlider