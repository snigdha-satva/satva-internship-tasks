import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addUser, updateUser, viewUsers, deleteUser } from "../../../../backend/services/userService";

const initialState = {
    users: [],
    total: 0,
    loading: false,
    error: null,
    page: 1,
    limit: 5,
    searchTerm: "",
};

export const fetchUsers = createAsyncThunk(
    "users/fetchUsers",
    async ({ page, limit, search }) => {
        return await viewUsers(page, limit, search);
    }
);

export const createUser = createAsyncThunk(
    "users/addUser",
    async ({ userData }) => {
        return await addUser(userData);
    }
);

export const editUser = createAsyncThunk(
    "users/updateUser",
    async ({ id, name }) => {
        return await updateUser(id, name);
    }
);

export const removeUser = createAsyncThunk(
    "users/deleteUser",
    async (id) => {
        await deleteUser(id);
        return id;
    }
);

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setUsersPage: (state, action) => { state.page = action.payload; },
        setUsersSearch: (state, action) => {
            const nextSearch = action.payload ?? "";
            if (state.searchTerm !== nextSearch) {
                state.searchTerm = nextSearch;
                state.page = 1;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.users = action.payload.data;
                state.total = action.payload.total;
            })
            .addCase(fetchUsers.rejected, (state) => { state.loading = false; state.error = "Failed to fetch data"; })
            .addCase(createUser.fulfilled, (state) => { state.page = 1; })
            .addCase(editUser.fulfilled, (state, action) => {
                const idx = state.users.findIndex((u) => u.id === action.payload.id);
                if (idx !== -1) state.users[idx] = action.payload;
            })
            .addCase(removeUser.fulfilled, (state, action) => {
                state.users = state.users.filter((u) => u.id !== action.payload);
                state.total -= 1;
            });
    },
});

export const { setUsersPage, setUsersSearch } = userSlice.actions;
export default userSlice.reducer;
