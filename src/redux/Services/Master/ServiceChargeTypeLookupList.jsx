import { Base_Url } from "../../../Base-Url/Base_Url";
import { ServiceChargeTypeLookupList } from "../../../Database/ProposalToolDatabase";
import { getListWithAuthenticated } from "../../reducer/reduxService";

//Service Charge Type Url

const ServiceChargeType = `${Base_Url}/ServiceChargeType`;

//Service Charge Type function
export const ServiceChargeTypeList = async () => {
    const res = await ServiceChargeTypeLookupList  //getListWithAuthenticated(`${ServiceChargeType}/GetServiceChargeTypeLookupList` );
    return res;
};
