import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { QuickBookUrl, XeroBaseUrl } from "../../Base-Url/Base_Url";
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

export const fetchContactsLookup = createAsyncThunk(
  "xero/fetchContactsLookup",
  async (organisationKeyID, thunkAPI) => {
    try {
      const res = await apiClient.get(
        `${XeroBaseUrl}contacts/${organisationKeyID}`,
        {}
      );

      // Transform data HERE (not in component)
      const mappings = res.data?.contacts || [];

      const formatted = mappings.map((item) => ({
        value: item.XeroContactID,
        label: item.ContactName,
        ClientKeyID: item.ClientKeyID,
      }));

      return formatted; // final usable data
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const addContactMapping = createAsyncThunk(
  "contact/addContactMapping",
  async (payload, thunkAPI) => {
    const { organisationKeyId, ...body } = payload;
    try {
      const response = await apiClient.post(
        `${XeroBaseUrl}mappings/${organisationKeyId}`,
        body
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error");
    }
  }
);

const quickBookSlice = createSlice({
  name: "quickbook",
  initialState: {
    connectionUrl: null,
    contactsLookup: [],
    message: "",
    loading: {
      connectionUrl: false,
      contactsLookup: false,
    },

    error: {
      connectionUrl: null,
      contactsLookup: null,
    },
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
      })
      //contacts
      .addCase(fetchContactsLookup.pending, (state) => {
        state.loading.contactsLookup = true;
      })
      .addCase(fetchContactsLookup.fulfilled, (state, action) => {
        state.loading.contactsLookup = false;
        state.contactsLookup = action.payload; //  FIXED
      })
      .addCase(fetchContactsLookup.rejected, (state, action) => {
        state.loading.contactsLookup = false;
        state.error.contactsLookup = action.payload;
      });
    // });
  },
});

export default quickBookSlice.reducer;
