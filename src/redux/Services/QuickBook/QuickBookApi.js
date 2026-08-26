import { QuickBookUrl } from "../../../Base-Url/Base_Url";
import { getListWithAuthenticated } from "../../reducer/reduxService";

export const OrganisationToQuickBookAuthentication = async (id) => {
  const res = await getListWithAuthenticated(
    `${QuickBookUrl}connection-url/${id}`
  );

  return res;
};
