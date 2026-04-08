import { Base_Url } from "../../../Base-Url/Base_Url";
import { GetDriverTypeLookUpList } from "../../../Database/ProposalToolDatabase";
import {
  getList,
  getListWithAuthenticated,
  postApiWithAuthenticated,
} from "../../reducer/reduxService";

//Global Constant Url

const globalPricingDriverListUrl = `${Base_Url}/GlobalPricingDriver`;
const driverTypeUrl = `${Base_Url}/DriverType/GetDriverTypeLookUpList`;
const slabtypeUrl = `${Base_Url}/SlabType/GetSlabTypeLookUpList`;

// Arrow function as a method

//Profession Type Services Callback function

export const SlabTypeList = async () => {
  const res = await getListWithAuthenticated(slabtypeUrl);
  return res;
};

//Global Pricing Driver List Api Callback function

export const GetGlobalPricingDriverList = async (params) => {
  let res = await postApiWithAuthenticated(
    `${globalPricingDriverListUrl}/GetGlobalPricingDriverList`,
    params
  );
  return res;
};

export const GetGlobalPricingDriverListForServices = async (Params) => {
  let res;

  if (Params.organisationKeyID === null) {
    res = await getListWithAuthenticated(
      `${globalPricingDriverListUrl}/GetGlobalPricingDriverListForServices?UserKeyID=${Params.userKeyID}`
    );
  } else {
    res = await getListWithAuthenticated(
      `${globalPricingDriverListUrl}/GetGlobalPricingDriverListForServices?UserKeyID=${Params.userKeyID}&OrganisationKeyID=${Params.organisationKeyID}`
    );
  }

  return res;
};

//Global Pricing Driver Callback function

export const AddUpdateGlobalPricingDriver = async (url, params) => {
  const res = await postApiWithAuthenticated(
    `${globalPricingDriverListUrl}${url}`,
    params
  );
  return res;
};

//Global Pricing Driver Callback function

export const DriverTypeList = async () => {
  const res = await GetDriverTypeLookUpList; //getListWithAuthenticated(driverTypeUrl);
  return res;
};

//Global Pricing Model Callback function

export const GetGlobalPricingDriverModel = async (KeyID, GetSAChanges) => {
  // const res = await getListWithAuthenticated(
  //   `${globalPricingDriverListUrl}/GetGlobalPricingDriverModel?GlobalPricingDriverKeyID=${KeyID}`
  // );
  // return res;
  let url = `${globalPricingDriverListUrl}/GetGlobalPricingDriverModel?GlobalPricingDriverKeyID=${KeyID}`
  if (GetSAChanges) {
    url = `${globalPricingDriverListUrl}/GetGlobalPricingDriverModel?GlobalPricingDriverKeyID=${KeyID}&GetSAChanges=${GetSAChanges}`
  }
  const res = await getListWithAuthenticated(url);
  return res;
};

//Edit Global Pricing Driver Callback function

export const GlobalPricingDriverUpdate = async (KeyID, params) => {
  const res = await postApiWithAuthenticated(
    `${globalPricingDriverListUrl}/AddUpdateGlobalPricingDriver?GlobalPricingDriverKeyID=${KeyID}`,
    params
  );
  return res;
};

//Delete Global Pricing Driver Callback function

export const DeleteGlobalPricingDriver = async (GlobalPricingDriverKeyID, userKeyID) => {
  const res = await getListWithAuthenticated(
    `${globalPricingDriverListUrl}/GlobalPricingDriverDelete?GlobalPricingDriverKeyID=${GlobalPricingDriverKeyID}&userKeyID=${userKeyID}`
  );
  return res;
};

//Delete Global Pricing Driver Callback function
export const GlobalPricingDriverChangeStatus = async (GlobalPricingDriverKeyID, userKeyID) => {
  const res = await getListWithAuthenticated(
    `${globalPricingDriverListUrl}/GlobalPricingDriverChangeStatus?GlobalPricingDriverKeyID=${GlobalPricingDriverKeyID}&userKeyID=${userKeyID}`
  );
  return res;
};


export const GetPricingDriverUsedInModules = async (
  globalPricingDriverKeyID,
  userKeyID,
  ServiceKeyID,
  variationKeyID,
  slabKeyID,
) => {
  let url = `${globalPricingDriverListUrl}/GetPricingDriverUsedInModules?GlobalPricingDriverKeyID=${globalPricingDriverKeyID}&UserKeyID=${userKeyID}`;
  if (ServiceKeyID) {
    url += `&ServiceKeyID=${ServiceKeyID}`;
  }
  if (variationKeyID) {
    url += `&VariationKeyID=${variationKeyID}`;
  }
  if (slabKeyID) {
    url += `&SlabKeyID=${slabKeyID}`;
  }
  if (!slabKeyID && !variationKeyID && !ServiceKeyID) {
    url = url
  }

  const res = await getListWithAuthenticated(url);
  return res;
};

// Cop Global Pricing Driver Record
export const CopyGlobalPricingDriver = async(GlobalPricingDriverKeyID, UserKeyID) => {
  const res = await postApiWithAuthenticated(
      `${globalPricingDriverListUrl}/CopyGlobalPricingDriver?GlobalPricingDriverKeyID=${GlobalPricingDriverKeyID}&UserKeyID=${UserKeyID}`
  );
  return res;
}