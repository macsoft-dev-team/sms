import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiService, getMeta, getPayload } from "../../api/apiService";
import { endpoints } from "../../api/endpoints";

export const fetchProductsThunk = createAsyncThunk("products/fetch", async (params = {}) => {
  const body = await apiService.get(endpoints.products, { params });
  return { items: getPayload(body), meta: getMeta(body) };
});

export const createProductThunk = createAsyncThunk("products/create", async (payload) => {
  const body = await apiService.post(endpoints.products, payload);
  return getPayload(body);
});

export const updateProductThunk = createAsyncThunk("products/update", async ({ id, payload }) => {
  const body = await apiService.put(`${endpoints.products}/${id}`, payload);
  return getPayload(body);
});

export const fetchLocationsThunk = createAsyncThunk("products/fetchLocations", async (params = {}) => {
  const body = await apiService.get(endpoints.locations, { params: { limit: 100, ...params } });
  return getPayload(body);
});

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    locations: [],
    meta: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.meta = action.payload.meta;
      })
      .addCase(fetchProductsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createProductThunk.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index >= 0) state.items[index] = action.payload;
      })
      .addCase(fetchLocationsThunk.fulfilled, (state, action) => {
        state.locations = action.payload;
      });
  },
});

export default productSlice.reducer;