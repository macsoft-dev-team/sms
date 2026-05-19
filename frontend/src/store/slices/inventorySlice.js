import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiService, getMeta, getPayload } from "../../api/apiService";
import { endpoints } from "../../api/endpoints";

export const fetchInventoryThunk = createAsyncThunk("inventory/fetch", async (params = {}) => {
  const body = await apiService.get(endpoints.inventory, { params });
  return { items: getPayload(body), meta: getMeta(body) };
});

export const fetchInventorySummaryThunk = createAsyncThunk("inventory/summary", async () => {
  const body = await apiService.get(`${endpoints.inventory}/summary`);
  return getPayload(body);
});

const inventorySlice = createSlice({
  name: "inventory",
  initialState: {
    items: [],
    summary: null,
    meta: null,
    filters: { search: "", productCode: "", customerCode: "", locationId: "", stockLevel: "" },
    status: "idle",
    error: null,
  },
  reducers: {
    setInventoryFilter: (state, action) => { state.filters[action.payload.key] = action.payload.value; },
    setInventoryFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload }; },
    clearInventoryFilters: (state) => { state.filters = { search: "", productCode: "", customerCode: "", locationId: "", stockLevel: "" }; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventoryThunk.pending, (state) => { state.status = "loading"; })
      .addCase(fetchInventoryThunk.fulfilled, (state, action) => { state.status = "succeeded"; state.items = action.payload.items; state.meta = action.payload.meta; })
      .addCase(fetchInventoryThunk.rejected, (state, action) => { state.status = "failed"; state.error = action.error.message; })
      .addCase(fetchInventorySummaryThunk.fulfilled, (state, action) => { state.summary = action.payload; });
  },
});

export const { setInventoryFilter, setInventoryFilters, clearInventoryFilters } = inventorySlice.actions;
export default inventorySlice.reducer;
