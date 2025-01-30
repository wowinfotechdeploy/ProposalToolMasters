import axios from "axios";
import { Base_Url } from "../../../Base-Url/Base_Url";
import {

    postApiWithAuthenticated,
    getListWithAuthenticated
} from "../../reducer/reduxService";

const QrCodeBaseUrl = `${Base_Url}/MultiFactorAuthentication`;

// generate  QR and Secrete Key 
export const AuthenticatorQrCode = async (params) => {
    const res = await postApiWithAuthenticated(
        `${QrCodeBaseUrl}/GetAuthenticatorAppQrCode`,
        params
    );
    return res;
};


// verify token 
export const AuthenticatorVerifyToken = async (params) => {
    const res = await postApiWithAuthenticated(

        `${QrCodeBaseUrl}/VerifyAuthenticatorAppToken`,
        params
    );
    return res;
};


// add factor authentication


export const AddAuthentication = async (url, params) => {
    const res = await postApiWithAuthenticated(
        `${QrCodeBaseUrl}${url}`,
        params
    );
    return res;
};

// List

export const GetAuthenticationList = async (params) => {
    const res = await postApiWithAuthenticated(
        `${QrCodeBaseUrl}/GetMultiFactorAuthenticationList`,
        params
    );
    return res;
};

//Delete 
export const DeleteAuthentication = async (mfaKeyID, userKeyID) => {
    const res = await getListWithAuthenticated(
        `${QrCodeBaseUrl}/MultiFactorAuthenticationDelete?MFAKeyID=${mfaKeyID}&UserKeyID=${userKeyID}`
    );
    return res;
};

//status
export const AuthenticationChangeStatus = async (mfaKeyID, userKeyID, isDefault) => {
    const res = await getListWithAuthenticated(
        `${QrCodeBaseUrl}/MultiFactorAuthenticationChangeStatus?MFAKeyID=${mfaKeyID}&UserKeyID=${userKeyID}`
    );
    return res;
};

// is default 
export const GetChangeIsDefaultStatus = async (mfaKeyID, userKeyID, isDefault) => {
    let res = await getListWithAuthenticated(
        `${QrCodeBaseUrl}/MultiFactorAuthenticationChangeIsDefaultStatus?MFAKeyID=${mfaKeyID}&UserKeyID=${userKeyID}&IsDefault=${isDefault}`
    );

    return res;
};


// look up list 

export const AuthenticationLookupList = async (userKeyID, Token) => {

    const objString = localStorage.getItem("userLoginLocalStorage");
    const obj = JSON.parse(objString);
    try {
        const res = await axios.get(`${Base_Url}/MultiFactorAuthentication/GetMultiFactorAuthenticationLookupList`, {
            headers: {
                'Authorization': Token == undefined ? `Bearer ${obj?.token}` : `Bearer ${Token}`, // Ensure 'Bearer' is added before the token

            },
            params: {
                UserKeyID: userKeyID
            }
        });
        return res; // Return the data from the response
    } catch (error) {
        // Handle errors appropriately
        console.error('Error fetching authentication lookup list:', error);
        throw error; // Throw the error for the caller to handle
    }
};

export const GetSendMFAVerificationCodeByEmailByLogin = async (params) => {
    const objString = localStorage.getItem("userLoginLocalStorage");
    const obj = JSON.parse(objString);
    try {
        const res = await axios.post(`${Base_Url}/MultiFactorAuthentication/SendMFAVerificationCodeByEmail`,
            // Send params in the body
            params,
            {
                headers: {
                    'Authorization': `Bearer ${obj?.token}`, // Ensure 'Bearer' is added before the token
                }
            });
        return res; // Return the data from the response
    } catch (error) {
        // Handle errors appropriately
        console.error('Error fetching authentication lookup list:', error);
        throw error; // Throw the error for the caller to handle
    }
};

// export const AuthenticationLookupList = async (userKeyID) => {
//     const res = await getListWithAuthenticated(
//         `${QrCodeBaseUrl}/GetMultiFactorAuthenticationLookupList?userKeyID=${userKeyID}`
//     );
//     return res;
// };

export const GetSendMFAVerificationCodeByEmail = async (params) => {
    const res = await postApiWithAuthenticated(
        `${QrCodeBaseUrl}/SendMFAVerificationCodeByEmail`, params
    );
    return res;
};

export const GetEnable2Fa = async (userKeyID) => {
    const res = await getListWithAuthenticated(
        `${QrCodeBaseUrl}/Enable2Fa?UserKeyID=${userKeyID}`
    );
    return res;
};


// export const GetEnable2Fa = async (userKeyID) => {
//     const res = await postApiWithAuthenticated(
//         `${QrCodeBaseUrl}/Enable2Fa?UserKeyID=${userKeyID}`
//     );
//     return res;
// };
