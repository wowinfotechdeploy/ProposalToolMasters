import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { XeroBaseUrl } from "../../Base-Url/Base_Url";

// API function
export const fetchAuthData = createAsyncThunk(
  "auth/fetchAuthData",
  async (organisationKeyID, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.Storage?.token;
      //   const organisationKeyID = state.Storage?.organisationKeyID;
      const res = await fetch(
        `${XeroBaseUrl}connection-status/${organisationKeyID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      return {
        Xero: data?.connected === true,
      };
      //await res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
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
    builder.addCase(fetchAuthData.fulfilled, (state, action) => {
      state.loading = false;
      state.bookkeeping.Xero = action.payload.Xero;
    });
    builder.addCase(fetchAuthData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default authSlice.reducer;
