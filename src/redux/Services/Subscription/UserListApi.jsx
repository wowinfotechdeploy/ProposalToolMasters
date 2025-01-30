import { Base_Url } from "../../../Base-Url/Base_Url";
import {
    getListWithAuthenticated,
    postApiWithAuthenticated,
} from "../../reducer/reduxService";

//User Base Url
const UserBaseUrl = `${Base_Url}/SubscriptionPackage`;
const SubscriptionPackageBaseUrl = `${Base_Url}/SubscriptionPackage`;
export const GetUserList = async (params) => {
    const res = await postApiWithAuthenticated(
        UserBaseUrl + "/GetOrganisationSubscriptionPackageList",
        params
    );
    return res;
};

export const UpdateUserSubscriptionPackage = async ( params) => {
    const res = await postApiWithAuthenticated(
        `${SubscriptionPackageBaseUrl}/UpdateOrganisationSubscriptionPackage`,
        params
    );
    return res;
};

export const GetUserSubscriptionPackageModel = async (id) => {
    const res = await getListWithAuthenticated(
        `${SubscriptionPackageBaseUrl}/GetOrganisationSubscriptionPackageModel?OSPKeyID=${id}`
    );
    return res;
};