// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:5000/api', // API root URL
//   headers: {
//     'Content-Type': 'application/json'  // Sets JSON headers by default
//   }
// });

// export default api;
//   // // Optionally refetch student list
//     // const data = await getStudents();
//    // setStudents(data);
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  }
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;