import { Base_Url } from "../../../Base-Url/Base_Url";
import { getListWithAuthenticated } from "../../reducer/reduxService";

const OrganisationLookupListUrl = `${Base_Url}/Organisation`;
//Organisations List Callback function

export const GetOrganisationLookupList = async (keyID) => {
    const res = await getListWithAuthenticated(
        `${OrganisationLookupListUrl}/GetOrganisationLookupList?UserKeyID=${keyID}`
    );
    return res;
};
export const GetAllOrganisationLookupList = async (keyID) => {
    const res = await getListWithAuthenticated(
        `${OrganisationLookupListUrl}/GetAllOrganisationLookupList?UserKeyID=${keyID}`
    );
    return res;
};
export const OrganisationLoginUpdate = async (UserKeyID, OrganisationKeyID) => {
    let url = `${OrganisationLookupListUrl}/UpdateOrganisationLastLogin?UserKeyID=${UserKeyID}&OrganisationKeyID=${OrganisationKeyID}`
    if (OrganisationKeyID === null) {
        url = `${OrganisationLookupListUrl}/UpdateOrganisationLastLogin?UserKeyID=${UserKeyID}`
    }
    const res = await getListWithAuthenticated(url);
    return res;
};
