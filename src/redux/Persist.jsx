import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  mobileNo: "",
  email: "",
  isAuth: "",
  userType: "",
  token: "",
  roleTypeId: "",
  isPasswordSet: "",
  userId: "",
  organisationID: "",
  organisationKeyID: "",
  businessTypeID: "",
  organisationCount: "",
  professionTypeLists: [],
  userKeyID: "",
  currentPage: "",
  enableMFA: "",
  authenticatorName: "",
  enableEL: "",
  isUpdateRole: "",
  currency:""
};

const storageSlice = createSlice({
  name: "Storage",
  initialState,
  reducers: {
    updateState: (state, action) => {
      assignValueInState(action.payload, state);
    },
    resetState: (state) => {
      assignValueInState(initialState, state);
    },
  },
});

const assignValueInState = (obj, state) => {
  for (const key in obj) {
    state[key] = obj[key];
  }
};

export const { updateState, resetState } = storageSlice.actions;
export default storageSlice.reducer;
