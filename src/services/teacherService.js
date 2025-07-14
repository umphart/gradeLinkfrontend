import axios from 'axios';

const API_BASE_URL = 'https://gradelink.onrender.com/api';

export const getTeachers = async () => {
  try {
    // Get school data from localStorage with fallbacks
    const adminData = JSON.parse(localStorage.getItem('admin') || '{}');
    const schoolData = JSON.parse(localStorage.getItem('school') || '{}');
    
    const schoolName = adminData.schoolName || adminData.school || 
                      schoolData.schoolName || schoolData.school;

    if (!schoolName) {
      throw new Error('School information not found in localStorage');
    }

    const response = await axios.get(`${API_BASE_URL}/teachers`, {
      params: { 
        schoolName: schoolName 
      },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch teachers');
    }

    return response.data.data || [];

  } catch (error) {
    console.error('Error fetching teachers:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch teachers');
  }
};

export const addTeacher = async (teacherData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/teachers/add-teacher`,
      teacherData,
      {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        timeout: 10000
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to add teacher');
    }

    return response.data;

  } catch (error) {
    console.error('Error adding teacher:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to add teacher');
  }
};


export const deleteTeacher = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/teachers/${id}`
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting teacher:', error);
    throw error;
  }
};