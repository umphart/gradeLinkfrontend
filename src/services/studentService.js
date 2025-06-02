//src/sevices/studentService.js
import axios from 'axios';


export const getStudents = async () => {
  try {
    const school = JSON.parse(localStorage.getItem('school'));
    const schoolName = school?.name;
    console.log('Fetching students for:', schoolName);

    const response = await axios.get('http://localhost:5000/api/students/students', {
      params: { schoolName }
    });

    const { primary = [], junior = [], senior = [] } = response.data.students;
    const students = [...primary, ...junior, ...senior];

    // Log the students data to check their photo URL
    students.forEach(student => {
      console.log('Student data:', student);
      console.log('Photo URL:', student.photo_url);  // Log photo URL
    });

    return students;
  } catch (error) {
    console.error('Failed to fetch students:', error);
    throw error;
  }
};

export const getStudentProgress = async (id) => {
  return { completed: 70, pending: 30 }; // Replace with real API call
};

export const getUpcomingTasks = async (id) => {
  return [
    { title: 'Math Homework', dueDate: '2025-05-15' },
    { title: 'Science Project', dueDate: '2025-05-20' },
  ];
};




export const getAllStudents = async () => {
};

export const addStudent = async (formData) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
    transformRequest: (data) => data, 
  };

  try {
    const response = await axios.post(
      'http://localhost:5000/api/students/add-student', 
      formData, 
      config
    );
    return response;
  } catch (error) {
    // Enhance error information
    if (error.response) {
      error.message = error.response.data.message || 
                     error.response.data.error || 
                     error.message;
    }
    throw error;
  }
};
export const getStudentsByClass = async () => {
};