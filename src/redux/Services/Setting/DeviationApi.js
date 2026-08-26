import { DeviationBaseUrl } from "../../../Base-Url/Base_Url";
import { getListWithAuthenticated } from "../../reducer/reduxService";

export const GetDeviationList = async (organisationKeyId) => {
  const res = await getListWithAuthenticated(
    `${DeviationBaseUrl}deviations/${organisationKeyId}`
  );
  return res;
};
