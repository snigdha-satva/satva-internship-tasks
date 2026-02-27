import api from "./api";

export const getRoles = async () => {
  const response = await api.get("/roles");
  return response.data;
};

export const getRoleById = async (id) => {
  const response = await api.get(`/roles/${id}`);
  return response.data;
};

export const updateRolePermissions = async (roleId, permissionIds, type) => {
  const role = await getRoleById(roleId);
  let allowed;
  if (type === "grant") {
    allowed = [...new Set([...role.allowed, ...permissionIds])];
  } else {
    allowed = role.allowed.filter((id) => !permissionIds.includes(id));
  }
  const response = await api.patch(`/roles/${roleId}`, { allowed });
  return { roleId, allowed: response.data.allowed };
};