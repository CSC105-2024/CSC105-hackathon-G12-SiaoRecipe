import axiosInstance from "./axios";
export const userApi = {
  login: (data) =>
    axiosInstance.post("/users/login", data, { withCredentials: true }),
  register: (data) =>
    axiosInstance.post("/users/register", data, { withCredentials: true }),
  logout: () =>
    axiosInstance.post("/users/logout", {}, { withCredentials: true }),
  getCurrentUser: () =>
    axiosInstance.get("/users/me", { withCredentials: true }),
  update: (id, data) =>
    axiosInstance.patch(`/users/${id}`, data, { withCredentials: true }),
  getAll: () =>
    axiosInstance.get("/users", { withCredentials: true }),
  getById: (id) =>
    axiosInstance.get(`/users/${id}`, { withCredentials: true }),
  delete: (id) =>
    axiosInstance.delete(`/users/${id}`, { withCredentials: true }),
};