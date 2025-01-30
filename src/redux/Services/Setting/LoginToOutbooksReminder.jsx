import { Base_Url } from "../../../Base-Url/Base_Url";
import {
  getListWithAuthenticated,
  postApiWithAuthenticated,
} from "../../reducer/reduxService";

//Super email template Base Url
const SuperEmailTemplateBaseUrl = `${Base_Url}/configure/LoginToOutbooksReminder`;

export const GetLoginToOutbookUnpaidList = async (params) => {
  const res = await postApiWithAuthenticated(
    SuperEmailTemplateBaseUrl + "/GetLoginToOutbooksReminderUnpaidUserList",
    params 
  );
  return res;
};

export const GetLoginToOutbookpaidList = async (params) => {
    const res = await postApiWithAuthenticated(
      SuperEmailTemplateBaseUrl + "/GetLoginToOutbooksReminderPaidUserList",
      params 
    );
    return res;
  };

 

  export const UpdateUnpaidAccount = async (url, params) => {
    const res = await postApiWithAuthenticated(
      `${SuperEmailTemplateBaseUrl}${url}`,
      params
    );
    return res;
  };

  export const UpdatePaidAccount = async (url, params) => {
    const res = await postApiWithAuthenticated(
      `${SuperEmailTemplateBaseUrl}${url}`,
      params
    );
    return res;
  };

