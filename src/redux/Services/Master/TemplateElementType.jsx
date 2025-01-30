import { Base_Url } from "../../../Base-Url/Base_Url";
import { TemplateElementTypeLookupList } from "../../../Database/ProposalToolDatabase";
import {
    getListWithAuthenticated,
    postApiWithAuthenticated,
} from "../../reducer/reduxService";
const TemplateElementTypeUrl = `${Base_Url}/TemplateElementType/GetTemplateElementTypeLookUpList`;
//..............................Profession Type Services Callback function.................................

export const GetTemplateElementTypeLookUpList = async () => {
    const res = await TemplateElementTypeLookupList // getListWithAuthenticated(TemplateElementTypeUrl);
    return res;
};
