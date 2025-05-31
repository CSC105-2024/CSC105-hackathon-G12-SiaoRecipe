import axiosInstance from "./axios";

export const commentApi = {
  create: (data) =>
    axiosInstance.post("/comments", data, { withCredentials: true }),

getByRecipe: (recipeId: number) =>
  axiosInstance.get(`/comments/recipes/${recipeId}/comments`, { withCredentials: true }),

  delete: (id: number) =>
    axiosInstance.delete(`/comments/${id}`, { withCredentials: true }),
};
