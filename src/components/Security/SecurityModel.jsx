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
import "./SecurityModel-redesign.css";

/* =========================================================
   STEP 1 — CHOOSE VERIFICATION METHOD
   ========================================================= */
const BasicInformationComponent = (props) => {
  return (
    <div className="security-setup-step">
      <div className="security-setup-step-intro">
        <span className="security-setup-step-icon">
          <i className="ri-shield-keyhole-line"></i>
        </span>

        <div>
          <h3>Choose a verification method</h3>
          <p>How would you like to receive your verification codes?</p>
        </div>
      </div>

      <div className="security-method-grid">
        <label
          className={`security-method-card ${
            props.authenticatorCode.selectedMethod === 1 ? "is-selected" : ""
          }`}
          htmlFor="app"
        >
          <input
            type="radio"
            id="app"
            name="verification_method"
            value="AuthenticatorApp"
            className="form-check-input"
            onChange={() => props.handleMethodChange(1)}
            checked={props.authenticatorCode.selectedMethod === 1}
          />

          <span className="security-method-card-icon">
            <i className="ri-smartphone-line"></i>
          </span>

          <span className="security-method-card-copy">
            <span className="security-method-title-row">
              <strong>Authenticator App</strong>
              <span className="security-recommended-badge">Recommended</span>
            </span>

            <small>
              Use an authenticator app to generate secure verification codes.
            </small>
          </span>

          <span className="security-method-check">
            <i className="ri-check-line"></i>
          </span>
        </label>

        <label
          className={`security-method-card ${
            props.authenticatorCode.selectedMethod === 2 ? "is-selected" : ""
          }`}
          htmlFor="Email"
        >
          <input
            type="radio"
            id="Email"
            name="verification_method"
            value="Email"
            maxLength={50}
            className="form-check-input"
            checked={props.authenticatorCode.selectedMethod === 2}
            onChange={() => props.handleMethodChange(2)}
          />

          <span className="security-method-card-icon">
            <i className="ri-mail-line"></i>
          </span>

          <span className="security-method-card-copy">
            <strong>Email</strong>
            <small>Receive a verification code at your email address.</small>
          </span>

          <span className="security-method-check">
            <i className="ri-check-line"></i>
          </span>
        </label>
      </div>

      <div className="security-setup-footer">
        <button
          type="button"
          className="btn security-secondary-btn"
          onClick={() => props.BackBtn()}
        >
          <span>{props.getCrudButtonTextName("Cancel")}</span>
        </button>

        <button
          type="button"
          className="btn security-primary-btn"
          onClick={() => {
            props.authenticatorCode.selectedMethod === 2
              ? props.authenticatorBtnClicked(4)
              : props.authenticatorBtnClicked(2);
          }}
        >
          <span>Next</span>
          <i className="ri-arrow-right-line"></i>
        </button>
      </div>
    </div>
  );
};

/* =========================================================
   STEP 2A — AUTHENTICATOR QR CODE
   ========================================================= */
const ShowQrCode = (props) => {
  const [showQRCode, setShowQRCode] = useState(true);

  const toggleQRCode = () => {
    setShowQRCode(!showQRCode);
  };

  return (
    <div className="security-setup-step">
      <div className="security-setup-step-intro">
        <span className="security-setup-step-icon">
          <i className="ri-qr-code-line"></i>
        </span>

        <div>
          <h3>Set up your authenticator app</h3>
          <p>
            Follow the instructions below on your phone to connect your
            authenticator.
          </p>
        </div>
      </div>

      <div className="security-qr-layout">
        <div className="security-instructions-card">
          <span className="security-section-eyebrow">On your phone</span>

          <ol className="security-instruction-list">
            <li>
              Install an <strong>Authenticator App</strong> from your phone's
              app store, such as Google Authenticator.
            </li>
            <li>
              Open the <strong>Authenticator App</strong>.
            </li>
            <li>
              Tap the <strong>Add</strong> icon or the{" "}
              <strong>Begin Setup</strong> button.
            </li>
            <li>
              {showQRCode ? (
                <>
                  Choose <strong>Scan a QR code</strong> and scan the code shown
                  on this screen.
                </>
              ) : (
                <>
                  Choose <strong>Enter Provided Key</strong>, enter the email
                  address for your Outbooks Proposal account and use the secret
                  key shown on this screen.
                </>
              )}
            </li>
          </ol>
        </div>

        <div className="security-qr-card">
          {showQRCode ? (
            <div className="security-qr-image-wrap">
              <img
                src={`data:image/png;base64,${props.authenticatorCode.qrCodeUrl}`}
                alt="QR code"
                className="security-qr-image"
              />
            </div>
          ) : (
            <div className="security-secret-key-box">
              <span>Secret Key</span>
              <strong>{props.authenticatorCode.secretKey}</strong>
            </div>
          )}

          <button
            type="button"
            className="security-link-btn"
            onClick={toggleQRCode}
          >
            {props.authenticatorCode.qrCodeUrl !== null &&
              (showQRCode
                ? "Unable to scan the QR code?"
                : "Use a QR code instead")}
          </button>
        </div>
      </div>

      <div className="security-setup-footer">
        <button
          type="button"
          className="btn security-secondary-btn"
          onClick={props.BackBtn}
        >
          <span>{props.getCrudButtonTextName("Cancel")}</span>
        </button>

        <div className="security-footer-right">
          <button
            type="button"
            onClick={() => props.handleBackButton(1)}
            className="btn security-secondary-btn"
          >
            <i className="ri-arrow-left-line"></i>
            <span>Back</span>
          </button>

          <button
            type="button"
            className="btn security-primary-btn"
            onClick={() => {
              props.authenticatorBtnClicked(3);
            }}
          >
            <span>Next</span>
            <i className="ri-arrow-right-line"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   STEP 3A — AUTHENTICATOR CODE
   ========================================================= */
const AuthenticatorCode = (props) => {
  return (
    <div className="security-setup-step">
      <div className="security-setup-step-intro">
        <span className="security-setup-step-icon">
          <i className="ri-shield-check-line"></i>
        </span>

        <div>
          <h3>Verify your authenticator</h3>
          <p>
            Enter the code generated by your device and give this authenticator
            a recognizable name.
          </p>
        </div>
      </div>

      <div className="security-form-card">
        <div className="security-field">
          <label htmlFor="code">
            Verification Code
            <span className="security-required">*</span>
          </label>

          <div className="security-input-wrap">
            <span className="security-input-icon">
              <i className="ri-key-2-line"></i>
            </span>

            <input
              type="text"
              className="input-text security-input"
              id="code"
              placeholder="Enter 6 digit code"
              maxLength={6}
              value={props.authenticatorCode.deviceCode}
              required
              onChange={(e) => {
                props.setInvalidCodeErrorMessage("");
                const inputValue = e.target.value;
                const numericValue = inputValue.replace(/\D/g, "");
                if (!isNaN(numericValue) && numericValue.length <= 6) {
                  props.setAuthenticatorCode({
                    ...props.authenticatorCode,
                    deviceCode: numericValue,
                  });
                }
              }}
            />
          </div>

          {props.authError.AuthenticatorCode &&
          (props.authenticatorCode.deviceCode === "" ||
            props.authenticatorCode.deviceCode === null ||
            props.authenticatorCode.deviceCode === undefined) ? (
            <label className="validation security-validation">
              {ERROR_MESSAGES}
            </label>
          ) : (
            <label className="validation security-validation">
              {props.errorInvalidCodeMessage}
            </label>
          )}
        </div>

        <div className="security-field">
          <label htmlFor="authName">
            Authenticator Name
            <span className="security-required">*</span>
          </label>

          <div className="security-input-wrap">
            <span className="security-input-icon">
              <i className="ri-smartphone-line"></i>
            </span>

            <input
              type="text"
              className="input-text security-input"
              id="authName"
              placeholder="Authenticator name"
              value={props.authenticatorCode.authenticatorName}
              required
              onChange={(e) => {
                let inputValue = e.target.value;

                if (inputValue.startsWith(" ")) {
                  inputValue = inputValue.trimStart();
                }

                inputValue =
                  inputValue.charAt(0).toUpperCase() + inputValue.slice(1);

                props.setAuthenticatorCode({
                  ...props.authenticatorCode,
                  authenticatorName: inputValue,
                });
              }}
            />
          </div>

          {props.authError.AuthenticatorCode &&
          (props.authenticatorCode.authenticatorName === "" ||
            props.authenticatorCode.authenticatorName === null ||
            props.authenticatorCode.authenticatorName === undefined) ? (
            <label className="validation security-validation">
              {ERROR_MESSAGES}
            </label>
          ) : (
            ""
          )}
        </div>

        {props.errorMessage && (
          <div className="security-inline-error">
            <i className="ri-error-warning-line"></i>
            <span>{props.errorMessage}</span>
          </div>
        )}
      </div>

      <div className="security-setup-footer">
        <button
          type="button"
          className="btn security-secondary-btn"
          onClick={() => props.BackBtn()}
        >
          <span>{props.getCrudButtonTextName("Cancel")}</span>
        </button>

        <div className="security-footer-right">
          <button
            type="button"
            onClick={() => props.setActiveTab(2)}
            className="btn security-secondary-btn"
          >
            <i className="ri-arrow-left-line"></i>
            <span>Back</span>
          </button>

          <button
            type="button"
            className="btn security-primary-btn"
            onClick={() => {
              props.authenticatorBtnClicked("AuthenticatorApp");
            }}
          >
            <i className="ri-check-line"></i>
            <span>Add Verification</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   STEP 2B — EMAIL
   ========================================================= */
const RegisterEmail = (props) => {
  return (
    <div className="security-setup-step">
      <div className="security-setup-step-intro">
        <span className="security-setup-step-icon">
          <i className="ri-mail-send-line"></i>
        </span>

        <div>
          <h3>Enter your email address</h3>
          <p>
            A 6 digit verification code will be sent to the email address you
            provide.
          </p>
        </div>
      </div>

      <div className="security-form-card">
        <div className="security-field">
          <label>
            Email Address
            <span className="security-required">*</span>
          </label>

          <div className="security-input-wrap">
            <span className="security-input-icon">
              <i className="ri-mail-line"></i>
            </span>

            <input
              type="text"
              className="input-text security-input"
              placeholder="Enter email address"
              value={props.authenticatorCode.UserEmail}
              maxLength={50}
              onChange={(e) => {
                const enteredValue = e.target.value.trim().toLowerCase();

                if (enteredValue.includes("..")) {
                  const correctedValue = enteredValue.replace(/\.+/g, ".");
                  props.setAuthenticatorCode({
                    ...props.authenticatorCode,
                    UserEmail: correctedValue,
                  });
                  return;
                }

                props.setAuthenticatorCode({
                  ...props.authenticatorCode,
                  UserEmail: enteredValue,
                });
              }}
            />
          </div>

          {props.authError.RegisterEmail &&
            (props.authenticatorCode.UserEmail === null ||
            props.authenticatorCode.UserEmail === "" ? (
              <label className="validation security-validation">
                {ERROR_MESSAGES}
              </label>
            ) : (
              !props.isValidEmail(props.authenticatorCode.UserEmail) && (
                <label className="validation security-validation">
                  Invalid email
                </label>
              )
            ))}
        </div>

        {props.errorMessage && (
          <div className="security-inline-error">
            <i className="ri-error-warning-line"></i>
            <span>{props.errorMessage}</span>
          </div>
        )}

        <div className="security-info-box">
          <i className="ri-information-line"></i>
          <span>
            Make sure you can access this email before continuing to the next
            step.
          </span>
        </div>
      </div>

      <div className="security-setup-footer">
        <button
          type="button"
          className="btn security-secondary-btn"
          onClick={() => props.BackBtn()}
        >
          <span>{props.getCrudButtonTextName("Cancel")}</span>
        </button>

        <div className="security-footer-right">
          <button
            type="button"
            onClick={() => props.setActiveTab(1)}
            className="btn security-secondary-btn"
          >
            <i className="ri-arrow-left-line"></i>
            <span>Back</span>
          </button>

          <button
            type="button"
            className="btn security-primary-btn"
            onClick={() => props.authenticatorBtnClicked(5)}
          >
            <span>Next</span>
            <i className="ri-arrow-right-line"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   STEP 3B — EMAIL VERIFICATION CODE
   ========================================================= */
const EmailVerificationCode = (props) => {
  return (
    <div className="security-setup-step">
      <div className="security-setup-step-intro">
        <span className="security-setup-step-icon">
          <i className="ri-mail-check-line"></i>
        </span>

        <div>
          <h3>Verify your email</h3>
          <p>
            Enter the 6 digit verification code received at{" "}
            <strong>{props.authenticatorCode.UserEmail}</strong>.
          </p>
        </div>
      </div>

      <div className="security-form-card">
        <div className="security-field">
          <label>
            Verification Code
            <span className="security-required">*</span>
          </label>

          <div className="security-input-wrap">
            <span className="security-input-icon">
              <i className="ri-key-2-line"></i>
            </span>

            <input
              type="text"
              className="input-text security-input"
              placeholder="Enter 6 digit code"
              value={props.authenticatorCode.deviceCode}
              onChange={(e) => {
                props.setInvalidCodeErrorMessage("");
                const inputValue = e.target.value;
                const numericValue = inputValue.replace(/\D/g, "");
                if (!isNaN(numericValue) && numericValue.length <= 6) {
                  props.setAuthenticatorCode({
                    ...props.authenticatorCode,
                    deviceCode: numericValue,
                  });
                }
              }}
            />
          </div>

          {props.authError.deviceCode &&
          (props.authenticatorCode.deviceCode === "" ||
            props.authenticatorCode.deviceCode === null ||
            props.authenticatorCode.deviceCode === undefined) ? (
            <label className="validation security-validation">
              {ERROR_MESSAGES}
            </label>
          ) : props.errorInvalidCodeMessage !== null ? (
            <label className="validation security-validation">
              {props.errorInvalidCodeMessage}
            </label>
          ) : (
            ""
          )}
        </div>

        {props.errorMessage && (
          <div className="security-inline-error">
            <i className="ri-error-warning-line"></i>
            <span>{props.errorMessage}</span>
          </div>
        )}
      </div>

      <div className="security-setup-footer">
        <button
          type="button"
          className="btn security-secondary-btn"
          onClick={() => props.BackBtn()}
        >
          <span>{props.getCrudButtonTextName("Cancel")}</span>
        </button>

        <div className="security-footer-right">
          <button
            type="button"
            onClick={() => props.setActiveTab(4)}
            className="btn security-secondary-btn"
          >
            <i className="ri-arrow-left-line"></i>
            <span>Back</span>
          </button>

          <button
            type="button"
            className="btn security-primary-btn"
            onClick={() => props.authenticatorBtnClicked("AuthenticateApp")}
          >
            <i className="ri-check-line"></i>
            <span>Add Verification</span>
          </button>
        </div>
      </div>
    </div>
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
    <div className="security-model-redesign">
      <div className="security-model-page">
        {/* PAGE HEADER */}
        <div className="security-model-page-header">
          <div className="security-model-page-heading">
            <BackButtonSvg onClick={BackBtn} />

            <div>
              <h1>2-Step Verification</h1>
              <p>Add a secure verification method to protect your account.</p>
            </div>
          </div>
        </div>

        {/* SETUP CARD */}
        <section className="security-setup-card">
          <div className="security-setup-card-header">
            <div className="security-setup-title">
              <span className="security-setup-title-icon">
                <i className="ri-shield-check-line"></i>
              </span>

              <div>
                <h2>Set Up Verification</h2>
                <p>Complete the steps below to add a verification method.</p>
              </div>
            </div>

            <span className="security-step-badge">
              Step{" "}
              {activeTab === TwoFactor.BasicInformation
                ? "1"
                : activeTab === TwoFactor.ShowQrCode ||
                    activeTab === TwoFactor.RegisterEmail
                  ? "2"
                  : "3"}{" "}
              of 3
            </span>
          </div>

          <div className="security-stepper">
            <div
              className={`security-stepper-item ${
                activeTab >= TwoFactor.BasicInformation ? "is-active" : ""
              }`}
            >
              <span>1</span>
              <strong>Choose Method</strong>
            </div>

            <div className="security-stepper-line"></div>

            <div
              className={`security-stepper-item ${
                activeTab !== TwoFactor.BasicInformation ? "is-active" : ""
              }`}
            >
              <span>2</span>
              <strong>Set Up</strong>
            </div>

            <div className="security-stepper-line"></div>

            <div
              className={`security-stepper-item ${
                activeTab === TwoFactor.AuthenticatorCode ||
                activeTab === TwoFactor.EmailVerification
                  ? "is-active"
                  : ""
              }`}
            >
              <span>3</span>
              <strong>Verify</strong>
            </div>
          </div>

          <div className="security-setup-content">
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
        </section>
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
