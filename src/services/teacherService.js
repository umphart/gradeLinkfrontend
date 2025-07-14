import axios from 'axios';

const API_BASE_URL = 'https://gradelink.onrender.com/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

const uploadClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'multipart/form-data',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

export const getTeachers = async (schoolInfo) => {
  try {
    if (!schoolInfo) {
      schoolInfo = getSchoolInfoFromStorage();
    }
    
    if (!schoolInfo?.name && !schoolInfo?.id) {
      throw new Error('School information not found');
    }

    const response = await apiClient.get('/teachers', {
      params: {
        schoolName: schoolInfo.name,
        schoolId: schoolInfo.id
      }
    });

    return response.data.data || [];
  } catch (error) {
    handleApiError(error, 'fetch teachers');
    throw error;
  }
};

export const addTeacher = async (formData) => {
  try {
    const response = await uploadClient.post('/teachers/add-teacher', formData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'add teacher');
    throw error;
  }
};

// Helper functions
export function getSchoolInfoFromStorage() {
  try {
    const adminData = JSON.parse(localStorage.getItem('admin') || '{}');
    const schoolData = JSON.parse(localStorage.getItem('school') || '{}');
    
    return {
      name: adminData.schoolName || adminData.school || schoolData.schoolName || schoolData.school,
      id: adminData.id || adminData.schoolId || schoolData.id || schoolData.schoolId
    };
  } catch (err) {
    console.error('Error parsing school info:', err);
    return {};
  }
}

function handleApiError(error, action) {
  let message = `Failed to ${action}`;
  
  if (error.code === 'ECONNABORTED') {
    message = 'Request timed out. Please try again.';
  } else if (error.response) {
    message = error.response.data?.message || message;
    if (error.response.status === 504) {
      message = 'Database connection timed out. Please try again.';
    }
  } else if (error.message) {
    message = error.message;
  }

  console.error(`Error ${action}:`, error);
  throw new Error(message);
}