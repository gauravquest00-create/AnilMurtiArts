import apiClient from './apiClient';

export const getCollections = async (params = {}) => {
  return await apiClient.get('/collections', { params });
};

export const getFeaturedCollections = async (limit = 8) => {
  return await apiClient.get('/collections/featured', { params: { limit } });
};

export const getCollectionBySlug = async (slug) => {
  return await apiClient.get(`/collections/${slug}`);
};

export const getRelatedCollections = async (id) => {
  return await apiClient.get(`/collections/${id}/related`);
};
