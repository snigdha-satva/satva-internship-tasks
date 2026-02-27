import api from "./api";

export const viewProjects = async (page, limit, search) => {
  const params = { _page: page, _limit: limit };
  if (search) params.q = search;
  const response = await api.get("/projects", { params });
  return {
    data: response.data,
    total: parseInt(response.headers["x-total-count"] || "0"),
  };
};

export const getProjectById = async (id) => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

export const addProject = async (data) => {
  const response = await api.post("/projects", data);
  return response.data;
};

export const updateProject = async (id, data) => {
  const response = await api.put(`/projects/${id}`, { id, ...data });
  return response.data;
};

export const deleteProject = async (id) => {
  await api.delete(`/projects/${id}`);
};