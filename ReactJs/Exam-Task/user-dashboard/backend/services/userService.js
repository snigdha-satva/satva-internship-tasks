import bcrypt from "bcryptjs";
import api from "./api";

export const viewUsers = async (page, limit, search) => {
  const params = { _page: page, _limit: limit };
  if (search) params.q = search;
  const response = await api.get("/users", { params });
  return {
    data: response.data,
    total: parseInt(response.headers["x-total-count"] || "0"),
  };
};

export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const addUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const response = await api.post("/users", {
    ...userData,
    password: hashedPassword,
  });
  return response.data;
};

export const updateUser = async (id, name) => {
  const response = await api.patch(`/users/${id}`, { name });
  return response.data;
};

export const deleteUser = async (id) => {
  await api.delete(`/users/${id}`);
};

export const getAllPermissions = async () => {
  const response = await api.get("/permissions");
  return response.data;
};