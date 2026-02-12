import axiosInstance from './axiosInstance';

// const API_BASE_URL = 'http://localhost:8080';

// 카테고리 목록 조회
export const getCategories = async () => {
  try {
    const response = await axiosInstance.get('/categories');
    return response.data;
  } catch (error) {
    console.error('카테고리 조회 실패:', error);
    throw error;
  }
};

// 다른 카테고리 관련 API들
// 카테고리 등록
export const createCategory = async (categoryData) => {
  try {
    const response = await axiosInstance.post('/categories', categoryData);
    return response.data;
  } catch (error) {
    console.error('카테고리 등록 실패:', error);
    throw error;
  }
};

// 카테고리 수정
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const response = await axiosInstance.put(`/categories/${categoryId}`, categoryData);
    return response.data;
  } catch (error) {
    console.error('카테고리 수정 실패:', error);
    throw error;
  }
};

// 카테고리 삭제
export const deleteCategory = async (categoryId) => {
  try {
    const response = await axiosInstance.delete(`/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('카테고리 삭제 실패:', error);
    throw error;
  }
};