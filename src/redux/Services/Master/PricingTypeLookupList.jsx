import { Base_Url } from "../../../Base-Url/Base_Url";
import { PricingTypeLookupList } from "../../../Database/ProposalToolDatabase";
import { getListWithAuthenticated } from "../../reducer/reduxService";

//Pricing Type Url

const PricingType = `${Base_Url}/PricingType`;

//Service Charge Type function
export const PricingTypeList = async () => {
    const res = await PricingTypeLookupList //getListWithAuthenticated(`${PricingType}/GetPricingTypeLookupList` );
    return res;
};
