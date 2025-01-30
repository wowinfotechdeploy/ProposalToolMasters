import { Base_Url } from "../../../Base-Url/Base_Url";
import {
    getListWithAuthenticated,
    postApiWithAuthenticated,
} from "../../reducer/reduxService";

//User Base Url
const PaymentGatewayBaseUrl = `${Base_Url}/PaymentGateways`;
const ChoosePlanBaseUrl = `${Base_Url}/SubscriptionPackage/GetChoosePlanList`;
const BuyPlanBaseUrl = `${Base_Url}/SubscriptionPackage/BuyPlan`
const CreateStripeCheckout = `${Base_Url}/StripePaymentGateway`
//Get User Model Data Services Callback function
export const GetPaymentGatewayModel = async (id) => {
    const res = await getListWithAuthenticated(
        `${PaymentGatewayBaseUrl}/GetPaymentGatewaysModel?organisationKeyID=${id}`
    );
    return res;
};
export const ChangeDefaultPaymentGateways = async (organisationKeyID, UserKeyID, PaymentGatewayID) => {
    const res = await getListWithAuthenticated(
        `${PaymentGatewayBaseUrl}/ChangeDefaultPaymentGateways?OrganisationKeyID=${organisationKeyID}&UserKeyID=${UserKeyID}&PaymentGatewayID=${PaymentGatewayID}`
    );
    return res;
};
export const ChoosePlanApi = async () => {
    const res = await getListWithAuthenticated(
        `${ChoosePlanBaseUrl}`
    );
    return res;
};

//AddUpdate User Callback function
export const AddUpdatePaymentGateway = async (url, params) => {
    const res = await postApiWithAuthenticated(
        `${PaymentGatewayBaseUrl}${url}`,
        params
    );
    return res;
};
//Buy Plan api 
export const BuyPlan = async (params) => {
    const res = await postApiWithAuthenticated(
        `${BuyPlanBaseUrl}`,
        params
    );
    return res;
};

export const CreateStripeCheckoutSession = async (UserKeyID, InvoiceKeyID) => {

    const res =
        // SelectServiceData
        await getListWithAuthenticated(

            `${CreateStripeCheckout}/CreateStripeCheckoutSession?UserKeyID=${UserKeyID}&InvoiceKeyID=${InvoiceKeyID}`,
        );
    return res;
};
