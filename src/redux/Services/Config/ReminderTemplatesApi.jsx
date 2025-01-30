import { Base_Url } from "../../../Base-Url/Base_Url";
import {
    getListWithAuthenticated,
    postApiWithAuthenticated,
} from "../../reducer/reduxService";

//Term and Condition Base Url
const ReminderTemplateBaseUrl = `${Base_Url}/ReminderEmailTemplates`;

// Arrow function as a method
//Get Term and Condition List Data Services Callback function
export const GetReminderTemplatesList = async (params) => {
    const res = await postApiWithAuthenticated(
        ReminderTemplateBaseUrl + "/GetReminderEmailTemplatesList",
        params
    );
    return res;
};

//Get Term and Condition Model Data Services Callback function
export const GetReminderTemplatesModel = async (id, GetSAChanges) => {
    let url = `${ReminderTemplateBaseUrl}/GetReminderEmailTemplatesModel?TemplateKeyID=${id}`
    if (GetSAChanges) {
        url = `${ReminderTemplateBaseUrl}/GetReminderEmailTemplatesModel?TemplateKeyID=${id}&GetSAChanges=${GetSAChanges}`
    }
    const res = await getListWithAuthenticated(
        url
    );
    return res;
};

//AddUpdate Term and ConditionCallback function
export const AddUpdateReminderTemplates = async (url, params) => {
    const res = await postApiWithAuthenticated(
        `${ReminderTemplateBaseUrl}${url}`,
        params
    );
    return res;
};

//Delete Term and Condition Callback function
export const ReminderTemplatesDelete = async (templateKeyID, userKeyID) => {
    const res = await getListWithAuthenticated(
        `${ReminderTemplateBaseUrl}/ReminderEmailTemplatesDelete?templateKeyID=${templateKeyID}&userKeyID=${userKeyID}`
    );
    return res;
};

//Delete Term and Condition Callback function
export const ReminderTemplatesChangeStatus = async (templateKeyID, userKeyID) => {
    const res = await getListWithAuthenticated(
        `${ReminderTemplateBaseUrl}/ReminderEmailTemplatesChangeStatus?templateKeyID=${templateKeyID}&userKeyID=${userKeyID}`
    );
    return res;
};


export const GetChangeIsDefaultStatus = async (OrganisationKeyID, templateKeyID, isDefault, userKeyID) => {
    let res;
    if (OrganisationKeyID === null) {
        res = await getListWithAuthenticated(
            `${ReminderTemplateBaseUrl}/ReminderEmailTemplatesIsDefaultChangeStatus?UserKeyID=${userKeyID}&TemplateKeyID=${templateKeyID}&IsDefault=${isDefault}`
        );
    } else {
        res = await getListWithAuthenticated(
            `${ReminderTemplateBaseUrl}/ReminderEmailTemplatesIsDefaultChangeStatus?OrganisationKeyID=${OrganisationKeyID}&UserKeyID=${userKeyID}&TemplateKeyID=${templateKeyID}&IsDefault=${isDefault}`
        );
    }
    return res;
};