import apiClient from './apiClient';

export const getCollectionReviews = async (collectionId) => {
  return await apiClient.get(`/reviews/collection/${collectionId}`);
};

export const createReview = async (reviewData) => {
  return await apiClient.post('/reviews', reviewData);
};
