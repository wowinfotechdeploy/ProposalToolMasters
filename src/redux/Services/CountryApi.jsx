import { Base_Url } from "../../Base-Url/Base_Url";
import { getList } from "../reducer/reduxService";
import { GetCountryLookUpList } from "../../Database/ProposalToolDatabase"

//..................Country Url......................................

const countryNameUrl = `${Base_Url}/Country/GetCountryLookUpList`
const countryCodeUrl = `${Base_Url}/CountryCode/GetCountryCodeLookUpList`


export const CountryName = async () => {
    const res = await GetCountryLookUpList; //await getList(countryNameUrl)
    return res
}

export const CountryCode = async () => {
    const res = await getList(countryCodeUrl)
    return res
}
