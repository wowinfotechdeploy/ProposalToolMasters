/* global $ */
import React, { useEffect, useState, useRef, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AuthContextProvider } from "../AuthContext/AuthContext";
import Utils from "../Middleware/Utils";
import Select from "react-select";
import { CalenderFilterEnum, statusID } from "../Middleware/enums";
import dayjs from "dayjs";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { GetNOBTypeLookupList } from "../redux/Services/Master/NOBTypeLookupListApi";
import {
  GetBusinessTypeLookupList,
  GetProspectTypeVariationLookupList,
} from "../redux/Services/Master/BusinessTypeLookupListApi";
import { GetDocumentStatusTypeLookUpList, GetEmailAddressTypeLookupList, GetTriggerPointTypeLookupList } from "../redux/Services/Config/ReminderApi";
import { GetTemplateTypeList } from "../redux/Services/Master/TemplateTypeLookupListApi";
import { ColorContext } from "../AuthContext/ColorContext";

function Filter(props) {
  // A] States Declaration :
  const moduleName = "Filter";
  const common = useSelector((state) => state.Storage);
  const modalRef = useRef(null);
  const [BusinessTypeLookupList, setBusinessTypeLookupList] = useState([]);
  const [OrganisationBusinessTypeLookupList, setOrganisationBusinessTypeLookupList] = useState([]);
  const [TemplateTypeLookupList, setTemplateTypeLookupList] = useState([]);
  const [TemplateTypeLookupForReminderList, setTemplateTypeLookupForReminderList] = useState([]);
  const [EmailAddressTypeLookupList, setEmailAddressTypeLookupList] = useState([]);
  const [TriggerPointTypeLookupList, setTriggerPointTypeLookupList] = useState([]);
  const [DocumentStatusTypeLookupList, setDocumentStatusTypeLookupList] = useState([]);
  const [NatureOfBusinessTypeLookupList, setNatureOfBusinessTypeLookupList] =
    useState([]);
  const [showProfessionType, setShowProfessionType] = useState(
    common.organisationKeyID === null
  );
  const {
    EngagementName,
    prospectName,
    proposalName,
    setLoader,
    getCrudButtonTextName,
    getCrudPopUpTitleName,
    GetCustomDate,
  } = useContext(AuthContextProvider);
  const {

    isAddUpdateDone,
  } = useContext(ColorContext);
  //Getting Logged Users Details From Persist Storage of redux hooks
  //calender Filter
  useEffect(() => {
    GetEmailAddressTypeData()
    GetDocumentStatusTypeData()
    GetNOBTypeLookUpListData();
    GetBusinessTypeLookupListData();
    GetOrganisationBusinessTypeLookupListData()
    GetTemplateTypeLookupListData();
    GetTemplateTypeLookupListForReminderData()

  }, [props.moduleName]);
  useEffect(() => {
    if (isAddUpdateDone) {
      GetEmailAddressTypeData()
      GetDocumentStatusTypeData()
      GetNOBTypeLookUpListData();
      GetBusinessTypeLookupListData();
      GetOrganisationBusinessTypeLookupListData()
      GetTemplateTypeLookupListData();
      GetTemplateTypeLookupListForReminderData()
    }
  }, [isAddUpdateDone]);
  const handleStatus = (status) => {
    props.setStatus(status.value);
  };

  const handleChangeBusinessTypeID = (status) => {
    props?.setProspectType(status ? status.value : null);
  };

  const handleChangeNOBType = (status) => {
    props?.setBusinessNatureID(status ? status.value : null);
  };
  const handleFromDateChange = (newValue) => {
    if (newValue) {
      const formattedDate = dayjs(newValue).format("YYYY-MM-DD");
      props.setFromDate(formattedDate);
      if (dayjs(newValue).isAfter(props.toDate)) {
        const newToDate = dayjs(newValue).format("YYYY-MM-DD");
        props.setToDate(newToDate);
      }
    }
  };

  const handleToDateChange = (newValue) => {
    if (newValue) {
      const formattedDate = dayjs(newValue).format("YYYY-MM-DD");
      props.setToDate(formattedDate);
      if (dayjs(newValue).isBefore(props.fromDate)) {
        const newFromDate = dayjs(newValue).format("YYYY-MM-DD");
        props?.setFromDate(newFromDate);
      }
    }
  };
  const handleCalenderFilterChange = (selectedOption) => {
    let dateFormat = "mm-dd-yyyy";
    props.setSelectedOption(selectedOption);
    if (!selectedOption) {
      props.setShowDatePicker(false);
      props.setSelectedOption(null);
      props.setToDate(null);
      props.setFromDate(null);
      return;
    }

    switch (selectedOption.value) {
      case CalenderFilterEnum.All:
        props.setFromDate(null);
        props.setToDate(null);
        props.setFormDateOfCalenderForExport(null);
        props.setToDateCalenderForExport(null);
        props.setShowDatePicker(false);
        break;
      case CalenderFilterEnum.This_Week:
        props.setFromDate(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Week).fromDate
        );
        props.setToDate(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Week).toDate
        );

        props.setFormDateOfCalenderForExport(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Week).fromDate
        );
        props.setToDateCalenderForExport(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Week).toDate
        );

        props.setShowDatePicker(false);
        break;
      case CalenderFilterEnum.Last_Week:
        props.setFromDate(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Week).fromDate
        );
        props.setToDate(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Week).toDate
        );

        props.setFromDate(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Week).fromDate
        );
        props.setToDate(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Week).toDate
        );

        props.setShowDatePicker(false);
        break;
      case CalenderFilterEnum.This_Month:
        props.setFromDate(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Month).fromDate
        );
        props.setToDate(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Month).toDate
        );

        props.setFromDate(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Month).fromDate
        );
        props.setToDate(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Month).toDate
        );

        props.setShowDatePicker(false);
        break;
      case CalenderFilterEnum.Last_Month:
        props.setFromDate(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Month).fromDate
        );
        props.setToDate(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Month).toDate
        );
        props.setShowDatePicker(false);
        break;
      case CalenderFilterEnum.This_Quarter:
        props.setFromDate(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Quarter).fromDate
        );
        props.setToDate(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Quarter).toDate
        );
        props.setShowDatePicker(false);
        break;
      case CalenderFilterEnum.Last_Quarter:
        props.setFromDate(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Quarter).fromDate
        );
        props.setToDate(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Quarter).toDate
        );
        props.setShowDatePicker(false);
        break;
      case CalenderFilterEnum.This_6_Months:
        props.setFromDate(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_6_Months).fromDate
        );
        props.setToDate(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_6_Months).toDate
        );
        props.setShowDatePicker(false);
        break;
      case CalenderFilterEnum.Last_6_Months:
        props.setFromDate(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_6_Months).fromDate
        );
        props.setToDate(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_6_Months).toDate
        );
        props.setShowDatePicker(false);
        break;
      case CalenderFilterEnum.This_Year:
        props.setFromDate(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Year).fromDate
        );
        props.setToDate(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Year).toDate
        );
        props.setShowDatePicker(false);
        break;
      case CalenderFilterEnum.Last_Year:
        props.setFromDate(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Year).fromDate
        );
        props.setToDate(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Year).toDate
        );
        props.setShowDatePicker(true);
        break;
      case CalenderFilterEnum.Custom_Date_Range:
        props.setFromDate(
          GetCustomDate(dateFormat, CalenderFilterEnum.Custom_Date_Range)
            .fromDate
        );
        props.setToDate(
          GetCustomDate(dateFormat, CalenderFilterEnum.Custom_Date_Range).toDate
        );
        props.setShowDatePicker(true);
        // Handle custom date range selection, if needed
        break;
      default:
        // Handle default case
        break;
    }
  };
  const handleChangeTemplateType = (selectedOption) => {
    props.setSelectedTemplateType(selectedOption.value);
  };
  const handleChangeTemplateForReminderType = (selectedOption) => {
    props.setTemplateType(selectedOption.value);
  };
  const handleSelectChange = (selectedOption) => {
    props.setBusinessTypeID(selectedOption?.value);
  };
  const handleChangeEmailAddress = (selectedOption) => {
    props.setEmailAddressType(selectedOption?.value);
    GetTriggerPointTypeData(selectedOption.value, selectedOption.emailAddressIDType)
  };
  const handleChangeTriggerPoint = (selectedOption) => {
    props.setTriggerPointType(selectedOption?.value);
  };
  const handleChangeDocumentStatus = (selectedOption) => {
    props.setDocumentStatus(selectedOption?.value);
  };
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

  const GetOrganisationBusinessTypeLookupListData = async () => {
    try {
      const data = await GetBusinessTypeLookupList();

      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          let BusinessTypeListData = data?.data?.responseData?.data;
          BusinessTypeListData = BusinessTypeListData.map((BusinessType) => ({
            value: BusinessType.businessTypeID,
            label: BusinessType.businessTypeName,
          }));

          setOrganisationBusinessTypeLookupList(BusinessTypeListData.slice(1, 5));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  //Nature of business LookupList
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
          setNatureOfBusinessTypeLookupList(NoBTypeListData);
        }
      }
    } catch (error) { }
  };
  const GetTemplateTypeLookupListData = () => {
    const proposalName = "Proposal";
    const EngagementName = "Engagement";

    let templateTypeListsData = [
      { templateTypeID: 1, templateTypeName: proposalName },
      { templateTypeID: 2, templateTypeName: EngagementName },
    ];

    const transformedData = templateTypeListsData.map((templateType) => ({
      value: templateType.templateTypeID,
      label: templateType.templateTypeName,
    }));

    setTemplateTypeLookupList(transformedData);
  };
  //2) TemplateType Lookup List Api
  const GetTemplateTypeLookupListForReminderData = async () => {
    try {
      const data = await GetTemplateTypeList(props.ModuleName === "Workflow Email Template" ? 5 : 6);
      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          let TemplateTypeListData = data?.data?.responseData?.data;
          TemplateTypeListData = TemplateTypeListData.map((templateType) => ({
            value: templateType.templateTypeID,
            label: templateType.templateTypeName?.replace(/contract/gi, EngagementName)?.replace(/quote/gi, proposalName),
          }));
          setTemplateTypeLookupForReminderList(TemplateTypeListData);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const GetEmailAddressTypeData = async () => {
    setLoader(true)
    setLoader(true)
    try {
      const data = await GetEmailAddressTypeLookupList(props.ModuleName === "Reminder" ? 1 : 4);
      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          setLoader(false)
          let emailAddressTypeData = data?.data?.responseData.data;
          emailAddressTypeData = emailAddressTypeData.map((emailAddressType) => ({
            value: emailAddressType.emailAddressID,
            label: emailAddressType.emailAddressName?.replace(/prospects/gi, prospectName),
            emailAddressIDType: emailAddressType.emailAddressIDType
          }));
          setEmailAddressTypeLookupList(emailAddressTypeData);
        }
      }
    } catch (error) {
      setLoader(false)
      console.log(error);
    }
  };
  const GetTriggerPointTypeData = async (emailAddressID, emailAddressIDType) => {
    setLoader(true)
    try {
      const data = await GetTriggerPointTypeLookupList(props.ModuleName === "Reminder" ? 1 : 4, emailAddressID, emailAddressIDType);
      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          setLoader(false)
          let triggerPointTypeData = data?.data?.responseData?.data;

          triggerPointTypeData = triggerPointTypeData
            .map((triggerPoint) => {
              let label = triggerPoint.triggerPointName;

              // Replace "Contract" with "EL" in the label
              if (label.includes("Contract")) {
                label = label.replace("Contract", EngagementName);
              }

              // Replace "Quote" with "Proposal" in the label
              if (label.includes("Quote")) {
                label = label.replace("Quote", proposalName);
              }

              return {
                value: triggerPoint.triggerPointID,
                label: label,
              };
            })
            .filter(Boolean); // Filters out any false values (e.g., null, undefined, etc.)

          setTriggerPointTypeLookupList(triggerPointTypeData);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const GetDocumentStatusTypeData = async () => {
    setLoader(true)
    try {
      const data = await GetDocumentStatusTypeLookUpList();
      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          setLoader(false)
          let documentStatusTypeData = data?.data?.responseData?.data;

          documentStatusTypeData = documentStatusTypeData.map((documentStatus) => {
            let label = documentStatus.documentStatusName;

            // Replace "Contract" with the value of EngagementName in the label
            if (label.includes("Contract")) {
              label = label.replace("Contract", EngagementName);
            }

            // Replace "Quote" with the value of proposalName in the label
            if (label.includes("Quote")) {
              label = label.replace("Quote", proposalName);
            }

            return {
              value: documentStatus.documentStatusID,
              label: label,
            };
          });

          setDocumentStatusTypeLookupList(documentStatusTypeData);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const orgBusinessTypeFilter = OrganisationBusinessTypeLookupList?.filter(
    (businessType) => businessType.value == props.businessTypeID
  );

  const templateTypeFilter = TemplateTypeLookupForReminderList?.filter(
    (template) => template.value == props.TemplateType
  );

  const { ModuleName, status } = props;
  const modifiedProposalStatus = ModuleName === EngagementName
    ? Utils.EngagementLetterStatus
    : Utils.ProposalStatus;

  const selectedOption = modifiedProposalStatus.find(
    (statusOption) => statusOption.value === status
  );


  const selectedTemplateValue = TemplateTypeLookupList.find(
    (statusOption) => statusOption.value === props.selectedTemplateType
  );
  const selectedEmailAddressValue = EmailAddressTypeLookupList.find(
    (statusOption) => statusOption.value === props.EmailAddressType
  );
  const selectedTriggerPointValue = TriggerPointTypeLookupList.find(
    (statusOption) => statusOption.value === props.TriggerPointType
  );
  const selectedDocumentStatusValue = DocumentStatusTypeLookupList.find(
    (statusOption) => statusOption.value === props.DocumentStatus
  );
  const ClearFilter = () => {
    // setSelectedTemplate(null);
    if (
      props.ModuleName === EngagementName ||
      props.ModuleName === proposalName
    ) {
      props.setStatus("");
      props.setBusinessNatureID(null);
      props.setProspectType(null);
      props.setSelectedOption(null);
      props.setShowDatePicker(false);
      props.setFromDate(null);
      props.setToDate(null);
    } else if (props.ModuleName === "Template") {
      props.setBusinessTypeID(null)
      props.setSelectedTemplateType(null)
      props.setProspectType(null)
    } else if (props.ModuleName === prospectName) {
      props.setBusinessNatureID(null);
      props.setProspectType(null);
    } else if (props.ModuleName === "Reminder" || props.ModuleName === "Other Reminder") {
      props.setEmailAddressType(null);
      props.setTriggerPointType(null);
      props.setDocumentStatus(null);
    } else if (props.ModuleName === "Workflow Email Template" || props.ModuleName === "Super Admin Workflow Email Template") {
      props.setTemplateType(null);
    }
  };

  /* ---------------------- Design Part Start From Here. ---------------------- */
  return (
    <div>
      <div
        class={props.class}
        id={props.id}
        ref={modalRef}
        tabIndex={props.tabIndex}
        aria-labelledby={props.aria_labelledby}
        aria-hidden={props.aria_hidden}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div class="modal-dialog modal-md modal-dialog-centered">
          <div class="modal-content">
            {/*Heading Start */}
            <div class="modal-header bg-light p-3">
              <h5 class="modal-title" id="exampleModalLabel">
                {moduleName}
              </h5>
              {/* Close Button Start */}
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"

                id="close-modal"
              >
                {/* Close Button End */}
              </button>
            </div>
            {/*Heading End */}
            {/*Modal body Start */}
            <div
              class="modal-body"
              style={{ height: "50vh", overflow: "auto" }}
            >
              <>
                <div
                  class="accordion accordion-flush accessModel"
                  id="accordionFlushExample"
                >
                  <div class="accordion-item ">
                    {(props.ModuleName === EngagementName ||
                      props.ModuleName === prospectName ||
                      props.ModuleName == "Service" ||
                      props.ModuleName === proposalName ||
                      props.ModuleName === "Package") && (
                        <>
                          {(props.ModuleName === EngagementName ||
                            props.ModuleName === proposalName) && (
                              <>
                                <div class="col-12 mb-1">
                                  <label className="fieldset-label">
                                    {props.ModuleName} Status
                                  </label>
                                </div>
                                <div className="col-lg-12  mb-2 ">
                                  <div className="input-group">
                                    <Select
                                      className="phone-input-country-code selectDropDown Drop-down-width"
                                      options={props.ModuleName === EngagementName ? Utils.EngagementLetterStatus : Utils.ProposalStatus}
                                      value={selectedOption || null}
                                      onChange={handleStatus}
                                    />
                                  </div>
                                </div>
                                <div class="col-12 mb-1">
                                  <label className="fieldset-label">
                                    Date Filter
                                  </label>
                                </div>
                                <div className="col-lg-12  mb-2">
                                  <div className="input-group">
                                    <Select
                                      className="user-role-select "
                                      options={Utils.CalenderFilter}
                                      value={props.selectedOption}
                                      onChange={handleCalenderFilterChange}
                                    />
                                  </div>
                                </div>
                                {props.showDatePicker && (
                                  <div className="row mb-2">
                                    <div class="col-12 mb-1">
                                      <label>Custom Range</label>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6 ">
                                      <DatePicker
                                        format="dd/MM/y"
                                        dayPlaceholder="dd"
                                        monthPlaceholder="mm"
                                        yearPlaceholder="yyyy"
                                        className="engagementCalender"
                                        label="From Date"
                                        value={
                                          props.fromDate
                                            ? dayjs(props.fromDate)
                                            : null
                                        }
                                        maxDate={dayjs().toDate()}
                                        onChange={handleFromDateChange}
                                        renderInput={(params) => (
                                          <input {...params.inputProps} />
                                        )}
                                        popperPlacement="bottom-start"
                                      />
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                      <DatePicker
                                        format="dd/MM/y"
                                        dayPlaceholder="dd"
                                        monthPlaceholder="mm"
                                        yearPlaceholder="yyyy"
                                        label="To Date"
                                        className="engagementCalender"
                                        value={
                                          props.toDate ? dayjs(props.toDate) : null
                                        }
                                        minDate={
                                          props.fromDate
                                            ? dayjs(props.fromDate).toDate()
                                            : null
                                        }
                                        maxDate={dayjs().toDate()} // Set maxDate to today
                                        onChange={handleToDateChange}
                                        renderInput={(params) => (
                                          <input {...params.inputProps} />
                                        )}
                                        popperPlacement="bottom-start"
                                      />
                                    </div>
                                  </div>
                                )}
                              </>
                            )}

                          <div class="col-12 mb-1">
                            <label className="fieldset-label">
                              Nature Of Business
                            </label>
                          </div>
                          <div className="col-lg-12  mb-2 ">
                            <div className="input-group">
                              <Select
                                className="phone-input-country-code selectDropDown Drop-down-width"
                                options={NatureOfBusinessTypeLookupList}
                                // value={status}
                                value={
                                  NatureOfBusinessTypeLookupList.find(
                                    (item) => item.value == props.businessNatureID
                                  ) || null
                                }
                                onChange={handleChangeNOBType}
                              />
                            </div>
                          </div>


                          <div class="col-12 mb-1">
                            <label className="fieldset-label">
                              {prospectName} Type
                            </label>
                          </div>
                          <div className="col-lg-12  mb-2 ">
                            <div className="input-group">
                              <Select
                                className="phone-input-country-code selectDropDown Drop-down-width"
                                options={BusinessTypeLookupList}
                                value={
                                  BusinessTypeLookupList.find(
                                    (item) => item.value == props.prospectType
                                  ) || null
                                }
                                onChange={handleChangeBusinessTypeID}
                              />
                            </div>
                          </div>

                        </>
                      )}
                    {(props.ModuleName === "Template" && <>
                      <div class="col-12 mb-1">
                        <label className="fieldset-label">
                          Template  Type
                        </label>
                      </div>
                      <div className="col-lg-12  mb-2 ">
                        <div className="input-group">
                          <Select
                            className="user-role-select"
                            options={TemplateTypeLookupList}
                            value={selectedTemplateValue || null}
                            onChange={handleChangeTemplateType}
                          />
                        </div>
                      </div>

                      <div class="col-12 mb-1">
                        <label className="fieldset-label">
                          {prospectName} Type
                        </label>
                      </div>
                      <div className="col-lg-12  mb-2 ">
                        <div className="input-group">
                          <Select
                            className="phone-input-country-code selectDropDown Drop-down-width"
                            options={BusinessTypeLookupList}
                            value={
                              BusinessTypeLookupList.find(
                                (item) => item.value == props.prospectType
                              ) || null
                            }
                            onChange={handleChangeBusinessTypeID}
                          />
                        </div>
                      </div>

                      {showProfessionType && (
                        <>
                          <div class="col-12 mb-1">
                            <label className="fieldset-label">

                              Business Type
                            </label>
                          </div>
                          <div className="col-lg-12  mb-2 ">
                            <div className="input-group">
                              <Select
                                className="user-role-select"
                                options={OrganisationBusinessTypeLookupList}
                                value={orgBusinessTypeFilter}
                                onChange={handleSelectChange}

                              />
                            </div>
                          </div>
                        </>)}
                    </>)}
                    {((props.ModuleName === "Reminder" || props.ModuleName === "Other Reminder") && <>
                      <div class="col-12 mb-1">
                        <label className="fieldset-label">
                          Email Address
                        </label>
                      </div>
                      <div className="col-lg-12  mb-2 ">
                        <div className="input-group">
                          <Select
                            className="user-role-select"
                            options={EmailAddressTypeLookupList}
                            value={selectedEmailAddressValue || null}
                            onChange={handleChangeEmailAddress}
                          />
                        </div>
                      </div>

                      <div class="col-12 mb-1">
                        <label className="fieldset-label">
                          Trigger Point
                        </label>
                      </div>
                      <div className="col-lg-12  mb-2 ">
                        <div className="input-group">
                          <Select
                            className="user-role-select"
                            options={TriggerPointTypeLookupList}
                            value={selectedTriggerPointValue || null}
                            onChange={handleChangeTriggerPoint}
                          />
                        </div>
                      </div>
                      {props.DocumentStatus !== undefined &&
                        <>
                          <div class="col-12 mb-1">
                            <label className="fieldset-label">
                              Document Status
                            </label>
                          </div>
                          <div className="col-lg-12  mb-2 ">
                            <div className="input-group">
                              <Select
                                className="user-role-select"
                                options={DocumentStatusTypeLookupList}
                                value={selectedDocumentStatusValue || null}
                                onChange={handleChangeDocumentStatus}
                              />
                            </div>
                          </div>
                        </>
                      }
                    </>
                    )}
                    {(props.ModuleName === "Workflow Email Template" || props.ModuleName === "Super Admin Workflow Email Template") &&
                      <>
                        <div class="col-12 mb-1">
                          <label className="fieldset-label">
                            Template Type
                          </label>
                        </div>
                        <div className="col-lg-12  mb-2 ">
                          <div className="input-group">
                            <Select
                              className="user-role-select"
                              options={TemplateTypeLookupForReminderList}
                              value={templateTypeFilter}
                              onChange={(e) => {
                                handleChangeTemplateForReminderType(e);
                              }}
                            />
                          </div>
                        </div>
                      </>
                    }


                  </div>
                </div>
              </>
            </div>
            {/*Modal body End */}
            {/*Footer body button Start */}
            <div class="modal-footer">
              <div class="hstack gap-2 justify-content-end">
                <button
                  type="button"
                  class="btn btn-md btn-light"
                  onClick={() => ClearFilter()}
                >
                  <span>{"Clear Filter"}</span>
                </button>
                <button
                  type="button"
                  class="btn btn-md btn-light"
                  data-bs-dismiss="modal"

                >
                  <span>{getCrudButtonTextName("Cancel")}</span>
                </button>
                <button
                  type="submit"
                  class="btn btn-md btn-success create-item-btn"
                  data-bs-dismiss="modal"
                  onClick={() => props.ApplyFilter()}
                >
                  <span>{getCrudButtonTextName("Apply", moduleName)}</span>
                </button>
              </div>
            </div>
            {/*Footer body button End */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Filter;
