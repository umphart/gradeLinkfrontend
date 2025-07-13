// services/teacherService.js
import axios from 'axios';
import api from './api'; 
const API_BASE_URL = 'https://gradelink.onrender.com/api/teachers';

export const getTeachers = async () => {
  const schoolData = JSON.parse(localStorage.getItem('school'));
  const schoolName = schoolData?.name || '';

  const response = await axios.get(API_BASE_URL, {
    params: { schoolName }
  });
  return response.data;
};
export const addTeacher = async (teacherData) => {
  try {
    // Get school data from localStorage
    const schoolData = JSON.parse(localStorage.getItem('school'));
    if (!schoolData || !schoolData.schoolName) {
      throw new Error('School information not found in localStorage');
    }

    // Create FormData object
    const formData = new FormData();
    formData.append('schoolName', schoolData.schoolName);
    formData.append('fullName', teacherData.full_name);
    formData.append('department', teacherData.department);
    formData.append('email', teacherData.email || '');
    formData.append('phone', teacherData.phone || '');
    formData.append('gender', teacherData.gender || '');
    
    if (teacherData.photo) {
      formData.append('photo', teacherData.photo);
    }

    const response = await axios.post(
      'https://gradelink.onrender.com/api/teachers/add-teacher',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Add teacher error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};



// export const createTeacher = async (teacherData) => {
//   const response = await api.post('http://localhost:5000/api/students/add-student',
//      teacherData);
//   return response.data;
// };

export const updateTeacher = async (id, teacherData) => {
  const response = await api.patch(`/teachers/${id}`, teacherData);
  return response.data;
};

export const deleteTeacher = async (id) => {
  const response = await api.delete(`/teachers/${id}`);
  return response.data;
};