import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "https://student-digital-portfolio.onrender.com/api" || 'http://localhost:5000/api',
  withCredentials: true,
});

export default axiosInstance;