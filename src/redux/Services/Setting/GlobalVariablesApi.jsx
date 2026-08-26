import { Base_Url } from "../../../Base-Url/Base_Url";
import {
    getListWithAuthenticated,
    postApiWithAuthenticated,
} from "../../reducer/reduxService";

const globalVariableBaseUrl = `${Base_Url}/GlobalVariables`;


//Get pricing setting Model Data Services Callback function
export const GetGlobalProspectVariables = async (id) => {
    const res = await getListWithAuthenticated(
        `${globalVariableBaseUrl}/GetGlobalProspectVariables?organisationKeyID=${id}`
    );
    return res;
};

export const AddUpdateGlobalProspectVariables = async (params) => {
    const res = await postApiWithAuthenticated(
        `${globalVariableBaseUrl}/AddUpdateGlobalProspectVariables`, params
    );
    return res;
};