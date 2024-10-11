import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5555",
  withCredentials: true, // This is important for handling cookies
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redirect to login page or dispatch a logout action
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
