import { Base_Url } from "../../../Base-Url/Base_Url";
import { postApiWithAuthenticated } from "../../reducer/reduxService";

const DashboardCountUrl = `${Base_Url}`;
export const DashboardCountList = async (params) => {
  const res = await postApiWithAuthenticated(
    `${DashboardCountUrl}/Dashboard/GetDashboardCount`,
    params
  );
  return res;
};
