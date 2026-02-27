import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRoles, updateRolePermissions } from "../../../../backend/services/roleService";
import { getAllPermissions } from "../../../../backend/services/permissionService";

const initialState = {
  roles: [],
  permissions: [],
  loading: false,
  initialized: false,
  error: null,
};

export const fetchRoles = createAsyncThunk("roles/fetchRoles", async () => {
  return await getRoles();
});

export const fetchPermissions = createAsyncThunk("roles/fetchPermissions", async () => {
  return await getAllPermissions();
});

export const grantRolePermission = createAsyncThunk(
  "roles/grantPermission",
  async ({ roleId, permissionIds }) => {
    return await updateRolePermissions(roleId, permissionIds, "grant");
  }
);

export const revokeRolePermission = createAsyncThunk(
  "roles/revokePermission",
  async ({ roleId, permissionIds }) => {
    return await updateRolePermissions(roleId, permissionIds, "revoke");
  }
);

const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => { state.loading = true; })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
      })
      .addCase(fetchPermissions.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = action.payload;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch permissions";
      })
      .addCase(grantRolePermission.fulfilled, (state, action) => {
        const { roleId, allowed } = action.payload;
        const role = state.roles.find((r) => r.id === roleId);
        if (role) role.allowed = allowed;
      })
      .addCase(revokeRolePermission.fulfilled, (state, action) => {
        const { roleId, allowed } = action.payload;
        const role = state.roles.find((r) => r.id === roleId);
        if (role) role.allowed = allowed;
      });
  },
});

export default rolesSlice.reducer;