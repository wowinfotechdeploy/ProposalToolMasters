import { Base_Url } from "../../../Base-Url/Base_Url";
import {
    getListWithAuthenticated,
    postApiWithAuthenticated,
} from "../../reducer/reduxService";

const Engagement_Letters = `${Base_Url}/Contract`;

// export const GetEngagementList = async (params) => {
//     let url = params.StatusID !== undefined && params.StatusID !== null ?
//         `/GetContractList?StatusID=${params.StatusID}` :
//         `/GetContractList`
//     const res = await postApiWithAuthenticated(
//         Engagement_Letters + url,
//         params
//     );
//     return res;
// };

export const GetEngagementList = async (params) => {
    let url = params.StatusID !== undefined && params.StatusID !== null ?
        `/GetContractList?StatusID=${params.StatusID}&ContractsFor=${params.contractsFor}` :
        `/GetContractList?ContractsFor=${params.contractsFor}`
    const res = await postApiWithAuthenticated(
        Engagement_Letters + url,
        params
    );
    return res;
};
export const GetOldEngagementList = async (params) => {
    // let url = params.StatusID !== undefined && params.StatusID !== null ?
    //     `/GetContractList?StatusID=${params.StatusID}` :
    //     `/GetOldContractList`
    const res = await postApiWithAuthenticated(
        Engagement_Letters + `/GetOldContractList`,
        params
    );
    return res;
};


export const AddUpdateEngagement = async (params) => {
    const res = await postApiWithAuthenticated(
        `${Engagement_Letters}/AddUpdateContract`,
        params
    );
    return res;
};


export const GetContractModel = async (params) => {
    const res = await getListWithAuthenticated(
        `${Engagement_Letters}/GetContractModel?ContractKeyID=${params}`,
        params
    );
    return res;
};

export const GetContractDetailsModel = async (params) => {
    const res = await getListWithAuthenticated(
        `${Engagement_Letters}/GetContractDetailsModel?ContractKeyID=${params}`,
        params
    );
    return res;
};

export const CopyContract = async (GetQuoteKeyID, UserKeyID) => {

    const res = await getListWithAuthenticated(
        // `${TemplateBaseUrl}/GetMasterTemplateDetailsWithVariableValues?TemplateKeyID=${params.TemplateKeyID}&ClientKeyID=${params.clientID}`
        `${Engagement_Letters}/CopyContract?ContractKeyID=${GetQuoteKeyID}&UserKeyID=${UserKeyID}`
    );
    return res;
};

export const ChangeContractStatus = async (ContractKeyID, UserKeyID) => {
    const res = await getListWithAuthenticated(
        `${Engagement_Letters}/ChangeContractStatus?ContractKeyID=${ContractKeyID}&Action=ChangeReminderStatus&UserKeyID=${UserKeyID}`
    );
    return res;
};

