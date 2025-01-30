import { Base_Url } from "../../../Base-Url/Base_Url";
import {
    getListWithAuthenticated,
    postApiWithAuthenticated,
} from "../../reducer/reduxService";
import { EmailLookUpList } from "../../../Database/ProposalToolDatabase";

//Pricing Setting Base Url
const EmailConfigBaseUrl = `${Base_Url}/EmailConfig`;

//Get pricing setting Model Data Services Callback function
export const GetEmailConfigModel = async (id) => {
    const res = await getListWithAuthenticated(
        `${EmailConfigBaseUrl}/GetEmailConfigModel?organisationKeyID=${id}`
    );
    return res;
};

// user modal 
export const GetUserEmailConfigModel = async (id) => {
    const res = await getListWithAuthenticated(
        `${EmailConfigBaseUrl}/GetOrganisationEmailModel?organisationKeyID=${id}`
    );
    return res;
};

//AddUpdate pricing setting Callback function
export const AddUpdateEmailConfig = async (url, params) => {
    const res = await postApiWithAuthenticated(
        `${EmailConfigBaseUrl}${url}`,
        params
    );
    return res;
};

//AddUpdate user email setting Callback function
export const AddUpdateUserEmailConfig = async (url, params) => {
    const res = await postApiWithAuthenticated(
        `${EmailConfigBaseUrl}${url}`,
        params
    );
    return res;
};



// send email test
export const SendTestMail = async (params) => {
    const res = await postApiWithAuthenticated(
        `${EmailConfigBaseUrl}/SendTestEmail`,
        params
    );
    return res;
};

// option list
export const EmailTypeList = async () => {
    const res = await getListWithAuthenticated(
        `${Base_Url}/EmailProvider/GetEmailProviderLookupList`
    );
    return res;
};


export const SendEmailVerificationLinkForAwsSesConfiguration = async (EmailID, organisationKeyID, userKeyID, isReset) => {
    let url = `${EmailConfigBaseUrl}/SendEmailVerificationLinkForAwsSesConfiguration?EmailID=${EmailID}&OrganisationKeyID=${organisationKeyID}&UserKeyID=${userKeyID}&isReset=${false}`
    if (isReset) {
        url = `${EmailConfigBaseUrl}/SendEmailVerificationLinkForAwsSesConfiguration?EmailID=${EmailID}&OrganisationKeyID=${organisationKeyID}&UserKeyID=${userKeyID}&isReset=${isReset}`
    }
    const res = await getListWithAuthenticated(url);
    return res;
};

export const ChangeOrganisationDefaultSMTPServer = async (organisationKeyID, userKeyID, smtpServerTypeID) => {
    let url = `${EmailConfigBaseUrl}/ChangeOrganisationDefaultSMTPServer?OrganisationKeyID=${organisationKeyID}&UserKeyID=${userKeyID}&SMTPServerTypeID=${smtpServerTypeID}`
    const res = await getListWithAuthenticated(url);
    return res;
};