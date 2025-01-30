import { Base_Url } from "../../../Base-Url/Base_Url";
import {
    getListWithAuthenticated,
    postApiWithAuthenticated,
} from "../../reducer/reduxService";

// Base Url
const CouponBaseUrl = `${Base_Url}/Coupon`;

// Arrow function as a method
//Get Access Key List Data  Callback function
export const GetCouponCodeList = async (params) => {
    const res = await postApiWithAuthenticated(
        CouponBaseUrl + "/GetCouponList",
        params
    );
    return res;
};


//Delete Access Key Callback function
export const DeleteCouponCode = async (id, userKeyID) => {
    const res = await getListWithAuthenticated(
        `${CouponBaseUrl}/DeleteCoupon?CouponKeyID=${id}&UserKeyID=${userKeyID}`
    );
    return res;
};
export const ChangeCouponStatus = async (id, userKeyID) => {
    const res = await getListWithAuthenticated(
        `${CouponBaseUrl}/ChangeCouponStatus?CouponKeyID=${id}&UserKeyID=${userKeyID}`
    );
    return res;
};
//Coupon code get model Callback function
export const GetCouponCodeModel = async (id, userKeyID, OrganisationKeyID) => {
    const res = await getListWithAuthenticated(
        `${CouponBaseUrl}/GetCouponModel?CouponKeyID=${id}&UserKeyID=${userKeyID}&OrganisationKeyID=${OrganisationKeyID}`
    );
    return res;
};

export const AddUpdateCouponCode = async (params) => {
    const res = await postApiWithAuthenticated(
        `${CouponBaseUrl}/AddUpdateCoupon`,
        params
    );
    return res;
};