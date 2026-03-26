import { XeroBaseUrl } from "../../../Base-Url/Base_Url";
import { getListWithAuthenticated } from "../../reducer/reduxService";

export const ConnectionAuthentication = async (id) => {
  const res = await getListWithAuthenticated(
    `${XeroBaseUrl}connection-urlss/${id}`
  );
  return res;
};
