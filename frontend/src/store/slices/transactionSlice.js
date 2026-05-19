import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../../api/apiClient";
import { apiService, getMeta, getPayload } from "../../api/apiService";
import { endpoints } from "../../api/endpoints";

export const fetchTransactionsThunk = createAsyncThunk("transactions/fetch", async (params = {}) => {
  const body = await apiService.get(endpoints.transactions, { params });
  return { items: getPayload(body), meta: getMeta(body) };
});

export const createMovementThunk = createAsyncThunk("transactions/create", async (payload) => {
  const body = await apiService.post(endpoints.transactions, payload);
  return getPayload(body);
});

export const uploadTransactionsExcelThunk = createAsyncThunk("transactions/uploadExcel", async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiClient.post(`${endpoints.transactions}/upload`, formData, { headers: { "Content-Type": "multipart/form-data" } });
  return getPayload(response.data);
});

export async function downloadTransactionTemplate() {
  const response = await apiClient.get(`${endpoints.transactions}/template`, { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "inventory-upload-template.xlsx");
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

const transactionSlice = createSlice({
  name: "transactions",
  initialState: { items: [], meta: null, importResult: null, status: "idle", error: null },
  reducers: { clearImportResult: (state) => { state.importResult = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactionsThunk.pending, (state) => { state.status = "loading"; })
      .addCase(fetchTransactionsThunk.fulfilled, (state, action) => { state.status = "succeeded"; state.items = action.payload.items; state.meta = action.payload.meta; })
      .addCase(fetchTransactionsThunk.rejected, (state, action) => { state.status = "failed"; state.error = action.error.message; })
      .addCase(createMovementThunk.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      .addCase(uploadTransactionsExcelThunk.fulfilled, (state, action) => { state.importResult = action.payload; });
  },
});

export const { clearImportResult } = transactionSlice.actions;
export default transactionSlice.reducer;
