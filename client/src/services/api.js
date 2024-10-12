import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Instead of redirecting, we'll just return the error
      // This allows the calling code to handle the 401 error
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default api;
