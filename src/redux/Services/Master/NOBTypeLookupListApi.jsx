import { Base_Url } from "../../../Base-Url/Base_Url";
import { NOBTypeLookupList } from "../../../Database/ProposalToolDatabase";
import {
    getListWithAuthenticated,
    postApiWithAuthenticated,
} from "../../reducer/reduxService";
const BusinessTypeUrl = `${Base_Url}/BusinessNature/GetNatureOfBusinessVariationLookupList`;
//..............................NOB Type Services Callback function.................................

export const GetNOBTypeLookupList = async (organisationKeyID, userKeyID) => {
    let url = `${BusinessTypeUrl}?UserKeyID=${userKeyID}&OrganisationKeyID=${organisationKeyID}`
    if (organisationKeyID == null || organisationKeyID == undefined || organisationKeyID == "") {
        url = `${BusinessTypeUrl}?UserKeyID=${userKeyID}`
    }
    const res = await getListWithAuthenticated(url) //NOBTypeLookupList
    return res;
};
