import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { QuickBookUrl } from "../../Base-Url/Base_Url";
import apiClient from "../Services/axiosInterceptor";

// GET connection URL
export const fetchQuickBookConnectionUrl = createAsyncThunk(
  "quickbook/fetchConnectionUrl",
  async (organisationKeyID, thunkAPI) => {
    try {
      const res = await apiClient.get(
        `${QuickBookUrl}/connection-url/${organisationKeyID}`
      );

      return res.data; //  this is your promise resolve data
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

const quickBookSlice = createSlice({
  name: "quickbook",
  initialState: {
    connectionUrl: null,
    message: "",
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuickBookConnectionUrl.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuickBookConnectionUrl.fulfilled, (state, action) => {
        state.loading = false;
        state.connectionUrl = action.payload; //  store response
      })
      .addCase(fetchQuickBookConnectionUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default quickBookSlice.reducer;
