import React, { useEffect, useState } from 'react'
import BookGrid from '../../components/book/BookGrid'
import { getBookList, getRandomBooks } from '../../api/bookApi'
import styles from './BookList.module.css'
import Pagination from '../../components/common/Pagination'
import { useSearchParams } from 'react-router-dom'
import BestSellerSlider from './BestSellerSlider'

const BookList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // BestSeller
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

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const booksPerPage = 8;

  // URL 쿼리 파라미터에서 페이지 읽기
  useEffect(() => {
    const page = parseInt(searchParams.get('page')) || 1;
    setCurrentPage(page)
  }, [searchParams])

  // 도서 목록 조회
  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await getBookList(currentPage, booksPerPage);
        
        if (response.success) {
          setBooks(response.data.books);
          setTotalPages(response.data.totalPages);
        }
      } catch (error) {
        setError(error.message || '도서 목록을 불러오는데 실패했습니다.');
        console.error('도서 목록 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSearchParams({ page });
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>

      {bestBooks.length > 0 && <BestSellerSlider books={bestBooks} />}

      <h1 className={styles.title}>도서 목록</h1>

      <div style={{flex: 1}}>
        <BookGrid books={books} />
      </div>

      {totalPages > 0 && (
        <div className={styles.paginationWrapper}>
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}

export default BookList