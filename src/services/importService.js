// importService.js
import axios from 'axios';

export const uploadStudentsFromExcel = async (formData) => {
  try {
    const response = await axios.post(
      'http://localhost:5000/api/import/students', 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    return response.data;
  } catch (error) {
    
    
    
    
   
    throw error;
  }
};

export const uploadTeachersFromExcel = async (formData) => {
  try {
    const response = await axios.post( 
      'http://localhost:5000/api/import/import-teachers', 
      formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadExamsFromExcel = async (formData) => {
  try {
    const response = await axios.post('http://localhost:5000/api/import/exams', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Add auth token if needed
      }
    });
    return response.data;
  } catch (error) {
    // Enhanced error handling
    const errorData = {
      message: error.response?.data?.message || 'Failed to import exam data',
      status: error.response?.status,
      validationErrors: error.response?.data?.errors,
      requestData: {
        term: formData.get('termName'),
        session: formData.get('sessionName'),
        class: formData.get('className')
      }
    };
    console.error('Exam import error details:', errorData);
    throw errorData;
  }
};
export const uploadSubjectsFromExcel = async (formData) => {
  try {
    const response = await axios.post(
      'http://localhost:5000/api/subjects/import-subjects',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
    console.log(response.data)
  } catch (error) {
    console.error('Full error object:', error);
    console.error('Error response:', error.response);
    throw error;
  }
};