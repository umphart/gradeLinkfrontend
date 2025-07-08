// src/services/schoolService.js
import api from './api';
import axios from 'axios';

export const registerSchool = async (formData) => {
  return await axios.post('http://localhost:5000/api/schools/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};


export const loginUser = async (email,  password) => {
  try {
    const response = await axios.post('http://localhost:5000/api/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getSchoolDetails = async (schoolId) => {
  const response = await api.get(`/schools/${schoolId}`);
  return response.data;
};

export const updateSchool = async (schoolId, formData) => {
  const response = await axios.patch(`/schools/${schoolId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const getClasses = async () => {
  const response = await api.get('/schools/classes');
  return response.data;
};

export const getTerms = async () => {
  const response = await api.get('/schools/terms');
  return response.data;
};