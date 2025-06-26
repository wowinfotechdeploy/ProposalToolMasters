import { Base_Url } from "../../../Base-Url/Base_Url";
import {
  Template,
  TemplateAvailable,
} from "../../../Database/ProposalToolDatabase";
import {
  getListWithAuthenticated,
  postApiWithAuthenticated,
} from "../../reducer/reduxService";

//Template Base Url
const TemplateBaseUrl = `${Base_Url}/Template`;
const TemplateBaseUrlForPdf = `${Base_Url}/ImportTemplatePDF`;
const TemplatePDFBaseUrl = `${Base_Url}/AwsS3`;
const TemplateHeaderFooterBaseUrl = `${Base_Url}/TemplateHeaderFooter`;
// Arrow function as a method
//Get Template List Data Services Callback function
export const GetTemplateList = async (params) => {
  const res = await postApiWithAuthenticated(
    TemplateBaseUrl + "/GetTemplateList",
    params
  );
  return res;
};

//Get Template Model Data Services Callback function
export const GetTemplateModelData = async (params) => {
  let url =
    params.ModuleKeyID === undefined ||
    params.ModuleKeyID === null ||
    params.ModuleKeyID === ""
      ? `${TemplateBaseUrl}/GetMasterTemplateDetailsWithVariableValues?TemplateKeyID=${params.TemplateKeyID}&clientID=${params.clientID}&TemplateTypeID=${params.TemplateTypeID}`
      : `${TemplateBaseUrl}/GetMasterTemplateDetailsWithVariableValues?TemplateKeyID=${params.TemplateKeyID}&clientID=${params.clientID}&TemplateTypeID=${params.TemplateTypeID}&ModuleKeyID=${params.ModuleKeyID}`;
  const res = await getListWithAuthenticated(url); //{ data: Template }
  return res;
};

export const GetFontFamilyList = async (OrganisationKeyID, UserKeyID) => {
  const res = await postApiWithAuthenticated(
    `${TemplateBaseUrl}/GetFontFamilyList?OrganisationKeyID=${OrganisationKeyID}&UserKeyID=${UserKeyID}`
  );
  return res;
};
export const GetEmailContent = async (organisationKeyID, TemplateTypeID) => {
  const res = await getListWithAuthenticated(
    `${TemplateBaseUrl}/GetEmailTemplateContentToCustomize?OrganisationKeyID=${organisationKeyID}&TemplateTypeID=${TemplateTypeID}`
  );
  return res;
};
export const GetAllTemplatesList = async (
  TemplateTypeCatID,
  OrganisationKeyID
) => {
  const res = await postApiWithAuthenticated(
    `${TemplateHeaderFooterBaseUrl}/GetAllTemplatesList?TemplateTypeCatID=${TemplateTypeCatID}&OrganisationKeyID=${OrganisationKeyID}`
  );
  return res;
};
// export const GetTemplateModelData = async (params) => {
//     let url = (params.ModuleKeyID === undefined || params.ModuleKeyID === null || params.ModuleKeyID === "") ?
//         `${TemplateBaseUrl}/GetMasterTemplateDetailsWithVariableValues?TemplateKeyID=${params.TemplateKeyID}&clientID=${params.clientID}&TemplateTypeID=${params.TemplateTypeID}`
//         : `${TemplateBaseUrl}/GetMasterTemplateDetailsWithVariableValues?TemplateKeyID=${params.TemplateKeyID}&clientID=${params.clientID}&TemplateTypeID=${params.TemplateTypeID}&ModuleKeyID=${params.ModuleKeyID}`;
//     const res = await getListWithAuthenticated(url);
//     return res;
// };

// export const GetTemplateLookupPDFList = async (OrganisationKeyID, UserKeyID) => {
//     let res;
//     if (OrganisationKeyID === null) {
//         res = await getListWithAuthenticated(
//             `${TemplateBaseUrlForPdf}/GetImportTemplatePDFLookupList?UserKeyID=${UserKeyID}`
//         );
//     } else {
//         res = await getListWithAuthenticated(
//             `${TemplateBaseUrlForPdf}/GetImportTemplatePDFLookupList?OrganisationKeyID=${OrganisationKeyID}&UserKeyID=${UserKeyID}`
//         );
//     }
//     // const res = await getListWithAuthenticated(
//     //     `${TemplateBaseUrlForPdf}/GetImportTemplatePDFLookupList?OrganisationKeyID=${OrganisationKeyID}&UserKeyID=${UserKeyID}`
//     // );
//     return res;
// };
export const GetTemplateLookupPDFList = async (params) => {
  let res;
  if (params.OrganisationKeyID === null) {
    res = await postApiWithAuthenticated(
      TemplateBaseUrlForPdf + "/GetImportTemplatePDFLookupList",
      params
      // `${TemplateBaseUrlForPdf}/GetImportTemplatePDFLookupList?UserKeyID=${params.UserKeyID}&selectedTemplatePDFKeyIDs=${params.selectedPdfDetails}`
    );
  } else {
    res = await postApiWithAuthenticated(
      TemplateBaseUrlForPdf + "/GetImportTemplatePDFLookupList",
      params
      // `${TemplateBaseUrlForPdf}/GetImportTemplatePDFLookupList?OrganisationKeyID=${params.OrganisationKeyID}&UserKeyID=${params.UserKeyID}&selectedTemplatePDFKeyIDs=${params.selectedTemplatePDFKeyIDs}`
    );
  }

  return res;
};
export const GetTemplatePdfList = async (params) => {
  const res = await postApiWithAuthenticated(
    TemplateBaseUrlForPdf + "/GetImportTemplatePDFList",
    params
  );
  return res;
};

export const GetTemplateHeaderFooterList = async (params) => {
  const res = await postApiWithAuthenticated(
    TemplateHeaderFooterBaseUrl + "/GetTemplateHeaderFooterList",
    params
  );
  return res;
};
//Get Template Model Data Services Callback function
export const GetTemplateModel = async (KeyID, GetSAChanges) => {
  // const res = await getListWithAuthenticated(
  //     `${TemplateBaseUrl}/GetTemplateModel?TemplateKeyID=${id}`
  // );
  // return res;
  let url = `${TemplateBaseUrl}/GetTemplateModel?TemplateKeyID=${KeyID}`;
  if (GetSAChanges) {
    url = `${TemplateBaseUrl}/GetTemplateModel?TemplateKeyID=${KeyID}&GetSAChanges=${GetSAChanges}`;
  }
  const res = await getListWithAuthenticated(url);
  return res;
};
// Get Template Header Footer Model Callback Function
export const GetTemplateHeaderFooterModel = async (KeyID) => {
  // const res = await getListWithAuthenticated(
  //     `${TemplateBaseUrlForPdf}/GetImportTemplatePDFModel?TemplatePdfKeyID=${id}`
  // );
  // return res;
  let url = `${TemplateHeaderFooterBaseUrl}/GetTemplateHeaderFooterModel?HFTemplateKeyID=${KeyID}`;
  const res = await getListWithAuthenticated(url);
  return res;
};

//Get Template Model Data Services Callback function
export const GetTemplatePdfModel = async (KeyID, GetSAChanges) => {
  // const res = await getListWithAuthenticated(
  //     `${TemplateBaseUrlForPdf}/GetImportTemplatePDFModel?TemplatePdfKeyID=${id}`
  // );
  // return res;
  let url = `${TemplateBaseUrlForPdf}/GetImportTemplatePDFModel?TemplatePdfKeyID=${KeyID}`;
  if (GetSAChanges) {
    url = `${TemplateBaseUrlForPdf}/GetImportTemplatePDFModel?TemplatePdfKeyID=${KeyID}&GetSAChanges=${GetSAChanges}`;
  }
  const res = await getListWithAuthenticated(url);
  return res;
};
//AddUpdate Template Callback function
export const AddUpdateTemplate = async (url, params) => {
  const res = await postApiWithAuthenticated(
    `${TemplateBaseUrl}${url}`,
    params
  );
  return res;
};
//AddUpdate Template Callback function
export const AddUpdateTemplateData = async (url, params) => {
  const res = await postApiWithAuthenticated(
    `${TemplateBaseUrlForPdf}${url}`,
    params
  );
  return res;
};

//AddUpdate Template Callback function
export const AddUpdateTemplatePDF = async (size, TemplatePdfKeyID, params) => {
  const res = await postApiWithAuthenticated(
    `${TemplatePDFBaseUrl}/UploadImportTemplatePDF?TemplatePdfKeyID=${TemplatePdfKeyID}`,
    params
  );

  return res;
};
//AddUpdate Template Callback function
export const AddUpdateTemplateHeaderFooter = async (params) => {
  const res = await postApiWithAuthenticated(
    `${TemplateHeaderFooterBaseUrl}/AddUpdateTemplateHeaderFooter`,
    params
  );

  return res;
};
export const AddUpdateTemplateHeaderPdf = async (size, ModuleKeyID, params) => {
  const res = await postApiWithAuthenticated(
    `${TemplatePDFBaseUrl}/UploadFileTemplateHeader?ModuleKeyID=${ModuleKeyID}`,
    params
  );

  return res;
};
export const AddUpdateTemplateFooterPdf = async (size, ModuleKeyID, params) => {
  const res = await postApiWithAuthenticated(
    `${TemplatePDFBaseUrl}/UploadFileTemplateFooter?ModuleKeyID=${ModuleKeyID}`,
    params
  );

  return res;
};
//AddUpdate Template Callback function
export const AddUpdateTemplateDataWithPdf = async (
  size,
  ModuleKeyID,
  params
) => {
  const res = await postApiWithAuthenticated(
    `${TemplatePDFBaseUrl}/UploadFileTermsAndConditions?ModuleKeyID=${ModuleKeyID}`,
    params
  );

  return res;
};
//Delete Template Callback function
export const DeleteTemplate = async (templateKeyID, userKeyID) => {
  const res = await getListWithAuthenticated(
    `${TemplateBaseUrl}/TemplateDelete?templateKeyID=${templateKeyID}&userKeyID=${userKeyID}`
  );
  return res;
};

//Delete Templatepdf Callback function
export const DeleteTemplatePdf = async (
  templatePdfKeyID,
  Action,
  userKeyID
) => {
  const res = await getListWithAuthenticated(
    `${TemplateBaseUrlForPdf}/DeleteImportTemplatePDF?TemplatePdfKeyID=${templatePdfKeyID}&Action=${Action}&userKeyID=${userKeyID}`
  );
  return res;
};
// Delete Header Footer Callback Function
export const DeleteTemplateHeaderFooter = async (
  HFTemplateKeyID,
  userKeyID
) => {
  const res = await getListWithAuthenticated(
    `${TemplateHeaderFooterBaseUrl}/DeleteTemplateHeaderFooter?HFTemplateKeyID=${HFTemplateKeyID}&userKeyID=${userKeyID}`
  );
  return res;
};

//Change Status for Template HeaderFooter
export const TemplateHeaderFooterChangeStatus = async (
  HFTemplateKeyID,
  userKeyID
) => {
  const res = await getListWithAuthenticated(
    `${TemplateHeaderFooterBaseUrl}/ChangeStatusTemplateHeaderFooter?HFTemplateKeyID=${HFTemplateKeyID}&userKeyID=${userKeyID}`
  );
  return res;
};
//Delete Template Callback function
export const EmailTemplatesChangeStatus = async (templateKeyID, userKeyID) => {
  const res = await getListWithAuthenticated(
    `${TemplateBaseUrl}/TemplateChangeStatus?templateKeyID=${templateKeyID}&userKeyID=${userKeyID}`
  );
  return res;
};

//Delete TemplatePdf Callback function
export const TemplatesPdfChangeStatus = async (templatePdfKeyID, userKeyID) => {
  const res = await getListWithAuthenticated(
    `${TemplateBaseUrlForPdf}/ImportTemplatePDFChangeStatus?TemplatePdfKeyID=${templatePdfKeyID}&UserKeyID=${userKeyID}`
  );
  return res;
};

//Is default Template Callback function
export const GetChangeIsDefaultStatus = async (
  OrganisationKeyID,
  templateKeyID,
  isDefault,
  userKeyID
) => {
  let res;
  if (OrganisationKeyID === null) {
    res = await getListWithAuthenticated(
      `${TemplateBaseUrl}/TemplatesIsDefaultChangeStatus?UserKeyID=${userKeyID}&TemplateKeyID=${templateKeyID}&IsDefault=${isDefault}`
    );
  } else {
    res = await getListWithAuthenticated(
      `${TemplateBaseUrl}/TemplatesIsDefaultChangeStatus?OrganisationKeyID=${OrganisationKeyID}&UserKeyID=${userKeyID}&TemplateKeyID=${templateKeyID}&IsDefault=${isDefault}`
    );
  }

  return res;
};

export const GetTemplateListLookupList = async (params) => {
  let url = `/GetProposalEnggLetterTemplateLookUpList?OrganisationKeyID=${params.organisationKeyID}&TemplateTypeID=${params.TemplateTypeID}&clientID=${params.clientID}`;
  if (params.clientID == null) {
    url = `/GetProposalEnggLetterTemplateLookUpList?OrganisationKeyID=${params.organisationKeyID}&TemplateTypeID=${params.TemplateTypeID}&QuoteKeyID=${params.QuoteKeyID}`;
  }
  const res = await getListWithAuthenticated(TemplateBaseUrl + url);
  return res;
};
export const templateForIndividualList = async (id) => {
  const res = await getListWithAuthenticated(
    `${TemplateBaseUrl}/GetDefaultTemplateForOrganisationLookupList?OrganisationKeyID=${id}&TemplateTypeID=${2}&BusinessTypeID=${1}`
  );
  return res;
};
export const templateForSoleTraderList = async (id) => {
  const res = await getListWithAuthenticated(
    `${TemplateBaseUrl}/GetDefaultTemplateForOrganisationLookupList?OrganisationKeyID=${id}&TemplateTypeID=${2}&BusinessTypeID=${2}`
  );
  return res;
};
export const templateForCompanyList = async (id) => {
  const res = await getListWithAuthenticated(
    `${TemplateBaseUrl}/GetDefaultTemplateForOrganisationLookupList?OrganisationKeyID=${id}&TemplateTypeID=${2}&BusinessTypeID=${5}`
  );
  return res;
};
export const templateForLlpList = async (id) => {
  const res = await getListWithAuthenticated(
    `${TemplateBaseUrl}/GetDefaultTemplateForOrganisationLookupList?OrganisationKeyID=${id}&TemplateTypeID=${2}&BusinessTypeID=${4}`
  );
  return res;
};
export const templateForPartnershipList = async (id) => {
  const res = await getListWithAuthenticated(
    `${TemplateBaseUrl}/GetDefaultTemplateForOrganisationLookupList?OrganisationKeyID=${id}&TemplateTypeID=${2}&BusinessTypeID=${3}`
  );
  return res;
};

export const TemplateAvailableData = async (organisationKeyID, ClientID) => {
  const res = await getListWithAuthenticated(
    `${TemplateBaseUrl}/GetDefaultTemplateDetails?OrganisationKeyID=${organisationKeyID}&ClientID=${ClientID}&TemplateTypeCatID=1&TemplateTypeID=2`
  );
  // const res = TemplateAvailable;//await getListWithAuthenticated( );
  return res;
};
export const GetEmailTemplateListLookupList = async (
  organisationKeyID,
  userKeyID,
  TemplateTypeCatID,
  TemplateTypeID
) => {
  let url = `/GetTemplateLookupList?UserKeyID=${userKeyID}&TemplateTypeCatID=${TemplateTypeCatID}`;
  if (TemplateTypeID !== undefined && TemplateTypeID !== null) {
    url = `/GetTemplateLookupList?UserKeyID=${userKeyID}&TemplateTypeCatID=${TemplateTypeCatID}&TemplateTypeID=${TemplateTypeID}`;
  }

  if (organisationKeyID) {
    url += `&organisationKeyID=${organisationKeyID}`;
  }
  const res = await getListWithAuthenticated(TemplateBaseUrl + url);

  return res;
};

export const GetSingleApiSettingTemplateLookupList = async (
  organisationKeyID,
  userKeyID,
  TemplateTypeCatID,
  TemplateTypeID,
  OriginalBusinessTypeID
) => {
  let url = `/GetSingleApiSettingTemplateLookupList?UserKeyID=${userKeyID}&TemplateTypeCatID=${TemplateTypeCatID}`;
  if (TemplateTypeID !== undefined && TemplateTypeID !== null) {
    url = `/GetSingleApiSettingTemplateLookupList?UserKeyID=${userKeyID}&TemplateTypeCatID=${TemplateTypeCatID}&TemplateTypeID=${TemplateTypeID}`;
  }

  if (organisationKeyID) {
    url += `&organisationKeyID=${organisationKeyID}`;
  }
  if (OriginalBusinessTypeID) {
    url += `&OriginalBusinessTypeID=${OriginalBusinessTypeID}`;
  }
  const res = await getListWithAuthenticated(TemplateBaseUrl + url);

  return res;
};
// Copy Template data
export const CopyTemplate = async (TemplateKeyID, UserKeyID) => {
  const res = await postApiWithAuthenticated(
    `${TemplateBaseUrl}/CopyTemplateData?TemplateKeyID=${TemplateKeyID}&UserKeyID=${UserKeyID}`
  );
  return res;
};
// Copy Template Pdf
export const CopyTemplatePdf = async (TemplatePdfKeyID, UserKeyID) => {
  const res = await postApiWithAuthenticated(
    `${TemplateBaseUrlForPdf}/CopyImportTemplatePdf?TemplatePdfKeyID=${TemplatePdfKeyID}&UserKeyID=${UserKeyID}`
  );
  return res;
};
