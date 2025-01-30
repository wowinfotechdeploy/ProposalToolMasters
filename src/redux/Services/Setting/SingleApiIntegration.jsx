import { Base_Url } from "../../../Base-Url/Base_Url";
import { getListWithAuthenticated, postApiWithAuthenticated } from "../../reducer/reduxService";
//Super email template Base Url
const SingleApiSetting = `${Base_Url}/SingleApiSetting`;

export const AddUpdateSingleApiSettings = async (params) => {
    const res = await postApiWithAuthenticated(`${SingleApiSetting}/AddUpdateSingleApiSettings`, params);
    return res;
};

export const GetSingleApiSettingsModel = async (UserKeyID, OrganisationKeyID) => {
    const res = await getListWithAuthenticated(`${SingleApiSetting}/GetSingleApiSettingsModel?UserKeyID=${UserKeyID}&OrganisationKeyID=${OrganisationKeyID}`);
    return res;
};