/* global $ */

import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ResetCurrentPassword } from "../../redux/Services/Auth/PasswordApi";
import SuccessModal from "../../components/SuccessModal";
import { ERROR_MESSAGES } from "../../components/GlobalMessage";
import { AuthContextProvider } from "../../AuthContext/AuthContext";
import { updateState } from "../../redux/Persist";
import "./ResetPasswordModal-redesign.css";
function ResetPasswordModal(props) {
  /* -------------------------------------------------------------------------- */
  /*                                Declare State                               */
  /* -------------------------------------------------------------------------- */
  const [errorMessage, setErrorMessage] = useState();
  const [dismissModal, setDismissModal] = useState(null);
  const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
  const [modelAction, setModelAction] = useState(null);
  const [RequireErrorMessage, setRequireErrorMessage] = useState(false);
  const [showCurrentPassword, setCurrentShowPassword] = useState(false);
  const [showNewPassword, setNewShowPassword] = useState(false);
  const [showConfirmNewPassword, setConfirmNewShowPassword] = useState(false);
  const [CreateNewPassword, setCreateNewPassword] = useState({
    Password: "",
    ConfirmPassword: "",
    CurrentPassword: "",
  });
  const { setLoader } = useContext(AuthContextProvider);
  const [hasError, setHasError] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    Password: "",
    ConfirmPassword: "",
  });
  const common = useSelector((state) => state.Storage);
  const dispatch = useDispatch();

  // Preparing Object after all entered user details are valid
  const CreateNewPasswordClicked = () => {
    let hasError = false;
    const ApiRequest_ParamsObj = {
      createPassword: CreateNewPassword.Password,
      confirmPassword: CreateNewPassword.ConfirmPassword,
      currentPassword: common.isPasswordSet
        ? CreateNewPassword.CurrentPassword
        : "DummyCurrentPassword",
      userKeyID: common.userKeyID,
      userToken: props.EmailToken,
    };
    // validation logic
    if (common.isPasswordSet === true) {
      if (
        CreateNewPassword.Password === undefined ||
        CreateNewPassword.Password === "" ||
        CreateNewPassword.ConfirmPassword === undefined ||
        CreateNewPassword.ConfirmPassword === "" ||
        CreateNewPassword.CurrentPassword === undefined ||
        CreateNewPassword.CurrentPassword === ""
      ) {
        hasError = true;
        setHasError(false);
        setRequireErrorMessage(true);
        return false; // Return false or handle your error logic here if needed.
      } else if (
        CreateNewPassword.CurrentPassword === CreateNewPassword.Password
      ) {
        setRequireErrorMessage(false);
        setErrorMessage("Current password and new password should not be same");
        hasError = true;
        setHasError(true);
        return false;
      } else if (
        CreateNewPassword.Password !== CreateNewPassword.ConfirmPassword
      ) {
        setErrorMessage("");
        setHasError(true);
        setValidationErrors({
          ...validationErrors,
          ConfirmPassword: "Passwords do not match.",
        });
        setRequireErrorMessage(false);
        setRequireErrorMessage(true);
        hasError = true;
        return false;
      } else {
        hasError = false;
        setHasError(false);
      }
    } else if (common.isPasswordSet === false) {
      if (
        CreateNewPassword.Password === undefined ||
        CreateNewPassword.Password === "" ||
        CreateNewPassword.ConfirmPassword === undefined ||
        CreateNewPassword.ConfirmPassword === ""
      ) {
        hasError = true;
        setHasError(true);
        setRequireErrorMessage(true);
        return false; // Return false or handle your error logic here if needed.
      } else if (
        CreateNewPassword.Password !== CreateNewPassword.ConfirmPassword
      ) {
        setErrorMessage("");
        setHasError(true);
        setValidationErrors({
          ...validationErrors,
          ConfirmPassword: "Passwords do not match.",
        });
        setRequireErrorMessage(false);
        setRequireErrorMessage(true);
        hasError = true;
        return false;
      } else {
        hasError = false;
        setHasError(false);
      }
    }

    const pass = /^(?=.*\d)(?=.*[-@$!%*#?&])[A-Za-z\d\-@$!%*#?&]{8,}$/.test(
      CreateNewPassword.Password,
    );
    if (!pass) {
      hasError = true;
    } else {
      hasError = false;
    }
    if (!hasError) {
      setRequireErrorMessage(false); // Clear the error message if there are no errors.
      CreateNewPasswordData(ApiRequest_ParamsObj);
    }
  };

  // 3) Reset Password api call here
  const CreateNewPasswordData = async (ApiRequest_ParamsObj) => {
    setLoader(true);
    try {
      const response = await ResetCurrentPassword(ApiRequest_ParamsObj);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setOpenSuccessModal(true);
          $("#" + props.id).modal("hide");
          setLoader(false);
        } else {
          {
            response?.response?.data.errorMessage
              ? setErrorMessage(response?.response?.data.errorMessage)
              : setErrorMessage("Something went wrong");
            setLoader(false);
          }
        }
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  const handleClose = () => {
    $("#" + props.id).modal("hide");
    setOpenSuccessModal(false);
    setErrorMessage("");
    setInitialData();
    setRequireErrorMessage(false);
  };
  const handleCloseOnSuccess = () => {
    $("#" + props.id).modal("hide");
    setOpenSuccessModal(false);
    setErrorMessage("");
    setInitialData();
    setRequireErrorMessage(false);

    dispatch(
      updateState({
        isPasswordSet: true,
      }),
    );
  };

  // Blank All field and there if any validation error occurs.
  const setInitialData = () => {
    setCreateNewPassword({
      Password: "",
      ConfirmPassword: "",
      CurrentPassword: "",
    });
    setValidationErrors({
      Password: "",
      ConfirmPassword: "",
    });
  };

  //handle Function New password
  const handlePasswordChange = (e) => {
    setErrorMessage("");
    setValidationErrors({ ...validationErrors, ConfirmPassword: "" });
    const inputValue = e.target.value;
    const trimmedValue = inputValue.replace(/\s+/g, ""); // Remove leading spaces
    setCreateNewPassword({ ...CreateNewPassword, Password: trimmedValue });
    validatePassword(trimmedValue);
  };

  //handle Function Confirm  password
  const handleConfirmPasswordChange = (e) => {
    setErrorMessage("");

    const inputValue = e.target.value;
    const trimmedValue = inputValue.replace(/\s+/g, ""); // Remove leading spaces
    setCreateNewPassword({
      ...CreateNewPassword,
      ConfirmPassword: trimmedValue,
    });
    setValidationErrors({ ...validationErrors, ConfirmPassword: "" });
    validateConfirmPassword(trimmedValue);
  };

  // validation Function for new password
  const validatePassword = (password) => {
    const isFieldEmpty = password.trim() === "";
    const patternError = isFieldEmpty
      ? ""
      : /^(?=.*\d)(?=.*[-@$!%*#?&])[A-Za-z\d\-@$!%*#?&]{8,}$/.test(password)
        ? ""
        : "Password should be minimum 8 characters long. It must contain at least 1 letter, at least 1 number and at least one special character, and only from the following set (others not allowed): - @ $ ! % * # ? &";

    setValidationErrors({
      ...validationErrors,
      Password: patternError,
    });
  };
  // validation Function for Confirm password
  const validateConfirmPassword = (confirmPassword) => {
    if (confirmPassword !== CreateNewPassword.Password) {
      setValidationErrors({
        ...validationErrors,
        ConfirmPassword: "Passwords do not match.",
      });
      setHasError(true);
    } else {
      setValidationErrors({ ...validationErrors, ConfirmPassword: "" });
      setHasError(false);
    }
  };
  // Below Three function are show and hide the pass char on there Respective password field
  const toggleCurrentPasswordVisibility = () => {
    setCurrentShowPassword(!showCurrentPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setNewShowPassword(!showNewPassword);
  };

  const toggleConfirmNewPasswordVisibility = () => {
    setConfirmNewShowPassword(!showConfirmNewPassword);
  };

  const handlePaste = (e) => {
    e.preventDefault();
  };

  /* ---------------------- Design Part Start From Here. ---------------------- */
  return (
    <div
      className="modal fade zoomIn reset-password-redesign"
      id="ResetPasswordModal"
      tabIndex="-1"
      aria-hidden="false"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-md modal-dialog-centered reset-password-dialog">
        <div className="modal-content reset-password-content">
          <div className="modal-header reset-password-header">
            <div className="reset-password-heading">
              <span className="reset-password-heading-icon">
                <i className="ri-lock-password-line"></i>
              </span>

              <div className="reset-password-heading-copy">
                <h5 className="modal-title" id="exampleModalLabel">
                  {common.isPasswordSet ? "Reset Password" : "Set Password"}
                </h5>
                <p>
                  {common.isPasswordSet
                    ? "Create a new secure password for your account."
                    : "Set a secure password to protect your account."}
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              type="button"
              className="btn-close reset-password-close"
              id="close-modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body reset-password-body">
            <div className="reset-password-form">
              {common.isPasswordSet && (
                <div className="reset-password-field">
                  <label className="reset-password-label">
                    Current Password
                    <span className="reset-password-required">*</span>
                  </label>

                  <div className="reset-password-input-wrap">
                    <span className="reset-password-input-icon">
                      <i className="ri-lock-line"></i>
                    </span>

                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      className="input-text reset-password-input"
                      placeholder="Enter current password"
                      value={CreateNewPassword.CurrentPassword}
                      maxLength={20}
                      autoComplete="new-password"
                      onChange={(e) => {
                        setErrorMessage("");
                        setValidationErrors({
                          ...validationErrors,
                          ConfirmPassword: "",
                        });
                        const inputValue = e.target.value;
                        const trimmedValue = inputValue.replace(/\s+/g, "");
                        setCreateNewPassword({
                          ...CreateNewPassword,
                          CurrentPassword: trimmedValue,
                        });
                      }}
                    />

                    <button
                      className="reset-password-eye-btn"
                      type="button"
                      id="password-addon"
                      onClick={toggleCurrentPasswordVisibility}
                    >
                      <i
                        className={
                          showCurrentPassword
                            ? "ri-eye-off-line"
                            : "ri-eye-line"
                        }
                      ></i>
                    </button>
                  </div>

                  {RequireErrorMessage &&
                  (CreateNewPassword.CurrentPassword === undefined ||
                    CreateNewPassword.CurrentPassword === "") ? (
                    <label className="validation reset-password-validation">
                      {ERROR_MESSAGES}
                    </label>
                  ) : (
                    ""
                  )}
                </div>
              )}

              <div className="reset-password-field">
                <label className="reset-password-label">
                  New Password
                  <span className="reset-password-required">*</span>
                </label>

                <div className="reset-password-input-wrap">
                  <span className="reset-password-input-icon">
                    <i className="ri-key-2-line"></i>
                  </span>

                  <input
                    type={showNewPassword ? "text" : "password"}
                    className="input-text reset-password-input"
                    placeholder="Create new password"
                    value={CreateNewPassword.Password}
                    onChange={handlePasswordChange}
                    required
                    maxLength={20}
                  />

                  <button
                    className="reset-password-eye-btn"
                    type="button"
                    id="password-addon"
                    onClick={toggleNewPasswordVisibility}
                  >
                    <i
                      className={
                        showNewPassword ? "ri-eye-off-line" : "ri-eye-line"
                      }
                    ></i>
                  </button>
                </div>

                {RequireErrorMessage &&
                (CreateNewPassword.Password === undefined ||
                  CreateNewPassword.Password === "") ? (
                  <label className="validation reset-password-validation">
                    {ERROR_MESSAGES}
                  </label>
                ) : (
                  ""
                )}

                {validationErrors.Password && (
                  <label className="validation reset-password-validation">
                    {validationErrors.Password}
                  </label>
                )}
              </div>

              <div className="reset-password-field">
                <label className="reset-password-label">
                  Confirm New Password
                  <span className="reset-password-required">*</span>
                </label>

                <div className="reset-password-input-wrap">
                  <span className="reset-password-input-icon">
                    <i className="ri-shield-check-line"></i>
                  </span>

                  <input
                    type={showConfirmNewPassword ? "text" : "password"}
                    className="input-text reset-password-input"
                    value={CreateNewPassword.ConfirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                    placeholder="Confirm new password"
                    maxLength={20}
                  />

                  <button
                    className="reset-password-eye-btn"
                    type="button"
                    id="password-addon"
                    onClick={toggleConfirmNewPasswordVisibility}
                  >
                    <i
                      className={
                        showConfirmNewPassword
                          ? "ri-eye-off-line"
                          : "ri-eye-line"
                      }
                    ></i>
                  </button>
                </div>

                {RequireErrorMessage &&
                (CreateNewPassword.ConfirmPassword === undefined ||
                  CreateNewPassword.ConfirmPassword === "") ? (
                  <label className="validation reset-password-validation">
                    {ERROR_MESSAGES}
                  </label>
                ) : (
                  ""
                )}

                {hasError && validationErrors.ConfirmPassword && (
                  <label className="validation reset-password-validation">
                    {validationErrors.ConfirmPassword}
                  </label>
                )}
              </div>

              {errorMessage && (
                <div className="reset-password-api-error">
                  <i className="ri-error-warning-line"></i>
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="reset-password-note">
                <span className="reset-password-note-icon">
                  <i className="ri-information-line"></i>
                </span>

                <div>
                  <strong>Password requirements</strong>
                  <p>
                    Minimum 8 characters with at least 1 letter, 1 number and 1
                    special character from: - @ $ ! % * # ? &amp;
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer reset-password-footer">
            <button
              onClick={handleClose}
              type="button"
              className="btn reset-password-cancel-btn"
            >
              Cancel
            </button>

            <button
              onClick={CreateNewPasswordClicked}
              type="submit"
              className="btn btn-md btn-success create-item-btn reset-password-submit-btn"
              id="add-btn"
              data-bs-target="#ResetPass"
            >
              <i className="ri-check-line"></i>
              <span>
                {common.isPasswordSet ? "Reset Password" : "Set Password"}
              </span>
            </button>
          </div>
        </div>
      </div>

      <SuccessModal
        handleClose={handleCloseOnSuccess}
        setDismissModal={setDismissModal}
        setOpenSuccessModal={setOpenSuccessModal}
        openSuccessModal={openSuccessModal}
        modelAction={modelAction}
        message={
          common.isPasswordSet
            ? "Password has been reset successfully."
            : "Password has been set successfully."
        }
      />
    </div>
  );
}

export default ResetPasswordModal;
