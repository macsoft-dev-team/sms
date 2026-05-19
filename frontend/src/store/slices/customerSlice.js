import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiService, getMeta, getPayload } from "../../api/apiService";
import { endpoints } from "../../api/endpoints";

export const fetchCustomersThunk = createAsyncThunk("customers/fetch", async (params = {}) => {
  const body = await apiService.get(endpoints.customers, { params });
  return { items: getPayload(body), meta: getMeta(body) };
});

export const createCustomerThunk = createAsyncThunk("customers/create", async (payload) => {
  const body = await apiService.post(endpoints.customers, payload);
  return getPayload(body);
});

export const updateCustomerThunk = createAsyncThunk("customers/update", async ({ id, payload }) => {
  const body = await apiService.put(`${endpoints.customers}/${id}`, payload);
  return getPayload(body);
});

const customerSlice = createSlice({
  name: "customers",
  initialState: { items: [], meta: null, status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomersThunk.pending, (state) => { state.status = "loading"; })
      .addCase(fetchCustomersThunk.fulfilled, (state, action) => { state.status = "succeeded"; state.items = action.payload.items; state.meta = action.payload.meta; })
      .addCase(fetchCustomersThunk.rejected, (state, action) => { state.status = "failed"; state.error = action.error.message; })
      .addCase(createCustomerThunk.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      .addCase(updateCustomerThunk.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index >= 0) state.items[index] = action.payload;
      });
  },
});

export default customerSlice.reducer;
