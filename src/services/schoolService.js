  import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gradelink.onrender.com',
  timeout: 20000,
});

export const registerSchool = async (formData) => {
  try {
    const response = await api.post('/schools/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (!response.data) {
      throw new Error('No data received from server');
    }

    return response.data;

  } catch (error) {
    let errorMessage = 'Registration failed';

    if (error.response) {
      errorMessage = error.response.data?.message ||
                     error.response.statusText ||
                     `Server responded with status ${error.response.status}`;
    } else if (error.request) {
      errorMessage = 'No response from server - the server might be down';
    } else {
      errorMessage = error.message;
    }

    console.error('Registration error details:', {
      error: error,
      config: error.config,
      response: error.response
    });

    throw new Error(errorMessage);
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post('https://gradelink.onrender.com/admins/login', { email, password });

    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    const message =
      error.response?.data?.message || 'Login failed. Please check your credentials.';
    throw new Error(message);
  }
};

export const getSchoolDetails = async (schoolId) => {
  const response = await api.get(`/schools/${schoolId}`);
  return response.data;
};

export const updateSchool = async (schoolId, formData) => {
  const response = await axios.patch(`/schools/${schoolId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const getClasses = async () => {
  const response = await api.get('/schools/classes');
  return response.data;
};

export const getTerms = async () => {
  const response = await api.get('/schools/terms');
  return response.data;
};