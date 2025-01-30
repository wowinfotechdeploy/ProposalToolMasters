import { Base_Url } from "../../../Base-Url/Base_Url";
import {
  getListWithAuthenticated,
  postApiWithAuthenticated,
} from "../../reducer/reduxService";

//Super email template Base Url
const SuperEmailTemplateBaseUrl = `${Base_Url}/SuperAdminTemplates`;

export const GetEmailTemplatesList = async (params) => {
  const res = await postApiWithAuthenticated(
    SuperEmailTemplateBaseUrl + "/GetSuperAdminTemplateList",
    params
  );
  return res;
};

//Get Term and Condition Model Data Services Callback function
export const GetEmailTemplatesModel = async (templateKeyID) => {
  const res = await getListWithAuthenticated(
    `${SuperEmailTemplateBaseUrl}/GetSuperAdminTemplateModel?TemplateKeyID=${templateKeyID}`
  );
  return res;
};

//AddUpdate   for super admin Callback function
export const AddUpdateEmailTemplates = async (url, params) => {
  const res = await postApiWithAuthenticated(
    `${SuperEmailTemplateBaseUrl}${url}`,
    params
  );
  return res;
};

//Delete
export const EmailTemplatesDelete = async (userKeyID,templateKeyID) => {
  const res = await getListWithAuthenticated(
    `${SuperEmailTemplateBaseUrl}/SuperAdminTemplateDelete?UserKeyID=${userKeyID}&TemplateKeyID=${templateKeyID}`
  );
  return res;
};

//Status
export const EmailTemplatesChangeStatus = async (userKeyID,templateKeyID ) => {
  const res = await getListWithAuthenticated(
    `${SuperEmailTemplateBaseUrl}/SuperAdminTemplateChangeStatus?UserKeyID=${userKeyID}&TemplateKeyID=${templateKeyID}`
  );
  return res;
};

// is default
export const GetChangeIsDefaultStatus = async (userKeyID,templateKeyID) => {
  
  
   const res = await getListWithAuthenticated(
      `${SuperEmailTemplateBaseUrl}/SuperAdminTemplateChangeIsDefaultStatus?UserKeyID=${userKeyID}&TemplateKeyID=${templateKeyID}`
    );
 
  return res;
};
