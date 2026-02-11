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