/* global $ */
import React, { useContext, useEffect, useState } from "react";
import "../../pages/configure/packages/Package.css";
import "../../pages/configure/services/ServiceStyle.css";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  AuthenticatorQrCode,
  AuthenticatorVerifyToken,
  AddAuthentication,
  GetSendMFAVerificationCodeByEmail,
} from "../../redux/Services/Auth/AuthenticatioApi";
import SuccessModal from "../SuccessModal";
import { AuthContextProvider } from "../../AuthContext/AuthContext";
import BackButtonSvg from "../BackButtonSvg";
import { ERROR_MESSAGES } from "../GlobalMessage";
import { TwoFactor } from "../../Middleware/enums";

//Tab Custom Component Created
const BasicInformationComponent = (props) => {
  return (
    <>
      <div className="">
        <div class="tab-content">
          <div className="row">
            <p className="text-start">
              How would you like to receive verification codes?
            </p>
            <div class="container ">
              <div class="row justify-content-center ">
                <div class="col-12 col-md-6">
                  <div class="mb-3">
                    <input
                      type="radio"
                      id="app"
                      name="verification_method"
                      value="AuthenticatorApp"
                      class="form-check-input"
                      onChange={() => props.handleMethodChange(1)}
                      checked={props.authenticatorCode.selectedMethod === 1}
                    />
                    <label class="form-check-label ms-2" htmlFor="app">
                      Authenticator app (Recommended)
                    </label>
                  </div>
                </div>
              </div>
              <div class="row justify-content-center">
                <div class="col-12 col-md-6">
                  <div class="mb-3">
                    <input
                      type="radio"
                      id="Email"
                      name="verification_method"
                      value="Email"
                      maxLength={50}
                      class="form-check-input"
                      checked={props.authenticatorCode.selectedMethod === 2}
                      onChange={() => props.handleMethodChange(2)}
                    />
                    <label class="form-check-label ms-2" htmlFor="Email">
                      Email
                    </label>
                  </div>
                </div>
              </div>

              <br />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="separator"></div>
        <div class="row fieldset modal-footer">
          <div class="col-lg-12 hstack gap-2 justify-content-end text-right mt-2">
            <button
              class="btn btn-md  btn-light"
              onClick={() => props.BackBtn()}
            >
              <span>{props.getCrudButtonTextName("Cancel")}</span>
            </button>
            <button
              class="btn btn-md btn-success create-item-btn"
              onClick={() => {
                props.authenticatorCode.selectedMethod === 2
                  ? props.authenticatorBtnClicked(4)
                  : props.authenticatorBtnClicked(2);
                // props.GetQrCodeData();
              }}
            >
              <span>Next </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const ShowQrCode = (props) => {
  const [showQRCode, setShowQRCode] = useState(true);
  const toggleQRCode = () => {
    setShowQRCode(!showQRCode);
  };
  return (
    <>
      <div className="">
        <div className="tab-content ">
          <div className="tab-pane active">
            <div class="row">
              {/* <div class="twoFactorVerificationContainer">
                <p class="instructions">On Your Phone</p>
                {showQRCode ? (
                  <>
                    <ol style={{ textAlign: "start" }}>
                      <li>
                        1. Install an <b> Authenticator App</b> from your
                        phone's app store such as the{" "}
                        <b>Google Authenticator App. </b>
                      </li>
                      <li>
                        2. Open the <b>Authenticator App.</b>
                      </li>
                      <li>
                        3. Tap the<b> Add </b>icon or the <b>Begin Setup</b>{" "}
                        button.
                      </li>
                      <li>
                        4. Choose <b>Scan a QR code,</b> and scan using your
                        phone:
                      </li>
                    </ol>

                    <div className="barcode">
                      <img
                        src={`data:image/png;base64, ${props.authenticatorCode.qrCodeUrl}`}
                        alt="QR code"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <ol style={{ textAlign: "start" }}>
                      <li>
                        1. Install an <b> Authenticator App</b> from your
                        phone's app store such as the{" "}
                        <b>Google Authenticator App. </b>
                      </li>
                      <li>
                        2. Open the <b>Authenticator App.</b>
                      </li>
                      <li>
                        3. Tap the<b> Add </b>icon or the <b>Begin Setup</b>{" "}
                        button.
                      </li>
                      <li>
                        4. Enter a provided key by following these steps:
                        <ul>
                          a .On the menu screen , press{" "}
                          <b> Enter Provided Key</b>{" "}
                        </ul>
                        <ul>
                          b .Enter the email address for your Outbooks Proposal
                          account
                        </ul>
                        <ul>c .Enter the secret key</ul>
                      </li>
                    </ol>
                    <div className="barcode">
                      <p
                        class="instructions"
                        style={{ color: "black", backgroundColor: "yellow" }}
                      >
                        <b>{props.authenticatorCode.secretKey}</b>
                      </p>
                    </div>
                  </>
                )}
                <p class="instructions">
                  <Link onClick={toggleQRCode}>
                    {" "}
                    {showQRCode
                      ? "Unable to scan the QR code?"
                      : "Use a QR code Instead "}
                  </Link>
                </p>
              </div> */}
              <div className="container">
                <p class="instructions">On Your Phone</p>
                <div className="row align-items-center">
                  <div className="col-md-6 ">
                    <ol className="mb-5">
                      <li>
                        1. Install an <b>Authenticator App</b> from your phone's
                        app store such as the{" "}
                        <b>Google Authenticator App.</b>
                      </li>
                      <li>
                        2. Open the <b>Authenticator App.</b>
                      </li>
                      <li>
                        3. Tap the <b>Add</b> icon or the <b>Begin Setup</b>{" "}
                        button.
                      </li>
                      <li>
                        {showQRCode ? (
                          <>
                            4. Choose <b>Scan a QR code,</b> and scan using your
                            phone
                          </>
                        ) : (
                          <>
                            4. Enter a provided key by following these steps:
                            <ul>
                              <li>
                                On the menu screen, press{" "}
                                <b>Enter Provided Key</b>
                              </li>
                              <li>
                                Enter the email address for your Outbooks
                                Proposal account
                              </li>
                              <li> Enter the secret key</li>
                            </ul>
                          </>
                        )}
                      </li>
                    </ol>
                  </div>
                  <div className="col-md-6">
                    {showQRCode ? (
                      <div className="barcode">
                        <img
                          src={`data:image/png;base64,${props.authenticatorCode.qrCodeUrl}`}
                          alt="QR code"
                          className="img-fluid"
                        />
                      </div>
                    ) : (
                      <div
                        className="barcode"
                        style={{ width: "50%", margin: "0 auto" }}
                      >
                        <p
                          className="instructions"
                          style={{ color: "black", backgroundColor: "yellow" }}
                        >
                          <b>{props.authenticatorCode.secretKey}</b>
                        </p>
                      </div>
                    )}
                    <div className="row">
                      <div className="col-12 text-center">
                        <p className="instructions">
                          <button
                            className="btn btn-link"
                            onClick={toggleQRCode}
                          >
                            {props.authenticatorCode.qrCodeUrl !== null && (
                              showQRCode
                                ? "Unable to scan the QR code?"
                                : "Use a QR code Instead"
                            )}{ }
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="separator"></div>
        <div class="row fieldset modal-footer">
          <div class="col-lg-12 hstack gap-2 justify-content-end text-right mt-2">
            <button class="btn btn-md  btn-light" onClick={props.BackBtn}>
              <span>{props.getCrudButtonTextName("Cancel")}</span>
            </button>
            <button
              onClick={() => props.handleBackButton(1)}
              style={{ paddingTop: "5px", marginRight: "4px" }}
              className="btn btn-md btn-success create-item-btn"
            >
              <span>Back</span>
            </button>
            <button
              class="btn btn-md btn-success create-item-btn"
              onClick={() => {
                props.authenticatorBtnClicked(3);
              }}
            >
              <span>Next</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const AuthenticatorCode = (props) => {
  return (
    <>
      {/* <div className="create-practice-height scrollbar"> */}
      <div class="container mt-1">
        <div class="container">
          <div class="card mx-auto" style={{ maxWidth: "30rem" }}>
            <div class="card-body" style={{ height: "30vh" }}>
              {/* <h1 className="text-center StepTitle2">2-Step Verification</h1> */}

              <div class="mb-3">
                <label class="form-label">
                  Enter the code generated by your device
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="input-text"
                  id="code"
                  placeholder="Enter code"
                  maxlength={6}
                  value={props.authenticatorCode.deviceCode}
                  required
                  onChange={(e) => {
                    props.setInvalidCodeErrorMessage("");
                    const inputValue = e.target.value;
                    const numericValue = inputValue.replace(/\D/g, ""); // Replace non-digit characters with empty string
                    if (!isNaN(numericValue) && numericValue.length <= 6) {
                      // Check if the result is a number and has maximum length of 6
                      props.setAuthenticatorCode({
                        ...props.authenticatorCode,
                        deviceCode: numericValue,
                      });
                    }
                  }}
                />
                {props.authError.AuthenticatorCode &&
                  (props.authenticatorCode.deviceCode === "" ||
                    props.authenticatorCode.deviceCode === null ||
                    props.authenticatorCode.deviceCode === undefined) ? (
                  <label className="validation">{ERROR_MESSAGES}</label>
                ) : (
                  <label className="validation">
                    {props.errorInvalidCodeMessage}
                  </label>
                )}
              </div>
              <div class="mb-3">
                <label class="form-label">
                  Enter a name for your Authenticator App
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="input-text"
                  id="authName"
                  placeholder="Authenticator name"
                  value={props.authenticatorCode.authenticatorName}
                  required
                  onChange={(e) => {
                    let inputValue = e.target.value;

                    // Remove leading spaces
                    if (inputValue.startsWith(" ")) {
                      inputValue = inputValue.trimStart();
                    }

                    // Capitalize the first letter
                    inputValue =
                      inputValue.charAt(0).toUpperCase() + inputValue.slice(1);

                    // Update the state
                    props.setAuthenticatorCode({
                      ...props.authenticatorCode,
                      authenticatorName: inputValue,
                    });
                  }}
                />

                {props.authError.AuthenticatorCode &&
                  (props.authenticatorCode.authenticatorName === "" ||
                    props.authenticatorCode.authenticatorName === null ||
                    props.authenticatorCode.authenticatorName === undefined) ? (
                  <label className="validation">{ERROR_MESSAGES}</label>
                ) : (
                  ""
                )}
                {
                  <>
                    <div className="text-center mt-5">
                      <label className="validation">{props.errorMessage}</label>
                    </div>
                  </>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}

      <div class="separator"></div>
      <div class="row fieldset modal-footer">
        <div class="col-lg-12 hstack gap-2 justify-content-end text-right mt-2">
          <button class="btn btn-md  btn-light" onClick={() => props.BackBtn()}>
            <span>{props.getCrudButtonTextName("Cancel")}</span>
          </button>
          <button
            onClick={() => props.setActiveTab(2)}
            style={{ paddingTop: "5px", marginRight: "4px" }}
            className="btn btn-md btn-success create-item-btn"
          >
            <span>Back</span>
          </button>

          <button
            class="btn btn-md btn-success create-item-btn"
            onClick={() => {
              props.authenticatorBtnClicked("AuthenticatorApp");
              // props.VerifyAuthenticatorToken()AuthenticatorApp
            }}
          >
            Add Verification
          </button>
        </div>
      </div>
    </>
  );
};

const RegisterEmail = (props) => {
  // const isValidEmail = (email) => {
  //   // Regular expression for a basic email validation
  //   // const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  //   const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*(?!\.{2})\.[A-Za-z]{2,}$/;

  //   return emailRegex.test(email);
  // };
  return (
    <>
      {/* <div className="create-practice-height scrollbar centerDiv"> */}
      <div class="container">
        <div class="card  mx-auto" style={{ maxWidth: "30rem" }}>
          <div class="card-body">
            <p class="card-text text-center">
              Enter your email id. A 6 digit verification code will be sent to
              it.
            </p>
            <label>
              Email
              <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              class="input-text"
              placeholder="Enter email address"
              value={props.authenticatorCode.UserEmail}
              maxLength={50}
              onChange={(e) => {
                // Get the entered value
                const enteredValue = e.target.value.trim().toLowerCase();

                // Check for consecutive dots
                if (enteredValue.includes("..")) {
                  // If consecutive dots found, remove the last dot
                  const correctedValue = enteredValue.replace(/\.+/g, ".");
                  // Update the email address in the state
                  props.setAuthenticatorCode({
                    ...props.authenticatorCode,
                    UserEmail: correctedValue,
                  });
                  return;
                }

                // Update the email address in the state
                props.setAuthenticatorCode({
                  ...props.authenticatorCode,
                  UserEmail: enteredValue,
                });
              }}
            />
            {props.authError.RegisterEmail &&
              (props.authenticatorCode.UserEmail === null ||
                props.authenticatorCode.UserEmail === "" ? (
                <label className="validation">{ERROR_MESSAGES}</label>
              ) : (
                !props.isValidEmail(props.authenticatorCode.UserEmail) && (
                  <label className="validation">Invalid email</label>
                )
              ))}
            {
              <>
                <div className="text-center mt-5">
                  <label className="validation">{props.errorMessage}</label>
                </div>
              </>
            }
          </div>
        </div>
      </div>
      {/* </div> */}

      <div class="separator"></div>
      <div class="row fieldset modal-footer">
        <div class="col-lg-12 hstack gap-2 justify-content-end text-right mt-2">
          <button class="btn btn-md  btn-light" onClick={() => props.BackBtn()}>
            <span>{props.getCrudButtonTextName("Cancel")}</span>
          </button>
          <button
            onClick={() => props.setActiveTab(1)}
            style={{ paddingTop: "5px", marginRight: "4px" }}
            className="btn btn-md btn-success create-item-btn"
          >
            <span>Back</span>
          </button>

          <button
            class="btn btn-md btn-success create-item-btn"
            onClick={() => props.authenticatorBtnClicked(5)}
          >
            <span>Next </span>
          </button>
        </div>
      </div>
    </>
  );
};

const EmailVerificationCode = (props) => {
  return (
    <>
      {/* <div className="create-practice-height scrollbar centerDiv"> */}
      <div className="container">
        <div class="card mx-auto" style={{ maxWidth: "30rem" }}>
          <div class="card-body ">
            <p className="text-center ">
              Enter the 6 digit verification code received on your email :
              <br />
              <b>{props.authenticatorCode.UserEmail}</b>
            </p>

            <label class="fieldset-label required">
              Enter Code
              <span className="text-danger">*</span>
            </label>

            <input
              type="text"
              class="input-text"
              placeholder="Enter code"
              value={props.authenticatorCode.deviceCode}
              onChange={(e) => {
                props.setInvalidCodeErrorMessage("");
                const inputValue = e.target.value;
                const numericValue = inputValue.replace(/\D/g, ""); // Replace non-digit characters with empty string
                if (!isNaN(numericValue) && numericValue.length <= 6) {
                  // Check if the result is a number and has maximum length of 6
                  props.setAuthenticatorCode({
                    ...props.authenticatorCode,
                    deviceCode: numericValue,
                  });
                }
              }}
            />
            {props.authError.deviceCode &&
              (props.authenticatorCode.deviceCode === "" ||
                props.authenticatorCode.deviceCode === null ||
                props.authenticatorCode.deviceCode === undefined) ? (
              <label className="validation">{ERROR_MESSAGES}</label>
            ) : props.errorInvalidCodeMessage !== null ? (
              <label className="validation">
                {props.errorInvalidCodeMessage}
              </label>
            ) : (
              ""
            )}

            {
              <>
                <div className="text-center mt-5">
                  <label className="validation">{props.errorMessage}</label>
                </div>
              </>
            }
          </div>
        </div>
        {/* </div> */}
      </div>
      <div class="separator"></div>
      <div class="row fieldset modal-footer">
        <div class="col-lg-12 hstack gap-2 justify-content-end text-right mt-2">
          <button class="btn btn-md  btn-light" onClick={() => props.BackBtn()}>
            <span>{props.getCrudButtonTextName("Cancel")}</span>
          </button>
          <button
            onClick={() => props.setActiveTab(4)}
            style={{ paddingTop: "5px", marginRight: "4px" }}
            className="btn btn-md btn-success create-item-btn"
          >
            <span>Back</span>
          </button>

          <button
            class="btn btn-md btn-success create-item-btn"
            onClick={() => props.authenticatorBtnClicked("AuthenticateApp")}
          >
            Add Verification
          </button>
        </div>
      </div>
    </>
  );
};
const SecurityModel = (props) => {
  const moduleName = "Authenticator";
  //Data Get On Another Component
  const location = useLocation();
  const navigate = useNavigate();

  const common = useSelector((state) => state.Storage);
  const [authError, setAuthError] = useState({
    deviceCode: false,
    EmailVerificationCode: false,
    AuthenticatorCode: false,
    RegisterEmail: false,
    BasicInformationComponent: false,
  });

  const [authenticatorCode, setAuthenticatorCode] = useState({
    UserEmail: null,
    deviceCode: null,
    authenticatorName: null,
    selectedMethod: 1,
    qrCodeUrl: null,
    secretKey: null,
    mfaKeyID: null,
  });
  const [activeTab, setActiveTab] = useState(1);
  const {
    prospectName,
    isMobile,
    getCrudButtonTextName,
    getCrudPopUpTitleName,
    setLoader,
    setTopbar,
    scrollUptoCurrentPosition,
    isValidEmail,
  } = useContext(AuthContextProvider);
  const [modelRequestData, setModelRequestData] = useState({
    Action: null,
    message: "",
  });

  const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [errorInvalidCodeMessage, setInvalidCodeErrorMessage] = useState("");
  const [modelAction, setModelAction] = useState("Add");

  const [dismissModal, setDismissModal] = useState(null);
  const [verifyAuthToken, setVerifyAuthToken] = useState();

  const handleMethodChange = (selectedValue) => {
    setAuthenticatorCode({
      ...authenticatorCode,
      selectedMethod: selectedValue,
    });
  };
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  useEffect(() => {
    setTopbar("none");
  }, []);

  useEffect(() => {
    if (modelRequestData.Action === null) {
      setModelAction("Add");
    }
  }, [modelRequestData]);

  const GetQrCodeData = async () => {
    setLoader(true);
    try {
      const data = await AuthenticatorQrCode({
        userKeyID: common.userKeyID,
        email: common.email,
      });
      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          if (data?.data?.responseData) {
            const QrData = data?.data?.responseData;
            setAuthenticatorCode({
              ...authenticatorCode,
              qrCodeUrl: QrData.qrCodeUrl,
              secretKey: QrData.secretKey,
            });
          }
        } else {
          setErrorMessage(data?.data?.errorMessage);
        }
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  const GetSendMFAVerificationCodeByEmailData = async (newTab) => {
    setLoader(true);
    try {
      const response = await GetSendMFAVerificationCodeByEmail({
        userKeyID: common.userKeyID,
        mfaKeyID: authenticatorCode.mfaKeyID,
        authenticationTypeID: authenticatorCode.selectedMethod,
        email: authenticatorCode.UserEmail,
      });

      if (response) {
        if (response.data?.statusCode == 200) {
          setLoader(false);
          setErrorMessage("");
          setAuthError({
            ...authError,
            deviceCode: false,
          });
          setActiveTab(newTab);
          setInvalidCodeErrorMessage("");
        } else {
          setLoader(false);
          setErrorMessage(response.response.data.errorMessage);
        }
      } else {
        setLoader(false);
        setErrorMessage(response.response.data.errorMessage);
      }
    } catch (error) {
      console.log(error, "error");
      setLoader(false);
    }
  };
  const VerifyAuthenticatorToken = async (token) => {
    setLoader(true);

    try {
      const data = await AuthenticatorVerifyToken({
        secretKey: authenticatorCode.secretKey,
        authenticatorAppToken: authenticatorCode.deviceCode,
      });

      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          if (data?.data?.responseData) {
            const VerifyToken =
              data?.data?.responseData.authenticatorAppVerificationStutus;
            if (VerifyToken) {
              AddAuthenticationData();
            }
            setVerifyAuthToken(VerifyToken);
          }
        } else {
          setErrorMessage(data?.data?.errorMessage);
        }
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  // Add or Update Service Category Data
  const AddAuthenticationData = async () => {
    setLoader(true);

    try {
      const apiRequestParams = {
        userKeyID: common.userKeyID, //"23C889F3-21DD-4E10-955D-F05B93EB217B",
        mfaKeyID: authenticatorCode.mfaKeyID,
        // authenticationType: "AuthenticatorApp",
        authenticationTypeID: authenticatorCode.selectedMethod,
        authenticatorName: authenticatorCode.authenticatorName,
        email: authenticatorCode.UserEmail,
        mfaVerificationToken: authenticatorCode.deviceCode,
        secretKey:
          authenticatorCode.selectedMethod === 1
            ? authenticatorCode.secretKey
            : authenticatorCode.deviceCode,
      };
      let url = `/AddUpdateMultiFactorAuthentication?Action=${modelRequestData.Action}`; // Default URL for Adding Data
      const response = await AddAuthentication(url, apiRequestParams);

      if (response) {
        setLoader(false);
        if (response?.data?.statusCode === 200) {
          setOpenSuccessModal(true);
        } else {
          let ErrorMassage = response?.response?.data?.errorMessage;
          if (ErrorMassage.includes("Invalid Code")) {
            setInvalidCodeErrorMessage(ErrorMassage);
          } else {
            setErrorMessage(ErrorMassage);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const authenticatorBtnClicked = (newTab) => {
    if (activeTab === TwoFactor.BasicInformation) {
      if (authenticatorCode.selectedMethod === 1) {
        setActiveTab(newTab);
        setAuthError({
          ...authError,
          RegisterEmail: false,
        });
        GetQrCodeData();
      } else {
        setActiveTab(newTab);
        setAuthError({
          ...authError,
          RegisterEmail: false,
        });
      }
    } else if (activeTab === TwoFactor.ShowQrCode) {
      setActiveTab(newTab);
      setErrorMessage(false);
      setAuthError({
        ...authError,
        AuthenticatorCode: false,
      });
    } else if (activeTab === TwoFactor.AuthenticatorCode) {
      if (
        authenticatorCode.deviceCode === "" ||
        authenticatorCode.deviceCode === null ||
        authenticatorCode.deviceCode === undefined ||
        authenticatorCode.authenticatorName === undefined ||
        authenticatorCode.authenticatorName === null ||
        authenticatorCode.authenticatorName === ""
      ) {
        setErrorMessage(true);
        setAuthError({
          ...authError,
          AuthenticatorCode: true,
        });

        return false; // Stop further execution
      } else {
        setErrorMessage(true);
        AddAuthenticationData();
      }
    } else if (activeTab === TwoFactor.RegisterEmail) {
      if (
        !authenticatorCode.UserEmail ||
        !emailRegex.test(authenticatorCode.UserEmail)
      ) {
        setErrorMessage(true);
        setAuthError({
          ...authError,
          RegisterEmail: true,
        });

        return false; // Stop further execution
      } else {
        GetSendMFAVerificationCodeByEmailData(newTab);
        // setActiveTab(newTab);
        // setAuthError({
        //   ...authError,
        //   deviceCode: false,
        // });
      }
    } else if (activeTab === TwoFactor.EmailVerification) {
      if (
        authenticatorCode.deviceCode === "" ||
        authenticatorCode.deviceCode === null ||
        authenticatorCode.deviceCode === undefined
      ) {
        setAuthError({
          ...authError,
          deviceCode: true,
        });

        return false; // Stop further execution
      } else {
        AddAuthenticationData();
      }
    }
  };
  const handleBackButton = (newTab) => {
    if (newTab === TwoFactor.BasicInformation) {
      setAuthenticatorCode({
        ...authenticatorCode,
        qrCodeUrl: null,
        secretKey: null,
      });
      setActiveTab(newTab);
    }
  };
  const handleClose = () => {
    $("#" + props.id).modal("hide");
    setOpenSuccessModal(false);
    navigate("/security");
  };

  const BackBtn = () => {
    setTopbar("block");
    navigate("/security");
  };
  return (
    <div className="container-fluid new-item-page-container">
      <div class="new-item-page-content" style={{ marginTop: "40px" }}>
        <div class="row form-row">
          <div class="col-lg-12">
            <h3 className="modal-title">
              <BackButtonSvg onClick={BackBtn} />
              2-Step Verification
            </h3>
            <div class="separator mb-3"></div>
            <h3 className="text-center">2-Step Verification</h3>
            {activeTab === TwoFactor.BasicInformation && (
              <BasicInformationComponent
                setActiveTab={setActiveTab}
                handleMethodChange={handleMethodChange}
                BackBtn={BackBtn}
                getCrudButtonTextName={getCrudButtonTextName}
                authenticatorBtnClicked={authenticatorBtnClicked}
                setErrorMessage={setErrorMessage}
                errorMessage={errorMessage}
                setAuthenticatorCode={setAuthenticatorCode}
                authenticatorCode={authenticatorCode}
                authError={authError}
                setAuthError={setAuthError}
                AuthenticatorQrCode={AuthenticatorQrCode}
                verifyAuthToken={verifyAuthToken}
                setVerifyAuthToken={setVerifyAuthToken}
                VerifyAuthenticatorToken={VerifyAuthenticatorToken}
                common={common}
              />
            )}
            {activeTab === TwoFactor.ShowQrCode && (
              <ShowQrCode
                setActiveTab={setActiveTab}
                authenticatorBtnClicked={authenticatorBtnClicked}
                setErrorMessage={setErrorMessage}
                errorMessage={errorMessage}
                setAuthenticatorCode={setAuthenticatorCode}
                authenticatorCode={authenticatorCode}
                authError={authError}
                handleBackButton={handleBackButton}
                setAuthError={setAuthError}
                BackBtn={BackBtn}
                getCrudButtonTextName={getCrudButtonTextName}
                AuthenticatorQrCode={AuthenticatorQrCode}
                verifyAuthToken={verifyAuthToken}
                setVerifyAuthToken={setVerifyAuthToken}
                common={common}
                VerifyAuthenticatorToken={VerifyAuthenticatorToken}
              />
            )}
            {activeTab === TwoFactor.RegisterEmail && (
              <RegisterEmail
                setActiveTab={setActiveTab}
                getCrudButtonTextName={getCrudButtonTextName}
                authenticatorBtnClicked={authenticatorBtnClicked}
                setErrorMessage={setErrorMessage}
                errorMessage={errorMessage}
                setAuthenticatorCode={setAuthenticatorCode}
                authenticatorCode={authenticatorCode}
                BackBtn={BackBtn}
                authError={authError}
                emailRegex={emailRegex}
                setAuthError={setAuthError}
                AuthenticatorQrCode={AuthenticatorQrCode}
                verifyAuthToken={verifyAuthToken}
                setVerifyAuthToken={setVerifyAuthToken}
                VerifyAuthenticatorToken={VerifyAuthenticatorToken}
                isValidEmail={isValidEmail}
                common={common}
              />
            )}
            {activeTab === TwoFactor.AuthenticatorCode && (
              <AuthenticatorCode
                errorInvalidCodeMessage={errorInvalidCodeMessage}
                setInvalidCodeErrorMessage={setInvalidCodeErrorMessage}
                authenticatorBtnClicked={authenticatorBtnClicked}
                setActiveTab={setActiveTab}
                getCrudButtonTextName={getCrudButtonTextName}
                BackBtn={BackBtn}
                setErrorMessage={setErrorMessage}
                errorMessage={errorMessage}
                setAuthenticatorCode={setAuthenticatorCode}
                authenticatorCode={authenticatorCode}
                authError={authError}
                setAuthError={setAuthError}
                AuthenticatorQrCode={AuthenticatorQrCode}
                verifyAuthToken={verifyAuthToken}
                setVerifyAuthToken={setVerifyAuthToken}
                VerifyAuthenticatorToken={VerifyAuthenticatorToken}
                common={common}
              />
            )}

            {activeTab === TwoFactor.EmailVerification && (
              <EmailVerificationCode
                authenticatorBtnClicked={authenticatorBtnClicked}
                setActiveTab={setActiveTab}
                errorInvalidCodeMessage={errorInvalidCodeMessage}
                setInvalidCodeErrorMessage={setInvalidCodeErrorMessage}
                getCrudButtonTextName={getCrudButtonTextName}
                BackBtn={BackBtn}
                setErrorMessage={setErrorMessage}
                errorMessage={errorMessage}
                setAuthenticatorCode={setAuthenticatorCode}
                authenticatorCode={authenticatorCode}
                authError={authError}
                setAuthError={setAuthError}
                AuthenticatorQrCode={AuthenticatorQrCode}
                verifyAuthToken={verifyAuthToken}
                setVerifyAuthToken={setVerifyAuthToken}
                VerifyAuthenticatorToken={VerifyAuthenticatorToken}
                common={common}
              />
            )}
          </div>
        </div>
      </div>
      <SuccessModal
        handleClose={handleClose}
        setDismissModal={setDismissModal}
        setOpenSuccessModal={setOpenSuccessModal}
        openSuccessModal={openSuccessModal}
        modelAction={modelAction}
        message={
          authenticatorCode.selectedMethod === 2
            ? `Email Verification ` +
            (authenticatorCode.authenticatorName == null
              ? authenticatorCode.UserEmail
              : authenticatorCode.authenticatorName)
            : `Verification ${authenticatorCode.authenticatorName}`
        }
      />
    </div>
  );
};

export default SecurityModel;
