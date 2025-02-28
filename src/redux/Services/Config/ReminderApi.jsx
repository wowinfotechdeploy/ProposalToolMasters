import { Base_Url } from "../../../Base-Url/Base_Url";
import {
    postApiWithAuthenticated,
    getListWithAuthenticated,
} from "../../reducer/reduxService";

// Base URL for Reminder Template
const ReminderTemplateBaseUrl = `${Base_Url}/ReminderMaster`;

// Get Email Address Type Lookup List
export const GetEmailAddressTypeLookupList = async (ReminderTypeID) => {
    const res = await getListWithAuthenticated(
        ReminderTemplateBaseUrl + `/GetEmailAddressTypeLookupList?ReminderTypeID=${ReminderTypeID}`
    );
    return res;
};

// Get Trigger Point Type Lookup List
export const GetTriggerPointTypeLookupList = async (ReminderTypeID, EmailAddressTypeID, EmailAddressIDType) => {
    const res = await getListWithAuthenticated(
        `${ReminderTemplateBaseUrl}/GetTriggerPointTypeLookupList?ReminderTypeID=${ReminderTypeID}&EmailAddressTypeID=${EmailAddressTypeID}&EmailAddressIDType=${EmailAddressIDType}`
    );
    return res;
};


// Get Frequency Lookup List
export const GetFrequencyLookUpList = async (params) => {
    const res = await getListWithAuthenticated(
        ReminderTemplateBaseUrl + "/GetFrequencyLookUpList",
        params
    );
    return res;
};

// Get Document Status Type Lookup List
export const GetDocumentStatusTypeLookUpList = async (params) => {
    const res = await getListWithAuthenticated(
        ReminderTemplateBaseUrl + "/GetDocumentStatusTypeLookUpList",
        params
    );
    return res;
};

