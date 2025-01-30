import { Base_Url } from "../../../Base-Url/Base_Url";
import {
  getListWithAuthenticated,
  postApiWithAuthenticated,
} from "../../reducer/reduxService";

//Super email template Base Url
const SuperEmailTemplateBaseUrl = `${Base_Url}/SuperAdminReminderEmailTemplates`;

export const GetReminderTemplatesList = async (params) => {
  const res = await postApiWithAuthenticated(
    SuperEmailTemplateBaseUrl + "/GetSuperAdminReminderEmailTemplateList",
    params 
  );
  return res;
};

//Get Term and Condition Model Data Services Callback function
export const GetReminderTemplatesModel = async (templateKeyID) => {
  const res = await getListWithAuthenticated(
    `${SuperEmailTemplateBaseUrl}/GetSuperAdminReminderEmailTemplateModel?TemplateKeyID=${templateKeyID}`
  );
  return res;

};

//AddUpdate   for super admin Callback function
export const AddUpdateReminderTemplates = async (url, params) => {
  const res = await postApiWithAuthenticated(
    `${SuperEmailTemplateBaseUrl}${url}`,
    params
  );
  return res;
};

//Delete
export const ReminderTemplatesDelete = async (userKeyID,templateKeyID) => {
  const res = await getListWithAuthenticated(
    `${SuperEmailTemplateBaseUrl}/SuperAdminReminderEmailTemplateDelete?UserKeyID=${userKeyID}&TemplateKeyID=${templateKeyID}`
  );
  return res;
};

//Status
export const ReminderTemplatesChangeStatus = async (UserKeyID,templateKeyID) => {
  const res = await getListWithAuthenticated(
    
    `${SuperEmailTemplateBaseUrl}/SuperAdminReminderEmailTemplateChangeStatus?UserKeyID=${UserKeyID}&TemplateKeyID=${templateKeyID}`
  );
  return res;
};

// is default
export const GetChangeIsDefaultStatus = async (userKeyID,templateKeyID) => {
  
  
   const res = await getListWithAuthenticated(
      `${SuperEmailTemplateBaseUrl}/SuperAdminReminderEmailTemplateChangeIsDefaultStatus?UserKeyID=${userKeyID}&TemplateKeyID=${templateKeyID}`
    );
 
  return res;
};
