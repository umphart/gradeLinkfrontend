import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const getStudents = async () => {
  try {
    const schoolData = JSON.parse(localStorage.getItem('admin')) || 
                      JSON.parse(localStorage.getItem('user'));
    const schoolName = schoolData?.schoolName;

    if (!schoolName) {
      throw new Error('School name not found in localStorage');
    }

    const response = await axios.get(`${API_BASE_URL}/students`, {
      params: { schoolName }
    });

    const { primary = [], junior = [], senior = [] } = response.data.students;
    return [...primary, ...junior, ...senior];
  } catch (error) {
    console.error('Failed to fetch students:', error);
    throw error;
  }
};

export const addStudent = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/students/add-student`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response;
  } catch (error) {
    console.error('Failed to add student:', error);
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


export const getStudentsByClass = async () => {
};