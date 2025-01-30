import { Base_Url } from "../../../Base-Url/Base_Url";
import { AdminRoleTypeLookupList, SuperAdminRoleTypeLookupList } from "../../../Database/ProposalToolDatabase";
import { getListWithAuthenticated } from "../../reducer/reduxService";

const RoleTypeUrl = `${Base_Url}/RoleType/GetRoleTypeLookUpList`;

//User Role Type Callback function

export const UserRole = async (callingFrom) => {
    let res = null;
    res = await getListWithAuthenticated(RoleTypeUrl);
    // if (callingFrom === "Admin") {
    //     res = await AdminRoleTypeLookupList // getListWithAuthenticated(RoleTypeUrl);
    // } else if (callingFrom === "SuperAdmin") {
    //     res = await SuperAdminRoleTypeLookupList // getListWithAuthenticated(RoleTypeUrl);
    // }

    return res;
};
