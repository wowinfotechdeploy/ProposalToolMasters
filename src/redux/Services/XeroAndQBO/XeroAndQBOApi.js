import { XeroBaseUrl } from "../../../Base-Url/Base_Url";
import { getListWithAuthenticated } from "../../reducer/reduxService";

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
