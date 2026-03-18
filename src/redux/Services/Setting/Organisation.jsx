import { Base_Url } from "../../../Base-Url/Base_Url";
import {
    getListWithAuthenticated,
    postApiWithAuthenticated,
} from "../../reducer/reduxService";

//Organisation Base Url
const OrganisationBaseUrl = `${Base_Url}`;

//AddUpdate Organisation Callback function
export const AddUpdateOrganisation = async (url, params) => {
    const res = await postApiWithAuthenticated(
        `${OrganisationBaseUrl}${url}`,
        params
    );
    return res;
};
// Add Signature Api
export const AddUpdateSignature = async (ModuleKeyID, Signature) => {
    const res = await postApiWithAuthenticated(
        `${OrganisationBaseUrl}/AwsS3/UploadFileOrganisationSignatureImage?ModuleKeyID=${ModuleKeyID}`,
        Signature
    );
    return res;
};

// Add Logo Api
export const AddUpdateLogo = async (ModuleKeyID, Logo) => {
    const res = await postApiWithAuthenticated(
        `${OrganisationBaseUrl}/AwsS3/UploadFileOrganisationLogo?ModuleKeyID=${ModuleKeyID}`,
        Logo
    );
    return res;
};

// Add Signature Api
export const DeleteSignature = async (ModuleKeyID) => {
    const res = await getListWithAuthenticated(
        `${OrganisationBaseUrl}/AwsS3/DeleteOrganisationSignatureImage?ModuleKeyID=${ModuleKeyID}`

    );
    return res;
};

// Add Logo Api
export const DeleteLogo = async (ModuleKeyID) => {
    const res = await getListWithAuthenticated(
        `${OrganisationBaseUrl}/AwsS3/DeleteOrganisationLogo?ModuleKeyID=${ModuleKeyID}`

    );
    return res;
};



// Get Modal Api
export const GetOrganisationInformationModel = async (params) => {
    const res = await getListWithAuthenticated(
        `${OrganisationBaseUrl}/Organisation/GetOrganisationInformationModel/?OrganisationKeyID=${params}`
    );
    return res;
};

export const GetOrganisationList = async (params) => {
    const res = await postApiWithAuthenticated(
        `${OrganisationBaseUrl}/Organisation/GetOrganisationList`, params
    );
    return res;
};

export const GetOrganisationPlanList = async (params) => {
    const res = await postApiWithAuthenticated(
        `${OrganisationBaseUrl}/Organisation/GetOrganisationPlanList`, params
    );
    return res;
};

//Delete Organisation Callback function
export const DeleteOrganisation = async (OrganisationKeyID, userKeyID) => {
    const res = await getListWithAuthenticated(
        `${OrganisationBaseUrl}/Organisation/DeleteOrganisation?OrganisationKeyID=${OrganisationKeyID}&userKeyID=${userKeyID}`
    );
    return res;
};

export const OrganisationChangeStatus = async (OrganisationKeyID, userKeyID) => {
    const res = await getListWithAuthenticated(
        `${OrganisationBaseUrl}/Organisation/UpdateOrganisationStatus?OrganisationKeyID=${OrganisationKeyID}&userKeyID=${userKeyID}`
    );
    return res;
};


export const UploadManuallySignedContract = async (ContractKeyID, UserKeyID, Signature) => {
    const res = await postApiWithAuthenticated(
        `${OrganisationBaseUrl}/AwsS3/UploadManuallySignedContract?ContractKeyID=${ContractKeyID}&UserKeyID=${UserKeyID}`,
        Signature
    );
    return res;
};