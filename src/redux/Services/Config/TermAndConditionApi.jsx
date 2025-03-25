import { Base_Url } from "../../../Base-Url/Base_Url";
import {
    getListWithAuthenticated,
    postApiWithAuthenticated,
} from "../../reducer/reduxService";

//Term and Condition Base Url
const TermAndConditionBaseUrl = `${Base_Url}/TermsAndConditions`;

// Arrow function as a method
//Get Term and Condition List Data Services Callback function
export const GetTermsAndConditionsList = async (params) => {
    const res = await postApiWithAuthenticated(
        TermAndConditionBaseUrl + "/GetTermsAndConditionsList",
        params
    );
    return res;
};

//Get Term and Condition Model Data Services Callback function
export const GetTermsAndConditionsModel = async (KeyID, GetSAChanges) => {
    // const res = await getListWithAuthenticated(
    //     `${TermAndConditionBaseUrl}/GetTermsAndConditionsModel?TemplateKeyID=${id}`
    // );
    // return res;
    let url = `${TermAndConditionBaseUrl}/GetTermsAndConditionsModel?TemplateKeyID=${KeyID}`
    if (GetSAChanges) {
        url = `${TermAndConditionBaseUrl}/GetTermsAndConditionsModel?TemplateKeyID=${KeyID}&GetSAChanges=${GetSAChanges}`
    }
    const res = await getListWithAuthenticated(url);
    return res;
};

//AddUpdate Term and ConditionCallback function
export const AddUpdateTermAndCondition = async (url, params) => {
    const res = await postApiWithAuthenticated(
        `${TermAndConditionBaseUrl}${url}`,
        params
    );
    return res;
};

//Delete Term and Condition Callback function
export const TermsAndConditionsDelete = async (templateKeyID, userKeyID) => {
    const res = await getListWithAuthenticated(
        `${TermAndConditionBaseUrl}/TermsAndConditionsDelete?templateKeyID=${templateKeyID}&userKeyID=${userKeyID}`
    );
    return res;
};

//Delete Term and Condition Callback function
export const TermsAndConditionsChangeStatus = async (templateKeyID, userKeyID) => {
    const res = await getListWithAuthenticated(
        `${TermAndConditionBaseUrl}/TermsAndConditionsChangeStatus?templateKeyID=${templateKeyID}&userKeyID=${userKeyID}`
    );
    return res;
};

//Is default Template Callback function
export const GetChangeIsDefaultStatus = async (OrganisationKeyID, templateKeyID, isDefault, userKeyID) => {
    let res;
    if (OrganisationKeyID === null) {
        res = await getListWithAuthenticated(
            `${TermAndConditionBaseUrl}/TermsAndConditionsIsDefaultChangeStatus?UserKeyID=${userKeyID}&TemplateKeyID=${templateKeyID}&IsDefault=${isDefault}`
        );
    } else {
        res = await getListWithAuthenticated(
            `${TermAndConditionBaseUrl}/TermsAndConditionsIsDefaultChangeStatus?OrganisationKeyID=${OrganisationKeyID}&UserKeyID=${userKeyID}&TemplateKeyID=${templateKeyID}&IsDefault=${isDefault}`
        );
    }

    return res;
};

//Get Term and Condition look up Services Callback function
export const GetTermsAndConditionsLookupList = async (OrganisationKeyID) => {
    const res = await getListWithAuthenticated(
        `${TermAndConditionBaseUrl}/GetTermsAndConditionsTemplateLookUpList?OrganisationKeyID=${OrganisationKeyID}`
    );
    return res;
};

// Copy Terms and Condition Template
export const CopyTermsAndConditions = async (TemplateKeyID,UserKeyID) => {
    const res = await postApiWithAuthenticated(
        `${TermAndConditionBaseUrl}/CopyTermsAndConditionsTemplate?TemplateKeyID=${TemplateKeyID}&UserKeyID=${UserKeyID}`
    );
    return res;
};