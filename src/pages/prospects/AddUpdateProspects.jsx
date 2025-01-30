/* global $ */
import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContextProvider } from "../../AuthContext/AuthContext";
import {
  GetBusinessTypeLookupList,
  GetProspectTypeVariationLookupList,
} from "../../redux/Services/Master/BusinessTypeLookupListApi";
import { ERROR_MESSAGES } from "../../components/GlobalMessage";
import "../configure/packages/Package.css";
import "../../pages/Settings/Organisations/Update-practice-details.css";
import Upload_image_modal from "../../components/UpdateImageModel/Upload_image_modal";
import AddressModal from "../../components/AddressModal/AddressModal";
import Utils from "../../Middleware/Utils";
import Radio from "@mui/material/Radio";
import Select from "react-select";
import {
  GetCompanyDetails,
  GetCompanyList,
  GetCompanyOfficers,
} from "../../redux/Services/Master/companyDetailsAPI";
import { useDispatch, useSelector } from "react-redux";
import { CountryCode, CountryName } from "../../redux/Services/CountryApi";
import Switch from "@mui/material/Switch";
import { CLIENT_TYPES, CREATE_PRACTICE_DETAILS } from "../../Middleware/enums";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import {
  AddUpdateLogo,
  AddUpdateOrganisation,
  AddUpdateSignature,
} from "../../redux/Services/Setting/Organisation";
import SuccessModal from "../../components/SuccessModal";
import { updateState } from "../../redux/Persist";
import { GetIncorporatedInLookUpList } from "../../redux/Services/Master/IncorporatedInLookUpList";
import { GetClientInformationModel } from "../../redux/Services/client/clientAPI";
import { GetNOBTypeLookupList } from "../../redux/Services/Master/NOBTypeLookupListApi";
import BackButtonSvg from "../../components/BackButtonSvg";
import InvalidFormIcon from "../../components/InvalidFormIcon";
import ErrorModel from "../../components/ErrorModel";
import { Tooltip } from "@mui/material";
// Basic Information component
const Basic_information = (props) => {
  const [openAddressPopUp, setOpenAddressPopUp] = useState(false);

  const prospectDivContainerRef = useRef(null);

  const handleAddressPopUpClose = () => {
    setOpenAddressPopUp(false);
  };
  const [type, setType] = useState("");
  const handleImageUpload = () => {
    if (type == "Signature") {
      const file = props.basicInfo.signatoryImage; // Assuming you only want to handle the first selected file
      const reader = new FileReader();
      reader.onload = () => {
        const base64ImageData = reader.result;
        props.setSignature(base64ImageData);
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    }
  };

  const handleOpenTradingAddressPopup = (e) => {
    let tradingAddress = {
      addressId: props.basicInfo.tradingAddress?.addressId
        ? props.basicInfo.tradingAddress.addressId
        : null,
      premises: props.basicInfo.tradingAddress?.premises
        ? props.basicInfo.tradingAddress.premises
        : "",
      addressLine1: props.basicInfo.tradingAddress?.addressLine1
        ? props.basicInfo.tradingAddress.addressLine1
        : "",
      addressLine2: props.basicInfo.tradingAddress?.addressLine2
        ? props.basicInfo.tradingAddress.addressLine2
        : "",
      locality: props.basicInfo.tradingAddress?.locality
        ? props.basicInfo.tradingAddress.locality
        : "",
      region: props.basicInfo.tradingAddress?.region
        ? props.basicInfo.tradingAddress.region
        : "",
      country: props.basicInfo.tradingAddress?.country
        ? props.basicInfo.tradingAddress.country
        : "",
      countryId: props.basicInfo.tradingAddress?.countryId
        ? props.basicInfo.tradingAddress.countryId
        : null,
      postcode: props.basicInfo.tradingAddress?.postcode
        ? props.basicInfo.tradingAddress.postcode
        : "",
    };
    props.setAddress(tradingAddress);
    setOpenAddressPopUp(true);
  };

  const handleBusinessTypeChange = (e) => {
    if (e.value == props.basicInfo.businessTypeID) {
      return;
    }
    const defaultOfficer = {
      officerID: null,
      firstName: null,
      lastName: null,
      countryCodeID: 9,
      phoneCountryCodeID: { value: 9, label: "+44" },
      phoneNo: null,
      emailID: null,
      addressID: null,
      isAuthorisedSignatory: false,
      officerRole: null,
      appointedOn: null,
      moduleName: null,
      moduleID: null,
      officersAddress: {
        addressId: null,
        premises: null,
        addressLine1: null,
        addressLine2: null,
        locality: null,
        region: null,
        countryId: null,
        postcode: null,
      },
    };
    props.setSearchCompany("");
    let companyObj = {
      ...props.companyForm,
      companyName: "",
      incInID: "",
      companyType: "",
      companyNumber: "",
      companyStatus: "",
      incorporationDate: "",
      companyAddress: "",
    };
    props.setConcatenatedRegisterAddress("");
    props.setCompanyForm(companyObj);
    props.setOfficersError(false);
    props.setConcatenatedResidentialAddress([{ officersFullAddress: "" }]);
    props.setOfficers([defaultOfficer]);
    props.setConcatenatedTradingAddress("");
    props.setBasicInfo?.({
      ...props.basicInfo,
      tradingName: "",
      tradingAddress: null,
      VATReg: 1,
      VATNumber: null,
      businessNatureID: [],
      website: null,
      businessTypeName: e.label,
      businessTypeID: Number(e.value),
      originalBusinessTypeID: e.originalBusinessTypeID,
    });
    props.setRequireErrorMessage(false);
  };

  const IncorporatedValue = props.incorporatedInList.filter(
    (item) => props.companyForm?.incInID == item.value
  );

  // Individual details functions
  const [index, setIndex] = useState(0);
  const { prospectName, proposalName, scrollUptoCurrentPosition } =
    useContext(AuthContextProvider);

  const handleOpenRegisterOfficeAddressPopup = (e, AddressIndex) => {
    props.setSelectedOfficerAddressIndex(AddressIndex);
    let officerAddress = {
      addressId: props.officersForm[AddressIndex].officersAddress?.addressId
        ? props.officersForm[AddressIndex].officersAddress?.addressId
        : null,
      premises: props.officersForm[AddressIndex].officersAddress?.premises
        ? props.officersForm[AddressIndex].officersAddress?.premises
        : "",
      addressLine1: props.officersForm[AddressIndex].officersAddress
        ?.addressLine1
        ? props.officersForm[AddressIndex].officersAddress?.addressLine1
        : "",
      addressLine2: props.officersForm[AddressIndex].officersAddress
        ?.addressLine2
        ? props.officersForm[AddressIndex].officersAddress?.addressLine2
        : "",
      locality: props.officersForm[AddressIndex].officersAddress?.locality
        ? props.officersForm[AddressIndex].officersAddress?.locality
        : "",
      region: props.officersForm[AddressIndex].officersAddress?.region
        ? props.officersForm[AddressIndex].officersAddress?.region
        : "",
      country: props.officersForm[AddressIndex].officersAddress?.countryName
        ? props.officersForm[AddressIndex].officersAddress?.countryName
        : "",
      countryId: props.officersForm[AddressIndex].officersAddress?.countryId
        ? props.officersForm[AddressIndex].officersAddress?.countryId
        : null,
      postcode: props.officersForm[AddressIndex].officersAddress?.postcode
        ? props.officersForm[AddressIndex].officersAddress?.postcode
        : "",
    };
    props.setAddress(officerAddress);

    setOpenAddressPopUp(true);
  };

  const isValidEmail = (email) => {
    // Regular expression for a basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    // Allow only digits and ensure the length is between 10 and 15
    const phoneNumberRegex = /^\d{10,15}$/;
    return phoneNumberRegex.test(phoneNumber);
  };

  const VATRegFilter = Utils.VAT_Registered.find(
    (item) => props.basicInfo.VATReg == item.value
  );
  function formatDate(dateString) {
    const dateObject = new Date(dateString);
    const formattedDate = `${dateObject.getDate()}/${dateObject.getMonth() + 1
      }/${dateObject.getFullYear()}`;
    return formattedDate;
  }
  const isValidWebUrl = (web) => {
    // Regular expression for a basic URL validation
    const urlRegex =
      /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    return urlRegex.test(web);
  };

  // const prospectDivContainerRef = useRef(null);

  // const prospectBasicInfoScrollToTop = () => {
  //   alert(prospectDivContainerRef.current)
  //   if (prospectDivContainerRef.current) {
  //     prospectDivContainerRef.current.scrollTop = 0;
  //   }
  // };

  // const [menuIsOpen, setMenuIsOpen] = useState(false);

  // const prospectBasicInfoScrollToTop = () => {
  //   if (prospectDivContainerRef.current) {
  //     prospectDivContainerRef.current.scrollTop = 0;
  //   }
  // };

  // const prospectBasicInfoScrollToBottom = () => {
  //   if (prospectDivContainerRef.current) {
  //     prospectDivContainerRef.current.scrollTop = prospectDivContainerRef.current.scrollHeight;

  //   }
  // };

  // const handleMenuOpen = () => {
  //   setMenuIsOpen(true);
  //   prospectBasicInfoScrollToBottom();
  // };
  const SelectBusinessTypeValue = props.BusinessTypeLookupList.find((item) => {
    return item.value == props.basicInfo.businessTypeID;
  });

  return (
    <>
      <div
        className={
          props.basicInfo.originalBusinessTypeID === CLIENT_TYPES.Sole_Trader ||
            props.basicInfo.originalBusinessTypeID === CLIENT_TYPES.Other ||
            props.basicInfo.originalBusinessTypeID === CLIENT_TYPES.Partnership
            ? `scrollbar`
            : "create-practice-height scrollbar"
        }
        ref={prospectDivContainerRef}
        onClick={(e) => scrollUptoCurrentPosition(e, prospectDivContainerRef)}
      >
        <div className="tab-content">
          <div className="tab-pane p-3 active">
            <div class="row fieldset" id="ProspectType_Div">
              <div class="col-md-3 col-sm-12 text-start text-md-end">
                <label class="fieldset-label required">
                  {prospectName} Type
                </label>
                <span class="text-danger">*</span>
              </div>
              <div class="col-lg-9 col-md-8 col-sm-12">
                <div className="mb businessType input-group">
                  <Select
                    className="user-role-select"
                    style={{ padding: "5px", width: "20%" }}
                    options={props.BusinessTypeLookupList}
                    value={SelectBusinessTypeValue}
                    // value={{
                    //   value: props.basicInfo.businessTypeID,
                    //   label: props.basicInfo.businessTypeName,
                    // }}
                    onChange={(e) => {
                      handleBusinessTypeChange(e);
                    }}
                  />
                  {props.requireErrorMessage &&
                    (props.basicInfo.businessTypeID === "" ||
                      props.basicInfo.businessTypeID === null) ? (
                    <span className="validation">{ERROR_MESSAGES}</span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            {/* ...........Individual Row........... */}
            {props.basicInfo.originalBusinessTypeID ===
              CLIENT_TYPES.Individual && (
                <>
                  {props.officersForm?.map((item, index) => {
                    return (
                      <>
                        <div
                          className="row fieldset"
                          id={`FirstName_Div_${index}`}
                        >
                          <div className="col-md-3 col-sm-12 text-start text-md-end">
                            <label class="fieldset-label required">
                              First Name
                              <span style={{ color: "#ec4561" }}>*</span>
                            </label>
                          </div>
                          <div class="col-lg-9 col-md-8 col-sm-12">
                            <input
                              type="text"
                              className="input-text"
                              placeholder="First Name"
                              value={props.officersForm[index].firstName}
                              onChange={(e) => {
                                const inputValue = e.target.value.trim();
                                // Reject input if it contains numeric characters
                                // Remove all spaces and dots
                                const cleanedValue = inputValue.replace(
                                  /[.\s]/g,
                                  ""
                                );
                                // Reject input if it starts with a digit
                                if (/\d/.test(cleanedValue)) {
                                  return;
                                }
                                const capitalizedValue =
                                  cleanedValue.charAt(0).toUpperCase() +
                                  cleanedValue.slice(1);
                                props.OnOfficerChange(
                                  index,
                                  "firstName",
                                  capitalizedValue
                                );
                              }}
                              maxLength={20}
                            />
                            {props.officerError &&
                              (props.officersForm[index].firstName === null ||
                                props.officersForm[index].firstName === "") ? (
                              <span className="validation">{ERROR_MESSAGES}</span>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        <div
                          className="row fieldset"
                          id={`LastName_Div_${index}`}
                        >
                          <div className="col-md-3 col-sm-12 text-start text-md-end">
                            <label class="fieldset-label required">
                              Last Name
                              <span style={{ color: "#ec4561" }}>*</span>
                            </label>
                          </div>
                          <div class="col-lg-9 col-md-8 col-sm-12">
                            <input
                              type="text"
                              class="input-text"
                              placeholder="Last Name"
                              value={props.officersForm[index].lastName}
                              onChange={(e) => {
                                const inputValue = e.target.value;

                                // Remove all spaces and dots
                                const cleanedValue = inputValue.replace(
                                  /[.\s]/g,
                                  ""
                                );

                                // Reject input if it starts with a digit
                                if (/\d/.test(cleanedValue)) {
                                  return;
                                }

                                const capitalizedValue =
                                  cleanedValue.charAt(0).toUpperCase() +
                                  cleanedValue.slice(1);
                                props.OnOfficerChange(
                                  index,
                                  "lastName",
                                  capitalizedValue
                                );
                              }}
                              maxLength={20}
                            />
                            {props.officerError &&
                              (props.officersForm[index].lastName === null ||
                                props.officersForm[index].lastName === "") ? (
                              <span className="validation">{ERROR_MESSAGES}</span>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        <div class="row fieldset" id={`Phone_Div_${index}`}>
                          <div class="col-md-3 col-sm-12 text-start text-md-end">
                            <label class="fieldset-label required">Phone</label>
                          </div>
                          <div class="col-lg-9 col-md-8 col-sm-12 ">
                            <div className="phone-input-div">
                              <Select
                                style={{ padding: "5px", width: "20%" }}
                                className="createCompanyInfo"
                                options={props.countryCodes}
                                value={
                                  props.officersForm[index]?.phoneCountryCodeID
                                }
                                onChange={(e) => {
                                  setIndex(index);
                                  props.OnOfficerChange(
                                    index,
                                    "phoneCountryCodeID",
                                    e
                                  );
                                  props.OnOfficerChange(
                                    index,
                                    "countryCodeID",
                                    e.value
                                  );
                                }}
                              />
                              <div className="phone-input-number-div">
                                <input
                                  style={{ width: "100%" }}
                                  className="input-text"
                                  type="text"
                                  placeholder="Phone"
                                  value={props.officersForm[index].phoneNo}
                                  onChange={(e) => {
                                    // Ensure that the input only contains numeric characters
                                    const sanitizedInput = e.target.value
                                      .replace(/[^0-9]/g, "")
                                      .slice(0, 15);
                                    props.OnOfficerChange(
                                      index,
                                      "phoneNo",
                                      sanitizedInput
                                    );
                                  }}
                                />
                              </div>
                            </div>
                            {props.officerError &&
                              props.officersForm[index].phoneNo !== null &&
                              props.officersForm[index].phoneNo !== "" &&
                              props.officersForm[index].phoneNo !== undefined &&
                              !isValidPhoneNumber(
                                props.officersForm[index].phoneNo
                              ) && (
                                <span className="validation">
                                  {" "}
                                  Invalid phone number{" "}
                                </span>
                              )}
                          </div>
                        </div>
                        <div class="row fieldset" id={`Email_Div_${index}`}>
                          <div class="col-md-3 col-sm-12 text-start text-md-end">
                            <label class="fieldset-label required">
                              Email
                              <span className="text-danger">*</span>
                            </label>
                          </div>
                          <div class="col-lg-9 col-md-8 col-sm-12">
                            <input
                              type="text"
                              class="input-text"
                              placeholder="Email"
                              value={props.officersForm[index]?.emailID?.replace(
                                /\s/g,
                                ""
                              )}
                              maxLength={50}
                              onChange={(e) => {
                                // Get the entered value
                                const enteredValue = e.target.value
                                  .trim()
                                  .toLowerCase();

                                // Remove whitespace from the entered value
                                const trimmedValue = enteredValue.replace(
                                  /\s/g,
                                  ""
                                );

                                // Check for consecutive dots
                                if (trimmedValue.includes("..")) {
                                  // If consecutive dots found, remove the last dot
                                  const correctedValue = trimmedValue.replace(
                                    /\.+/g,
                                    "."
                                  );
                                  // Update the email address in the parent component
                                  props.OnOfficerChange(
                                    index,
                                    "emailID",
                                    correctedValue
                                  );
                                  return;
                                }

                                // Update the email address in the parent component
                                props.OnOfficerChange(
                                  index,
                                  "emailID",
                                  trimmedValue
                                );
                              }}
                            />
                            {props.officerError &&
                              (props.officersForm[index].emailID === null ||
                                props.officersForm[index].emailID === "" ? (
                                <span className="validation">
                                  {ERROR_MESSAGES}
                                </span>
                              ) : (
                                !isValidEmail(
                                  props.officersForm[index].emailID
                                ) && (
                                  <span className="validation">
                                    Invalid email pattern
                                  </span>
                                )
                              ))}
                          </div>
                        </div>
                        <div className="row fieldset" id={`Web_Div_${index}`}>
                          <div class="col-md-3 col-sm-12 text-start text-md-end">
                            <label class="fieldset-label required">Website</label>
                          </div>
                          <div className="col-lg-9 col-md-8 col-sm-12">
                            <input
                              type="text"
                              className="input-text"
                              placeholder="www.example.com"
                              value={props.basicInfo?.website?.replace(/\s/g, "")}
                              onChange={(e) =>
                                props.setBasicInfo({
                                  ...props.basicInfo,
                                  website: e.target.value,
                                })
                              }
                              maxLength={70}
                            />
                            {props.requireErrorMessage &&
                              props.basicInfo.website !== null &&
                              props.basicInfo.website !== "" &&
                              props.basicInfo.website !== undefined &&
                              !isValidWebUrl(props.basicInfo.website) && (
                                <span className="validation"> Invalid Url </span>
                              )}
                          </div>
                        </div>
                        <div class="row fieldset" id={`Address_Div_${index}`}>
                          <div class="col-md-3 col-sm-12 text-start text-md-end">
                            <label class="fieldset-label required">
                              Residential Address
                              <span style={{ color: "#ec4561" }}>*</span>
                            </label>
                          </div>
                          <div class="col-lg-9 col-md-8 col-sm-12">
                            <input
                              className="input-text"
                              style={{ cursor: "pointer" }}
                              type="text"
                              placeholder="Residential Address"
                              value={
                                props.concatenatedResidentialAddress[0]
                                  ?.officersFullAddress
                              }
                              onMouseDown={(e) => {
                                e.preventDefault();
                                props.setAddressPopUpTitle("Residential Address");
                                handleOpenRegisterOfficeAddressPopup(e, index);
                              }}
                              autoComplete="off"
                            />
                            {props.officerError &&
                              (props.concatenatedResidentialAddress[0]
                                .officersFullAddress === null ||
                                props.concatenatedResidentialAddress[index]
                                  .officersFullAddress === "") ? (
                              <span className="validation">{ERROR_MESSAGES}</span>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </>
                    );
                  })}
                </>
              )}
            {/* ...........Sole Trader Detail And Partnership Detail Row........... */}
            {(props.basicInfo.originalBusinessTypeID ===
              CLIENT_TYPES.Sole_Trader ||
              props.basicInfo.originalBusinessTypeID === CLIENT_TYPES.Other ||
              props.basicInfo.originalBusinessTypeID ===
              CLIENT_TYPES.Partnership) && (
                <div>
                  <div className="row fieldset" id="TradingNameDiv">
                    <div class="col-md-3 col-sm-12 text-start text-md-end">
                      <label class="fieldset-label required">
                        {" "}
                        {props.basicInfo.originalBusinessTypeID ===
                          CLIENT_TYPES.Other
                          ? `${props.basicInfo.businessTypeName} Name`
                          : `Trading Name`}
                      </label>
                      <span class="text-danger">*</span>
                    </div>
                    <div className="col-lg-9 col-md-8 col-sm-12">
                      <div className="">
                        <div className="input-group">
                          <input
                            maxLength={50}
                            type="text"
                            className="input-text"
                            placeholder="Trading Name"
                            value={props.basicInfo.tradingName}
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              const trimmedValue = inputValue.replace(
                                /^\s+/g,
                                ""
                              );

                              // Validation: Check if the trimmed value is either alphanumeric or only alphabet but not only numeric
                              const isValidName =
                                /^[a-zA-Z0-9\s,.!?"':;()-_`]+(?:[a-zA-Z0-9\s,.!?"':;()-_`]+)*$/.test(
                                  trimmedValue
                                ) && !/^\d+$/.test(trimmedValue);

                              if (isValidName || trimmedValue === "") {
                                const capitalizedValue =
                                  trimmedValue.charAt(0).toUpperCase() +
                                  trimmedValue.slice(1);
                                props.setBasicInfo({
                                  ...props.basicInfo,
                                  tradingName: capitalizedValue,
                                });
                              }
                            }}
                          />
                        </div>
                        {props.requireErrorMessage &&
                          (props.basicInfo.tradingName === "" ||
                            props.basicInfo.tradingName === null) ? (
                          <span className="validation">{ERROR_MESSAGES}</span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row fieldset" id="TradingAddressDiv">
                    <div class="col-md-3 col-sm-12 text-start text-md-end">
                      <label class="fieldset-label required">
                        {props.basicInfo.originalBusinessTypeID ===
                          CLIENT_TYPES.Other
                          ? `${props.basicInfo.businessTypeName} Address`
                          : `Trading Address`}
                      </label>
                      <span class="text-danger">*</span>
                    </div>
                    <div className="col-lg-9 col-md-8 col-sm-12">
                      <div className="mb-2">
                        <div className="input-group">
                          <input
                            type="text"
                            style={{ cursor: "pointer" }}
                            class="input-text"
                            id="category-description"
                            placeholder="Trading Address"
                            value={props.concatenatedTradingAddress}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              props.setAddressPopUpTitle("Trading Address");
                              handleOpenTradingAddressPopup(e);
                            }}
                            autoComplete="off"
                          />
                        </div>
                        {props.requireErrorMessage &&
                          (props.basicInfo.tradingAddress === "" ||
                            props.basicInfo.tradingAddress === null ||
                            props.concatenatedTradingAddress === null ||
                            props.concatenatedTradingAddress === "") ? (
                          <span className="validation">{ERROR_MESSAGES}</span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div class="col-md-3 col-sm-12 text-start text-md-end">
                      <label class="fieldset-label required">
                        Nature Of Business
                      </label>
                      {/* <span class="text-danger">*</span> */}
                    </div>
                    <div class="col-lg-9 col-md-8 mb-2 col-sm-12">
                      <div className="mb businessType input-group">
                        <Select
                          // isMulti
                          className="user-role-select"
                          style={{ padding: "5px", width: "20%" }}
                          options={props.NatureOfBusinessTypeLookupList}
                          value={props.NOBTypeValue}
                          onChange={(e) => {
                            props.OnNOBChange(e);
                          }}
                        />
                        {/* {props.requireErrorMessage &&
                          (props.basicInfo.businessTypeID === "" ||
                            props.basicInfo.businessTypeID === null) ? (
                          <span className="validation">{ERROR_MESSAGES}</span>
                        ) : (
                          ""
                        )} */}
                      </div>
                    </div>

                    <div class="col-md-3 col-sm-12 text-start text-md-end">
                      <label class="fieldset-label required">Website</label>
                    </div>
                    <div className="col-lg-9 col-md-8 col-sm-12">
                      <input
                        maxLength={70}
                        type="text"
                        className="input-text"
                        placeholder="www.example.com"
                        value={props.basicInfo?.website?.replace(/\s/g, "")}
                        onChange={(e) =>
                          props.setBasicInfo({
                            ...props.basicInfo,
                            website: e.target.value,
                          })
                        }
                      />
                      {props.requireErrorMessage &&
                        props.basicInfo.website !== null &&
                        props.basicInfo.website !== "" &&
                        props.basicInfo.website !== undefined &&
                        !isValidWebUrl(props.basicInfo.website) && (
                          <span className="validation"> Invalid Url </span>
                        )}
                    </div>
                    <div className="mb-2"></div>
                    <div class="col-md-3 col-sm-12 text-start text-md-end">
                      <label class="fieldset-label required">
                        VAT Registered
                      </label>
                    </div>
                    <div className="col-lg-9 col-md-8 col-sm-12">
                      <div className="input-group">
                        <Select
                          className="CurrencySelect"
                          options={Utils.VAT_Registered}
                          value={VATRegFilter}
                          onChange={(e) =>
                            props.setBasicInfo({
                              ...props.basicInfo,
                              VATReg: e.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="mb-2"></div>
                    {props.basicInfo.VATReg === 0 && (
                      <>
                        <div class="col-md-3 col-sm-12 text-start text-md-end">
                          <label class="fieldset-label required">
                            VAT Number
                          </label>
                        </div>
                        <div className="col-lg-9 col-md-8 col-sm-12">
                          <div className="input-group">
                            <input
                              type="text"
                              className="input-text"
                              placeholder="VAT Number"
                              value={props.basicInfo?.VATNumber?.replace(
                                /\s/g,
                                ""
                              )}
                              onChange={(e) => {
                                // Remove non-numeric characters and limit to 12 numbers
                                const sanitizedInput = e.target.value.slice(
                                  0,
                                  12
                                );
                                // Update state with sanitized input
                                props.setBasicInfo({
                                  ...props.basicInfo,
                                  VATNumber: sanitizedInput.toUpperCase(),
                                });
                              }}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            {/* ...........Company Detail And Llp Detail Row........... */}
            {(props.basicInfo.originalBusinessTypeID === CLIENT_TYPES.Company ||
              props.basicInfo.originalBusinessTypeID === CLIENT_TYPES.LLP) && (
                <div>
                  <div className="row fieldset" id="CompSearchDiv">
                    <div class="col-md-3 col-sm-12 text-start text-md-end">
                      <label class="fieldset-label required">
                        Search Company
                      </label>
                      {/* <span class="text-danger">*</span> */}
                    </div>
                    <div className="col-lg-9 col-md-8 col-sm-12">
                      <div className="">
                        <div className="input-group">
                          <input
                            type="text"
                            class="input-text"
                            id="category-description"
                            placeholder="Search Company"
                            value={props.SearchCompany}
                            onChange={(e) => props.handleCompanyInputChange(e)}
                            onKeyDown={(e) => {
                              if (e.key === " " && e.target.value.trim() === "") {
                                e.preventDefault();
                              }
                            }}
                          />
                        </div>
                        {props.companies.length > 0 && (
                          <div className="autocomplete-input-div show">
                            <ul className="searchList">
                              {props.companies.map((i, index) => (
                                <li
                                  key={index}
                                  onClick={() => props.handleCompanySelect(i)}
                                >
                                  {i.title}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row fieldset" id="CompanyName">
                    <div class="col-md-3 col-sm-12 text-start text-md-end">
                      <label class="fieldset-label required">Company Name</label>
                      <span class="text-danger">*</span>
                    </div>
                    <div className="col-lg-9 col-md-8 col-sm-12">
                      <input
                        disabled
                        class="input-text"
                        id="category-description"
                        placeholder="Company Name"
                        value={props.companyForm.companyName}
                        onChange={(e) =>
                          props.setCompanyForm({
                            ...props.companyForm,
                            companyName: e.target.value,
                          })
                        }
                      />
                      {props.requireErrorMessage &&
                        (props.companyForm.companyName === "" ||
                          props.companyForm.companyName === null) ? (
                        <span className="validation">{ERROR_MESSAGES}</span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="row fieldset">
                    <div class="col-md-3 col-sm-12 text-start text-md-end">
                      <label class="fieldset-label required">Entity Type</label>
                      <span class="text-danger">*</span>
                    </div>
                    <div className="col-lg-9 col-md-8 col-sm-12">
                      <input
                        disabled
                        class="input-text"
                        id="category-description"
                        placeholder="Entity Type"
                        value={props.companyForm.companyType}
                        onChange={(e) =>
                          props.setCompanyForm({
                            ...props.companyForm,
                            companyType: e.target.value,
                          })
                        }
                      />
                      {props.requireErrorMessage &&
                        (props.companyForm.companyType === "" ||
                          props.companyForm.companyType === null) ? (
                        <span className="validation">{ERROR_MESSAGES}</span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="row fieldset" id="CompanyNumber">
                    <div class="col-md-3 col-sm-12 text-start text-md-end">
                      <label class="fieldset-label required">
                        Company Number
                      </label>
                      <span class="text-danger">*</span>
                    </div>
                    <div className="col-lg-9 col-md-8 col-sm-12">
                      <input
                        disabled
                        class="input-text"
                        id="category-description"
                        placeholder="Company Number"
                        value={props.companyForm.companyNumber}
                        onChange={(e) =>
                          props.setCompanyForm({
                            ...props.companyForm,
                            companyNumber: e.target.value,
                          })
                        }
                      />
                      {props.requireErrorMessage &&
                        (props.companyForm.companyNumber === "" ||
                          props.companyForm.companyNumber === null) ? (
                        <span className="validation">{ERROR_MESSAGES}</span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="row fieldset">
                    <div class="col-md-3 col-sm-12 text-start text-md-end">
                      <label class="fieldset-label required">
                        Registered Office Address
                      </label>
                    </div>
                    <div className="col-lg-9 col-md-8 col-sm-12">
                      <div className="">
                        <div className="input-group">
                          <input
                            disabled
                            class="input-text"
                            id="category-description"
                            placeholder="Registered Office Address"
                            value={props.concatenatedRegisterAddress}
                            onChange={(e) =>
                              props.setCompanyForm({
                                ...props.companyForm,
                                companyAddress: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row fieldset">
                    <div class="col-md-3 col-sm-12 text-start text-md-end">
                      <label class="fieldset-label required">
                        Incorporation Date
                      </label>
                      <span class="text-danger">*</span>
                    </div>
                    <div className="col-lg-9 col-md-8 col-sm-12">
                      <div className="">
                        <div className="input-group">
                          <input
                            disabled
                            class="input-text"
                            id="category-description"
                            placeholder="Incorporation Date"
                            value={
                              props.companyForm.incorporationDate
                                ? formatDate(props.companyForm.incorporationDate)
                                : ""
                            }
                            onChange={(e) =>
                              props.setCompanyForm({
                                ...props.companyForm,
                                incorporationDate: e.target.value,
                              })
                            }
                          />
                        </div>
                        {props.requireErrorMessage &&
                          (props.companyForm.incorporationDate === "" ||
                            props.companyForm.incorporationDate === null) ? (
                          <span className="validation">{ERROR_MESSAGES}</span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row fieldset" id="InCorporateIDDiv">
                    <div class="col-md-3 col-sm-12 text-start text-md-end">
                      <label class="fieldset-label required">
                        Incorporated In
                      </label>
                      <span class="text-danger">*</span>
                    </div>
                    <div className="col-lg-9 col-md-8 col-sm-12">
                      <div className="">
                        <div className="input-group">
                          <Select
                            className="CurrencySelect"
                            options={props.incorporatedInList}
                            value={IncorporatedValue}
                            onChange={props.handleIncorporatedInChange}
                          />
                        </div>
                        {props.requireErrorMessage &&
                          (props.companyForm.incInID === "" ||
                            props.companyForm.incInID === null) ? (
                          <span className="validation">{ERROR_MESSAGES}</span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row fieldset" id="NOBTypeDiv">
                    <div class="col-md-3 col-sm-12 text-start text-md-end">
                      <label class="fieldset-label required">
                        Nature Of Business
                      </label>
                      {/* <span class="text-danger">*</span> */}
                    </div>
                    <div class="col-lg-9 col-md-8 col-sm-12">
                      <div className="input-group">
                        <Select
                          //onClick={prospectBasicInfoScrollToTop}
                          // menuIsOpen={menuIsOpen}
                          // onMenuOpen={handleMenuOpen}
                          // isMulti
                          className="user-role-select"
                          style={{ padding: "5px", width: "20%" }}
                          options={props.NatureOfBusinessTypeLookupList}
                          value={props.NOBTypeValue}
                          onChange={(e) => {
                            props.OnNOBChange(e);
                          }}
                        />
                        {/* {props.requireErrorMessage &&
                          (props.basicInfo.businessTypeID === "" ||
                            props.basicInfo.businessTypeID === null) ? (
                          <span className="validation">{ERROR_MESSAGES}</span>
                        ) : (
                          ""
                        )} */}
                      </div>
                    </div>
                  </div>
                  <div className="row fieldset" id="Web_Div">
                    <div class="col-md-3 col-sm-12 text-start text-md-end">
                      <label class="fieldset-label required">Website</label>
                    </div>
                    <div className="col-lg-9 col-md-8 col-sm-12">
                      <div className="input-group">
                        <input
                          type="text"
                          maxLength={70}
                          className="input-text"
                          placeholder="www.example.com"
                          value={props.basicInfo?.website?.replace(/\s/g, "")}
                          onChange={(e) =>
                            props.setBasicInfo({
                              ...props.basicInfo,
                              website: e.target.value,
                            })
                          }
                        />
                        {props.requireErrorMessage &&
                          props.basicInfo.website !== null &&
                          props.basicInfo.website !== "" &&
                          props.basicInfo.website !== undefined &&
                          !isValidWebUrl(props.basicInfo.website) && (
                            <span className="validation"> Invalid Url </span>
                          )}
                      </div>
                    </div>
                  </div>
                  <div className="row fieldset" id="VATRegDiv">
                    <div class="col-md-3 col-sm-12 text-start text-md-end">
                      <label class="fieldset-label required">
                        VAT Registered
                      </label>
                    </div>
                    <div className="col-lg-9 col-md-8 col-sm-12">
                      <div className="input-group">
                        <Select
                          className="CurrencySelect"
                          options={Utils.VAT_Registered}
                          value={VATRegFilter}
                          onChange={(e) =>
                            props.setBasicInfo({
                              ...props.basicInfo,
                              VATReg: e.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row fieldset" id="InCorporateIDDiv">
                    {props.basicInfo.VATReg === 0 && (
                      <>
                        <div class="col-md-3 col-sm-12 text-start text-md-end">
                          <label class="fieldset-label required">
                            VAT Number
                          </label>
                        </div>
                        <div className="col-lg-9 col-md-8 col-sm-12">
                          <div className="input-group">
                            <input
                              type="text"
                              className="input-text"
                              placeholder="VAT Number"
                              value={props.basicInfo.VATNumber?.replace(
                                /\s/g,
                                ""
                              )}
                              onChange={(e) => {
                                // Remove non-numeric characters and limit to 12 numbers
                                const sanitizedInput = e.target.value.slice(
                                  0,
                                  12
                                );
                                // Update state with sanitized input
                                props.setBasicInfo({
                                  ...props.basicInfo,
                                  VATNumber: sanitizedInput.toUpperCase(),
                                });
                              }}
                            />
                          </div>
                        </div>
                      </>
                    )}
                    {/* .............Trading Detail------------- */}
                  </div>
                  {/* <div className="row fieldset" id="InCorporateIDDiv"> */}
                  <div className="fieldset-group">
                    <label htmlFor="" className="fieldset-group-label required">
                      Trading Details
                    </label>
                    <div className="row fieldset" id="LTDTradingName">
                      <div class="col-md-3 col-sm-12 text-start text-md-end">
                        <label class="fieldset-label required">
                          Trading Name
                        </label>
                        <span class="text-danger">*</span>
                      </div>
                      <div className="col-lg-9 col-md-8 col-sm-12">
                        <div className="">
                          <div className="input-group">
                            <input
                              type="text"
                              maxLength={50}
                              className="input-text"
                              placeholder="Trading Name"
                              value={props.basicInfo.tradingName}
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                const trimmedValue = inputValue.replace(
                                  /^\s+/g,
                                  ""
                                );

                                // Validation: Check if the trimmed value is either alphanumeric or only alphabet but not only numeric
                                const isValidName =
                                  /^[a-zA-Z0-9\s,.!?"':;()-_`]+(?:[a-zA-Z0-9\s,.!?"':;()-_`]+)*$/.test(
                                    trimmedValue
                                  ) && !/^\d+$/.test(trimmedValue);

                                if (isValidName || trimmedValue === "") {
                                  const capitalizedValue =
                                    trimmedValue.charAt(0).toUpperCase() +
                                    trimmedValue.slice(1);
                                  props.setBasicInfo({
                                    ...props.basicInfo,
                                    tradingName: capitalizedValue,
                                  });
                                }
                              }}
                            />
                          </div>
                          {props.requireErrorMessage &&
                            (props.basicInfo.tradingName === "" ||
                              props.basicInfo.tradingName === null) ? (
                            <span className="validation">{ERROR_MESSAGES}</span>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row fieldset" id="LTDTradingAddressName">
                      <div class="col-md-3 col-sm-12 text-start text-md-end">
                        <label class="fieldset-label required">
                          Trading Address
                        </label>
                        <span class="text-danger">*</span>
                      </div>
                      <div className="col-lg-9 col-md-8 col-sm-12">
                        <div className="">
                          <div className="input-group">
                            <input
                              type="text"
                              style={{ cursor: "pointer" }}
                              class="input-text"
                              id="category-description"
                              placeholder="Trading Address"
                              value={props.concatenatedTradingAddress}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                props.setAddressPopUpTitle("Trading Address");
                                handleOpenTradingAddressPopup(e);
                              }}
                            />
                          </div>
                          {props.requireErrorMessage &&
                            (props.basicInfo.tradingAddress === "" ||
                              props.basicInfo.tradingAddress === null ||
                              props.concatenatedTradingAddress === null ||
                              props.concatenatedTradingAddress === "") ? (
                            <span className="validation">{ERROR_MESSAGES}</span>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                // </div>
              )}
          </div>
          <AddressModal
            // handleOk={handleOk}
            setAddressUpdatedDatetime={props.setAddressUpdatedDatetime}
            fullAddress={props.fullAddress}
            setFullAddress={props.setFullAddress}
            title={props.addressPopUpTitle}
            openAddressPopUp={openAddressPopUp}
            address={props.address}
            setAddress={props.setAddress}
            handleAddressPopUpClose={handleAddressPopUpClose}
            setOpenAddressPopUp={setOpenAddressPopUp}
          />
          {/* Declare Modal here */}
          {/* Upload signature modal */}
          <Upload_image_modal
            class="modal fade"
            id="SignatureUploadModel"
            tabIndex="-1"
            aria_hidden="true"
            handleImageUpload={handleImageUpload}
            setBasicInfo={props.setBasicInfo}
            basicInfo={props.basicInfo}
          />
        </div>
        <span
          style={{ display: "flex", justifyContent: "center" }}
          className="validation"
        >
          {props.errorMessage}
        </span>
      </div>
      <div class="separator"></div>
      <div class="row fieldset">
        <div class="col-lg-12 hstack gap-2 justify-content-end text-right mt-3">
          <button class="btn btn-md  btn-light" onClick={props.handleCancel}>
            <span>{props.getCrudButtonTextName("Cancel")}</span>
          </button>
          {props.basicInfo.originalBusinessTypeID ===
            CLIENT_TYPES.Individual && (
              <button
                class="btn btn-md btn-primary create-item-btn"
                onClick={() => props.handleTabChange(2)}
              >
                <span>
                  {props.modelAction === "Add"
                    ? props.getCrudButtonTextName("Add", prospectName)
                    : props.getCrudButtonTextName("Update", prospectName)}
                </span>
              </button>
            )}
          {props.basicInfo.originalBusinessTypeID !==
            CLIENT_TYPES.Individual && (
              <button
                class="btn btn-md btn-primary create-item-btn"
                onClick={() => props.handleTabChange(2)}
              >
                <span>Next</span>
              </button>
            )}
        </div>
      </div>
    </>
  );
};

const OfficerDetails = (props) => {
  const [index, setIndex] = useState(0);
  const { prospectName, proposalName, scrollUptoCurrentPosition } =
    useContext(AuthContextProvider);
  const [openAddressPopUp, setOpenAddressPopUp] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const OfficerDetailsDivContainerRef = useRef(null);
  const handleAddressPopUpClose = () => {
    setOpenAddressPopUp(false);
  };

  const handleSwitchToggle = (e, index) => {
    const currentOfficer = props.officersForm[index];
    if (!currentOfficer) {
      // Handle the case where officersForm[index] is undefined or null
      console.error("Invalid officer at index:", index);
      return;
    }
    const newChecked = !currentOfficer.isAuthorisedSignatory;
    setIsChecked(newChecked);
    props.OnOfficerChange(index, "isAuthorisedSignatory", newChecked);

    // Assuming setAuthoritySignatorySignatory is a state-setting function
    props.setAuthoritySignatorySignatory(false);
  };

  const handleOpenRegisterOfficeAddressPopup = (e, AddressIndex) => {
    props.setSelectedOfficerAddressIndex(AddressIndex);
    let officerAddress = {
      premises: props.officersForm[AddressIndex].officersAddress?.premises
        ? props.officersForm[AddressIndex].officersAddress?.premises
        : "",
      addressLine1: props.officersForm[AddressIndex].officersAddress
        ?.addressLine1
        ? props.officersForm[AddressIndex].officersAddress?.addressLine1
        : "",
      addressLine2: props.officersForm[AddressIndex].officersAddress
        ?.addressLine2
        ? props.officersForm[AddressIndex].officersAddress?.addressLine2
        : "",
      locality: props.officersForm[AddressIndex].officersAddress?.locality
        ? props.officersForm[AddressIndex].officersAddress?.locality
        : "",
      region: props.officersForm[AddressIndex].officersAddress?.region
        ? props.officersForm[AddressIndex].officersAddress?.region
        : "",
      country: props.officersForm[AddressIndex].officersAddress?.countryName
        ? props.officersForm[AddressIndex].officersAddress?.countryName
        : "",
      countryId: props.officersForm[AddressIndex].officersAddress?.countryId
        ? props.officersForm[AddressIndex].officersAddress?.countryId
        : null,
      postcode: props.officersForm[AddressIndex].officersAddress?.postcode
        ? props.officersForm[AddressIndex].officersAddress?.postcode
        : "",
    };

    props.setAddress(officerAddress);

    setOpenAddressPopUp(true);
  };

  const isValidEmail = (email) => {
    // Regular expression for a basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    // Allow only digits and ensure the length is between 10 and 15
    const phoneNumberRegex = /^\d{10,15}$/;
    return phoneNumberRegex.test(phoneNumber);
  };

  function isValidDate(dateString) {
    // Attempt to create a Date object from the provided date string
    const dateObject = new Date(dateString);

    // Check if the date object is valid and the parsed year is within a reasonable range
    return (
      !isNaN(dateObject.getTime()) &&
      dateObject.getFullYear() >= 1970 &&
      dateObject.getFullYear() <= new Date().getFullYear()
    );
  }
  const today = new Date();
  const minDate = new Date(1970, 0, 1);
  // Set the maximum date to today
  const maxDate = today;

  return (
    <>
      <div
        ref={OfficerDetailsDivContainerRef}
        onClick={(e) =>
          scrollUptoCurrentPosition(e, OfficerDetailsDivContainerRef)
        }
        className="create-practice-height scrollbar"
      >
        <div className="tab-content">
          <div className="row">
            <div className="col-xl-12 col-lg-12">
              {/* Sole Trader Form */}
              {(props.originalBusinessTypeID === CLIENT_TYPES.Sole_Trader ||
                props.originalBusinessTypeID === CLIENT_TYPES.Other) &&
                props.officersForm?.map((item, index) => {
                  return (
                    <>
                      <div
                        className="row fieldset mt-4"
                        id={`FirstName_Div_${index}`}
                        key={index}
                      >
                        <div className="col-md-3 col-sm-12 text-start text-md-end">
                          <label class="fieldset-label required">
                            First Name
                            <span style={{ color: "#ec4561" }}>*</span>
                          </label>
                        </div>
                        <div class="col-lg-9 col-md-8 col-sm-12">
                          <input
                            type="text"
                            class="input-text"
                            placeholder="First Name"
                            value={props.officersForm[index].firstName}
                            onChange={(e) => {
                              const inputValue = e.target.value.trim();
                              // Reject input if it contains numeric characters
                              // Remove all spaces and dots
                              const cleanedValue = inputValue.replace(
                                /[.\s]/g,
                                ""
                              );
                              // Reject input if it starts with a digit
                              if (/^\d/.test(cleanedValue)) {
                                return;
                              }
                              const capitalizedValue =
                                cleanedValue.charAt(0).toUpperCase() +
                                cleanedValue.slice(1);
                              props.OnOfficerChange(
                                index,
                                "firstName",
                                capitalizedValue
                              );
                            }}
                            maxLength={20}
                          />
                          {props.officerError &&
                            (props.officersForm[index].firstName === null ||
                              props.officersForm[index].firstName === "") ? (
                            <span className="validation">{ERROR_MESSAGES}</span>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      <div
                        className="row fieldset"
                        id={`LastName_Div_${index}`}
                      >
                        <div className="col-md-3 col-sm-12 text-start text-md-end">
                          <label class="fieldset-label required">
                            Last Name
                            <span style={{ color: "#ec4561" }}>*</span>
                          </label>
                        </div>
                        <div class="col-lg-9 col-md-8 col-sm-12">
                          <input
                            type="text"
                            class="input-text"
                            placeholder="Last Name"
                            value={props.officersForm[index].lastName}
                            onChange={(e) => {
                              const inputValue = e.target.value;

                              // Remove all spaces and dots
                              const cleanedValue = inputValue.replace(
                                /[.\s]/g,
                                ""
                              );

                              // Reject input if it starts with a digit
                              if (/\d/.test(cleanedValue)) {
                                return;
                              }

                              const capitalizedValue =
                                cleanedValue.charAt(0).toUpperCase() +
                                cleanedValue.slice(1);
                              props.OnOfficerChange(
                                index,
                                "lastName",
                                capitalizedValue
                              );
                            }}
                            maxLength={20}
                          />
                          {props.officerError &&
                            (props.officersForm[index].lastName === null ||
                              props.officersForm[index].lastName === "") ? (
                            <span className="validation">{ERROR_MESSAGES}</span>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      <div class="row fieldset" id={`Phone_Div_${index}`}>
                        <div class="col-md-3 col-sm-12 text-start text-md-end">
                          <label class="fieldset-label required">Phone</label>
                        </div>
                        <div class="col-lg-9 col-md-9 col-sm-10 ">
                          <div className="phone-input-div">
                            <Select
                              style={{ padding: "5px", width: "20%" }}
                              className="createCompanyInfo"
                              options={props.countryCodes}
                              value={
                                props.officersForm[index]?.phoneCountryCodeID
                              }
                              onChange={(e) => {
                                setIndex(index);
                                props.OnOfficerChange(
                                  index,
                                  "phoneCountryCodeID",
                                  e
                                );
                                props.OnOfficerChange(
                                  index,
                                  "countryCodeID",
                                  e.value
                                );
                              }}
                            />
                            <div className="phone-input-number-div">
                              <input
                                style={{ width: "100%" }}
                                className="input-text"
                                placeholder="Phone"
                                type="text"
                                value={props.officersForm[index].phoneNo}
                                onChange={(e) => {
                                  // Ensure that the input only contains numeric characters
                                  const sanitizedInput = e.target.value
                                    .replace(/[^0-9]/g, "")
                                    .slice(0, 15);
                                  props.OnOfficerChange(
                                    index,
                                    "phoneNo",
                                    sanitizedInput
                                  );
                                }}
                              />
                            </div>
                          </div>
                          {props.officerError &&
                            props.officersForm[index].phoneNo !== null &&
                            props.officersForm[index].phoneNo !== "" &&
                            props.officersForm[index].phoneNo !== undefined &&
                            !isValidPhoneNumber(
                              props.officersForm[index].phoneNo
                            ) && (
                              <span className="validation">
                                {" "}
                                Invalid phone number{" "}
                              </span>
                            )}
                        </div>
                      </div>
                      <div class="row fieldset" id={`Email_Div_${index}`}>
                        <div class="col-md-3 col-sm-12 text-start text-md-end">
                          <label class="fieldset-label required">
                            Email
                            <span className="text-danger">*</span>
                          </label>
                        </div>
                        <div class="col-lg-9 col-md-8 col-sm-12">
                          <input
                            type="text"
                            class="input-text"
                            maxLength={50}
                            placeholder="Email"
                            value={props.officersForm[index]?.emailID?.replace(
                              /\s/g,
                              ""
                            )}
                            onChange={(e) =>
                              props.OnOfficerChange(
                                index,
                                "emailID",
                                e.target.value
                              )
                            }
                          />
                          {props.officerError &&
                            (props.officersForm[index].emailID === null ||
                              props.officersForm[index].emailID === "" ? (
                              <span className="validation">
                                {ERROR_MESSAGES}
                              </span>
                            ) : (
                              !isValidEmail(
                                props.officersForm[index].emailID
                              ) && (
                                <span className="validation">
                                  Invalid email pattern
                                </span>
                              )
                            ))}
                        </div>
                      </div>
                      <div class="row fieldset" id={`Address_Div_${index}`}>
                        <div class="col-md-3 col-sm-12 text-start text-md-end">
                          <label class="fieldset-label required">
                            Residential Address
                            <span style={{ color: "#ec4561" }}>*</span>
                          </label>
                        </div>
                        <div class="col-lg-9 col-md-8 col-sm-12">
                          <input
                            className="input-text"
                            style={{ cursor: "pointer" }}
                            type="text"
                            placeholder="Residential Address"
                            value={
                              props.concatenatedResidentialAddress[0]
                                ?.officersFullAddress
                            }
                            onMouseDown={(e) => {
                              e.preventDefault();
                              props.setAddressPopUpTitle("Residential Address");
                              handleOpenRegisterOfficeAddressPopup(e, index);
                            }}
                            autoComplete="off"
                          />
                          {props.officerError &&
                            (props.concatenatedResidentialAddress[0]
                              .officersFullAddress === null ||
                              props.concatenatedResidentialAddress[index]
                                .officersFullAddress === "") ? (
                            <span className="validation">{ERROR_MESSAGES}</span>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </>
                  );
                })}
              {/* lpp form */}
              {props.originalBusinessTypeID === CLIENT_TYPES.Partnership && (
                <div>
                  {props.officersForm?.map((i, index) => {
                    return (
                      <div className="fieldset-group" id={`Partner_${index}`}>
                        <label class="fieldset-group-label">
                          {" "}
                          Partner {index + 1}{" "}
                        </label>
                        <label
                          htmlFor=""
                          className="fieldset-group-label-1 required"
                        >
                          {props.officersForm?.length === 1 ? null : (
                            <button
                              className="btn btn-sm btn-danger gap-1  delete-fieldset-group"
                              onClick={() => props.deleteOfficer(index)}
                            >
                              <i class="bi bi-trash3 "></i>
                              Delete Partner
                            </button>
                          )}
                        </label>
                        <div
                          className="align-right text-right mb-2"
                          style={{ alignItems: "center" }}
                        >
                          <Switch
                            checked={
                              props.officersForm[index]?.isAuthorisedSignatory
                            }
                            onChange={(e) => handleSwitchToggle(e, index)}
                            color="primary"
                          />

                          <div className="isAuthorized">
                            Authorized Signatory
                          </div>
                        </div>
                        {/* {props.officersForm.length === 0 && (
                          <div className="row fieldset flex-center-div"  id="PartnerError">
                            <div className="col-lg-12 text-end">
                              <span className="validation">
                                {" "}
                                At least 1 authorized partner is required.
                              </span>
                            </div>
                          </div>
                        )} */}
                        {props.authoritySignatorySignatory &&
                          props.officerError &&
                          props.AuthorityCount === 0 && (
                            <div
                              className="row fieldset flex-center-div"
                              id={`AuthorizedPartner_${index}`}
                            >
                              <div className="col-lg-12 text-end">
                                <span className="validation">
                                  {" "}
                                  At least 1 authorized partner is required.
                                </span>
                              </div>
                            </div>
                          )}
                        <div
                          className="row fieldset"
                          id={`FirstName_Div_${index}`}
                        >
                          <div className="col-md-3 col-sm-12 text-start text-md-end">
                            <label class="fieldset-label required">
                              First Name
                              <span style={{ color: "#ec4561" }}>*</span>
                            </label>
                          </div>
                          <div class="col-lg-9 col-md-8 col-sm-12">
                            <input
                              type="text"
                              class="input-text"
                              placeholder="First Name"
                              value={props.officersForm[index]?.firstName}
                              onChange={(e) => {
                                const inputValue = e.target.value.trim();
                                // Reject input if it contains numeric characters
                                // Remove all spaces and dots
                                const cleanedValue = inputValue.replace(
                                  /[.\s]/g,
                                  ""
                                );

                                // Reject input if it starts with a digit
                                if (/\d/.test(cleanedValue)) {
                                  return;
                                }
                                const capitalizedValue =
                                  cleanedValue.charAt(0).toUpperCase() +
                                  cleanedValue.slice(1);

                                props.OnOfficerChange(
                                  index,
                                  "firstName",
                                  capitalizedValue
                                );
                              }}
                              maxLength={20}
                            />
                            {props.officerError &&
                              (props.officersForm[index].firstName === null ||
                                props.officersForm[index].firstName === "") ? (
                              <span className="validation">
                                {ERROR_MESSAGES}
                              </span>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        <div
                          className="row fieldset"
                          id={`LastName_Div_${index}`}
                        >
                          <div className="col-md-3 col-sm-12 text-start text-md-end">
                            <label class="fieldset-label required">
                              Last Name
                              <span style={{ color: "#ec4561" }}>*</span>
                            </label>
                          </div>
                          <div class="col-lg-9 col-md-8 col-sm-12">
                            <input
                              type="text"
                              class="input-text"
                              placeholder="Last Name"
                              value={props.officersForm[index]?.lastName}
                              onChange={(e) => {
                                const inputValue = e.target.value;

                                // Remove all spaces and dots
                                const cleanedValue = inputValue.replace(
                                  /[.\s]/g,
                                  ""
                                );

                                // Reject input if it starts with a digit
                                if (/\d/.test(cleanedValue)) {
                                  return;
                                }

                                const capitalizedValue =
                                  cleanedValue.charAt(0).toUpperCase() +
                                  cleanedValue.slice(1);

                                props.OnOfficerChange(
                                  index,
                                  "lastName",
                                  capitalizedValue
                                );
                              }}
                              maxLength={20}
                            />
                            {props.officerError &&
                              (props.officersForm[index].lastName === null ||
                                props.officersForm[index].lastName === "") ? (
                              <span className="validation">
                                {ERROR_MESSAGES}
                              </span>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        <div className="row fieldset" id={`Phone_Div_${index}`}>
                          <div class="col-md-3 col-sm-12 text-start text-md-end">
                            <label class="fieldset-label required">Phone</label>
                          </div>
                          <div className="col-lg-9 col-md-8 col-sm-12 ">
                            <div className="phone-input-div">
                              <Select
                                style={{ padding: "5px", width: "20%" }}
                                className="createCompanyInfo"
                                options={props.countryCodes}
                                value={
                                  props.officersForm[index]?.phoneCountryCodeID
                                }
                                onChange={(e) => {
                                  setIndex(index);
                                  props.OnOfficerChange(
                                    index,
                                    "phoneCountryCodeID",
                                    e
                                  );
                                  props.OnOfficerChange(
                                    index,
                                    "countryCodeID",
                                    e.value
                                  );
                                }}
                              />
                              <div className="phone-input-number-div">
                                <input
                                  style={{ width: "100%" }}
                                  className="input-text"
                                  type="text"
                                  placeholder="Phone"
                                  value={props.officersForm[index].phoneNo}
                                  onChange={(e) => {
                                    const sanitizedInput = e.target.value
                                      .replace(/[^0-9]/g, "")
                                      .slice(0, 15);
                                    props.OnOfficerChange(
                                      index,
                                      "phoneNo",
                                      sanitizedInput
                                    );
                                  }}
                                />
                              </div>
                            </div>
                            {props.officerError &&
                              props.officersForm[index].phoneNo !== null &&
                              props.officersForm[index].phoneNo !== "" &&
                              props.officersForm[index].phoneNo !== undefined &&
                              !isValidPhoneNumber(
                                props.officersForm[index].phoneNo
                              ) && (
                                <span className="validation">
                                  {" "}
                                  Invalid phone number{" "}
                                </span>
                              )}
                          </div>
                        </div>
                        <div className="row fieldset" id={`Email_Div_${index}`}>
                          <div class="col-md-3 col-sm-12 text-start text-md-end">
                            <label class="fieldset-label required">
                              Email
                              <span className="text-danger">*</span>
                            </label>
                          </div>
                          <div class="col-lg-9 col-md-8 col-sm-12">
                            <input
                              maxLength={50}
                              className="input-text"
                              type="text"
                              placeholder="Email"
                              value={props.officersForm[index]?.emailID}
                              onChange={(e) =>
                                props.OnOfficerChange(
                                  index,
                                  "emailID",
                                  e.target.value.trim() // Remove spaces using regex
                                )
                              }
                            />

                            {props.officerError &&
                              (props.officersForm[index].emailID === null ||
                                props.officersForm[index].emailID === "" ? (
                                <span className="validation">
                                  {ERROR_MESSAGES}
                                </span>
                              ) : (
                                !isValidEmail(
                                  props.officersForm[index].emailID
                                ) && (
                                  <span className="validation">
                                    Invalid email pattern
                                  </span>
                                )
                              ))}
                          </div>
                        </div>
                        <div class="row fieldset" id={`Address_Div_${index}`}>
                          <div class="col-md-3 col-sm-12 text-start text-md-end">
                            <label class="fieldset-label required">
                              Residential Address
                              <span className="text-danger">*</span>
                            </label>
                          </div>
                          <div class="col-lg-9 col-md-8 col-sm-12">
                            <input
                              className="input-text"
                              type="text"
                              style={{ cursor: "pointer" }}
                              placeholder="Residential Address"
                              value={
                                props.concatenatedResidentialAddress[index]
                                  ?.officersFullAddress
                              }
                              onMouseDown={(e) => {
                                e.preventDefault();
                                props.setAddressPopUpTitle(
                                  "Residential Address"
                                );
                                handleOpenRegisterOfficeAddressPopup(e, index);
                              }}
                              autoComplete="off"
                            />
                            {props.officerError &&
                              (props.concatenatedResidentialAddress[index]
                                .officersFullAddress === null ||
                                props.concatenatedResidentialAddress[index]
                                  .officersFullAddress === "") ? (
                              <span className="validation">
                                {ERROR_MESSAGES}
                              </span>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {(props.originalBusinessTypeID === CLIENT_TYPES.Company ||
                props.originalBusinessTypeID === CLIENT_TYPES.LLP) && (
                  <div>
                    {props.officersForm?.map((i, index) => {
                      return (
                        <div className="fieldset-group" id={`Officers${index}`}>
                          <label class="fieldset-group-label">
                            {" "}
                            Officer {index + 1}{" "}
                          </label>
                          <label
                            htmlFor=""
                            className="fieldset-group-label-1 required"
                          >
                            {props.officersForm?.length === 1 ? null : (
                              <button
                                className="btn btn-sm btn-danger gap-1 delete-fieldset-group"
                                onClick={() => props.deleteOfficer(index)}
                              >
                                <i class="bi bi-trash3  "></i>
                                Delete Officer
                              </button>
                            )}
                          </label>
                          <div
                            style={{ alignItems: "center" }}
                            className="align-right text-right mb-2"
                          >
                            <Switch
                              checked={
                                props.officersForm[index]?.isAuthorisedSignatory
                              }
                              onChange={(e) => handleSwitchToggle(e, index)}
                              color="primary"
                            />

                            <div className="isAuthorized">
                              Authorised Signatory
                            </div>
                          </div>
                          {/* {props.officersForm.length === 0 && (
                            <div className="row fieldset flex-center-div">
                              <div className="col-lg-12 text-end">
                                <span className="validation">
                                  {" "}
                                  At least 1 authorized officer is required.{" "}
                                </span>
                              </div>
                            </div>
                          )} */}
                          {props.authoritySignatorySignatory &&
                            props.officerError &&
                            props.AuthorityCount === 0 && (
                              <div
                                className="row fieldset flex-center-div"
                                id={`AuthorisedOfficer_${index}`}
                              >
                                <div className="col-lg-12 text-end">
                                  <span className="validation">
                                    {" "}
                                    At least 1 authorized officer is required.{" "}
                                  </span>
                                </div>
                              </div>
                            )}
                          <div className="row fieldset">
                            <div className="col-md-3 col-sm-12 text-start text-md-end">
                              <label class="fieldset-label required">
                                First Name
                                <span style={{ color: "#ec4561" }}>*</span>
                              </label>
                            </div>
                            <div class="col-lg-9 col-md-8 col-sm-12 ">
                              <input
                                type="text"
                                class="input-text"
                                placeholder="First Name"
                                value={props.officersForm[index]?.firstName}
                                onChange={(e) => {
                                  const inputValue = e.target.value.trim();
                                  // Reject input if it contains numeric characters
                                  // Remove all spaces and dots
                                  const cleanedValue = inputValue.replace(
                                    /[.\s]/g,
                                    ""
                                  );

                                  // Reject input if it starts with a digit
                                  if (/\d/.test(cleanedValue)) {
                                    return;
                                  }
                                  const capitalizedValue =
                                    cleanedValue.charAt(0).toUpperCase() +
                                    cleanedValue.slice(1);

                                  props.OnOfficerChange(
                                    index,
                                    "firstName",
                                    capitalizedValue
                                  );
                                }}
                                maxLength={20}
                              />
                              {props.officerError &&
                                (props.officersForm[index].firstName === null ||
                                  props.officersForm[index].firstName === "") ? (
                                <span className="validation">
                                  {ERROR_MESSAGES}
                                </span>
                              ) : (
                                ""
                              )}
                            </div>
                            <div className="mb-2"></div>
                            <div className="col-md-3 col-sm-12 text-start text-md-end">
                              <label class="fieldset-label required">
                                Last Name
                                <span style={{ color: "#ec4561" }}>*</span>
                              </label>
                            </div>
                            <div class="col-lg-9 col-md-8 col-sm-12 ">
                              <input
                                type="text"
                                class="input-text"
                                placeholder="Last Name"
                                value={props.officersForm[index]?.lastName}
                                onChange={(e) => {
                                  const inputValue = e.target.value;

                                  // Remove all spaces and dots
                                  const cleanedValue = inputValue.replace(
                                    /[.\s]/g,
                                    ""
                                  );

                                  // Reject input if it starts with a digit
                                  if (/\d/.test(cleanedValue)) {
                                    return;
                                  }

                                  const capitalizedValue =
                                    cleanedValue.charAt(0).toUpperCase() +
                                    cleanedValue.slice(1);

                                  props.OnOfficerChange(
                                    index,
                                    "lastName",
                                    capitalizedValue
                                  );
                                }}
                                maxLength={20}
                              />
                              {props.officerError &&
                                (props.officersForm[index].lastName === null ||
                                  props.officersForm[index].lastName === "") ? (
                                <span className="validation">
                                  {ERROR_MESSAGES}
                                </span>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                          <div className="row fieldset ">
                            <div className="col-md-3 col-sm-12 text-start text-md-end">
                              <label class="fieldset-label required">
                                Role
                                <span style={{ color: "#ec4561" }}>*</span>
                              </label>
                            </div>
                            <div class="col-lg-9 col-md-8 col-sm-12 ">
                              <input
                                maxLength={30}
                                type="text"
                                class="input-text"
                                placeholder="Role"
                                value={props.officersForm[index]?.officerRole}
                                onChange={(e) => {
                                  const { value } = e.target;
                                  if (value === "" || value.charAt(0) !== " ") {
                                    props.OnOfficerChange(
                                      index,
                                      "officerRole",
                                      value.charAt(0).toUpperCase() +
                                      value.slice(1).toLowerCase()
                                    );
                                  }
                                }}
                              />
                              {props.officerError &&
                                (props.officersForm[index].officerRole === null ||
                                  props.officersForm[index].officerRole === "") ? (
                                <span className="validation">
                                  {ERROR_MESSAGES}
                                </span>
                              ) : (
                                ""
                              )}
                            </div>
                            <div className="mb-2"></div>
                            <div className="col-md-3 col-sm-12 text-start text-md-end">
                              <label class="fieldset-label required">
                                Appointed On
                                <span style={{ color: "#ec4561" }}>*</span>
                              </label>
                            </div>
                            <div class="col-lg-9 col-md-8 col-sm-12 ">
                              <DatePicker
                                minDate={minDate}
                                maxDate={maxDate}
                                style={{ width: "100%" }}
                                format="dd/MM/y"
                                dayPlaceholder="dd"
                                monthPlaceholder="mm"
                                yearPlaceholder="yyyy"
                                value={props.officersForm[index]?.appointedOn}
                                onChange={(e) =>
                                  props.OnOfficerChange(index, "appointedOn", e)
                                }
                              />
                              {props.InvalidAppointedOnDate &&
                                !isValidDate(
                                  props.officersForm[index]?.appointedOn
                                ) ? (
                                <span className="validation">Invalid Date</span>
                              ) : null}
                              {props.officerError &&
                                (props.officersForm[index]?.appointedOn === null ||
                                  props.officersForm[index]?.appointedOn === "") ? (
                                <span className="validation">
                                  {ERROR_MESSAGES}
                                </span>
                              ) : (
                                ""
                              )}
                            </div>
                            <span className="validation">
                              {props.formErrors[index]?.appointedOn}
                            </span>
                          </div>
                          <div class="row fieldset">
                            <div class="col-md-3 col-sm-12 text-start text-md-end ">
                              <label class="fieldset-label required">Phone</label>
                            </div>
                            <div className="col-lg-9 col-md-8 col-sm-12 ">
                              <div className="phone-input-div">
                                <Select
                                  style={{ padding: "5px", width: "20%" }}
                                  class="createCompanyInfo"
                                  options={props.countryCodes}
                                  value={
                                    props.officersForm[index]?.phoneCountryCodeID
                                  }
                                  onChange={(e) => {
                                    setIndex(index);
                                    props.OnOfficerChange(
                                      index,
                                      "phoneCountryCodeID",
                                      e
                                    );
                                    props.OnOfficerChange(
                                      index,
                                      "countryCodeID",
                                      e.value
                                    );
                                  }}
                                />
                                <div className="mb-2"></div>
                                <div className="phone-input-number-div">
                                  <input
                                    style={{ width: "100%" }}
                                    className="input-text"
                                    type="text"
                                    placeholder="Phone"
                                    value={props.officersForm[index].phoneNo}
                                    onChange={(e) => {
                                      const sanitizedInput = e.target.value
                                        .replace(/[^0-9]/g, "")
                                        .slice(0, 15);
                                      props.OnOfficerChange(
                                        index,
                                        "phoneNo",
                                        sanitizedInput
                                      );
                                    }}
                                  />
                                </div>
                              </div>
                              {props.officerError &&
                                props.officersForm[index].phoneNo !== null &&
                                props.officersForm[index].phoneNo !== "" &&
                                props.officersForm[index].phoneNo !== undefined &&
                                !isValidPhoneNumber(
                                  props.officersForm[index].phoneNo
                                ) && (
                                  <span className="validation">
                                    {" "}
                                    Invalid phone number{" "}
                                  </span>
                                )}
                            </div>
                            <div className="mb-2"></div>
                            <div class="col-md-3 col-sm-12 text-start text-md-end">
                              <label class="fieldset-label required">
                                Email
                                <span className="text-danger">*</span>
                              </label>
                            </div>
                            <div class="col-lg-9 col-md-8 col-sm-12">
                              <input
                                className="input-text"
                                type="text"
                                placeholder="Email"
                                value={props.officersForm[
                                  index
                                ]?.emailID?.replace(/\s/g, "")}
                                maxLength={50}
                                onChange={(e) =>
                                  props.OnOfficerChange(
                                    index,
                                    "emailID",
                                    e.target.value
                                  )
                                }
                              />
                              {props.officerError &&
                                (props.officersForm[index].emailID === null ||
                                  props.officersForm[index].emailID === "" ? (
                                  <span className="validation">
                                    {ERROR_MESSAGES}
                                  </span>
                                ) : (
                                  !isValidEmail(
                                    props.officersForm[index].emailID
                                  ) && (
                                    <span className="validation">
                                      Invalid email pattern
                                    </span>
                                  )
                                ))}
                            </div>
                          </div>
                          <div class="row fieldset">
                            <div class="col-md-3 col-sm-12 text-start text-md-end">
                              <label class="fieldset-label required">
                                Correspondence Address
                                <span className="text-danger">*</span>
                              </label>
                            </div>
                            <div class="col-lg-9 col-md-8 col-sm-12">
                              <input
                                placeholder="Correspondence Address"
                                className="input-text"
                                style={{ cursor: "pointer" }}
                                type="text"
                                value={
                                  props.concatenatedResidentialAddress[index]
                                    ?.officersFullAddress
                                }
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  props.setAddressPopUpTitle(
                                    "Correspondence Address"
                                  );
                                  handleOpenRegisterOfficeAddressPopup(e, index);
                                }}
                                autoComplete="off"
                              />
                              {props.officerError &&
                                (props.concatenatedResidentialAddress[index]
                                  .officersFullAddress === null ||
                                  props.concatenatedResidentialAddress[index]
                                    .officersFullAddress === "") ? (
                                <span className="validation">
                                  {ERROR_MESSAGES}
                                </span>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
            </div>
            <AddressModal
              title={props.addressPopUpTitle}
              setAddressUpdatedDatetime={props.setAddressUpdatedDatetime}
              fullAddress={props.fullAddress}
              setFullAddress={props.setFullAddress}
              openAddressPopUp={openAddressPopUp}
              address={props.address}
              setAddress={props.setAddress}
              handleAddressPopUpClose={handleAddressPopUpClose}
              setOpenAddressPopUp={setOpenAddressPopUp}
            />
          </div>
        </div>
        <span
          style={{ display: "flex", justifyContent: "center" }}
          className="validation"
        >
          {props.errorMessage}
        </span>
        <span
          id="EmailError"
          style={{ display: "flex", justifyContent: "center" }}
          className="validation"
        >
          {props.emailError}
        </span>
      </div>
      <div class="separator"></div>
      <div class="row fieldset">
        <div class="col-lg-12 hstack gap-2 justify-content-end text-right mt-3">
          {props.originalBusinessTypeID === CLIENT_TYPES.Partnership && (
            <button
              className="btn btn-md btn-primary create-item-btn"
              onClick={() => {
                props.setOfficersError(false);
                props.addOfficer();
              }}
            >
              <i class="bi bi-plus-circle "></i>
              <span style={{ paddingLeft: "5px" }}>Add Partner</span>
            </button>
          )}
          {props.originalBusinessTypeID === CLIENT_TYPES.LLP && (
            <button
              className="btn btn-md btn-primary create-item-btn"
              onClick={props.addOfficer}
            >
              <i class="bi bi-plus-circle "></i>
              <span style={{ paddingLeft: "5px" }}>Add Officer</span>
            </button>
          )}
          {props.originalBusinessTypeID === CLIENT_TYPES.Company && (
            <button
              className="btn btn-md btn-primary create-item-btn"
              onClick={props.addOfficer}
            >
              <i class="bi bi-plus-circle "></i>
              <span style={{ paddingLeft: "5px" }}>Add Officer</span>
            </button>
          )}
          <button class="btn btn-md  btn-light" onClick={props.handleCancel}>
            <span>{props.getCrudButtonTextName("Cancel")}</span>
          </button>
          <button
            onClick={() => props.handleBackBtnChange(1)}
            style={{ paddingTop: "5px", marginRight: "4px" }}
            class="btn btn-md btn-primary create-item-btn"
          >
            <span>Back</span>
          </button>
          <button
            class="btn btn-md btn-primary create-item-btn"
            onClick={() => props.handleTabChange(3)}
          >
            <span>
              {props.modelAction === "Add"
                ? props.getCrudButtonTextName("Add", prospectName)
                : props.getCrudButtonTextName("Update", prospectName)}
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

const Add_Update_prospect = () => {
  // A] Declare State
  const [emailError, setEmailError] = useState("");
  const [activeTab, setActiveTab] = useState(1);
  const common = useSelector((state) => state.Storage);
  const [requireErrorMessage, setRequireErrorMessage] = useState(false);
  const [isValidForm, setIsValidForm] = useState(false);
  const [AuthorityCount, setAuthorityCount] = useState(0);
  const [companies, setCompanies] = useState([]);
  const [countryLookupList, setCountryLookupList] = useState([]);
  const [incorporatedInList, setIncorporatedInList] = useState([]);
  const [countryCodes, setcountryCodes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  // const [emailMessage, setEmailError] = useState("");
  const [dismissModal, setDismissModal] = useState(null);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [officerError, setOfficersError] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [formErrors, setFormErrors] = useState([]);
  const [officerCount, setOfficerCount] = useState(0);

  const [selectedCountry, setSelectedCountries] = useState([]);
  const [InvalidAppointedOnDate, setInvalidAppointedOnDate] = useState(false);
  const [modelAction, setModelAction] = useState("Add");
  const [signature, setSignature] = useState("");
  const [concatenatedResidentialAddress, setConcatenatedResidentialAddress] =
    useState([{ officersFullAddress: null }]);
  const [concatenatedTradingAddress, setConcatenatedTradingAddress] =
    useState("");
  const [addressPopUpTitle, setAddressPopUpTitle] = useState(null);
  const [authoritySignatorySignatory, setAuthoritySignatorySignatory] =
    useState(false);
  const [fullAddress, setFullAddress] = useState("");
  const [addressUpdatedDatetime, setAddressUpdatedDatetime] = useState(
    Date.now()
  );
  const [SearchCompany, setSearchCompany] = useState("");
  const {
    setLoader,
    prospectName,
    isMobile,
    getCrudButtonTextName,
    getCrudPopUpTitleName,
    scrollUpDownByElementID,
    hasActionAccess,
  } = useContext(AuthContextProvider);
  const [address, setAddress] = useState({
    premises: null,
    addressLine1: null,
    addressLine2: null,
    locality: null,
    region: null,
    country: null,
    countryId: null,
    postcode: null,
  });
  const [basicInfo, setBasicInfo] = useState({
    clientKeyID: null,
    addressId: null,
    businessTypeID: null,
    businessNatureID: [],
    businessTypeName: "Individual",
    tradingName: null,
    tradingAddress: null,
    VATReg: 1,
    VATNumber: null,
    website: null,
    originalBusinessTypeID: 1,
  });

  const [companyForm, setCompanyForm] = useState({
    companyID: null,
    companyName: null,
    companyType: null,
    companyNumber: null,
    companyStatus: null,
    addressID: null,
    incorporationDate: null,
    incInID: null,
    moduleName: null,
    moduleID: null,
    companyAddress: null,
  });
  const [officersForm, setOfficers] = useState([
    {
      officerID: null,
      firstName: null,
      lastName: null,
      countryCodeID: 9,
      phoneCountryCodeID: { value: 9, label: "+44" },
      phoneNo: null,
      emailID: null,
      addressID: null,
      isAuthorisedSignatory: false,
      officerRole: null,
      appointedOn: null,
      moduleName: null,
      moduleID: null,
      officersAddress: {
        addressId: null,
        premises: null,
        addressLine1: null,
        addressLine2: null,
        locality: null,
        region: null,
        countryId: null,
        postcode: null,
      },
    },
  ]);
  const [selectedOfficerAddressIndex, setSelectedOfficerAddressIndex] =
    useState(0);
  const [concatenatedRegisterAddress, setConcatenatedRegisterAddress] =
    useState("");

  const [BusinessTypeLookupList, setBusinessTypeLookupList] = useState([]);
  const [NatureOfBusinessTypeLookupList, setNatureOfBusinessTypeLookupList] =
    useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [saveLocationState, setSaveLocationState] = useState(location.state);
  // B] Initial UseEffect
  const { setTopbar } = useContext(AuthContextProvider);
  useEffect(() => {
    const Admin_Prospect_CanAdd = hasActionAccess(1, 1);
    if (
      (location?.state?.Action === undefined ||
        location?.state?.Action === null) &&
      !Admin_Prospect_CanAdd
    ) {
      navigate(-1);
    }
    setTopbar("none");
    getCountries();
    getCountryCodes();
    GetBusinessTypeLookupListData();
    GetIncorporatedInLookUpListData();
    GetNOBTypeLookUpListData();
  }, []);

  useEffect(() => {
    setModelAction(
      saveLocationState?.Action === null ||
        saveLocationState?.Action === undefined
        ? "Add"
        : "Update"
    ); //Do not change this naming convention
    if (
      saveLocationState?.Action !== undefined &&
      saveLocationState?.Action !== null
    ) {
      GetClientInformationModelData(saveLocationState.clientKeyID);
    } else {
      // SetInitialModelData();
    }
  }, [saveLocationState]);

  useEffect(() => {
    let tradingAddressObj = {
      addressId: address?.address?.addressId,
      premises: address?.address?.premises,
      addressLine1: address?.address?.addressLine1,
      addressLine2: address?.address?.addressLine2,
      locality: address?.address?.locality,
      region: address?.address?.region,
      countryId:
        address?.address?.countryId === "" ? null : address?.address?.countryId,
      postcode: address?.address?.postcode,
      countryName: address?.address?.country,
    };
    if (addressPopUpTitle === "Trading Address") {
      setBasicInfo({
        ...basicInfo,
        tradingAddress: tradingAddressObj,
      });
      setConcatenatedTradingAddress(fullAddress);
    }
    if (
      addressPopUpTitle === "Residential Address" ||
      addressPopUpTitle === `${prospectName} Address` ||
      addressPopUpTitle === "Correspondence Address"
    ) {
      setOfficers((prevOfficers) => {
        const updatedOfficers = [...prevOfficers];
        updatedOfficers[selectedOfficerAddressIndex].officersAddress =
          tradingAddressObj;
        return updatedOfficers;
      });

      let ResidentialFullAddress = [...concatenatedResidentialAddress];
      ResidentialFullAddress[selectedOfficerAddressIndex] = {
        officersFullAddress: fullAddress,
      };
      setConcatenatedResidentialAddress(ResidentialFullAddress);
    }
  }, [addressUpdatedDatetime]);

  const addOfficer = async () => {
    setOfficersError(false);
    setOfficerCount(officerCount + 1)
    concatenatedResidentialAddress.push({
      officersFullAddress: "",
    });
    await officersForm.push({
      officerID: null,
      firstName: "",
      lastName: "",
      countryCodeID: 9,
      phoneCountryCodeID: { value: 9, label: "+44" },
      phoneNo: "",
      emailID: "",
      addressID: null,
      isAuthorisedSignatory: false,
      officerRole: "",
      appointedOn: "",
      moduleName: null,
      moduleID: null,
      officersAddress: null,
    });
    if (basicInfo.originalBusinessTypeID === CLIENT_TYPES.Partnership) {
      setTimeout(function () {
        scrollUpDownByElementID(`Partner_${officersForm.length - 1}`);
      }, 200);
    }
    if (
      basicInfo.originalBusinessTypeID === CLIENT_TYPES.LLP ||
      basicInfo.originalBusinessTypeID === CLIENT_TYPES.Company
    ) {
      setTimeout(function () {
        scrollUpDownByElementID(`Officers${officersForm.length - 1}`);
      }, 200);
    }
  };
  // C] Call All lookUp List and Crud api here
  //1) BusinessType Lookup List Api
  const GetBusinessTypeLookupListData = async () => {
    try {
      const data = await GetProspectTypeVariationLookupList(
        common.organisationKeyID,
        common.userKeyID
      );
      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          let BusinessTypeListData = data?.data?.responseData?.data;
          BusinessTypeListData = BusinessTypeListData.map((BusinessType) => ({
            originalBusinessTypeID: BusinessType.originalBusinessTypeID,
            value: BusinessType.businessTypeID,
            label: BusinessType.businessTypeName,
          }));

          setBusinessTypeLookupList(BusinessTypeListData);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  //1) Country Code Lookup List Api
  const getCountryCodes = async () => {
    try {
      const data = await CountryCode();
      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          let CountryList = data?.data?.responseData?.data;
          CountryList = CountryList.map((countryCode) => ({
            value: countryCode.countryCodeId,
            label: countryCode.countryCode,
          }));
          setcountryCodes(CountryList);
        }
      }
    } catch (error) { }
  };

  // Country Lookup list
  const getCountries = async () => {
    try {
      const data = await CountryName();
      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          const CountryList = data?.data?.responseData?.data;
          setCountryLookupList(CountryList);
        }
      }
    } catch (error) { }
  };

  let countryValue = countryLookupList.map((country) => ({
    value: country.countryId,
    label: country.countryName,
  }));

  //Nature of business type lookup list
  const GetNOBTypeLookUpListData = async () => {
    try {
      const data = await GetNOBTypeLookupList(
        common.organisationKeyID,
        common.userKeyID
      );
      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          let NoBTypeListData = data?.data?.responseData?.data;
          // Map the fetched data to include only value and label
          NoBTypeListData = NoBTypeListData.map((NOB) => ({
            value: NOB.businessNatureID,
            label: NOB.businessNatureName,
          }));
          // Add the "All" option to the beginning of the array
          // NoBTypeListData.unshift({
          //   value: null,
          //   label: "All",
          // });
          // Set the state with the updated array
          setNatureOfBusinessTypeLookupList(NoBTypeListData);
        }
      }
    } catch (error) { }
  };

  const GetIncorporatedInLookUpListData = async () => {
    try {
      const data = await GetIncorporatedInLookUpList();
      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          let incorporateInListData = data?.data?.responseData?.data;
          incorporateInListData = incorporateInListData.map((incIn) => ({
            value: incIn.incInID,
            label: incIn.incInName,
          }));
          setIncorporatedInList(incorporateInListData);
        }
      }
    } catch (error) { }
  };

  // 1) Get Model Data Api
  const GetClientInformationModelData = async (id) => {
    if (!id) {
      return;
    }
    setLoader(true);
    try {
      const data = await GetClientInformationModel(id);
      if (data?.data?.statusCode === 200) {
        setLoader(false);
        if (data?.data?.responseData?.data) {
          let CountryList;
          const countryCodeData = await CountryCode();
          if (countryCodeData?.data?.statusCode === 200) {
            if (countryCodeData?.data?.responseData?.data) {
              CountryList = countryCodeData?.data?.responseData?.data;
              CountryList = CountryList.map((countryCode) => ({
                value: countryCode.countryCodeId,
                label: countryCode.countryCode,
              }));
            }
          }
          const ModelData = data?.data?.responseData?.data;
          setIsValidForm(true);
          const AddressObj = {
            addressId: ModelData.tradingAddress.addressId,
            premises: ModelData.tradingAddress.premises,
            addressLine1: ModelData.tradingAddress.addressLine1,
            addressLine2: ModelData.tradingAddress.addressLine2,
            locality: ModelData.tradingAddress.locality,
            region: ModelData.tradingAddress.region,
            countryId: ModelData.tradingAddress.countryId,
            postcode: ModelData.tradingAddress.postcode,
          };

          setBasicInfo({
            ...basicInfo,
            clientKeyID: ModelData.clientKeyID,
            businessTypeID: ModelData.businessTypeID,
            businessTypeName: ModelData.businessTypeName,
            tradingName: ModelData.tradingBusinessName,
            businessNatureID:
              ModelData.businessNatureID === null
                ? []
                : ModelData.businessNatureID,
            tradingAddress: AddressObj,
            VATReg: ModelData.isVatRegistered,
            VATNumber: ModelData.vatNumber,
            website: ModelData.websiteName,
            originalBusinessTypeID: ModelData.originalBusinessTypeID,
          });

          let officerArray = [];
          ModelData.officersList.forEach((item) => {
            const PhoneSelectedValue = CountryList.find(
              (countryCode) => item.countryCodeID == countryCode.value
            );

            let officerObj = {
              officerID: item.officerID,
              firstName: item.firstName,
              lastName: item.lastName,
              countryCodeID: item.countryCodeID,
              phoneCountryCodeID: PhoneSelectedValue,
              phoneNo: item.phoneNo,
              emailID: item.emailID,
              addressID: item.addressID,
              isAuthorisedSignatory:
                item.isAuthorisedSignatory === null
                  ? false
                  : item.isAuthorisedSignatory,
              officerRole: item.officerRole,
              appointedOn: item.appointedOn,
              moduleName: item.moduleName,
              moduleID: item.moduleID,
              officersAddress: {
                addressId: item.officersAddress.addressId,
                premises: item.officersAddress.premises,
                addressLine1: item.officersAddress.addressLine1,
                addressLine2: item.officersAddress.addressLine2,
                locality: item.officersAddress.locality,
                region: item.officersAddress.region,
                countryId: item.officersAddress.countryID,
                postcode: item.officersAddress.postcode,
                countryName: item.officersAddress.countryName,
              },
            };
            officerArray.push(officerObj);
          });

          setOfficers(officerArray);
          let companyObj = {
            companyID: ModelData.companyDetails.companyID,
            companyName: ModelData.companyDetails.companyName,
            companyType: ModelData.companyDetails.companyType,
            companyNumber: ModelData.companyDetails.companyNumber,
            companyStatus: ModelData.companyDetails.companyStatus,
            addressID: ModelData.companyDetails.addressID,
            incorporationDate: ModelData.companyDetails.incorporationDate,
            incInID: ModelData.companyDetails.incInID,
            moduleName: ModelData.companyDetails.moduleName,
            moduleID: ModelData.companyDetails.moduleID,
            companyAddress: {
              addressId: ModelData.companyDetails.companyAddress?.addressId,
              premises: ModelData.companyDetails.companyAddress?.premises,
              addressLine1:
                ModelData.companyDetails.companyAddress?.addressLine1,
              addressLine2:
                ModelData.companyDetails.companyAddress?.addressLine2,
              locality: ModelData.companyDetails.companyAddress?.locality,
              region: ModelData.companyDetails.companyAddress?.region,
              countryId: ModelData.companyDetails.companyAddress?.countryId,
              postcode: ModelData.companyDetails.companyAddress?.postcode,
            },
          };
          setCompanyForm(companyObj);
          const fullAddress = concatenateFullAddress(
            ModelData.companyDetails?.companyAddress
          );
          setConcatenatedRegisterAddress(fullAddress);

          let CorrespondenceOrResidentialAddress = [];
          ModelData.officersList.forEach((officer, index) => {
            const address = officer.officersAddress;

            if (address) {
              let fullAddressConcatenation = concatenateFullAddress(address);
              let CorrespondenceOrResidentialAddressObj = {
                officersFullAddress: fullAddressConcatenation,
              };

              CorrespondenceOrResidentialAddress.push(
                CorrespondenceOrResidentialAddressObj
              );
            } else {
              CorrespondenceOrResidentialAddress.push({
                officersFullAddress: null,
              });
            }
          });
          setConcatenatedResidentialAddress(CorrespondenceOrResidentialAddress);
          if (AddressObj) {
            const fullAddress = concatenateFullAddress(AddressObj);
            setConcatenatedTradingAddress(fullAddress);
          }
        }
      } else {
        setLoader(false);
        setErrorMessage(data?.data?.errorMessage);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  const OnNOBChange = (selectedOption) => {
    // Update your state or perform actions with the single selected option
    setBasicInfo((prevState) => ({
      ...prevState,
      businessNatureID: selectedOption ? [selectedOption.value] : [],
    }));
  };

  const NOBTypeValue = basicInfo?.businessNatureID
    ? NatureOfBusinessTypeLookupList.find(
      (nature) => nature.value === basicInfo.businessNatureID[0]
    ) || null
    : null;
  // tab value change
  const handleChangeTab = (newTab, clickedTabID) => {
    let clickedTabClasses = $("#" + clickedTabID).attr("class");
    if (clickedTabClasses?.includes("disabled")) {
      return false;
    }
    if (newTab <= activeTab) {
      setOfficersError(false);
      setRequireErrorMessage(false);
      setActiveTab(newTab);
    } else {
      if (newTab == 3) {
        let clickedTabID = true;
        handleTabChange(newTab, clickedTabID);
      } else {
        handleTabChange(newTab);
      }
    }
  };
  // Add Client Details
  const AddUpdateClickedClient = () => {
    const companyDetails = {
      companyID: companyForm.companyID == "" ? null : companyForm.companyID,
      companyName:
        companyForm.companyName == "" ? null : companyForm.companyName,
      companyType:
        companyForm.companyType == "" ? null : companyForm.companyType,
      companyNumber:
        companyForm.companyNumber == "" ? null : companyForm.companyNumber,
      companyStatus:
        companyForm.companyStatus == "" ? null : companyForm.companyStatus,
      addressID: companyForm.addressID == "" ? null : companyForm.addressID,
      incorporationDate:
        companyForm.incorporationDate == ""
          ? null
          : companyForm.incorporationDate,
      incInID: companyForm.incInID == "" ? null : companyForm.incInID,
      moduleName: companyForm.moduleName == "" ? null : companyForm.moduleName,
      moduleID: companyForm.moduleID == "" ? null : companyForm.moduleID,
      companyAddress:
        companyForm.companyAddress == "" ? null : companyForm.companyAddress,
    };

    const ApiRequest_ParamsObj = {
      organisationKeyID: common.organisationKeyID,
      userKeyID: common.userKeyID,
      clientKeyID: basicInfo.clientKeyID,
      businessTypeID: basicInfo.businessTypeID,
      vatNumber: basicInfo.VATNumber,
      addressID: basicInfo.tradingAddress?.addressId,
      isVatRegistered: basicInfo.VATReg,
      businessNatureID: basicInfo.businessNatureID,
      websiteName: basicInfo.website,
      tradingBusinessName: basicInfo.tradingName,
      tradingAddress: basicInfo.tradingAddress,
      companyDetails: companyDetails,
      officersList: officersForm,
    };
    AddUpdateOrganisationData(ApiRequest_ParamsObj);
  };
  // Add or Update Service Category Data
  const AddUpdateOrganisationData = async (apiRequestParams) => {
    setLoader(true);
    try {
      let url = "/ClientInformation/AddUpdateClientInformation"; // Default URL for Adding Data
      if (saveLocationState?.Action !== null) {
        url = "/ClientInformation/AddUpdateClientInformation?Action=Update";
      }
      const response = await AddUpdateOrganisation(url, apiRequestParams);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          setOpenSuccessModal(true);
          setErrorMessage("");
        } else {
          setLoader(false);
          setErrorMessage(response?.response?.data?.errorMessage);
        }
      }
    } catch (error) {
      setLoader(false);
      console.error(error);
    }
  };

  // 1] Company search function Api
  const getCompanies = async (params) => {
    setLoader(true);
    try {
      const data = await GetCompanyList(params);
      if (data?.data?.responseData) {
        if (data?.data?.responseData) {
          setLoader(false);
          const CompanyList = data?.data?.responseData;
          setCompanies(CompanyList);
        }
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  // Save company detail Function
  const companyDetails = async (params) => {
    try {
      const data = await GetCompanyDetails(params);

      if (data?.data?.responseData) {
        setCompanies([]);
        const CompanyDetails = data?.data?.responseData;
        const address = CompanyDetails.registered_office_address;
        const selected_Country = countryLookupList.filter(
          (c) => c.countryName == address.country
        )[0];

        const company_Address = {
          addressId: null,
          premises: address.premises || null,
          addressLine1: address.address_line_1 || null,
          addressLine2: address.address_line_2 || null,
          locality: address.locality || null,
          country: address.country || null,
          countryId: selected_Country?.countryId || null,
          region: address.region || null,
          postcode: address.postal_code || null,
        };

        const fullAddress = concatenateFullAddress(company_Address);
        setConcatenatedRegisterAddress(fullAddress);
        setBasicInfo({
          ...basicInfo,
          tradingName: CompanyDetails.company_name,
          tradingAddress: company_Address,
          regOfficeAddress: fullAddress,
        });
        setConcatenatedTradingAddress(fullAddress);
        setCompanyForm({
          ...companyForm,
          companyName: CompanyDetails.company_name,
          companyNumber: CompanyDetails.company_number,
          companyType: CompanyDetails.type,
          incorporationDate: CompanyDetails.date_of_creation,
          companyAddress: company_Address,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Save officer detail form
  const companyOfficers = async (params) => {
    setBasicInfo({
      ...basicInfo,
      addressId: null,
      tradingName: null,
      tradingAddress: null,
      businessNatureID: [],
      VATReg: 1,
      VATNumber: null,
      website: null,
    });
    try {
      const data = await GetCompanyOfficers(params);
      if (data?.data?.responseData) {
        const CompanyOfficer = data?.data?.responseData;
        const CompOfficers = [];
        let CorrespondenceOrResidentialAddress = [];
        let officerCount = 0
        if (CompanyOfficer?.length === 0) {
          CompOfficers.push({
            officerID: null,
            firstName: "",
            lastName: "",
            countryCodeID: 9,
            phoneCountryCodeID: { value: 9, label: "+44" },
            phoneNo: null,
            emailID: null,
            addressID: null,
            isAuthorisedSignatory: false,
            officerRole: "",
            appointedOn: "",
            moduleName: null,
            moduleID: null,
            officersAddress: null,
          });
          let CorrespondenceOrResidentialAddressObj = {
            officersFullAddress: null,
          };
          CorrespondenceOrResidentialAddress.push(
            CorrespondenceOrResidentialAddressObj
          );
        } else {
          CompanyOfficer.forEach((officer) => {
            let officerName = officer?.name?.split(",");
            let officerFirstName = officerName[1]?.trim()?.split(" ")[0];
            let officerLastName = officerName[0]?.trim()?.split(" ")[0];
            officerCount = officerCount + 1
            if (officerFirstName && officerFirstName?.length > 30) {
              officerFirstName = officerFirstName?.substring(0, 29);
            }
            if (officerLastName && officerLastName?.length > 30) {
              officerLastName = officerLastName?.substring(0, 29);
            }
            const selected_Country = countryLookupList.filter(
              (c) => c.countryName == officer?.address.country
            )[0];

            let officerAddress = {
              organisationID: common.organisationID,
              premises: officer?.address.premises || null,
              addressLine1:
                `${officer?.address.premises || ""} ${officer?.address.address_line_1 || ""
                  }`.trim() || null,
              addressLine2: officer?.address.address_line_2 || null,
              locality: officer?.address.locality || null,
              region: officer?.address.region || null,
              country: officer?.address.country || null,
              countryId:
                selected_Country?.countryId === ""
                  ? null
                  : selected_Country?.countryId,
              postcode: officer?.address.postal_code || null,
            };

            CompOfficers.push({
              createdByID: 0,
              organisationID: common.organisationID,
              officerID: null,
              firstName: officerFirstName === undefined ? "" : officerFirstName,
              lastName: officerLastName === undefined ? "" : officerLastName,
              countryCodeID: 9,
              phoneCountryCodeID: { value: 9, label: "+44" },
              phoneNo: null,
              emailID: "",
              addressID: null,
              isAuthorisedSignatory: false,
              officerRole: officer?.officer_role,
              appointedOn: officer?.appointed_on,
              moduleName: null,
              moduleID: 0,
              officersAddress: officerAddress,
            });
            let fullAddressConcatenation = concatenateFullAddress(officerAddress);
            let CorrespondenceOrResidentialAddressObj = {
              officersFullAddress: fullAddressConcatenation,
            };
            CorrespondenceOrResidentialAddress.push(
              CorrespondenceOrResidentialAddressObj
            );
          });
        }
        setLoader(false);
        setConcatenatedResidentialAddress(CorrespondenceOrResidentialAddress);
        setOfficers(CompOfficers);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const concatenateFullAddress = (address) => {
    const addPart = (part) => (part ? `${part}, ` : "");
    let concatenatedAddress = `${addPart(
      address?.addressLine1?.replace(",", " ")
    )}${addPart(address?.addressLine2)}${addPart(address?.locality)}${addPart(
      address?.region
    )}${addPart(address?.country || address?.countryName)}${address?.postcode || ""
      }`;

    // Remove trailing comma, if present
    if (concatenatedAddress.endsWith(", ")) {
      concatenatedAddress = concatenatedAddress.slice(0, -2);
    }
    return concatenatedAddress;
  };
  const isDuplicateEmail = (email, index) => {
    return officersForm.some(
      (officer, idx) =>
        officer.emailID?.toLowerCase() === email?.toLowerCase() && idx !== index
    );
  };
  const OnOfficerChange = (index, field, value) => {
    const updatedOfficer = [...officersForm];
    updatedOfficer[index][field] = value;

    setOfficers(updatedOfficer);
    if (field == "emailID") {
      if (isDuplicateEmail(value, index)) {
        setEmailError(`Duplicate email should not be allowed `);
        // scrollUpDownByElementID(`EmailError`);
      } else {
        setEmailError("");
      }
    }
  };

  const deleteOfficer = (index) => {
    const addressesCopy = [...concatenatedResidentialAddress];

    if (index >= 0 && index < addressesCopy.length) {
      addressesCopy.splice(index, 1);
      setConcatenatedResidentialAddress(addressesCopy);
    }
    const officerCopy = [...officersForm];
    if (index >= 0 && index < officerCopy.length) {
      officerCopy.splice(index, 1);
      setOfficers(officerCopy);
    }
  };

  // Handle Function
  const handleCompanySelect = (e) => {
    const company_Number = e.company_number;
    setSignature("");
    setAuthoritySignatorySignatory(false);
    setOfficersError(false);
    setIsValidForm(false);

    setOfficers([
      {
        officerID: null,
        firstName: "",
        lastName: "",
        countryCodeID: 9,
        phoneCountryCodeID: { value: 9, label: "+44" },
        phoneNo: "",
        emailID: "",
        addressID: null,
        isAuthorisedSignatory: false,
        officerRole: "",
        appointedOn: "",
        moduleName: "",
        moduleID: null,
        officersAddress: {
          addressId: null,
          premises: "",
          addressLine1: "",
          addressLine2: "",
          locality: "",
          region: "",
          countryId: null,
          postcode: "",
        },
      },
    ]);
    setConcatenatedResidentialAddress([{ officersFullAddress: "" }]);
    companyOfficers(company_Number);
    companyDetails(company_Number);
  };

  const handleCompanyInputChange = (e) => {
    const inputValue = e.target.value;
    setEmailError("");
    setErrorMessage("");
    setSearchCompany(inputValue);
    if (inputValue === "") {
      setCompanies([]); // Clear companies list if input is empty
    } else {
      getCompanies(inputValue);
    }
  };

  const handleIncorporatedInChange = (selectedCountry) => {
    setCompanyForm({ ...companyForm, incInID: selectedCountry.value });
  };

  const handleBackBtnChange = (newTab) => {
    setOfficersError(false);
    setEmailError("");
    setErrorMessage("");
    setActiveTab(newTab);
  };
  const handleCancel = () => {
    navigate(-1);
  };

  const handleSuccessPopupOk = () => {
    if (saveLocationState?.ModuleName === "Proposal") {
      navigate("/add-proposal");
    } else if (saveLocationState?.ModuleName === "EL") {
      navigate("/add-engagement-letter");
    } else {
      navigate("/prospects");
    }
  };
  const handleClose = () => {
    setOpenErrorModal(false);
  };
  const urlRegex =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
  const phoneNumberRegex = /^\d{10,15}$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleTabChange = (newTab) => {
    let hasOfficerError = false;
    let authorizedRecords;
    let OfficerAppointedOnDate = false;
    if (
      basicInfo.originalBusinessTypeID === CLIENT_TYPES.Partnership ||
      basicInfo.originalBusinessTypeID === CLIENT_TYPES.LLP ||
      basicInfo.originalBusinessTypeID === CLIENT_TYPES.Company
    ) {
      authorizedRecords = officersForm.filter(
        (item) => item.isAuthorisedSignatory === true
      );
      setAuthorityCount(authorizedRecords.length);
    }

    if (activeTab === CREATE_PRACTICE_DETAILS.BasicInformation) {
      if (basicInfo.originalBusinessTypeID === CLIENT_TYPES.Individual) {
        if (
          basicInfo.businessTypeID === null ||
          basicInfo.businessTypeID === "" ||
          basicInfo.businessTypeID === undefined
        ) {
          setRequireErrorMessage(true);
          hasOfficerError = true;
        }
        for (let i = 0; i < officersForm.length; i++) {
          if (
            officersForm[i].firstName === "" ||
            officersForm[i].firstName === null ||
            officersForm[i].firstName === undefined ||
            officersForm[i].lastName === "" ||
            officersForm[i].lastName === null ||
            officersForm[i].lastName === undefined ||
            officersForm[i].emailID === "" ||
            officersForm[i].emailID === null ||
            !emailPattern.test(officersForm[i].emailID) ||
            concatenatedResidentialAddress[i].officersFullAddress === null ||
            concatenatedResidentialAddress[i].officersFullAddress === ""
          ) {
            setOfficersError(true);
            hasOfficerError = true;
            break; // Use break to exit the loop once an error is found
          } else {
            for (let i = 0; i < officersForm.length; i++) {
              if (
                officersForm[i].phoneNo !== null &&
                officersForm[i].phoneNo !== "" &&
                officersForm[i].phoneNo !== undefined
              ) {
                if (!phoneNumberRegex.test(officersForm[i].phoneNo)) {
                  setOfficersError(true);
                  hasOfficerError = true;
                  return false;
                }
              }
            }
            if (
              basicInfo.website !== "" &&
              basicInfo.website !== undefined &&
              basicInfo.website !== null
            ) {
              if (!urlRegex.test(basicInfo.website)) {
                setRequireErrorMessage(true);
                hasOfficerError = true;
              } else {
                hasOfficerError = false;
              }
            }

            if (!hasOfficerError) {
              setRequireErrorMessage(false);
              setOfficersError(false);
              AddUpdateClickedClient();
            }
          }
        }
      } else if (
        basicInfo.originalBusinessTypeID === CLIENT_TYPES.Sole_Trader ||
        basicInfo.originalBusinessTypeID === CLIENT_TYPES.Other ||
        basicInfo.originalBusinessTypeID === CLIENT_TYPES.Partnership
      ) {
        if (
          basicInfo.businessTypeID === "" ||
          basicInfo.businessTypeID === null ||
          basicInfo.tradingName === "" ||
          basicInfo.tradingName === null ||
          basicInfo.tradingAddress === "" ||
          basicInfo.tradingAddress === null ||
          concatenatedTradingAddress === null ||
          concatenatedTradingAddress === ""
        ) {
          setRequireErrorMessage(true);
          setIsValidForm(false);
          return false;
        } else if (
          basicInfo.website !== "" &&
          basicInfo.website !== undefined &&
          basicInfo.website !== null
        ) {
          if (!urlRegex.test(basicInfo.website)) {
            setRequireErrorMessage(true);
            return false;
          } else {
            setActiveTab(newTab);
            setIsValidForm({
              ...isValidForm,
              OfficerForm: true,
            });
          }
        } else {
          setRequireErrorMessage(false);
          setOfficersError(false);
          setActiveTab(newTab);
          setIsValidForm(true);
        }
      } else if (
        basicInfo.originalBusinessTypeID === CLIENT_TYPES.LLP ||
        basicInfo.originalBusinessTypeID === CLIENT_TYPES.Company
      ) {
        if (
          basicInfo.businessTypeID === "" ||
          basicInfo.businessTypeID === null ||
          basicInfo.tradingName === "" ||
          basicInfo.tradingName === null ||
          basicInfo.tradingAddress === "" ||
          basicInfo.tradingAddress === null ||
          companyForm.companyName === null ||
          companyForm.companyName === "" ||
          companyForm.incInID === null ||
          companyForm.incInID === "" ||
          companyForm.companyNumber === "" ||
          companyForm.companyNumber === null ||
          concatenatedTradingAddress === null ||
          concatenatedTradingAddress === ""
        ) {
          setRequireErrorMessage(true);

          setIsValidForm(false);
          if (
            companyForm.companyName === null ||
            companyForm.companyName === ""
          ) {
            scrollUpDownByElementID("CompanyName");
          } else if (
            companyForm.companyNumber === "" ||
            companyForm.companyNumber === null
          ) {
            scrollUpDownByElementID("CompanyNumber");
          } else if (
            companyForm.incInID === null ||
            companyForm.incInID === ""
          ) {
            scrollUpDownByElementID("InCorporateIDDiv");
          } else if (
            basicInfo.tradingName === "" ||
            basicInfo.tradingName === null
          ) {
            scrollUpDownByElementID("LTDTradingName");
          } else if (
            concatenatedTradingAddress === null ||
            concatenatedTradingAddress === ""
          ) {
            scrollUpDownByElementID("LTDTradingAddressName");
          }
          return false;
        } else if (
          basicInfo.website !== "" &&
          basicInfo.website !== undefined &&
          basicInfo.website !== null
        ) {
          if (!urlRegex.test(basicInfo.website)) {
            setRequireErrorMessage(true);
            return false;
          } else {
            setRequireErrorMessage(false);
            scrollUpDownByElementID("Web_Div");
            setOfficersError(false);
            setActiveTab(newTab);
            setIsValidForm({
              ...isValidForm,
              OfficerForm: true,
            });
          }
        } else {
          setRequireErrorMessage(false);
          setOfficersError(false);
          setActiveTab(newTab);
          setIsValidForm(true);
        }
      }
    } else if (activeTab === CREATE_PRACTICE_DETAILS.OfficerDetails) {
      if (
        basicInfo.originalBusinessTypeID === CLIENT_TYPES.Sole_Trader ||
        basicInfo.originalBusinessTypeID === CLIENT_TYPES.Other
      ) {
        for (let i = 0; i < officersForm.length; i++) {
          if (
            officersForm[i].firstName === "" ||
            officersForm[i].firstName === null ||
            officersForm[i].firstName === undefined ||
            officersForm[i].lastName === "" ||
            officersForm[i].lastName === null ||
            officersForm[i].lastName === undefined ||
            officersForm[i].emailID === "" ||
            officersForm[i].emailID === null ||
            !emailPattern.test(officersForm[i].emailID) ||
            concatenatedResidentialAddress[i].officersFullAddress === null ||
            concatenatedResidentialAddress[i].officersFullAddress === ""
          ) {
            setOfficersError(true);
            break; // Use break to exit the loop once an error is found
          } else {
            for (let i = 0; i < officersForm.length; i++) {
              if (
                officersForm[i].phoneNo !== null &&
                officersForm[i].phoneNo !== "" &&
                officersForm[i].phoneNo !== undefined
              ) {
                if (!phoneNumberRegex.test(officersForm[i].phoneNo)) {
                  setOfficersError(true);
                  hasOfficerError = true;
                }
              }
            }
            if (!hasOfficerError) {
              setRequireErrorMessage(false);
              setOfficersError(false);
              AddUpdateClickedClient();
            }
          }
        }
      } else if (
        basicInfo.originalBusinessTypeID === CLIENT_TYPES.Partnership
      ) {
        for (let i = 0; i < officersForm.length; i++) {
          if (
            officersForm[i].firstName === "" ||
            officersForm[i].firstName === null ||
            officersForm[i].firstName === undefined ||
            officersForm[i].lastName === "" ||
            officersForm[i].lastName === null ||
            officersForm[i].lastName === undefined ||
            officersForm[i].emailID === "" ||
            officersForm[i].emailID === null ||
            authorizedRecords.length === 0 ||
            !emailPattern.test(officersForm[i].emailID) ||
            concatenatedResidentialAddress[i]?.officersFullAddress === null ||
            concatenatedResidentialAddress[i]?.officersFullAddress === ""
          ) {
            setAuthoritySignatorySignatory(true);
            setOfficersError(true);

            scrollUpDownByElementID(`Partner_${i}`);

            hasOfficerError = true;
            return false;
          }

          if (isDuplicateEmail(officersForm[i].emailID, i)) {
            setEmailError(`Duplicate email should not be allowed `);
            scrollUpDownByElementID(`EmailError`);

            // setOpenErrorModal(true)
            return false;
          }
          // else {
          //   if (basicInfo.businessTypeID === CLIENT_TYPES.Partnership) {
          //     let authoritySignatoryFound = false;
          //     for (let j = 0; j < officersForm.length; j++) {
          //       if (officersForm[j].isAuthorisedSignatory === true) {
          //         authoritySignatoryFound = true;
          //         break;
          //       }
          //     }
          //     if (authoritySignatoryFound) {
          //       hasOfficerError = false;
          //     } else {
          //       setAuthoritySignatorySignatory(true);
          //       setOfficersError(true);
          //       hasOfficerError = true;
          //       return false;
          //     }
          //   }
          // }
        }
        for (let i = 0; i < officersForm.length; i++) {
          if (
            officersForm[i].phoneNo !== null &&
            officersForm[i].phoneNo !== "" &&
            officersForm[i].phoneNo !== undefined
          ) {
            if (!phoneNumberRegex.test(officersForm[i].phoneNo)) {
              scrollUpDownByElementID(`Partner_${i}`);
              setOfficersError(true);
              hasOfficerError = true;
              return false;
            }
          }
        }
        if (!hasOfficerError) {
          setRequireErrorMessage(false);
          setOfficersError(false);
          AddUpdateClickedClient();
        }
      } else if (
        basicInfo.originalBusinessTypeID === CLIENT_TYPES.LLP ||
        basicInfo.originalBusinessTypeID === CLIENT_TYPES.Company
      ) {
        // for (let i = 0; i < officersForm.length; i++) {
        // //   const dateString = officersForm[i].appointedOn;
        // //   if (
        // //     dateString !== undefined &&
        // //     dateString !== null &&
        // //     dateString !== ""
        // //   ) {
        // //     const parsedDate = new Date(dateString);

        // //     const minYear = 1970;
        // //     const maxYear = new Date().getFullYear();

        // //     if (
        // //       !isNaN(parsedDate.getTime()) &&
        // //       parsedDate.getFullYear() >= minYear &&
        // //       parsedDate.getFullYear() <= maxYear
        // //     ) {
        // //       // Valid date
        // //       setInvalidAppointedOnDate(false);
        // //       OfficerAppointedOnDate = false;
        // //       // Update other state variables or perform additional actions as needed
        // //     } else {
        // //       // Invalid date
        // //       setInvalidAppointedOnDate(true);
        // //       OfficerAppointedOnDate = true;
        // //       return false;
        // //       // Update other state variables or perform additional actions as needed
        // //     }
        // //   }
        // }
        for (let i = 0; i < officersForm.length; i++) {
          if (
            officersForm[i].firstName === "" ||
            officersForm[i].firstName === null ||
            officersForm[i].firstName === undefined ||
            officersForm[i].lastName === "" ||
            officersForm[i].lastName === null ||
            officersForm[i].lastName === undefined ||
            officersForm[i].emailID === "" ||
            officersForm[i].emailID === null ||
            officersForm[i].officerRole === "" ||
            officersForm[i].officerRole === null ||
            officersForm[i]?.appointedOn === "" ||
            officersForm[i]?.appointedOn === null ||
            authorizedRecords.length === 0 ||
            !emailPattern.test(officersForm[i]?.emailID) ||
            concatenatedResidentialAddress[i]?.officersFullAddress === null ||
            concatenatedResidentialAddress[i]?.officersFullAddress === ""
          ) {
            setAuthoritySignatorySignatory(true);
            scrollUpDownByElementID(`Officers${i}`);
            setOfficersError(true);
            hasOfficerError = true;
            return false;
          }
          if (isDuplicateEmail(officersForm[i].emailID, i)) {
            setEmailError(`Duplicate email should not be allowed `);
            scrollUpDownByElementID(`EmailError`);
            // setOpenErrorModal(true)
            return false;
          }
          // else {
          //   if (basicInfo.businessTypeID === CLIENT_TYPES.Partnership) {
          //     let authoritySignatoryFound = false;
          //     for (let j = 0; j < officersForm.length; j++) {
          //       if (officersForm[j].isAuthorisedSignatory === true) {
          //         authoritySignatoryFound = true;
          //         break;
          //       }
          //     }
          //     if (authoritySignatoryFound) {
          //       hasOfficerError = false;
          //     } else {
          //       setAuthoritySignatorySignatory(true);
          //       setOfficersError(true);
          //       hasOfficerError = true;
          //       return false;
          //     }
          //   }
          // }
        }
        for (let i = 0; i < officersForm.length; i++) {
          if (
            officersForm[i].phoneNo !== null &&
            officersForm[i].phoneNo !== "" &&
            officersForm[i].phoneNo !== undefined
          ) {
            if (!phoneNumberRegex.test(officersForm[i].phoneNo)) {
              scrollUpDownByElementID(`Officers${i}`);
              setOfficersError(true);
              hasOfficerError = true;
            }
          }
        }

        if (!hasOfficerError) {
          setRequireErrorMessage(false);
          setOfficersError(false);
          AddUpdateClickedClient();
        }
      }
    }
  };
  return (
    <div className="container-fluid">
      <div class="new-item-page-nav"></div>
      <div className="new-item-page-content">
        <div className="row form-row">
          <div className="col-lg-12">
            <h3 class="modal-title">
              <BackButtonSvg onClick={handleCancel} />
              {modelAction === "Add"
                ? getCrudPopUpTitleName("Add", prospectName)
                : getCrudPopUpTitleName("Update", prospectName)}
              {modelAction !== "Add" ? `:` : ""}{" "}
              {isMobile ? (
                saveLocationState?.clientName?.length > 10 ? (
                  `${saveLocationState?.clientName?.substring(0, 10)}...`
                ) : (
                  saveLocationState?.clientName
                )
              ) : saveLocationState?.clientName?.length > 35 ? (
                <Tooltip title={saveLocationState?.clientName}>
                  {" "}
                  {saveLocationState?.clientName?.substring(0, 35)}...
                </Tooltip>
              ) : (
                saveLocationState?.clientName
              )}
            </h3>
            <div
              className="steps overflow-auto"
              style={{ pointerEvents: "all" }}
            >
              <ul className="steps-list">
                <li>
                  <div
                    onClick={() =>
                      handleChangeTab(1, "Prospect_BasicInformation_Tab")
                    }
                    id="Prospect_BasicInformation_Tab"
                    className={`${activeTab === CREATE_PRACTICE_DETAILS.BasicInformation
                      ? "step tab-field-center"
                      : isValidForm === true
                        ? "step tab-field-center"
                        : "step disabled cursor-not-allowed tab-field-center"
                      } w-90`}
                  >
                    <span className="stepCount">1</span>
                    <span className="stepTitle">Basic Information</span>
                    {activeTab === CREATE_PRACTICE_DETAILS.BasicInformation &&
                      (requireErrorMessage || officerError) && (
                        <span className="validation">
                          <InvalidFormIcon />
                        </span>
                      )}
                  </div>
                </li>
                {basicInfo.originalBusinessTypeID !== "" &&
                  basicInfo.originalBusinessTypeID !==
                  CLIENT_TYPES.Individual && (
                    <li>
                      <div
                        onClick={() =>
                          handleChangeTab(2, "Prospect_OfficerDetails_Tab")
                        }
                        id="Prospect_OfficerDetails_Tab"
                        class={`${activeTab === CREATE_PRACTICE_DETAILS.OfficerDetails
                          ? "step tab-field-center"
                          : isValidForm === true
                            ? "step tab-field-center"
                            : "step disabled cursor-not-allowed tab-field-center"
                          } w-90`}
                      >
                        <span className="stepCount">2</span>
                        <span className="stepTitle">
                          {[4, 5]?.includes(basicInfo.originalBusinessTypeID)
                            ? "Officer Details"
                            : `${basicInfo.businessTypeName} Details`}
                        </span>

                        {activeTab === CREATE_PRACTICE_DETAILS.OfficerDetails &&
                          officerError && (
                            <span className="validation">
                              <InvalidFormIcon />
                            </span>
                          )}
                      </div>
                    </li>
                  )}
              </ul>
            </div>
            {activeTab === CREATE_PRACTICE_DETAILS.BasicInformation && (
              <Basic_information
                concatenatedTradingAddress={concatenatedTradingAddress}
                officersForm={officersForm}
                setSearchCompany={setSearchCompany}
                SearchCompany={SearchCompany}
                InvalidAppointedOnDate={InvalidAppointedOnDate}
                setOfficers={setOfficers}
                setConcatenatedRegisterAddress={setConcatenatedRegisterAddress}
                modelAction={modelAction}
                OnOfficerChange={OnOfficerChange}
                setOfficersError={setOfficersError}
                officerError={officerError}
                OnNOBChange={OnNOBChange}
                NOBTypeValue={NOBTypeValue}
                setConcatenatedTradingAddress-={setConcatenatedTradingAddress}
                concatenatedResidentialAddress={concatenatedResidentialAddress}
                basicInfo={basicInfo}
                addressPopUpTitle={addressPopUpTitle}
                NatureOfBusinessTypeLookupList={NatureOfBusinessTypeLookupList}
                setAddressPopUpTitle={setAddressPopUpTitle}
                addressUpdatedDatetime={addressUpdatedDatetime}
                setAddressUpdatedDatetime={setAddressUpdatedDatetime}
                address={address}
                fullAddress={fullAddress}
                concatenatedRegisterAddress={concatenatedRegisterAddress}
                setConcatenatedResidentialAddress={
                  setConcatenatedResidentialAddress
                }
                setSelectedOfficerAddressIndex={setSelectedOfficerAddressIndex}
                setFullAddress={setFullAddress}
                setRequireErrorMessage={setRequireErrorMessage}
                signature={signature}
                setSignature={setSignature}
                setAddress={setAddress}
                setBasicInfo={setBasicInfo}
                requireErrorMessage={requireErrorMessage}
                companies={companies}
                countryCodes={countryCodes}
                companyForm={companyForm}
                setCompanyForm={setCompanyForm}
                selectedCountry={selectedCountry}
                setConcatenatedTradingAddress={setConcatenatedTradingAddress}
                BusinessTypeLookupList={BusinessTypeLookupList}
                countryValue={countryValue}
                incorporatedInList={incorporatedInList}
                handleCompanySelect={handleCompanySelect}
                handleCompanyInputChange={handleCompanyInputChange}
                handleIncorporatedInChange={handleIncorporatedInChange}
                handleTabChange={handleTabChange}
                handleCancel={handleCancel}
                errorMessage={errorMessage}
                getCrudButtonTextName={getCrudButtonTextName}
                handleBackBtnChange={handleBackBtnChange}
              />
            )}
            {activeTab === CREATE_PRACTICE_DETAILS.OfficerDetails && (
              <OfficerDetails
                officersForm={officersForm}
                officerError={officerError}
                modelAction={modelAction}
                InvalidAppointedOnDate={InvalidAppointedOnDate}
                AuthorityCount={AuthorityCount}
                emailError={emailError}
                businessTypeID={basicInfo.businessTypeID}
                originalBusinessTypeID={basicInfo.originalBusinessTypeID}
                addressPopUpTitle={addressPopUpTitle}
                setOfficersError={setOfficersError}
                setAddressPopUpTitle={setAddressPopUpTitle}
                addressUpdatedDatetime={addressUpdatedDatetime}
                setAddressUpdatedDatetime={setAddressUpdatedDatetime}
                concatenatedResidentialAddress={concatenatedResidentialAddress}
                setConcatenatedResidentialAddress={
                  setConcatenatedResidentialAddress
                }
                setEmailError={setEmailError}
                getCrudButtonTextName={getCrudButtonTextName}
                errorMessage={errorMessage}
                authoritySignatorySignatory={authoritySignatorySignatory}
                setAuthoritySignatorySignatory={setAuthoritySignatorySignatory}
                setSelectedOfficerAddressIndex={setSelectedOfficerAddressIndex}
                OnOfficerChange={OnOfficerChange}
                addOfficer={addOfficer}
                fullAddress={fullAddress}
                setFullAddress={setFullAddress}
                address={address}
                setAddress={setAddress}
                deleteOfficer={deleteOfficer}
                countryCodes={countryCodes}
                formErrors={formErrors}
                handleTabChange={handleTabChange}
                handleCancel={handleCancel}
                handleBackBtnChange={handleBackBtnChange}
              />
            )}

            {/* Write Component here */}
          </div>
        </div>
      </div>
      <ErrorModel
        ErrorModel={openErrorModal}
        emailError={emailError}
        handleClose={handleClose}
        ErrorMessage={errorMessage}
      />
      <SuccessModal
        handleClose={handleSuccessPopupOk}
        setDismissModal={setDismissModal}
        setOpenSuccessModal={setOpenSuccessModal}
        openSuccessModal={openSuccessModal}
        modelAction={modelAction}
        message={
          basicInfo.originalBusinessTypeID === CLIENT_TYPES.Individual
            ? `${prospectName} ` +
            `${officersForm[0]?.firstName} ` +
            `${officersForm[0]?.lastName} `
            : `${prospectName} ` + basicInfo.tradingName
        }
      />
    </div>
  );
};

export default Add_Update_prospect;
