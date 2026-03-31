import { XeroBaseUrl } from "../../../Base-Url/Base_Url";
import {
  getListWithAuthenticated,
  postApiWithAuthenticated,
} from "../../reducer/reduxService";

export const ConnectionAuthentication = async (id) => {
  //with xero
  const res = await getListWithAuthenticated(
    `${XeroBaseUrl}connection-url/${id}`
  );
  return res;
};

export const OrganisationToQuickBookAuthentication = async (id) => {
  const res = await getListWithAuthenticated(`${XeroBaseUrl}`);
  return res;
};

export const GetAllClientLookupList = async (organisationKeyID) => {
  const res = await getListWithAuthenticated(
    `${XeroBaseUrl}mappings/${organisationKeyID}`
  );
  return res;
};

export const GetAllCachedXeroContacts = async (organisationKeyID) => {
  const res = await getListWithAuthenticated(
    `${XeroBaseUrl}contacts/${organisationKeyID}`
  );
  return res;
};

export const ProspectConnectionAuthentication = async (
  organisationKeyId,
  clientKeyId
) => {
  const res = await getListWithAuthenticated(
    `${XeroBaseUrl}client/connection-url/${organisationKeyId}/${clientKeyId}`
  );
  return res;
};

export const CreateXeroContactFromOutbooks = async (
  param,
  organisationKeyId
) => {
  const res = await postApiWithAuthenticated(
    `${XeroBaseUrl}contacts/create-from-client/${organisationKeyId}`,
    param
  );
  return res;
};
