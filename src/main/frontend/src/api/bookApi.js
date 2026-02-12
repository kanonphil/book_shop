import axiosInstance from './axiosInstance';

// const API_BASE_URL = 'http://localhost:8080';

// 도서 등록 (JWT 토큰 자동 추가됨)
export const registerBook = async (bookData) => {
  try {
    const response = await axiosInstance.post('/books', bookData);
    return response.data;
  } catch (error) {
    console.error('도서 등록 실패:', error);
    console.error('에러 응답:', error.response?.data);
    console.error('전송한 데이터:', bookData);
    throw error;
  }
};

// 다른 도서 관련 API들
// 도서 목록 조회
export const getBooks = async () => {
  try {
    const response = await axiosInstance.get('/books');
    return response.data;
  } catch (error) {
    console.error('도서 목록 조회 실패:', error);
    throw error;
  }
};

// 도서 상세 조회
export const getBookById = async (bookId) => {
  try {
    const response = await axiosInstance.get(`/books/${bookId}`);
    return response.data;
  } catch (error) {
    console.error('도서 상세 조회 실패:', error);
    throw error;
  }
};

// 도서 수정
export const updateBook = async (bookId, bookData) => {
  try {
    const response = await axiosInstance.put(`/books/${bookId}`, bookData);
    return response.data;
  } catch (error) {
    console.error('도서 수정 실패:', error);
    throw error;
  }
};

// 도서 삭제
export const deleteBook = async (bookId) => {
  try {
    const response = await axiosInstance.delete(`/books/${bookId}`);
    return response.data;
  } catch (error) {
    console.error('도서 삭제 실패:', error);
    throw error;
  }
};