import { Base_Url } from "../../Base-Url/Base_Url";
import { getList, getListWithAuthenticated, postApiWithAuthenticated } from "../reducer/reduxService";
import { GetCountryLookUpList } from "../../Database/ProposalToolDatabase"

//..................Country Url......................................

const SignEasyUrl = `${Base_Url}/SignEasy`


export const GetSendToSignEasy = async (params) => {
    const res = await postApiWithAuthenticated(`${SignEasyUrl}/SendEngagementLetterForSigning`, params)
    return res
}
export const DownloadDocumentAsZip = async (ContractKeyID) => {
    const res = await getListWithAuthenticated(`${SignEasyUrl}/DownloadDocumentAsZip?ContractKeyID=56142169-EB76-4315-975C-71E0E5B3CDFE`)
    // const res = await getListWithAuthenticated(`${SignEasyUrl}/DownloadDocumentAsZip?ContractKeyID=${ContractKeyID}`)
    return res
}

export const ResendContract = async (contractKeyID, UserKeyID) => {
    const res = await getListWithAuthenticated(
        `${SignEasyUrl}/ReSendEngagementLetterForSigning?UserKeyID=${UserKeyID}&ContractKeyID=${contractKeyID}`
    );
    return res;
};

export const SendEmailsToManuallySignedContract = async (contractKeyID, UserKeyID) => {
    const res = await getListWithAuthenticated(
        `${Base_Url}/SignEasyWebhook/SendEmailsToManuallySignedContract?ContractKeyID=${contractKeyID}&UserKeyID=${UserKeyID}`
    );
    return res;
};