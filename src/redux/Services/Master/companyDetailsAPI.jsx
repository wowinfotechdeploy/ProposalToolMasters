import { getListWithAuthenticated } from "../../reducer/reduxService";
import { Base_Url } from "../../../Base-Url/Base_Url";

//..............................Profession Type Services Callback function.................................

export const GetCompanyList = async (params) => {
    let searchCompaniesListParam = `${Base_Url}/CompanyHouse/GetCompanyHouseLookupList?searchKeyword=${params}`;
    const res = await getListWithAuthenticated(searchCompaniesListParam);
    return res;
};

export const GetCompanyDetails = async (params) => {
    let searchCompanyDetailParams = `${Base_Url}/CompanyHouse/GetCompanyHouseDetails?companyNumber=${params}`;
    const res = await getListWithAuthenticated(searchCompanyDetailParams);
    return res;
};

export const GetCompanyOfficers = async (params) => {
    let searchOfficersDetailsParams = `${Base_Url}/CompanyHouse/GetCompanyHouseOfficersList?companyNumber=${params}`;
    const res = await getListWithAuthenticated(searchOfficersDetailsParams);
    return res;
};
