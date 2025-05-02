import { Base_Url } from "../../../Base-Url/Base_Url";
import {
  postApiWithAuthenticated,
  getListWithAuthenticated,
} from "../../reducer/reduxService";

const clientsUrl = `${Base_Url}/ClientInformation/AddUpdateClientInformation`;
const clientsListUrl = `${Base_Url}/ClientInformation`;

export const AddUpdateClientInformation = async (params) => {
  const res = await postApiWithAuthenticated(`${clientsUrl}`, params);
  return res;
};

// export const GetClientList = async (params) => {
//   const res = await postApiWithAuthenticated(
//     `${clientsListUrl}/GetClientList`,
//     params
//   );
//   return res;
// };

export const GetClientList = async (params) => {
  const res = await postApiWithAuthenticated(
    `${clientsListUrl}/GetClientList?ClientFor=${params.clientFor}`,
    params
  );
  return res;
};

export const GetClientInformationModel = async (id) => {
  const res = await getListWithAuthenticated(
    `${clientsListUrl}/GetClientInformationModel?ClientKeyID=${id}`
  );
  return res;
};

//Delete Template Callback function
export const DeleteClient = async (ClientKeyID, userKeyID) => {
  const res = await getListWithAuthenticated(
    `${clientsListUrl}/DeleteClient?ClientKeyID=${ClientKeyID}&userKeyID=${userKeyID}`
  );
  return res;
};

export const ClientChangeStatus = async (ClientKeyID, userKeyID) => {
  const res = await getListWithAuthenticated(
    `${clientsListUrl}/ChangeStatus?ClientKeyID=${ClientKeyID}&userKeyID=${userKeyID}`
  );
  return res;
};

// engagement letter client
export const GetClientLookupList = async (id) => {
  const res = await getListWithAuthenticated(
    `${clientsListUrl}/GetClientLookupList?OrganisationKeyID=${id}`
  );
  return res;
};

// engagement letter client
export const GetTemplateLookupList = async (id) => {
  const res = await getListWithAuthenticated(
    `${clientsListUrl}/GetClientLookupList?OrganisationKeyID=${id}`
  );
  return res;
};

export const GetProposalLookupList = async (id) => {
  const res = await getListWithAuthenticated(
    `${clientsListUrl}/GetClientLookupList?OrganisationKeyID=${id}`
  );
  return res;
};

export const GetOfficersForQuoteAndContract = async (id) => {
  let url;
  if (id.QuoteKeyID !== null && id.QuoteKeyID !== undefined && id.QuoteKeyID !== "") {
    url = `/GetOfficersForQuoteAndContract?QuoteKeyID=${id.QuoteKeyID}`
  } else {
    url = `/GetOfficersForQuoteAndContract?ClientKeyID=${id.ClientKeyID}`

  }
  const res = await getListWithAuthenticated(
    clientsListUrl + url
  );
  return res;
};

export const DeleteSingleApiClient = async (params) => {

  const res = await postApiWithAuthenticated(
    // `${TemplateBaseUrl}/GetMasterTemplateDetailsWithVariableValues?TemplateKeyID=${params.TemplateKeyID}&ClientKeyID=${params.clientID}`
    `${clientsListUrl}/DeleteSingleApiClient`, params
  );
  return res;
};