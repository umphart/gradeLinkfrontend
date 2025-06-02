import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // API root URL
  headers: {
    'Content-Type': 'application/json'  // Sets JSON headers by default
  }
});

export default api;
  // // Optionally refetch student list
    // const data = await getStudents();
   // setStudents(data);