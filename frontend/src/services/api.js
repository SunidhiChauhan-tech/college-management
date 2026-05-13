import axios from "axios";

const API = axios.create({
  baseURL: "https://college-backend-3zd5.onrender.com/api"
});

//  send token as "Bearer <token>" so backend middleware can verify it
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;