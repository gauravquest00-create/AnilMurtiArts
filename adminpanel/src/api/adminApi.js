import apiClient from './apiClient';

// Auth
export const adminLogin = (email, password) => apiClient.post('/auth/login', { email, password });
export const adminGetMe = () => apiClient.get('/auth/me');
export const adminUpdateProfile = (data) => apiClient.put('/auth/profile', data);
export const adminChangePassword = (data) => apiClient.put('/auth/change-password', data);

// Dashboard
export const getDashboardMetrics = () => apiClient.get('/admin/dashboard');

// Categories
export const getAdminCategories = (params = {}) => apiClient.get('/categories', { params });
export const getAdminCategoryById = (id) => apiClient.get(`/categories/id/${id}`);
export const createAdminCategory = (data) => apiClient.post('/categories', data);
export const updateAdminCategory = (id, data) => apiClient.put(`/categories/${id}`, data);
export const deleteAdminCategory = (id) => apiClient.delete(`/categories/${id}`);

// Collections
export const getAdminCollections = (params = {}) => apiClient.get('/collections', { params });
export const getAdminCollectionById = (id) => apiClient.get(`/collections/id/${id}`);
export const createAdminCollection = (data) => apiClient.post('/collections', data);
export const updateAdminCollection = (id, data) => apiClient.put(`/collections/${id}`, data);
export const deleteAdminCollection = (id) => apiClient.delete(`/collections/${id}`);

// Enquiries
export const getAdminEnquiries = (params = {}) => apiClient.get('/enquiries', { params });
export const getAdminEnquiryById = (id) => apiClient.get(`/enquiries/${id}`);
export const updateAdminEnquiry = (id, data) => apiClient.put(`/enquiries/${id}`, data);
export const deleteAdminEnquiry = (id) => apiClient.delete(`/enquiries/${id}`);

// Upload to Cloudinary
export const uploadImagesToCloudinary = (formData) => {
  return apiClient.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const deleteImageFromCloudinary = (publicId) => {
  return apiClient.post('/upload/delete', { publicId });
};
