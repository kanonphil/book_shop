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
    throw error.response?.data || { message: '도서 등록에 실패했습니다.' };
  }
};

// 다른 도서 관련 API들
// 도서 목록 조회
export const getBookList = async (page = 1, size = 8) => {
  try {
    const response = await axiosInstance.get('/books', {
      params: { page, size }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: '도서 목록 조회에 실패했습니다.' };
  }
};

// 도서 상세 조회
export const getBookDetail = async (bookNum) => {
  try {
    const response = await axiosInstance.get(`/books/${bookNum}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: '도서 상세 조회에 실패했습니다.' };
  }
};

// 카테고리별 조회
export const getBooksByCategory = async (cateNum, page = 1, size = 8) => {
  try {
    const response = await axiosInstance.get(`/books/category/${cateNum}`, {
      params: { page, size }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: '카테고리별 조회에 실패했습니다.' };
  }
};

// 도서 검색
export const searchBooks = async (keyword, page = 1, size = 8) => {
  try {
    const response = await axiosInstance.get('/books/search', {
      params: { keyword, page, size }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: '도서 검색에 실패했습니다.' };
  }
};