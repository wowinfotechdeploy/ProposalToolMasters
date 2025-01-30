import { Base_Url } from "../../../Base-Url/Base_Url";
import {
    getListWithAuthenticated,
    postApiWithAuthenticated,
    postApi,
} from "../../reducer/reduxService";

//User Base Url
const UserBaseUrl = `${Base_Url}/InviteUsers`;
const InviteUserBaseUrl = `${Base_Url}/User`;

// Arrow function as a method
//Get User List Data Services Callback function
export const GetInviteUsersList = async (params) => {
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

//AddUpdate User Callback function
export const AddUpdateUser = async (url, params) => {
    const res = await postApiWithAuthenticated(`${UserBaseUrl}${url}`, params);
    return res;
};

//Delete User Callback function
export const DeleteUser = async (InviteUserKeyID,userKeyID) => {
    const res = await getListWithAuthenticated(
        `${UserBaseUrl}/DeleteInviteUsers?InviteUserKeyID=${InviteUserKeyID}&userKeyID=${userKeyID}`
    );
    return res;
};

//Delete Invite User Callback function
export const DeleteInviteUser = async (UserKeyID, UserKeyID_ForDelete) => {
    const res = await getListWithAuthenticated(
        `${InviteUserBaseUrl}/DeleteUser?UserKeyID=${UserKeyID}&UserKeyID_ForDelete=${UserKeyID_ForDelete}`
    );
    return res;
};

//Change Invite User status Callback function
export const InviteUserChangeStatus = async (id) => {
    const res = await getListWithAuthenticated(
        `${UserBaseUrl}/InviteUsersChangeStatus?InviteUserKeyID=${id}`
    );
    return res;
};

//Change Invite User status Callback function
export const UserChangeStatus = async (UserKeyID, UserKeyID_ForDelete) => {
    const res = await getListWithAuthenticated(
        `${InviteUserBaseUrl}/ChangeStatus?UserKeyID=${UserKeyID}&UserKeyID_ForDelete=${UserKeyID_ForDelete}`
    );
    return res;
};


//Delete User Callback function
export const AcceptUserInvitation = async (url) => {
    const res = await postApi(`${UserBaseUrl}/${url}`);
    return res;
};
