/* global $ */
import SuccessModal from "./SuccessModal";
import { Box, Modal, Tooltip, Typography } from "@mui/material";
import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "reactstrap";
import "../../src/Auth/registration/Registration.css";
import { CountryName, CountryCode } from "../redux/Services/CountryApi";
import { UpdateUser } from "../redux/Services/Auth/RegistrationApi";
import Select from "react-select";
import { ERROR_MESSAGES } from "../components/GlobalMessage";
import { useDispatch, useSelector } from "react-redux";
import { GetUserModelData } from "../redux/Services/Setting/UsersApi";
// import Loader from "../../loader/Loader";
import { updateState } from "../redux/Persist";
import { AuthContextProvider } from "../AuthContext/AuthContext";

const UserModelNew = (props) => {
  const modalRef = useRef(null);
  const [socialObj, setSocialObj] = useState({
    firstName: null,
    lastName: null,
    email: undefined,
    phone: undefined,
    phoneCode: 9,
    createdByID: null,
    country: null,
    UserKeyID: null,

  });
  // Declare State

  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [countryCode, setCountryCode] = useState([]);
  const common = useSelector((state) => state.Storage);
  const [open, setOpen] = useState(false);
  // const [loader, setLoader] = useState(true);
  const { setLoader, setTopbar } = useContext(AuthContextProvider);
  const [countryName, setcountryName] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [requireErrorMessage, setRequireErrorMessage] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (props.open) {
      if (
        props.UserKeyID !== undefined &&
        props.UserKeyID !== null &&
        props.UserKeyID !== ""
      ) {
        // call here
        GetSocialLoginModelData(props.UserKeyID);

        GetCountryCodeData();
        GetCountryNameData();
        setOpen(true);
      }
    } else {
      setOpen(false);
    }
  }, [props.open]);

  const GetSocialLoginModelData = async (id) => {
    if (!id) {
      return;
    }
    try {
      const data = await GetUserModelData(id);
      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          const ModelData = data?.data?.responseData?.data;
          setSocialObj({
            ...socialObj,
            firstName: ModelData.firstName,
            lastName: ModelData.lastName,
            email: ModelData.email === null ? "" : ModelData.email,
            phone: ModelData.phoneNumber === null ? "" : ModelData.phoneNumber,
            phoneCode:
              ModelData.countryCodeID === null ? 9 : ModelData.countryCodeID,
            country: ModelData.countryID,
            UserKeyID: ModelData.UserKeyID,
          });
        }
      } else {
        setErrorMessage(data?.data?.errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 1) Country Code Lookup List Api
  const GetCountryCodeData = async () => {
    try {
      const data = await CountryCode();
      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          const CountryCode = data?.data?.responseData?.data;
          setCountryCode(CountryCode);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const CountryCodeOption = countryCode.map((code) => ({
    value: code.countryCodeId,
    label: code.countryCode,
  }));
  // 1) Country option Type Lookup List Api
  const GetCountryNameData = async () => {
    try {
      const data = await CountryName();
      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          const CountryCode = data?.data?.responseData?.data;
          setcountryName(CountryCode);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const CountryNameOption = countryName.map((name) => ({
    value: name.countryId,
    label: name.countryName,
  }));
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const phoneNumberRegex = /^\d{10,15}$/; // Allow between 10 and 15 digits


  const RegistrationAddUpdateBtnClicked = () => {
    let hasError = false;

    if (
      socialObj.firstName === undefined ||
      socialObj.firstName === "" ||
      socialObj.lastName === undefined ||
      socialObj.lastName === "" ||
      socialObj.email === undefined ||
      socialObj.email === "" ||
      !emailRegex.test(socialObj.email) || // Check if email matches the regex pattern
      !phoneNumberRegex.test(socialObj.phone) || // Check if phone
      socialObj.phone === null ||
      socialObj.phone === "" ||
      socialObj.country === null ||
      socialObj.country === "" ||
      socialObj.phoneCode === null ||
      socialObj.phoneCode === ""
    ) {
      hasError = true;

    }


    if (hasError) {
      setRequireErrorMessage(true);
      return false;
    } else {
      setRequireErrorMessage("");
      setErrorMessage("");
    }

    // Preparing Object For Add Update and if any modification then it will done here
    const ApiRequest_ParamsObj = {
      UserKeyID: common.userKeyID,
      UserKeyID_ForUpdate: props.UserKeyID,
      firstName: socialObj.firstName,
      lastName: socialObj.lastName,
      email: socialObj.email,
      countryCodeID: socialObj.phoneCode,
      countryID: socialObj.country,
      phoneNumber: socialObj?.phone,

    };
    $("#" + props.id).modal("hide");

    AddUpdateRegistrationData(ApiRequest_ParamsObj);
  };

  // 3) Add Update Service Category Data Api
  const AddUpdateRegistrationData = async (ApiRequest_ParamsObj) => {
    setLoader(true);
    try {
      const response = await UpdateUser(ApiRequest_ParamsObj);
      if (response) {
        if (response?.status === 200) {
          dispatch(
            updateState({
              mobileNo: socialObj?.phone,
              name: socialObj.firstName,
            })
          );

          setLoader(false);
          setOpen(false);
          setOpenSuccessModal(true);
          props.setShowUserModal(false);
          props.setIsAddUpdateActionDone(true);
        } else {
          setLoader(false);
          setErrorMessage(response?.response?.data?.errorMessage);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isValidPhoneNumber = (phoneNumber) => {
    const phoneNumberRegex = /^\d{10,15}$/; // Allow between 10 and 15 digits
    return phoneNumberRegex.test(phoneNumber);
  };
  const handleCloseModal = () => {
    $("#" + props.id).modal("hide");
    setOpenSuccessModal(false);
    dispatch(
      updateState({
        isPasswordSet: true,
      })
    );
  };
  const handleClose = () => {
    $("#" + props.id).modal("hide");
    setOpenSuccessModal(false);
    setErrorMessage("");
    setRequireErrorMessage("");
  };

  return (
    <div>
      <div
        // style={{ display: openSuccessModal && "none" }}
        class={props.class}
        id={props.id}
        ref={modalRef}
        tabIndex={props.tabIndex}
        aria-hidden="false"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div class="modal-dialog modal-md modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-light p-3">
              <h5 class="modal-title">Update User Profile</h5>

              {common?.mobileNo !== undefined && common?.mobileNo !== null && (
                <button
                  style={{
                    position: "absolute",
                    right: "1.3rem",
                    border: "none",
                    background: "transparent",
                  }}
                  aria-label="Close"
                  onClick={() => {
                    props.setShowUserModal(false);
                    handleClose();
                  }}
                >
                  <i class="bi bi-x-lg"></i>
                </button>
              )}
            </div>

            <div class={`modal-body create-practice-height scrollbar`}>
              <div className="mb-2">
                <label className="form-label">
                  First Name <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className="input-text"
                    placeholder="Enter first name"
                    value={socialObj.firstName}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const trimmedValue = inputValue
                        .replace(/\s+/g, "")
                        .slice(0, 30); // Remove all spaces
                      if (/\d/.test(trimmedValue)) {
                        return;
                      }
                      const capitalizedValue =
                        trimmedValue.charAt(0).toUpperCase() +
                        trimmedValue.slice(1);
                      setSocialObj({
                        ...socialObj,
                        firstName: capitalizedValue,
                      });
                    }}
                  />
                </div>
                {requireErrorMessage &&
                  (socialObj.firstName === undefined ||
                    socialObj.firstName === "") ? (
                  <label className="validation">{ERROR_MESSAGES}</label>
                ) : (
                  ""
                )}
              </div>

              <div className="mt-2">
                <div className="mb-2">
                  <label className="form-label">
                    Last Name <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="input-text"
                      placeholder="Enter last name"
                      value={socialObj.lastName}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        const trimmedValue = inputValue
                          .replace(/\s+/g, "")
                          .slice(0, 30); // Remove all spaces
                        if (/\d/.test(trimmedValue)) {
                          return;
                        }
                        const capitalizedValue =
                          trimmedValue.charAt(0).toUpperCase() +
                          trimmedValue.slice(1);
                        setSocialObj({
                          ...socialObj,
                          lastName: capitalizedValue,
                        });
                      }}
                    />
                  </div>
                  {requireErrorMessage &&
                    (socialObj.lastName === undefined ||
                      socialObj.lastName === "") ? (
                    <label className="validation">{ERROR_MESSAGES}</label>
                  ) : (
                    ""
                  )}
                </div>

                <div className="mt-2">
                  <div className="mb-2">
                    <label className="form-label">
                      Email <span className="text-danger">* </span>
                      {props.Edit ? (
                        <span
                          style={{ fontSize: "10px" }}
                        >{`(If you want to change your email, please contact the admin.)`}</span>
                      ) : (
                        ""
                      )}
                    </label>
                    {props.Edit ? (
                      <Tooltip title="If you want to change your email, please contact the admin.">
                        <div className="input-group">
                          <input
                            type="text"
                            className="input-text"
                            placeholder="Enter email address"
                            onChange={(e) =>
                              setSocialObj({
                                ...socialObj,
                                email: e.target.value,
                              })
                            }
                            disabled={props.Edit}
                            value={socialObj.email}
                          />
                        </div>
                      </Tooltip>
                    ) : (
                      <div className="input-group">
                        <input
                          type="text"
                          className="input-text"
                          placeholder="Enter email address"
                          onChange={(e) => {
                            const trimmedValue = e.target.value.trim();
                            if (!trimmedValue.startsWith(" ")) {
                              setSocialObj({
                                ...socialObj,
                                email: trimmedValue,
                              });
                            }
                          }}
                          disabled={props.Edit}
                          value={socialObj.email}
                        />
                      </div>
                    )}

                    {requireErrorMessage ? (
                      socialObj.email === undefined ||
                        socialObj.email === "" ? (
                        <label className="validation">{ERROR_MESSAGES}</label>
                      ) : !emailRegex.test(socialObj.email) ? (
                        <label className="validation">
                          Enter a valid email.
                        </label>
                      ) : null
                    ) : null}
                  </div>
                </div>
                <div className="mt-2">
                  <div className="mb-2">
                    <label htmlFor="useremail" className="form-label">
                      Phone <span className="text-danger">*</span>
                    </label>
                    <div className="phone-input-div">
                      <Select
                        style={{ padding: "5px", width: "20%" }}
                        class="phone-input-country-code"
                        options={CountryCodeOption}
                        value={CountryCodeOption?.filter(
                          (i) => i.value === socialObj.phoneCode
                        )}
                        onChange={(selectedOption) => {
                          setSocialObj({
                            ...socialObj,
                            phoneCode: selectedOption.value,
                          });
                        }}
                      />
                      <div className="phone-input-number-div">
                        <input
                          style={{ width: "100%" }}
                          className="input-text"
                          type="text"
                          placeholder="Enter phone number"
                          value={socialObj.phone}
                          onChange={(e) => {
                            const sanitizedInput = e.target.value
                              .replace(/[^0-9]/g, "")
                              .slice(0, 15);
                            setSocialObj({
                              ...socialObj,
                              phone: sanitizedInput,
                            });
                          }}
                        />
                      </div>
                    </div>
                    {requireErrorMessage &&
                      (socialObj.phoneCode === "" ||
                        socialObj.phoneCode === null ||
                        socialObj.phone === "" ||
                        socialObj.phone === null) ? (
                      <label className="validation">{ERROR_MESSAGES}</label>
                    ) : requireErrorMessage &&
                      !isValidPhoneNumber(socialObj.phone) ? (
                      <label className="validation">
                        {" "}
                        Invalid phone number{" "}
                      </label>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="mt-2">
                  <div className="mb-2">
                    <label className="form-label">
                      Country <span className="text-danger">*</span>
                    </label>

                    <Select
                      style={{ padding: "5px", width: "100%" }}
                      class="input-text"
                      id="customerName-field"
                      options={CountryNameOption.slice(2)}
                      value={CountryNameOption?.filter(
                        (i) => i.value === socialObj.country
                      )}
                      onChange={(country) => {
                        setSocialObj({ ...socialObj, country: country.value });
                      }}
                      menuPlacement={"auto"}
                    />
                    {requireErrorMessage &&
                      (socialObj.country === "" || socialObj.country === null) ? (
                      <label className="validation">{ERROR_MESSAGES}</label>
                    ) : (
                      ""
                    )}
                  </div>



                  <label
                    className="validation  "
                    style={{ textAlign: "center", display: "block" }}
                  >
                    {errorMessage}
                  </label>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <div className="text-center w-100">
                <button
                  style={{ width: "100%", paddingTop: "5px" }}
                  className="btn btn-md btn-primary create-item-btn"
                  onClick={() => {
                    RegistrationAddUpdateBtnClicked();
                  }}
                >
                  <span>Update Profile </span>
                </button>
              </div>
            </div>
          </div>
          <SuccessModal
            openSuccessModal={openSuccessModal}
            handleClose={handleCloseModal}
            message="User profile has been updated successfully."
            modelAction="ShowMessage"
          />
        </div>
      </div>
    </div>
  );
};

export default UserModelNew;
