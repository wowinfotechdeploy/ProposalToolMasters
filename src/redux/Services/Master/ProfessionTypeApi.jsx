import { Base_Url } from "../../../Base-Url/Base_Url";
import { ProfessionTypeLookupList } from "../../../Database/ProposalToolDatabase";
import {
    getListWithAuthenticated,
    postApiWithAuthenticated,
} from "../../reducer/reduxService";
const professionTypeUrl = `${Base_Url}/ProfessionType`;
//..............................Profession Type Services Callback function.................................

export const GetProfessionTypeLookupList = async (userKeyId, organisationKeyID) => {
    const res = await ProfessionTypeLookupList //getListWithAuthenticated(`${professionTypeUrl}/GetProfessionTypeLookUpList?userKeyID=${userKeyId}&organisationKeyID=${organisationKeyID}`);
    return res;
};
