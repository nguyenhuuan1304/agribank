import axios from "axios";

// Tạo một instance của Axios
const axiosInstance = axios.create({
  baseURL: "http://localhost:3001", // URL base của bạn
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Export instance để sử dụng
export default axiosInstance;
