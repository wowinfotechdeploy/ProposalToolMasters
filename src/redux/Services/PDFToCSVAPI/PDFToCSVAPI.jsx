import { Base_Url } from "../../../Base-Url/Base_Url";
import {
  getListWithAuthenticated,
  postApiWithAuthenticated,
} from "../../reducer/reduxService";

export const uploadPdfForConversion = async (params) => {
  if (!params.pdfFile || params.pdfFile.type !== "application/pdf") {
    throw new Error("Please upload a valid PDF file.");
  }

  const url = `${Base_Url}/PDFtoCSV/UploadPDFFileAsync?OrganisationKeyID=${params.organisationKeyID}&UserKeyID=${params.userKeyID}`;

  const formData = new FormData();
  formData.append("file", params.pdfFile);

  const res = await postApiWithAuthenticated(url, formData, true); // true: assume it handles FormData/multipart
  return res;
};

export const getPreviouslyConvertedList = async (params) => {
  const url = `${Base_Url}/PDFtoCSV/GetPDFtoCSVConvertedList`;
  const res = await postApiWithAuthenticated(url, params);

  return res;
};

export const getPDFToCSVSubscriptionPackageList = async (params) => {
  const url = `${Base_Url}/PDFtoCSVSubscriptionPackage/GetPDFtoCSVSubscriptionPackageList`;
  const res = await postApiWithAuthenticated(url, params);

  return res;
};

export const addUpdatePDFToCSVSubscriptionPackage = async (params) => {
  const url = `${Base_Url}/PDFtoCSVSubscriptionPackage/AddUpdatePDFtoCSVSubscriptionPackage`;
  const res = await postApiWithAuthenticated(url, params);

  return res;
};

export const GetPDFToCSVSubscriptionPackageModel = async (id, userKeyID) => {
  const res = await getListWithAuthenticated(
    `${Base_Url}/PDFtoCSVSubscriptionPackage/GetPDFtoCSVSubscriptionPackageModel?PCSPKeyID=${id}&UserKeyID=${userKeyID}`
  );
  return res;
};

export const ChoosePDFToCSVPlanApi = async (userKeyID) => {
  const url = `${Base_Url}/PDFtoCSVSubscriptionPackage/GetChoosePDFtoCSVPlanLookupList?UserKeyID=${userKeyID}`;
  const res = await getListWithAuthenticated(url);
  return res;
};

//Buy Plan api
export const BuyPDFToCSVPlan = async (params) => {
  const url = `${Base_Url}/PDFtoCSVSubscriptionPackage/BuyPDFtoCSVPlan`;
  const res = await postApiWithAuthenticated(url, params);
  return res;
};

export const remainingPageCountAPI = async (organisationKeyID) => {
  const url = `${Base_Url}/PDFtoCSV/GetPDFToCSVPagesCount?OrganisationKeyID=${organisationKeyID}`;
  const res = await getListWithAuthenticated(url);
  return res;
};

export const GetSubscriptionHistoryAPI = async (organisationKeyID) => {
  const url = `${Base_Url}/PDFtoCSVSubscriptionPackage/OrganisationPDFtoCSVSubscriptionPackageList?OrganisationKeyID=${organisationKeyID}`;
  const res = await getListWithAuthenticated(url);
  return res;
};
