import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gradelink.onrender.com',
  timeout: 20000,
});

export const registerSchool = async (formData) => {
  try {
    const response = await api.post('/schools/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // Ensure consistent response format
    return {
      success: true,
      ...response.data
    };
    
  } catch (error) {
    // Return error in consistent format
    return {
      success: false,
      message: error.response?.data?.message || 
              error.message || 
              'Registration failed'
    };
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