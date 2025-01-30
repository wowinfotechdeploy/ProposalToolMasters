import { Base_Url } from "../../../Base-Url/Base_Url";
import { BusinessTypeLookupList } from "../../../Database/ProposalToolDatabase";
import {
    getListWithAuthenticated,
    postApiWithAuthenticated,
} from "../../reducer/reduxService";
const BusinessTypeUrl = `${Base_Url}/BusinessType/GetBusinessTypeLookUpList`;
const ProspectTypeVariationUrl = `${Base_Url}/BusinessType/GetProspectTypeVariationLookupList`;
//..............................Profession Type Services Callback function.................................

export const GetBusinessTypeLookupList = async () => {
    const res = await BusinessTypeLookupList//await getListWithAuthenticated(BusinessTypeUrl);
    return res;
};

export const GetProspectTypeVariationLookupList = async (organisationKeyID, userKeyID) => {
    let url = `${ProspectTypeVariationUrl}?UserKeyID=${userKeyID}&OrganisationKeyID=${organisationKeyID}`
    if (organisationKeyID == null || organisationKeyID == undefined || organisationKeyID == "") {
        url = `${ProspectTypeVariationUrl}?UserKeyID=${userKeyID}`
    }
    const res = await getListWithAuthenticated(url);
    return res;
};
