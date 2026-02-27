import api from "./api";

export const getEmployees = async (page, limit, search) => {
  const params = { _page: page, _limit: limit };
  if (search) params.q = search;
  const response = await api.get("/employees", { params });
  return {
    data: response.data,
    total: parseInt(response.headers["x-total-count"] || "0"),
  };
};

export const getEmployeeById = async (id) => {
  const response = await api.get(`/employees/${id}`);
  return response.data;
};

export const addEmployee = async (data) => {
  const response = await api.post("/employees", data);
  return response.data;
};

export const updateEmployee = async (id, data) => {
  const response = await api.put(`/employees/${id}`, { id, ...data });
  return response.data;
};

export const deleteEmployee = async (id) => {
  await api.delete(`/employees/${id}`);
};