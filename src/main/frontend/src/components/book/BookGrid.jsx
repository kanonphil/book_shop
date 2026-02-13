import React from 'react'
import styles from './BookGrid.module.css'
import BookCard from './BookCard'

const BookGrid = ({ books }) => {
  if (!books || books.length === 0) {
    return (
      <div className={styles.empty}>
        <p>등록된 도서가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {books.map((book) => (
        <BookCard 
          key={book.bookNum}
          book={book}
        />
      ))}
    </div>
  )
}

export default BookGrid