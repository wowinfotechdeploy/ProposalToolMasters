import { Base_Url } from "../../../Base-Url/Base_Url";
import {
    getListWithAuthenticated,
    postApiWithAuthenticated,
} from "../../reducer/reduxService";

//Access Key Base Url
const AccessKeyBaseUrl = `${Base_Url}/AccessKey`;

// Arrow function as a method
//Get Access Key List Data  Callback function
export const GetAccessKeyList = async (params) => {
    const res = await postApiWithAuthenticated(
        AccessKeyBaseUrl + "/GetAccessKeyList",
        params
    );
    return res;
};
//AddUpdate Access Key Callback function
export const AddUpdateAccessKey = async (url, params) => {
    const res = await postApiWithAuthenticated(
        `${AccessKeyBaseUrl}${url}`,
        params
    );
    return res;
};

//Delete Access Key Callback function
export const AccessKeyChangeStatus = async (id, userKeyID) => {
    const res = await getListWithAuthenticated(
        `${AccessKeyBaseUrl}/ChangeAccessKeyStatus?AccessKeyKeyID=${id}&UserKeyID=${userKeyID}`
    );
    return res;
};
export const DeleteAccessKey = async (id, userKeyID) => {
    const res = await getListWithAuthenticated(
        `${AccessKeyBaseUrl}/AccessKeyDelete?AccessKeyKeyID=${id}&UserKeyID=${userKeyID}`
    );
    return res;
};

export const EnableAccessKeyApiIntegationChangeStatus = async (OrganisationKeyID, userKeyID) => {
    const res = await getListWithAuthenticated(
        `${AccessKeyBaseUrl}/EnableSingleApiIntegrationStatus?OrganisationKeyID=${OrganisationKeyID}&UserKeyID=${userKeyID}`
    );
    return res;
};