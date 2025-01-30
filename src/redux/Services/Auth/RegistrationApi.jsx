import { Base_Url } from "../../../Base-Url/Base_Url";
import {
    getListWithAuthenticated,
    postApiWithAuthenticated,
} from "../../reducer/reduxService";

//Access Key Base Url
const AccessKeyBaseUrl = `${Base_Url}/User`;

// Arrow function as a method
//Get Access Key List Data  Callback function
export const AddUpdateUser = async (params) => {
    const res = await postApiWithAuthenticated(
        AccessKeyBaseUrl + "/AddUpdateUser",
        params
    );
    return res;
};

export const UpdateUser = async (params) => {
    const res = await postApiWithAuthenticated(
        AccessKeyBaseUrl + "/UpdateUser",
        params
    );
    return res;
};
