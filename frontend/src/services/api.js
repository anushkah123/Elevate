import axios from 'axios';

let baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
if (baseURL && !baseURL.startsWith('http')) {
  baseURL = `https://${baseURL}`;
}

const api = axios.create({
  baseURL,
  timeout: 180000, // Increased to 3 minutes for large document processing
  headers: { 'Content-Type': 'application/json' },
});

export const generateQuiz = (params) => {
  if (params.file) {
    const formData = new FormData();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined) formData.append(key, params[key]);
    });
    return api.post('/api/quiz/generate', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
  return api.post('/api/quiz/generate', params);
};

export const generateAdaptive = (params) => api.post('/api/quiz/adaptive', params);
export const checkHealth = () => api.get('/api/health');

export const saveQuiz = (quizData) => api.post('/api/quiz/save', quizData);
export const getQuizHistory = () => api.get('/api/quiz/history');

export default api;
