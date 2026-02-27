import api from "./api";

export const getAllPermissions = async () => {
  const response = await api.get("/permissions");
  return response.data;
};

export const getPermissionById = async (id) => {
  const response = await api.get(`/permissions/${id}`);
  return response.data;
};