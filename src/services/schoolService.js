import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gradelink.onrender.com',
  timeout: 20000,
});

// services/schoolService.js
export const registerSchool = async (formData) => {
  try {
    const response = await axios.post('/api/schools/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response;
  } catch (error) {
    // Handle and format the error response consistently
    if (error.response) {
      // The request was made and the server responded with a status code
      throw new Error(error.response.data.message || 'Registration failed');
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please try again.');
    } else {
      // Something happened in setting up the request
      throw new Error('Request setup error: ' + error.message);
    }
  }
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