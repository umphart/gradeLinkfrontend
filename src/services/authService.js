import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;  

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const login = async (email, password) => {
  const response = await api.post('/auth/login', {
    email,
    password
  });
  return response.data;
};

export const logout = async () => {
  const token = localStorage.getItem('token');
  await api.post(
    '/auth/logout',
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

export const verifyToken = async (token) => {
  const response = await api.get('/auth/verify', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};