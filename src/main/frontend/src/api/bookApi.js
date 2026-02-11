import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

// 카테고리 목록 조회
export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error('카테고리 조회 실패:', error);
    throw error;
  }
};

// 도서 등록
export const registerBook = async (bookData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/books`, bookData);
    return response.data;
  } catch (error) {
    console.error('도서 등록 실패:', error);
    console.error('에러 응답:', error.response?.data); // 추가
    console.error('전송한 데이터:', bookData); // 추가
    throw error;
  }
};