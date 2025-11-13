import { Base_Url } from "../../../Base-Url/Base_Url";
import { getListWithAuthenticated } from "../../reducer/reduxService";

export const GetProspectSendMailStatus = async (
  UserKeyID,
  organisationKeyID,
  moduleName,
  moduleKeyID
) => {
  const url = `${Base_Url}/EmailConfig/GetProspectSendMailStatus?UserKeyID=${UserKeyID}&OrganisationKeyID=${organisationKeyID}&ModuleName=${moduleName}`;
  const res = await getListWithAuthenticated(url);
  return res;
};

export const ChangeFailedMailLogStatus = async (
  UserKeyID,
  organisationKeyID,
  moduleName,
  moduleKeyID
) => {
  const url = `${Base_Url}/EmailConfig/ChangeFailedMailLogStatus?UserKeyID=${UserKeyID}&OrganisationKeyID=${organisationKeyID}&ModuleName=${moduleName}&IsResend=false`;
  const res = await getListWithAuthenticated(url);
  return res;
};

export const ResendAddUpdateQuote = async (UserKeyID, organisationKeyID) => {
  const url = `${Base_Url}/Quote/ResendAddUpdateQuote?UserKeyID=${UserKeyID}&OrganisationKeyID=${organisationKeyID}`;
  // const url = `${Base_Url}/Quote/ResendAddUpdateQuote?UserKeyID=${UserKeyID}&OrganisationKeyID=${organisationKeyID}&QuoteKeyID=${QuoteKeyID}`;
  const res = await getListWithAuthenticated(url);
  return res;
};
