import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiService, getPayload } from "../../api/apiService";
import { endpoints } from "../../api/endpoints";
import { getAuthToken, setAuthToken } from "../../api/token";

export const loginThunk = createAsyncThunk("auth/login", async (credentials) => {
  const body = await apiService.post(`${endpoints.auth}/login`, credentials);
  const payload = getPayload(body);
  setAuthToken(payload.token);
  return payload;
});

export const fetchMeThunk = createAsyncThunk("auth/me", async () => {
  const body = await apiService.get(`${endpoints.auth}/me`);
  return getPayload(body);
});

export const updateProfileThunk = createAsyncThunk("auth/updateProfile", async (payload) => {
  const body = await apiService.put(`${endpoints.auth}/profile`, payload);
  return getPayload(body);
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: getAuthToken(),
    user: null,
    isAuthenticated: Boolean(getAuthToken()),
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      setAuthToken(null);
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.isAuthenticated = false;
      })
      .addCase(fetchMeThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchMeThunk.rejected, (state) => {
        setAuthToken(null);
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
