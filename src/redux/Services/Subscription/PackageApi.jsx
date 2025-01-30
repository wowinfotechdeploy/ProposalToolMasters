import { Base_Url } from "../../../Base-Url/Base_Url";
import {
    getListWithAuthenticated,
    postApiWithAuthenticated,
} from "../../reducer/reduxService";

//Subscription package Base Url
const SubscriptionPackageBaseUrl = `${Base_Url}/SubscriptionPackage`;

// Arrow function as a method
//Get subscription package List Data Services Callback function
export const GetSubscriptionPackageList = async (params) => {
    const res = await postApiWithAuthenticated(
        SubscriptionPackageBaseUrl + "/GetSubscriptionPackageList",
        params
    );
    return res;
};

//Delete subscription package Callback function
export const DeleteSubscriptionPackage = async (id, userKeyID) => {
    const res = await getListWithAuthenticated(
        `${SubscriptionPackageBaseUrl}/SubscriptionPackageDelete?SubscriptionPackageKeyID=${id}&UserKeyID=${userKeyID}`
    );
    return res;
};

//Delete subscription package Callback function
export const SubscriptionPackageChangeStatus = async (id, userKeyID) => {
    const res = await getListWithAuthenticated(
        `${SubscriptionPackageBaseUrl}/SubscriptionPackageChangeStatus?SubscriptionPackageKeyID=${id}&UserKeyID=${userKeyID}`
    );
    return res;
};

//Subscription package Edit Data Services Callback function
export const GetSubscriptionPackageModel = async (id) => {
    const res = await getListWithAuthenticated(
        `${SubscriptionPackageBaseUrl}/GetSubscriptionPackageModel?SubscriptionPackageKeyID=${id}`
    );
    return res;
};

//Subscription package AddUpdate List Api Callback function
export const AddUpdateSubscriptionPackage = async (params) => {
    const res = await postApiWithAuthenticated(
        `${SubscriptionPackageBaseUrl}/AddUpdateSubscriptionPackage`,
        params
    );
    return res;
};
export const GetOrganisationInvoiceList = async (params) => {

    let url = params.StatusID !== undefined && params.StatusID !== null ?
        `/GetOrganisationInvoiceList?StatusID=${params.StatusID}` :
        `/GetOrganisationInvoiceList`
    const res = await postApiWithAuthenticated(
        SubscriptionPackageBaseUrl + url,
        params
    );
    return res;
};
