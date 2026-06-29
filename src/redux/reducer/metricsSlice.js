import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DeviationBaseUrl, DeviationBaseUrlv2 } from "../../Base-Url/Base_Url";
import apiClient from "../Services/axiosInterceptor";

export const GetMetricMappings = createAsyncThunk(
  "metrics/GetMetricMappings",
  async (organisationKeyID, thunkAPI) => {
    try {
      const res = await apiClient.get(
        `${DeviationBaseUrlv2}mappings/${organisationKeyID}`,
      );

      return res.data?.mappings || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  },
);

//drivers list (global and local )
export const GetAllDrivers = createAsyncThunk(
  "metrics/GetAllDrivers",

  async (organisationKeyID, thunkAPI) => {
    try {
      const res = await apiClient.get(
        `${DeviationBaseUrlv2}driver-options/${organisationKeyID}`,
      );

      const globalDrivers = res.data?.globalPricingDrivers || [];

      const localDrivers = res.data?.localPricingDrivers || [];

      // ================= GLOBAL DRIVERS =================
      const formattedGlobalDrivers = globalDrivers.map((d) => ({
        id: d.globalPricingDriverId,
        name: d.driverName,
        driverValue: d.driverValue,
        driverTypeId: d.driverTypeId,
        driverTypeName: d.driverTypeName,

        services:
          d.services?.map((s) => ({
            serviceID: null,
            serviceName: s.serviceName,
          })) || [],
      }));

      // ================= LOCAL DRIVERS =================
      const formattedLocalDrivers = localDrivers.map((d) => ({
        id: d.globalPricingDriverId,
        name: d.driverName,
        driverValue: d.driverValue,
        driverTypeId: d.driverTypeId,
        driverTypeName: d.driverTypeName,

        services: [
          {
            serviceID: d.serviceId,
            serviceName: d.serviceName,
          },
        ],
      }));

      // ================= MERGED ARRAY =================
      const formatted = [...formattedGlobalDrivers, ...formattedLocalDrivers];

      return formatted;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  },
);

//save metric mapping
export const SaveMetricMapping = createAsyncThunk(
  "metrics/SaveMetricMapping",

  async ({ organisationKeyID, payload }, thunkAPI) => {
    try {
      const res = await apiClient.post(
        `${DeviationBaseUrlv2}mappings/${organisationKeyID}`,
        payload,
      );

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data || "Something went wrong",
      );
    }
  },
);

const initialState = {
  metricMappings: [],
  metrics: [],
  drivers: [],
  loading: {
    metricMappings: false,
    drivers: false,
  },

  error: {
    metricMappings: null,
    drivers: null,
  },
};

const metricsSlice = createSlice({
  name: "metrics",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      //================ METRIC MAPPINGS =================
      .addCase(GetMetricMappings.pending, (state) => {
        state.loading.metricMappings = true;
      })

      .addCase(GetMetricMappings.fulfilled, (state, action) => {
        state.loading.metricMappings = false;
        state.metricMappings = action.payload || [];
      })

      .addCase(GetMetricMappings.rejected, (state, action) => {
        state.loading.metricMappings = false;
        state.error = action.payload;
      })
      //================ DRIVERS =================
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
  },
});

export default metricsSlice.reducer;
