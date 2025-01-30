import { Base_Url } from "../../../Base-Url/Base_Url";
import {
    getListWithAuthenticated,
    postApiWithAuthenticated,
} from "../../reducer/reduxService";

//Pricing Setting Base Url
const PricingSettingBaseUrl = `${Base_Url}/PricingSettings`;

//Get pricing setting Model Data Services Callback function
export const GetPricingSettingModel = async (id) => {
    const res = await getListWithAuthenticated(
        `${PricingSettingBaseUrl}/GetPricingSettingsModel?organisationKeyID=${id}`
    );
    return res;
};

//AddUpdate pricing setting Callback function
export const AddUpdatePricingSetting = async (url, params) => {
    const res = await postApiWithAuthenticated(
        `${PricingSettingBaseUrl}${url}`,
        params
    );
    return res;
};
