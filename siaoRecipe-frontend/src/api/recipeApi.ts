import axios from "./axios";
export const recipeApi = {
  getAll: (filter) => axios.get("/recipes", { params: filter }),
  getById: (id) => axios.get(`/recipes/${id}`),
  create: (data) => axios.post("/recipes", data),
  update: (id, data) => axios.patch(`/recipes/${id}`, data),
  delete: (id) => axios.delete(`/recipes/${id}`),
  getByUser: () => axios.get("/recipes/users/me/recipes"),
};
