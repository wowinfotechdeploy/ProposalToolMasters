import { Base_Url } from "../../../Base-Url/Base_Url";
import { postApiWithAuthenticated, getListWithAuthenticated } from "../../reducer/reduxService";
const NotificationLogs = `${Base_Url}/Notification`
export const GetNotificationList = async (params) => {
    const res = await postApiWithAuthenticated(
        `${NotificationLogs}/GetNotificationList`, params
    );
    return res;
};
export const NotificationCount = async (userKeyID, OrganisationKeyID) => {
    let url = `${NotificationLogs}/NotificationUnSeenCount?UserKeyID=${userKeyID}`;
    if (OrganisationKeyID) {
        url += `&OrganisationKeyID=${OrganisationKeyID}`;
    }
    const res = await getListWithAuthenticated(url);
    return res;
};
export const VanishCount = async (userKeyID, OrganisationKeyID) => {
    let url = `${NotificationLogs}/NotificationSeen?UserKeyID=${userKeyID}`;
    if (OrganisationKeyID) {
        url += `&OrganisationKeyID=${OrganisationKeyID}`;
    }
    const res = await getListWithAuthenticated(url);
    return res;
};
export const NotifySuperAdminPredefinedChangesToAdmin = async (params) => {
    const res = await postApiWithAuthenticated(`${NotificationLogs}/NotifySuperAdminPredefinedChangesToAdmin`, params);
    return res;
};