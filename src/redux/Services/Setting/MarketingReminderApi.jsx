import { Base_Url } from "../../../Base-Url/Base_Url";
import {
    getListWithAuthenticated,
    postApiWithAuthenticated,
} from "../../reducer/reduxService";
//Term and Condition Base Url
const ReminderBaseUrl = `${Base_Url}/MarketingReminder`;
// Arrow function as a method
//Get Term and Condition List Data Services Callback function
export const GetMarketingReminderList = async (params) => {
    const res = await postApiWithAuthenticated(
        ReminderBaseUrl + "/GetMarketingReminderList",
        params
    );
    return res;
};
//Get Term and Condition Model Data Services Callback function
export const GetMarketingReminderModel = async (id) => {
    const res = await getListWithAuthenticated(
        `${ReminderBaseUrl}/GetMarketingReminderModel?ReminderKeyID=${id}`
    );
    return res;
};
//AddUpdate Term and ConditionCallback function
export const AddUpdateMarketingReminder = async (params) => {
    const res = await postApiWithAuthenticated(
        `${ReminderBaseUrl}/AddUpdateMarketingReminder`,
        params
    );
    return res;
};
//Delete Term and Condition Callback function
export const MarketingReminderDelete = async (reminderKeyID, userKeyID) => {
    const res = await getListWithAuthenticated(
        `${ReminderBaseUrl}/MarketingReminderDelete?ReminderKeyID=${reminderKeyID}&UserKeyID=${userKeyID}`
    );
    return res;
};
//Delete Term and Condition Callback function
export const MarketingReminderChangeStatus = async (reminderKeyID, userKeyID) => {
    const res = await getListWithAuthenticated(
        `${ReminderBaseUrl}/MarketingReminderChangeStatus?ReminderKeyID=${reminderKeyID}&UserKeyID=${userKeyID}`
    );
    return res;
};