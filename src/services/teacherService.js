import axios from 'axios';

// Set the base URL for your API
const API_BASE_URL = 'https://gradelink.onrender.com/api'; // or your localhost during development

export const getTeachers = async () => {
  try {
    // Get school data from localStorage
    const schoolData = JSON.parse(localStorage.getItem('school'));
    
    if (!schoolData || !schoolData.schoolName) {
      throw new Error('School information not found in localStorage');
    }

    const response = await axios.get(`${API_BASE_URL}/teachers`, {
      params: { 
        schoolName: schoolData.schoolName 
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching teachers:', error);
    throw error; // Re-throw to handle in components
  }
};

export const addTeacher = async (teacherData) => {
  try {
    const schoolData = JSON.parse(localStorage.getItem('school'));
    
    if (!schoolData || !schoolData.schoolName) {
      throw new Error('School information not found in localStorage');
    }

    const formData = new FormData();
    formData.append('schoolName', schoolData.schoolName);
    formData.append('fullName', teacherData.fullName);
    formData.append('department', teacherData.department);
    formData.append('email', teacherData.email || '');
    formData.append('phone', teacherData.phone || '');
    formData.append('gender', teacherData.gender || '');

    if (teacherData.photo) {
      formData.append('photo', teacherData.photo);
    }

    const response = await axios.post(
      `${API_BASE_URL}/teachers/add-teacher`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error adding teacher:', error);
    throw error;
  }
};

export const updateTeacher = async (id, teacherData) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/teachers/${id}`,
      teacherData
    );
    return response.data;
  } catch (error) {
    console.error('Error updating teacher:', error);
    throw error;
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