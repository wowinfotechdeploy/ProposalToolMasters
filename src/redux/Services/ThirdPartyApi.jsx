import { Base_Url } from "../../Base-Url/Base_Url";
import { postApiWithAuthenticated } from "../reducer/reduxService";


//..................ThirdPartyAppLogin Url......................................

const url = `${Base_Url}/ThirdPartyAppLogin`


export const ThirdPartyAppLogin = async (params) => {
    const res = await postApiWithAuthenticated(url, params)
    return res
}
