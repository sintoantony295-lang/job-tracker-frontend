// import api from "./api";

// export const loginUser = async (userData) => {
//   const response = await api.post("/users/login", userData);
//   return response.data;
// };
import api from "./api";

export const loginUser = async (userData) => {
  const response = await api.post("/users/login", userData);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post("/users/register", userData);
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.put("/users/change-password", passwordData);
  return response.data;
};

export const deleteAccount = async () => {
  const response = await api.delete("/users/delete-account");
  return response.data;
};