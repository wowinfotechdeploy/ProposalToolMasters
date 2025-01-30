
import { Base_Url } from "../../../Base-Url/Base_Url";
import { postApiWithAuthenticated } from "../../reducer/reduxService";

const ActivityLogs = `${Base_Url}/ActivityLog/GetActivityLogList`

export const GetActivityLogsList = async (params) => {
    const res = await postApiWithAuthenticated(
      `${ActivityLogs}`,params
     
    );
    return res;
  };
