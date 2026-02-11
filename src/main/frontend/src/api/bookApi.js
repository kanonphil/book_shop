import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

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