import api from "./api";

export const loginUser = async (userData) => {
  const response = await api.post("/users/login", userData);
  return response.data;
};