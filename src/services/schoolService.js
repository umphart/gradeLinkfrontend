import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gradelink.onrender.com',
  timeout: 20000,
});

export const registerSchool = async (formData) => {
  try {
    const form = new FormData();
    
    // Append school data
    form.append('school[name]', formData.schoolName);
    form.append('school[email]', formData.email);
    form.append('school[phone]', formData.phone || '');
    form.append('school[address]', formData.address);
    form.append('school[city]', formData.city || '');
    form.append('school[state]', formData.state || '');
    
    // Append admin data
    form.append('admin[firstName]', formData.adminFirstName);
    form.append('admin[lastName]', formData.adminLastName);
    form.append('admin[email]', formData.adminEmail);
    form.append('admin[phone]', formData.adminPhone || '');
    form.append('admin[password]', formData.adminPassword);
    
    // Append logo file if exists
    if (formData.schoolLogo) {
      form.append('schoolLogo', formData.schoolLogo);
    }

    const response = await api.post('/schools/register', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return {
      success: true,
      ...response.data
    };
    
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 
              error.message || 
              'Registration failed'
    };
  }
};