import { Base_Url } from "../../Base-Url/Base_Url";
import { getList, getListWithAuthenticated, postApiWithAuthenticated } from "../reducer/reduxService";
import { GetCountryLookUpList } from "../../Database/ProposalToolDatabase"

//..................Country Url......................................

const SignEasyUrl = `${Base_Url}/SignEasy`


export const GetVariableValuesForTnCTemplate = async (ClientID, UserKeyID, OrganisationKeyID) => {
    // const res = await getListWithAuthenticated(`${Base_Url}/Quote/GetVariableValuesForTnCTemplate?clientID=${ClientID}&UserKeyID=${UserKeyID}&OrganisationKeyID=${OrganisationKeyID}`)
    const res = await getListWithAuthenticated(`${Base_Url}/Quote/GetVariableValuesForTnCTemplate?clientID=${ClientID}`)
    return res
}

