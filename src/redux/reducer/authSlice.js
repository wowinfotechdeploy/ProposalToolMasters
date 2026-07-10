import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { QuickBookUrl, XeroBaseUrl } from "../../Base-Url/Base_Url";
import apiClient from "../Services/axiosInterceptor";

export const xeroConnectionStatus = createAsyncThunk(
  "auth/xeroConnectionStatus",
  async (organisationKeyID, thunkAPI) => {
    try {
      const res = await apiClient.get(
        `${XeroBaseUrl}connection-status/${organisationKeyID}`,
        {}
      );

      return {
        key: "Xero",
        value: res.data?.connected === true,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const quickBooksConnectionStatus = createAsyncThunk(
  "auth/quickBooksConnectionStatus",
  async (organisationKeyID, thunkAPI) => {
    try {
      const res = await apiClient.get(
        `${QuickBookUrl}connection-status/${organisationKeyID}`
      );

      return {
        key: "QuickBooks",
        value: res.data?.connected === true,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    bookkeeping: {
      Xero: false,
      QuickBooks: false,
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Pending
      .addMatcher(
        (action) =>
          action.type.startsWith("auth/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
        }
      )

      // Fulfilled (COMMON HANDLER)
      .addMatcher(
        (action) =>
          action.type.startsWith("auth/") && action.type.endsWith("/fulfilled"),
        (state, action) => {
          state.loading = false;

          const { key, value } = action.payload || {};

          if (key) {
            state.bookkeeping[key] = value; // only update specific key
          }
        }
      )

      // Rejected
      .addMatcher(
        (action) =>
          action.type.startsWith("auth/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default authSlice.reducer;
