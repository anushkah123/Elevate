import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 90000,
  headers: { 'Content-Type': 'application/json' },
});

export const generateQuiz = (params) => api.post('/api/quiz/generate', params);
export const generateAdaptive = (params) => api.post('/api/quiz/adaptive', params);
export const checkHealth = () => api.get('/api/health');

export default api;
