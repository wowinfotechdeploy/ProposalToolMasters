import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { XeroBaseUrl } from "../../Base-Url/Base_Url";
import apiClient from "../Services/axiosInterceptor"; //interceptor for handling unauthorised error with logout navigation

export const CreateEngagementInvoice = createAsyncThunk(
  "engagement/createEngagementInvoice",
  async ({ organisationKeyID, contractKeyId }, thunkAPI) => {
    try {
      //post method with query param and reqest json
      const res = await apiClient.post(
        `${XeroBaseUrl}invoices/create-from-contract/${organisationKeyID}`,
        { contractKeyId }
      );

      return res.responseData;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error);
    }
  }
);

//using unwrap for success and error dialog handlers.
//instead of updating state just updating the promise state for loader purpose here
const engagementSlice = createSlice({
  name: "engagement",
  initialState: {
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //promises state updation
      .addCase(CreateEngagementInvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(CreateEngagementInvoice.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(CreateEngagementInvoice.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearEngagementState } = engagementSlice.actions; //export slice actions
export default engagementSlice.reducer; //export reducer
