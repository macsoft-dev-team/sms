import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiService, getMeta, getPayload } from "../../api/apiService";
import { endpoints } from "../../api/endpoints";

export const fetchUsersThunk = createAsyncThunk("users/fetch", async (params = {}) => {
  const body = await apiService.get(endpoints.users, { params });
  return { items: getPayload(body), meta: getMeta(body) };
});

export const createUserThunk = createAsyncThunk("users/create", async (payload) => {
  const body = await apiService.post(endpoints.users, payload);
  return getPayload(body);
});

export const updateUserThunk = createAsyncThunk("users/update", async ({ id, payload }) => {
  const body = await apiService.put(`${endpoints.users}/${id}`, payload);
  return getPayload(body);
});

const userSlice = createSlice({
  name: "users",
  initialState: { items: [], meta: null, status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersThunk.pending, (state) => { state.status = "loading"; })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => { state.status = "succeeded"; state.items = action.payload.items; state.meta = action.payload.meta; })
      .addCase(fetchUsersThunk.rejected, (state, action) => { state.status = "failed"; state.error = action.error.message; })
      .addCase(createUserThunk.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index >= 0) state.items[index] = action.payload;
      });
  },
});

export default userSlice.reducer;
