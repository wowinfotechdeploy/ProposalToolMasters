/* global $ */
import React, { useState, useRef, useContext, useEffect } from "react";
import "./EmailConfigStyle.css";
import {
  EmailTypeList,
  AddUpdateEmailConfig,
  GetEmailConfigModel,
  AddUpdateUserEmailConfig,
  GetUserEmailConfigModel,
  SendEmailVerificationLinkForAwsSesConfiguration,
} from "../../../redux/Services/Setting/EmailConfigApi";
import { useSelector } from "react-redux";
import SuccessModal from "../../../components/SuccessModal";
import { AuthContextProvider } from "../../../AuthContext/AuthContext";
import Footer from "../../../components/Footer";
import { ERROR_MESSAGES, OutBooksTitle } from "../../../components/GlobalMessage";
import ErrorModel from "../../../components/ErrorModel";
import DropDown from "../../../components/DropDown";
import emailProviders from "./Email-Json";
import InstructionModal from "./InstructionModel";
import Android12Switch from "../../../components/AndroidSwitch";
import { FormControlLabel, FormGroup, Tooltip } from "@mui/material";
import ConfirmModel from "../../../components/ConfirmationBox";
import { EmailProviderEnum } from "../../../Middleware/enums";
import ViewPlan from "../../../components/ViewPlan";
const Email_Config = () => {
  // A] States Declaration :
  const modalRef = useRef(null);
  // const [modelAction, setModelAction] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [openErrorModal, setOpenErrorModal] = React.useState(false);
  const [dismissModal, setDismissModal] = useState(null);
  const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
  const [modelAction, setModelAction] = useState("");
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const { proposalName, setLoader, setTopbar, userAccessData, EngagementName, activeOrganizationSubscriptionPlan } =
    useContext(AuthContextProvider);
  const [showSMTPInput, setShowSMTPInput] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSMTPPortInput, setShowSMTPPortInput] = useState(false);
  const [requireOwnSMTPErrorMessage, setRequireOwnSMTPErrorMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [configureTypeValue1, setConfigureTypeValue1] = useState("");
  const [modelRequestData, setModelRequestData] = useState({
    userKeyID: null,
    organisationKeyID: null,
    status: "",
    Action: "",
    moduleName: ""
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(""); // State for alert message
  const [isEnabled, setIsEnabled] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [emailType, setEmailType] = useState([]);
  const [userEmailConfigObj, setUserEmailConfigObj] = useState({
    userKeyID: null,
    organisationKeyID: null,
    senderEmailID: "",
    password: "",
    displayName: "",
    isSsl: true,
    smtpServer: "",
    smtpPort: null,
    emailProviderID: "",
    isEnableMailBox: false,
    resetEmailConfig: null,
    smtpServerTypeID: null,
    senderEmailIDForOutbooks: null,
    isEmailVerified: null
  });
  const [emailConfigObj, setEmailConfigObj] = useState({
    userKeyID: null,
    quoteCC: "",
    quoteBCC: "",
    contractCC: "",
    contractBCC: "",
  });

  const [PreEmailConfigObj, setPrevEmailConfigObj] = useState({
    userKeyID: null,
    quoteCC: "",
    quoteBCC: "",
    contractCC: "",
    contractBCC: "",
  });
  const [PreUserEmailConfigObj, setPrevUserEmailConfigObj] = useState({
    userKeyID: null,
    organisationKeyID: null,
    senderEmailID: "",
    password: "",
    displayName: "",
    isSsl: true,
    smtpServer: "",
    smtpPort: null,
    emailProviderID: null,
    isEnableMailBox: false,
    resetEmailConfig: null,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [PrevError, setPrevError] = useState(false);
  const [userPrevError, setUserPrevError] = useState(false);
  const common = useSelector((state) => state.Storage); //Getting Logged Users Details From Persist Storage of redux hooks

  const [requireErrorMessage, setRequireErrorMessage] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleReset = () => {
    setEmailConfigObj({
      userKeyID: null,
      quoteCC: undefined,
      quoteBCC: undefined,
      contractCC: undefined,
      contractBCC: undefined,
    });
    setRequireErrorMessage(false);
  };

  // B] Initial useEffect : Will call when Add/Update button click from list page

  useEffect(() => {
    setTopbar("block");
    GetEmailConfigureTypeData();
  }, []);

  useEffect(() => {
    if (common.organisationKeyID !== null) {
      GetEmailConfigModelData(common.organisationKeyID);
      GetUserEmailConfigModelData(common.organisationKeyID);
    }
  }, [common.organisationKeyID]);

  // F] Calling CRUD Api here
  // 1) Get Model Data Api
  const GetEmailConfigModelData = async (id) => {
    if (!id) {
      return;
    }
    try {
      const data = await GetEmailConfigModel(id);
      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          const ModelData = data?.data?.responseData?.data;
          setEmailConfigObj({
            ...emailConfigObj,
            userKeyID: common.userKeyID,
            quoteCC: ModelData.quoteCC,
            quoteBCC: ModelData.quoteBCC,
            contractCC: ModelData.contractCC,
            contractBCC: ModelData.contractBCC,
          });
          setPrevEmailConfigObj({
            ...PreEmailConfigObj,
            userKeyID: common.userKeyID,
            quoteCC: ModelData.quoteCC,
            quoteBCC: ModelData.quoteBCC,
            contractCC: ModelData.contractCC,
            contractBCC: ModelData.contractBCC,
          });
        }
      } else {
        setErrorMessage(data?.data?.errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const GetEmailConfigureTypeData = async () => {
    setLoader(true);
    //Driver Type Api
    try {
      const response = await EmailTypeList();
      if (response) {
        setLoader(false);
        const EmailTypeData = response?.data?.responseData.data;
        setEmailType(EmailTypeData);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  let emailTypeValue;

  emailTypeValue = emailType?.map((DriverType) => ({
    value: DriverType.epid,
    label: DriverType.emailProviderName,
    smtpServer: DriverType.smtpServer,
    smtpPort: DriverType.smtpPort,
  }));

  const GetUserEmailConfigModelData = async (id) => {
    if (!id) {
      return;
    }
    setLoader(true);
    try {
      const data = await GetUserEmailConfigModel(id);
      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          const ModelData = data?.data?.responseData?.data;

          setShowSMTPInput(
            ModelData.emailProviderID === EmailProviderEnum.Other ? true : false
          );
          setShowSMTPPortInput(
            ModelData.emailProviderID === EmailProviderEnum.Other ? true : false
          );

          setUserEmailConfigObj({
            ...userEmailConfigObj,
            userKeyID: common.userKeyID,
            organisationKeyID: ModelData.organisationKeyID,
            senderEmailID: ModelData.senderEmailID,
            password: ModelData.password,
            smtpServer: ModelData.smtpServer,
            isSsl: ModelData.isSsl,
            smtpPort: ModelData.smtpPort, //=== 0 ? null : ModelData.smtpPort,
            displayName: ModelData.displayName,
            emailProviderID:
              ModelData.emailProviderID !== null
                ? ModelData.emailProviderID
                : "",
            isEnableMailBox: ModelData.isEnableMailBox,
            isEmailVerified: ModelData.isEmailVerified,
            senderEmailIDForOutbooks: ModelData.senderEmailIDForOutbooks,
            smtpServerTypeID: ModelData.smtpServerTypeID
          });
          setPrevUserEmailConfigObj((prevState) => ({
            ...prevState,
            userKeyID: common.userKeyID,
            organisationKeyID: ModelData.organisationKeyID,
            senderEmailID: ModelData.senderEmailID,
            password: ModelData.password,
            smtpServer: ModelData.smtpServer,
            isSsl: ModelData.isSsl,
            smtpPort: ModelData.smtpPort,
            displayName: ModelData.displayName,
            isEnableMailBox: ModelData.isEnableMailBox,
            emailProviderID:
              ModelData.emailProviderID !== null
                ? ModelData.emailProviderID
                : "",
          }));
          setIsEnabled(ModelData.isEnableMailBox);
        }
        setLoader(false);
      } else {
        setLoader(false);
        setErrorMessage(data?.data?.errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const EmailConfigBtnClicked = (resetEmailConfig) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userEmailConfigObj) {
      console.error("userEmailConfigObj is not defined");
      return;
    }
    setRequireErrorMessage(false);
    setErrorMessage("");
    setModelAction(null);
    let hasError = false;
    const {
      senderEmailID,
      password,
      smtpPort,
      smtpServer,
      displayName,
      emailProviderID,
      isEnableMailBox,
      smtpServerTypeID,
      senderEmailIDForOutbooks,
      isEmailVerified
    } = userEmailConfigObj;
    if (modelRequestData.moduleName === "DefaultEmailConfig") {
      if (resetEmailConfig) {
        if (
          !senderEmailIDForOutbooks
        ) {
          // setErrorMessage("All fields are already empty. No action needed.");
          setOpenErrorModal(true);
          setErrorMessage("");
          setRequireErrorMessage(false);
          return;
        }
        setUserEmailConfigObj({
          ...userEmailConfigObj,
          senderEmailIDForOutbooks: "",
        });
      }

      if (!resetEmailConfig) {
        if (
          senderEmailIDForOutbooks === "" ||
          senderEmailIDForOutbooks === undefined ||
          senderEmailIDForOutbooks === null
        ) {
          hasError = true;
          setRequireErrorMessage(true);
          return;
        } else if (
          senderEmailIDForOutbooks === "" ||
          senderEmailIDForOutbooks === undefined ||
          (senderEmailIDForOutbooks !== "" &&
            senderEmailIDForOutbooks !== undefined &&
            !emailPattern.test(senderEmailIDForOutbooks))

        ) {
          hasError = true;
          setRequireErrorMessage(true);
          return;
        }

        // Validate SMTP Server
        if (!validateSmtpServer(smtpServer?.trim())) {
          setRequireErrorMessage(true);
          hasError = true;
        }

        if (hasError) {
          return;
        }
        setRequireOwnSMTPErrorMessage(false)
        // Check for unchanged values
        if (
          PreUserEmailConfigObj.senderEmailIDForOutbooks === senderEmailIDForOutbooks
        ) {
          setUserPrevError(true);
          return false;
        }
      }
      $("#" + "ConfirmModel").modal("hide");
      VerifyEmailID(resetEmailConfig)
    } else {
      // Check if fields are empty for reset action
      if (resetEmailConfig) {
        if (
          !senderEmailID &&
          !password &&
          !smtpPort &&
          !smtpServer &&
          !displayName
        ) {
          // setErrorMessage("All fields are already empty. No action needed.");
          setOpenErrorModal(true);
          setErrorMessage("");
          setRequireErrorMessage(false);
          return;
        }
        setUserEmailConfigObj({
          ...userEmailConfigObj,
          userKeyID: null,
          organisationKeyID: null,
          senderEmailID: "",
          password: "",
          displayName: "",
          isSsl: null,
          smtpServer: "",
          smtpPort: null,
          emailProviderID: null,
          isEnableMailBox: null,

        });
      }

      if (!resetEmailConfig) {
        if (
          senderEmailID === "" ||
          password === "" ||
          smtpPort === "" ||
          smtpServer === "" ||
          displayName === "" ||
          senderEmailID === undefined ||
          password === undefined ||
          smtpPort === undefined ||
          smtpServer === undefined ||
          displayName === undefined ||
          senderEmailID === null ||
          password === null ||
          smtpPort === null ||
          smtpServer === null ||
          displayName === null
        ) {
          hasError = true;
          setRequireErrorMessage(true);
          return;
        } else if (
          senderEmailID === "" ||
          password === "" ||
          displayName === "" ||
          senderEmailID === undefined ||
          (senderEmailID !== "" &&
            senderEmailID !== undefined &&
            !emailPattern.test(senderEmailID)) ||
          password === undefined ||
          displayName === undefined
        ) {
          hasError = true;
          setRequireErrorMessage(true);
          return;
        }

        // Validate SMTP Server
        if (!validateSmtpServer(smtpServer?.trim())) {
          setRequireErrorMessage(true);
          hasError = true;
        }

        if (hasError) {
          return;
        }

        // Check for unchanged values
        if (
          PreUserEmailConfigObj.senderEmailID === senderEmailID &&
          PreUserEmailConfigObj.password === password &&
          PreUserEmailConfigObj.smtpPort === smtpPort &&
          PreUserEmailConfigObj.smtpServer === smtpServer &&
          PreUserEmailConfigObj.displayName === displayName &&
          PreUserEmailConfigObj.isEnableMailBox === isEnableMailBox
        ) {
          setUserPrevError(true);
          return false;
        }
      }
      $("#" + "ConfirmModel").modal("hide");
      setRequireErrorMessage(false)
      // Perform API request
      const ApiRequest_ParamsObj = {
        organisationKeyID: common.organisationKeyID,
        userKeyID: common.userKeyID,
        senderEmailID,
        password,
        smtpServer,
        isSsl: true,
        smtpPort,
        displayName,
        emailProviderID,
        smtpServerTypeID,
        isEnableMailBox: userEmailConfigObj.isEnableMailBox,
        resetEmailConfig: resetEmailConfig,
      };
      AddUpdateUserEmailConfigData(ApiRequest_ParamsObj);
    }
  };

  const AddUpdateUserEmailConfigData = async (apiRequestParams) => {
    setLoader(true);
    try {
      let url = "/AddUpdateOrganisationEmail";
      if (apiRequestParams.Action == "Update") {
        url = `AddUpdateOrganisationEmail?Action=${apiRequestParams.Action}`;
      }
      const response = await AddUpdateUserEmailConfig(url, apiRequestParams);
      if (response) {
        setLoader(false);
        if (response?.data?.statusCode === 200) {
          if (apiRequestParams.Action === "Update") {
            setOpenSuccessModal(true);
            setIsAddUpdateActionDone(true);

            GetUserEmailConfigModelData(common.organisationKeyID);
          } else {
            setOpenSuccessModal(true);
            setIsAddUpdateActionDone(true);
            GetUserEmailConfigModelData(common.organisationKeyID);
          }
        } else {
          setErrorMessage(response.response.data.errorMessage);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 2) Add Update Button Click Function
  const EmailConfigAddUpdateBtnClicked = (action) => {
    if (activeOrganizationSubscriptionPlan?.isMailBox !== true) {
      setShowModal(true);
      return;
    }
    setModelRequestData({ ...modelRequestData, Action: action });
    setModelAction(null);

    if (action === "ClearCcBcc") {
      // Check if all fields are already empty
      if (
        (emailConfigObj.quoteCC === null) &&
        emailConfigObj.quoteBCC === null &&
        emailConfigObj.contractCC === null &&
        emailConfigObj.contractBCC === null
      ) {
        // Show an error message using the existing ErrorModel
        setOpenErrorModal(true);
        setPrevError(false);
        return;
      }
      // For Clear action, set all fields to null
      const ApiRequest_ParamsObj = {
        organisationKeyID: common.organisationKeyID,
        userKeyID: common.userKeyID,
        quoteCC: null,
        quoteBCC: null,
        contractCC: null,
        contractBCC: null,
      };
      AddUpdateEmailConfigData(ApiRequest_ParamsObj);
      return;
    }
    //Check Validations will be done here
    const emailPattern = /^\S+@\S+\.\S+$/;
    if (
      PreEmailConfigObj.quoteCC == emailConfigObj.quoteCC &&
      PreEmailConfigObj.quoteBCC == emailConfigObj.quoteBCC &&
      PreEmailConfigObj.contractCC == emailConfigObj.contractCC &&
      PreEmailConfigObj.contractBCC == emailConfigObj.contractBCC
    ) {
      setPrevError(true);
      return false;
    }

    const quoteCC = emailConfigObj?.quoteCC
      ?.split(/[,]+/)
      ?.map((email) => email?.trim())
      ?.filter((email) => email && emailPattern.test(email));

    const contractCC = emailConfigObj?.contractCC
      ?.split(/[,\s]+/)
      ?.map((email) => email?.trim())
      ?.filter((email) => email && emailPattern.test(email));

    const quoteBCC = emailConfigObj?.quoteBCC
      ?.split(/[,\s]+/)
      ?.map((email) => email?.trim())
      ?.filter((email) => email && emailPattern.test(email));
    const contractBCC = emailConfigObj?.contractBCC
      ?.split(/[,\s]+/)
      ?.map((email) => email?.trim())
      ?.filter((email) => email && emailPattern.test(email));

    if (
      quoteCC?.length !== emailConfigObj?.quoteCC?.split(/[,]+/)?.length ||
      contractCC?.length !==
      emailConfigObj?.contractCC?.split(/[,\s]+/)?.length ||
      quoteBCC?.length !== emailConfigObj?.quoteBCC?.split(/[,\s]+/)?.length ||
      contractBCC?.length !==
      emailConfigObj?.contractBCC?.split(/[,\s]+/)?.length
    ) {
      // setRequireErrorMessage(true);
      // setErrorMessage("Please enter valid email addresses.");
      return false;
    } else {
      // Code will run properly if all conditions are met
    }
    setRequireErrorMessage("");
    // Preparing Object For Add Update and if any modification then it will done here
    const ApiRequest_ParamsObj = {
      //global level params : fixed
      organisationKeyID: common.organisationKeyID,
      userKeyID: common.userKeyID,
      //form level params : will change according to module
      quoteCC: quoteCC?.join(", "),
      quoteBCC: quoteBCC?.join(", "),
      contractCC: contractCC?.join(", "),
      contractBCC: contractBCC?.join(", "),
    };
    AddUpdateEmailConfigData(ApiRequest_ParamsObj);
  };

  // Add or Update Email config Data
  const AddUpdateEmailConfigData = async (apiRequestParams) => {
    setLoader(true);
    try {
      let url = "/AddUpdateEmailConfig"; // Default URL for Adding Data
      if (
        apiRequestParams.Action === "Update" ||
        apiRequestParams.Action === "ClearCcBcc"
      ) {
        url = `/AddUpdateEmailConfig?Action=${apiRequestParams.Action}`; // URL for Updating Data
      }
      const response = await AddUpdateEmailConfig(url, apiRequestParams);
      if (response) {
        setLoader(false);
        if (response?.data?.statusCode === 200) {
          if (apiRequestParams.Action === "Update") {
            setOpenSuccessModal(true);
            setIsAddUpdateActionDone(true);
            GetEmailConfigModelData(common.organisationKeyID);
          } else {
            setOpenSuccessModal(true);
            setIsAddUpdateActionDone(true);
            GetEmailConfigModelData(common.organisationKeyID);
          }
        } else {
          setErrorMessage(response?.response?.data?.errorMessage);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  //email validation function
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  function validateSmtpServer(server) {
    // Regular expression pattern for validating domain names or IP addresses
    const serverRegex =
      /^(?:(?:(?:[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)+[a-zA-Z]{2,}|(?:\d{1,3}\.){3}\d{1,3})$/;
    // Check if the server matches the regex pattern
    return serverRegex.test(server);
  }

  const handleClose = () => {
    $("#" + "successModal").modal("hide");
    $("#" + "ConfirmModel").modal("hide");
    setOpenSuccessModal(false);
    setOpenErrorModal(false);
  };
  const OnEmailTypeChange = (emailType, selectedOption) => {
    setErrorMessage("");

    // setUserEmailConfigObj updates the state with new values
    setUserEmailConfigObj({
      ...userEmailConfigObj,
      // emailTypeId: emailType.value,

      userKeyID: null,
      organisationKeyID: null,
      senderEmailID: undefined,
      password: undefined,
      displayName: undefined,
      isSsl: true,
      smtpServer: emailType.smtpServer || undefined,
      smtpPort: emailType.smtpPort || null,
      emailProviderID: emailType.value,
      isEnableMailBox: undefined,
    });

    // Show/hide SMTP input boxes based on selected email type
    setShowSMTPInput(!emailType.smtpServer);
    setShowSMTPPortInput(!emailType.smtpPort);

    // Set the selected value in state
    setConfigureTypeValue1(emailType);

    // Check if "Other" option is selected and set validation flags accordingly
    if (!emailType.smtpServer || !emailType.smtpPort) {
      // Check if smtpPort is a string before calling trim()
      setRequireErrorMessage(
        typeof userEmailConfigObj.smtpPort !== "string" ||
        !userEmailConfigObj.smtpPort.trim()
      );

      setRequireErrorMessage(false);
    }
  };

  // Define emailPattern outside the component function
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const SelectEmailTypeValue = emailTypeValue?.find((item) => {
    return item.value === userEmailConfigObj.emailProviderID;
  });

  const handleHowToCreateClick = () => {
    if (!userEmailConfigObj.emailProviderID) {
      setAlertMessage("Please select a provider to see the instructions.");
      setModalOpen(true); // Open modal even for errors
      setInstructions("");
      return;
    }

    const selectedProvider = emailProviders?.find(
      (provider) => provider.epid === userEmailConfigObj.emailProviderID
    );

    if (selectedProvider) {
      const providerName = selectedProvider.emailProviderName;

      // Generate instructions for personal account, if applicable
      const personalSteps =
        selectedProvider.PersonalAccountSteps?.map((step, index) => {
          const stepText = Object.values(step)[0];
          return `${index + 1}: ${stepText}`;
        }).join("\n") || "";

      // Generate instructions for work account, if applicable
      const workSteps =
        selectedProvider.WorkAccountSteps?.map((step, index) => {
          const stepText = Object.values(step)[0];
          return `${index + 1}. ${stepText}`;
        }).join("\n") || "";

      // Generate general provider steps if personal/work steps are not defined
      const providerSteps =
        selectedProvider.ProviderSteps?.map((step, index) => {
          const stepText = Object.values(step)[0];
          return `${index + 1}. ${stepText}`;
        }).join("\n") || "";

      let instructions = "";

      if (personalSteps && workSteps) {
        instructions = `For Personal Account:\n${personalSteps}\n\nFor Work Accounts:\n${workSteps}`;
      } else if (providerSteps) {
        instructions = `Steps:\n${providerSteps}`;
      }

      setInstructions(
        `To create an app password for ${providerName}:\n\n${instructions}`
      );
      setModalOpen(true);
    } else {
      setAlertMessage("Selected provider details not found.");
      setModalOpen(true); // Open modal even for errors
    }
  };

  const handleChangeSmtp = (e) => {
    setRequireErrorMessage(false)
    const value = e.target.value;

    // If the value is null or undefined, do nothing
    if (value === null || value === undefined) {
      return;
    }

    // Convert the string value to boolean before setting the state
    const isDefaultSmtp = value;
    setUserEmailConfigObj({
      ...userEmailConfigObj,
      smtpServerTypeID: isDefaultSmtp,
    });
  };

  const VerifyEmailID = async (isReset) => {
    if (activeOrganizationSubscriptionPlan?.isMailBox !== true) {
      setShowModal(true);
      return;
    }
    setModelAction(null)
    if (!isReset) {
      if (userEmailConfigObj.senderEmailIDForOutbooks !== "" &&
        userEmailConfigObj.senderEmailIDForOutbooks !== undefined &&
        !emailPattern.test(userEmailConfigObj.senderEmailIDForOutbooks)) {
        setRequireOwnSMTPErrorMessage(true)
        return
      }

      if (userEmailConfigObj.senderEmailIDForOutbooks === "" || userEmailConfigObj.senderEmailIDForOutbooks === null || userEmailConfigObj.senderEmailIDForOutbooks === undefined) {
        setRequireOwnSMTPErrorMessage(true)
        return
      }
      setModelRequestData({
        ...modelRequestData,
        Action: "VerifyEmailID"
      })
    } else {
      setRequireOwnSMTPErrorMessage(false)
    }
    setLoader(true)
    const Response = await SendEmailVerificationLinkForAwsSesConfiguration(userEmailConfigObj.senderEmailIDForOutbooks, common.organisationKeyID, common.userKeyID, isReset)
    if (Response.data.statusCode === 200) {
      setLoader(false)
      setOpenSuccessModal(true)
      GetUserEmailConfigModelData(common.organisationKeyID);
    } else {
      setLoader(false)
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case true:
        return "text-success"; // Green
      case false:
        return "text-danger"; // Yellow
      case "Rejected":
        return "text-danger"; // Red
      default:
        return "text-danger"; // Default (Gray)
    }
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setAlertMessage(""); // Reset alert message when modal is closed
  };
  //Design part :
  return (
    <div>
        <div class="page-content page-background">
            <div class="container">
              <div class="page-title-cls">Email Config</div>
            </div>
          <div class="container ">
            <div className="row">
              <div class="col-12 pricing_settings">
                <div class="card">
                  <div class="card-body bg-white ">
                    <div class=" row ">
                      <div className="row">
                        <div className="col-md-12">
                          <h6>
                            <u> Email Configuration</u>
                          </h6>
                        </div>
                        <div className="d-flex justify-content-center align-items-center mb-3">
                          <div className="d-flex gap-3">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="smtpOption"
                                id="smtpServerTypeID"
                                style={{ border: "1px solid black" }}
                                value={1}
                                onChange={(e) => handleChangeSmtp(e)}
                                defaultChecked={userEmailConfigObj.smtpServerTypeID == 1}
                                checked={userEmailConfigObj.smtpServerTypeID == 1}

                              />
                              <label className="form-check-label" htmlFor="smtpServerTypeID">
                                {OutBooksTitle} SMTP
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="smtpOption"
                                style={{ border: "1px solid black" }}
                                id="ownSmtp"
                                value={2}
                                onChange={(e) => handleChangeSmtp(e)}
                                defaultChecked={userEmailConfigObj.smtpServerTypeID == 2}
                                checked={userEmailConfigObj.smtpServerTypeID == 2}
                              />
                              <label className="form-check-label" htmlFor="ownSmtp">
                                Customise Your SMTP
                              </label>
                            </div>
                          </div>
                        </div>

                        {userEmailConfigObj.smtpServerTypeID == 2 && userEmailConfigObj.smtpServerTypeID !== null ? (
                          <>

                            <div className="col-md-6  mb-2">
                              <div>
                                <label class="fieldset-label table-content-font">
                                  Select Provider
                                  <span className="text-danger">*</span>
                                </label>
                                <div className="input-group">
                                  <DropDown
                                    className="phone-input-country-code selectDropDown Drop-down-width driver-type-cls"
                                    options={emailTypeValue}
                                    value={
                                      SelectEmailTypeValue == undefined
                                        ? null
                                        : SelectEmailTypeValue
                                    }
                                    onChange={OnEmailTypeChange}
                                    placeholder="Select..."
                                    autoComplete="off"
                                  />
                                  {requireErrorMessage && (
                                    <label className="validation">
                                      {userEmailConfigObj.emailProviderID == "" ||
                                        userEmailConfigObj.emailProviderID ==
                                        undefined
                                        ? ERROR_MESSAGES
                                        : ""}
                                    </label>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6  mb-2">
                              <div>
                                <label class="fieldset-label table-content-font">
                                  Email Address
                                  <span className="text-danger">*</span>
                                </label>
                              </div>

                              <div>
                                <input
                                  class="input-text table-content-font"
                                  type="text"
                                  autoComplete="off"
                                  placeholder="john.doe@example.com"
                                  value={userEmailConfigObj.senderEmailID || ""}
                                  onChange={(e) => {
                                    setUserPrevError(false);
                                    setUserEmailConfigObj({
                                      ...userEmailConfigObj,
                                      senderEmailID: e.target.value,
                                    });
                                  }}
                                  maxLength={50}
                                />
                                {/* Display validation error message for email input */}
                                {requireErrorMessage && (
                                  <label className="validation">
                                    {!userEmailConfigObj.senderEmailID ||
                                      !userEmailConfigObj.senderEmailID.trim()
                                      ? ERROR_MESSAGES
                                      : !emailPattern.test(
                                        userEmailConfigObj.senderEmailID
                                      )
                                        ? "Please enter a valid email address."
                                        : ""}
                                  </label>
                                )}
                              </div>
                            </div>
                            <div className="col-md-6 mb-2">
                              <div>
                                <label className="fieldset-label table-content-font">
                                  App Password{" "}
                                  <a href="#" onClick={handleHowToCreateClick}>
                                    (How to create?)
                                  </a>
                                  <span className="text-danger">*</span>
                                </label>
                              </div>
                              <div>
                                <input
                                  class="input-text table-content-font  pe-5"
                                  autoComplete="off"
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Enter Password"
                                  value={userEmailConfigObj.password || ""}
                                  onChange={(e) => {
                                    setUserPrevError(false);
                                    setUserEmailConfigObj({
                                      ...userEmailConfigObj,
                                      password: e.target.value,
                                    });
                                  }}
                                  maxLength={50}
                                />
                                <button
                                  style={{ zIndex: "0" }}
                                  className="btn btn-link position-absolute end-0 me-2 top-5 text-decoration-none text-muted password-addon"
                                  type="button"
                                  id="password-addon"
                                  onClick={togglePasswordVisibility}
                                >
                                  <i className="ri-eye-fill align-middle"></i>
                                </button>
                                {requireErrorMessage && (
                                  <label className="validation">
                                    {userEmailConfigObj.password == "" ||
                                      userEmailConfigObj.password == undefined
                                      ? ERROR_MESSAGES
                                      : ""}
                                  </label>
                                )}
                              </div>
                            </div>
                            <div class="col-md-6 col-sm-12 ">
                              {/* p */}
                              <div>
                                <div>
                                  <label class="fieldset-label table-content-font">
                                    Display Name
                                    <span className="text-danger">*</span>
                                  </label>
                                </div>
                                <div>
                                  <input
                                    class="input-text table-content-font "
                                    autoComplete="off"
                                    type="text"
                                    placeholder="Enter Display Name"
                                    value={userEmailConfigObj.displayName || ""}
                                    onChange={(e) => {
                                      // setRequireErrorMessage(false);
                                      setUserPrevError(false);
                                      setUserEmailConfigObj({
                                        ...userEmailConfigObj,
                                        displayName: e.target.value,
                                      });
                                    }}
                                    maxLength={50}
                                  />
                                  {requireErrorMessage && (
                                    <label className="validation">
                                      {userEmailConfigObj.displayName == "" ||
                                        userEmailConfigObj.displayName == undefined
                                        ? ERROR_MESSAGES
                                        : ""}
                                    </label>
                                  )}
                                </div>
                              </div>
                            </div>
                            {showSMTPInput && (
                              <div className="col-md-6 mb-2">
                                <div>
                                  <label className="fieldset-label table-content-font">
                                    SMTP Server
                                    <span className="text-danger">*</span>
                                  </label>
                                </div>
                                <div>
                                  <input
                                    className="input-text table-content-font"
                                    type="text"
                                    placeholder="Enter SMTP Server"
                                    value={userEmailConfigObj.smtpServer || ""}
                                    onChange={(e) => {
                                      setUserEmailConfigObj({
                                        ...userEmailConfigObj,
                                        smtpServer: e.target.value,
                                      });
                                    }}
                                    maxLength={50}
                                  />

                                  {requireErrorMessage && (
                                    <label className="validation">
                                      {userEmailConfigObj.smtpServer == "" ||
                                        userEmailConfigObj.smtpServer == undefined
                                        ? ERROR_MESSAGES
                                        : "Please enter a valid SMTP Server."}
                                    </label>
                                  )}
                                </div>
                              </div>
                            )}

                            {showSMTPPortInput && (
                              <div className="col-md-6  mb-2">
                                <div>
                                  <label class="fieldset-label table-content-font">
                                    SMTP Port
                                    <span className="text-danger">*</span>
                                  </label>
                                </div>
                                <div>
                                  <input
                                    class="input-text table-content-font"
                                    type="number"
                                    placeholder="Enter SMTP Port "
                                    value={userEmailConfigObj.smtpPort || ""}
                                    onChange={(e) => {
                                      // Ensure only numbers are entered
                                      const value = e.target.value.replace(
                                        /\D/,
                                        ""
                                      );
                                      // Limit input to 5 characters
                                      const limitedValue = value.slice(0, 5);
                                      // Update state
                                      setRequireErrorMessage(false);
                                      setUserPrevError(false);
                                      setUserEmailConfigObj({
                                        ...userEmailConfigObj,
                                        smtpPort: limitedValue, // Assign the limited value
                                      });
                                    }}
                                  />
                                  {requireErrorMessage && (
                                    <label className="validation">
                                      {userEmailConfigObj.smtpPort == "" ||
                                        userEmailConfigObj.smtpPort == undefined ||
                                        (typeof userEmailConfigObj.smtpPort !==
                                          "string" &&
                                          !isNaN(userEmailConfigObj.smtpPort)) ||
                                        !String(userEmailConfigObj.smtpPort).trim()
                                        ? ERROR_MESSAGES
                                        : ""}
                                    </label>
                                  )}
                                </div>
                              </div>
                            )}
                          </>)
                          : <>
                            {((userEmailConfigObj.smtpServerTypeID == 1 && userEmailConfigObj.smtpServerTypeID !== null) ?
                              (<><div className="col-md-6  mb-2">
                                <div>
                                  <label class="fieldset-label table-content-font">
                                    From Email
                                    <span className="text-danger">*</span>
                                  </label>
                                  <div className="input-group">
                                    <input
                                      disabled={userEmailConfigObj.isEmailVerified === false}
                                      type="text"
                                      className="input-text"
                                      placeholder="Enter email address"
                                      value={userEmailConfigObj.senderEmailIDForOutbooks}
                                      onChange={(e) => {
                                        setErrorMessage("");
                                        let enteredValue = e.target.value.trim().toLowerCase();

                                        // Check for consecutive dots
                                        if (enteredValue.includes('..')) {
                                          // If consecutive dots found, remove the last dot
                                          enteredValue = enteredValue.replace(/\.+/g, '.');
                                        }

                                        // Limit the input to 50 characters
                                        enteredValue = enteredValue.slice(0, 50);

                                        // Update the state with the entered value
                                        setUserEmailConfigObj({ ...userEmailConfigObj, senderEmailIDForOutbooks: enteredValue });
                                      }}
                                    />
                                    {userEmailConfigObj.isEmailVerified === false &&
                                      <div
                                        style={{ fontSize: "12px" }}
                                        className="text-muted helpMessage"
                                      >
                                        Please check your mailbox (including your spam folder) for an email from Amazon Web Services (AWS). Click the verification link in the email to grant Outbooks Proposal Tool permission to send emails from this email address.
                                      </div>}
                                    {requireOwnSMTPErrorMessage && (
                                      <label className="validation">
                                        {userEmailConfigObj.senderEmailIDForOutbooks === "" ||
                                          userEmailConfigObj.senderEmailIDForOutbooks === null ||
                                          userEmailConfigObj.senderEmailIDForOutbooks ===
                                          undefined
                                          ? ERROR_MESSAGES
                                          : !emailPattern.test(
                                            userEmailConfigObj.senderEmailIDForOutbooks
                                          ) ? "Please enter a valid email address." : ""}
                                      </label>
                                    )}
                                  </div>
                                </div>
                              </div>
                                {userEmailConfigObj.isEmailVerified !== null ?
                                  <div className="mt-4 col-md-6 mb-1">

                                    <label style={{ color: "black" }} class="fieldset-label table-content-font">
                                      Verification Status :
                                    </label>

                                    <span style={{ fontSize: "12px" }} className={` ${getStatusClass(userEmailConfigObj.isEmailVerified)}`}>
                                      <b> {userEmailConfigObj.isEmailVerified === false ? "Pending" : "Verified"}</b>
                                    </span>


                                  </div> : ""}
                              </>)
                              :
                              ""
                            )}
                          </>}
                      </div>
                      {userEmailConfigObj.smtpServerTypeID == 2 && userEmailConfigObj.smtpServerTypeID !== null && (
                        <>
                          <div
                            class="row justify-content-end"
                            id="Responsive-btn-config"
                          >
                            <div className="col-lg-6 d-flex justify-content-end align-items-center">
                              <button
                                data-bs-toggle="modal"
                                data-bs-target="#ConfirmModel"
                                // onClick={() => handleClear()}
                                onClick={() => {
                                  setModelRequestData({
                                    ...modelRequestData,
                                    Action: "ResetEmailConfigurationChange",
                                    moduleName: "CustomizeEmailConfig"
                                  });
                                }}
                                className="btn btn-light me-2"
                                style={{ fontSize: "14px" }}
                              >
                                <span>Reset</span>
                              </button>

                              {userAccessData.Admin_Setting_Practice_Config_CanEdit && (
                                <button
                                  style={{ fontSize: "14px" }}
                                  className="btn btn-primary create-item-btn"
                                  onClick={() => {
                                    if (activeOrganizationSubscriptionPlan?.isMailBox !== true) {
                                      setShowModal(true);
                                      return;
                                    }
                                    setModelRequestData({
                                      ...modelRequestData,
                                      Action: "UserUpdate",
                                    });
                                    EmailConfigBtnClicked(null);
                                  }}
                                >
                                  <span>Save Configuration</span>
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="row mb-3">
                            <div className="col-12 text-center">
                              {userPrevError && (
                                <label className="validation">
                                  You haven't changed any value
                                </label>
                              )}
                            </div>
                          </div>

                          <div className="row mb-3">
                            <div className="col-12 text-center">
                              <label className="validation">{errorMessage}</label>
                            </div>
                          </div>
                        </>)}
                      {((userEmailConfigObj.smtpServerTypeID == 1 && userEmailConfigObj.smtpServerTypeID !== null) &&
                        <div
                          class="row justify-content-end"
                          id="Responsive-btn-config"
                        >
                          <div className="col-lg-6 d-flex justify-content-end align-items-center">
                            <button
                              data-bs-toggle="modal"
                              data-bs-target="#ConfirmModel"
                              onClick={() => {
                                setModelRequestData({
                                  ...modelRequestData,
                                  Action: "ResetEmailConfigurationChange",
                                  moduleName: "DefaultEmailConfig"
                                });
                              }}
                              className="btn btn-light me-2"
                              style={{ fontSize: "14px" }}
                            >
                              <span>Reset</span>
                            </button>
                            <button
                              onClick={() => VerifyEmailID()}
                              className="btn btn-primary create-item-btn"
                              style={{ fontSize: "14px" }}
                            >
                              <span>{userEmailConfigObj.isEmailVerified === false ? "Re-Verify" : "Verify"}</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* new */}
          <div class="container ">
            <div className="row">
              <div class="col-12">
                <div class="card">
                  <div class="card-body bg-white ">
                    <div class=" row ">
                      <div className="row ">
                        <h6>
                          <u>CC/BCC Configuration</u>{" "}
                        </h6>
                        <div className="col-md-6  mb-2">
                          <div>
                            <label class="fieldset-label table-content-font">
                              {proposalName} CC
                            </label>
                          </div>

                          <div>
                            <input
                              class="input-text table-content-font"
                              type="text"
                              placeholder="john.doe@example.com , jane.smith@example.com"
                              value={emailConfigObj.quoteCC || ""}
                              onChange={(e) => {
                                const trimmedValue = e.target.value.replace(
                                  /\s/g,
                                  ""
                                ); // Remove spaces
                                setRequireErrorMessage(false);
                                setPrevError(false);
                                setEmailConfigObj({
                                  ...emailConfigObj,
                                  quoteCC: trimmedValue,
                                });
                              }}
                            />
                            {emailConfigObj.quoteCC &&
                              emailConfigObj.quoteCC
                                .split(/[,]+/)
                                .some(
                                  (email) => !validateEmail(email.trim())
                                ) && (
                                <label className="validation">
                                  Please enter valid email addresses separated
                                  by commas ("," ) .
                                </label>
                              )}
                          </div>
                        </div>
                        <div className="col-md-6 mb-2">
                          <div>
                            <label class="fieldset-label table-content-font">
                              {proposalName} BCC
                            </label>
                          </div>
                          <div>
                            <input
                              class="input-text table-content-font "
                              type="text"
                              placeholder="john.doe@example.com , jane.smith@example.com"
                              value={emailConfigObj.quoteBCC || ""}
                              onChange={(e) => {
                                const trimmedValue = e.target.value.replace(
                                  /\s/g,
                                  ""
                                ); // Remove spaces

                                setRequireErrorMessage(false);
                                setPrevError(false);
                                setEmailConfigObj({
                                  ...emailConfigObj,
                                  quoteBCC: trimmedValue,
                                });
                              }}
                            />

                            {emailConfigObj.quoteBCC &&
                              emailConfigObj.quoteBCC
                                .split(/[,\s]+/)
                                .some(
                                  (email) => !validateEmail(email.trim())
                                ) && (
                                <label className="validation">
                                  Please enter valid email addresses separated
                                  by commas ("," ) .
                                </label>
                              )}
                          </div>
                        </div>
                        <div className="col-md-6 mb-2">
                          <div>
                            <label class="fieldset-label table-content-font">
                              {EngagementName} CC
                            </label>
                          </div>
                          <div>
                            <input
                              class="input-text table-content-font"
                              type="text"
                              placeholder="john.doe@example.com , jane.smith@example.com"
                              value={emailConfigObj.contractCC || ""}
                              onChange={(e) => {
                                const trimmedValue = e.target.value.replace(
                                  /\s/g,
                                  ""
                                ); // Remove spaces

                                setRequireErrorMessage(false);
                                setPrevError(false);
                                setEmailConfigObj({
                                  ...emailConfigObj,
                                  contractCC: trimmedValue,
                                });
                              }}
                            />

                            {emailConfigObj.contractCC &&
                              emailConfigObj.contractCC
                                .split(/[,\s]+/)
                                .some(
                                  (email) => !validateEmail(email.trim())
                                ) && (
                                <label className="validation">
                                  Please enter valid email addresses separated
                                  by commas ("," ) .
                                </label>
                              )}
                          </div>
                        </div>{" "}
                        <div className="col-md-6 mb-2">
                          <div>
                            <label class="fieldset-label table-content-font">
                              {EngagementName} BCC
                            </label>
                          </div>
                          <div>
                            <input
                              class="input-text table-content-font"
                              type="text"
                              placeholder="john.doe@example.com , jane.smith@example.com"
                              value={emailConfigObj.contractBCC || ""}
                              onChange={(e) => {
                                const trimmedValue = e.target.value.replace(
                                  /\s/g,
                                  ""
                                ); // Remove spaces

                                setRequireErrorMessage(false);
                                setPrevError(false);
                                setEmailConfigObj({
                                  ...emailConfigObj,
                                  contractBCC: trimmedValue,
                                });
                              }}
                            />

                            {emailConfigObj.contractBCC &&
                              emailConfigObj.contractBCC
                                .split(/[,\s]+/)
                                .some(
                                  (email) => !validateEmail(email.trim())
                                ) && (
                                <label className="validation">
                                  Please enter valid email addresses separated
                                  by commas ("," ) .
                                </label>
                              )}
                          </div>
                        </div>
                      </div>

                      <div class="row justify-content-end">
                        <div className="col-lg-6 d-flex justify-content-end align-items-center">
                          <button
                            data-bs-toggle="modal"
                            data-bs-target="#ConfirmModel"
                            onClick={() => {
                              setModelRequestData({
                                ...modelRequestData,
                                Action: "ClearCcBcc",
                              });
                            }}
                            className="btn btn-light me-2"
                            style={{ fontSize: "14px" }}
                          >
                            <span>Reset</span>
                          </button>
                          {userAccessData.Admin_Setting_Practice_Config_CanEdit && (
                            <button
                              style={{ fontSize: "14px" }}
                              className="btn btn-primary create-item-btn"
                              onClick={() => {
                                EmailConfigAddUpdateBtnClicked();
                              }}
                            >
                              <span>Submit</span>
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-12 text-center">
                          {PrevError && (
                            <label className="validation">
                              You haven't changed any value
                            </label>
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
        <Footer />

      <ConfirmModel
        openErrorModal={openErrorModal}
        openSuccessModal={openSuccessModal}
        modelRequestData={modelRequestData}
        message={
          modelRequestData.Action === "ResetEmailConfigurationChange"
            ? "Are you sure you want to reset the email configuration?"
            : modelRequestData.Action === "ClearCcBcc"
              ? "Are you sure you want to reset all CC and BCC fields?"
              : ""
        }
        UpdatedStatus={() => {
          if (modelRequestData.Action === "ResetEmailConfigurationChange") {
            EmailConfigBtnClicked(true);
          } else if (modelRequestData.Action === "ClearCcBcc") {
            EmailConfigAddUpdateBtnClicked("ClearCcBcc");
          } else {
            EmailConfigAddUpdateBtnClicked("Update");
          }
        }}
      />
      <ViewPlan
        showModal={showModal}
        handleCloseModel={() => setShowModal(false)}
        setShowModal={setShowModal}
        activeOrganizationKeyId={common.organisationKeyID}
      />
      <SuccessModal
        handleClose={handleClose}
        setDismissModal={setDismissModal}
        setOpenSuccessModal={setOpenSuccessModal}
        openSuccessModal={openSuccessModal}
        modelAction={modelAction}
        message={
          modelRequestData.Action === "ResetEmailConfigurationChange"
            ? "Email configuration has been reset successfully!"
            : modelRequestData.Action === "ClearCcBcc"
              ? "CC and BCC fields have been reset successfully!"
              : modelRequestData.Action === "VerifyEmailID" ? "Please check your mailbox (including your spam folder) for an email from Amazon Web Services (AWS). Click the verification link in the email to grant Outbooks Proposal Tool permission to send emails from this email address." : "Email configuration has been updated successfully!"
        }
      />
      {/* <ErrorModel
        ErrorModel={openErrorModal}
        handleClose={handleClose}
        ErrorMessage={"Failed to send email"}
      /> */}
      <ErrorModel
        ErrorModel={openErrorModal}
        handleClose={handleClose}
        ErrorMessage={
          modelRequestData.Action === "ClearCcBcc" &&
            emailConfigObj.quoteCC === "" &&
            emailConfigObj.quoteBCC === "" &&
            emailConfigObj.contractCC === "" &&
            emailConfigObj.contractBCC === ""
            ? ""
            : "All fields are already empty. No action needed." // This will use the existing error message for other cases
        }
      />

      <InstructionModal
        open={modalOpen}
        handleClose={handleCloseModal}
        instructions={instructions}
        alertMessage={alertMessage} // Pass alert message to InstructionModal
      />
    </div>
  );
};

export default Email_Config;
