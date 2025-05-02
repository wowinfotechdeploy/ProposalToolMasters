/* global $ */

import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ResetCurrentPassword } from "../../redux/Services/Auth/PasswordApi";
import SuccessModal from "../../components/SuccessModal";
import { ERROR_MESSAGES } from "../../components/GlobalMessage";
import { AuthContextProvider } from "../../AuthContext/AuthContext";
import { updateState } from "../../redux/Persist";
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

    const pass =
      /^(?=.*\d)(?=.*[-@$!%*#?&])[A-Za-z\d!@#$%^&*?()_+\-]{8,}$/.test(
        CreateNewPassword.Password
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
      })
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
      : /^(?=.*\d)(?=.*[-@$!%*#?&])[A-Za-z\d!@#$%^&*?()_+\-]{8,}$/.test(
        password
      )
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
      class="modal fade zoomIn"
      id="ResetPasswordModal"
      tabindex="-1"
      aria-hidden="false"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div class="modal-dialog modal-md modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-light p-3">
            <h5 class="modal-title" id="exampleModalLabel">
              {common.isPasswordSet ? "Reset Password" : "Set Password"}
            </h5>
            <button
              onClick={handleClose}
              type="button"
              class="btn-close"
              id="close-modal"
            ></button>
          </div>
          <div class="modal-body">
            <div class="tab-content">
              {common.isPasswordSet && (
                <div className="row fieldset">
                  <div className="col-lg-4">
                    <label className="form-label">
                      Current Password<span className="text-danger">*</span>
                    </label>
                  </div>
                  <div className="col-lg-8">
                    <div className="input-group">
                      <input
                        // onPaste={handlePaste}
                        type={showCurrentPassword ? "text" : "password"}
                        className="input-text"
                        placeholder="Current Password"
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
                          const trimmedValue = inputValue.replace(/\s+/g, ""); // Remove leading spaces
                          setCreateNewPassword({
                            ...CreateNewPassword,
                            CurrentPassword: trimmedValue,
                          });
                        }}
                      // onCopy={(e) => e.preventDefault()} // Prevent default copy behavior
                      // onCut={(e) => e.preventDefault()} // Prevent default cut behavior
                      // onDrag={(e) => e.preventDefault()} // Prevent default drag behavior
                      // onDrop={(e) => e.preventDefault()} // Prevent default drop behavior
                      />
                    </div>
                    {RequireErrorMessage &&
                      (CreateNewPassword.CurrentPassword === undefined ||
                        CreateNewPassword.CurrentPassword === "") ? (
                      <label className="validation">{ERROR_MESSAGES}</label>
                    ) : (
                      ""
                    )}
                    <button
                      className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                      type="button"
                      id="password-addon"
                      onClick={toggleCurrentPasswordVisibility}
                    >
                      <i className="ri-eye-fill align-middle"></i>
                    </button>
                  </div>
                </div>
              )}

              <div className="row fieldset">
                <div className="col-lg-4">
                  <label className="form-label">
                    New Password<span className="text-danger">*</span>
                  </label>
                </div>
                <div className="col-lg-8">
                  <div className="input-group">
                    <input
                      // onPaste={handlePaste}
                      type={showNewPassword ? "text" : "password"}
                      className="input-text"
                      placeholder="Create Password"
                      value={CreateNewPassword.Password}
                      onChange={handlePasswordChange}
                      required
                      maxLength={20}
                    />
                  </div>
                  {RequireErrorMessage &&
                    (CreateNewPassword.Password === undefined ||
                      CreateNewPassword.Password === "") ? (
                    <label className="validation">{ERROR_MESSAGES}</label>
                  ) : (
                    ""
                  )}
                  {validationErrors.Password && (
                    <label className="validation">
                      {validationErrors.Password}
                    </label>
                  )}
                  <button
                    className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                    type="button"
                    id="password-addon"
                    onClick={toggleNewPasswordVisibility}
                  >
                    <i className="ri-eye-fill align-middle"></i>
                  </button>
                </div>
              </div>
              <div className="row fieldset">
                <div className="col-lg-4">
                  <label className="form-label">
                    Confirm New Password<span className="text-danger">*</span>
                  </label>
                </div>

                <div className="col-lg-8">
                  <div className="input-group">
                    <input
                      // onPaste={handlePaste}
                      type={showConfirmNewPassword ? "text" : "password"}
                      className="input-text"
                      value={CreateNewPassword.ConfirmPassword}
                      onChange={handleConfirmPasswordChange}
                      required
                      placeholder="Confirm Password"
                      maxLength={20}
                    // onCopy={(e) => e.preventDefault()} // Prevent default copy behavior
                    // onCut={(e) => e.preventDefault()} // Prevent default cut behavior
                    // onDrag={(e) => e.preventDefault()} // Prevent default drag behavior
                    // onDrop={(e) => e.preventDefault()} // Prevent default drop behavior
                    />
                  </div>
                  {RequireErrorMessage &&
                    (CreateNewPassword.ConfirmPassword === undefined ||
                      CreateNewPassword.ConfirmPassword === "") ? (
                    <label className="validation">{ERROR_MESSAGES}</label>
                  ) : (
                    ""
                  )}
                  {hasError && validationErrors.ConfirmPassword && (
                    <label className="validation">
                      {validationErrors.ConfirmPassword}
                    </label>
                  )}
                  <button
                    className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                    type="button"
                    id="password-addon"
                    onClick={toggleConfirmNewPasswordVisibility}
                  >
                    <i className="ri-eye-fill align-middle"></i>
                  </button>
                </div>
              </div>
              <label
                style={{ display: "flex", justifyContent: "center" }}
                className="validation"
              >
                {errorMessage}
              </label>
            </div>
            <span
              style={{ fontSize: "12px" }}
            >{`Note:Password should be minimum 8 characters long. It must contain at least 1 letter, at least 1 number and at least one special character, and only from the following set (others not allowed): - @ $ ! % * # ? &`}
            </span>
          </div>

          <div class="modal-footer">
            <div class="hstack gap-2 justify-content-end">
              <button
                onClick={CreateNewPasswordClicked}
                type="submit"
                class="btn btn-md btn-success create-item-btn"
                id="add-btn"
                data-bs-target="#ResetPass"
              >
                <span>
                  {common.isPasswordSet ? "Reset Password" : "Set Password"}
                </span>
              </button>
            </div>
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
