import { Base_Url } from "../../../Base-Url/Base_Url";
import {
    getListWithAuthenticated,
    postApiWithAuthenticated,
} from "../../reducer/reduxService";

// Create the URL with the `id` parameter using a template literal
export const GetTemplateTypeList = async (id) => {
    const TemplateTypeUrl = `${Base_Url}/TemplateType/GetTemplateTypeLookUpList?tempCatID=${id}`;

    const res = await getListWithAuthenticated(TemplateTypeUrl);
    return res;
};
