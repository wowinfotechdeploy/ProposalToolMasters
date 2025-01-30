/* global $ */
import React, { useState, useRef, useContext } from "react";
import "./PricingSettingStyle.css";
import { useEffect } from "react";
import {
  AddUpdatePricingSetting,
  GetPricingSettingModel,
} from "../../../redux/Services/Setting/PricingSettingApi";
import { useSelector } from "react-redux";
import SuccessModal from "../../../components/SuccessModal";
import { AuthContextProvider } from "../../../AuthContext/AuthContext";
import Footer from "../../../components/Footer";
import Select from "react-select";
import Utils from "../../../Middleware/Utils";

const Pricing_Settings = () => {
  // A] States Declaration :
  const [requireErrorMessage, setRequireErrorMessage] = useState(false);
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [dismissModal, setDismissModal] = useState(null);
  const [prevError, SetPrevError] = useState("");
  const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState(Utils.Payment_Frequency[0]);
  const [pricingSettingObj, setPricingSettingObj] = useState({
    userKeyID: null,
    minOneOffPriceForQC: "",
    minMonthlyPriceForQC: "",
    maxDiscountForQC: null,
    paymentFrequencyID:null
  });
// const ProposalObject = {
  //   Payment_Frequency: 2 // Example initial value, adjust as needed
  // };

  useEffect(() => {
    if (pricingSettingObj.paymentFrequencyID !== null) {
      const foundFrequency = Utils.Payment_Frequency.find(
        (item) => item.value === pricingSettingObj.paymentFrequencyID
      );
      setSelectedFrequency(foundFrequency);
    }
  }, [pricingSettingObj.paymentFrequencyID]);
  const [PrevPricingSettingObj, setPrevPricingSettingObj] = useState({
    userKeyID: null,
    minOneOffPriceForQC: "",
    minMonthlyPriceForQC: "",
    maxDiscountForQC: "",
    paymentFrequencyID:null
  });
  const [errorMessage, setErrorMessage] = useState("");
  const {
    setLoader,
    setTopbar,
    proposalName,
    EngagementName,
    staticCurrencySymbols,
    userAccessData,
  } = useContext(AuthContextProvider);
  const common = useSelector((state) => state.Storage); //Getting Logged Users Details From Persist Storage of redux hooks
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
            maxDiscountForQC: ModelData.maxDiscountForQC,
            organisationKeyID: ModelData.organisationKeyID,
            paymentFrequencyID: ModelData.paymentFrequencyID,
          });
          setPrevPricingSettingObj({
            ...pricingSettingObj,
            userKeyID: common.userKeyID,
            minOneOffPriceForQC: ModelData.minOneOffPriceForQC,
            minMonthlyPriceForQC: ModelData.minMonthlyPriceForQC,
            maxDiscountForQC: ModelData.maxDiscountForQC,
            organisationKeyID: ModelData.organisationKeyID,
            paymentFrequencyID: ModelData.paymentFrequencyID,
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
  // 2) Add Update Button Click Function
  const PricingSettingAddUpdateBtnClicked = () => {
    if (
      pricingSettingObj.maxDiscountForQC ==
        PrevPricingSettingObj.maxDiscountForQC &&
      pricingSettingObj.minMonthlyPriceForQC ==
        PrevPricingSettingObj.minMonthlyPriceForQC &&
      pricingSettingObj.minOneOffPriceForQC ==
        PrevPricingSettingObj.minOneOffPriceForQC &&
      pricingSettingObj.paymentFrequencyID ==
        PrevPricingSettingObj.paymentFrequencyID
        
    ) {
      SetPrevError(true);
      return false;
    }

    const ApiRequest_ParamsObj = {
      // global level params: fixed
      organisationKeyID: common.organisationKeyID,
      userKeyID: common.userKeyID,
      // form level params: fixed
      minOneOffPriceForQC: pricingSettingObj.minOneOffPriceForQC || null,
      minMonthlyPriceForQC: pricingSettingObj.minMonthlyPriceForQC || null,
      maxDiscountForQC: pricingSettingObj.maxDiscountForQC || null,
      paymentFrequencyID: pricingSettingObj.paymentFrequencyID || null,
    };

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

  // handle Function
  const handleClose = () => {
    $("#" + "confirm").modal("hide");
    setOpenSuccessModal(false);
  };
  const handlePaymentFrequencyChange = (selectedOption) => {
    setSelectedFrequency(selectedOption);
    setPricingSettingObj((prevState) => ({
      ...prevState,
      paymentFrequencyID: selectedOption.value
    }));
  };


  //Design part :
  return (
    <div>
      <div class="main-content">
        <div class="page-content page-background">
          <div class="page-info-header page-info-strip">
            <div class="container">
              <div class="page-title-cls">Pricing Settings</div>
            </div>
          </div>
          <div class="container">
            <div class="row">
              <div class="col-12 pricing_settings Pricing-container-card" >
                <div class="card">
                  <div class="card-body bg-white">
                    <div className="row">
                      {/* Left side */}
                      <div class="col-lg-6 col-md-6 col-sm-12">
                        <div class="row fieldset">
                          <div class="fieldset  col-md-6 col-sm-12">
                            <label class="fieldset-label table-content-font ">
                              Min. One-Off Price for {proposalName}/
                              {EngagementName} (£)
                            </label>
                          </div>
                          <div class="col-lg-12 col-md-12 col-sm-12 fieldset">
                            <input
                              className="input-text table-content-font"
                              type="text"
                              placeholder="Enter Min. One-Off Price"
                              value={pricingSettingObj.minOneOffPriceForQC
                                ?.toString()
                                ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                              onChange={(e) => {
                                SetPrevError(false);
                                // Ensure that the input only contains numeric characters
                                const sanitizedInput = e.target.value
                                  .replace(/[^0-9.]/g, "") // Allow only numeric and dot characters
                                  .slice(0, 16); // Limit to 7 characters (5 digits + 1 dot + 1 decimal)

                                // Split the input into integer and decimal parts
                                const [integerPart, decimalPart] =
                                  sanitizedInput.split(".");

                                // Combine integer and decimal parts with appropriate precision
                                const formattedInput =
                                  decimalPart !== undefined
                                    ? `${integerPart.slice(
                                        0,
                                        12
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
                          
                          <div class="fieldset col-12 col-md-12 col-sm-12">
                            <label class="fieldset-label table-content-font PricingSetting-Proposal">
                              Min. Monthly Price for {proposalName}/
                              {EngagementName} (£)
                            </label>
                          </div>
                          <div class="col-lg-12 col-md-12 col-sm-12 fieldset">
                            <input
                              class="input-text table-content-font"
                              type="text"
                              placeholder="Enter Min. Monthly Price"
                              value={pricingSettingObj.minMonthlyPriceForQC
                                ?.toString()
                                ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                              onChange={(e) => {
                                SetPrevError(false);
                                // Ensure that the input only contains numeric and dot characters
                                const sanitizedInput = e.target.value
                                  .replace(/[^0-9.]/g, "") // Allow only numeric and dot characters
                                  .slice(0, 16); // Limit to 7 characters (5 digits + 1 dot + 1 decimal)

                                // Split the input into integer and decimal parts
                                const [integerPart, decimalPart] =
                                  sanitizedInput.split(".");

                                // Combine integer and decimal parts with appropriate precision
                                const formattedInput =
                                  decimalPart !== undefined
                                    ? `${integerPart.slice(
                                        0,
                                        12
                                      )}.${decimalPart.slice(0, 2)}`
                                    : integerPart.slice(0, 12);

                                setRequireErrorMessage(false);
                                setPricingSettingObj({
                                  ...pricingSettingObj,
                                  minMonthlyPriceForQC: formattedInput,
                                });
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right side */}
                      <div class="col-lg-6 col-md-6 col-sm-12">
                        <div class="row fieldset">
                          <div class="fieldset col-12">
                            <label class="fieldset-label table-content-font PricingSetting-Proposal">
                              Max. Discount (%) for {proposalName}/
                              {EngagementName}
                            </label>
                          </div>
                          <div class="col-lg-12 fieldset">
                            <input
                              className="input-text table-content-font"
                              digitOnly={true}
                              type="text" // Use type="text" instead of type="number" to allow custom validation
                              pattern="\d{0,3}(\.\d{0,2})?" // Pattern to match the allowed format
                              placeholder="Enter Max. Discount (%)"
                              maxLength={6} // Allowing 3 digits before the decimal and 2 after
                              value={pricingSettingObj.maxDiscountForQC}
                              onChange={(e) => {
                                const inputValue = e.target.value.replace(
                                  /[^0-9.]/g,
                                  ""
                                );

                                // Validate if the input is a valid percentage
                                const isValidPercentage =
                                  /^\d{0,3}(\.\d{0,2})?$/.test(inputValue) &&
                                  inputValue <= 100;

                                // Update state only if the input is a valid percentage
                                if (isValidPercentage || inputValue === "") {
                                  setPricingSettingObj({
                                    ...pricingSettingObj,
                                    maxDiscountForQC: inputValue,
                                  });
                                } else {
                                  // Handle the case when the input is not a valid percentage
                                  // You can choose to clear the input or keep the previous value
                                  // In this example, I'm keeping the previous value
                                  setPricingSettingObj({
                                    ...pricingSettingObj,
                                    maxDiscountForQC:
                                      pricingSettingObj.maxDiscountForQC,
                                  });
                                }
                              }}
                            />
                          </div>
                          {/* Select  */}
                          <div class="fieldset col-12">
                            <label class="fieldset-label table-content-font PricingSetting-Proposal">
                            Payment Frequency
                            </label>
                          </div>
                          <div class="col-lg-12 fieldset input-group">
                          <Select
                          className="phone-input-country-code selectDropDown Drop-down-width"
                          value={selectedFrequency}
                          onChange={handlePaymentFrequencyChange}
                          options={Utils.Payment_Frequency}
                        />
                          </div>
                          <div class="col-lg-2 col-md-4 col-sm-12"></div>
                          <div class="col-lg-2 col-md-4 col-sm-12"></div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        {prevError && (
                          <label className="validation">
                            You haven't changed any value
                          </label>
                        )}
                      </div>
                      {userAccessData.Admin_Setting_Practice_Config_CanEdit && (
                        <div class="col-lg-12 text-end">
                          <label className="validation">{errorMessage}</label>
                          <button
                            style={{ fontSize: "14px", marginTop: "30px" }}
                            className="btn btn-primary create-item-btn"
                            onClick={() => {
                              PricingSettingAddUpdateBtnClicked();
                            }}
                          >
                            <span>Submit</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      <button class="btn btn-danger btn-icon" id="back-to-top">
        <i class="ri-arrow-up-line"></i>
      </button>
      <SuccessModal
        handleClose={handleClose}
        setDismissModal={setDismissModal}
        setOpenSuccessModal={setOpenSuccessModal}
        openSuccessModal={openSuccessModal}
        modelAction={"Update"}
        message={"Pricing setting"}
      />
    </div>
  );
};

export default Pricing_Settings;
