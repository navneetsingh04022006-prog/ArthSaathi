import apiClient from './apiClient.js';

export async function fetchRecommendations(applicant) {
  const response = await apiClient.post('/recommendations', { applicant });
  return response.data;
}

export async function fetchFinancialEstimate(schemeId, loanAmount) {
  const response = await apiClient.post('/calculations/emi', { schemeId, loanAmount });
  return response.data;
}

export async function fetchSchemePartners(schemeId, filters = {}) {
  const response = await apiClient.get(`/schemes/${encodeURIComponent(schemeId)}/partners`, {
    params: filters
  });
  return response.data;
}

export async function fetchNearbyPartners(schemeId, search) {
  const response = await apiClient.get(`/schemes/${encodeURIComponent(schemeId)}/partners/nearby`, {
    params: search
  });
  return response.data;
}

export async function extractProfileFromText(prompt) {
  try {
    const response = await apiClient.post('/ai/extract', { prompt });
    return response.data;
  } catch (error) {
    if (error.response?.data) return error.response.data;
    throw error;
  }
}

export async function sendChatMessage(message, context = {}) {
  try {
    const response = await apiClient.post('/ai/chat', { message, context });
    return response.data;
  } catch (error) {
    if (error.response?.data) return error.response.data;
    throw error;
  }
}

export const sendAiChatMessage = sendChatMessage;

export function getApiErrorMessage(error, fallback) {
  return error.response?.data?.error?.message || fallback;
}