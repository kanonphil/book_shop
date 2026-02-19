import React from 'react';
import { IoCaretBackOutline, IoCaretForwardOutline } from 'react-icons/io5';
import styles from './Pagination.module.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className={styles.pagination}>
      <button
        className={styles.arrow}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {/* ◀ */}
        <IoCaretBackOutline />
      </button>
      
      {getPageNumbers().map((page) => (
        <button
          key={page}
          className={`${styles.pageButton} ${
            page === currentPage ? styles.active : ''
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      
      <button
        className={styles.arrow}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {/* ▶ */}
        <IoCaretForwardOutline />
      </button>
    </div>
  );
};

export default Pagination;