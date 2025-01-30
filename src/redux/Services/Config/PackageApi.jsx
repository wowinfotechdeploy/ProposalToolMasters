import { Base_Url } from "../../../Base-Url/Base_Url";
import {
    getListWithAuthenticated,
    postApiWithAuthenticated,
} from "../../reducer/reduxService";

const services = `${Base_Url}/configure/Services`;
//Package Base Url
const PackageBaseUrl = `${Base_Url}/configure/ServicesPackage`;
export const GetPackageServicesList = async (params) => {

    const res = await postApiWithAuthenticated(
        `${services}/GetServicesWithGlobalPricingDriverListByServiceChargeType`,
        params
    );
    return res;
};

export const GetAdditionalInformationList = async (params) => {
    const res = await postApiWithAuthenticated(
        `${services}/GetPricingFormulasGlobalPricingDrivers`,
        params
    );
    return res;
};


// Arrow function as a method
//Get Package List Data Services Callback function
export const GetPackageList = async (params) => {
    const res = await postApiWithAuthenticated(
        PackageBaseUrl + "/GetServicePackageList",
        params
    );
    return res;
};

//Get Package Model Data Services Callback function
export const GetPackageModel = async (id) => {
    const res = await getListWithAuthenticated(
        `${PackageBaseUrl}/GetPackageModel?KeyID=${id}`
    );
    return res;
};

//AddUpdate Package Callback function
export const GetAddUpdatePackage = async (url, params) => {
    const res = await postApiWithAuthenticated(
        `${PackageBaseUrl}${url}`,
        params
    );
    return res;
};


//Delete Package Callback function
export const ServicePackageDelete = async (servicePackageKeyID, UserKeyID) => {
    const res = await getListWithAuthenticated(
        `${PackageBaseUrl}/ServicePackageDelete?ServicePackageKeyID=${servicePackageKeyID}&UserKeyID=${UserKeyID}`
    );
    return res;
};

//Get Service Category Model Data Services Callback function
export const GetServicePackageModel = async (id, GetSAChanges) => {
    let url = `${PackageBaseUrl}/GetServicePackageModel?ServicePackageKeyID=${id}`
    if (GetSAChanges) {
        url = `${PackageBaseUrl}/GetServicePackageModel?ServicePackageKeyID=${id}&GetSAChanges=${GetSAChanges}`
    }
    const res = await getListWithAuthenticated(url);
    return res;
};
export const GetServicePackageLookupList = async (params) => {
    let url = `${PackageBaseUrl}/GetServicePackageLookupList?OrganisationKeyID=${params.organisationKeyID}&UserKeyID=${params.userKeyID}&ClientKeyID=${params.ClientKeyID}`
    if (params?.QuoteKeyID !== null && params?.QuoteKeyID !== undefined && params?.QuoteKeyID !== "") {
        url = `${PackageBaseUrl}/GetServicePackageLookupList?OrganisationKeyID=${params.organisationKeyID}&UserKeyID=${params.userKeyID}&ClientKeyID=${params.ClientKeyID}&QuoteKeyID=${params?.QuoteKeyID}`
    }
    const res = await getListWithAuthenticated(url);
    return res;
};
export const ServicePackageChangeStatus = async (servicePackageKeyID, UserKeyID) => {
    const res = await getListWithAuthenticated(
        `${PackageBaseUrl}/ServicePackageChangeStatus?ServicePackageKeyID=${servicePackageKeyID}&UserKeyID=${UserKeyID}`
    );
    return res;
};

export const StatementOfFactModal = async (params) => {
    const res = await postApiWithAuthenticated(
        `${PackageBaseUrl}/GetServicePackageWiseStatementofFact`, params
    );

    return res;
}
