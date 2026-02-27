import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addProject, updateProject, viewProjects, deleteProject } from "../../../../backend/services/projectServices";

const initialState = {
  projects: [],
  total: 0,
  loading: false,
  error: null,
  page: 1,
  limit: 5,
  searchTerm: "",
  refetchTrigger: 0,
};

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async ({ page, limit, searchTerm }) => {
    return await viewProjects(page, limit, searchTerm);
  }
);

export const createProject = createAsyncThunk(
  "projects/addProject",
  async (projectData) => {
    return await addProject(projectData);
  }
);

export const editProject = createAsyncThunk(
  "projects/updateProject",
  async ({ id, data }) => {
    return await updateProject(id, data);
  }
);

export const removeProject = createAsyncThunk(
  "projects/deleteProject",
  async (id) => {
    await deleteProject(id);
    return id;
  }
);

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjectsPage: (state, action) => { state.page = action.payload; },
    setProjectsSearch: (state, action) => {
      const nextSearch = action.payload ?? "";
      if (state.searchTerm !== nextSearch) {
        state.searchTerm = nextSearch;
        state.page = 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.projects = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchProjects.rejected, (state) => { state.loading = false; state.error = "Failed to fetch data"; })
      .addCase(createProject.fulfilled, (state) => {
        state.page = 1;
        state.refetchTrigger += 1;
      })
      .addCase(editProject.fulfilled, (state, action) => {
        const idx = state.projects.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.projects[idx] = action.payload;
        state.refetchTrigger += 1;
      })
      .addCase(removeProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter((p) => p.id !== action.payload);
        state.total -= 1;
        state.refetchTrigger += 1;
      });
  },
});

export const { setProjectsPage, setProjectsSearch } = projectSlice.actions;
export default projectSlice.reducer;
