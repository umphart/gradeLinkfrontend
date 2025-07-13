import api from './api';
import axios from 'axios';
// services/teacherService.js
export const getTeachers = async () => {
  const schoolData = JSON.parse(localStorage.getItem('school'));
  const schoolName = schoolData?.name || '';

  const response = await axios.get(`http://localhost:5000/api/teachers`, {
    params: { schoolName }
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