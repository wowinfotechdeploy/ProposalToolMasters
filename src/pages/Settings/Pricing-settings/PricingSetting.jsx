/* global $ */
import React, { useState, useRef, useContext } from "react";
import "./PricingSettingStyle.css";
import "./PricingSettingStyle-redesign.css";
import { useEffect } from "react";
import {
  AddUpdatePricingSetting,
  GetPricingSettingModel,
} from "../../../redux/Services/Setting/PricingSettingApi";
import {
  GetServiceFeeInflationList,
  AddUpdateServiceFeeInflation,
  DeleteAllServiceFeeInflationConfiguration,
  AcceptServiceFeeInflationSAChanges,
  DeclineServiceFeeInflation,
  GetDraftsAffectedByFeeInflationBatch,
} from "../../../redux/Services/Config/ServicesApi";
import { useSelector } from "react-redux";
import SuccessModal from "../../../components/SuccessModal";
import { AuthContextProvider } from "../../../AuthContext/AuthContext";
import Footer from "../../../components/Footer";
import Select from "react-select";
import Utils from "../../../Middleware/Utils";
import ConfirmModel from "../../../components/ConfirmationBox";
import SAPredefinedChangesNotifyMessageModel from "../../../components/SAPredefinedChangesNotifyMessageModel";
import ConfirmSAChangesModel from "../../../components/AcceptSuperAdminChangesConfirmation";

const Pricing_Settings = () => {
  const moduleName = "FeeInflation";
  // A] States Declaration :
  const [activeTab, setActiveTab] = useState("PricingSetting");
  const [requireErrorMessage, setRequireErrorMessage] = useState(false);
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [dismissModal, setDismissModal] = useState(null);
  const [prevError, SetPrevError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState(
    Utils.Payment_Frequency[0],
  );
  const masterProposalType = Utils.select_Quote_Type.find(
    (item) => item.value === 4,
  )?.label;
  const [pricingSettingObj, setPricingSettingObj] = useState({
    userKeyID: null,
    minOneOffPriceForQC: "",
    minMonthlyPriceForQC: "",
    minQuarterlyPriceForQC: "",
    minHalfYearlyPriceForQC: "",
    minYearlyPriceForQC: "",
    maxDiscountForQC: null,
    paymentFrequencyID: null,
    enableMasterProposalType: false,
    defaultProposalFormatID: null,
  });
  const [ServiceFeeInflationConfig, setServiceFeeInflationConfig] = useState({
    OrganisationKeyID: null,
    UserKeyID: null,
    ServiceFeeInflationList: [], // full list from API
    HasExistingConfig: false,
    SelectionError: "", // error message related to service selection
    SelectedServices: [], // array of selected service objects
    InflationRule: {
      // single rule applied to all selected services
      operator: null, // '+' | '-' | '*' | '/' | null
      value: null, // decimal or null
    },
  });
  const [modelRequestData, setModelRequestData] = useState({
    message: null,
    status: null,
    Action: null,
    keyID: null,
    SearchKeyword: "",
    RefId: null,
  });
  const [SAConfirmStatus, setSAConfirmStatus] = useState(true); // true = accept, false = decline
  const [SAConfirmBatchID, setSAConfirmBatchID] = useState(null);
  // const ProposalObject = {
  //   Payment_Frequency: 2 // Example initial value, adjust as needed
  // };

  useEffect(() => {
    if (pricingSettingObj.paymentFrequencyID !== null) {
      const foundFrequency = Utils.Payment_Frequency.find(
        (item) => item.value === pricingSettingObj.paymentFrequencyID,
      );
      setSelectedFrequency(foundFrequency);
    }
  }, [pricingSettingObj.paymentFrequencyID]);
  const [PrevPricingSettingObj, setPrevPricingSettingObj] = useState({
    userKeyID: null,
    minOneOffPriceForQC: "",
    minMonthlyPriceForQC: "",
    maxDiscountForQC: "",
    paymentFrequencyID: null,
    enableMasterProposalType: false,
    defaultProposalFormatID: null,
    remainingESignatures: null,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [feeInflationErrorMessage, setFeeInflationErrorMessage] = useState("");
  const {
    setLoader,
    setTopbar,
    proposalName,
    EngagementName,
    staticCurrencySymbols,
    getCurrencySymbol,
    userAccessData,
  } = useContext(AuthContextProvider);
  const common = useSelector((state) => state.Storage); //Getting Logged Users Details From Persist Storage of redux hooks
  const currencySymbol = getCurrencySymbol(common.currency);
  const [isFormChanged, setIsFormChanged] = useState(false);
  // B] Initial useEffect : Will call when Add/Update button click from list page
  useEffect(() => {
    setTopbar("block");
  }, []);

  useEffect(() => {
    if (common.organisationKeyID !== null) {
      GetPricingSettingModelData(common.organisationKeyID);
    }
  }, [common.organisationKeyID]);

  const getProposalFormatOptions = () => {
    if (PrevPricingSettingObj.remainingESignatures !== true) {
      return Utils.PreviewSelection.filter((x) => x.value === 2);
    }
    return Utils.PreviewSelection;
  };

  const availableServices =
    ServiceFeeInflationConfig.ServiceFeeInflationList.filter((s) => {
      const isFixed = s.pricingTypeID !== 2;
      const isAlreadyConfigured = s.operator !== null && s.value !== null;

      if (isFixed && isAlreadyConfigured) return false;

      return true;
    });

  const allServicesSelected =
    availableServices.length > 0 &&
    ServiceFeeInflationConfig.SelectedServices.length ===
      availableServices.length;

  // const getProposalFormatValue = () => {
  //   if(common.enableEL === 1 && activeOrganizationSubscriptionPlan?.prepareContract === true) {
  //     return Utils.PreviewSelection.find(x => x.value === (pricingSettingObj.defaultProposalFormatID ?? 1));
  //   }
  //   return Utils.PreviewSelection.find(x => x.value === 2);
  // }

  // F] Calling CRUD Api here
  // 1) Get Model Data Api
  const GetPricingSettingModelData = async (id) => {
    if (!id) {
      return;
    }
    try {
      const data = await GetPricingSettingModel(id);
      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          const ModelData = data?.data?.responseData?.data;
          SetPrevError(false);
          setPricingSettingObj({
            ...pricingSettingObj,
            userKeyID: common.userKeyID,
            minOneOffPriceForQC: ModelData.minOneOffPriceForQC,
            minMonthlyPriceForQC: ModelData.minMonthlyPriceForQC,
            minQuarterlyPriceForQC: ModelData.minQuarterlyPriceForQC,
            minHalfYearlyPriceForQC: ModelData.minHalfYearlyPriceForQC,
            minYearlyPriceForQC: ModelData.minYearlyPriceForQC,
            maxDiscountForQC: ModelData.maxDiscountForQC,
            organisationKeyID: ModelData.organisationKeyID,
            paymentFrequencyID: ModelData.paymentFrequencyID,
            enableMasterProposalType: ModelData.enableMasterProposalType,
            defaultProposalFormatID: ModelData.defaultProposalFormatID,
            remainingESignatures: ModelData.remainingESignatures,
          });
          setPrevPricingSettingObj({
            ...pricingSettingObj,
            userKeyID: common.userKeyID,
            minOneOffPriceForQC: ModelData.minOneOffPriceForQC,
            minMonthlyPriceForQC: ModelData.minMonthlyPriceForQC,
            minQuarterlyPriceForQC: ModelData.minQuarterlyPriceForQC,
            minHalfYearlyPriceForQC: ModelData.minHalfYearlyPriceForQC,
            minYearlyPriceForQC: ModelData.minYearlyPriceForQC,
            maxDiscountForQC: ModelData.maxDiscountForQC,
            organisationKeyID: ModelData.organisationKeyID,
            paymentFrequencyID: ModelData.paymentFrequencyID,
            enableMasterProposalType: ModelData.enableMasterProposalType,
            defaultProposalFormatID: ModelData.defaultProposalFormatID,
            remainingESignatures: ModelData.remainingESignatures,
          });
        }
      } else {
        SetPrevError(false);
        setErrorMessage(data?.data?.errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const GetServiceFeeInflationConfigData = async () => {
    if (!common.organisationKeyID || !common.userKeyID) {
      return;
    }
    try {
      const data = await GetServiceFeeInflationList({
        organisationKeyID: common.organisationKeyID,
        userKeyID: common.userKeyID,
      });
      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          const ListData = data?.data?.responseData?.data;
          console.log("ListData", ListData);
          setServiceFeeInflationConfig((prev) => ({
            ...prev,
            OrganisationKeyID: common.organisationKeyID,
            UserKeyID: common.userKeyID,
            ServiceFeeInflationList: ListData,

            // auto select configured services
            SelectedServices: [],
            HasExistingConfig: ListData.some(
              (s) => s.operator !== null && s.value !== null,
            ),
            // auto populate first rule
            InflationRule: {
              operator: null,
              value: null,
            },
          }));
        }
      } else {
        setServiceFeeInflationConfig({
          ...ServiceFeeInflationConfig,
          // IsLoading: false,
        });
        setErrorMessage(data?.data?.errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Submit Service Fee Inflation rules
  const SubmitServiceFeeInflation = async () => {
    setServiceFeeInflationConfig({
      ...ServiceFeeInflationConfig,
      SelectionError: "",
    });
    if (
      !ServiceFeeInflationConfig.SelectedServices ||
      ServiceFeeInflationConfig.SelectedServices.length === 0
    ) {
      setServiceFeeInflationConfig({
        ...ServiceFeeInflationConfig,
        SelectionError: "Please select one or more services to configure.",
      });
      return;
    }
    if (!ServiceFeeInflationConfig.InflationRule.operator) {
      setServiceFeeInflationConfig({
        ...ServiceFeeInflationConfig,
        SelectionError: "Please choose an operator.",
      });
      return;
    }
    if (
      ServiceFeeInflationConfig.InflationRule.operator &&
      ServiceFeeInflationConfig.InflationRule.value === null
    ) {
      setServiceFeeInflationConfig({
        ...ServiceFeeInflationConfig,
        SelectionError: "Please enter a value.",
      });
      return;
    }

    setLoader(true);
    try {
      const serviceIDs = ServiceFeeInflationConfig.SelectedServices.map(
        (s) => s.serviceID ?? s.serviceID ?? s.ServiceID,
      ).join(",");

      const apiParams = {
        organisationKeyID: common.organisationKeyID,
        userKeyID: common.userKeyID,
        operator: ServiceFeeInflationConfig.InflationRule.operator,
        value: ServiceFeeInflationConfig.InflationRule.value,
        serviceIDs: serviceIDs,
      };

      const response = await AddUpdateServiceFeeInflation(apiParams);
      setLoader(false);
      if (response?.data?.statusCode === 200) {
        setOpenSuccessModal(true);
        setIsAddUpdateActionDone(true);
        // refresh list
        GetServiceFeeInflationConfigData();
      } else {
        setFeeInflationErrorMessage(
          response?.data?.errorMessage ||
            response?.response?.data?.errorMessage,
        );
      }
    } catch (error) {
      setLoader(false);
      console.error(error);
    }
  };

  // Check for draft PL/ELs
  const HandleDeleteRuleClick = async (row) => {
    setLoader(true);
    let drafts = [];
    try {
      const res = await GetDraftsAffectedByFeeInflationBatch({
        organisationKeyID: common.organisationKeyID,
        userKeyID: common.userKeyID,
        batchID: row.batchID,
      });
      if (res?.data?.statusCode === 200) {
        drafts = res?.data?.responseData?.data || [];
      }
    } catch (error) {
      console.error(error);
    }
    setLoader(false);

    setModelRequestData({
      Action: "DeleteServiceFeeInflationRule",
      batchID: row.batchID,
      message:
        drafts.length > 0
          ? "Deleting this rule will change the pricing for the following draft records. Their prices will be recalculated the next time they are opened. Sent and accepted records are not affected."
          : "This will delete the Inflation rule. Are you sure?",
      ServiceName: drafts.map(
        (d) =>
          `${d.refID}${d.clientName ? " — " + d.clientName : ""} (${d.recordType})`,
      ),
    });

    $("#ConfirmModel").modal("show");
  };

  // Delete all Services and Configurations
  const DeleteServiceFeeInflationConfig = async () => {
    console.log("DeleteServiceFeeInflationConfig", modelRequestData);
    if (!common.organisationKeyID || !common.userKeyID) {
      return;
    }
    try {
      const data = await DeleteAllServiceFeeInflationConfiguration(
        common.organisationKeyID,
        common.userKeyID,
        modelRequestData.batchID,
      );
      if (data?.data?.statusCode === 200) {
        $("#ConfirmModel").one("hidden.bs.modal", () => {
          setIsAddUpdateActionDone(true);
          setOpenSuccessModal(true);
          GetServiceFeeInflationConfigData();
        });
        $("#ConfirmModel").modal("hide");
      } else {
        setFeeInflationErrorMessage(
          data?.data?.errorMessage || data?.response?.data?.errorMessage,
        );
      }
    } catch (error) {
      console.error(error);
      setLoader(false);
    }
  };
  // 2) Add Update Button Click Function
  const PricingSettingAddUpdateBtnClicked = () => {
    if (
      pricingSettingObj.maxDiscountForQC ==
        PrevPricingSettingObj.maxDiscountForQC &&
      pricingSettingObj.minMonthlyPriceForQC ==
        PrevPricingSettingObj.minMonthlyPriceForQC &&
      pricingSettingObj.minOneOffPriceForQC ==
        PrevPricingSettingObj.minOneOffPriceForQC &&
      pricingSettingObj.minQuarterlyPriceForQC ==
        PrevPricingSettingObj.minQuarterlyPriceForQC &&
      pricingSettingObj.minHalfYearlyPriceForQC ==
        PrevPricingSettingObj.minHalfYearlyPriceForQC &&
      pricingSettingObj.minYearlyPriceForQC ==
        PrevPricingSettingObj.minYearlyPriceForQC &&
      pricingSettingObj.paymentFrequencyID ==
        PrevPricingSettingObj.paymentFrequencyID &&
      pricingSettingObj.enableMasterProposalType ==
        PrevPricingSettingObj.enableMasterProposalType &&
      pricingSettingObj.defaultProposalFormatID ==
        PrevPricingSettingObj.defaultProposalFormatID
    ) {
      SetPrevError(true);
      return false;
    }

    // Validation Checks for Min. Reccuring prices
    const priceLadder = [
      {
        key: "minMonthlyPriceForQC",
        label: "Monthly",
        value: pricingSettingObj.minMonthlyPriceForQC,
      },
      {
        key: "minQuarterlyPriceForQC",
        label: "Quarterly",
        value: pricingSettingObj.minQuarterlyPriceForQC,
      },
      {
        key: "minHalfYearlyPriceForQC",
        label: "Half-Yearly",
        value: pricingSettingObj.minHalfYearlyPriceForQC,
      },
      {
        key: "minYearlyPriceForQC",
        label: "Yearly",
        value: pricingSettingObj.minYearlyPriceForQC,
      },
    ].filter(
      (x) =>
        x.value !== "" &&
        x.value !== null &&
        x.value !== undefined &&
        !isNaN(Number(x.value)),
    );

    let hasError = false;
    const newFieldErrors = {};

    for (let i = 1; i < priceLadder.length; i++) {
      if (Number(priceLadder[i].value) <= Number(priceLadder[i - 1].value)) {
        newFieldErrors[priceLadder[i].key] =
          `Must be higher than Min. ${priceLadder[i - 1].label} price.`;
        hasError = true;
      }
    }

    setFieldErrors(newFieldErrors);

    if (hasError) {
      SetPrevError(false);
      return false;
    }

    const ApiRequest_ParamsObj = {
      // global level params: fixed
      organisationKeyID: common.organisationKeyID,
      userKeyID: common.userKeyID,
      // form level params: fixed
      minOneOffPriceForQC: pricingSettingObj.minOneOffPriceForQC || null,
      minMonthlyPriceForQC: pricingSettingObj.minMonthlyPriceForQC || null,
      minQuarterlyPriceForQC: pricingSettingObj.minQuarterlyPriceForQC || null,
      minHalfYearlyPriceForQC:
        pricingSettingObj.minHalfYearlyPriceForQC || null,
      minYearlyPriceForQC: pricingSettingObj.minYearlyPriceForQC || null,
      maxDiscountForQC: pricingSettingObj.maxDiscountForQC || null,
      paymentFrequencyID: pricingSettingObj.paymentFrequencyID || null,
      enableMasterProposalType:
        pricingSettingObj.enableMasterProposalType || false,
      defaultProposalFormatID: pricingSettingObj.defaultProposalFormatID,
    };

    setFieldErrors({});
    setErrorMessage("");
    AddUpdatePricingSettingData(ApiRequest_ParamsObj);
  };

  // Add or Update Pricing Setting Data
  const AddUpdatePricingSettingData = async (apiRequestParams) => {
    setLoader(true);
    try {
      let url = "/AddUpdatePricingSettings"; // Default URL for Adding Data
      if (apiRequestParams.Action === "Update") {
        url = `/AddUpdatePricingSettings?Action=${apiRequestParams.Action}`; // URL for Updating Data
      }
      const response = await AddUpdatePricingSetting(url, apiRequestParams);
      if (response) {
        setLoader(false);
        if (response?.data?.statusCode === 200) {
          if (apiRequestParams.Action === "Update") {
            setOpenSuccessModal(true);
            setIsAddUpdateActionDone(true);
            GetPricingSettingModelData(common.organisationKeyID);
          } else {
            setOpenSuccessModal(true);
            setIsAddUpdateActionDone(true);
            GetPricingSettingModelData(common.organisationKeyID);
          }
        } else {
          setErrorMessage(response?.response?.data?.errorMessage);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const TabHandle = async (tab) => {
    if (tab === "PricingSetting") {
      setActiveTab(tab);
      if (common.organisationKeyID !== null) {
        GetPricingSettingModelData(common.organisationKeyID);
      }
      setServiceFeeInflationConfig({
        ServiceFeeInflationList: [],
        HasExistingConfig: false,
        SelectionError: "",
        SelectedServices: [],
        InflationRule: {
          operator: null,
          value: null,
        },
      });
    } else if (tab === "FeeInflation") {
      try {
        const data = await GetServiceFeeInflationConfigData(
          common.organisationKeyID,
        );
      } catch (error) {
        setLoader(false);
        console.log(error);
        setErrorMessage(true);
      }
    }
  };

  // handle Function
  const handleClose = () => {
    $("#" + "confirm").modal("hide");
    setOpenSuccessModal(false);
  };
  const handlePaymentFrequencyChange = (selectedOption) => {
    setSelectedFrequency(selectedOption);
    setPricingSettingObj((prevState) => ({
      ...prevState,
      paymentFrequencyID: selectedOption.value,
    }));
  };

  //Design part :
  return (
    <div className="pricing-settings-redesign">
      <main className="pricing-settings-page">
        {/* =========================
            PAGE HEADER
            ========================= */}
        <header className="pricing-settings-page-header">
          <div>
            <h1 className="pricing-settings-page-title">Pricing Setting</h1>
            <p className="pricing-settings-page-subtitle">
              Configure pricing limits, default settings and service fee
              inflation.
            </p>
          </div>
        </header>

        {/* =========================
            TABS
            ========================= */}
        <div className="pricing-settings-tabs-wrap">
          <ul className="nav nav-tabs pricing-settings-tabs" role="tablist">
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${
                  activeTab === "PricingSetting" ? "active" : ""
                }`}
                role="tab"
                aria-selected={activeTab === "PricingSetting"}
                onClick={() => {
                  setActiveTab("PricingSetting");
                  TabHandle("PricingSetting");
                }}
              >
                Pricing Setting
              </button>
            </li>

            {common.organisationKeyID !== null && (
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link ${
                    activeTab === "FeeInflation" ? "active" : ""
                  }`}
                  role="tab"
                  aria-selected={activeTab === "FeeInflation"}
                  onClick={() => {
                    setActiveTab("FeeInflation");
                    TabHandle("FeeInflation");
                  }}
                >
                  Service Fee Inflation
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* =========================================================
            PRICING SETTING TAB
            ========================================================= */}
        {activeTab === "PricingSetting" && (
          <section className="pricing-settings-card pricing-settings-main-card">
            <div className="pricing-settings-main-grid">
              {/* LEFT COLUMN */}
              <div className="pricing-settings-column pricing-settings-column--limits">
                {/* <div className="pricing-settings-section-head">
                  <span className="pricing-settings-section-title">
                    Pricing Limits
                  </span>

                  <span className="pricing-settings-section-meta">
                    Currency: {common.currency || ""} ({currencySymbol})
                  </span>
                </div> */}

                <div className="pricing-settings-fields">
                  <div className="pricing-settings-field">
                    <label>
                      Min. One-Off Price for {proposalName}/{EngagementName}
                    </label>

                    <div className="pricing-settings-input-wrap">
                      <span className="pricing-settings-input-prefix">
                        {currencySymbol}
                      </span>

                      <input
                        className="input-text pricing-settings-input pricing-settings-input--prefix"
                        type="text"
                        placeholder="0.00"
                        value={pricingSettingObj.minOneOffPriceForQC
                          ?.toString()
                          ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        onChange={(e) => {
                          SetPrevError(false);
                          const sanitizedInput = e.target.value
                            .replace(/[^0-9.]/g, "")
                            .slice(0, 16);

                          const [integerPart, decimalPart] =
                            sanitizedInput.split(".");

                          const formattedInput =
                            decimalPart !== undefined
                              ? `${integerPart.slice(
                                  0,
                                  12,
                                )}.${decimalPart.slice(0, 2)}`
                              : `${integerPart.slice(0, 12)}`;

                          setRequireErrorMessage(false);
                          setPricingSettingObj({
                            ...pricingSettingObj,
                            minOneOffPriceForQC: formattedInput,
                          });
                        }}
                      />
                    </div>
                  </div>

                  <div className="pricing-settings-field">
                    <label>
                      Min. Monthly Price for {proposalName}/{EngagementName}
                    </label>

                    <div className="pricing-settings-input-wrap">
                      <span className="pricing-settings-input-prefix">
                        {currencySymbol}
                      </span>

                      <input
                        className="input-text pricing-settings-input pricing-settings-input--prefix"
                        type="text"
                        placeholder="0.00"
                        value={pricingSettingObj.minMonthlyPriceForQC
                          ?.toString()
                          ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        onChange={(e) => {
                          SetPrevError(false);
                          const sanitizedInput = e.target.value
                            .replace(/[^0-9.]/g, "")
                            .slice(0, 16);

                          const [integerPart, decimalPart] =
                            sanitizedInput.split(".");

                          const formattedInput =
                            decimalPart !== undefined
                              ? `${integerPart.slice(
                                  0,
                                  12,
                                )}.${decimalPart.slice(0, 2)}`
                              : integerPart.slice(0, 12);

                          setFieldErrors((prev) => ({
                            ...prev,
                            minMonthlyPriceForQC: "",
                          }));
                          setRequireErrorMessage(false);
                          setPricingSettingObj({
                            ...pricingSettingObj,
                            minMonthlyPriceForQC: formattedInput,
                          });
                        }}
                      />
                    </div>

                    {fieldErrors.minMonthlyPriceForQC && (
                      <label className="validation pricing-settings-validation">
                        {fieldErrors.minMonthlyPriceForQC}
                      </label>
                    )}
                  </div>

                  <div className="pricing-settings-field">
                    <label>
                      Min. Quarterly Price for {proposalName}/{EngagementName}
                    </label>

                    <div className="pricing-settings-input-wrap">
                      <span className="pricing-settings-input-prefix">
                        {currencySymbol}
                      </span>

                      <input
                        className="input-text pricing-settings-input pricing-settings-input--prefix"
                        type="text"
                        placeholder="0.00"
                        value={pricingSettingObj.minQuarterlyPriceForQC
                          ?.toString()
                          ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        onChange={(e) => {
                          SetPrevError(false);
                          const sanitizedInput = e.target.value
                            .replace(/[^0-9.]/g, "")
                            .slice(0, 16);

                          const [integerPart, decimalPart] =
                            sanitizedInput.split(".");

                          const formattedInput =
                            decimalPart !== undefined
                              ? `${integerPart.slice(
                                  0,
                                  12,
                                )}.${decimalPart.slice(0, 2)}`
                              : integerPart.slice(0, 12);

                          setFieldErrors((prev) => ({
                            ...prev,
                            minQuarterlyPriceForQC: "",
                          }));
                          setRequireErrorMessage(false);
                          setPricingSettingObj({
                            ...pricingSettingObj,
                            minQuarterlyPriceForQC: formattedInput,
                          });
                        }}
                      />
                    </div>

                    {fieldErrors.minQuarterlyPriceForQC && (
                      <label className="validation pricing-settings-validation">
                        {fieldErrors.minQuarterlyPriceForQC}
                      </label>
                    )}
                  </div>

                  <div className="pricing-settings-field">
                    <label>
                      Min. Half-Yearly Price for {proposalName}/{EngagementName}
                    </label>

                    <div className="pricing-settings-input-wrap">
                      <span className="pricing-settings-input-prefix">
                        {currencySymbol}
                      </span>

                      <input
                        className="input-text pricing-settings-input pricing-settings-input--prefix"
                        type="text"
                        placeholder="0.00"
                        value={pricingSettingObj.minHalfYearlyPriceForQC
                          ?.toString()
                          ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        onChange={(e) => {
                          SetPrevError(false);
                          const sanitizedInput = e.target.value
                            .replace(/[^0-9.]/g, "")
                            .slice(0, 16);

                          const [integerPart, decimalPart] =
                            sanitizedInput.split(".");

                          const formattedInput =
                            decimalPart !== undefined
                              ? `${integerPart.slice(
                                  0,
                                  12,
                                )}.${decimalPart.slice(0, 2)}`
                              : integerPart.slice(0, 12);

                          setFieldErrors((prev) => ({
                            ...prev,
                            minHalfYearlyPriceForQC: "",
                          }));
                          setRequireErrorMessage(false);
                          setPricingSettingObj({
                            ...pricingSettingObj,
                            minHalfYearlyPriceForQC: formattedInput,
                          });
                        }}
                      />
                    </div>

                    {fieldErrors.minHalfYearlyPriceForQC && (
                      <label className="validation pricing-settings-validation">
                        {fieldErrors.minHalfYearlyPriceForQC}
                      </label>
                    )}
                  </div>

                  <div className="pricing-settings-field">
                    <label>
                      Min. Yearly Price for {proposalName}/{EngagementName}
                    </label>

                    <div className="pricing-settings-input-wrap">
                      <span className="pricing-settings-input-prefix">
                        {currencySymbol}
                      </span>

                      <input
                        className="input-text pricing-settings-input pricing-settings-input--prefix"
                        type="text"
                        placeholder="0.00"
                        value={pricingSettingObj.minYearlyPriceForQC
                          ?.toString()
                          ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        onChange={(e) => {
                          SetPrevError(false);
                          const sanitizedInput = e.target.value
                            .replace(/[^0-9.]/g, "")
                            .slice(0, 16);

                          const [integerPart, decimalPart] =
                            sanitizedInput.split(".");

                          const formattedInput =
                            decimalPart !== undefined
                              ? `${integerPart.slice(
                                  0,
                                  12,
                                )}.${decimalPart.slice(0, 2)}`
                              : integerPart.slice(0, 12);

                          setFieldErrors((prev) => ({
                            ...prev,
                            minYearlyPriceForQC: "",
                          }));
                          setRequireErrorMessage(false);
                          setPricingSettingObj({
                            ...pricingSettingObj,
                            minYearlyPriceForQC: formattedInput,
                          });
                        }}
                      />
                    </div>

                    {fieldErrors.minYearlyPriceForQC && (
                      <label className="validation pricing-settings-validation">
                        {fieldErrors.minYearlyPriceForQC}
                      </label>
                    )}
                  </div>
                </div>

                <div className="pricing-settings-toggle-row">
                  <div>
                    <strong>Enable {masterProposalType}</strong>
                    <span>
                      Allow staff to use this master proposal type where
                      available.
                    </span>
                  </div>

                  <label className="pricing-settings-switch">
                    <input
                      type="checkbox"
                      checked={pricingSettingObj.enableMasterProposalType}
                      onChange={(e) => {
                        setPricingSettingObj({
                          ...pricingSettingObj,
                          enableMasterProposalType: e.target.checked,
                        });
                      }}
                    />
                    <span></span>
                  </label>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="pricing-settings-column pricing-settings-column--defaults">
                {/* <div className="pricing-settings-section-head">
                  <span className="pricing-settings-section-title">
                    Defaults &amp; Discount
                  </span>

                  <span className="pricing-settings-section-meta">
                    System Defaults
                  </span>
                </div> */}

                <div className="pricing-settings-field pricing-settings-field--discount">
                  <label>
                    Max. Discount (%) for {proposalName}/{EngagementName}
                  </label>

                  <div className="pricing-settings-input-wrap">
                    <input
                      className="input-text pricing-settings-input pricing-settings-input--suffix"
                      digitOnly={true}
                      type="text"
                      pattern="\d{0,3}(\.\d{0,2})?"
                      placeholder="0"
                      maxLength={6}
                      value={pricingSettingObj.maxDiscountForQC}
                      onChange={(e) => {
                        const inputValue = e.target.value.replace(
                          /[^0-9.]/g,
                          "",
                        );

                        const isValidPercentage =
                          /^\d{0,3}(\.\d{0,2})?$/.test(inputValue) &&
                          inputValue <= 100;

                        if (isValidPercentage || inputValue === "") {
                          setPricingSettingObj({
                            ...pricingSettingObj,
                            maxDiscountForQC: inputValue,
                          });
                        } else {
                          setPricingSettingObj({
                            ...pricingSettingObj,
                            maxDiscountForQC:
                              pricingSettingObj.maxDiscountForQC,
                          });
                        }
                      }}
                    />

                    <span className="pricing-settings-input-suffix">%</span>
                  </div>

                  <small className="pricing-settings-help">
                    Set the maximum discount allowed for generated proposals.
                  </small>
                </div>

                <div className="pricing-settings-field">
                  <label>Default Payment Frequency</label>

                  <Select
                    className="pricing-settings-select"
                    classNamePrefix="pricing-select"
                    value={selectedFrequency}
                    onChange={handlePaymentFrequencyChange}
                    options={Utils.Payment_Frequency}
                  />
                </div>

                <div className="pricing-settings-field">
                  <label>Default Proposal Format</label>

                  <Select
                    className="pricing-settings-select"
                    classNamePrefix="pricing-select"
                    options={getProposalFormatOptions()}
                    value={Utils.PreviewSelection.find(
                      (x) =>
                        x.value === pricingSettingObj.defaultProposalFormatID,
                    )}
                    onChange={(selectedOption) => {
                      setPricingSettingObj({
                        ...pricingSettingObj,
                        defaultProposalFormatID: selectedOption.value,
                      });
                    }}
                  />
                </div>

                {/* <div className="pricing-settings-info-panel">
                  <span className="pricing-settings-info-panel-icon">
                    <i className="ri-shield-check-line"></i>
                  </span>

                  <div>
                    <strong>Threshold Guardrails</strong>
                    <p>
                      Minimum prices and discount limits help keep proposal
                      pricing consistent across the practice.
                    </p>
                  </div>
                </div> */}
              </div>
            </div>

            {(prevError || errorMessage) && (
              <div className="pricing-settings-errors">
                {prevError && (
                  <label className="validation">
                    You haven't changed any value
                  </label>
                )}

                {errorMessage && (
                  <label className="validation">{errorMessage}</label>
                )}
              </div>
            )}

            {userAccessData.Admin_Setting_Practice_Config_CanEdit && (
              <div className="pricing-settings-card-footer">
                <button
                  type="button"
                  className="btn btn-primary create-item-btn pricing-settings-submit-btn"
                  onClick={() => {
                    PricingSettingAddUpdateBtnClicked();
                  }}
                >
                  <i className="ri-check-line"></i>
                  <span>Submit</span>
                </button>
              </div>
            )}
          </section>
        )}

        {/* =========================================================
            SERVICE FEE INFLATION TAB
            ========================================================= */}
        {activeTab === "FeeInflation" && (
          <section className="pricing-settings-card fee-inflation-card">
            <SAPredefinedChangesNotifyMessageModel
              Params={{
                SAChanges:
                  ServiceFeeInflationConfig.ServiceFeeInflationList.some(
                    (s) => s.notifySAChanges,
                  ),
              }}
            />

            <div className="fee-inflation-intro">
              <h2>
                Configure a price adjustment rule for one or more services.
              </h2>
              <p>
                Select the services you want to apply an inflation rule to, then
                choose an operator and value.
              </p>
            </div>

            {/* Target Services */}
            <section className="fee-inflation-section">
              <div className="fee-inflation-section-head">
                <span>Target Services</span>
              </div>

              <Select
                isMulti
                className="fee-inflation-select"
                classNamePrefix="fee-inflation-select"
                options={[
                  ...(!allServicesSelected
                    ? [
                        {
                          value: "ALL",
                          label: "All",
                          isAll: true,
                        },
                      ]
                    : []),

                  ...availableServices.map((s) => ({
                    value: s.serviceID,
                    label: s.serviceName,
                    isConfigured: s.operator !== null && s.value !== null,
                    data: s,
                  })),
                ]}
                value={ServiceFeeInflationConfig.SelectedServices.map((s) => ({
                  value: s.serviceID,
                  label: s.serviceName,
                  isConfigured: s.operator !== null && s.value !== null,
                  data: s,
                }))}
                onChange={(selected) => {
                  const clickedAll = selected?.some((s) => s.isAll);

                  const selectedServices = clickedAll
                    ? availableServices
                    : selected
                      ? selected.map((s) => s.data)
                      : [];

                  setServiceFeeInflationConfig((prev) => ({
                    ...prev,
                    SelectedServices: selectedServices,
                    SelectionError: "",
                    InflationRule:
                      selectedServices.length > 0
                        ? prev.InflationRule
                        : {
                            operator: null,
                            value: null,
                          },
                  }));
                }}
                formatOptionLabel={(option) => (
                  <div className="fee-inflation-option">
                    <span>{option.label}</span>

                    {option.isConfigured && (
                      <span className="fee-inflation-configured-badge">
                        Configured
                      </span>
                    )}
                  </div>
                )}
                isClearable
                placeholder="Search and select services..."
              />

              <div className="fee-inflation-selection-meta">
                <span>
                  {ServiceFeeInflationConfig.SelectedServices.length}{" "}
                  {ServiceFeeInflationConfig.SelectedServices.length === 1
                    ? "service"
                    : "services"}{" "}
                  currently selected.
                </span>

                {ServiceFeeInflationConfig.SelectedServices.length === 0 &&
                  ServiceFeeInflationConfig.SelectionError && (
                    <label className="validation">
                      {ServiceFeeInflationConfig.SelectionError}
                    </label>
                  )}
              </div>
            </section>

            {/* Inflation Config */}
            {ServiceFeeInflationConfig.SelectedServices.length > 0 && (
              <section className="fee-inflation-section">
                <div className="fee-inflation-section-head">
                  <span>Inflation Configuration</span>
                  <small>
                    Choose how the rule should adjust the selected service fees.
                  </small>
                </div>

                <div className="fee-inflation-operator-grid">
                  {[
                    {
                      symbol: "+",
                      label: "Fixed Add",
                      description: "Flat fee addition",
                    },
                    {
                      symbol: "-",
                      label: "Fixed Deduct",
                      description: "Flat fee reduction",
                    },
                    {
                      symbol: "*",
                      label: "Markup (%)",
                      description: "Percentage rate increase",
                    },
                    {
                      symbol: "/",
                      label: "Discount (%)",
                      description: "Percentage fee reduction",
                    },
                  ].map((op) => {
                    const isActive =
                      ServiceFeeInflationConfig.InflationRule.operator ===
                      op.symbol;

                    return (
                      <button
                        key={op.symbol}
                        type="button"
                        className={`fee-inflation-operator ${
                          isActive ? "is-active" : ""
                        }`}
                        onClick={() =>
                          setServiceFeeInflationConfig({
                            ...ServiceFeeInflationConfig,
                            InflationRule: {
                              ...ServiceFeeInflationConfig.InflationRule,
                              operator: op.symbol,
                              value: null,
                            },
                            SelectionError: "",
                          })
                        }
                      >
                        <div className="fee-inflation-operator-top">
                          <span className="fee-inflation-operator-symbol">
                            {op.symbol}
                          </span>

                          {isActive && (
                            <span className="fee-inflation-active-badge">
                              Active
                            </span>
                          )}
                        </div>

                        <strong>{op.label}</strong>
                        <span>{op.description}</span>
                      </button>
                    );
                  })}
                </div>

                {!ServiceFeeInflationConfig.InflationRule.operator &&
                  ServiceFeeInflationConfig.SelectionError && (
                    <label className="validation">
                      {ServiceFeeInflationConfig.SelectionError}
                    </label>
                  )}

                {ServiceFeeInflationConfig.InflationRule.operator && (
                  <div className="fee-inflation-value-grid">
                    <div className="fee-inflation-value-field">
                      <label>
                        {ServiceFeeInflationConfig.InflationRule.operator ===
                          "+" ||
                        ServiceFeeInflationConfig.InflationRule.operator === "-"
                          ? `Amount (${currencySymbol})`
                          : "Inflation Rate / Markup Percentage"}
                      </label>

                      <div className="pricing-settings-input-wrap">
                        {(ServiceFeeInflationConfig.InflationRule.operator ===
                          "+" ||
                          ServiceFeeInflationConfig.InflationRule.operator ===
                            "-") && (
                          <span className="pricing-settings-input-prefix">
                            {currencySymbol}
                          </span>
                        )}

                        <input
                          type="text"
                          inputMode="decimal"
                          className={`form-control pricing-settings-input ${
                            ServiceFeeInflationConfig.InflationRule.operator ===
                              "+" ||
                            ServiceFeeInflationConfig.InflationRule.operator ===
                              "-"
                              ? "pricing-settings-input--prefix"
                              : "pricing-settings-input--suffix"
                          }`}
                          placeholder={
                            ServiceFeeInflationConfig.InflationRule.operator ===
                              "+" ||
                            ServiceFeeInflationConfig.InflationRule.operator ===
                              "-"
                              ? "Enter flat amount"
                              : "Enter percentage e.g. 10"
                          }
                          value={
                            ServiceFeeInflationConfig.InflationRule.value ?? ""
                          }
                          onChange={(e) => {
                            const value = e.target.value;

                            if (value === "") {
                              setServiceFeeInflationConfig({
                                ...ServiceFeeInflationConfig,
                                InflationRule: {
                                  ...ServiceFeeInflationConfig.InflationRule,
                                  value: null,
                                },
                              });
                              return;
                            }

                            if (!/^[1-9][0-9]*$/.test(value)) {
                              return;
                            }

                            const maxValue =
                              ServiceFeeInflationConfig.InflationRule
                                .operator === "+" ||
                              ServiceFeeInflationConfig.InflationRule
                                .operator === "-"
                                ? 9999
                                : 100;

                            if (parseInt(value, 10) > maxValue) {
                              return;
                            }

                            setServiceFeeInflationConfig({
                              ...ServiceFeeInflationConfig,
                              InflationRule: {
                                ...ServiceFeeInflationConfig.InflationRule,
                                value,
                                SelectionError: "",
                              },
                            });
                          }}
                        />

                        {(ServiceFeeInflationConfig.InflationRule.operator ===
                          "*" ||
                          ServiceFeeInflationConfig.InflationRule.operator ===
                            "/") && (
                          <span className="pricing-settings-input-suffix">
                            %
                          </span>
                        )}
                      </div>

                      {ServiceFeeInflationConfig.InflationRule.value > 0 && (
                        <small className="fee-inflation-formula">
                          {ServiceFeeInflationConfig.InflationRule.operator ===
                            "+" &&
                            `Price + ${ServiceFeeInflationConfig.InflationRule.value}`}
                          {ServiceFeeInflationConfig.InflationRule.operator ===
                            "-" &&
                            `Price − ${ServiceFeeInflationConfig.InflationRule.value}`}
                          {ServiceFeeInflationConfig.InflationRule.operator ===
                            "*" &&
                            `Price × ${(1 + ServiceFeeInflationConfig.InflationRule.value / 100).toFixed(2)}`}
                          {ServiceFeeInflationConfig.InflationRule.operator ===
                            "/" &&
                            `Price × ${(1 - ServiceFeeInflationConfig.InflationRule.value / 100).toFixed(2)}`}
                        </small>
                      )}

                      {ServiceFeeInflationConfig.InflationRule.operator &&
                        ServiceFeeInflationConfig.InflationRule.value ===
                          null &&
                        ServiceFeeInflationConfig.SelectionError && (
                          <label className="validation">
                            {ServiceFeeInflationConfig.SelectionError}
                          </label>
                        )}
                    </div>

                    <div className="fee-inflation-preview-card">
                      <span className="fee-inflation-preview-icon">
                        <i className="ri-magic-line"></i>
                      </span>

                      <div>
                        <strong>Rule Preview</strong>
                        <p>
                          The selected adjustment will be applied to the chosen
                          services when this configuration is saved.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )}

            {userAccessData.Admin_Setting_Practice_Config_CanEdit && (
              <div className="fee-inflation-save-row">
                <button
                  type="button"
                  className="btn btn-primary create-item-btn fee-inflation-save-btn"
                  onClick={() => SubmitServiceFeeInflation()}
                >
                  <i className="ri-check-line"></i>
                  <span>Save Inflation Rule</span>
                </button>
              </div>
            )}

            {/* Configured Rules Table */}
            {(() => {
              const configured =
                ServiceFeeInflationConfig.ServiceFeeInflationList.filter(
                  (s) => s.operator !== null && s.value !== null,
                );

              if (configured.length === 0) return null;

              const grouped = configured.reduce((acc, s) => {
                const key = s.batchID;

                if (!acc[key]) {
                  acc[key] = {
                    operator: s.operator,
                    value: s.value,
                    batchID: s.batchID,
                    isPredefined: s.isPredefined,
                    notifySAChanges: false,
                    services: [],
                  };
                }

                if (s.notifySAChanges) {
                  acc[key].notifySAChanges = true;
                }

                acc[key].services.push({
                  serviceID: s.serviceID,
                  serviceName: s.serviceName,
                });

                return acc;
              }, {});

              const rows = Object.values(grouped);

              const operatorLabel = (op, val) => {
                if (op === "+") return `+ ${val} (flat add)`;
                if (op === "-") return `− ${val} (flat subtract)`;
                if (op === "*")
                  return `× ${(1 + val / 100).toFixed(2)} (${val}% markup)`;
                if (op === "/")
                  return `× ${(1 - val / 100).toFixed(2)} (${val}% discount)`;
                return `${op} ${val}`;
              };

              return (
                <section className="fee-inflation-rules-section">
                  <div className="fee-inflation-rules-head">
                    <div>
                      <h3>Configured Inflation Rules</h3>
                      <p>Review saved rules and manage Super Admin changes.</p>
                    </div>
                  </div>

                  <div className="fee-inflation-table-wrap">
                    <table className="fee-inflation-table">
                      <thead>
                        <tr>
                          <th>Inflation Rule</th>
                          <th>Services</th>

                          {userAccessData.Admin_Setting_Practice_Config_CanEdit && (
                            <th className="text-center">Action</th>
                          )}
                        </tr>
                      </thead>

                      <tbody>
                        {rows.map((row) => (
                          <tr key={row.batchID}>
                            <td>
                              <code className="fee-inflation-rule-code">
                                {operatorLabel(row.operator, row.value)}
                              </code>

                              {row.notifySAChanges && (
                                <span className="fee-inflation-warning-badge">
                                  Removed by Superadmin
                                </span>
                              )}
                            </td>

                            <td>
                              <div className="fee-inflation-service-badges">
                                {row.services.map((svc) => (
                                  <span
                                    key={svc.serviceID}
                                    className="fee-inflation-service-badge"
                                  >
                                    {svc.serviceName}
                                  </span>
                                ))}
                              </div>
                            </td>

                            {userAccessData.Admin_Setting_Practice_Config_CanEdit && (
                              <td className="text-center">
                                {row.notifySAChanges ? (
                                  <div className="fee-inflation-row-actions">
                                    <button
                                      className="btn btn-success btn-sm"
                                      onClick={() => {
                                        setSAConfirmStatus(true);
                                        setSAConfirmBatchID(row.batchID);
                                        $("#" + "ConfirmSAChangesModel").modal(
                                          "show",
                                        );
                                      }}
                                    >
                                      Accept &amp; Remove
                                    </button>

                                    <button
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={() => {
                                        setSAConfirmStatus(false);
                                        setSAConfirmBatchID(row.batchID);
                                        $("#" + "ConfirmSAChangesModel").modal(
                                          "show",
                                        );
                                      }}
                                    >
                                      Decline &amp; Keep Anyway
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    className="btn btn-danger btn-sm fee-inflation-delete-btn"
                                    onClick={() => HandleDeleteRuleClick(row)}
                                  >
                                    <i className="ri-delete-bin-line"></i>
                                    <span>Delete</span>
                                  </button>
                                )}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              );
            })()}

            <ConfirmSAChangesModel
              ModelId={null}
              Status={SAConfirmStatus}
              modelRequestData={{ Action: "Update" }}
              openSuccessModal={false}
              openErrorModal={false}
              UpdatedChanges={async () => {
                $("#" + "ConfirmSAChangesModel").modal("hide");
                setLoader(true);

                try {
                  const apiCall = SAConfirmStatus
                    ? AcceptServiceFeeInflationSAChanges
                    : DeclineServiceFeeInflation;

                  const response = await apiCall({
                    organisationKeyID: common.organisationKeyID,
                    userKeyID: common.userKeyID,
                    batchID: SAConfirmBatchID,
                  });

                  if (response?.data?.statusCode === 200) {
                    GetServiceFeeInflationConfigData();
                  } else {
                    setErrorMessage(
                      response?.data?.errorMessage ||
                        "Unable to process this action.",
                    );
                  }
                } catch (error) {
                  console.error(error);
                  setErrorMessage("Unable to process this action.");
                } finally {
                  setLoader(false);
                }
              }}
            />
          </section>
        )}
      </main>

      <div className="pricing-settings-footer-wrap">
        <Footer />
      </div>

      <button className="btn btn-danger btn-icon" id="back-to-top">
        <i className="ri-arrow-up-line"></i>
      </button>

      <ConfirmModel
        openSuccessModal={openSuccessModal}
        modelRequestData={modelRequestData}
        setModelRequestData={setModelRequestData}
        UpdatedStatus={
          modelRequestData.Action === "DeleteServiceFeeInflationRule"
            ? DeleteServiceFeeInflationConfig
            : null
        }
      />

      <SuccessModal
        handleClose={handleClose}
        setDismissModal={setDismissModal}
        setOpenSuccessModal={setOpenSuccessModal}
        openSuccessModal={openSuccessModal}
        modelAction={"Update"}
        message={
          activeTab === "FeeInflation"
            ? "Service Fee Inflation "
            : "Pricing Settings"
        }
      />
    </div>
  );
};

export default Pricing_Settings;
