import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

export const generateQuiz = (payload) => api.post('/api/quiz/generate', payload);
export const submitQuiz   = (payload) => api.post('/api/quiz/submit', payload);
export const getHistory   = ()         => api.get('/api/quiz/history');

export default api;
