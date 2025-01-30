import { Base_Url } from "../../../Base-Url/Base_Url";
import { IncorporatedInLookUpList } from "../../../Database/ProposalToolDatabase";
import {
    getListWithAuthenticated,
    postApiWithAuthenticated,
} from "../../reducer/reduxService";
const IncorporatedInList = `${Base_Url}/IncorporatedIn/GetIncorporatedInLookUpList`;
//..............................Profession Type Services Callback function.................................

export const GetIncorporatedInLookUpList = async () => {
    const res = await IncorporatedInLookUpList// getListWithAuthenticated(IncorporatedInList);
    return res;
};
