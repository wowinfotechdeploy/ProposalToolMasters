import { Base_Url } from "../../../Base-Url/Base_Url";
import {
    getListWithAuthenticated,
    postApi,
    postApiWithAuthenticated,
    getList,
} from "../../reducer/reduxService";

const PasswordUrl = `${Base_Url}/Password`;

// Token Validation for create new password
export const ValidateUserToken = async (token, tokenType) => {
    const res = await getList(
        `${PasswordUrl}/ValidateUserToken?UserToken=${token}&TokenType=${tokenType}`
    );
    return res;
};

// To activate account
export const ActivateUserAccount = async (params) => {
    const res = await postApiWithAuthenticated(
        `${PasswordUrl}/ActivateUserAccount`,
        params
    );
    return res;
};

//Generate token for forgot password
export const SendRequestForForgotPassword = async (params) => {
    const res = await postApi(
        `${PasswordUrl}/SendRequestForForgotPassword`,
        params
    );
    return res;
};

// Update forgotten password
export const ResetForgottenPassword = async (params) => {
    const res = await postApi(`${PasswordUrl}/ResetForgottenPassword`, params);
    return res;
};

// Update reset password
export const ResetCurrentPassword = async (params) => {
    const res = await postApiWithAuthenticated(
        `${PasswordUrl}/ResetCurrentPassword`,
        params
    );
    return res;
};
