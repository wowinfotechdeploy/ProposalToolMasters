import { Base_Url } from "../../../Base-Url/Base_Url";
import {
    getListWithAuthenticated,
    postApiWithAuthenticated,
} from "../../reducer/reduxService";

//User Base Url
const UserBaseUrl = `${Base_Url}/InviteUsers`;

// Arrow function as a method
//Get User List Data Services Callback function
export const GetUsersList = async (params) => {
    const res = await postApiWithAuthenticated(
        UserBaseUrl + "/GetInviteUsersList",
        params
    );
    return res;
};

//Get User Model Data Services Callback function
export const GetUserModel = async (id) => {
    const res = await getListWithAuthenticated(
        `${UserBaseUrl}/GetInviteUsersModel?InviteUserKeyID=${id}`
    );
    return res;
};

export const GetUserModelData = async (id) => {
    const res = await getListWithAuthenticated(
        `${Base_Url}/User/GetUserModel?UserKeyID=${id}`
    );
    return res;
};

//AddUpdate User Callback function
export const AddUpdateUser = async (url, params) => {
    const res = await postApiWithAuthenticated(`${UserBaseUrl}${url}`, params);
    return res;
};

//Delete User Callback function
export const DeleteUser = async (id) => {
    const res = await getListWithAuthenticated(
        `${UserBaseUrl}/DeleteInviteUsers?InviteUserKeyID=${id}`
    );
    return res;
};

//Delete User Callback function
export const UserChangeStatus = async (id) => {
    const res = await getListWithAuthenticated(
        `${UserBaseUrl}/InviteUsersChangeStatus?InviteUserKeyID=${id}`
    );
    return res;
};
