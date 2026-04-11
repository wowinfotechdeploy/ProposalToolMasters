import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Base_Url, QuickBookUrl, XeroBaseUrl } from "../../Base-Url/Base_Url";
import apiClient from "../Services/axiosInterceptor";

// GET connection URL
export const fetchQuickBookConnectionUrl = createAsyncThunk(
  "quickbook/fetchConnectionUrl",
  async (organisationKeyID, thunkAPI) => {
    try {
      const res = await apiClient.get(
        `${QuickBookUrl}connection-url/${organisationKeyID}`
      );

      return res.data; //  this is your promise resolve data
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const fetchContactsLookup = createAsyncThunk(
  "xero/fetchContactsLookup",
  async ({ organisationKeyID, activePlatform }, thunkAPI) => {
    try {
      const baseUrl =
        activePlatform === "QuickBooks"
          ? `${QuickBookUrl}customers/${organisationKeyID}`
          : `${XeroBaseUrl}contacts/${organisationKeyID}`;

      const res = await apiClient.get(`${baseUrl}`, {});

      // // Transform data HERE (not in component)
      // const mappings = res.data?.contacts || [];

      // const formatted = mappings.map((item) => ({
      //   value: item.XeroContactID,
      //   label: item.ContactName,
      //   ClientKeyID: item.ClientKeyID,
      // }));

      // return formatted; // final usable data

      const result = [];

      if (activePlatform === "QuickBooks") {
        const customers = res.data?.customers || [];

        customers.forEach((item) => {
          result.push({
            value: item.QBCustomerID,
            label: item.DisplayName,
            ClientKeyID: item.ClientKeyID,
          });
        });
      } else {
        const contacts = res.data?.contacts || [];

        contacts.forEach((item) => {
          result.push({
            value: item.XeroContactID,
            label: item.ContactName,
            ClientKeyID: item.ClientKeyID,
          });
        });
      }

      return result;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const GetAllDrivers = createAsyncThunk(
  "xero/getAllDrivers",
  async (organisationKeyID, thunkAPI) => {
    try {
      const res = await apiClient.get(
        `${Base_Url}/XEROAndQBO/GetLocalAndGlobalPricingDriverListWithServices?OrganisationKeyID=${organisationKeyID}`
      );

      const drivers = res.data?.responseData?.data || [];

      // Transform data here (VERY IMPORTANT)
      const formatted = drivers.map((d) => ({
        id: d.globalPricingDriverID,
        name: d.driverName,
        services: d._ServiceList.map((s) => ({
          serviceID: s.serviceID,
          serviceName: s.serviceName,
        })),
      }));

      return formatted; // clean data for UI
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const addContactMapping = createAsyncThunk(
  "contact/addContactMapping",
  async (payload, thunkAPI) => {
    const { organisationKeyId, activePlatform, ...body } = payload;

    const baseUrl =
      activePlatform === "QuickBooks"
        ? `${QuickBookUrl}mappings/${organisationKeyId}`
        : `${XeroBaseUrl}mappings/${organisationKeyId}`;

    try {
      const response = await apiClient.post(baseUrl, body);
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
    drivers: [],
    message: "",
    loading: {
      connectionUrl: false,
      contactsLookup: false,
    },

    error: {
      connectionUrl: null,
      contactsLookup: null,
      drivers: null,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuickBookConnectionUrl.pending, (state) => {
        state.loading.connectionUrl = true;
      })
      .addCase(fetchQuickBookConnectionUrl.fulfilled, (state, action) => {
        state.loading.connectionUrl = false;
        state.connectionUrl = action.payload;
      })
      .addCase(fetchQuickBookConnectionUrl.rejected, (state, action) => {
        state.loading.connectionUrl = false;
        state.error.connectionUrl = action.payload;
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
        state.loading.contactsLookup = [];
        state.error.contactsLookup = action.payload;
      })
      .addCase(GetAllDrivers.pending, (state) => {
        state.loading.drivers = true;
      })
      .addCase(GetAllDrivers.fulfilled, (state, action) => {
        state.loading.drivers = false;
        state.drivers = action.payload;
      })
      .addCase(GetAllDrivers.rejected, (state, action) => {
        state.loading.drivers = false;
        state.error.drivers = action.payload;
      });

    // });
  },
});

export default quickBookSlice.reducer;
