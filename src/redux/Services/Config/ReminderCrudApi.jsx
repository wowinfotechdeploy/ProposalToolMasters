import { Base_Url } from "../../../Base-Url/Base_Url";
import {
    getListWithAuthenticated,
    postApiWithAuthenticated,
} from "../../reducer/reduxService";

//Term and Condition Base Url
const ReminderBaseUrl = `${Base_Url}/configure/Reminder`;



// Arrow function as a method
//Get Term and Condition List Data Services Callback function
export const GetReminderList = async (params) => {
    const res = await postApiWithAuthenticated(
        ReminderBaseUrl + "/GetReminderList",
        params
    );
    return res;
};

//Get Term and Condition Model Data Services Callback function
export const GetReminderModel = async (id, GetSAChanges) => {
    let url = `${ReminderBaseUrl}/GetReminderModel?ReminderKeyID=${id}`
    if (GetSAChanges) {
        url = `${ReminderBaseUrl}/GetReminderModel?ReminderKeyID=${id}&GetSAChanges=${GetSAChanges}`
    }
    const res = await getListWithAuthenticated(
        url
    );
    return res;
};

//AddUpdate Term and ConditionCallback function
export const AddUpdateReminders = async (params) => {
    const res = await postApiWithAuthenticated(
        `${ReminderBaseUrl}/AddUpdateReminder`,
        params
    );
    return res;
};

//Delete Term and Condition Callback function
export const ReminderDelete = async (reminderKeyID, userKeyID) => {
    const res = await getListWithAuthenticated(
        `${ReminderBaseUrl}/ReminderDelete?ReminderKeyID=${reminderKeyID}&UserKeyID=${userKeyID}`
    );
    return res;

};
export const ReminderChangeStatus = async (reminderKeyID, userKeyID) => {
    const res = await getListWithAuthenticated(
        `${ReminderBaseUrl}/ReminderChangeStatus?ReminderKeyID=${reminderKeyID}&UserKeyID=${userKeyID}`
    );
    return res;
};
//Delete Term and Condition Callback function
export const ChangeStatusForPaidUsersLoginToOutbooksWarningMail = async (userKeyID) => {
    const res = await getListWithAuthenticated(
        `${Base_Url}/ApplicationSetting/ChangeStatusForPaidUsersLoginToOutbooksWarningMail?UserKeyID=${userKeyID}`
    );
    return res;
};
export const ChangeStatusForUnpaidUsersLoginToOutbooksWarningMail = async (userKeyID) => {
    const res = await getListWithAuthenticated(
        `${Base_Url}/ApplicationSetting/ChangeStatusForUnpaidUsersLoginToOutbooksWarningMail?UserKeyID=${userKeyID}`
    );
    return res;
};


export const GetApplicationSettingList = async (userKeyID) => {
    const res = await getListWithAuthenticated(
        `${Base_Url}/ApplicationSetting/GetApplicationSettingList?UserKeyID=${userKeyID}`
    );
    return res;
};