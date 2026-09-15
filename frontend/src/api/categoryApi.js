import apiClient from './apiClient';

export const getCategories = async (params = {}) => {
  return await apiClient.get('/categories', { params });
};

export const getCategoryBySlug = async (slug) => {
  return await apiClient.get(`/categories/${slug}`);
};
