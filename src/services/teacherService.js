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

    const response = await axios.get(`${API_BASE_URL}/teachers/add-teacher`, {
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