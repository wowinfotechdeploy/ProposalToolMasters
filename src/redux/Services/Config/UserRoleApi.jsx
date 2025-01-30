import { Base_Url } from "../../../Base-Url/Base_Url";
import { userAccessList } from "../../../Database/ProposalToolDatabase";
import {
  getListWithAuthenticated,
  postApiWithAuthenticated,
} from "../../reducer/reduxService";

//Ser Base Url
const UserRoleBaseUrl = `${Base_Url}/RoleType`;
const AccessDefaultBaseUrl = `${Base_Url}/Permissions`

// Arrow function as a method
//Get Service Category List Data Services Callback function
export const GetUserRoleList = async (params) => {
  const res = await postApiWithAuthenticated(
    UserRoleBaseUrl + "/GetRoleTypeList",
    params
  );
  return res;
};

//Get Service Category Model Data Services Callback function
export const GetRoleTypeModel = async (id) => {
  const res = await getListWithAuthenticated(
    `${UserRoleBaseUrl}/GetRoleTypeModel?roleTypeID=${id}`
  );
  return res;
};

//AddUpdate Service Category Callback function
export const AddUpdateUserRole = async (url, params) => {
  const res = await postApiWithAuthenticated(
    `${UserRoleBaseUrl}${url}`,
    params
  );
  return res;
};

//Delete Service Category Callback function
export const DeleteUserRole = async (roleTypeID, userKeyID) => {
  const res = await getListWithAuthenticated(

    `${UserRoleBaseUrl}/DeleteRoleType?roleTypeID=${roleTypeID}&userKeyID=${userKeyID}`
  );
  return res;
};



//Delete Service Category Callback function
export const UserRoleChangeStatus = async (roleTypeID, userKeyID) => {
  const res = await getListWithAuthenticated(

    `${UserRoleBaseUrl}/ChangeRoleTypeStatus?roleTypeID=${roleTypeID}&userKeyID=${userKeyID}`
  );
  return res;
};


//Set Access Default 
export const SetAccess = async () => {
  const res = await getListWithAuthenticated(

    `${AccessDefaultBaseUrl}/GetPermissionModel`
  );
  return res;
};
//Set Access Default 
export const UpdatePermission = async (payload) => {
  const res = await postApiWithAuthenticated(

    `${AccessDefaultBaseUrl}/AddUpdateDefaultPermissions`, payload
  );
  return res;
};


export const AccessModuleUserPermission = async (userKeyID) => {
  const res = await getListWithAuthenticated(`${AccessDefaultBaseUrl}/GetAccessPermissionModelByUser?UserKeyID=${userKeyID}`) //userAccessList
  return res;
};
