/* global $ */
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ConfirmModel from "../../../../components/ConfirmationBox";
import { AppSettingType, EmailTemplates } from "../../../../Middleware/enums";
import {
  GetLoginToOutbookUnpaidList,
  GetLoginToOutbookpaidList,
} from "../../../../redux/Services/Setting/LoginToOutbooksReminder";
import {
  ReminderDelete,
  ReminderChangeStatus,
  ChangeStatusForPaidUsersLoginToOutbooksWarningMail,
  ChangeStatusForUnpaidUsersLoginToOutbooksWarningMail,
  GetApplicationSettingList,
} from "../../../../redux/Services/Config/ReminderCrudApi";

import Android12Switch from "../../../../components/AndroidSwitch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { AuthContextProvider } from "../../../../AuthContext/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import NoResultFoundModel from "../../../../components/NoResultFoundModel";
import SuccessModal from "../../../../components/SuccessModal";
import ErrorModel from "../../../../components/ErrorModel";

import Footer from "../../../../components/Footer";
import { updateState } from "../../../../redux/Persist";

function AccountDeletionReminder() {
  const moduleName = "Reminder";
  let getEmailTemplatesListApiCallCount = 0;
  //A]Declare state
  const common = useSelector((state) => state.Storage); //Getting Logged Users Details From Persist Storage of redux hooks
  const navigate = useNavigate();
  const {
    setLoader,
    setTopbar,
    maxCountToRecallApi,
    isMobile,
    setListCount,
    desktopRecords,
    isMobileRecords,
    getCrudButtonToolTipName,
    userAccessData,
  } = useContext(AuthContextProvider);
  const [EmailTemplateList, setEmailTemplateList] = useState([]);
  const [ReminderTemplateList, setReminderTemplateList] = useState([]);
  const [applicationStatusLookupList, setApplicationStatusLookupList] = useState([]);
  const [totalUnpaidRecords, setTotalUnpaidRecords] = useState(-1);
  const [totalRecords, setTotalRecords] = useState(-1);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
  const [currentPage, setCurrentPage] = useState(
    common.currentPage === "" ? 1 : common.currentPage
  );
  const [searchKeyword, setSearchKeyword] = useState("");
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [modelRequestData, setModelRequestData] = useState({
    lessDay: null,
    greaterDay: null,
    professionTypeNames: null,
    BusinessTypeName: null,
    reminderKeyID: null,
    keyID: null,
    templateName: null,
    status: null,
    isDefault: null,
    StatusType: null,
    Action: "",
    userKeyID: null,
    emailTemplateType: null,
    listType: null,
  });
  const dispatch = useDispatch();
  const pageSize = isMobile ? isMobileRecords : desktopRecords;
  const isCurrentPage =
    common.currentPage === "" ? currentPage : common.currentPage;
  // B] Initial useEffect :
  // 1) Will Call Initial Api Like List Api
  useEffect(() => {
    setTopbar("block");
    GetEmailTemplatesListData(isCurrentPage);
    GetReminderTemplatesListData(isCurrentPage);
    GetApplicationSettingListData()
    dispatch(
      updateState({
        currentPage: "",
      })
    );
  }, []);

  //2) This useEffect will trigger when we successfully add or update record from popup model
  useEffect(() => {
    if (isAddUpdateActionDone) {
      if (modelRequestData.Action === null) {
        setSearchKeyword("");
        setCurrentPage(1);
        GetEmailTemplatesListData(isCurrentPage, null, null);
        GetReminderTemplatesListData(isCurrentPage, null, null);
      } else {
        GetEmailTemplatesListData(isCurrentPage);
        GetReminderTemplatesListData(isCurrentPage);
      }
      setIsAddUpdateActionDone(false);
    }
  }, [isAddUpdateActionDone]);

  useEffect(() => {
    if (
      modelRequestData.reminderKeyID !== null &&
      modelRequestData.Action === "Update"
    ) {
      setTopbar("none");
      navigate("/update-paid-unpaid-account", { state: modelRequestData });
    }
  }, [modelRequestData.reminderKeyID]);

  // C] Calling All Api's like List and other Here :
  // 1) Get EmailTemplatesList Data
  const GetEmailTemplatesListData = async (
    i,
    searchKeywordValue,
    sortValue,
    TemplateSort
  ) => {
    setLoader(true);
    const pageNoList = i - 1;
    try {
      const data = await GetLoginToOutbookUnpaidList({
        UserKeyID: common.userKeyID,
        pageSize: pageSize,
        pageNo: pageNoList,
        organisationID: common.organisationID,
        organisationKeyID: common.organisationKeyID,
        searchKeyword:
          searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        primarySortDirection: "desc",
        primarySortColumnName: "EmailAddressName"

      });
      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          getEmailTemplatesListApiCallCount = 0;
          if (data?.data?.responseData?.data) {
            const totalCount = data.data.totalCount;
            const TemplateListData = data.data.responseData.data;
            if (pageNoList > 0 && TemplateListData.length === 0) {
              let newPaneNo = Number(pageNoList);
              if (newPaneNo > 1) {
                newPaneNo = newPaneNo - 1;
              }
              GetEmailTemplatesListData(
                newPaneNo,
                searchKeywordValue,
                sortValue,
                TemplateSort
              );
              setCurrentPage(pageNoList);
              return;
            }

            setListCount(totalCount);
            setTotalUnpaidRecords(totalCount);
            setEmailTemplateList(TemplateListData);
          }
        } else {
          if (getEmailTemplatesListApiCallCount < maxCountToRecallApi) {
            getEmailTemplatesListApiCallCount += 1;
            setTimeout(function () {
              GetEmailTemplatesListData(
                i,
                searchKeywordValue,
                sortValue,
                TemplateSort
              );
            }, 2000);
          } else {
            setLoader(false);
          }

          setErrorMessage(data?.data?.errorMessage);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const GetReminderTemplatesListData = async (
    i,
    searchKeywordValue,
    sortValue,
    TemplateSort
  ) => {
    setLoader(true);
    const pageNoList = i - 1;
    try {
      const data = await GetLoginToOutbookpaidList({
        UserKeyID: common.userKeyID,
        pageSize: pageSize,
        pageNo: pageNoList,
        organisationID: common.organisationID,
        organisationKeyID: common.organisationKeyID,
        primarySortDirection: "asc",
        searchKeyword:
          searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,

      });
      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          getEmailTemplatesListApiCallCount = 0;
          if (data?.data?.responseData?.data) {
            const totalCount = data.data.totalCount;
            const TemplateListData = data.data.responseData.data;
            if (pageNoList > 0 && TemplateListData.length === 0) {
              let newPaneNo = Number(pageNoList);
              if (newPaneNo > 1) {
                newPaneNo = newPaneNo - 1;
              }
              GetEmailTemplatesListData(
                newPaneNo,
                searchKeywordValue,
                sortValue,
                TemplateSort
              );
              setCurrentPage(pageNoList);
              return;
            }

            setListCount(totalCount);
            setTotalRecords(totalCount);
            setReminderTemplateList(TemplateListData);

          }
        } else {
          if (getEmailTemplatesListApiCallCount < maxCountToRecallApi) {
            getEmailTemplatesListApiCallCount += 1;
            setTimeout(function () {
              GetEmailTemplatesListData(
                i,
                searchKeywordValue,
                sortValue,
                TemplateSort
              );
            }, 2000);
          } else {
            setLoader(false);
          }

          setErrorMessage(data?.data?.errorMessage);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Email Template Change status and delete function
  const EmailTemplatesChangeStatusDataAndDeleteData = async () => {
    setLoader(true);
    if (modelRequestData.Action === "PaidUser") {
      if (modelRequestData.StatusType === null) {
        try {
          const Data = await ChangeStatusForPaidUsersLoginToOutbooksWarningMail(
            common.userKeyID
          );
          if (Data) {
            setLoader(false);

            if (Data?.data?.statusCode === 200) {
              $("#" + "ConfirmModel").modal("hide");
              GetApplicationSettingListData()
              setOpenSuccessModal(true);

            } else {
              setErrorMessage(Data?.response?.data?.errorMessage);
              setOpenErrorModal(true);
            }
            GetApplicationSettingListData()
          }
        } catch (error) {
          console.log(error);
        }
      }
    } else if (modelRequestData.Action === "UnpaidUser") {
      if (modelRequestData.StatusType === null) {
        try {
          const Data = await ChangeStatusForUnpaidUsersLoginToOutbooksWarningMail(
            common.userKeyID
          );
          if (Data) {
            setLoader(false);

            if (Data?.data?.statusCode === 200) {
              $("#" + "ConfirmModel").modal("hide");
              GetApplicationSettingListData()
              setOpenSuccessModal(true);

            } else {
              setErrorMessage(Data?.response?.data?.errorMessage);
              setOpenErrorModal(true);
            }
            GetApplicationSettingListData()
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  // 2) On Click Template Edit Button
  const TemplateEditBtnClicked = (Template, listType, index) => {
    const emailTemplateType = EmailTemplates[Template.type]; // Assuming Template.type corresponds to the keys in EmailTemplates

    let templateTypeID = null;
    let greaterDay = null
    let lessDay = null
    if (listType === "Unpaid") {
      if (Template.reminderNameType === "Login_To_Outbooks_Warning_Email_First_Unpaid_User") {
        templateTypeID = EmailTemplates.UnpaidUser_FirstMail;
        templateTypeID = EmailTemplates.UnpaidUser_FirstMail;
        // greaterDay = EmailTemplateList[index + 1].days
        greaterDay = EmailTemplateList.find(item => item.reminderNameType === "Login_To_Outbooks_Warning_Email_Second_Unpaid_User").days
        lessDay = null
      } else if (Template.reminderNameType === "Login_To_Outbooks_Warning_Email_Second_Unpaid_User") {
        templateTypeID = EmailTemplates.UnpaidUser_SecondMail;
        greaterDay = EmailTemplateList.find(item => item.reminderNameType === "Login_To_Outbooks_Warning_Email_Third_Unpaid_User").days
        lessDay = EmailTemplateList.find(item => item.reminderNameType === "Login_To_Outbooks_Warning_Email_First_Unpaid_User").days
      } else if (Template.reminderNameType === "Login_To_Outbooks_Warning_Email_Third_Unpaid_User") {
        templateTypeID = EmailTemplates.UnpaidUser_ThirdMail;
        greaterDay = EmailTemplateList.find(item => item.reminderNameType === "Account_Deletion_Email_Unpaid_User").days
        lessDay = EmailTemplateList.find(item => item.reminderNameType === "Login_To_Outbooks_Warning_Email_Second_Unpaid_User").days
      } else if (Template.reminderNameType === "Account_Deletion_Email_Unpaid_User") {
        templateTypeID = EmailTemplates.UnpaidUser_DeletionMail;
        greaterDay = null
        lessDay = EmailTemplateList.find(item => item.reminderNameType === "Login_To_Outbooks_Warning_Email_Third_Unpaid_User").days
      }
    } else if (listType === "Paid") {
      if (Template.reminderNameType === "Login_To_Outbooks_Warning_Email_First_Paid_User") {
        templateTypeID = EmailTemplates.PaidUser_FirstMail;
        greaterDay = ReminderTemplateList.find(item => item.reminderNameType === "Login_To_Outbooks_Warning_Email_Second_Paid_User").days
        lessDay = null
      } else if (Template.reminderNameType === "Login_To_Outbooks_Warning_Email_Second_Paid_User") {
        templateTypeID = EmailTemplates.PaidUser_SecondMail;
        greaterDay = ReminderTemplateList.find(item => item.reminderNameType === "Login_To_Outbooks_Warning_Email_Third_Paid_User").days
        lessDay = ReminderTemplateList.find(item => item.reminderNameType === "Login_To_Outbooks_Warning_Email_First_Paid_User").days
      } else if (Template.reminderNameType === "Login_To_Outbooks_Warning_Email_Third_Paid_User") {
        templateTypeID = EmailTemplates.PaidUser_ThirdMail;
        greaterDay = null
        lessDay = ReminderTemplateList.find(item => item.reminderNameType === "Login_To_Outbooks_Warning_Email_Second_Paid_User").days
      }
    }

    dispatch(
      updateState({
        currentPage: currentPage,
      })
    );

    setModelRequestData({
      ...modelRequestData,
      Action: "Update",
      lessDay: lessDay,
      greaterDay: greaterDay,
      reminderKeyID: Template.reminderKeyID,
      emailTemplateType: emailTemplateType,
      templateTypeID: templateTypeID,
      reminderTypeID: listType === "Paid" ? 3 : 2,
      listType: listType,
    });
  };

  const GetApplicationSettingListData = async () => {
    try {
      const data = await GetApplicationSettingList(common.userKeyID)
      if (data?.data?.statusCode === 200) {
        setApplicationStatusLookupList(data.data.responseData.data)
      }
    } catch (error) {

    }
  }
  const handleClose = () => {
    $("#" + "ConfirmModel").modal("hide");
    setOpenSuccessModal(false);
    setOpenErrorModal(false);
  };
  const UnpaidUserStatus = applicationStatusLookupList.find(item => item.appSettingType === AppSettingType.UnpaidUser)?.isEnabled
  const PaidUserStatus = applicationStatusLookupList.find(item => item.appSettingType === AppSettingType.paidUser)?.isEnabled

  return (
    <>
      <div className="container">
        <div class="main-content">
          <div class="services page-background">
            <div class="page-info-header page-info-strip">
              <div class="container">
                <div className="row">
                  <div className="col-md-6 col-6">
                    <div class="page-title-cls">Account Login/Deletion</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div class="row">
                <div class="col-lg-12">
                  <div class="card">
                    {/* end card header  */}

                    <div class="card-body">
                      <div id="customerList">
                        <div class="row g-4 mb-3"></div>
                        <div class="table-responsive table-card  table-padding">

                          <div className="row">
                            <div className="col-md-4 col-4">
                              <div class="page-title-cls">Unpaid User</div>
                            </div>
                            <div class="col-md-8 col-8">
                              <div className="d-flex gap-2 justify-content-sm-end">
                                <Tooltip title={`InActive/Active`}>
                                  <div
                                    className="d-flex gap-2 justify-content-sm-end add-new-btn"
                                    style={{ marginRight: "10px" }}
                                  >
                                    <span style={{ marginBottom: "5px" }}>
                                      {UnpaidUserStatus === 1 ? "Active" : "InActive"}
                                    </span>{" "}
                                    <FormGroup>
                                      <FormControlLabel
                                        control={
                                          <Android12Switch
                                            checked={UnpaidUserStatus === 1}
                                            onClick={() =>
                                              setModelRequestData({
                                                ...modelRequestData,
                                                status: UnpaidUserStatus === 1
                                                  ? "Active"
                                                  : "InActive",
                                                Action: "UnpaidUser",
                                              })
                                            }
                                            data-bs-toggle="modal"
                                            data-bs-target="#ConfirmModel"
                                          />
                                        }
                                      />
                                    </FormGroup>
                                  </div>
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                          <table
                            class="table align-middle table-nowrap"
                            id="customerTable"
                          >
                            <thead class="table-light">
                              <tr className="head-row table-header-font">
                                <td className="tr-table-class text-white">
                                  Reminder Name
                                </td>
                                <td className="tr-table-class text-white">
                                  Email Template
                                </td>
                                <td className="tr-table-class text-white">
                                  Days
                                </td>
                                <td className="tr-table-class text-white">
                                  Sequence
                                </td>
                                <td className="tr-table-class text-white">
                                  Status
                                </td>
                                <td className="tr-table-class text-white">
                                  {((userAccessData.Admin_Config_Email_Template_CanEdit &&
                                    common.organisationKeyID !== null) ||
                                    (userAccessData.SuperAdmin_Config_Email_Template_CanAdd &&
                                      common.organisationKeyID === null)) && (
                                      <>Action</>
                                    )}
                                </td>
                              </tr>
                            </thead>
                            <tbody className="list form-check-all">
                              {EmailTemplateList.slice(
                                0,
                                isMobile ? isMobileRecords : desktopRecords
                              ).map((Template, index) => {
                                return (
                                  <tr
                                    className="table_new table-content-font"
                                    key={Template.keyID}
                                  >
                                    <td className="table-content-font">
                                      {Template.reminderName}
                                    </td>
                                    <td className="table-content-font">
                                      {Template.templateName}
                                    </td>
                                    <td className="table-content-font">
                                      {Template.days}
                                    </td>
                                    <td className="table-content-font">
                                      {Template.sequenceName}
                                    </td>

                                    <td className="Switch table-content-font">
                                      <div
                                        style={{ alignItems: "center" }}
                                        className="d-flex gap-2"
                                      >
                                        <div style={{ width: "40px" }}>
                                          {Template.statusName}
                                        </div>
                                      </div>
                                    </td>

                                    <td className="table-content-font">
                                      <div className="d-flex gap-2">
                                        {((userAccessData.Admin_Config_Email_Template_CanEdit &&
                                          common.organisationKeyID !== null) ||
                                          (userAccessData.SuperAdmin_Config_Email_Template_CanEdit &&
                                            common.organisationKeyID ===
                                            null)) && (
                                            <Tooltip
                                              title={getCrudButtonToolTipName(
                                                "Update",
                                                moduleName
                                              )}
                                            >
                                              <div className="edit">
                                                <button
                                                  onClick={() =>
                                                    TemplateEditBtnClicked(
                                                      Template,
                                                      "Unpaid",
                                                      index
                                                    )
                                                  }
                                                  className="btn btn-sm btn-success edit-item-btn actionButtonsStyle"
                                                >
                                                  <i className="ri-pencil-fill"></i>
                                                </button>
                                              </div>
                                            </Tooltip>
                                          )}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                          {totalUnpaidRecords <= 0 && (
                            <NoResultFoundModel
                              name={moduleName}
                              totalRecords={totalUnpaidRecords}
                            />
                          )}
                          <div class="mt-3">
                            <div className="row">
                              <div className="col-md-4 col-4">
                                <div class="page-title-cls">Paid User</div>
                              </div>
                              <div class="col-md-8 col-8">
                                <div className="d-flex gap-2 justify-content-sm-end">
                                  <Tooltip title={`InActive/Active`}>
                                    <div
                                      className="d-flex gap-2 justify-content-sm-end add-new-btn"
                                      style={{ marginRight: "10px" }}
                                    >
                                      <span style={{ marginBottom: "5px" }}>
                                        {PaidUserStatus === 1 ? "Active" : "InActive"}
                                      </span>{" "}
                                      <FormGroup>
                                        <FormControlLabel
                                          control={
                                            <Android12Switch
                                              checked={PaidUserStatus === 1}
                                              onClick={() =>
                                                setModelRequestData({
                                                  ...modelRequestData,
                                                  status: PaidUserStatus === 1
                                                    ? "Active"
                                                    : "InActive",
                                                  Action: "PaidUser",
                                                })
                                              }
                                              data-bs-toggle="modal"
                                              data-bs-target="#ConfirmModel"
                                            />
                                          }
                                        />
                                      </FormGroup>
                                    </div>
                                  </Tooltip>
                                </div>
                              </div>
                            </div>
                            <table
                              class="table align-middle table-nowrap"
                              id="customerTable"
                            >
                              <thead class="table-light">
                                <tr className="head-row table-header-font">
                                  <td className="tr-table-class text-white">
                                    Reminder Name
                                  </td>
                                  <td className="tr-table-class text-white">
                                    Email Template
                                  </td>

                                  <td className="tr-table-class text-white">
                                    Days
                                  </td>
                                  <td className="tr-table-class text-white">
                                    Sequence
                                  </td>

                                  <td className="tr-table-class text-white">
                                    Status
                                  </td>
                                  <td className="tr-table-class text-white">
                                    {((userAccessData.Admin_Config_Email_Template_CanEdit &&
                                      common.organisationKeyID !== null) ||
                                      (userAccessData.SuperAdmin_Config_Email_Template_CanAdd &&
                                        common.organisationKeyID === null)) && (
                                        <>Action</>
                                      )}
                                  </td>
                                </tr>
                              </thead>
                              <tbody className="list form-check-all">
                                {ReminderTemplateList.map((Template, index) => {
                                  return (
                                    <tr
                                      className="table_new table-content-font"
                                      key={Template.keyID}
                                    >
                                      <td className="table-content-font">
                                        {Template.reminderName}
                                      </td>
                                      <td className="table-content-font">
                                        {Template.templateName}
                                      </td>
                                      <td className="table-content-font">
                                        {Template.days}
                                      </td>
                                      <td className="table-content-font">
                                        {Template.sequenceName}
                                      </td>

                                      <td className="Switch table-content-font">
                                        <div
                                          style={{ alignItems: "center" }}
                                          className="d-flex gap-2"
                                        >
                                          <div style={{ width: "40px" }}>
                                            {Template.statusName}
                                          </div>

                                        </div>
                                      </td>
                                      <td className="table-content-font">
                                        <div className="d-flex gap-2">
                                          {((userAccessData.Admin_Config_Email_Template_CanEdit &&
                                            common.organisationKeyID !== null) ||
                                            (userAccessData.SuperAdmin_Config_Email_Template_CanEdit &&
                                              common.organisationKeyID ===
                                              null)) && (
                                              <Tooltip
                                                title={getCrudButtonToolTipName(
                                                  "Update",
                                                  moduleName
                                                )}
                                              >
                                                <div className="edit">
                                                  <button
                                                    onClick={() =>
                                                      TemplateEditBtnClicked(
                                                        Template,
                                                        "Paid",
                                                        index
                                                      )
                                                    }
                                                    className="btn btn-sm btn-success edit-item-btn actionButtonsStyle"
                                                  >
                                                    <i className="ri-pencil-fill"></i>
                                                  </button>
                                                </div>
                                              </Tooltip>
                                            )}
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                            {totalRecords <= 0 && (
                              <NoResultFoundModel
                                name={moduleName}
                                totalRecords={totalRecords}
                              />
                            )}
                          </div>

                        </div>
                      </div>
                    </div>

                    {/* end card  */}
                    {/* {listCount > pageSize && (
                    <PaginationComponent
                      totalCount={listCount}
                      totalPages={totalPage}
                      currentPage={currentPage}
                      onPageChange={handlePageChange}
                    />
                  )} */}
                  </div>
                  {/* end col */}
                </div>
                {/* end col  */}
              </div>


              {/* end row */}
            </div>
            {/* container-fluid  */}
          </div>
          {/* End Page-content */}
          <ErrorModel
            ErrorModel={openErrorModal}
            handleClose={handleClose}
            ErrorMessage={errorMessage}
          />
          {/* Confirm Modal  */}
          <ConfirmModel
            openErrorModal={openErrorModal}
            openSuccessModal={openSuccessModal}
            modelRequestData={modelRequestData}
            UpdatedStatus={EmailTemplatesChangeStatusDataAndDeleteData}
          />
          {/* Success Modal  */}
          <SuccessModal
            handleClose={handleClose}
            setOpenSuccessModal={setOpenSuccessModal}
            openSuccessModal={openSuccessModal}
            modelAction={modelRequestData.Action}
            message={"Status has been changed successfully!"}
          />
          <Footer />
        </div>
        {/* end back-to-top */}
      </div>

      <div className="container">
        <div class="main-content">
          <div class="services page-background">
            <div class="page-info-header page-info-strip">
            </div>

            {/* container-fluid  */}
          </div>
          {/* End Page-content */}
          <ErrorModel
            ErrorModel={openErrorModal}
            handleClose={handleClose}
            ErrorMessage={errorMessage}
          />
          {/* Confirm Modal  */}
          <ConfirmModel
            openErrorModal={openErrorModal}
            openSuccessModal={openSuccessModal}
            modelRequestData={modelRequestData}
            UpdatedStatus={EmailTemplatesChangeStatusDataAndDeleteData}
          />
          {/* Success Modal  */}
          <SuccessModal
            handleClose={handleClose}
            setOpenSuccessModal={setOpenSuccessModal}
            openSuccessModal={openSuccessModal}
            modelAction={modelRequestData.Action}
            message={"Status has been changed successfully!"}
          />
          <Footer />
        </div>
        {/* end back-to-top */}
      </div>
    </>
  );
}

export default AccountDeletionReminder;
