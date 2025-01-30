import { Base_Url } from "../../../Base-Url/Base_Url";
import {
    getList,
    getListWithAuthenticated,
    postApiWithAuthenticated,
} from "../../reducer/reduxService";

//Global Constant Url

const globalConstantListUrl = `${Base_Url}/GlobalConstants`;

// Arrow function as a method

//Global Constant List Api Callback function
export const GetGlobalConstantList = async (params) => {
    const res = await postApiWithAuthenticated(
        globalConstantListUrl + "/GetGlobalConstantsList",
        params
    );
    return res;
};
export const GetGCAndGPDListForPricingFormula = async (params) => {
    const res = await postApiWithAuthenticated(
        globalConstantListUrl + "/GetGCAndGPDListForPricingFormula",
        params
    );
    return res;
};

//Global Constant AddUpdate List Api Callback function
export const AddUpdateGlobalConstant = async (url, params) => {
    const res = await postApiWithAuthenticated(
        `${globalConstantListUrl}${url}`,
        params
    );
    return res;
};

//Delete Global Constant Callback function
export const DeleteGlobalConstant = async (GlobalPricingDriverKeyID, userKeyID) => {
    const res = await getListWithAuthenticated(
        `${globalConstantListUrl}/GlobalConstantDelete?GlobalPricingDriverKeyID=${GlobalPricingDriverKeyID}&userKeyID=${userKeyID}`
    );
    return res;
};
//Global Constant Edit Data Services Callback function
export const GetGlobalConstantModel = async (id, GetSAChanges) => {

    let url = `${globalConstantListUrl}/GetGlobalConstantsModel?GlobalPricingDriverKeyID=${id}`
    if (GetSAChanges) {
        url = `${globalConstantListUrl}/GetGlobalConstantsModel?GlobalPricingDriverKeyID=${id}&GetSAChanges=${GetSAChanges}`
    }
    const res = await getListWithAuthenticated(url);
    return res;
};
// Global Constant change status Callback function
export const GlobalConstantChangeStatus = async (GlobalPricingDriverKeyID, userKeyID) => {
    const res = await getListWithAuthenticated(
        `${globalConstantListUrl}/GlobalConstantChangeStatus?GlobalPricingDriverKeyID=${GlobalPricingDriverKeyID}&userKeyID=${userKeyID}`
    );
    return res;
};
