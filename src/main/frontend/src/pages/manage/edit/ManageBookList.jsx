import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBookList } from '../../../api/bookApi'
import styles from './ManageBookList.module.css'
import Button from '../../../components/common/Button'
import { IoCreateOutline } from 'react-icons/io5'
import Pagination from '../../../components/common/Pagination'

const ManageBookList = () => {
  const navigate = useNavigate()
  const [books, setBooks] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const fetchBooks = useCallback(async (page = currentPage) => {
    setLoading(true)
    try {
      const response = await getBookList(page, 10)
      setBooks(response.data.books)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      alert('도서 목록 조회에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }, [currentPage])

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }
  
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>상품 정보 수정</h2>

      {loading ? (
        <p className={styles.loading}>로딩 중...</p>
      ) : (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>번호</th>
                <th>도서명</th>
                <th>저자</th>
                <th>가격</th>
                <th>카테고리</th>
                <th>수정</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book.bookNum}>
                  <td>{book.bookNum}</td>
                  <td>{book.bookTitle}</td>
                  <td>{book.author}</td>
                  <td>{book.bookPrice?.toLocaleString()}원</td>
                  <td>{book.cateName}</td>
                  <td>
                    <Button
                      onClick={() => navigate(`/manage/book-edit/${book.bookNum}`)}
                    >
                      <IoCreateOutline /> 수정
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  )
}

export default ManageBookList