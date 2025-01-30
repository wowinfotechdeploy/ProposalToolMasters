
import { OldOutbooksBaseUrl } from "../../../Base-Url/Base_Url"
import { postApiWithAuthenticated } from "../../reducer/reduxService"

//..................ThirdPartyAppLogin Url......................................



const url = `${OldOutbooksBaseUrl}`


export const ThirdPartyAppLogin = async (params) => {
    const res = await postApiWithAuthenticated(`${url}/ThirdPartAppLogin`, params)
    return res
}

export const verifyOutbooksUser = async (params) => {
    const res = await postApiWithAuthenticated(`${url}/verify-outbooks-user`, params)
    return res
}

