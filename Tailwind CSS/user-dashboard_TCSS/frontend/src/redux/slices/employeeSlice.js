import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addEmployee, updateEmployee, getEmployees, deleteEmployee } from "../../../../backend/services/employeeService";

const initialState = {
  employees: [],
  total: 0,
  loading: false,
  error: null,
  page: 1,
  limit: 5,
  searchTerm: "",
};

export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async ({ page, limit, searchTerm }) => {
    return await getEmployees(page, limit, searchTerm);
  }
);

export const createEmployee = createAsyncThunk(
  "employees/addEmployee",
  async (employeeData) => {
    return await addEmployee(employeeData);
  }
);

export const editEmployee = createAsyncThunk(
  "employees/updateEmployee",
  async ({ id, data }) => {
    return await updateEmployee(id, data);
  }
);

export const removeEmployee = createAsyncThunk(
  "employees/deleteEmployee",
  async (id) => {
    await deleteEmployee(id);
    return id;
  }
);

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    setEmployeesPage: (state, action) => { state.page = action.payload; },
    setEmployeesSearch: (state, action) => {
      const nextSearch = action.payload ?? "";
      if (state.searchTerm !== nextSearch) {
        state.searchTerm = nextSearch;
        state.page = 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.employees = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchEmployees.rejected, (state) => { state.loading = false; state.error = "Failed to fetch data"; })
      .addCase(createEmployee.fulfilled, (state) => { state.page = 1; })
      .addCase(editEmployee.fulfilled, (state, action) => {
        const idx = state.employees.findIndex((e) => e.id === action.payload.id);
        if (idx !== -1) state.employees[idx] = action.payload;
      })
      .addCase(removeEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.filter((e) => e.id !== action.payload);
        state.total -= 1;
      });
  },
});

export const { setEmployeesPage, setEmployeesSearch } = employeeSlice.actions;
export default employeeSlice.reducer;
