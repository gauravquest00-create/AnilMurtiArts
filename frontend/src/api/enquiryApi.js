import apiClient from './apiClient';

export const createEnquiry = async (enquiryData) => {
  return await apiClient.post('/enquiries', enquiryData);
};
