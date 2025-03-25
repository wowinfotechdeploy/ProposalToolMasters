import { Base_Url } from "../../../Base-Url/Base_Url";
import {
    getListWithAuthenticated,
    postApiWithAuthenticated,
} from "../../reducer/reduxService";

//Service Category Base Url
const ServiceCategoryBaseUrl = `${Base_Url}/configure/ServiceCategory`;

// Arrow function as a method
//Get Service Category List Data Services Callback function
export const GetServiceCategoryList = async (params) => {
    const res = await postApiWithAuthenticated(
        ServiceCategoryBaseUrl + "/GetServiceCategoryList",
        params
    );
    return res;
};

//Get Service Category Model Data Services Callback function
export const GetServiceCategoryModel = async (id, GetSAChanges) => {
    let url = `${ServiceCategoryBaseUrl}/GetServiceCategoryModel?ServiceCatKeyID=${id}`
    if (GetSAChanges) {
        url = `${ServiceCategoryBaseUrl}/GetServiceCategoryModel?ServiceCatKeyID=${id}&GetSAChanges=${GetSAChanges}`
    }

    const res = await getListWithAuthenticated(url);
    return res;
    ;
}
//AddUpdate Service Category Callback function
export const AddUpdateServiceCategory = async (url, params) => {
    const res = await postApiWithAuthenticated(
        `${ServiceCategoryBaseUrl}${url}`,
        params
    );
    return res;
};

//Delete Service Category Callback function
export const DeleteServiceCategory = async (ServiceCatKeyID, userKeyID) => {
    const res = await getListWithAuthenticated(
        `${ServiceCategoryBaseUrl}/ServiceCategoryDelete?ServiceCatKeyID=${ServiceCatKeyID}&userKeyID=${userKeyID}`
    );
    return res;
};

//Delete Service Category Callback function
export const ServiceCategoryChangeStatus = async (ServiceCatKeyID, userKeyID) => {
    const res = await getListWithAuthenticated(
        `${ServiceCategoryBaseUrl}/ServiceCategoryChangeStatus?ServiceCatKeyID=${ServiceCatKeyID}&userKeyID=${userKeyID}`
    );
    return res;
};


export const DeclineSuperAdminChanges = async (params) => {
    const res = await postApiWithAuthenticated(
        `${ServiceCategoryBaseUrl}/DeclineSuperAdminChanges`,
        params
    );
    return res;
};

export const CopyServiceCategory = async(ServiceCatKeyID, UserKeyID) => {
    const res= await postApiWithAuthenticated(
        `${ServiceCategoryBaseUrl}/CopyServiceCategory?ServiceCatKeyID=${ServiceCatKeyID}&UserKeyID=${UserKeyID}`,
    );
    return res;
}