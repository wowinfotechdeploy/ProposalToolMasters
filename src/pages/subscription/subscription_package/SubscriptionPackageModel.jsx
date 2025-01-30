/* global $ */
import React, { useEffect, useState, useRef, useContext } from "react";
import Select from "react-select";
import { useLocation } from "react-router-dom";
import SuccessModal from "../../../components/SuccessModal";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import FormGroup from "@mui/material/FormGroup";
import { Row, Col } from "reactstrap";
import { ERROR_MESSAGES } from "../../../components/GlobalMessage";
import { useSelector } from "react-redux";
import {
  AddUpdateSubscriptionPackage,
  GetSubscriptionPackageModel,
} from "../../../redux/Services/Subscription/PackageApi";
import { AuthContextProvider } from "../../../AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";
import BackButtonSvg from "../../../components/BackButtonSvg";
import Android12Switch from "../../../components/AndroidSwitch";
function SubscriptionPackageModel(props) {
  const moduleName = "Subscription Package";
  // Declare all State
  const [modelAction, setModelAction] = useState("");
  const [requireErrorMessage, setRequireErrorMessage] = useState(false);
  const [
    requireErrorMessageForESignature,
    setRequireErrorMessageForESignature,
  ] = useState(false);
  const SubscriptionContainerRef = useRef(null);
  const [DiscountPriceError, setDiscountPriceError] = useState(false);
  const [subscriptionPackageObj, setSubscriptionPackageObj] = useState({
    subscriptionPackageKeyID: null,
    isFreePackage: null,
    packageName: "",
    prepareQuote: true,
    sendQuote: true,
    prepareContract: true,
    sendContract: true,
    signContract: true,
    eSignaturePerMonth: "",
    yearlyValuePlan: "",
    discountPercentageYear: "",
    discountPercentageMonth: "",
    discountPriceYear: "",
    discountPriceMonth: "",
    monthFreeYear: "",
    monthFreeMonth: "",
    getMonthsYear: "",
    getMonthsMonth: "",
    inPriceOfMonthYear: "",
    inPriceOfMonthMonth: "",
    isMailBox: false,
    apiIntegration: true
  });

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const location = useLocation();
  const common = useSelector((state) => state.Storage); //Getting Logged Users Details From Persist Storage of redux hooks
  const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
  const {
    setLoader,
    proposalName,
    EngagementName,
    scrollUpDownByElementID,
    scrollUptoCurrentPosition,
    setTopbar,
    getCrudPopUpTitleName,
  } = useContext(AuthContextProvider);

  //c]Declare UseEffect

  useEffect(() => {
    setTopbar("none");
  }, []);
  useEffect(() => {
    setModelAction(
      location?.state?.Action === undefined || location?.state?.Action === null
        ? "Add"
        : "Update"
    ); //Do not change this naming convention

    // setModelAction(props.modelRequestData?.Action === null ? "Add" : "Update"); //Do not change this naming convention
    if (location.state?.subscriptionPackageKeyID !== null) {
      GetSubscriptionPackageModelData(location.state?.subscriptionPackageKeyID);
    }
  }, [location.state]);

  // C] This function will clear all data from popup model
  const SetInitialModelData = () => {
    setSubscriptionPackageObj({
      ...subscriptionPackageObj,
      subscriptionPackageKeyID: null,
      packageName: "",
      prepareQuote: true,
      sendQuote: true,
      prepareContract: true,
      sendContract: true,
      signContract: true,
      eSignaturePerMonth: "",
      yearlyValuePlan: "",
      discountPercentageYear: "",
      discountPercentageMonth: "",
      discountPriceYear: "",
      discountPriceMonth: "",
      monthFreeYear: "",
      monthFreeMonth: "",
      getMonthsYear: "",
      getMonthsMonth: "",
      inPriceOfMonthYear: "",
      inPriceOfMonthMonth: "",
      isMailBox: false,
    });
    setErrorMessage("");
    setRequireErrorMessage(false);
  };

  // F] Calling CRUD Api here
  // 1) Get Model Data Api
  const GetSubscriptionPackageModelData = async (id) => {
    if (!id) {
      return;
    }
    //..............Subscription package Edit Data Api...................
    try {
      const data = await GetSubscriptionPackageModel(id);
      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          const ModelData = data?.data?.responseData?.data;
          const discountPriceYear = ModelData.subscriptionOffers.find(
            (offer) => offer.paymentFrequencyID === 1
          )?.discountPrice;
          const monthFreeYear = ModelData.subscriptionOffers.find(
            (offer) => offer.paymentFrequencyID === 1
          )?.monthFree;
          const getMonthsYear = ModelData.subscriptionOffers.find(
            (offer) => offer.paymentFrequencyID === 1
          )?.getMonths;
          const inPriceOfMonthYear = ModelData.subscriptionOffers.find(
            (offer) => offer.paymentFrequencyID === 1
          )?.inPriceOfMonth;
          const discountPercentageYear = ModelData.subscriptionOffers.find(
            (offer) => offer.paymentFrequencyID === 1
          )?.discountPercentage;

          const discountPriceMonth = ModelData.subscriptionOffers.find(
            (offer) => offer.paymentFrequencyID === 4
          )?.discountPrice;
          const monthFreeMonth = ModelData.subscriptionOffers.find(
            (offer) => offer.paymentFrequencyID === 4
          )?.monthFree;
          const getMonthsMonth = ModelData.subscriptionOffers.find(
            (offer) => offer.paymentFrequencyID === 4
          )?.getMonths;
          const inPriceOfMonthMonth = ModelData.subscriptionOffers.find(
            (offer) => offer.paymentFrequencyID === 4
          )?.inPriceOfMonth;
          const discountPercentageMonth = ModelData.subscriptionOffers.find(
            (offer) => offer.paymentFrequencyID === 4
          )?.discountPercentage;
          setSubscriptionPackageObj({
            ...subscriptionPackageObj,
            apiIntegration: ModelData.apiIntegration,
            isFreePackage: ModelData.isFreePackage,
            subscriptionPackageKeyID: ModelData.subscriptionPackageKeyID,
            packageName: ModelData.packageName,
            prepareQuote: ModelData.prepareQuote,
            sendQuote: ModelData.sendQuote,
            prepareContract: ModelData.prepareContract,
            sendContract: ModelData.sendContract,
            signContract: ModelData.signContract,
            eSignaturePerMonth: ModelData.eSignaturePerMonth,
            yearlyValuePlan: ModelData.yearlyValuePlan,
            isMailBox: ModelData.isMailBox,
            discountPercentageYear: discountPercentageYear === undefined ? 0 : discountPercentageYear,
            discountPercentageMonth: discountPercentageMonth === undefined ? 0 : discountPercentageMonth,
            discountPriceYear: discountPriceYear === undefined ? 0 : discountPriceYear,
            discountPriceMonth: discountPriceMonth === undefined ? 0 : discountPriceMonth,
            monthFreeYear: monthFreeYear === undefined ? 0 : monthFreeYear,
            monthFreeMonth: monthFreeMonth === undefined ? 0 : monthFreeMonth,
            getMonthsYear: getMonthsYear === undefined ? 0 : getMonthsYear,
            getMonthsMonth: getMonthsMonth === undefined ? 0 : getMonthsMonth,
            inPriceOfMonthYear: inPriceOfMonthYear === undefined ? 0 : inPriceOfMonthYear,
            inPriceOfMonthMonth: inPriceOfMonthMonth === undefined ? 0 : inPriceOfMonthMonth,
          });
        }
      } else {
        setErrorMessage(data?.data?.errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //2]Add Update Button Click Function
  const SubscriptionPackageAddUpdateBtnClicked = () => {
    //Check Validations will be done here

    if (
      subscriptionPackageObj.packageName === undefined ||
      subscriptionPackageObj.packageName === ""
    ) {
      scrollUpDownByElementID("PackageName");
      setRequireErrorMessage(true);
      return false; // Return false or handle your error logic here if needed.
    } else {
      setRequireErrorMessage(""); // Clear the error message if there are no errors.
    }
    if (subscriptionPackageObj.sendContract === true) {
      if (Number(subscriptionPackageObj.eSignaturePerMonth) < 1) {
        scrollUpDownByElementID("ESignature");
        setRequireErrorMessageForESignature(true);
        return false;
      }
    }
    scrollUpDownByElementID("ErrorMessage");
    // Clear the error message and set close to true if there are no errors.
    setErrorMessage("");

    // Preparing Object For Add Update and if any modification then it will done here
    const ApiRequest_ParamsObj = {
      //global level params : fixed
      // Action: modelRequestData.Action,
      userKeyID: common.userKeyID,
      // organisationKeyID: common.organisationKeyID,

      //form level params : fixed
      // subscriptionPackageKeyID: props.modelRequestData.subscriptionPackageKeyID, //will change module wise
      subscriptionPackageKeyID: subscriptionPackageObj.subscriptionPackageKeyID, //will change module wise

      //form level params : will change according to module
      apiIntegration: subscriptionPackageObj.apiIntegration,
      packageName: subscriptionPackageObj.packageName,
      prepareQuote: subscriptionPackageObj.prepareQuote,
      sendQuote: subscriptionPackageObj.sendQuote,
      prepareContract: subscriptionPackageObj.prepareContract,
      sendContract: subscriptionPackageObj.sendContract,
      signContract: subscriptionPackageObj.sendContract,
      isMailBox: subscriptionPackageObj.isMailBox,
      eSignaturePerMonth:
        subscriptionPackageObj.eSignaturePerMonth === ""
          ? null
          : subscriptionPackageObj.eSignaturePerMonth,
      yearlyValuePlan:
        subscriptionPackageObj.yearlyValuePlan === ""
          ? null
          : Number(subscriptionPackageObj.yearlyValuePlan),

      subscriptionOffers: subscriptionPackageObj.isFreePackage ? null : [
        {
          paymentFrequencyID: 4, // Monthly
          discountPercentage:
            subscriptionPackageObj.discountPercentageMonth === ""
              ? null
              : Number(subscriptionPackageObj.discountPercentageMonth),
          discountPrice:
            subscriptionPackageObj.discountPriceMonth === ""
              ? null
              : Number(subscriptionPackageObj.discountPriceMonth),
          monthFree:
            subscriptionPackageObj.monthFreeMonth === ""
              ? null
              : Number(subscriptionPackageObj.monthFreeMonth),
          getMonths:
            subscriptionPackageObj.getMonthsMonth === ""
              ? null
              : Number(subscriptionPackageObj.getMonthsMonth),
          inPriceOfMonth:
            subscriptionPackageObj.inPriceOfMonthMonth === ""
              ? null
              : Number(subscriptionPackageObj.inPriceOfMonthMonth),
        },
        {
          paymentFrequencyID: 1, // Yearly
          discountPercentage:
            subscriptionPackageObj.discountPercentageYear === ""
              ? null
              : Number(subscriptionPackageObj.discountPercentageYear),
          discountPrice:
            subscriptionPackageObj.discountPriceYear === ""
              ? null
              : Number(subscriptionPackageObj.discountPriceYear),
          monthFree:
            subscriptionPackageObj.monthFreeYear === ""
              ? null
              : Number(subscriptionPackageObj.monthFreeYear),
          getMonths:
            subscriptionPackageObj.getMonthsYear === ""
              ? null
              : Number(subscriptionPackageObj.getMonthsYear),
          inPriceOfMonth:
            subscriptionPackageObj.inPriceOfMonthYear === ""
              ? null
              : Number(subscriptionPackageObj.inPriceOfMonthYear),
        },
      ],
    };
    AddUpdateSubscriptionPackageData(ApiRequest_ParamsObj);
  };

  // 3) Add Update Subscription package Data Api
  const AddUpdateSubscriptionPackageData = async (ApiRequest_ParamsObj) => {
    setLoader(true);
    try {

      const response = await AddUpdateSubscriptionPackage(
        ApiRequest_ParamsObj
      );
      if (response) {
        setLoader(false);
        if (response?.data?.statusCode === 200) {
          // $('#' + props.id).modal('hide')
          // uncomment upper code for hide

          if (ApiRequest_ParamsObj.Action === null) {
            setOpenSuccessModal(true);
            props.setIsAddUpdateActionDone(true);
            navigate("/sub-package");
          } else {
            setOpenSuccessModal(true);
            props.setIsAddUpdateActionDone(true);
            navigate("/sub-package");
          }
        } else {
          setErrorMessage(response?.response?.data?.errorMessage);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };


  const HandleClose = () => {
    $("#" + props.id).modal("hide");
    setOpenSuccessModal(false);
    SetInitialModelData();
    navigate("/sub-package");
  };
  const handlePrepareQuoteChange = (e) => {
    const prepareQuoteValue = !subscriptionPackageObj.prepareQuote;
    setSubscriptionPackageObj({
      ...subscriptionPackageObj,
      prepareQuote: prepareQuoteValue,
      sendQuote: prepareQuoteValue ? subscriptionPackageObj.sendQuote : false,
    });
  };
  const handleApiIntegrationChange = (e) => {
    const prepareQuoteValue = !subscriptionPackageObj.apiIntegration;
    setSubscriptionPackageObj({
      ...subscriptionPackageObj,
      apiIntegration: prepareQuoteValue,
    });
  };
  const handleSendQuoteChange = (e) => {
    if (subscriptionPackageObj.prepareQuote) {
      setSubscriptionPackageObj({
        ...subscriptionPackageObj,
        sendQuote: !subscriptionPackageObj.sendQuote,
      });
    }
  };

  const handlePrepareELChange = (e) => {
    const prepareElValue = !subscriptionPackageObj.prepareContract;
    setSubscriptionPackageObj({
      ...subscriptionPackageObj,
      prepareContract: prepareElValue,
      sendContract: prepareElValue
        ? subscriptionPackageObj.sendContract
        : false,
      eSignaturePerMonth: prepareElValue
        ? subscriptionPackageObj.eSignaturePerMonth
        : "",
    });
  };

  const handleSendELChange = (e) => {
    if (subscriptionPackageObj.prepareContract) {
      const sendContract = !subscriptionPackageObj.sendContract;
      setSubscriptionPackageObj({
        ...subscriptionPackageObj,
        sendContract: sendContract,
        eSignaturePerMonth: sendContract
          ? subscriptionPackageObj.eSignaturePerMonth
          : "",
        // signContract: sendContract === "YES" ? true : false,
      });
    }
  };

  const handleSubmit = () => {
    setTopbar("block");
    navigate("/sub-package");
    SetInitialModelData();
  };

  return (
    <div
      ref={SubscriptionContainerRef}
      onClick={(e) => scrollUptoCurrentPosition(e, SubscriptionContainerRef)}
    >
      <div class="container-fluid new-item-page-container">
        <div class="new-item-page-nav"></div>
        <div class="new-item-page-content">
          <div class="row form-row">
            <div class="col-lg-12">
              <h3 class="modal-title">
                <BackButtonSvg onClick={handleSubmit} />
                {modelAction === "Add"
                  ? getCrudPopUpTitleName("Add", moduleName)
                  : getCrudPopUpTitleName("Update", moduleName)}
              </h3>
              <div class="separator mb-3"></div>

              <div className="template-height scrollbar" id="style-1">
                <div class="tab-content">
                  <div className="row" id="PackageName">
                    <div className="col-lg-6">
                      <label>
                        {moduleName} Name
                        <span className="text-danger">*</span>
                      </label>
                    </div>
                    <div className="col-12 ">
                      <input
                        type="text"
                        className="input-text"
                        placeholder={`${moduleName} Name`}
                        value={subscriptionPackageObj?.packageName}
                        onChange={(e) => {
                          setErrorMessage("");
                          let inputValue = e.target.value;
                          // Truncate input if length exceeds 30 characters
                          if (inputValue.length > 30) {
                            inputValue = inputValue.slice(0, 30);
                          }

                          const isValidName =
                            /^[a-zA-Z]+(?:[a-zA-Z0-9\s]*)$/.test(inputValue) &&
                            !/^\d+$/.test(inputValue);
                          if (isValidName || inputValue === "") {
                            const capitalizedValue =
                              inputValue.charAt(0).toUpperCase() +
                              inputValue.slice(1);
                            setSubscriptionPackageObj({
                              ...subscriptionPackageObj,
                              packageName: capitalizedValue,
                            });
                          }
                        }}
                      />

                      {requireErrorMessage &&
                        subscriptionPackageObj.packageName === "" ? (
                        <label className="validation">{ERROR_MESSAGES}</label>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="row p-2">
                    <div className="fieldset-group ">
                      <label
                        className="fieldset-group-label required"
                      >
                        API Integration
                      </label>
                      <div class="row">
                        <div class="col-lg-3 col-md-3 col-sm-6 text-start text-md-end mt-2">
                          <label class="form-label" >
                            API Integration
                          </label>
                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-6" style={{ display: 'flex', alignItems: 'center' }} >
                          <div style={{ width: "40px", marginBottom: "5px" }}>
                            {subscriptionPackageObj.apiIntegration ? "Yes" : "No"}
                          </div>
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Android12Switch
                                  checked={subscriptionPackageObj.apiIntegration}
                                  onClick={handleApiIntegrationChange}
                                />
                              }
                            />
                          </FormGroup>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row p-2">
                    <div className="fieldset-group ">
                      <label
                        className="fieldset-group-label required"
                      >
                        {proposalName}
                      </label>
                      <div class="row">
                        <div class="col-lg-3 col-md-3 col-sm-6 text-start text-md-end mt-2">
                          <label class="form-label" >
                            Prepare {proposalName}
                          </label>
                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-6" style={{ display: 'flex', alignItems: 'center' }} >
                          <div style={{ width: "40px", marginBottom: "5px" }}>
                            {subscriptionPackageObj.prepareQuote ? "Yes" : "No"}
                          </div>
                          <FormGroup>
                            <FormControlLabel
                              control={

                                <Android12Switch

                                  checked={subscriptionPackageObj.prepareQuote}
                                  onClick={handlePrepareQuoteChange}
                                />

                              }

                            />

                          </FormGroup>
                        </div>
                        {/* </div>

                      <div class="row"> */}
                        <div class="col-lg-3 col-md-3 col-sm-6 text-start text-md-end mt-2">
                          <label class="form-label" >
                            Send {proposalName}
                          </label>

                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-6" style={{ display: 'flex', alignItems: 'center' }} >
                          <div style={{ width: "40px", marginBottom: "5px" }}>
                            {subscriptionPackageObj.sendQuote ? "Yes" : "No"}
                          </div>
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Android12Switch

                                  checked={subscriptionPackageObj.sendQuote}
                                  onClick={handleSendQuoteChange}
                                  disabled={!subscriptionPackageObj.prepareQuote}
                                />
                              }
                            />
                          </FormGroup>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="fieldset-group" id="ESignature">
                    <label htmlFor="" className="fieldset-group-label required">
                      {EngagementName}
                    </label>
                    <div class="row">
                      <div class="col-lg-3 col-md-3 col-sm-6 text-start text-md-end mt-2">
                        <label class="form-label">
                          Prepare {EngagementName}
                        </label>
                      </div>
                      <div class="col-lg-3 col-md-3 col-sm-6" style={{ display: 'flex', alignItems: 'center' }} >
                        <div style={{ width: "40px", marginBottom: "5px" }}>
                          {subscriptionPackageObj.prepareContract ? "Yes" : "No"}
                        </div>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Android12Switch
                                checked={subscriptionPackageObj.prepareContract}
                                onClick={handlePrepareELChange}
                              />
                            }
                          />
                        </FormGroup>
                      </div>
                      {/* </div>

                      <div class="row"> */}
                      <div class="col-lg-3 col-md-3 col-sm-6 text-start text-md-end mt-2">
                        <label class="form-label" >
                          Send And Digitally Sign The {EngagementName}
                        </label>
                      </div>
                      <div class="col-lg-3 col-md-3 col-sm-6" style={{ display: 'flex', alignItems: 'center' }} >
                        <div style={{ width: "40px", marginBottom: "5px" }}>
                          {subscriptionPackageObj.sendContract ? "Yes" : "No"}
                        </div>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Android12Switch

                                checked={subscriptionPackageObj.sendContract}
                                onClick={handleSendELChange}
                                disabled={!subscriptionPackageObj.prepareContract}
                              />
                            }
                          />
                        </FormGroup>
                      </div>
                      <div className=" col-6 p-2">
                        <TextField
                          InputLabelProps={{
                            sx: {
                              fontWeight: "bold",
                            },
                          }}
                          label="E-Signature per month"
                          id="outlined-basic"
                          variant="outlined"
                          type="text"
                          size="small"
                          value={
                            subscriptionPackageObj.eSignaturePerMonth === "" ||
                              subscriptionPackageObj.eSignaturePerMonth === null
                              ? 0
                              : subscriptionPackageObj.eSignaturePerMonth?.toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          onChange={(e) => {
                            let inputValue = e.target.value;
                            // Remove leading zeros
                            inputValue = inputValue.replace(/^0+/, "");
                            // Remove non-numeric characters except decimal point
                            inputValue = inputValue.replace(/[^\d]/g, "");
                            // Limit to 12 digits before the decimal point
                            if (inputValue.includes(".")) {
                              const [integerPart, decimalPart] =
                                inputValue.split(".");
                              inputValue = `${integerPart.slice(
                                0,
                                7
                              )}.${decimalPart.slice(0, 2)}`;
                            } else {
                              inputValue = inputValue.slice(0, 7);
                            }

                            setSubscriptionPackageObj({
                              ...subscriptionPackageObj,
                              eSignaturePerMonth: inputValue,
                            });
                          }}
                          disabled={
                            !(
                              subscriptionPackageObj.sendContract &&
                              subscriptionPackageObj.prepareContract
                            )
                          }
                        />
                      </div>
                      {requireErrorMessageForESignature &&
                        subscriptionPackageObj.sendContract &&
                        Number(subscriptionPackageObj.eSignaturePerMonth) < 1 ? (
                        <label className="validation mb-1">
                          The E-Signature per month must be at least 1.
                        </label>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="fieldset-group">
                    <label htmlFor="" className="fieldset-group-label required">
                      Other
                    </label>
                    <div class="row">
                      <div class="col-lg-3 col-md-3 col-sm-6 text-start text-md-end mt-2">
                        <label class="form-label" >
                          Personalized Outgoing Mailbox
                        </label>
                      </div>
                      <div class="col-lg-3 col-md-3 col-sm-6" style={{ display: 'flex', alignItems: 'center' }} >
                        <div style={{ width: "40px", marginBottom: "5px" }}>
                          {subscriptionPackageObj.isMailBox ? "Yes" : "No"}
                        </div>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Android12Switch
                                checked={subscriptionPackageObj.isMailBox}
                                onClick={(e) => {
                                  setSubscriptionPackageObj({
                                    ...subscriptionPackageObj,
                                    isMailBox: !subscriptionPackageObj.isMailBox,
                                  });
                                }}
                              />
                            }
                          />
                        </FormGroup>
                      </div>
                      <div class="col-lg-6 col-md-6 col-sm-6 text-start text-md-end mt-2 p-2">
                        <TextField
                          label={<span>Yearly value for the plan </span>}
                          id="outlined-basic"
                          variant="outlined"
                          type="text"
                          InputLabelProps={{
                            sx: {
                              fontWeight: "bold",
                            },
                          }}
                          size="small"
                          value={
                            subscriptionPackageObj?.yearlyValuePlan === "" ||
                              subscriptionPackageObj?.yearlyValuePlan === null
                              ? 0
                              : subscriptionPackageObj?.yearlyValuePlan
                                ?.toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          onChange={(e) => {
                            let inputValue = e.target.value;
                            // Remove leading zeros
                            inputValue = inputValue.replace(/^0+/, "");
                            // Remove non-numeric characters except decimal point
                            inputValue = inputValue.replace(/[^\d.]/g, "");
                            // Limit to 12 digits before the decimal point
                            if (inputValue.includes(".")) {
                              const [integerPart, decimalPart] =
                                inputValue.split(".");
                              inputValue = `${integerPart.slice(
                                0,
                                7
                              )}.${decimalPart.slice(0, 2)}`;
                            } else {
                              inputValue = inputValue.slice(0, 7);
                            }
                            setDiscountPriceError(false)
                            // Add commas to the number
                            inputValue = inputValue;
                            setSubscriptionPackageObj({
                              ...subscriptionPackageObj,
                              yearlyValuePlan: inputValue,
                            });
                          }}
                        />
                      </div>

                    </div>

                  </div>
                  {!subscriptionPackageObj.isFreePackage && <>
                    <hr />
                    <p> Discounts For Annual Bills</p>
                    <div className="row">
                      <div className="mt-3 col-6">
                        <div className="row">
                          <div
                            className="col-2"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <input
                              type="checkbox"
                              className="check check_tick"
                              style={{
                                height: "100%",
                                width: "16px",
                              }}
                              id="flexCheckDefault"
                              checked={
                                subscriptionPackageObj.discountPercentageYear > 0
                              }
                            />
                          </div>
                          <div className="col-10">
                            <TextField
                              InputLabelProps={{
                                sx: {
                                  fontWeight: "bold",
                                },
                              }}
                              label="Discount(%)"
                              id="outlined-size-small"
                              type="text"
                              size="small"
                              value={
                                subscriptionPackageObj.discountPercentageYear ===
                                  "" ||
                                  subscriptionPackageObj.discountPercentageYear ===
                                  null
                                  ? 0
                                  : subscriptionPackageObj.discountPercentageYear
                              }
                              onChange={(e) => {
                                let inputValue = e.target.value;
                                // Remove leading zeros
                                inputValue = inputValue.replace(/^0+/, "");
                                // Remove any non-numeric characters except dot
                                inputValue = inputValue.replace(/[^0-9.]/g, "");
                                // Split the input value by decimal point
                                const parts = inputValue.split(".");
                                // Ensure the number of parts is not more than 2
                                if (parts.length > 2) {
                                  return;
                                }
                                // If there are more than 1 parts (means decimal point exists)
                                if (parts.length === 2) {
                                  // Take only the first two parts and join them with a dot
                                  inputValue =
                                    parts[0] + "." + parts[1].slice(0, 2);
                                }
                                // Check if the value is a valid number within the range [0, 100]
                                if (
                                  isNaN(inputValue) ||
                                  inputValue < 0 ||
                                  inputValue > 100
                                ) {
                                  return;
                                }
                                // Set the state with the sanitized value
                                setSubscriptionPackageObj({
                                  ...subscriptionPackageObj,
                                  discountPercentageYear: inputValue,
                                });
                              }}
                            />
                          </div>
                        </div>
                        {/* row end */}
                      </div>
                      <div className="mt-3 col-6">
                        <div className="row">
                          <div
                            className="col-2"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <input
                              type="checkbox"
                              className="check check_tick"
                              style={{
                                height: "100%",
                                width: "16px",
                              }}
                              id="flexCheckDefault"
                              checked={
                                subscriptionPackageObj.discountPriceYear > 0
                              }
                            />
                          </div>
                          <div className="col-10">
                            <TextField
                              InputLabelProps={{
                                sx: {
                                  fontWeight: "bold",
                                },
                              }}
                              label={<span>Discounted Price </span>}
                              id="outlined-size-small"
                              type="text"
                              size="small"
                              value={
                                subscriptionPackageObj?.discountPriceYear ===
                                  "" ||
                                  subscriptionPackageObj?.discountPriceYear === null
                                  ? 0
                                  : subscriptionPackageObj?.discountPriceYear

                                    ?.toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                              }
                              onChange={(e) => {
                                let inputValue = e.target.value;
                                // Remove leading zeros
                                inputValue = inputValue.replace(/^0+/, "");
                                // Remove non-numeric characters except decimal point
                                inputValue = inputValue.replace(/[^\d.]/g, "");
                                // Limit to 12 digits before the decimal point
                                if (inputValue.includes(".")) {
                                  const [integerPart, decimalPart] =
                                    inputValue.split(".");
                                  inputValue = `${integerPart.slice(
                                    0,
                                    7
                                  )}.${decimalPart.slice(0, 2)}`;
                                } else {
                                  inputValue = inputValue.slice(0, 7);
                                }
                                // Add commas to the number
                                inputValue = inputValue;
                                const yearlyValue =
                                  subscriptionPackageObj?.yearlyValuePlan
                                const discountPrice = inputValue

                                if (
                                  !isNaN(discountPrice) &&
                                  discountPrice > yearlyValue
                                ) {
                                  // If the discount price is greater than the yearly value, set an error or handle it accordingly
                                  // For example, you can display an error message or prevent form submission
                                  // Here, I'm setting an error message to be displayed
                                  setRequireErrorMessage(true);
                                  setDiscountPriceError(true);
                                } else {
                                  // If the discount price is valid, clear the error message
                                  setDiscountPriceError(false);
                                }
                                setSubscriptionPackageObj({
                                  ...subscriptionPackageObj,
                                  discountPriceYear: inputValue,
                                });
                              }}
                            />
                            {requireErrorMessage && DiscountPriceError ? (
                              <label className="validation">
                                Discounted price cannot be greater than the yearly
                                value for the plan.
                              </label>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="mt-3 col-6">
                        <div className="row">
                          <div
                            className="col-2"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <input
                              type="checkbox"
                              className="check check_tick"
                              style={{
                                height: "100%",
                                width: "16px",
                              }}
                              id="flexCheckDefault"
                              checked={
                                subscriptionPackageObj.monthFreeYear > 0
                              }
                            />
                          </div>

                          <div className="col-10">
                            <TextField
                              InputLabelProps={{
                                sx: {
                                  fontWeight: "bold",
                                },
                              }}
                              label="Months free"
                              id="outlined-size-small"
                              type="text"
                              size="small"
                              value={
                                subscriptionPackageObj.monthFreeYear === "" ||
                                  subscriptionPackageObj.monthFreeYear === null
                                  ? 0
                                  : subscriptionPackageObj.monthFreeYear
                              }
                              onChange={(e) => {
                                let inputValue = e.target.value;
                                // Remove non-numeric characters
                                inputValue = inputValue.replace(/[^\d]/g, "");
                                // Convert to number
                                let numericValue = parseInt(inputValue, 10);
                                // Restrict value to be between 0 and 24
                                if (isNaN(numericValue) || numericValue < 0) {
                                  numericValue = 0;
                                } else if (numericValue > 24) {
                                  numericValue = 24;
                                }
                                // Set the value
                                setSubscriptionPackageObj({
                                  ...subscriptionPackageObj,
                                  monthFreeYear: numericValue.toString(),
                                });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="mt-3 col-6">
                        <div className="row">
                          <div
                            className="col-2"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <input
                              type="checkbox"
                              className="check check_tick"
                              style={{
                                height: "100%",
                                width: "16px",
                              }}
                              id="flexCheckDefault"
                              checked={
                                subscriptionPackageObj.getMonthsYear > 0
                              }
                            />
                          </div>

                          <div class="col-10">
                            <TextField
                              InputLabelProps={{
                                sx: {
                                  fontWeight: "bold",
                                },
                              }}
                              label="Months for the Price of"
                              id="outlined-size-small"
                              type="text"
                              size="small"
                              value={
                                subscriptionPackageObj.getMonthsYear === "" ||
                                  subscriptionPackageObj.getMonthsYear === null
                                  ? 0
                                  : subscriptionPackageObj.getMonthsYear
                              }
                              onChange={(e) => {
                                let inputValue = e.target.value;
                                // Remove non-numeric characters
                                inputValue = inputValue.replace(/[^\d]/g, "");
                                // Convert to number
                                let numericValue = parseInt(inputValue, 10);
                                // Restrict value to be between 0 and 24
                                if (isNaN(numericValue) || numericValue < 0) {
                                  numericValue = 0;
                                } else if (numericValue > 24) {
                                  numericValue = 24;
                                }
                                // Set the value
                                setSubscriptionPackageObj({
                                  ...subscriptionPackageObj,
                                  getMonthsYear: numericValue.toString(),
                                });
                              }}
                            />
                          </div>
                          {/* <div class="col-3">
                  <span
                    for="customerName-field"
                    class="fieldset-label required "
                  >
                    Months for the Price of
                  </span>
                </div> */}
                        </div>
                      </div>

                      <div className="mt-3 col-6">
                        <div className="row">
                          <div className="col-2"></div>
                          <div class="col-10">
                            <TextField
                              InputLabelProps={{
                                sx: {
                                  fontWeight: "bold",
                                },
                              }}
                              label="Months"
                              id="outlined-size-small"
                              type="text"
                              size="small"
                              value={
                                subscriptionPackageObj.inPriceOfMonthYear ===
                                  "" ||
                                  subscriptionPackageObj.inPriceOfMonthYear === null
                                  ? 0
                                  : subscriptionPackageObj.inPriceOfMonthYear
                              }
                              onChange={(e) => {
                                let inputValue = e.target.value;
                                // Remove non-numeric characters
                                inputValue = inputValue.replace(/[^\d]/g, "");
                                // Convert to number
                                let numericValue = parseInt(inputValue, 10);
                                // Restrict value to be between 0 and 24
                                if (isNaN(numericValue) || numericValue < 0) {
                                  numericValue = 0;
                                } else if (numericValue > 24) {
                                  numericValue = 24;
                                }
                                // Set the value
                                setSubscriptionPackageObj({
                                  ...subscriptionPackageObj,
                                  inPriceOfMonthYear: numericValue.toString(),
                                });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <hr />
                    <p>Discounts for Monthly Bills </p>
                    <div className="row">
                      <div className="mt-3 col-6">
                        <div className="row">
                          <div
                            className="col-2"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <input
                              type="checkbox"
                              className="check check_tick"
                              style={{
                                height: "100%",
                                width: "16px",
                              }}
                              id="flexCheckDefault"
                              checked={
                                subscriptionPackageObj.discountPercentageMonth > 0
                              }
                            />
                          </div>
                          <div className="col-10">
                            <TextField
                              InputLabelProps={{
                                sx: {
                                  fontWeight: "bold",
                                },
                              }}
                              label="Discount(%)"
                              id="outlined-size-small"
                              type="text"
                              size="small"
                              value={
                                subscriptionPackageObj.discountPercentageMonth ===
                                  "" ||
                                  subscriptionPackageObj.discountPercentageMonth ===
                                  null
                                  ? 0
                                  : subscriptionPackageObj.discountPercentageMonth
                              }
                              onChange={(e) => {
                                let inputValue = e.target.value;
                                // Remove leading zeros
                                inputValue = inputValue.replace(/^0+/, "");
                                // Remove any non-numeric characters except dot
                                inputValue = inputValue.replace(/[^0-9.]/g, "");
                                // Split the input value by decimal point
                                const parts = inputValue.split(".");
                                // Ensure the number of parts is not more than 2
                                if (parts.length > 2) {
                                  return;
                                }
                                // If there are more than 1 parts (means decimal point exists)
                                if (parts.length === 2) {
                                  // Take only the first two parts and join them with a dot
                                  inputValue =
                                    parts[0] + "." + parts[1].slice(0, 2);
                                }
                                // Check if the value is a valid number within the range [0, 100]
                                if (
                                  isNaN(inputValue) ||
                                  inputValue < 0 ||
                                  inputValue > 100
                                ) {
                                  return;
                                }
                                // Set the state with the sanitized value
                                setSubscriptionPackageObj({
                                  ...subscriptionPackageObj,
                                  discountPercentageMonth: inputValue,
                                });
                              }}
                            />
                          </div>
                        </div>
                        {/* row end */}
                      </div>
                      <div className="mt-3 col-6">
                        <div className="row">
                          <div
                            className="col-2"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <input
                              type="checkbox"
                              className="check check_tick"
                              style={{
                                height: "100%",
                                width: "16px",
                              }}
                              id="flexCheckDefault"
                              checked={
                                subscriptionPackageObj.discountPriceMonth > 0
                              }
                            />
                          </div>
                          <div className="col-10">
                            <TextField
                              InputLabelProps={{
                                sx: {
                                  fontWeight: "bold",
                                },
                              }}
                              label={<span>Discounted Price </span>}
                              id="outlined-size-small"
                              type="text"
                              size="small"
                              value={
                                subscriptionPackageObj?.discountPriceMonth ===
                                  "" ||
                                  subscriptionPackageObj.discountPriceMonth === null
                                  ? 0
                                  : subscriptionPackageObj?.discountPriceMonth
                                    ?.toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                              }
                              onChange={(e) => {
                                let inputValue = e.target.value;
                                // Remove leading zeros
                                inputValue = inputValue.replace(/^0+/, "");
                                // Remove non-numeric characters except decimal point
                                inputValue = inputValue.replace(/[^\d.]/g, "");
                                // Limit to 12 digits before the decimal point
                                if (inputValue.includes(".")) {
                                  const [integerPart, decimalPart] =
                                    inputValue.split(".");
                                  inputValue = `${integerPart.slice(
                                    0,
                                    7
                                  )}.${decimalPart.slice(0, 2)}`;
                                } else {
                                  inputValue = inputValue.slice(0, 7);
                                }
                                // Add commas to the number
                                inputValue = inputValue;
                                const yearlyValue =
                                  subscriptionPackageObj?.yearlyValuePlan;
                                const discountPrice =
                                  inputValue
                                if (
                                  !isNaN(yearlyValue) &&
                                  !isNaN(discountPrice) &&
                                  discountPrice > yearlyValue
                                ) {
                                  // If the discount price is greater than the yearly value, set an error or handle it accordingly
                                  // For example, you can display an error message or prevent form submission
                                  // Here, I'm setting an error message to be displayed
                                  setRequireErrorMessage(true);
                                  setDiscountPriceError(true);
                                } else {
                                  // If the discount price is valid, clear the error message
                                  setDiscountPriceError(false);
                                }
                                setSubscriptionPackageObj({
                                  ...subscriptionPackageObj,
                                  discountPriceMonth: inputValue,
                                });
                              }}
                            />

                            {requireErrorMessage && DiscountPriceError ? (
                              <label className="validation">
                                Discounted price cannot be greater than the yearly
                                value for the plan.
                              </label>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="mt-3 col-6">
                        <div className="row">
                          <div
                            className="col-2"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <input
                              type="checkbox"
                              className="check check_tick"
                              style={{
                                height: "100%",
                                width: "16px",
                              }}
                              id="flexCheckDefault"
                              checked={
                                subscriptionPackageObj.monthFreeMonth > 0
                              }
                            />
                          </div>

                          <div class="col-10">
                            <TextField
                              InputLabelProps={{
                                sx: {
                                  fontWeight: "bold",
                                },
                              }}
                              label="Months free"
                              id="outlined-size-small"
                              type="text"
                              size="small"
                              value={
                                subscriptionPackageObj?.monthFreeMonth === "" ||
                                  subscriptionPackageObj?.monthFreeMonth === null
                                  ? 0
                                  : subscriptionPackageObj?.monthFreeMonth
                              }
                              onChange={(e) => {
                                let inputValue = e.target.value;
                                // Remove non-numeric characters
                                inputValue = inputValue.replace(/[^\d]/g, "");
                                // Convert to number
                                let numericValue = parseInt(inputValue, 10);
                                // Restrict value to be between 0 and 24
                                if (isNaN(numericValue) || numericValue < 0) {
                                  numericValue = 0;
                                } else if (numericValue > 24) {
                                  numericValue = 24;
                                }
                                // Set the value
                                setSubscriptionPackageObj({
                                  ...subscriptionPackageObj,
                                  monthFreeMonth: numericValue.toString(),
                                });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="mt-3 col-6">
                        <div className="row">
                          <div
                            className="col-2"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <input
                              type="checkbox"
                              className="check check_tick"
                              style={{
                                height: "100%",
                                width: "16px",
                              }}
                              id="flexCheckDefault"
                              checked={
                                subscriptionPackageObj.getMonthsMonth > 0
                              }
                            />
                          </div>

                          <div class="col-10">
                            <TextField
                              InputLabelProps={{
                                sx: {
                                  fontWeight: "bold",
                                },
                              }}
                              label="Months for the Price of"
                              id="outlined-size-small"
                              type="text"
                              size="small"
                              value={
                                subscriptionPackageObj?.getMonthsMonth === "" ||
                                  subscriptionPackageObj?.getMonthsMonth === null
                                  ? 0
                                  : subscriptionPackageObj?.getMonthsMonth
                              }
                              onChange={(e) => {
                                let inputValue = e.target.value;
                                // Remove non-numeric characters
                                inputValue = inputValue.replace(/[^\d]/g, "");
                                // Convert to number
                                let numericValue = parseInt(inputValue, 10);
                                // Restrict value to be between 0 and 24
                                if (isNaN(numericValue) || numericValue < 0) {
                                  numericValue = 0;
                                } else if (numericValue > 24) {
                                  numericValue = 24;
                                }
                                // Set the value
                                setSubscriptionPackageObj({
                                  ...subscriptionPackageObj,
                                  getMonthsMonth: numericValue.toString(),
                                });
                              }}
                            />
                          </div>
                          {/* <div class="col-3">
                  <span
                    for="customerName-field"
                    class="fieldset-label required "
                  >
                    Months for the Price of
                  </span>
                </div> */}
                        </div>
                      </div>

                      <div className="mt-3 col-6">
                        <div className="row">
                          <div className="col-2"></div>
                          <div class="col-10">
                            <TextField
                              InputLabelProps={{
                                sx: {
                                  fontWeight: "bold",
                                },
                              }}
                              label="Months"
                              id="outlined-size-small"
                              type="text"
                              size="small"
                              value={
                                subscriptionPackageObj?.inPriceOfMonthMonth ===
                                  "" ||
                                  subscriptionPackageObj?.inPriceOfMonthMonth ===
                                  null
                                  ? 0
                                  : subscriptionPackageObj?.inPriceOfMonthMonth
                              }
                              onChange={(e) => {
                                let inputValue = e.target.value;
                                // Remove non-numeric characters
                                inputValue = inputValue.replace(/[^\d]/g, "");
                                // Convert to number
                                let numericValue = parseInt(inputValue, 10);
                                // Restrict value to be between 0 and 24
                                if (isNaN(numericValue) || numericValue < 0) {
                                  numericValue = 0;
                                } else if (numericValue > 24) {
                                  numericValue = 24;
                                }
                                // Set the value
                                setSubscriptionPackageObj({
                                  ...subscriptionPackageObj,
                                  inPriceOfMonthMonth: numericValue.toString(),
                                });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>}

                </div>

                <label
                  style={{ display: "flex", justifyContent: "center" }}
                  className="validation"
                  id="ErrorMessage"
                >
                  {errorMessage}
                </label>
              </div>

              <hr />
              <Row class="modal-footer">
                <Col
                  style={{ paddingTop: "14px" }}
                  class="hstack gap-2 justify-content-end"
                >
                  <button
                    type="submit"
                    style={{ float: "right", paddingTop: "5px" }}
                    className="btn btn-md btn-success create-item-btn"
                    onClick={SubscriptionPackageAddUpdateBtnClicked}
                    disabled={DiscountPriceError}
                  >
                    <span>
                      {modelAction === "Add" ? "Add " + moduleName : "Update"}
                    </span>
                  </button>

                  <button
                    style={{
                      float: "right",
                      paddingTop: "5px",
                      marginRight: "10px",
                    }}
                    onClick={handleSubmit}
                    class="btn btn-md btn-light"
                  >
                    <span>Cancel</span>
                  </button>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>

      <SuccessModal
        handleClose={HandleClose}
        setOpenSuccessModal={setOpenSuccessModal}
        openSuccessModal={openSuccessModal}
        modelAction={modelAction}
        message={`Subscription package ${subscriptionPackageObj.packageName}`}
      />
    </div>
  );
}

export default SubscriptionPackageModel;
