import { Base_Url } from "../../../Base-Url/Base_Url";
import { QuoteTypeLookupList } from "../../../Database/ProposalToolDatabase";
import {
    getListWithAuthenticated,
} from "../../reducer/reduxService";
const quoteTypeUrl = `${Base_Url}/QuoteType/GetQuoteTypeLookupList`;
//..............................Profession Type Services Callback function.................................

export const GetQuoteTypeLookupList = async () => {
    const res = await QuoteTypeLookupList // getListWithAuthenticated(quoteTypeUrl);
    return res;
};
