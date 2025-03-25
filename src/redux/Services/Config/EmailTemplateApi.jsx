import { Base_Url } from "../../../Base-Url/Base_Url";
import {
    getListWithAuthenticated,
    postApiWithAuthenticated,
} from "../../reducer/reduxService";

//Term and Condition Base Url
const EmailTemplateBaseUrl = `${Base_Url}/EmailTemplates`;

// Arrow function as a method
//Get Term and Condition List Data Services Callback function
export const GetEmailTemplatesList = async (params) => {
    const res = await postApiWithAuthenticated(
        EmailTemplateBaseUrl + "/GetEmailTemplatesList",
        params
    );
    return res;
};

//Get Term and Condition Model Data Services Callback function
export const GetEmailTemplatesModel = async (KeyID, GetSAChanges) => {
    // const res = await getListWithAuthenticated(
    //     `${EmailTemplateBaseUrl}/GetEmailTemplatesModel?TemplateKeyID=${id}`
    // );
    // return res;
    let url = `${EmailTemplateBaseUrl}/GetEmailTemplatesModel?TemplateKeyID=${KeyID}`
    if (GetSAChanges) {
        url = `${EmailTemplateBaseUrl}/GetEmailTemplatesModel?TemplateKeyID=${KeyID}&GetSAChanges=${GetSAChanges}`
    }
    const res = await getListWithAuthenticated(url);
    return res;
};

//AddUpdate Term and ConditionCallback function
export const AddUpdateEmailTemplates = async (url, params) => {
    const res = await postApiWithAuthenticated(
        `${EmailTemplateBaseUrl}${url}`,
        params
    );
    return res;
};

//Delete Term and Condition Callback function
export const EmailTemplatesDelete = async (templateKeyID, userKeyID) => {
    const res = await getListWithAuthenticated(
        `${EmailTemplateBaseUrl}/EmailTemplatesDelete?templateKeyID=${templateKeyID}&userKeyID=${userKeyID}`
    );
    return res;
};

//Delete Term and Condition Callback function
export const EmailTemplatesChangeStatus = async (templateKeyID, userKeyID) => {
    const res = await getListWithAuthenticated(
        `${EmailTemplateBaseUrl}/EmailTemplatesChangeStatus?templateKeyID=${templateKeyID}&userKeyID=${userKeyID}`
    );
    return res;
};


export const GetChangeIsDefaultStatus = async (OrganisationKeyID, templateKeyID, isDefault, userKeyID) => {
    let res;
    if (OrganisationKeyID === null) {
        res = await getListWithAuthenticated(
            `${EmailTemplateBaseUrl}/EmailTemplatesIsDefaultChangeStatus?UserKeyID=${userKeyID}&TemplateKeyID=${templateKeyID}&IsDefault=${isDefault}`
        );
    } else {
        res = await getListWithAuthenticated(
            `${EmailTemplateBaseUrl}/EmailTemplatesIsDefaultChangeStatus?OrganisationKeyID=${OrganisationKeyID}&UserKeyID=${userKeyID}&TemplateKeyID=${templateKeyID}&IsDefault=${isDefault}`
        );
    }
    return res;
};

export const CopyEmail = async (TemplateKeyID,UserKeyID) => {
    const res = await postApiWithAuthenticated(
        `${EmailTemplateBaseUrl}/CopyEmailTemplate?TemplateKeyID=${TemplateKeyID}&UserKeyID=${UserKeyID}`
    );
    return res;
};