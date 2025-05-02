import React, { useContext, useState, useEffect } from 'react'
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Android12Switch from "../../../../components/AndroidSwitch";
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import "../../Organisations/Update-practice-details.css";
import { AuthContextProvider } from '../../../../AuthContext/AuthContext';
import Utils from "../../../../Middleware/Utils";
import { useSelector } from "react-redux";
import Select from "react-select";
import { GetPaymentGatewayModel } from '../../../../redux/Services/Setting/PaymentGatewayApi';
import { GetTermsAndConditionsLookupList } from '../../../../redux/Services/Config/TermAndConditionApi';
import { GetSingleApiSettingTemplateLookupList } from '../../../../redux/Services/Config/TemplateApi';
import PaymentGatewayModel from '../../../../components/PaymentGatewayModel';
import { ERROR_MESSAGES } from '../../../../components/GlobalMessage';
import { AddUpdateSingleApiSettings, GetSingleApiSettingsModel } from '../../../../redux/Services/Setting/SingleApiIntegration';
import SuccessModal from '../../../../components/SuccessModal';
import { useNavigate } from 'react-router-dom';
function Setting() {
    const ModuleName = "API Integration"
    const navigate = useNavigate();
    const common = useSelector((state) => state.Storage);
    const { EngagementName,
        proposalName,
        prospectName,
        setLoader,
        scrollUpDownByElementID,
        activeOrganizationSubscriptionPlan
    } = useContext(AuthContextProvider);
    //Common UseState here
    const [isModalOpen, setISModalOpen] = useState(false);
    const [isAddUpdateDone, setIsAddUpdateDone] = useState(false);
    const [openSuccessModal, setOpenSuccessModal] = useState(false);
    const [requireErrorMessage, setRequireErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [TnCLookupList, setTnCLookupList] = useState([]);
    const [IndividualTemplateLookUpOptions, setIndividualTemplateLookUpOptions] = useState([]);
    const [SoleTraderTemplateLookUpOptions, setSoleTraderTemplateLookUpOptions] = useState([]);
    const [PartnershipTemplateLookUpOptions, setPartnerShipTemplateLookUpOptions] = useState([]);
    const [LLpTemplateLookUpOptions, setLLpTemplateLookUpOptions] = useState([]);
    const [LtdTemplateLookUpOptions, setLtdTemplateLookUpOptions] = useState([]);
    const [QuoteIndividualTemplateLookUpOptions, setQuoteIndividualTemplateLookUpOptions] = useState([]);
    const [QuotePartnerShipTemplateLookUpOptions, setQuotePartnerShipTemplateLookUpOptions] = useState([]);
    const [QuoteSoleTraderTemplateLookUpOptions, setQuoteSoleTraderTemplateLookUpOptions] = useState([]);
    const [QuoteLLpTemplateLookUpOptions, setQuoteLLpTemplateLookUpOptions] = useState([]);
    const [QuoteLtdTemplateLookUpOptions, setQuoteLtdTemplateLookUpOptions] = useState([]);
    const [contractEmailTemplateLookUpOptions, setContractEmailTemplateLookUpOptions] = useState([]);
    const [quoteEmailTemplateLookUpOptions, setQuoteEmailTemplateLookUpOptions] = useState([]);
    const [isAddUpdatePricingActionDone, setIsAddUpdatePricingActionDone] =
        useState(false);
    const [paymentGatewayObj, setPaymentGatewayObj] = useState({
        userKeyID: null,
        goCardlessAccessToken: undefined,
        stripePublishableKey: undefined,
        stripeSecretKey: undefined,
        bankTransferName: null,
        AccountNumber: null,
        sortCode: null,
        isDefault: null,
        PaymentGatewayID: null,
    });

    const [setting, setSetting] = useState({
        paymentGatewayID: 1,
        isContractEnabled: true,
        openSuccessUrlInNewTab: true,
        openCancelUrlInNewTab: true,
        isDeleteClient: true,
        isDeleteQuote: true,
        isDeleteContract: true,
        deleteQuoteAfterDays: null,
        deleteContractAfterDays: null,
        tnCTemplateKeyID: null,
        tnCTemplateID: null,
        quoteEmailTemplateKeyID: null,
        contractEmailTemplateKeyID: null,
        contractTemplates: [],
        quoteTemplates: [],
        fontSizeHeading: null,
        fontSizeText: null,
        selectedProposalTypeValue: [],
        fontFamilyID: null,
        backgroundServiceCategoryColor: "#00AFEF",
        buttonColor: "#00AFEF",
        cancelButtonColor: "#d3d4d5",
        bodyBackGroundColor: "#d3d4d5",
        formBackGroundColor: "#d3d4d5",
        proposalForLabel: null,
        proposalTypeLabel: null,
        customSingleLabel: null,
        packagedStandardLabel: null,
        packagedCustomisableLabel: null,
        getQuoteLabel: null,
        signContractLabel: null,
        successUrl: null,
        cancelledUrl: null,
    })

    useEffect(() => {
        if (!activeOrganizationSubscriptionPlan?.apiIntegration) {
            navigate(-1); // Redirect to the previous page
        }
        GetTermsAndConditionsLookupListData();
        GetTemplateLookupListForContractIndividualData()
        GetTemplateLookupListForContractSoleTraderData()
        GetTemplateLookupListForContractPartnershipData()
        GetTemplateLookupListForContractLLpData()
        GetTemplateLookupListForContractLtdData()

        GetTemplateLookupListForQuoteIndividualData()
        GetTemplateLookupListForQuoteSoleTraderData()
        GetTemplateLookupListForQuotePartnershipData()
        GetTemplateLookupListForQuoteLLpData()
        GetTemplateLookupListForQuoteLtdData()

        GetSingleApiSettingTemplateLookupListForContract()
        GetSingleApiSettingTemplateLookupListForQuote()
    }, [])
    useEffect(() => {
        // Check if both userKeyID and organisationKeyID are truthy
        GetPaymentGatewayModelData(common.organisationKeyID);
        if (common.userKeyID && common.organisationKeyID) {
            // Call GetSingleApiSettingsModelData with userKeyID and organisationKeyID as arguments
            GetSingleApiSettingsModelData(common.userKeyID, common.organisationKeyID);
            setIsAddUpdateDone(false)
        }
    }, [common.userKeyID, common.organisationKeyID, isAddUpdateDone]);  // Dependency array that triggers useEffect when either value changes

    useEffect(() => {
        if (isAddUpdatePricingActionDone) {
            GetPaymentGatewayModelData(common.organisationKeyID);
            setIsAddUpdatePricingActionDone(false)
        }
    }, [isAddUpdatePricingActionDone])
    const isValidWebUrl = (web) => {
        const urlRegex = /^https:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?$/;
        return urlRegex.test(web);
    };

    const updateSettingObj = (key, value, operation) => {
        setSetting((prev) => {
            switch (operation) {
                case "push":
                    return {
                        ...prev,
                        [key]: Array.isArray(prev[key]) ? [...prev[key], value] : prev[key],
                    };
                case "assign":
                    return {
                        ...prev,
                        [key]: value,
                    };

                default:
                    console.warn(`Unsupported operation: ${operation}`);
                    return prev;
            }
        });
    };


    const GetSingleApiSettingsModelData = async (userKeyID, organisationKeyID) => {
        try {
            setLoader(true)
            const data = await GetSingleApiSettingsModel(userKeyID, organisationKeyID)
            if (data.data.statusCode === 200) {
                setLoader(false)
                const ModalData = data.data.responseData.data
                setSetting({
                    ...setting,
                    paymentGatewayID: ModalData.paymentGatewayID,
                    isContractEnabled: ModalData.isContractEnabled,
                    openSuccessUrlInNewTab: ModalData.openSuccessUrlInNewTab,
                    openCancelUrlInNewTab: ModalData.openCancelUrlInNewTab,
                    isDeleteClient: ModalData.isDeleteClient,
                    isDeleteQuote: ModalData.isDeleteQuote,
                    isDeleteContract: ModalData.isDeleteContract,
                    tnCTemplateKeyID: ModalData.tnCTemplateKeyID,
                    tnCTemplateID: ModalData.tnCTemplateID,
                    quoteEmailTemplateKeyID: ModalData.quoteEmailTemplateKeyID,
                    contractEmailTemplateKeyID: ModalData.contractEmailTemplateKeyID,
                    contractTemplates: ModalData.contractTemplates,
                    quoteTemplates: ModalData.quoteTemplates,
                    fontSizeHeading: ModalData.fontSizeHeading,
                    fontSizeText: ModalData.fontSizeText,
                    selectedProposalTypeValue: ModalData.quoteTypeID,
                    fontFamilyID: ModalData.fontFamilyID,
                    backgroundServiceCategoryColor: ModalData.backgroundServiceCategoryColor,
                    buttonColor: ModalData.buttonColor,
                    cancelButtonColor: ModalData.cancelButtonColor,
                    bodyBackGroundColor: ModalData.bodyBackGroundColor,
                    formBackGroundColor: ModalData.formBackGroundColor,
                    proposalForLabel: ModalData.proposalForLabel,
                    proposalTypeLabel: ModalData.proposalTypeLabel,
                    customSingleLabel: ModalData.customSingleLabel,
                    packagedStandardLabel: ModalData.packagedStandardLabel,
                    packagedCustomisableLabel: ModalData.packagedCustomisableLabel,
                    getQuoteLabel: ModalData.getQuoteLabel,
                    signContractLabel: ModalData.signContractLabel,
                    successUrl: ModalData.successUrl,
                    cancelledUrl: ModalData.cancelledUrl,
                    deleteQuoteAfterDays: ModalData.deleteQuoteAfterDays,
                    deleteContractAfterDays: ModalData.deleteContractAfterDays,
                })
            } else {
                setLoader(false)
            }
        } catch (error) {
            setLoader(false)
        }

    }
    //get payment gateway model data
    const GetPaymentGatewayModelData = async (id) => {
        if (!id) { return; }
        setLoader(true)
        try {
            const data = await GetPaymentGatewayModel(id);
            if (data?.data?.statusCode === 200) {
                if (data?.data?.responseData?.data) {
                    const ModelData = data?.data?.responseData?.data;
                    setLoader(false)
                    setPaymentGatewayObj({
                        ...paymentGatewayObj,
                        userKeyID: common.userKeyID,
                        goCardlessAccessToken: ModelData.goCardlessAccessToken,
                        stripePublishableKey: ModelData.stripePublishableKey,
                        stripeSecretKey: ModelData.stripeSecretKey,
                        organisationKeyID: ModelData.organisationKeyID,
                        bankTransferName: ModelData.bankTransferName,
                        AccountNumber: ModelData.accountNumber,
                        PaymentGatewayID: ModelData.defaultPaymentGatewayID,
                        sortCode: ModelData.authenticationCode
                            ? ModelData.authenticationCode.replace(/(\d{2})(?=\d)/g, "$1-")
                            : "",
                    });
                }
            } else {
                setLoader(false)
                setErrorMessage(data?.data?.errorMessage);
            }
        } catch (error) {
            setLoader(false)
            console.log(error);
        }
    };

    // Get TnC lookup list api  call
    const GetTermsAndConditionsLookupListData = async () => {
        try {
            setLoader(true);
            const response = await GetTermsAndConditionsLookupList(
                common.organisationKeyID
            );
            // setTnCLookupList()
            if (response.data.statusCode === 200) {
                setLoader(false);
                let TnCTypeData = response.data.responseData.data.map((item) => ({
                    value: item.templateKeyID,
                    label: item.templateName,
                    templateID: item.templateID,
                    isDefault: item.isDefault,
                }));
                let defaultTemplateOptions = TnCTypeData.find((option) => option.isDefault === true);

                if (defaultTemplateOptions) {
                    // Check if an entry with the same originalBusinessTypeID already exists
                    let isAvailable = setting.tnCTemplateKeyID !== null;

                    // Only add the template if it's default and not already available
                    if (!isAvailable) {

                        // Use the reusable updateSettingObj function to push the new template
                        updateSettingObj("tnCTemplateKeyID", defaultTemplateOptions.value, "assign");
                    }
                }
                setTnCLookupList(TnCTypeData);
            } else {
                setLoader(false);
                setErrorMessage(response.data.errorMessage);
            }
        } catch (error) {
            setLoader(false);
        }
    };

    //6) Get Template lookup list api  call Contract Individual
    const GetTemplateLookupListForContractIndividualData = async () => {
        setLoader(true);
        try {
            const response = await GetSingleApiSettingTemplateLookupList(common.organisationKeyID,
                common.userKeyID,
                1,//catID
                2,//TypeID
                1//OriginalBusinessTypeID
            );
            const data = response.data;

            if (data.statusCode === 200) {
                setLoader(false);
                const mappedOptions = data.responseData.data.map((item, i) => ({
                    value: item.templateKeyID,
                    label: item.templateName,
                    templateID: item.templateID,
                    originalBusinessTypeID: 1,
                    isDefault: item.isDefault,
                }));
                let defaultTemplateOptions = mappedOptions.find((option) => option.isDefault === true);

                if (defaultTemplateOptions) {
                    // Check if an entry with the same originalBusinessTypeID already exists
                    let isAvailable = setting.contractTemplates.some(
                        (option) => option.originalBusinessTypeID === defaultTemplateOptions.originalBusinessTypeID
                    );

                    // Only add the template if it's default and not already available
                    if (!isAvailable) {
                        let newTemplate = {
                            templateKeyID: defaultTemplateOptions.value,
                            originalBusinessTypeID: defaultTemplateOptions.originalBusinessTypeID,
                        };

                        // Use the reusable updateSettingObj function to push the new template
                        updateSettingObj("contractTemplates", newTemplate, "push");
                    }
                }


                setIndividualTemplateLookUpOptions(mappedOptions);

            } else {
                setLoader(false);
                console.error("Error fetching data from the API");
            }
        } catch (error) {
            setLoader(false);
            console.error("Error fetching data from the API", error);
        }
    };
    //Contract Sole Trader
    const GetTemplateLookupListForContractSoleTraderData = async () => {
        setLoader(true);
        try {
            const response = await GetSingleApiSettingTemplateLookupList(common.organisationKeyID,
                common.userKeyID,
                1,//catID
                2,//TypeID
                2//OriginalBusinessTypeID
            );
            const data = response.data;

            if (data.statusCode === 200) {
                setLoader(false);
                const mappedOptions = data.responseData.data.map((item, i) => ({
                    value: item.templateKeyID,
                    label: item.templateName,
                    templateID: item.templateID,
                    originalBusinessTypeID: 2,
                    isDefault: item.isDefault,
                }));
                let defaultTemplateOptions = mappedOptions.find((option) => option.isDefault === true);

                if (defaultTemplateOptions) {
                    // Check if an entry with the same originalBusinessTypeID already exists
                    let isAvailable = setting.contractTemplates.some(
                        (option) => option.originalBusinessTypeID === defaultTemplateOptions.originalBusinessTypeID
                    );

                    // Only add the template if it's default and not already available
                    if (!isAvailable) {
                        let newTemplate = {
                            templateKeyID: defaultTemplateOptions.value,
                            originalBusinessTypeID: defaultTemplateOptions.originalBusinessTypeID,
                        };

                        // Use the reusable updateSettingObj function to push the new template
                        updateSettingObj("contractTemplates", newTemplate, "push");
                    }
                }

                setSoleTraderTemplateLookUpOptions(mappedOptions);

            } else {
                setLoader(false);
                console.error("Error fetching data from the API");
            }
        } catch (error) {
            setLoader(false);
            console.error("Error fetching data from the API", error);
        }
    };
    //Contract  Partnership
    const GetTemplateLookupListForContractPartnershipData = async () => {
        setLoader(true);
        try {
            const response = await GetSingleApiSettingTemplateLookupList(common.organisationKeyID,
                common.userKeyID,
                1,//catID
                2,//TypeID
                3//OriginalBusinessTypeID
            );
            const data = response.data;

            if (data.statusCode === 200) {
                setLoader(false);
                const mappedOptions = data.responseData.data.map((item, i) => ({
                    value: item.templateKeyID,
                    label: item.templateName,
                    templateID: item.templateID,
                    originalBusinessTypeID: 3,
                    isDefault: item.isDefault,
                }));
                let defaultTemplateOptions = mappedOptions.find((option) => option.isDefault === true);

                if (defaultTemplateOptions) {
                    // Check if an entry with the same originalBusinessTypeID already exists
                    let isAvailable = setting.contractTemplates.some(
                        (option) => option.originalBusinessTypeID === defaultTemplateOptions.originalBusinessTypeID
                    );

                    // Only add the template if it's default and not already available
                    if (!isAvailable) {
                        let newTemplate = {
                            templateKeyID: defaultTemplateOptions.value,
                            originalBusinessTypeID: defaultTemplateOptions.originalBusinessTypeID,
                        };

                        // Use the reusable updateSettingObj function to push the new template
                        updateSettingObj("contractTemplates", newTemplate, "push");
                    }
                }

                setPartnerShipTemplateLookUpOptions(mappedOptions);

            } else {
                setLoader(false);
                console.error("Error fetching data from the API");
            }
        } catch (error) {
            setLoader(false);
            console.error("Error fetching data from the API", error);
        }
    };
    //contract LLp
    const GetTemplateLookupListForContractLLpData = async () => {
        setLoader(true);
        try {
            const response = await GetSingleApiSettingTemplateLookupList(common.organisationKeyID,
                common.userKeyID,
                1,//catID
                2,//TypeID
                4//OriginalBusinessTypeID
            );
            const data = response.data;

            if (data.statusCode === 200) {
                setLoader(false);
                const mappedOptions = data.responseData.data.map((item, i) => ({
                    value: item.templateKeyID,
                    label: item.templateName,
                    templateID: item.templateID,
                    originalBusinessTypeID: 4,
                    isDefault: item.isDefault,
                }));
                let defaultTemplateOptions = mappedOptions.find((option) => option.isDefault === true);

                if (defaultTemplateOptions) {
                    // Check if an entry with the same originalBusinessTypeID already exists
                    let isAvailable = setting.contractTemplates.some(
                        (option) => option.originalBusinessTypeID === defaultTemplateOptions.originalBusinessTypeID
                    );

                    // Only add the template if it's default and not already available
                    if (!isAvailable) {
                        let newTemplate = {
                            templateKeyID: defaultTemplateOptions.value,
                            originalBusinessTypeID: defaultTemplateOptions.originalBusinessTypeID,
                        };

                        // Use the reusable updateSettingObj function to push the new template
                        updateSettingObj("contractTemplates", newTemplate, "push");
                    }
                }

                setLLpTemplateLookUpOptions(mappedOptions);

            } else {
                setLoader(false);
                console.error("Error fetching data from the API");
            }
        } catch (error) {
            setLoader(false);
            console.error("Error fetching data from the API", error);
        }
    };
    //Contract Ltd
    const GetTemplateLookupListForContractLtdData = async () => {
        setLoader(true);
        try {
            const response = await GetSingleApiSettingTemplateLookupList(common.organisationKeyID,
                common.userKeyID,
                1,//catID
                2,//TypeID
                5//OriginalBusinessTypeID
            );
            const data = response.data;

            if (data.statusCode === 200) {
                setLoader(false);
                const mappedOptions = data.responseData.data.map((item, i) => ({
                    value: item.templateKeyID,
                    label: item.templateName,
                    templateID: item.templateID,
                    originalBusinessTypeID: 5,
                    isDefault: item.isDefault,
                }));
                let defaultTemplateOptions = mappedOptions.find((option) => option.isDefault === true);

                if (defaultTemplateOptions) {
                    // Check if an entry with the same originalBusinessTypeID already exists
                    let isAvailable = setting.contractTemplates.some(
                        (option) => option.originalBusinessTypeID === defaultTemplateOptions.originalBusinessTypeID
                    );

                    // Only add the template if it's default and not already available
                    if (!isAvailable) {
                        let newTemplate = {
                            templateKeyID: defaultTemplateOptions.value,
                            originalBusinessTypeID: defaultTemplateOptions.originalBusinessTypeID,
                        };

                        // Use the reusable updateSettingObj function to push the new template
                        updateSettingObj("contractTemplates", newTemplate, "push");
                    }
                }

                setLtdTemplateLookUpOptions(mappedOptions);

            } else {
                setLoader(false);
                console.error("Error fetching data from the API");
            }
        } catch (error) {
            setLoader(false);
            console.error("Error fetching data from the API", error);
        }
    };

    //Quote look up list Quote Individual
    const GetTemplateLookupListForQuoteIndividualData = async () => {
        setLoader(true);
        try {
            const response = await GetSingleApiSettingTemplateLookupList(common.organisationKeyID,
                common.userKeyID,
                1,//catID
                1,//TypeID
                1//OriginalBusinessTypeID
            );
            const data = response.data;

            if (data.statusCode === 200) {
                setLoader(false);
                const mappedOptions = data.responseData.data.map((item, i) => ({
                    value: item.templateKeyID,
                    label: item.templateName,
                    templateID: item.templateID,
                    originalBusinessTypeID: 1,
                    isDefault: item.isDefault,
                }));
                let defaultTemplateOptions = mappedOptions.find((option) => option.isDefault === true);

                if (defaultTemplateOptions) {
                    // Check if an entry with the same originalBusinessTypeID already exists
                    let isAvailable = setting.quoteTemplates.some(
                        (option) => option.originalBusinessTypeID === defaultTemplateOptions.originalBusinessTypeID
                    );

                    // Only add the template if it's default and not already available
                    if (!isAvailable) {
                        let newTemplate = {
                            templateKeyID: defaultTemplateOptions.value,
                            originalBusinessTypeID: defaultTemplateOptions.originalBusinessTypeID,
                        };

                        // Use the reusable updateSettingObj function to push the new template
                        updateSettingObj("quoteTemplates", newTemplate, "push");
                    }
                }

                setQuoteIndividualTemplateLookUpOptions(mappedOptions);

            } else {
                setLoader(false);
                console.error("Error fetching data from the API");
            }
        } catch (error) {
            setLoader(false);
            console.error("Error fetching data from the API", error);
        }
    };
    // QUOTE Sole Trader
    const GetTemplateLookupListForQuoteSoleTraderData = async () => {
        setLoader(true);
        try {
            const response = await GetSingleApiSettingTemplateLookupList(common.organisationKeyID,
                common.userKeyID,
                1,//catID
                1,//TypeID
                2//OriginalBusinessTypeID
            );
            const data = response.data;

            if (data.statusCode === 200) {
                setLoader(false);
                const mappedOptions = data.responseData.data.map((item, i) => ({
                    value: item.templateKeyID,
                    label: item.templateName,
                    templateID: item.templateID,
                    originalBusinessTypeID: 2,
                    isDefault: item.isDefault,
                }));
                let defaultTemplateOptions = mappedOptions.find((option) => option.isDefault === true);

                if (defaultTemplateOptions) {
                    // Check if an entry with the same originalBusinessTypeID already exists
                    let isAvailable = setting.quoteTemplates.some(
                        (option) => option.originalBusinessTypeID === defaultTemplateOptions.originalBusinessTypeID
                    );

                    // Only add the template if it's default and not already available
                    if (!isAvailable) {
                        let newTemplate = {
                            templateKeyID: defaultTemplateOptions.value,
                            originalBusinessTypeID: defaultTemplateOptions.originalBusinessTypeID,
                        };

                        // Use the reusable updateSettingObj function to push the new template
                        updateSettingObj("quoteTemplates", newTemplate, "push");
                    }
                }
                setQuoteSoleTraderTemplateLookUpOptions(mappedOptions);

            } else {
                setLoader(false);
                console.error("Error fetching data from the API");
            }
        } catch (error) {
            setLoader(false);
            console.error("Error fetching data from the API", error);
        }
    };
    //Quote Partnership
    const GetTemplateLookupListForQuotePartnershipData = async () => {
        setLoader(true);
        try {
            const response = await GetSingleApiSettingTemplateLookupList(common.organisationKeyID,
                common.userKeyID,
                1,//catID
                1,//TypeID
                3//OriginalBusinessTypeID
            );
            const data = response.data;

            if (data.statusCode === 200) {
                setLoader(false);
                const mappedOptions = data.responseData.data.map((item, i) => ({
                    value: item.templateKeyID,
                    label: item.templateName,
                    templateID: item.templateID,
                    originalBusinessTypeID: 3,
                    isDefault: item.isDefault,
                }));

                let defaultTemplateOptions = mappedOptions.find((option) => option.isDefault === true);

                if (defaultTemplateOptions) {
                    // Check if an entry with the same originalBusinessTypeID already exists
                    let isAvailable = setting.quoteTemplates.some(
                        (option) => option.originalBusinessTypeID === defaultTemplateOptions.originalBusinessTypeID
                    );

                    // Only add the template if it's default and not already available
                    if (!isAvailable) {
                        let newTemplate = {
                            templateKeyID: defaultTemplateOptions.value,
                            originalBusinessTypeID: defaultTemplateOptions.originalBusinessTypeID,
                        };

                        // Use the reusable updateSettingObj function to push the new template
                        updateSettingObj("quoteTemplates", newTemplate, "push");
                    }
                }
                setQuotePartnerShipTemplateLookUpOptions(mappedOptions);

            } else {
                setLoader(false);
                console.error("Error fetching data from the API");
            }
        } catch (error) {
            setLoader(false);
            console.error("Error fetching data from the API", error);
        }
    };
    //Quote LLp
    const GetTemplateLookupListForQuoteLLpData = async () => {
        setLoader(true);
        try {
            const response = await GetSingleApiSettingTemplateLookupList(common.organisationKeyID,
                common.userKeyID,
                1,//catID
                1,//TypeID
                4//OriginalBusinessTypeID
            );
            const data = response.data;

            if (data.statusCode === 200) {
                setLoader(false);
                const mappedOptions = data.responseData.data.map((item, i) => ({
                    value: item.templateKeyID,
                    label: item.templateName,
                    templateID: item.templateID,
                    originalBusinessTypeID: 4,
                    isDefault: item.isDefault,
                }));
                let defaultTemplateOptions = mappedOptions.find((option) => option.isDefault === true);

                if (defaultTemplateOptions) {
                    // Check if an entry with the same originalBusinessTypeID already exists
                    let isAvailable = setting.quoteTemplates.some(
                        (option) => option.originalBusinessTypeID === defaultTemplateOptions.originalBusinessTypeID
                    );

                    // Only add the template if it's default and not already available
                    if (!isAvailable) {
                        let newTemplate = {
                            templateKeyID: defaultTemplateOptions.value,
                            originalBusinessTypeID: defaultTemplateOptions.originalBusinessTypeID,
                        };

                        // Use the reusable updateSettingObj function to push the new template
                        updateSettingObj("quoteTemplates", newTemplate, "push");
                    }
                }
                setQuoteLLpTemplateLookUpOptions(mappedOptions);

            } else {
                setLoader(false);
                console.error("Error fetching data from the API");
            }
        } catch (error) {
            setLoader(false);
            console.error("Error fetching data from the API", error);
        }
    };
    //QUOTE LTD
    const GetTemplateLookupListForQuoteLtdData = async () => {
        setLoader(true);
        try {
            const response = await GetSingleApiSettingTemplateLookupList(common.organisationKeyID,
                common.userKeyID,
                1,//catID
                1,//TypeID
                5//OriginalBusinessTypeID
            );
            const data = response.data;

            if (data.statusCode === 200) {
                setLoader(false);
                const mappedOptions = data.responseData.data.map((item, i) => ({
                    value: item.templateKeyID,
                    label: item.templateName,
                    templateID: item.templateID,
                    originalBusinessTypeID: 5,
                    isDefault: item.isDefault
                }));
                let defaultTemplateOptions = mappedOptions.find((option) => option.isDefault === true);

                if (defaultTemplateOptions) {
                    // Check if an entry with the same originalBusinessTypeID already exists
                    let isAvailable = setting.quoteTemplates.some(
                        (option) => option.originalBusinessTypeID === defaultTemplateOptions.originalBusinessTypeID
                    );

                    // Only add the template if it's default and not already available
                    if (!isAvailable) {
                        let newTemplate = {
                            templateKeyID: defaultTemplateOptions.value,
                            originalBusinessTypeID: defaultTemplateOptions.originalBusinessTypeID,
                        };

                        // Use the reusable updateSettingObj function to push the new template
                        updateSettingObj("quoteTemplates", newTemplate, "push");
                    }
                }
                setQuoteLtdTemplateLookUpOptions(mappedOptions);

            } else {
                setLoader(false);
                console.error("Error fetching data from the API");
            }
        } catch (error) {
            setLoader(false);
            console.error("Error fetching data from the API", error);
        }
    };
    //For Contract Email Template 
    const GetSingleApiSettingTemplateLookupListForContract = async () => {
        setLoader(true);
        try {
            const response = await GetSingleApiSettingTemplateLookupList(common.organisationKeyID,
                common.userKeyID,
                3,//catID
                6,//TypeID
                null//OriginalBusinessTypeID
            );
            const data = response.data;
            if (data.statusCode === 200) {
                setLoader(false);
                const mappedOptions = data.responseData.data.map((item, i) => ({
                    value: item.templateKeyID,
                    label: item.templateName,
                    templateID: item.templateID,
                    isDefault: item.isDefault
                }));
                let defaultTemplateOptions = mappedOptions.find((option) => option.isDefault === true);

                if (defaultTemplateOptions) {
                    // Check if an entry with the same originalBusinessTypeID already exists
                    let isAvailable = setting.contractEmailTemplateKeyID !== null;

                    // Only add the template if it's default and not already available
                    if (!isAvailable) {

                        // Use the reusable updateSettingObj function to push the new template
                        updateSettingObj("contractEmailTemplateKeyID", defaultTemplateOptions.value, "assign");
                    }
                }
                setContractEmailTemplateLookUpOptions(mappedOptions);

            } else {
                setLoader(false);
                console.error("Error fetching data from the API");
            }
        } catch (error) {
            setLoader(false);
            console.error("Error fetching data from the API", error);
        }
    };
    //For QUOTE Email template
    const GetSingleApiSettingTemplateLookupListForQuote = async () => {
        setLoader(true);
        try {
            const response = await GetSingleApiSettingTemplateLookupList(common.organisationKeyID,
                common.userKeyID,
                3,//catID
                5,//TypeID
                null//OriginalBusinessTypeID
            );
            const data = response.data;

            if (data.statusCode === 200) {
                setLoader(false);
                const mappedOptions = data.responseData.data.map((item, i) => ({
                    value: item.templateKeyID,
                    label: item.templateName,
                    templateID: item.templateID,
                    isDefault: item.isDefault
                }));
                let defaultTemplateOptions = mappedOptions.find((option) => option.isDefault === true);

                if (defaultTemplateOptions) {
                    // Check if an entry with the same originalBusinessTypeID already exists
                    let isAvailable = setting.quoteEmailTemplateKeyID !== null;

                    // Only add the template if it's default and not already available
                    if (!isAvailable) {

                        // Use the reusable updateSettingObj function to push the new template
                        updateSettingObj("quoteEmailTemplateKeyID", defaultTemplateOptions.value, "assign");
                    }
                }
                setQuoteEmailTemplateLookUpOptions(mappedOptions);

            } else {
                setLoader(false);
                console.error("Error fetching data from the API");
            }
        } catch (error) {
            setLoader(false);
            console.error("Error fetching data from the API", error);
        }
    };
    const UpdateSetting = () => {
        if (setting.tnCTemplateKeyID === "" || setting.tnCTemplateKeyID === null || setting.tnCTemplateKeyID === undefined) {
            scrollUpDownByElementID("SelectTnC");
            setRequireErrorMessage(true);
            return;
        }
        if (!checkIsAvailableOrNot(IndividualTemplateLookUpOptions, 1, "EL")) {
            scrollUpDownByElementID(`Template${1}EL`);
            setRequireErrorMessage(true);
            return;
        }
        if (!checkIsAvailableOrNot(SoleTraderTemplateLookUpOptions, 2, "EL")) {
            scrollUpDownByElementID(`Template${2}EL`);
            setRequireErrorMessage(true);
            return;
        }
        if (!checkIsAvailableOrNot(PartnershipTemplateLookUpOptions, 3, "EL")) {
            scrollUpDownByElementID(`Template${3}EL`);
            setRequireErrorMessage(true);
            return;
        }
        if (!checkIsAvailableOrNot(LLpTemplateLookUpOptions, 4, "EL")) {
            scrollUpDownByElementID(`Template${4}EL`);
            setRequireErrorMessage(true);
            return;
        }
        if (!checkIsAvailableOrNot(LtdTemplateLookUpOptions, 5, "EL")) {
            scrollUpDownByElementID(`Template${5}EL`);
            setRequireErrorMessage(true);
            return;
        }
        if (setting.contractEmailTemplateKeyID === "" || setting.contractEmailTemplateKeyID === null || setting.contractEmailTemplateKeyID === undefined) {
            scrollUpDownByElementID("EmailTemplate");
            setRequireErrorMessage(true);
            return;
        }

        if (setting.selectedProposalTypeValue.length === 0) {
            scrollUpDownByElementID("QuoteType");
            setRequireErrorMessage(true);
            return;
        }
        if (!checkIsAvailableOrNot(QuoteIndividualTemplateLookUpOptions, 1, "Quote")) {
            scrollUpDownByElementID(`Template${1}Quote`);
            setRequireErrorMessage(true);
            return;
        }
        if (!checkIsAvailableOrNot(QuoteSoleTraderTemplateLookUpOptions, 2, "Quote")) {
            scrollUpDownByElementID(`Template${2}Quote`);
            setRequireErrorMessage(true);
            return;
        }
        if (!checkIsAvailableOrNot(QuotePartnerShipTemplateLookUpOptions, 3, "Quote")) {
            scrollUpDownByElementID(`Template${3}Quote`);
            setRequireErrorMessage(true);
            return;
        }
        if (!checkIsAvailableOrNot(QuoteLLpTemplateLookUpOptions, 4, "Quote")) {
            scrollUpDownByElementID(`Template${4}Quote`);
            setRequireErrorMessage(true);
            return;
        }
        if (!checkIsAvailableOrNot(QuoteLtdTemplateLookUpOptions, 5, "Quote")) {
            scrollUpDownByElementID(`Template${5}Quote`);
            setRequireErrorMessage(true);
            return;
        }
        if (setting.paymentGatewayID === "" || setting.paymentGatewayID === null || setting.paymentGatewayID === undefined) {
            scrollUpDownByElementID("PaymentGateWay");
            setRequireErrorMessage(true);
            return;
        }


        if (setting.quoteEmailTemplateKeyID === "" || setting.quoteEmailTemplateKeyID === null || setting.quoteEmailTemplateKeyID === undefined) {
            scrollUpDownByElementID("QuoteEmailTemplate");
            setRequireErrorMessage(true);
            return;
        }

        if (setting.fontFamilyID === "" || setting.fontFamilyID === null || setting.fontFamilyID === undefined) {
            scrollUpDownByElementID("FontFamily");
            setRequireErrorMessage(true);
            return;
        }
        if (setting.fontSizeHeading === "" || setting.fontSizeHeading === null || setting.fontSizeHeading === undefined) {
            scrollUpDownByElementID("FontSizeHeading");
            setRequireErrorMessage(true);
            return;
        }
        if (setting.fontSizeText === "" || setting.fontSizeText === null || setting.fontSizeText === undefined) {
            scrollUpDownByElementID("FontSizeText");
            setRequireErrorMessage(true);
            return;
        }
        if (setting.buttonColor === "" || setting.buttonColor === null || setting.buttonColor === undefined) {
            scrollUpDownByElementID("ButtonColor");
            setRequireErrorMessage(true);
            return;
        }
        if (setting.cancelButtonColor === "" || setting.cancelButtonColor === null || setting.cancelButtonColor === undefined) {
            scrollUpDownByElementID("CancelButtonColor");
            setRequireErrorMessage(true);
            return;
        }
        if (setting.bodyBackGroundColor === "" || setting.bodyBackGroundColor === null || setting.bodyBackGroundColor === undefined) {
            scrollUpDownByElementID("BackgroundColor");
            setRequireErrorMessage(true);
            return;
        }
        if (setting.formBackGroundColor === "" || setting.formBackGroundColor === null || setting.formBackGroundColor === undefined) {
            scrollUpDownByElementID("FormBackgroundColor");
            setRequireErrorMessage(true);
            return;
        }
        if (setting.backgroundServiceCategoryColor === "" || setting.backgroundServiceCategoryColor === null || setting.backgroundServiceCategoryColor === undefined) {
            scrollUpDownByElementID("BackGroundServiceColor");
            setRequireErrorMessage(true);
            return;
        }

        if (setting.proposalForLabel === "" || setting.proposalForLabel === null || setting.proposalForLabel === undefined) {
            scrollUpDownByElementID("ProposalNameFor");
            setRequireErrorMessage(true);
            return;
        }
        if (setting.customSingleLabel === "" || setting.customSingleLabel === null || setting.customSingleLabel === undefined) {
            scrollUpDownByElementID("CustomSingleLabel");
            setRequireErrorMessage(true);
            return;
        }

        if (setting.packagedCustomisableLabel === "" || setting.packagedCustomisableLabel === null || setting.packagedCustomisableLabel === undefined) {
            scrollUpDownByElementID("PackagedCustomisableLabel");
            setRequireErrorMessage(true);
            return;
        }
        if (setting.packagedStandardLabel === "" || setting.packagedStandardLabel === null || setting.packagedStandardLabel === undefined) {
            scrollUpDownByElementID("PackagedStandardLabel");
            setRequireErrorMessage(true);
            return;
        }
        if (setting.getQuoteLabel === "" || setting.getQuoteLabel === null || setting.getQuoteLabel === undefined) {
            scrollUpDownByElementID("GetQuote");
            setRequireErrorMessage(true);
            return;
        }
        if (setting.signContractLabel === "" || setting.signContractLabel === null || setting.signContractLabel === undefined) {
            scrollUpDownByElementID("SignContract");
            setRequireErrorMessage(true);
            return;
        }
        if (setting.successUrl === "" || setting.successUrl === null || setting.successUrl === undefined) {
            scrollUpDownByElementID("successUrl");
            setRequireErrorMessage(true);
            return;
        }
        if (setting.successUrl && !isValidWebUrl(setting.successUrl)) {
            scrollUpDownByElementID("successUrl");
            setRequireErrorMessage(true);
            return;
        }
        if (setting.cancelledUrl === "" || setting.cancelledUrl === null || setting.cancelledUrl === undefined) {
            scrollUpDownByElementID("cancelledUrl");
            setRequireErrorMessage(true);
            return;
        }
        if (setting.cancelledUrl && !isValidWebUrl(setting.cancelledUrl)) {
            scrollUpDownByElementID("cancelledUrl");
            setRequireErrorMessage(true);
            return;
        }
        if (setting.deleteQuoteAfterDays === "" || setting.deleteQuoteAfterDays === null || setting.deleteQuoteAfterDays === undefined) {
            scrollUpDownByElementID("deleteQuoteAfterDays");
            setRequireErrorMessage(true);
            return;
        }
        if (setting.deleteContractAfterDays === "" || setting.deleteContractAfterDays === null || setting.deleteContractAfterDays === undefined) {
            scrollUpDownByElementID("deleteContractAfterDays");
            setRequireErrorMessage(true);
            return;
        }
        const Api_Params = {
            organisationKeyID: common.organisationKeyID,
            userKeyID: common.userKeyID,
            paymentGatewayID: setting.paymentGatewayID,
            isContractEnabled: setting.isContractEnabled,
            openCancelUrlInNewTab: setting.openCancelUrlInNewTab,
            openSuccessUrlInNewTab: setting.openSuccessUrlInNewTab,
            isDeleteContract: setting.isDeleteContract,
            isDeleteQuote: setting.isDeleteQuote,
            isDeleteClient: setting.isDeleteClient,
            tnCTemplateKeyID: setting.tnCTemplateKeyID,
            contractTemplates: setting.contractTemplates,
            contractEmailTemplateKeyID: setting.contractEmailTemplateKeyID,
            quoteTypeID: setting.selectedProposalTypeValue,
            quoteTemplates: setting.quoteTemplates,
            quoteEmailTemplateKeyID: setting.quoteEmailTemplateKeyID,
            fontFamilyID: setting.fontFamilyID,
            fontSizeHeading: setting.fontSizeHeading,
            fontSizeText: setting.fontSizeText,
            buttonColor: setting.buttonColor,
            cancelButtonColor: setting.cancelButtonColor,
            bodyBackGroundColor: setting.bodyBackGroundColor,
            formBackGroundColor: setting.formBackGroundColor,
            backgroundServiceCategoryColor: setting.backgroundServiceCategoryColor,
            proposalForLabel: setting.proposalForLabel,
            proposalTypeLabel: setting.proposalTypeLabel,
            customSingleLabel: setting.customSingleLabel,
            packagedStandardLabel: setting.packagedStandardLabel,
            packagedCustomisableLabel: setting.packagedCustomisableLabel,
            getQuoteLabel: setting.getQuoteLabel,
            signContractLabel: setting.signContractLabel,
            successUrl: setting.successUrl,
            cancelledUrl: setting.cancelledUrl,
            deleteContractAfterDays: setting.deleteContractAfterDays,
            deleteQuoteAfterDays: setting.deleteQuoteAfterDays,
        };

        AddUpdateSingleApiSettingsData(Api_Params);
    };
    //add update single api data
    const AddUpdateSingleApiSettingsData = async (Api_Params) => {
        setLoader(true)
        const resp = await AddUpdateSingleApiSettings(Api_Params)
        try {
            if (resp.data.statusCode === 200) {
                setLoader(false)
                setIsAddUpdateDone(true)
                setOpenSuccessModal(true)
            } else {
                setLoader(false)
            }
        } catch (error) {
            setLoader(false)
        }
    }
    //Custom tooltip Function
    const CustomWidthTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))({
        [`& .${tooltipClasses.tooltip}`]: {
            maxWidth: 500,
        },
    });

    const modifiedPaymentGatewayType = Utils.payment_gateway.map((option) => {
        const isGoCardlessTokenInvalid =
            paymentGatewayObj.goCardlessAccessToken === null ||
            paymentGatewayObj.goCardlessAccessToken === undefined ||
            paymentGatewayObj.goCardlessAccessToken === "";

        const isStripeKeysInvalid =
            (paymentGatewayObj.stripePublishableKey === null ||
                paymentGatewayObj.stripePublishableKey === undefined ||
                paymentGatewayObj.stripePublishableKey === "") &&
            (paymentGatewayObj.stripeSecretKey === null ||
                paymentGatewayObj.stripeSecretKey === undefined ||
                paymentGatewayObj.stripeSecretKey === "");
        const isBankTransferInvalid =
            (paymentGatewayObj.AccountNumber === null ||
                paymentGatewayObj.AccountNumber === undefined ||
                paymentGatewayObj.AccountNumber === "") &&
            (paymentGatewayObj.bankTransferName === null ||
                paymentGatewayObj.bankTransferName === undefined ||
                paymentGatewayObj.bankTransferName === "") &&
            (paymentGatewayObj.sortCode === null ||
                paymentGatewayObj.sortCode === undefined ||
                paymentGatewayObj.sortCode === "")
        if (option.value === 3 && isGoCardlessTokenInvalid) {
            return { ...option, isDisabled: true }; // Disable this option
        } else if (option.value === 2 && isStripeKeysInvalid) {
            return { ...option, isDisabled: true }; // Disable this option
        } else if (option.value === 4 && isBankTransferInvalid) {
            return { ...option, isDisabled: true }; // Disable this option
        } else {
            return option; // Keep this option as is
        }
    });

    const checkIsAvailableOrNot = (options, originalBusinessTypeID, Type) => {
        if (!options || !setting || !originalBusinessTypeID) return false; // Ensure originalBusinessTypeID is valid

        const templates = Type === "Quote" ? setting.quoteTemplates : setting.contractTemplates;

        return options.some((item) =>
            templates.find(
                (temp) =>
                    temp.originalBusinessTypeID === item.originalBusinessTypeID
            )
        );
    };


    const handleClose = () => {
        setOpenSuccessModal(false);
    };

    const PaymentGatewayValue = Utils.payment_gateway.find(
        (item) => setting.paymentGatewayID == item.value
    );
    const TermAndConditionValue = TnCLookupList.find(
        (item) => setting.tnCTemplateKeyID == item.value
    );
    const ELTemplateValueForIndividual = IndividualTemplateLookUpOptions.find((item) => {
        return setting.contractTemplates.some(
            (tempId) => tempId.templateKeyID === item.value && item.originalBusinessTypeID === tempId.originalBusinessTypeID
        );
    }) // or default value if no match is found

    const ELTemplateValueForSoleTrader = SoleTraderTemplateLookUpOptions.find((item) => {
        return setting.contractTemplates.some(
            (tempId) => tempId.templateKeyID === item.value && item.originalBusinessTypeID === tempId.originalBusinessTypeID
        );
    });

    const ELTemplateValueForPartnership = PartnershipTemplateLookUpOptions.find((item) => {
        return setting.contractTemplates.some(
            (tempId) => tempId.templateKeyID === item.value && item.originalBusinessTypeID === tempId.originalBusinessTypeID
        );
    });

    const ELTemplateValueForLLp = LLpTemplateLookUpOptions.find((item) => {
        return setting.contractTemplates.some(
            (tempId) => tempId.templateKeyID === item.value && item.originalBusinessTypeID === tempId.originalBusinessTypeID
        );
    });

    const ELTemplateValueForLtd = LtdTemplateLookUpOptions.find((item) => {
        return setting.contractTemplates.some(
            (tempId) => tempId.templateKeyID === item.value && item.originalBusinessTypeID === tempId.originalBusinessTypeID
        );
    });

    const PLTemplateValueForIndividual = QuoteIndividualTemplateLookUpOptions.find((item) => {
        return setting.quoteTemplates.some(
            (tempId) => tempId.templateKeyID === item.value && item.originalBusinessTypeID === tempId.originalBusinessTypeID
        );
    });

    const PLTemplateValueForSoleTrader = QuoteSoleTraderTemplateLookUpOptions.find((item) => {
        return setting.quoteTemplates.some(
            (tempId) => tempId.templateKeyID === item.value && item.originalBusinessTypeID === tempId.originalBusinessTypeID
        );
    });

    const PLTemplateValueForPartnership = QuotePartnerShipTemplateLookUpOptions.find((item) => {
        return setting.quoteTemplates.some(
            (tempId) => tempId.templateKeyID === item.value && item.originalBusinessTypeID === tempId.originalBusinessTypeID
        );
    });

    const PLTemplateValueForLLp = QuoteLLpTemplateLookUpOptions.find((item) => {
        return setting.quoteTemplates.some(
            (tempId) => tempId.templateKeyID === item.value && item.originalBusinessTypeID === tempId.originalBusinessTypeID
        );
    });

    const PLTemplateValueForLtd = QuoteLtdTemplateLookUpOptions.find((item) => {
        return setting.quoteTemplates.some(
            (tempId) => tempId.templateKeyID === item.value && item.originalBusinessTypeID === tempId.originalBusinessTypeID
        );
    });
    const EmailTemplateValueForContract = contractEmailTemplateLookUpOptions.find((item) => {
        return setting.contractEmailTemplateKeyID === item.value;
    });
    const EmailTemplateValueForQuote = quoteEmailTemplateLookUpOptions.find((item) => {
        return setting.quoteEmailTemplateKeyID === item.value;
    });
    const ProposalTypeValue = Utils.select_Quote_Type.filter((option) =>
        setting.selectedProposalTypeValue.includes(option.value)
    )
    const FontFamilyValue = Utils.FontFamily.find(
        (item) => setting.fontFamilyID == item.value
    );
    const FontSizeHeadingValue = Utils.FontSize.find(
        (item) => setting.fontSizeHeading == item.value
    );
    const FontSizeTextValue = Utils.FontSize.find(
        (item) => setting.fontSizeText == item.value
    );
    const longText = `If enabled, your practice will have access to the ${EngagementName} feature.Conversely, if it is disabled, your practice will no longer have access to the ${EngagementName} features, and their associated advantages will be unavailable.`
    const TemplateDropdown = ({ label, originalBusinessTypeID, value, setValue, options, errorMessage, requireErrorMessage, Type }) => (
        <div className="col-lg-12">
            <div className="row mb-3" id={`Template${originalBusinessTypeID}${Type}`}>
                <div className="col-md-3 col-sm-12 text-start text-md-end">
                    <label className="form-label">
                        {label}
                        <span className="text-danger">*</span>
                    </label>
                </div>
                <div className="col-md-9 col-sm-12">
                    <div className="input-group">
                        <Select
                            className="selectDropDown Drop-down-width"
                            value={value}
                            onChange={(e) => {
                                setValue((prevSetting) => {
                                    // Determine the correct key to update based on Type
                                    const templateKey = Type === "EL" ? "contractTemplates" : "quoteTemplates";
                                    // Check if an entry with the same originalBusinessTypeID already exists
                                    const existingIndex = prevSetting[templateKey].findIndex(
                                        (template) => template.originalBusinessTypeID === originalBusinessTypeID
                                    );

                                    // If exists, update the templateKeyID, otherwise add a new entry
                                    const updatedTemplates =
                                        existingIndex > -1
                                            ? prevSetting[templateKey].map((template, index) =>
                                                index === existingIndex
                                                    ? { ...template, templateKeyID: e.value } // Update the existing entry
                                                    : template
                                            )
                                            : [
                                                ...prevSetting[templateKey],
                                                { originalBusinessTypeID, templateKeyID: e.value }, // Add a new entry
                                            ];

                                    // Return the updated state
                                    return {
                                        ...prevSetting,
                                        [templateKey]: updatedTemplates,
                                    };
                                });
                            }}
                            options={options}
                            placeholder={`Select Template for ${label}`}
                            aria-label={`Select Template for ${label}`}
                        />
                        {requireErrorMessage &&
                            !checkIsAvailableOrNot(options, originalBusinessTypeID, Type) ? (
                            <label className="validation">{errorMessage}</label>
                        ) : ""}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div class="main-content">
            <div class="update-practice-content page-background">
                <div class="page-info-header page-info-strip">
                    <div class="container">
                        <div className="col-md-6 col-6">
                            <div class="page-title-cls">{ModuleName}</div>
                        </div>
                    </div>
                </div>
                <div class="container margin-bottom col-xl-8">
                    <div class="row mb-100">
                        <div class="col-lg-12 slider-scroll">
                            <div class="card">
                                <div class="card-body practice-detail Update-Scroll-res">
                                    <div class="row">
                                        <div class="col-xl-12 col-lg-12">
                                            <div class=" pricing-box p-4  mt-0">
                                                <div class="row" id="BasicInformation">
                                                    <div class="col-lg-12">
                                                        <div class="row mb-4" id="PaymentGateWay" >
                                                            <div class="col-xl-12 col-lg-12">
                                                                <div class="card-1 pricing-box p-4  mt-1">
                                                                    <div class="col-lg-6 col-md-6">
                                                                        <p class="office-name font-weight" style={{ width: "auto", padding: "0px 2px 0px 1px" }}  >
                                                                            Payment Gateway
                                                                        </p>
                                                                    </div>
                                                                    <div class="row mb-2">
                                                                        <div class="col-lg-12">
                                                                            <div class="row mb-2">
                                                                                <div class="col-md-3 col-sm-12 text-start text-md-end">
                                                                                    <label class="form-label mt-4">
                                                                                        Payment Gateway
                                                                                        <span className="text-danger">*</span>
                                                                                    </label>
                                                                                </div>
                                                                                <div class="col-md-9 col-sm-12">
                                                                                    <div className="d-flex flex-column align-items-end">
                                                                                        <button
                                                                                            style={{
                                                                                                fontSize: "12px",
                                                                                                border: "none",
                                                                                                background: "transparent",
                                                                                                color: "#626ed4",
                                                                                            }}
                                                                                            data-bs-toggle="modal"
                                                                                            data-bs-target="#paymentGatewayModel"
                                                                                        >
                                                                                            + Payment Gateway
                                                                                        </button>
                                                                                        <div className="input-group">
                                                                                            <Select
                                                                                                className=" selectDropDown Drop-down-width"
                                                                                                value={PaymentGatewayValue}
                                                                                                onChange={(e) => {
                                                                                                    setSetting({
                                                                                                        ...setting,
                                                                                                        paymentGatewayID: e.value,
                                                                                                    });
                                                                                                }}
                                                                                                options={modifiedPaymentGatewayType}
                                                                                                aria-label="Select Payment Gateway"
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="row mb-4">
                                                            <div class="col-xl-12 col-lg-12">
                                                                <div class="card-1 pricing-box  p-4 mt-0">
                                                                    <div class="col-lg-6 col-md-6">
                                                                        <p class="office-name font-weight" style={{ width: "auto", padding: "0px 2px 0px 1px" }} >
                                                                            {EngagementName}
                                                                        </p>
                                                                    </div>
                                                                    <div class="row">
                                                                        <div className="col-lg-12">
                                                                            <div class="row" >
                                                                                <div class="col-md-3 col-sm-12 text-start text-md-end">
                                                                                    <label class="form-label" htmlFor="isEL">
                                                                                        {EngagementName}
                                                                                    </label>

                                                                                </div>
                                                                                <div class="col-md-9 col-sm-9 col-lg-9" style={{ display: 'flex', alignItems: 'center' }} >
                                                                                    <FormGroup>
                                                                                        <FormControlLabel
                                                                                            control={
                                                                                                <CustomWidthTooltip title={`Enable/Disable ${EngagementName}`}>
                                                                                                    <Android12Switch
                                                                                                        id="isEL"
                                                                                                        checked={setting.isContractEnabled}
                                                                                                        onChange={() => setSetting({
                                                                                                            ...setting,
                                                                                                            isContractEnabled: !setting.isContractEnabled
                                                                                                        })}
                                                                                                    />
                                                                                                </CustomWidthTooltip>
                                                                                            }

                                                                                        />
                                                                                        <div
                                                                                            style={{
                                                                                                marginTop: '-12px', marginBottom: '10px', textAlign: 'justify',
                                                                                            }}
                                                                                            className="text-muted helpMessage"
                                                                                        >
                                                                                            <b>Note: </b>{longText}
                                                                                        </div>
                                                                                    </FormGroup>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {/*term And Condition */}
                                                                        <div class="col-lg-12">
                                                                            <div class="row mb-3" id="SelectTnC">
                                                                                <div class="col-md-3 col-sm-12 text-start text-md-end">
                                                                                    <label class="form-label">
                                                                                        Terms & Conditions
                                                                                        <span className="text-danger">*</span>
                                                                                    </label>
                                                                                </div>
                                                                                <div class="col-md-9 col-sm-12">
                                                                                    <div className="input-group">
                                                                                        <Select
                                                                                            className=" selectDropDown Drop-down-width"
                                                                                            value={TermAndConditionValue}
                                                                                            onChange={(e) => {
                                                                                                setSetting({
                                                                                                    ...setting,
                                                                                                    tnCTemplateKeyID: e.value,
                                                                                                    tnCTemplateID: e.templateID,
                                                                                                });
                                                                                            }}
                                                                                            options={TnCLookupList}
                                                                                            aria-label="Select Payment Gateway"
                                                                                        />
                                                                                        {requireErrorMessage &&
                                                                                            (setting.tnCTemplateKeyID === "" || setting.tnCTemplateKeyID === null || setting.tnCTemplateKeyID === undefined) ?
                                                                                            (<>
                                                                                                <label
                                                                                                    className="validation"
                                                                                                >
                                                                                                    {ERROR_MESSAGES}
                                                                                                </label>
                                                                                            </>) :
                                                                                            ""
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {/*Template */}
                                                                        {/*  <div class="col-lg-12">
                                                                              <div class="row mb-3">
                                                                                    <div class="col-md-3 col-sm-12 text-start text-md-end">
                                                                                        <label class="form-label">
                                                                                            Default Template
                                                                                            <span className="text-danger">*</span>
                                                                                        </label>
                                                                                    </div>
                                                                                    <div class="col-md-9 col-sm-12">
                                                                                        <div className="input-group">
                                                                                            <Select
                                                                                                className=" selectDropDown Drop-down-width"
                                                                                                value={TemplateValue}
                                                                                                onChange={(e) => {
                                                                                                    setSetting({
                                                                                                        ...setting,
                                                                                                        ELtemplateKeyID: e.value,
                                                                                                        ELtemplateID: e.templateID,
                                                                                                    });
                                                                                                }}
                                                                                                options={templateLookUpOptions}
                                                                                                aria-label="Select Payment Gateway"
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div> */}
                                                                        <>
                                                                            <TemplateDropdown
                                                                                label="Default Template For Individual"
                                                                                originalBusinessTypeID={1}
                                                                                value={ELTemplateValueForIndividual}
                                                                                setValue={setSetting}
                                                                                options={IndividualTemplateLookUpOptions}
                                                                                errorMessage={ERROR_MESSAGES}
                                                                                requireErrorMessage={requireErrorMessage}
                                                                                Type="EL"
                                                                            />
                                                                            <TemplateDropdown
                                                                                label="Default Template For Sole-Trader"
                                                                                originalBusinessTypeID={2}
                                                                                value={ELTemplateValueForSoleTrader}
                                                                                setValue={setSetting}
                                                                                options={SoleTraderTemplateLookUpOptions}
                                                                                errorMessage={ERROR_MESSAGES}
                                                                                requireErrorMessage={requireErrorMessage}
                                                                                Type="EL"
                                                                            />
                                                                            <TemplateDropdown
                                                                                label="Default Template For Partnership"
                                                                                originalBusinessTypeID={3}
                                                                                value={ELTemplateValueForPartnership}
                                                                                setValue={setSetting}
                                                                                options={PartnershipTemplateLookUpOptions}
                                                                                errorMessage={ERROR_MESSAGES}
                                                                                requireErrorMessage={requireErrorMessage}
                                                                                Type="EL"
                                                                            />
                                                                            <TemplateDropdown
                                                                                label="Default Template For Llp"
                                                                                originalBusinessTypeID={4}
                                                                                value={ELTemplateValueForLLp}
                                                                                setValue={setSetting}
                                                                                options={LLpTemplateLookUpOptions}
                                                                                errorMessage={ERROR_MESSAGES}
                                                                                requireErrorMessage={requireErrorMessage}
                                                                                Type="EL"
                                                                            />
                                                                            <TemplateDropdown
                                                                                label="Default Template For Ltd"
                                                                                originalBusinessTypeID={5}
                                                                                value={ELTemplateValueForLtd}
                                                                                setValue={setSetting}
                                                                                options={LtdTemplateLookUpOptions}
                                                                                errorMessage={ERROR_MESSAGES}
                                                                                requireErrorMessage={requireErrorMessage}
                                                                                Type="EL"
                                                                            />
                                                                        </>



                                                                        {/*Email Template */}
                                                                        <div class="col-lg-12">
                                                                            <div class="row mb-3" id="EmailTemplate">
                                                                                <div class="col-md-3 col-sm-12 text-start text-md-end">
                                                                                    <label class="form-label">
                                                                                        {EngagementName} Send Email Template
                                                                                        <span className="text-danger">*</span>
                                                                                    </label>
                                                                                </div>
                                                                                <div class="col-md-9 col-sm-12">
                                                                                    <div className="input-group">
                                                                                        <Select
                                                                                            className=" selectDropDown Drop-down-width"
                                                                                            value={EmailTemplateValueForContract}
                                                                                            onChange={(e) => {
                                                                                                setSetting({
                                                                                                    ...setting,
                                                                                                    contractEmailTemplateKeyID: e.value
                                                                                                });
                                                                                            }}
                                                                                            options={contractEmailTemplateLookUpOptions}
                                                                                            aria-label="Select Payment Gateway"
                                                                                        />
                                                                                        {requireErrorMessage &&
                                                                                            (setting.contractEmailTemplateKeyID === "" ||
                                                                                                setting.contractEmailTemplateKeyID === null ||
                                                                                                setting.contractEmailTemplateKeyID === undefined) ? (
                                                                                            <label className="validation">{ERROR_MESSAGES}</label>
                                                                                        ) : (
                                                                                            ""
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="row mb-4" id="Proposal">
                                                            <div class="col-xl-12 col-lg-12">
                                                                <div class="card-1 pricing-box p-4  mt-0">
                                                                    <div class="col-lg-6 col-md-6">
                                                                        <p class="office-name font-weight" style={{ width: "auto", padding: "0px 2px 0px 1px" }} >
                                                                            {proposalName}
                                                                        </p>
                                                                    </div>
                                                                    <div class="row">
                                                                        {/*Quote Type*/}
                                                                        <div class="col-lg-12">
                                                                            <div class="row mb-3" id="QuoteType">
                                                                                <div class="col-md-3 col-sm-12 text-start text-md-end">
                                                                                    <label class="form-label">
                                                                                        {proposalName} Type
                                                                                        <span className="text-danger">*</span>
                                                                                    </label>
                                                                                </div>
                                                                                <div class="col-md-9 col-sm-12">
                                                                                    <div className="input-group">
                                                                                        <Select
                                                                                            isMulti
                                                                                            className=" selectDropDown Drop-down-width"
                                                                                            value={ProposalTypeValue}
                                                                                            onChange={(selectedOptions) => {
                                                                                                setSetting({
                                                                                                    ...setting,
                                                                                                    selectedProposalTypeValue: selectedOptions
                                                                                                        ? selectedOptions.map((option) => option.value)
                                                                                                        : [], // Extract only the 'value' properties
                                                                                                });
                                                                                            }}
                                                                                            options={Utils.select_Quote_Type}
                                                                                            aria-label="Select Payment Gateway"
                                                                                        />
                                                                                        {requireErrorMessage &&
                                                                                            (setting.selectedProposalTypeValue.length === 0) ? (
                                                                                            <label className="validation">{ERROR_MESSAGES}</label>
                                                                                        ) : (
                                                                                            ""
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {/*Template */}

                                                                        {/* <div class="col-lg-12">
                                                                                <div class="row mb-3">
                                                                                    <div class="col-md-3 col-sm-12 text-start text-md-end">
                                                                                        <label class="form-label">
                                                                                            Default Template
                                                                                            <span className="text-danger">*</span>
                                                                                        </label>
                                                                                    </div>
                                                                                    <div class="col-md-9 col-sm-12">
                                                                                        <div className="input-group">
                                                                                            <Select
                                                                                                className=" selectDropDown Drop-down-width"
                                                                                                value={TemplateValue}
                                                                                                onChange={(e) => {
                                                                                                    setSetting({
                                                                                                        ...setting,
                                                                                                        ELtemplateKeyID: e.value,
                                                                                                        ELtemplateID: e.templateID,
                                                                                                    });
                                                                                                }}
                                                                                                options={templateLookUpOptions}
                                                                                                aria-label="Select Payment Gateway"
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div> */}
                                                                        <>
                                                                            <TemplateDropdown
                                                                                label="Default Template For Individual"
                                                                                originalBusinessTypeID={1}
                                                                                value={PLTemplateValueForIndividual}
                                                                                setValue={setSetting}
                                                                                options={QuoteIndividualTemplateLookUpOptions}
                                                                                errorMessage={ERROR_MESSAGES}
                                                                                requireErrorMessage={requireErrorMessage}
                                                                                Type="Quote"
                                                                            />
                                                                            <TemplateDropdown
                                                                                label="Default Template For Sole-Trader"
                                                                                originalBusinessTypeID={2}
                                                                                value={PLTemplateValueForSoleTrader}
                                                                                setValue={setSetting}
                                                                                options={QuoteSoleTraderTemplateLookUpOptions}
                                                                                errorMessage={ERROR_MESSAGES}
                                                                                requireErrorMessage={requireErrorMessage}
                                                                                Type="Quote"
                                                                            />
                                                                            <TemplateDropdown
                                                                                label="Default Template For Partnership"
                                                                                originalBusinessTypeID={3}
                                                                                value={PLTemplateValueForPartnership}
                                                                                setValue={setSetting}
                                                                                options={QuotePartnerShipTemplateLookUpOptions}
                                                                                errorMessage={ERROR_MESSAGES}
                                                                                requireErrorMessage={requireErrorMessage}
                                                                                Type="Quote"
                                                                            />
                                                                            <TemplateDropdown
                                                                                label="Default Template For Llp"
                                                                                originalBusinessTypeID={4}
                                                                                value={PLTemplateValueForLLp}
                                                                                setValue={setSetting}
                                                                                options={QuoteLLpTemplateLookUpOptions}
                                                                                errorMessage={ERROR_MESSAGES}
                                                                                requireErrorMessage={requireErrorMessage}
                                                                                Type="Quote"
                                                                            />
                                                                            <TemplateDropdown
                                                                                label="Default Template For Ltd"
                                                                                originalBusinessTypeID={5}
                                                                                value={PLTemplateValueForLtd}
                                                                                setValue={setSetting}
                                                                                options={QuoteLtdTemplateLookUpOptions}
                                                                                errorMessage={ERROR_MESSAGES}
                                                                                requireErrorMessage={requireErrorMessage}
                                                                                Type="Quote"
                                                                            />
                                                                        </>
                                                                        {/*Email Template */}
                                                                        <div class="col-lg-12">
                                                                            <div class="row mb-3" id="QuoteEmailTemplate">
                                                                                <div class="col-md-3 col-sm-12 text-start text-md-end">
                                                                                    <label class="form-label">
                                                                                        {proposalName} Send Email Template
                                                                                        <span className="text-danger">*</span>
                                                                                    </label>
                                                                                </div>
                                                                                <div class="col-md-9 col-sm-12">
                                                                                    <div className="input-group">
                                                                                        <Select
                                                                                            className=" selectDropDown Drop-down-width"
                                                                                            value={EmailTemplateValueForQuote}
                                                                                            onChange={(e) => {
                                                                                                setSetting({
                                                                                                    ...setting,
                                                                                                    quoteEmailTemplateKeyID: e.value,
                                                                                                });
                                                                                            }}
                                                                                            options={quoteEmailTemplateLookUpOptions}
                                                                                            aria-label="Select Payment Gateway"
                                                                                        />
                                                                                        {requireErrorMessage &&
                                                                                            (setting.quoteEmailTemplateKeyID === "" ||
                                                                                                setting.quoteEmailTemplateKeyID === null ||
                                                                                                setting.quoteEmailTemplateKeyID === undefined) ? (
                                                                                            <label className="validation">{ERROR_MESSAGES}</label>
                                                                                        ) : (
                                                                                            ""
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="row mb-4" >
                                                            <div class="col-xl-12 col-lg-12">
                                                                <div class="card-1 pricing-box p-4  mt-0">
                                                                    <div class="col-lg-6 col-md-6">
                                                                        <p class="office-name font-weight" style={{ width: "auto", padding: "0px 2px 0px 1px" }}                                                                            >
                                                                            Appearance
                                                                        </p>
                                                                    </div>
                                                                    <div class="row">
                                                                        {/*Font Family*/}
                                                                        <div class="col-lg-12">
                                                                            <div class="row mb-3" id="FontFamily">
                                                                                <div class="col-md-3 col-sm-12 text-start text-md-end">
                                                                                    <label class="form-label">
                                                                                        Font Family
                                                                                        <span className="text-danger">*</span>
                                                                                    </label>
                                                                                </div>
                                                                                <div class="col-md-9 col-sm-12">
                                                                                    <div className="input-group">
                                                                                        <Select
                                                                                            className=" selectDropDown Drop-down-width"
                                                                                            value={FontFamilyValue}
                                                                                            onChange={(e) => {
                                                                                                setSetting({
                                                                                                    ...setting,
                                                                                                    fontFamilyID: e.value
                                                                                                });
                                                                                            }}
                                                                                            options={Utils.FontFamily}
                                                                                            aria-label="Select Payment Gateway"
                                                                                        />
                                                                                        {requireErrorMessage &&
                                                                                            (setting.fontFamilyID === "" ||
                                                                                                setting.fontFamilyID === null ||
                                                                                                setting.fontFamilyID === undefined) ? (
                                                                                            <label className="validation">{ERROR_MESSAGES}</label>
                                                                                        ) : (
                                                                                            ""
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {/*Font Size Heading*/}
                                                                        <div class="col-lg-12">
                                                                            <div class="row mb-3" id="FontSizeHeading">
                                                                                <div class="col-md-3 col-sm-12 text-start text-md-end">
                                                                                    <label class="form-label">
                                                                                        Font Size Heading
                                                                                        <span className="text-danger">*</span>
                                                                                    </label>
                                                                                </div>
                                                                                <div class="col-md-9 col-sm-12">
                                                                                    <div className="input-group">
                                                                                        <Select
                                                                                            className=" selectDropDown Drop-down-width"
                                                                                            value={FontSizeHeadingValue}
                                                                                            onChange={(e) => {
                                                                                                setSetting({
                                                                                                    ...setting,
                                                                                                    fontSizeHeading: e.value
                                                                                                });
                                                                                            }}
                                                                                            options={Utils.FontSize}
                                                                                            aria-label="Select Payment Gateway"
                                                                                        />
                                                                                    </div>
                                                                                    {requireErrorMessage &&
                                                                                        (setting.fontSizeHeading === "" ||
                                                                                            setting.fontSizeHeading === null ||
                                                                                            setting.fontSizeHeading === undefined) ? (
                                                                                        <label className="validation">{ERROR_MESSAGES}</label>
                                                                                    ) : (
                                                                                        ""
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {/*Font Size Text*/}
                                                                        <div class="col-lg-12">
                                                                            <div class="row mb-3" id="FontSizeText">
                                                                                <div class="col-md-3 col-sm-12 text-start text-md-end">
                                                                                    <label class="form-label">
                                                                                        Font Size Text
                                                                                        <span className="text-danger">*</span>
                                                                                    </label>
                                                                                </div>
                                                                                <div class="col-md-9 col-sm-12">
                                                                                    <div className="input-group">
                                                                                        <Select
                                                                                            className=" selectDropDown Drop-down-width"
                                                                                            value={FontSizeTextValue}
                                                                                            onChange={(e) => {
                                                                                                setSetting({
                                                                                                    ...setting,
                                                                                                    fontSizeText: e.value
                                                                                                });
                                                                                            }}
                                                                                            options={Utils.FontSize}
                                                                                            aria-label="Select Payment Gateway"
                                                                                        />
                                                                                    </div>
                                                                                    {requireErrorMessage &&
                                                                                        (setting.fontSizeText === "" ||
                                                                                            setting.fontSizeText === null ||
                                                                                            setting.fontSizeText === undefined) ? (
                                                                                        <label className="validation">{ERROR_MESSAGES}</label>
                                                                                    ) : (
                                                                                        ""
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {/*Button Color */}
                                                                        <div class="col-lg-12">
                                                                            <div class="row mb-3" id="ButtonColor">
                                                                                <div class="col-md-3 col-sm-12 text-start text-md-end">
                                                                                    <label class="form-label">
                                                                                        Button Color
                                                                                        <span className="text-danger">*</span>
                                                                                    </label>
                                                                                </div>
                                                                                <div class="col-md-9 col-sm-12">
                                                                                    <div className="input-group">
                                                                                        <input
                                                                                            type="color"
                                                                                            class="form-control height"
                                                                                            id="exampleColorInput contactNumber"
                                                                                            title="Choose your color"
                                                                                            value={setting.buttonColor}
                                                                                            onChange={(e) => {
                                                                                                setSetting({
                                                                                                    ...setting,
                                                                                                    buttonColor: e.target.value
                                                                                                })
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                    {requireErrorMessage &&
                                                                                        (setting.buttonColor === "" ||
                                                                                            setting.buttonColor === null ||
                                                                                            setting.buttonColor === undefined) ? (
                                                                                        <label className="validation">{ERROR_MESSAGES}</label>
                                                                                    ) : (
                                                                                        ""
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {/*Cancel Button Color */}
                                                                        <div class="col-lg-12">
                                                                            <div class="row mb-3" id="CancelButtonColor">
                                                                                <div class="col-md-3 col-sm-12 text-start text-md-end">
                                                                                    <label class="form-label">
                                                                                        Cancel Button Color
                                                                                        <span className="text-danger">*</span>
                                                                                    </label>
                                                                                </div>
                                                                                <div class="col-md-9 col-sm-12">
                                                                                    <div className="input-group">
                                                                                        <input
                                                                                            type="color"
                                                                                            class="form-control height"
                                                                                            id="exampleColorInput contactNumber"
                                                                                            title="Choose your color"
                                                                                            value={setting.cancelButtonColor}
                                                                                            onChange={(e) => {
                                                                                                setSetting({
                                                                                                    ...setting,
                                                                                                    cancelButtonColor: e.target.value
                                                                                                })
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                    {requireErrorMessage &&
                                                                                        (setting.cancelButtonColor === "" ||
                                                                                            setting.cancelButtonColor === null ||
                                                                                            setting.cancelButtonColor === undefined) ? (
                                                                                        <label className="validation">{ERROR_MESSAGES}</label>
                                                                                    ) : (
                                                                                        ""
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {/*Background Color*/}
                                                                        <div class="col-lg-12">
                                                                            <div class="row mb-3" id="BackgroundColor">
                                                                                <div class="col-md-3 col-sm-12 text-start text-md-end">
                                                                                    <label class="form-label">
                                                                                        Backgound Color
                                                                                        <span className="text-danger">*</span>
                                                                                    </label>
                                                                                </div>
                                                                                <div class="col-md-9 col-sm-12">
                                                                                    <div className="input-group">
                                                                                        <input
                                                                                            type="color"
                                                                                            class="form-control height"
                                                                                            id="exampleColorInput contactNumber"
                                                                                            title="Choose your color"
                                                                                            value={setting.bodyBackGroundColor}
                                                                                            onChange={(e) => {
                                                                                                setSetting({
                                                                                                    ...setting,
                                                                                                    bodyBackGroundColor: e.target.value
                                                                                                })
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                    {requireErrorMessage &&
                                                                                        (setting.bodyBackGroundColor === "" ||
                                                                                            setting.bodyBackGroundColor === null ||
                                                                                            setting.bodyBackGroundColor === undefined) ? (
                                                                                        <label className="validation">{ERROR_MESSAGES}</label>
                                                                                    ) : (
                                                                                        ""
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {/*Background Color*/}
                                                                        <div class="col-lg-12">
                                                                            <div class="row mb-3" id="FromBackgroundColor">
                                                                                <div class="col-md-3 col-sm-12 text-start text-md-end">
                                                                                    <label class="form-label">
                                                                                        Form Backgound Color
                                                                                        <span className="text-danger">*</span>
                                                                                    </label>
                                                                                </div>
                                                                                <div class="col-md-9 col-sm-12">
                                                                                    <div className="input-group">
                                                                                        <input
                                                                                            type="color"
                                                                                            class="form-control height"
                                                                                            id="exampleColorInput contactNumber"
                                                                                            title="Choose your color"
                                                                                            value={setting.formBackGroundColor}
                                                                                            onChange={(e) => {
                                                                                                setSetting({
                                                                                                    ...setting,
                                                                                                    formBackGroundColor: e.target.value
                                                                                                })
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                    {requireErrorMessage &&
                                                                                        (setting.formBackGroundColor === "" ||
                                                                                            setting.formBackGroundColor === null ||
                                                                                            setting.formBackGroundColor === undefined) ? (
                                                                                        <label className="validation">{ERROR_MESSAGES}</label>
                                                                                    ) : (
                                                                                        ""
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {/*Background Service Category Colore */}
                                                                        <div class="col-lg-12">
                                                                            <div class="row mb-3" id="BackGroundServiceColor">
                                                                                <div class="col-md-3 col-sm-12 text-start text-md-end">
                                                                                    <label class="form-label">
                                                                                        Background Service Category Color
                                                                                        <span className="text-danger">*</span>
                                                                                    </label>
                                                                                </div>
                                                                                <div class="col-md-9 col-sm-12">
                                                                                    <div className="input-group">
                                                                                        <input
                                                                                            type="color"
                                                                                            class="form-control height"
                                                                                            id="exampleColorInput contactNumber"
                                                                                            title="Choose your color"
                                                                                            value={setting.backgroundServiceCategoryColor}
                                                                                            onChange={(e) => {
                                                                                                setSetting({
                                                                                                    ...setting,
                                                                                                    backgroundServiceCategoryColor: e.target.value
                                                                                                })
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                    {requireErrorMessage &&
                                                                                        (setting.backgroundServiceCategoryColor === "" ||
                                                                                            setting.backgroundServiceCategoryColor === null ||
                                                                                            setting.backgroundServiceCategoryColor === undefined) ? (
                                                                                        <label className="validation">{ERROR_MESSAGES}</label>
                                                                                    ) : (
                                                                                        ""
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="row" >
                                                            <div class="col-xl-12 col-lg-12">
                                                                <div class="card-1 pricing-box p-4  mt-0">
                                                                    <div class="col-lg-6 col-md-6">
                                                                        <p class="office-name font-weight" style={{ width: "auto", padding: "0px 2px 0px 1px" }}  >
                                                                            Personalize Setting
                                                                        </p>
                                                                    </div>
                                                                    <div class="row">
                                                                        <div class="col-lg-12">
                                                                            <div class="row mb-2" id="ProposalNameFor">
                                                                                <div class="col-md-3 col-sm-12 text-start text-md-end">
                                                                                    <label class="form-label">
                                                                                        Change {proposalName} For
                                                                                        <span className="text-danger">*</span>
                                                                                    </label>
                                                                                </div>
                                                                                <div class="col-md-9 col-sm-12">
                                                                                    <input
                                                                                        type="text"
                                                                                        className="input-text"
                                                                                        placeholder={`Change ${proposalName} For`}
                                                                                        value={setting.proposalForLabel}
                                                                                        onChange={(e) => setSetting({
                                                                                            ...setting,
                                                                                            proposalForLabel: e.target.value
                                                                                        })}
                                                                                    />
                                                                                    {requireErrorMessage &&
                                                                                        (setting.proposalForLabel === "" ||
                                                                                            setting.proposalForLabel === null ||
                                                                                            setting.proposalForLabel === undefined) ? (
                                                                                        <label className="validation">{ERROR_MESSAGES}</label>
                                                                                    ) : (
                                                                                        ""
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="row">
                                                                        <div class="col-lg-12">
                                                                            <div class="row mb-2" id="FontSizeType">
                                                                                <div class="col-md-3 col-sm-12 text-start text-md-end">
                                                                                    <label class="form-label">
                                                                                        Change {proposalName} Type
                                                                                        <span className="text-danger">*</span>
                                                                                    </label>
                                                                                </div>
                                                                                <div class="col-md-9 col-sm-12">
                                                                                    <input
                                                                                        type="text"
                                                                                        className="input-text"
                                                                                        placeholder={`Change ${proposalName} Type`}
                                                                                        value={setting.proposalTypeLabel}
                                                                                        onChange={(e) => setSetting({
                                                                                            ...setting,
                                                                                            proposalTypeLabel: e.target.value
                                                                                        })}
                                                                                    />
                                                                                    {requireErrorMessage &&
                                                                                        (setting.proposalTypeLabel === "" ||
                                                                                            setting.proposalTypeLabel === null ||
                                                                                            setting.proposalTypeLabel === undefined) ? (
                                                                                        <label className="validation">{ERROR_MESSAGES}</label>
                                                                                    ) : (
                                                                                        ""
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="row">
                                                                        <div class="col-lg-12">
                                                                            <div class="row mb-2" id="ChangeCustomSingle">
                                                                                <div class="col-md-3 col-sm-12 text-start text-md-end">
                                                                                    <label class="form-label">
                                                                                        Change Custom(Single)
                                                                                        <span className="text-danger">*</span>
                                                                                    </label>
                                                                                </div>
                                                                                <div class="col-md-9 col-sm-12">
                                                                                    <input
                                                                                        type="text"
                                                                                        className="input-text"
                                                                                        placeholder="Change Custom(Single)"
                                                                                        value={setting.customSingleLabel}
                                                                                        onChange={(e) => setSetting({
                                                                                            ...setting,
                                                                                            customSingleLabel: e.target.value
                                                                                        })}
                                                                                    />
                                                                                    {requireErrorMessage &&
                                                                                        (setting.customSingleLabel === "" ||
                                                                                            setting.customSingleLabel === null ||
                                                                                            setting.customSingleLabel === undefined) ? (
                                                                                        <label className="validation">{ERROR_MESSAGES}</label>
                                                                                    ) : (
                                                                                        ""
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="row">
                                                                        <div class="col-lg-12">
                                                                            <div class="row mb-2" id="ChangePackedStandard">
                                                                                <div class="col-md-3 col-sm-12 text-start text-md-end">
                                                                                    <label class="form-label">
                                                                                        Change Packaged(Standard)(Single/Multiple)
                                                                                        <span className="text-danger">*</span>
                                                                                    </label>
                                                                                </div>
                                                                                <div class="col-md-9 col-sm-12">
                                                                                    <input
                                                                                        type="text"
                                                                                        className="input-text"
                                                                                        placeholder="Change Packaged (Standard) (Single/Multiple)"
                                                                                        value={setting.packagedStandardLabel}
                                                                                        onChange={(e) => setSetting({
                                                                                            ...setting,
                                                                                            packagedStandardLabel: e.target.value
                                                                                        })}
                                                                                    />
                                                                                    {requireErrorMessage &&
                                                                                        (setting.packagedStandardLabel === "" ||
                                                                                            setting.packagedStandardLabel === null ||
                                                                                            setting.packagedStandardLabel === undefined) ? (
                                                                                        <label className="validation">{ERROR_MESSAGES}</label>
                                                                                    ) : (
                                                                                        ""
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="row">
                                                                        <div class="col-lg-12">
                                                                            <div class="row mb-2" id="ChangePackedCustom">
                                                                                <div class="col-md-3 col-sm-12 text-start text-md-end">
                                                                                    <label class="form-label">
                                                                                        Change Package(Customisable)(Single/Multiple)
                                                                                        <span className="text-danger">*</span>
                                                                                    </label>
                                                                                </div>
                                                                                <div class="col-md-9 col-sm-12">
                                                                                    <input
                                                                                        type="text"
                                                                                        className="input-text"
                                                                                        placeholder="Change Package (Customisable) (Single/Multiple)"
                                                                                        value={setting.packagedCustomisableLabel}
                                                                                        onChange={(e) => setSetting({
                                                                                            ...setting,
                                                                                            packagedCustomisableLabel: e.target.value
                                                                                        })}
                                                                                    />
                                                                                    {requireErrorMessage &&
                                                                                        (setting.packagedCustomisableLabel === "" ||
                                                                                            setting.packagedCustomisableLabel === null ||
                                                                                            setting.packagedCustomisableLabel === undefined) ? (
                                                                                        <label className="validation">{ERROR_MESSAGES}</label>
                                                                                    ) : (
                                                                                        ""
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="row">
                                                                        <div class="col-lg-12">
                                                                            <div class="row mb-2" id="GetQuote">
                                                                                <div class="col-md-3 col-sm-12 text-start text-md-end">
                                                                                    <label class="form-label">
                                                                                        Get {proposalName} Button
                                                                                        <span className="text-danger">*</span>
                                                                                    </label>
                                                                                </div>
                                                                                <div class="col-md-9 col-sm-12">
                                                                                    <input
                                                                                        type="text"
                                                                                        className="input-text"
                                                                                        placeholder="Change Custom(Single)"
                                                                                        value={setting.getQuoteLabel}
                                                                                        onChange={(e) => setSetting({
                                                                                            ...setting,
                                                                                            getQuoteLabel: e.target.value
                                                                                        })}
                                                                                    />
                                                                                    {requireErrorMessage &&
                                                                                        (setting.getQuoteLabel === "" ||
                                                                                            setting.getQuoteLabel === null ||
                                                                                            setting.getQuoteLabel === undefined) ? (
                                                                                        <label className="validation">{ERROR_MESSAGES}</label>
                                                                                    ) : (
                                                                                        ""
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="row">
                                                                        <div class="col-lg-12">
                                                                            <div class="row mb-2" id="SignContract">
                                                                                <div class="col-md-3 col-sm-12 text-start text-md-end">
                                                                                    <label class="form-label">
                                                                                        Sign {EngagementName} Button
                                                                                        <span className="text-danger">*</span>
                                                                                    </label>
                                                                                </div>
                                                                                <div class="col-md-9 col-sm-12">
                                                                                    <input
                                                                                        type="text"
                                                                                        className="input-text"
                                                                                        placeholder="Change Custom(Single)"
                                                                                        value={setting.signContractLabel}
                                                                                        onChange={(e) => setSetting({
                                                                                            ...setting,
                                                                                            signContractLabel: e.target.value
                                                                                        })}
                                                                                    />
                                                                                    {requireErrorMessage &&
                                                                                        (setting.signContractLabel === "" ||
                                                                                            setting.signContractLabel === null ||
                                                                                            setting.signContractLabel === undefined) ? (
                                                                                        <label className="validation">{ERROR_MESSAGES}</label>
                                                                                    ) : (
                                                                                        ""
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {/* New success Tab */}
                                                                    <div className="row">
                                                                        {/* New Tab */}
                                                                        <div className="col-lg-12">
                                                                            <div class="row" >
                                                                                <div class="mt-2 col-md-3 col-sm-12 text-start text-md-end">
                                                                                    <label class="form-label" htmlFor="isSuccess">
                                                                                        Open Success Url In New Tab
                                                                                    </label>
                                                                                </div>
                                                                                <div class="col-md-9 col-sm-9 col-lg-9" style={{ display: 'flex', alignItems: 'center' }} >
                                                                                    <FormGroup>
                                                                                        <FormControlLabel
                                                                                            control={
                                                                                                <CustomWidthTooltip title={`Enable/Disable Open Success Url In New Tab`}>
                                                                                                    <Android12Switch
                                                                                                        id="isSuccess"
                                                                                                        checked={setting.openSuccessUrlInNewTab}
                                                                                                        onChange={() => setSetting({
                                                                                                            ...setting,
                                                                                                            openSuccessUrlInNewTab: !setting.openSuccessUrlInNewTab
                                                                                                        })}
                                                                                                    />
                                                                                                </CustomWidthTooltip>
                                                                                            }

                                                                                        />
                                                                                        <div
                                                                                            style={{
                                                                                                marginTop: '-12px', marginBottom: '10px', textAlign: 'justify',
                                                                                            }}
                                                                                            className="text-muted helpMessage"
                                                                                        >
                                                                                            <b>Note: </b>If enabled, the success URL will open in a new browser tab after completion.
                                                                                        </div>
                                                                                    </FormGroup>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {/* Success Url*/}
                                                                    <div className="row">
                                                                        <div class="col-lg-12">
                                                                            <div class="row mb-3" id="successUrl">
                                                                                <div class="col-md-3 col-sm-12 text-start text-md-end">
                                                                                    <label class="form-label">
                                                                                        Success Url
                                                                                        <span className="text-danger">*</span>
                                                                                    </label>
                                                                                </div>
                                                                                <div class="col-md-9 col-sm-12">
                                                                                    <div className="input-group">
                                                                                        <input
                                                                                            type="text"
                                                                                            className="input-text"
                                                                                            placeholder="Success Url"
                                                                                            value={setting.successUrl}
                                                                                            onChange={(e) => {
                                                                                                setSetting({
                                                                                                    ...setting,
                                                                                                    successUrl: e.target.value
                                                                                                })
                                                                                            }}
                                                                                        />
                                                                                        {requireErrorMessage &&
                                                                                            (setting.successUrl === "" ||
                                                                                                setting.successUrl === null ||
                                                                                                setting.successUrl === undefined) ? (
                                                                                            <label className="validation">{ERROR_MESSAGES}</label>
                                                                                        ) : (
                                                                                            ""
                                                                                        )}
                                                                                        {requireErrorMessage &&
                                                                                            setting.successUrl !== null &&
                                                                                            setting.successUrl !== "" &&
                                                                                            setting.successUrl !== undefined &&
                                                                                            !isValidWebUrl(setting.successUrl) && (
                                                                                                <span className="validation"> Invalid Url </span>
                                                                                            )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {/* New cancel Tab */}
                                                                    <div className="row">
                                                                        <div className="col-lg-12">
                                                                            <div class="row" >
                                                                                <div class="col-md-3 col-sm-12 text-start text-md-end mt-2">
                                                                                    <label class="form-label" htmlFor="isCancel">
                                                                                        Open Cancel Url In New Tab
                                                                                    </label>
                                                                                </div>
                                                                                <div class="col-md-9 col-sm-9 col-lg-9" style={{ display: 'flex', alignItems: 'center' }} >
                                                                                    <FormGroup>
                                                                                        <FormControlLabel
                                                                                            control={
                                                                                                <CustomWidthTooltip title={`Enable/Disable Open Cancel Url In New Tab`}>
                                                                                                    <Android12Switch
                                                                                                        id="isCancel"
                                                                                                        checked={setting.openCancelUrlInNewTab}
                                                                                                        onChange={() => setSetting({
                                                                                                            ...setting,
                                                                                                            openCancelUrlInNewTab: !setting.openCancelUrlInNewTab
                                                                                                        })}
                                                                                                    />
                                                                                                </CustomWidthTooltip>
                                                                                            }

                                                                                        />
                                                                                        <div
                                                                                            style={{
                                                                                                marginTop: '-12px', marginBottom: '10px', textAlign: 'justify',
                                                                                            }}
                                                                                            className="text-muted helpMessage"
                                                                                        >
                                                                                            <b>Note: </b>If enabled, the cancel URL will open in a new browser tab when the user cancels.
                                                                                        </div>
                                                                                    </FormGroup>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {/* Cancel Url*/}
                                                                    <div className="row">
                                                                        <div class="col-lg-12">
                                                                            <div class="row mb-3" id="cancelledUrl">
                                                                                <div class="col-md-3 col-sm-12 text-start text-md-end">
                                                                                    <label class="form-label">
                                                                                        Cancel Url
                                                                                        <span className="text-danger">*</span>
                                                                                    </label>
                                                                                </div>
                                                                                <div class="col-md-9 col-sm-12">
                                                                                    <div className="input-group">
                                                                                        <input
                                                                                            type="text"
                                                                                            className="input-text"
                                                                                            placeholder="Cancel Url"

                                                                                            value={setting.cancelledUrl}
                                                                                            onChange={(e) => {
                                                                                                setSetting({
                                                                                                    ...setting,
                                                                                                    cancelledUrl: e.target.value
                                                                                                })
                                                                                            }}
                                                                                        />
                                                                                        {requireErrorMessage &&
                                                                                            (setting.cancelledUrl === "" ||
                                                                                                setting.cancelledUrl === null ||
                                                                                                setting.cancelledUrl === undefined) ? (
                                                                                            <label className="validation">{ERROR_MESSAGES}</label>
                                                                                        ) : (
                                                                                            ""
                                                                                        )}
                                                                                        {requireErrorMessage &&
                                                                                            setting.cancelledUrl !== null &&
                                                                                            setting.cancelledUrl !== "" &&
                                                                                            setting.cancelledUrl !== undefined &&
                                                                                            !isValidWebUrl(setting.cancelledUrl) && (
                                                                                                <span className="validation"> Invalid Url </span>
                                                                                            )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {/*Delete Prospect */}
                                                                    <div className="row">
                                                                        <div className="col-lg-12">
                                                                            <div class="row" >
                                                                                <div class="mt-2 col-md-3 col-sm-12 text-start text-md-end">
                                                                                    <label class="form-label" htmlFor="isDeleteProspect">
                                                                                        Delete {prospectName}
                                                                                    </label>
                                                                                </div>
                                                                                <div class="col-md-9 col-sm-9 col-lg-9" style={{ display: 'flex', alignItems: 'center' }} >
                                                                                    <FormGroup>
                                                                                        <FormControlLabel
                                                                                            control={
                                                                                                <CustomWidthTooltip title={`Enable/Disable delete ${prospectName}`}>
                                                                                                    <Android12Switch
                                                                                                        id="isDeleteProspect"
                                                                                                        checked={setting.isDeleteClient}
                                                                                                        onChange={() => setSetting({
                                                                                                            ...setting,
                                                                                                            isDeleteClient: !setting.isDeleteClient
                                                                                                        })}
                                                                                                    />
                                                                                                </CustomWidthTooltip>
                                                                                            }

                                                                                        />
                                                                                        <div
                                                                                            style={{
                                                                                                marginTop: '-12px', marginBottom: '10px', textAlign: 'justify',
                                                                                            }}
                                                                                            className="text-muted helpMessage"
                                                                                        >
                                                                                            <b>Note: </b>If enabled, the {prospectName} will be deleted after all related {proposalName} and {EngagementName} are deleted.
                                                                                        </div>
                                                                                    </FormGroup>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-lg-12">
                                                                            <div class="row" >
                                                                                <div class="mt-2 col-md-3 col-sm-12 text-start text-md-end">
                                                                                    <label class="form-label" htmlFor="isDeleteQuote">
                                                                                        Delete {proposalName}
                                                                                    </label>
                                                                                </div>
                                                                                <div class="col-md-9 col-sm-9 col-lg-9" style={{ display: 'flex', alignItems: 'center' }} >
                                                                                    <FormGroup>
                                                                                        <FormControlLabel
                                                                                            control={
                                                                                                <CustomWidthTooltip title={`Enable/Disable delete ${proposalName}`}>
                                                                                                    <Android12Switch
                                                                                                        id="isDeleteQuote"
                                                                                                        checked={setting.isDeleteQuote}
                                                                                                        onChange={() => setSetting({
                                                                                                            ...setting,
                                                                                                            isDeleteQuote: !setting.isDeleteQuote
                                                                                                        })}
                                                                                                    />
                                                                                                </CustomWidthTooltip>
                                                                                            }

                                                                                        />
                                                                                        <div
                                                                                            style={{
                                                                                                marginTop: '-12px', marginBottom: '10px', textAlign: 'justify',
                                                                                            }}
                                                                                            className="text-muted helpMessage"
                                                                                        >
                                                                                            <b>Note: </b>If enabled, the {proposalName} will be deleted after {setting.deleteQuoteAfterDays} days.
                                                                                        </div>
                                                                                    </FormGroup>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {/* Delete Proposal*/}
                                                                    <div className="row">
                                                                        <div class="col-lg-12">
                                                                            <div class="row mb-3" id="deleteQuoteAfterDays">
                                                                                <div class="col-md-3 col-sm-12 text-start text-md-end">
                                                                                    <label class="form-label">
                                                                                        Delete {proposalName} After Days
                                                                                        <span className="text-danger">*</span>
                                                                                    </label>
                                                                                </div>
                                                                                <div class="col-md-9 col-sm-12">
                                                                                    <div className="input-group">
                                                                                        <input
                                                                                            type="text"
                                                                                            className="input-text"
                                                                                            placeholder={`Delete ${proposalName} After Days`}
                                                                                            value={setting.deleteQuoteAfterDays}
                                                                                            onChange={(e) => {
                                                                                                setSetting({
                                                                                                    ...setting,
                                                                                                    deleteQuoteAfterDays: e.target.value
                                                                                                })
                                                                                            }}
                                                                                        />
                                                                                        {requireErrorMessage &&
                                                                                            (setting.deleteQuoteAfterDays === "" ||
                                                                                                setting.deleteQuoteAfterDays === null ||
                                                                                                setting.deleteQuoteAfterDays === undefined) ? (
                                                                                            <label className="validation">{ERROR_MESSAGES}</label>
                                                                                        ) : (
                                                                                            ""
                                                                                        )}

                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {/*Delete Contract */}
                                                                    <div className="row">
                                                                        <div className="col-lg-12">
                                                                            <div class="row" >
                                                                                <div class="mt-2 col-md-3 col-sm-12 text-start text-md-end">
                                                                                    <label class="form-label" htmlFor="isContractEnabled">
                                                                                        Delete {EngagementName}
                                                                                    </label>
                                                                                </div>
                                                                                <div class="col-md-9 col-sm-9 col-lg-9" style={{ display: 'flex', alignItems: 'center' }} >
                                                                                    <FormGroup>
                                                                                        <FormControlLabel
                                                                                            control={
                                                                                                <CustomWidthTooltip title={`Enable/Disable delete ${EngagementName}`}>
                                                                                                    <Android12Switch
                                                                                                        id="isContractEnabled"
                                                                                                        checked={setting.isContractEnabled}
                                                                                                        onChange={() => setSetting({
                                                                                                            ...setting,
                                                                                                            isContractEnabled: !setting.isContractEnabled
                                                                                                        })}
                                                                                                    />
                                                                                                </CustomWidthTooltip>
                                                                                            }

                                                                                        />
                                                                                        <div
                                                                                            style={{
                                                                                                marginTop: '-12px', marginBottom: '10px', textAlign: 'justify',
                                                                                            }}
                                                                                            className="text-muted helpMessage"
                                                                                        >
                                                                                            <b>Note: </b>If enabled, the {EngagementName} will be deleted after {setting.deleteContractAfterDays} days.
                                                                                        </div>
                                                                                    </FormGroup>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {/* Delete Proposal*/}
                                                                    <div className="row">
                                                                        <div class="col-lg-12">
                                                                            <div class="row mb-3" id="deleteContractAfterDays">
                                                                                <div class="col-md-3 col-sm-12 text-start text-md-end">
                                                                                    <label class="form-label">
                                                                                        Delete {EngagementName} After Days
                                                                                        <span className="text-danger">*</span>
                                                                                    </label>
                                                                                </div>
                                                                                <div class="col-md-9 col-sm-12">
                                                                                    <div className="input-group">
                                                                                        <input
                                                                                            type="text"
                                                                                            className="input-text"
                                                                                            placeholder={`Delete ${EngagementName} After Days`}
                                                                                            value={setting.deleteContractAfterDays}
                                                                                            onChange={(e) => {
                                                                                                setSetting({
                                                                                                    ...setting,
                                                                                                    deleteContractAfterDays: e.target.value
                                                                                                })
                                                                                            }}
                                                                                        />
                                                                                        {requireErrorMessage &&
                                                                                            (setting.deleteContractAfterDays === "" ||
                                                                                                setting.deleteContractAfterDays === null ||
                                                                                                setting.deleteContractAfterDays === undefined) ? (
                                                                                            <label className="validation">{ERROR_MESSAGES}</label>
                                                                                        ) : (
                                                                                            ""
                                                                                        )}

                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                </div>
                                {/* Card Body End */}
                                <span
                                    style={{ display: "flex", justifyContent: "center" }}
                                    className="validation"
                                >
                                    {errorMessage}
                                </span>
                                <div class="separator"></div>
                                <div className="col-lg-12 text-center mt-3">
                                    <button
                                        onClick={() => UpdateSetting()}
                                        className="btn btn-md create-item-btn update-practice"
                                    >
                                        <span> Update {ModuleName}</span>
                                    </button>
                                </div>
                            </div>
                            {/* Card End */}

                        </div>
                    </div>
                </div>
            </div>
            <SuccessModal
                handleClose={handleClose}
                setOpenSuccessModal={setOpenSuccessModal}
                openSuccessModal={openSuccessModal}
                modelAction={"Update"}
                message={ModuleName}
            />
            <PaymentGatewayModel
                class="modal fade"
                id="paymentGatewayModel"
                tabindex="-1"
                aria_labelledby="paymentGatewayModel"
                aria_hidden="true"
                isModalOpen={isModalOpen}
                setISModalOpen={setISModalOpen}
                isAddUpdatePricingActionDone={isAddUpdatePricingActionDone}
                setIsAddUpdatePricingActionDone={setIsAddUpdatePricingActionDone}
            />
        </div >

    )
}

export default Setting
