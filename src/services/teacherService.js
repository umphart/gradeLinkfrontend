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
  const schoolData = JSON.parse(localStorage.getItem('school'));
  const schoolName = schoolData?.name || '';

  const formData = new FormData();
  formData.append('schoolName', schoolName);
  formData.append('fullName', teacherData.full_name);
  formData.append('department', teacherData.department);
  formData.append('email', teacherData.email || '');
  formData.append('phone', teacherData.phone || '');
  formData.append('gender', teacherData.gender || '');
  
  if (teacherData.photo) {
    formData.append('photo', teacherData.photo);
  }

  const response = await axios.post(`${API_BASE_URL}/add-teacher`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
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