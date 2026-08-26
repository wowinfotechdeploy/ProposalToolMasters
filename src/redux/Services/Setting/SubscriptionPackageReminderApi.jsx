import { Base_Url } from "../../../Base-Url/Base_Url";
import {
    getListWithAuthenticated,
    postApiWithAuthenticated,
} from "../../reducer/reduxService";
//Term and Condition Base Url
const ReminderBaseUrl = `${Base_Url}/SubscriptionPackageReminder`;
// Arrow function as a method
//Get Term and Condition List Data Services Callback function
export const GetSubscriptionPackageReminderList = async (params) => {
    const res = await postApiWithAuthenticated(
        ReminderBaseUrl + "/GetSubscriptionPackageReminderList",
        params
    );
    return res;
};
export const GetSubscriptionPackageReminderModel = async (id) => {
    const res = await getListWithAuthenticated(
        `${ReminderBaseUrl}/GetSubscriptionPackageReminderModel?ReminderKeyID=${id}`
    );
    return res;
};
export const SubscriptionPackageReminderDelete = async (reminderKeyID, userKeyID) => {
    const res = await getListWithAuthenticated(
        `${ReminderBaseUrl}/SubscriptionPackageReminderDelete?ReminderKeyID=${reminderKeyID}&UserKeyID=${userKeyID}`
    );
    return res;
};
//Delete Term and Condition Callback function
export const SubscriptionReminderChangeStatus = async (reminderKeyID, userKeyID) => {
    const res = await getListWithAuthenticated(
        `${ReminderBaseUrl}/SubscriptionPackageReminderChangeStatus?ReminderKeyID=${reminderKeyID}&UserKeyID=${userKeyID}`
    );
    return res;
};
export const GetOldOrganisationsWithFreePackage = async () => {
    const res = await getListWithAuthenticated(
        `${ReminderBaseUrl}/GetOldFreePackageUpgradeOrganisations`
    );
    return res;
};
export const GetFreePackageOrganisationList = async (userKeyID,pageSize) => {
    const res = await getListWithAuthenticated(
        `${ReminderBaseUrl}/GetFreePackageOrganisationList?UserKeyID=${userKeyID}&PageSize=${pageSize}`
    );
    return res;
};
export const AddFreePackageUpgradeRemindersForSelectedOrganisations = async (params) => {
    const res = await postApiWithAuthenticated(
        `${ReminderBaseUrl}/AddFreePackageUpgradeRemindersForSelectedOrganisations`,
        params
    );
    return res;
};
//Get Term and Condition Model Data Services Callback function
// export const GetMarketingReminderModel = async (id) => {
//     const res = await getListWithAuthenticated(
//         `${ReminderBaseUrl}/GetMarketingReminderModel?ReminderKeyID=${id}`
//     );
//     return res;
// };
// //AddUpdate Term and ConditionCallback function
// export const AddUpdateMarketingReminder = async (params) => {
//     const res = await postApiWithAuthenticated(
//         `${ReminderBaseUrl}/AddUpdateMarketingReminder`,
//         params
//     );
//     return res;
// };
// //Delete Term and Condition Callback function
// export const MarketingReminderDelete = async (reminderKeyID, userKeyID) => {
//     const res = await getListWithAuthenticated(
//         `${ReminderBaseUrl}/MarketingReminderDelete?ReminderKeyID=${reminderKeyID}&UserKeyID=${userKeyID}`
//     );
//     return res;
// };
// //Delete Term and Condition Callback function
// export const MarketingReminderChangeStatus = async (reminderKeyID, userKeyID) => {
//     const res = await getListWithAuthenticated(
//         `${ReminderBaseUrl}/MarketingReminderChangeStatus?ReminderKeyID=${reminderKeyID}&UserKeyID=${userKeyID}`
//     );
//     return res;
// };