import axios from "./axios"; 

export const likeApi = {
  like: (recipeId) => axios.post(`/likes/${recipeId}`),

  unlike: (recipeId) => axios.delete(`/likes/${recipeId}`),

  hasLiked: (recipeId) => axios.get(`/likes/${recipeId}/has-liked`),

  getAllLiked: () => axios.get('/likes/user'),

  count: (recipeId) => axios.get(`/likes/${recipeId}/count`),
};
