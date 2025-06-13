import axios from 'axios';

const API_URL = 'https://url-shortner-mern-ifrc.onrender.com/api' || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createShortUrl = async (data) => {
  const response = await api.post('/urls', data);
  return response.data;
};

export const getUrlAnalytics = async (code) => {
  const response = await api.get(`/urls/${code}/analytics`);
  return response.data;
};

export const getUrlsByTag = async (tag) => {
  const response = await api.get(`/urls/tags/${tag}`);
  return response.data;
};

export const getAllUrls = async () => {
  const response = await api.get('/urls');
  return response.data;
};

export default api; 