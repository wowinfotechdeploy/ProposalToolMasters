export const prospectConnectionStatus = createAsyncThunk(
  "auth/xeroConnectionStatus",
  async (organisationKeyID, thunkAPI) => {
    try {
      const res = await apiClient.get(
        `${XeroBaseUrl}connection-status/${organisationKeyID}`,
        {}
      );
      debugger;
      return res.responseData;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

const prospectSlice = createSlice({
  name: "auth",
  initialState: {
    prospectStatus: false,
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

export default prospectSlice.reducer;
