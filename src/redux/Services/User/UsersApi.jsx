import { Base_Url } from "../../../Base-Url/Base_Url";
import {
    getListWithAuthenticated,
    postApiWithAuthenticated,
} from "../../reducer/reduxService";

//User Base Url
const UserBaseUrl = `${Base_Url}/User`;

// Arrow function as a method
//Get User List Data Services Callback function
export const GetUsersList = async (params) => {
    const res = await postApiWithAuthenticated(
        UserBaseUrl + "/GetUserList",
        params
    );
    return res;
};

export const UserChangeStatus = async (id) => {
    const res = await getListWithAuthenticated(
        `${UserBaseUrl}/InviteUsersChangeStatus?InviteUserKeyID=${id}`
    );
    return res;
};

export const UpdateUsersLoginSessionTime = async (UserKeyID,LoginSessionTime) => {

    const res = await getListWithAuthenticated(
        // `${TemplateBaseUrl}/GetMasterTemplateDetailsWithVariableValues?TemplateKeyID=${params.TemplateKeyID}&ClientKeyID=${params.clientID}`
        `${UserBaseUrl}/UpdateUsersLoginSessionTime?UserKeyID=${UserKeyID}&LoginSessionTime=${LoginSessionTime}`
    );
    return res;
};