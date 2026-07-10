/* global $ */
import React, { useEffect, useState, useRef, useContext } from "react";
import Select from "react-select";
import { useLocation } from "react-router-dom";
import SuccessModal from "../components/SuccessModal";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import FormGroup from "@mui/material/FormGroup";
import { Row, Col } from "reactstrap";
import { ERROR_MESSAGES } from "../components/GlobalMessage";
import { useSelector } from "react-redux";
import {
  AddUpdateSubscriptionPackage,
  GetSubscriptionPackageModel,
} from "../redux/Services/Subscription/PackageApi";
import { AuthContextProvider } from "../AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";
import BackButtonSvg from "../components/BackButtonSvg";
import Android12Switch from "../components/AndroidSwitch";
import { UpdateOrganisationSubscriptionPackageFromSuperAdmin } from "../redux/Services/Setting/Organisation";
function OrganisationSubscriptionPackageDetails(props) {
  console.log(props.subscriptionPackageObj);
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
    ospKeyID: null,
    isFreePackage: null,
    packageName: "",
    prepareQuote: true,
    sendQuote: true,
    quotesPerMonth: "",
    prepareContract: true,
    sendContract: true,
    signContract: true,
    eSignaturePerMonth: "",
    enablePdfToCsv: true,
    pages: null,
    yearlyValuePlan: "",
    // discountPercentageYear: "",
    // discountPercentageYearCheck: false,
    // discountPercentageMonth: "",
    // discountPercentageMonthCheck: false,
    // discountPriceYear: "",
    // discountPriceYearCheck: false,
    // discountPriceMonth: "",
    // discountPriceMonthCheck: false,
    // monthFreeYear: "",
    // monthFreeYearCheck: false,
    // monthFreeMonth: "",
    // monthFreeMonthCheck: false,
    // getMonthsYear: "",
    // getMonthsYearCheck: false,
    // getMonthsMonth: "",
    // getMonthsMonthCheck: false,
    // inPriceOfMonthYear: "",
    // inPriceOfMonthMonth: "",
    isMailBox: false,
    apiIntegration: true,
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
        : "Update",
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
      ospKeyID: null,
      packageName: "",
      prepareQuote: true,
      sendQuote: true,
      prepareContract: true,
      sendContract: true,
      signContract: true,
      eSignaturePerMonth: "",
      yearlyValuePlan: "",
      // discountPercentageYear: "",
      // discountPercentageMonth: "",
      // discountPriceYear: "",
      // discountPriceMonth: "",
      // monthFreeYear: "",
      // monthFreeMonth: "",
      // getMonthsYear: "",
      // getMonthsMonth: "",
      // inPriceOfMonthYear: "",
      // inPriceOfMonthMonth: "",
      isMailBox: false,
      apiIntegration: true,
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
            (offer) => offer.paymentFrequencyID === 1,
          )?.discountPrice;
          const monthFreeYear = ModelData.subscriptionOffers.find(
            (offer) => offer.paymentFrequencyID === 1,
          )?.monthFree;
          const getMonthsYear = ModelData.subscriptionOffers.find(
            (offer) => offer.paymentFrequencyID === 1,
          )?.getMonths;
          const inPriceOfMonthYear = ModelData.subscriptionOffers.find(
            (offer) => offer.paymentFrequencyID === 1,
          )?.inPriceOfMonth;
          const discountPercentageYear = ModelData.subscriptionOffers.find(
            (offer) => offer.paymentFrequencyID === 1,
          )?.discountPercentage;

          const discountPriceMonth = ModelData.subscriptionOffers.find(
            (offer) => offer.paymentFrequencyID === 4,
          )?.discountPrice;
          const monthFreeMonth = ModelData.subscriptionOffers.find(
            (offer) => offer.paymentFrequencyID === 4,
          )?.monthFree;
          const getMonthsMonth = ModelData.subscriptionOffers.find(
            (offer) => offer.paymentFrequencyID === 4,
          )?.getMonths;
          const inPriceOfMonthMonth = ModelData.subscriptionOffers.find(
            (offer) => offer.paymentFrequencyID === 4,
          )?.inPriceOfMonth;
          const discountPercentageMonth = ModelData.subscriptionOffers.find(
            (offer) => offer.paymentFrequencyID === 4,
          )?.discountPercentage;
          props.setSubscriptionPackageObj({
            ...props.subscriptionPackageObj,
            ospKeyID: ModelData.ospKeyID,
            apiIntegration: ModelData.apiIntegration,
            isFreePackage: ModelData.isFreePackage,
            subscriptionPackageKeyID: ModelData.subscriptionPackageKeyID,
            packageName: ModelData.packageName,
            prepareQuote: ModelData.prepareQuote,
            sendQuote: ModelData.sendQuote,
            quotesPerMonth: ModelData.quotesPerMonth,
            prepareContract: ModelData.prepareContract,
            sendContract: ModelData.sendContract,
            signContract: ModelData.signContract,
            eSignaturePerMonth: ModelData.eSignaturePerMonth,
            yearlyValuePlan: ModelData.yearlyValuePlan,
            isMailBox: ModelData.isMailBox,
            enablePdfToCsv: ModelData.enablePdfToCsv,
            pages: ModelData.noOfPages,
            discountPercentageYear:
              discountPercentageYear === undefined ? 0 : discountPercentageYear,
            discountPercentageYearCheck:
              discountPercentageYear === undefined
                ? false
                : discountPercentageYear > 0
                  ? true
                  : false,
            discountPercentageMonth:
              discountPercentageMonth === undefined
                ? 0
                : discountPercentageMonth,
            discountPercentageMonthCheck:
              discountPercentageMonth === undefined
                ? false
                : discountPercentageMonth > 0
                  ? true
                  : false,
            discountPriceYear:
              discountPriceYear === undefined ? 0 : discountPriceYear,
            discountPriceYearCheck:
              discountPriceYear === undefined
                ? false
                : discountPriceYear > 0
                  ? true
                  : false,
            discountPriceMonth:
              discountPriceMonth === undefined ? 0 : discountPriceMonth,
            discountPriceMonthCheck:
              discountPriceMonth === undefined
                ? false
                : discountPriceMonth > 0
                  ? true
                  : false,
            monthFreeYear: monthFreeYear === undefined ? 0 : monthFreeYear,
            monthFreeYearCheck:
              monthFreeYear === undefined
                ? false
                : monthFreeYear > 0
                  ? true
                  : false,
            monthFreeMonth: monthFreeMonth === undefined ? 0 : monthFreeMonth,
            monthFreeMonthCheck:
              monthFreeMonth === undefined
                ? false
                : monthFreeMonth > 0
                  ? true
                  : false,
            getMonthsYear: getMonthsYear === undefined ? 0 : getMonthsYear,
            getMonthsYearCheck:
              getMonthsYear === undefined
                ? false
                : getMonthsYear > 0
                  ? true
                  : false,
            getMonthsMonth: getMonthsMonth === undefined ? 0 : getMonthsMonth,
            getMonthsMonthCheck:
              getMonthsMonth === undefined
                ? false
                : getMonthsMonth > 0
                  ? true
                  : false,
            inPriceOfMonthYear:
              inPriceOfMonthYear === undefined ? 0 : inPriceOfMonthYear,
            inPriceOfMonthYearCheck:
              inPriceOfMonthYear === undefined ? 0 : inPriceOfMonthYear,
            inPriceOfMonthMonth:
              inPriceOfMonthMonth === undefined ? 0 : inPriceOfMonthMonth,
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
      props.subscriptionPackageObj.packageName === undefined ||
      props.subscriptionPackageObj.packageName === "" ||
      props.subscriptionPackageObj.packageName === null
    ) {
      scrollUpDownByElementID("PackageName");
      setRequireErrorMessage(true);
      return false; // Return false or handle your error logic here if needed.
    } else {
      setRequireErrorMessage(""); // Clear the error message if there are no errors.
    }
    if (
      props.subscriptionPackageObj.enablePdfToCsv &&
      (props.subscriptionPackageObj.noOfPages === undefined ||
        props.subscriptionPackageObj.noOfPages === "" ||
        props.subscriptionPackageObj.noOfPages === null)
    ) {
      scrollUpDownByElementID("Pages");
      setRequireErrorMessage(true);
      return false; // Return false or handle your error logic here if needed.
    } else {
      setRequireErrorMessage(""); // Clear the error message if there are no errors.
    }
    if (props.subscriptionPackageObj.sendContract === true) {
      if (Number(props.subscriptionPackageObj.eSignaturePerMonth) < 1) {
        scrollUpDownByElementID("ESignature");
        setRequireErrorMessageForESignature(true);
        return false;
      }
    }
    // if (subscriptionPackageObj.sendQuote === true) {
    //   if (Number(subscriptionPackageObj.quotesPerMonth) < 1) {
    //     scrollUpDownByElementID("QuotesPerMonth");
    //     setRequireErrorMessageForQuotesPerMonth(true);
    //     return false;
    //   }
    // }
    const { yearlyValuePlan, discountPriceMonth, discountPriceYear } =
      props.subscriptionPackageObj;

    // if (
    //   Number(yearlyValuePlan) > 20000 ||
    //   Number(discountPriceMonth) > 20000 ||
    //   Number(discountPriceYear) > 20000
    // ) {
    //   let exceededValue = "";

    //   if (Number(yearlyValuePlan) > 20000) {
    //     exceededValue = `The Yearly Plan Value (${yearlyValuePlan})`;
    //   } else if (Number(discountPriceMonth) > 20000) {
    //     exceededValue = `The Monthly Discount Price (${discountPriceMonth})`;
    //   } else if (Number(discountPriceYear) > 20000) {
    //     exceededValue = `The Yearly Discount Price (${discountPriceYear})`;
    //   }

    //   setErrorMessage(
    //     `${exceededValue
    //       ?.toString()
    //       .replace(
    //         /\B(?=(\d{3})+(?!\d))/g,
    //         ",",
    //       )} exceeds Stripe's transaction limit of £ 20,000. Please enter a lower amount.`,
    //   );

    //   scrollUpDownByElementID("ErrorMessage");
    //   return false;
    // }

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
      ospKeyId: props.subscriptionPackageObj.ospKeyID, //will change module wise

      //form level params : will change according to module
      apiIntegration: props.subscriptionPackageObj.apiIntegration,
      // packageName: props.subscriptionPackageObj.packageName,
      prepareQuote: props.subscriptionPackageObj.prepareQuote,
      sendQuote: props.subscriptionPackageObj.sendQuote,
      quotesPerMonth:
        props.subscriptionPackageObj.quotesPerMonth === ""
          ? null
          : props.subscriptionPackageObj.quotesPerMonth,
      prepareContract: props.subscriptionPackageObj.prepareContract,
      enablePdfToCsv: props.subscriptionPackageObj.enablePdfToCsv,
      noOfPages: props.subscriptionPackageObj.noOfPages
        ? props.subscriptionPackageObj.noOfPages
        : 0,
      sendContract: props.subscriptionPackageObj.sendContract,
      signContract: props.subscriptionPackageObj.sendContract,
      isMailBox: props.subscriptionPackageObj.isMailBox,
      eSignaturePerMonth:
        props.subscriptionPackageObj.eSignaturePerMonth === ""
          ? null
          : props.subscriptionPackageObj.eSignaturePerMonth,
      yearlyValuePlan:
        props.subscriptionPackageObj.yearlyValuePlan === ""
          ? null
          : Number(props.subscriptionPackageObj.yearlyValuePlan),

      // subscriptionOffers: subscriptionPackageObj.isFreePackage
      //   ? null
      //   : [
      //       {
      //         paymentFrequencyID: 4, // Monthly
      //         discountPercentage:
      //           subscriptionPackageObj.discountPercentageMonthCheck
      //             ? subscriptionPackageObj.discountPercentageMonth === ""
      //               ? null
      //               : Number(subscriptionPackageObj.discountPercentageMonth)
      //             : 0,
      //         discountPrice: subscriptionPackageObj.discountPriceMonthCheck
      //           ? subscriptionPackageObj.discountPriceMonth === ""
      //             ? null
      //             : Number(subscriptionPackageObj.discountPriceMonth)
      //           : 0,
      //         monthFree: subscriptionPackageObj.monthFreeMonthCheck
      //           ? subscriptionPackageObj.monthFreeMonth === ""
      //             ? null
      //             : Number(subscriptionPackageObj.monthFreeMonth)
      //           : 0,
      //         getMonths: subscriptionPackageObj.getMonthsMonthCheck
      //           ? subscriptionPackageObj.getMonthsMonth === ""
      //             ? null
      //             : Number(subscriptionPackageObj.getMonthsMonth)
      //           : 0,
      //         inPriceOfMonth:
      //           subscriptionPackageObj.inPriceOfMonthMonth === ""
      //             ? null
      //             : Number(subscriptionPackageObj.inPriceOfMonthMonth),
      //       },
      //       {
      //         paymentFrequencyID: 1, // Yearly
      //         discountPercentage:
      //           subscriptionPackageObj.discountPercentageYearCheck
      //             ? subscriptionPackageObj.discountPercentageYear === ""
      //               ? null
      //               : Number(subscriptionPackageObj.discountPercentageYear)
      //             : 0,
      //         discountPrice: subscriptionPackageObj.discountPriceYearCheck
      //           ? subscriptionPackageObj.discountPriceYear === ""
      //             ? null
      //             : Number(subscriptionPackageObj.discountPriceYear)
      //           : 0,
      //         monthFree: subscriptionPackageObj.monthFreeYearCheck
      //           ? subscriptionPackageObj.monthFreeYear === ""
      //             ? null
      //             : Number(subscriptionPackageObj.monthFreeYear)
      //           : 0,
      //         getMonths: subscriptionPackageObj.getMonthsYearCheck
      //           ? subscriptionPackageObj.getMonthsYear === ""
      //             ? null
      //             : Number(subscriptionPackageObj.getMonthsYear)
      //           : 0,
      //         inPriceOfMonth:
      //           subscriptionPackageObj.inPriceOfMonthYear === ""
      //             ? null
      //             : Number(subscriptionPackageObj.inPriceOfMonthYear),
      //       },
      //     ],
    };
    AddUpdateSubscriptionPackageData(ApiRequest_ParamsObj);
    const modalEl = document.getElementById(
      "OrganisationSubscriptionPackageDetails",
    );
    window.bootstrap.Modal.getInstance(modalEl)?.hide();
    // console.log("ApiRequest_ParamsObj", ApiRequest_ParamsObj);
  };

  // 3) Add Update Subscription package Data Api
  const AddUpdateSubscriptionPackageData = async (ApiRequest_ParamsObj) => {
    setLoader(true);
    try {
      const response =
        await UpdateOrganisationSubscriptionPackageFromSuperAdmin(
          ApiRequest_ParamsObj,
        );
      if (response) {
        if (response?.data?.statusCode === 200) {
          $("#" + props.id).modal("hide");
          // uncomment upper code for hide
          setLoader(false);
        } else {
          setLoader(false);
          setErrorMessage(response?.response?.data?.errorMessage);
        }
      }
    } catch (error) {
      setLoader(false);
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
    const prepareQuoteValue = !props.subscriptionPackageObj.prepareQuote;
    props.setSubscriptionPackageObj({
      ...props.subscriptionPackageObj,
      prepareQuote: prepareQuoteValue,
      sendQuote: prepareQuoteValue
        ? props.subscriptionPackageObj.sendQuote
        : false,
      quotesPerMonth: prepareQuoteValue
        ? props.subscriptionPackageObj?.quotesPerMonth
        : 0,
    });
  };
  const handleApiIntegrationChange = (e) => {
    const prepareQuoteValue = !props.subscriptionPackageObj.apiIntegration;
    props.setSubscriptionPackageObj({
      ...props.subscriptionPackageObj,
      apiIntegration: prepareQuoteValue,
    });
  };
  const handleSendQuoteChange = (e) => {
    if (props.subscriptionPackageObj.prepareQuote) {
      props.setSubscriptionPackageObj({
        ...props.subscriptionPackageObj,
        sendQuote: !props.subscriptionPackageObj.sendQuote,
      });
    }
  };

  const handlePrepareELChange = (e) => {
    const prepareElValue = !props.subscriptionPackageObj.prepareContract;
    props.setSubscriptionPackageObj({
      ...props.subscriptionPackageObj,
      prepareContract: prepareElValue,
      sendContract: prepareElValue
        ? props.subscriptionPackageObj.sendContract
        : false,
      eSignaturePerMonth: prepareElValue
        ? props.subscriptionPackageObj.eSignaturePerMonth
        : "",
    });
  };
  const handlePDFToCSVChange = (e) => {
    const EnablePDFToCSVValue = !props.subscriptionPackageObj.enablePdfToCsv;

    props.setSubscriptionPackageObj((prev) => ({
      ...prev,
      enablePdfToCsv: EnablePDFToCSVValue,
    }));
  };

  const handleSendELChange = (e) => {
    if (props.subscriptionPackageObj.prepareContract) {
      const sendContract = !props.subscriptionPackageObj.sendContract;
      props.setSubscriptionPackageObj({
        ...props.subscriptionPackageObj,
        sendContract: sendContract,
        eSignaturePerMonth: sendContract
          ? props.subscriptionPackageObj.eSignaturePerMonth
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
      <div
        className="modal fade"
        id="OrganisationSubscriptionPackageDetails"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header  p-3">
              <h5 class="modal-title" id="exampleModalLabel">
                {props.title}
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="close-modal"
              ></button>
            </div>

            <div class="tab-content">
              <div className="container-fluid">
                <div className="row" id="PackageName">
                  <div className="col-lg-6">
                    <label>
                      {moduleName} Name
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                  <div className="col-12 mt-1">
                    <input
                      readOnly
                      type="text"
                      className="input-text"
                      placeholder={`${moduleName} Name`}
                      value={props.subscriptionPackageObj?.packageName}
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
                          props.setSubscriptionPackageObj({
                            ...props.subscriptionPackageObj,
                            packageName: capitalizedValue,
                          });
                        }
                      }}
                    />

                    {requireErrorMessage &&
                    props.subscriptionPackageObj.packageName === "" ? (
                      <label className="validation">{ERROR_MESSAGES}</label>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="row p-2">
                  <div className="fieldset-group ">
                    <label className="fieldset-group-label required">
                      API Integration
                    </label>
                    <div class="row">
                      <div class="col-lg-3 col-md-3 col-sm-6 text-start text-md-end mt-2">
                        <label class="form-label">API Integration</label>
                      </div>
                      <div
                        class="col-lg-3 col-md-3 col-sm-6"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <div style={{ width: "40px", marginBottom: "5px" }}>
                          {props.subscriptionPackageObj.apiIntegration
                            ? "Yes"
                            : "No"}
                        </div>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Android12Switch
                                checked={
                                  props.subscriptionPackageObj.apiIntegration
                                }
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
                  <div className="fieldset-group " id="QuotesPerMonth">
                    <label className="fieldset-group-label required">
                      {proposalName}
                    </label>
                    <div class="row">
                      <div class="col-lg-3 col-md-3 col-sm-6 text-start text-md-end mt-2">
                        <label class="form-label">Prepare {proposalName}</label>
                      </div>
                      <div
                        class="col-lg-3 col-md-3 col-sm-6"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <div style={{ width: "40px", marginBottom: "5px" }}>
                          {props.subscriptionPackageObj.prepareQuote
                            ? "Yes"
                            : "No"}
                        </div>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Android12Switch
                                checked={
                                  props.subscriptionPackageObj.prepareQuote
                                }
                                onClick={handlePrepareQuoteChange}
                              />
                            }
                          />
                        </FormGroup>
                      </div>
                      {/* </div>

                      <div class="row"> */}
                      <div class="col-lg-3 col-md-3 col-sm-6 text-start text-md-end mt-2">
                        <label class="form-label">Send {proposalName}</label>
                      </div>
                      <div
                        class="col-lg-3 col-md-3 col-sm-6"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <div style={{ width: "40px", marginBottom: "5px" }}>
                          {props.subscriptionPackageObj.sendQuote
                            ? "Yes"
                            : "No"}
                        </div>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Android12Switch
                                checked={props.subscriptionPackageObj.sendQuote}
                                onClick={handleSendQuoteChange}
                                disabled={
                                  !props.subscriptionPackageObj.prepareQuote
                                }
                              />
                            }
                          />
                        </FormGroup>
                      </div>
                      {subscriptionPackageObj.prepareQuote === true && (
                        <>
                          <div className=" col-6 p-2">
                            <TextField
                              InputLabelProps={{
                                sx: {
                                  fontWeight: "bold",
                                },
                              }}
                              label="Proposals per month"
                              id="outlined-basic"
                              variant="outlined"
                              type="text"
                              size="small"
                              value={
                                props.subscriptionPackageObj?.quotesPerMonth ===
                                  "" ||
                                props.subscriptionPackageObj?.quotesPerMonth ===
                                  null
                                  ? ""
                                  : props.subscriptionPackageObj?.quotesPerMonth
                                      ?.toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                              }
                              onChange={(e) => {
                                let inputValue = e.target.value;
                                // Remove leading zeros
                                inputValue = inputValue.replace(
                                  /^0+(?=\d)/,
                                  "",
                                );
                                // Remove non-numeric characters except decimal point
                                inputValue = inputValue.replace(/[^\d]/g, "");
                                // Limit to 12 digits before the decimal point
                                if (inputValue.includes(".")) {
                                  const [integerPart, decimalPart] =
                                    inputValue.split(".");
                                  inputValue = `${integerPart.slice(
                                    0,
                                    7,
                                  )}.${decimalPart.slice(0, 2)}`;
                                } else {
                                  inputValue = inputValue.slice(0, 7);
                                }

                                props.setSubscriptionPackageObj({
                                  ...props.subscriptionPackageObj,
                                  quotesPerMonth: inputValue,
                                });
                              }}
                              disabled={
                                !(
                                  props.subscriptionPackageObj.sendQuote &&
                                  props.subscriptionPackageObj.prepareQuote
                                )
                              }
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="fieldset-group" id="ESignature">
                  <label htmlFor="" className="fieldset-group-label required">
                    {EngagementName}
                  </label>
                  <div class="row">
                    <div class="col-lg-3 col-md-3 col-sm-6 text-start text-md-end mt-2">
                      <label class="form-label">Prepare {EngagementName}</label>
                    </div>
                    <div
                      class="col-lg-3 col-md-3 col-sm-6"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <div style={{ width: "40px", marginBottom: "5px" }}>
                        {props.subscriptionPackageObj.prepareContract
                          ? "Yes"
                          : "No"}
                      </div>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Android12Switch
                              checked={
                                props.subscriptionPackageObj.prepareContract
                              }
                              onClick={handlePrepareELChange}
                            />
                          }
                        />
                      </FormGroup>
                    </div>
                    {/* </div>

                      <div class="row"> */}
                    <div class="col-lg-3 col-md-3 col-sm-6 text-start text-md-end mt-2">
                      <label class="form-label">
                        Send And Digitally Sign The {EngagementName}
                      </label>
                    </div>
                    <div
                      class="col-lg-3 col-md-3 col-sm-6"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <div style={{ width: "40px", marginBottom: "5px" }}>
                        {props.subscriptionPackageObj.sendContract
                          ? "Yes"
                          : "No"}
                      </div>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Android12Switch
                              checked={
                                props.subscriptionPackageObj.sendContract
                              }
                              onClick={handleSendELChange}
                              disabled={
                                !props.subscriptionPackageObj.prepareContract
                              }
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
                          props.subscriptionPackageObj.eSignaturePerMonth ===
                            "" ||
                          props.subscriptionPackageObj.eSignaturePerMonth ===
                            null
                            ? 0
                            : props.subscriptionPackageObj.eSignaturePerMonth
                                ?.toString()
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
                              7,
                            )}.${decimalPart.slice(0, 2)}`;
                          } else {
                            inputValue = inputValue.slice(0, 7);
                          }

                          props.setSubscriptionPackageObj({
                            ...props.subscriptionPackageObj,
                            eSignaturePerMonth: inputValue,
                          });
                        }}
                        disabled={
                          !(
                            props.subscriptionPackageObj.sendContract &&
                            props.subscriptionPackageObj.prepareContract
                          )
                        }
                      />
                    </div>
                    {requireErrorMessageForESignature &&
                    props.subscriptionPackageObj.sendContract &&
                    Number(props.subscriptionPackageObj.eSignaturePerMonth) <
                      1 ? (
                      <label className="validation mb-1">
                        The E-Signature per month must be at least 1.
                      </label>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                {/* PDF TO CSV Starts */}
                <div className="fieldset-group" id="ESignature">
                  <label htmlFor="" className="fieldset-group-label required">
                    PDF To CSV
                  </label>
                  <div class="row">
                    <div class="col-lg-3 col-md-3 col-sm-6 text-start text-md-end mt-2">
                      <label class="form-label">
                        Enable PDF to CSV Conversion
                      </label>
                    </div>
                    <div
                      class="col-lg-3 col-md-3 col-sm-6"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <div style={{ width: "40px", marginBottom: "5px" }}>
                        {props.subscriptionPackageObj.enablePdfToCsv
                          ? "Yes"
                          : "No"}
                      </div>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Android12Switch
                              checked={
                                props.subscriptionPackageObj.enablePdfToCsv
                              }
                              onClick={handlePDFToCSVChange}
                            />
                          }
                        />
                      </FormGroup>
                    </div>

                    {/* Pages per month Current */}

                    <div class="col-lg-6 col-md-6 col-sm-6 text-start text-md-end mt-2 p-2">
                      <TextField
                        label={<span>Pages per month </span>}
                        id="outlined-basic"
                        variant="outlined"
                        type="text"
                        InputLabelProps={{
                          sx: {
                            fontWeight: "bold",
                          },
                        }}
                        size="small"
                        // value={subscriptionPackageObj?.pages}
                        value={
                          props.subscriptionPackageObj?.noOfPages === "" ||
                          props.subscriptionPackageObj?.noOfPages === null
                            ? 0
                            : props.subscriptionPackageObj?.noOfPages
                                ?.toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        onChange={(e) => {
                          setErrorMessage("");
                          let inputValue = e.target.value;

                          // Remove all non-digit characters (including decimal point)
                          inputValue = inputValue.replace(/\D/g, ""); // \D = anything not a digit

                          // Remove leading zeros
                          inputValue = inputValue.replace(/^0+/, "");

                          // Limit to maximum 7 digits (or any limit you want)
                          inputValue = inputValue.slice(0, 7);

                          props.setSubscriptionPackageObj({
                            ...props.subscriptionPackageObj,
                            noOfPages: inputValue,
                          });
                        }}
                      />
                      {requireErrorMessage &&
                      (props.subscriptionPackageObj.noOfPages === "" ||
                        props.subscriptionPackageObj.noOfPages === undefined ||
                        props.subscriptionPackageObj.noOfPages === null) ? (
                        <label className="validation">{ERROR_MESSAGES}</label>
                      ) : (
                        ""
                      )}
                    </div>

                    {/* Pages per month E# */}
                    {/* <div
                        className="col-2"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <label className="text-center">
                          Pages
                          <span className="text-danger">*</span>
                        </label>
                      </div>
                      <div className="col-4 ">
                        <input
                          type="text"
                          className="input-text"
                          placeholder="Pages"
                          value={subscriptionPackageObj?.pages}
                          onChange={(e) => {
                            setErrorMessage("");
                            let inputValue = e.target.value;

                            // Remove all non-digit characters (including decimal point)
                            inputValue = inputValue.replace(/\D/g, ""); // \D = anything not a digit

                            // Remove leading zeros
                            inputValue = inputValue.replace(/^0+/, "");

                            // Limit to maximum 7 digits (or any limit you want)
                            inputValue = inputValue.slice(0, 7);

                            setSubscriptionPackageObj({
                              ...subscriptionPackageObj,
                              pages: inputValue,
                            });
                          }}
                        />

                        {requireErrorMessage &&
                        (subscriptionPackageObj.pages === "" ||
                          subscriptionPackageObj.pages === undefined ||
                          subscriptionPackageObj.pages === null) ? (
                          <label className="validation">{ERROR_MESSAGES}</label>
                        ) : (
                          ""
                        )}
                      </div> */}
                  </div>
                </div>
                {/* PDF TO CSV Ends */}
                <div className="fieldset-group">
                  <label htmlFor="" className="fieldset-group-label required">
                    Other
                  </label>
                  <div class="row">
                    <div class="col-lg-3 col-md-3 col-sm-6 text-start text-md-end mt-2">
                      <label class="form-label">
                        Personalized Outgoing Mailbox
                      </label>
                    </div>
                    <div
                      class="col-lg-3 col-md-3 col-sm-6"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <div style={{ width: "40px", marginBottom: "5px" }}>
                        {props.subscriptionPackageObj.isMailBox ? "Yes" : "No"}
                      </div>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Android12Switch
                              checked={props.subscriptionPackageObj.isMailBox}
                              onClick={(e) => {
                                props.setSubscriptionPackageObj({
                                  ...props.subscriptionPackageObj,
                                  isMailBox:
                                    !props.subscriptionPackageObj.isMailBox,
                                });
                              }}
                            />
                          }
                        />
                      </FormGroup>
                    </div>
                    {/* <div class="col-lg-6 col-md-6 col-sm-6 text-start text-md-end mt-2 p-2">
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
                            setErrorMessage("");
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
                                7,
                              )}.${decimalPart.slice(0, 2)}`;
                            } else {
                              inputValue = inputValue.slice(0, 7);
                            }
                            setDiscountPriceError(false);
                            // Add commas to the number
                            inputValue = inputValue;
                            setSubscriptionPackageObj({
                              ...subscriptionPackageObj,
                              yearlyValuePlan: inputValue,
                            });
                          }}
                        />
                      </div> */}
                  </div>
                </div>
                <div className="fieldset-group">
                  <label htmlFor="" className="fieldset-group-label required">
                    Fees
                  </label>
                  <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-6 text-start mt-2 p-2">
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
                        InputProps={{ readOnly: true }}
                        value={
                          props.subscriptionPackageObj?.yearlyValuePlan ===
                            "" ||
                          props.subscriptionPackageObj?.yearlyValuePlan === null
                            ? 0
                            : props.subscriptionPackageObj?.yearlyValuePlan
                                ?.toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        onChange={(e) => {
                          setErrorMessage("");
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
                              7,
                            )}.${decimalPart.slice(0, 2)}`;
                          } else {
                            inputValue = inputValue.slice(0, 7);
                          }
                          setDiscountPriceError(false);
                          // Add commas to the number
                          inputValue = inputValue;
                          props.setSubscriptionPackageObj({
                            ...props.subscriptionPackageObj,
                            yearlyValuePlan: inputValue,
                          });
                        }}
                      />
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6"></div>
                  </div>
                </div>
              </div>
            </div>
            <label
              style={{ display: "flex", justifyContent: "center" }}
              className="validation mt-2"
              id="ErrorMessage"
            >
              {errorMessage}
            </label>
            <hr />
            <Row class="modal-footer align-items-center">
              <Col
                // style={{ paddingTop: "10px" }}
                class="hstack gap-2 justify-content-end"
              >
                <button
                  type="button"
                  // data-bs-dismiss="modal"
                  // aria-label="Close"
                  // id="close-modal"
                  style={{
                    float: "right",
                    marginRight: "4px",
                    marginBottom: "4px",
                  }}
                  className="btn btn-md btn-success create-item-btn"
                  onClick={SubscriptionPackageAddUpdateBtnClicked}
                >
                  <span>Update</span>
                </button>
              </Col>
            </Row>
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

export default OrganisationSubscriptionPackageDetails;
