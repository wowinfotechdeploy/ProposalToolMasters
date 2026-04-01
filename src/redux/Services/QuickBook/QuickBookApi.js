import { XeroBaseUrl } from "../../../Base-Url/Base_Url";
import { getListWithAuthenticated } from "../../reducer/reduxService";

export const OrganisationToQuickBookAuthentication = async (id) => {
  const res = await getListWithAuthenticated(`${XeroBaseUrl}`);
  return res;
};
