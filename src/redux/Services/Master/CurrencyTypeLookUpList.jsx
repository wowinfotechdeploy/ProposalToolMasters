import { Base_Url } from "../../../Base-Url/Base_Url";
import { CurrencyTypeLookUpList } from "../../../Database/ProposalToolDatabase";
import {
    getListWithAuthenticated,
    postApiWithAuthenticated,
} from "../../reducer/reduxService";
const CurrencyTypeUrl = `${Base_Url}/Currency/GetCurrencyLookUpList`;
//..............................Profession Type Services Callback function.................................

export const GetCurrencyTypeList = async () => {
    const res = await CurrencyTypeLookUpList //getListWithAuthenticated(CurrencyTypeUrl);
    return res;
};
