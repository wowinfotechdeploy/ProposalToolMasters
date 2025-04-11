/* global $ */
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import CommonButtonComponent from "../../../../components/CommonButtonComponent";
import FilterModel from "../../../../components/FilterModel";
import ConfirmModel from "../../../../components/ConfirmationBox";
import {
  ReminderTemplatesDelete,
  GetReminderTemplatesList,
  ReminderTemplatesChangeStatus,
  GetChangeIsDefaultStatus,
  GetReminderTemplatesModel,
  CopyReminderEmailTemplate,
} from "../../../../redux/Services/Config/ReminderTemplatesApi";
import PaginationComponent from "../../../../components/PaginationModel";
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
import RecordsAvailablePopupModel from "../../../../components/RecordsAvailablePopupModel";

function ReminderTemplateList() {
  const moduleName = "Workflow Email Template";
  let getEmailTemplatesListApiCallCount = 0;
  //A]Declare state
  const common = useSelector((state) => state.Storage); //Getting Logged Users Details From Persist Storage of redux hooks
  const navigate = useNavigate();
  const {
    setLoader,
    setTopbar,
    maxCountToRecallApi,
    totalPage,
    EngagementName,
    proposalName,
    isMobile,
    setListCount,
    listCount,
    desktopRecords,
    isMobileRecords,
    getCrudButtonTextName,
    getPlaceholderTextName,
    getCrudButtonToolTipName,
    userAccessData,
  } = useContext(AuthContextProvider);
  const [EmailTemplateList, setEmailTemplateList] = useState([]);
  const pageSize = isMobile ? isMobileRecords : desktopRecords;
  const [errorMessage, setErrorMessage] = useState("");
  const [totalRecords, setTotalRecords] = useState(-1);
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
  const [currentPage, setCurrentPage] = useState(
    common.currentPage === "" ? 1 : common.currentPage
  );

  const [sortType, setSortType] = useState(null);
  const [primarySortDirection, setPrimarySortDirection] = useState(null);
  const [primarySortDirectionObj, setPrimarySortDirectionObj] = useState({
    templateNameSort: null,
    TemplateTypeSort: null,
    BusinessType: null,
    ProspectBusinessType: null,
    ProfessionType: null,
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [isFilterApply, setIsFilterApply] = useState(false);
  const [TemplateType, setTemplateType] = useState(null);
  const [modelRequestData, setModelRequestData] = useState({
    professionTypeNames: null,
    BusinessTypeName: null,
    TemplateID: null,
    templateKeyID: null,
    templateName: null,
    status: null,
    isDefault: null,
    StatusType: null,
    Action: "",
    userKeyID: null,
  });
  const dispatch = useDispatch();

  const isCurrentPage =
    common.currentPage === "" ? currentPage : common.currentPage;
  const [showProfessionType, setShowProfessionType] = useState(
    common.organisationKeyID === null || common.professionTypeLists.length > 1
  );

  // B] Initial useEffect :
  // 1) Will Call Initial Api Like List Api
  useEffect(() => {
    setTopbar("block");
    GetEmailTemplatesListData(isCurrentPage);
    dispatch(
      updateState({
        currentPage: "",
      })
    );
  }, [pageSize]);

  //2) This useEffect will trigger when we successfully add or update record from popup model
  useEffect(() => {
    if (isAddUpdateActionDone) {
      if (modelRequestData.Action === null) {
        setSearchKeyword("");
        setPrimarySortDirection(null);
        setCurrentPage(1);
        GetEmailTemplatesListData(isCurrentPage, null, null);
      } else {
        GetEmailTemplatesListData(isCurrentPage);
      }
      setIsAddUpdateActionDone(false);
    }
  }, [isAddUpdateActionDone]);

  useEffect(() => {
    if (
      modelRequestData.TemplateID !== null &&
      modelRequestData.templateKeyID !== null &&
      modelRequestData.Action === "Update"
    ) {
      setTopbar("none");
      navigate("/add-reminder-template", { state: modelRequestData });
    } else {
      GetEmailTemplatesListData(isCurrentPage);
    }
  }, [modelRequestData]);

  // C] Calling All Api's like List and other Here :
  // 1) Get EmailTemplatesList Data
  const GetEmailTemplatesListData = async (
    i,
    searchKeywordValue,
    sortValue,
    TemplateSort,
    templateTypeID
  ) => {
    setLoader(true);
    const pageNoList = i - 1;

    try {
      const data = await GetReminderTemplatesList({
        pageSize: pageSize,
        pageNo: pageNoList,
        organisationID: common.organisationID,
        organisationKeyID: common.organisationKeyID,
        searchKeyword:
          searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        primarySortDirection:
          sortValue === undefined ? primarySortDirection : sortValue,
        PrimarySortColumnName: sortType == "" ? TemplateSort : sortType,
        TemplateTypeID:
          templateTypeID === undefined ? TemplateType : templateTypeID,
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
            setTotalRecords(totalCount)
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

  // Email Template Change status and delete function
  const EmailTemplatesChangeStatusDataAndDeleteData = async () => {
    setLoader(true);
    if (modelRequestData.Action === "Status") {
      if (modelRequestData.StatusType === null) {
        try {
          const Data = await ReminderTemplatesChangeStatus(
            modelRequestData.templateKeyID,
            modelRequestData.userKeyID
          );
          if (Data) {
            setLoader(false);
            if (Data?.data?.statusCode === 200) {
              if (
                Data?.data?.responseData.templateExistsInModule.length !== 0
              ) {
                const moduleNames =
                  Data?.data?.responseData.templateExistsInModule
                    .map((item) => item.moduleName)
                    ?.join(", ");
                const servicePackageNames = Data?.data?.responseData.templateExistsInModule
                  .flatMap((item) => item.recordList.map((templateName) => templateName.name));
                setModelRequestData({
                  ...modelRequestData,
                  Action: "EmailTemplateWarning",
                  message: `Following ${moduleNames} are assigned to the selected ${moduleName}.You must remove the ${moduleNames} from this ${moduleName} before attempting to mark it as InActive.`,
                  ServiceName: servicePackageNames,
                });
                $("#" + "ConfirmModel").modal("hide");
                $("#" + "RecordsAvailablePopupModel").modal("show");
                // GetEmailTemplatesListData(currentPage);
              } else {
                GetEmailTemplatesListData(currentPage);
                setOpenSuccessModal(true);
              }
            } else {
              setErrorMessage(Data?.response?.data?.errorMessage);
              setOpenErrorModal(true);
            }
            GetEmailTemplatesListData(isCurrentPage);
          }
        } catch (error) {
          console.log(error);
        }
      } else if (modelRequestData.StatusType === "IsDefault") {
        try {
          const Data = await GetChangeIsDefaultStatus(
            common.organisationKeyID,
            modelRequestData.templateKeyID,
            modelRequestData.isDefault,
            common.userKeyID
          );
          if (Data) {
            setLoader(false);
            if (Data?.data?.statusCode === 200) {
              setOpenSuccessModal(true);
            } else {
              setErrorMessage(Data?.response?.data?.errorMessage);
              setOpenErrorModal(true);
            }
            GetEmailTemplatesListData(isCurrentPage);
          }
        } catch (error) {
          console.log(error);
        }
      }
    } else if (modelRequestData.Action === "Delete") {
      try {
        const Data = await ReminderTemplatesDelete(
          modelRequestData.templateKeyID,
          modelRequestData.userKeyID
        );
        if (Data) {
          setLoader(false);
          if (Data?.data?.statusCode === 200) {
            if (
              Data?.data?.responseData.templateExistsInModule.length !== 0
            ) {
              const moduleNames =
                Data?.data?.responseData.templateExistsInModule
                  .map((item) => item.moduleName)
                  ?.join(", ");
              const servicePackageNames = Data?.data?.responseData.templateExistsInModule
                .flatMap((item) => item.recordList.map((templateName) => templateName.name));
              setModelRequestData({
                ...modelRequestData,
                Action: "EmailTemplateWarning",
                message: `Following ${moduleNames} are assigned to the selected ${moduleName}.You must remove the ${moduleNames} from this ${moduleName} before attempting to mark it as InActive.`,
                ServiceName: servicePackageNames,
              });
              $("#" + "ConfirmModel").modal("hide");
              $("#" + "RecordsAvailablePopupModel").modal("show");
              GetEmailTemplatesListData(currentPage);
            } else {
              GetEmailTemplatesListData(currentPage);
              setOpenSuccessModal(true);
            }
          } else {
            setErrorMessage(Data?.response?.data?.errorMessage);
            setOpenErrorModal(true);
          }
          GetEmailTemplatesListData(isCurrentPage);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  //Add Template Button
  const TemplateAddBtnClicked = () => {
    {
      setModelRequestData({
        ...modelRequestData,
        TemplateID: null,
        templateKeyID: null,
      });
    }

    let addEmailTemplateRequestData = {
      TemplateID: null,
      templateKeyID: null,
      templateName: null,
      status: null,
    };
    setTopbar("none");
    navigate("/add-reminder-template", { state: addEmailTemplateRequestData });
  };
  // 2) On Click Template Edit Button
  const TemplateEditBtnClicked = async (Template, type) => {
    if (type === "editPredefined") {
      setLoader(true);
      const data = await GetReminderTemplatesModel(
        Template.templateKeyID,
        true
      );
      if (data?.data?.statusCode === 200) {
        setLoader(false);
        setModelRequestData({
          ...modelRequestData,
          TemplateID: Template.templateID,
          templateKeyID: Template.templateKeyID,
          Action: "Update",
          Type: true,
        });
      } else {
        setLoader(false);
        setErrorMessage(data?.response?.data?.errorMessage);
        setOpenErrorModal(true);
      }
    } else {
      dispatch(
        updateState({
          currentPage: currentPage,
        })
      );
      setModelRequestData({
        ...modelRequestData,
        TemplateID: Template.templateID,
        templateKeyID: Template.templateKeyID,
        Action: "Update"
      });
    }
  };
  // Copy Reminder Email Record
  const CopyReminderEmailTemplateData = async() => {
    if(!common.userKeyID) return;
    try{
      setLoader(true);
      const data = await CopyReminderEmailTemplate(modelRequestData.templateKeyID,common.userKeyID);
      if(data?.data?.statusCode === 200) {
        setLoader(false);
        setOpenSuccessModal(true);
        GetEmailTemplatesListData(isCurrentPage);
      }
      else{
        setLoader(false);
        setErrorMessage(data?.data?.errorMessage);
        setOpenErrorModal(true);
      }
    }
    catch(error) {
      console.error(error);
    }
  }
  // Pagination :
  const handlePageChange = async (pageNumber) => {
    setCurrentPage(pageNumber);
    await GetEmailTemplatesListData(pageNumber); // Call your function with the selected page number
  };

  // G] Sorting & Handle Function:
  // const handleSort = (sortValue) => {
  //   setPrimarySortDirection(sortValue);
  //   setCurrentPage(1);
  //   GetEmailTemplatesListData(isCurrentPage, searchKeyword, sortValue);
  // };

  //Sort the list
  const handleSort = (sortValue, TemplateSort) => {
    if (TemplateSort === "TemplateName") {
      setPrimarySortDirection(sortValue);
      setPrimarySortDirectionObj({
        ...primarySortDirectionObj,
        templateNameSort: sortValue,
      });

      setCurrentPage(1);
      GetEmailTemplatesListData(1, searchKeyword, sortValue, TemplateSort);
    } else if (TemplateSort === "TemplateType") {
      setPrimarySortDirection(sortValue);
      setPrimarySortDirectionObj({
        ...primarySortDirectionObj,
        TemplateTypeSort: sortValue,
      });
      setCurrentPage(1);
      GetEmailTemplatesListData(1, searchKeyword, sortValue, TemplateSort);
    } else if (TemplateSort === "BusinessType") {
      setPrimarySortDirection(sortValue);
      setPrimarySortDirectionObj({
        ...primarySortDirectionObj,
        BusinessType: sortValue,
      });
      setCurrentPage(1);
      GetEmailTemplatesListData(1, searchKeyword, sortValue, TemplateSort);
    } else if (TemplateSort === "ProspectBusinessType") {
      setPrimarySortDirection(sortValue);
      setPrimarySortDirectionObj({
        ...primarySortDirectionObj,
        ProspectBusinessType: sortValue,
      });
      setCurrentPage(1);
      GetEmailTemplatesListData(1, searchKeyword, sortValue, TemplateSort);
    } else if (TemplateSort === "ProfessionType") {
      setPrimarySortDirection(sortValue);
      setPrimarySortDirectionObj({
        ...primarySortDirectionObj,
        ProfessionType: sortValue,
      });
      setCurrentPage(1);
      GetEmailTemplatesListData(1, searchKeyword, sortValue, TemplateSort);
    }
  };

  const handleSearch = (e) => {
    const searchKeywordValue = e.target.value;
    setSearchKeyword(searchKeywordValue);
    setCurrentPage(1);
    GetEmailTemplatesListData(isCurrentPage, searchKeywordValue);
  };

  const handleClose = () => {
    $("#" + "ConfirmModel").modal("hide");
    $("#" + "RecordsAvailablePopupModel").modal("hide");
    setOpenSuccessModal(false);
    setOpenErrorModal(false);
  };

  // const replaceNames = (text) => {
  //   return text.replace(/Contract/g, {EngagementName}).replace(/Quote/g, {proposalName});
  // };
  const replaceNames = (text, EngagementName, proposalName) => {
    return text
      .replace(/Contract/g, EngagementName)
      .replace(/Quote/g, proposalName);
  };

  const ApplyFilter = () => {
    if (
      (TemplateType !== null && TemplateType !== "")
    ) {
      setIsFilterApply(true);
    } else {
      setIsFilterApply(false);
    }
    GetEmailTemplatesListData(
      1,
      searchKeyword,
      primarySortDirection,
      sortType,
      TemplateType,
    );
  };
  const ClearFilter = () => {
    setIsFilterApply(false);
    setTemplateType(null);
    GetEmailTemplatesListData(
      1,
      searchKeyword,
      primarySortDirection,
      sortType,
      null,
    );
  };

  return (
    <div className="container">
      <div class="main-content">
        <div class="services page-background">
          <div class="page-info-header page-info-strip">
            <div class="container">
              <div className="row">
                <div className="col-md-6 col-6">
                  <div class="page-title-cls">{moduleName}</div>
                </div>
                <div className="col-md-6 col-6">
                  <div className="d-flex justify-content-sm-end add-new-btn">
                    {((userAccessData.Admin_Config_Email_Template_CanAdd &&
                      common.organisationKeyID !== null) ||
                      (userAccessData.SuperAdmin_Config_Email_Template_CanAdd &&
                        common.organisationKeyID === null)) && (
                        <CommonButtonComponent
                          title={getCrudButtonToolTipName("Add ", moduleName)}
                          name={`Add ${moduleName}`}
                          AddBtn={() => TemplateAddBtnClicked()}
                        />
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="row" id="tablesections">
              <div class="col-lg-12">
                <div class="card">
                  {/* end card header  */}

                  <div class="card-body">
                    <div id="customerList">
                      <div class="row g-4 mb-3"></div>
                      <div class="table-responsive table-card  mb-3 table-padding">
                        <div class="search-box ms-2 width-searchbox">
                          <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12 ">
                              <div className="row align-items-center">
                                <div className="col-3 mb-2">
                                  <div class="search-box w-100 width-searchbox mb-2">
                                    <i class="ri-search-line search-icon"></i>
                                    <input
                                      type="text"
                                      value={searchKeyword}
                                      onChange={(e) => {
                                        handleSearch(e);
                                      }}
                                      className="form-control search"
                                      placeholder={
                                        isMobile ? "Search" : getPlaceholderTextName("Search", moduleName)
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-6 d-flex align-items-start justify-content-start mb-3">
                                  <Tooltip
                                    title={getCrudButtonToolTipName(
                                      "Filter",
                                      moduleName
                                    )}
                                  >
                                    <div>
                                      <button
                                        className={
                                          isFilterApply
                                            ? "btn btn-md btn-success create-item-btn filter me-2"
                                            : "btn btn-md btn-success create-item-btn-apply filter me-2"
                                        }
                                        data-bs-toggle="modal"
                                        data-bs-target="#FilterModel"

                                      >
                                        <i
                                          className={
                                            isFilterApply
                                              ? "ri-filter-fill align-bottom "
                                              : "ri-filter-fill align-bottom Filter-apply-color"
                                          }
                                        ></i>
                                      </button>
                                    </div>
                                  </Tooltip>
                                  <div className="col-9">
                                    {isFilterApply ? (
                                      <Tooltip title={"Clear Filter"}>
                                        <button
                                          className="btn btn-md btn-success create-Filter-item-btn text-nowrap "
                                          onClick={ClearFilter} // Corrected from onclick to onClick
                                        >
                                          <span>Clear Filter</span>
                                        </button>
                                      </Tooltip>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <table
                          class="table align-middle table-nowrap"
                          id="customerTable"
                        >
                          <thead class="table-light">
                            <tr className="head-row table-header-font">
                              <td
                                className="tr-table-class text-white"
                                style={{ width: "35%" }}
                              >
                                Name{" "}
                                {primarySortDirectionObj.templateNameSort ===
                                  "desc" && (
                                    <i
                                      onClick={() => {
                                        setSortType("TemplateName");
                                        handleSort("asc", "TemplateName");
                                      }}
                                      class="fas fa-sort-alpha-up ml-1"
                                    ></i>
                                  )}
                                {(primarySortDirectionObj.templateNameSort ===
                                  null ||
                                  primarySortDirectionObj.templateNameSort ===
                                  "asc") && (
                                    <i
                                      onClick={() => {
                                        setSortType("TemplateName");
                                        handleSort(
                                          primarySortDirectionObj.templateNameSort ===
                                            null
                                            ? "asc"
                                            : "desc",
                                          "TemplateName"
                                        );
                                      }}
                                      class="fas fa-sort-alpha-down  ml-1"
                                    ></i>
                                  )}
                              </td>


                              <td className="tr-table-class text-white">
                                Template Type{" "}
                                {primarySortDirectionObj.TemplateTypeSort ===
                                  "desc" && (
                                    <i
                                      onClick={() => {
                                        setSortType("TemplateType");
                                        handleSort("asc", "TemplateType");
                                      }}
                                      class="fas fa-sort-alpha-up ml-1"
                                    ></i>
                                  )}
                                {(primarySortDirectionObj.TemplateTypeSort ===
                                  null ||
                                  primarySortDirectionObj.TemplateTypeSort ===
                                  "asc") && (
                                    <i
                                      onClick={() => {
                                        setSortType("TemplateType");
                                        handleSort(
                                          primarySortDirectionObj.TemplateTypeSort ===
                                            null
                                            ? "asc"
                                            : "desc",
                                          "TemplateType"
                                        );
                                      }}
                                      class="fas fa-sort-alpha-down  ml-1"
                                    ></i>
                                  )}
                              </td>
                              <td className="tr-table-class text-white">
                                Is Default
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
                          <tbody class="list form-check-all">
                            {EmailTemplateList.slice(
                              0,
                              isMobile ? isMobileRecords : desktopRecords
                            ).map((Template) => {
                              return (
                                <tr class="table_new table-content-font">
                                  <td className="table-content-font">
                                    {Template.notifySAChanges !== null && common.organisationKeyID !== null && (
                                      <>
                                        <Tooltip
                                          title="View System Administrator Changes"

                                        >
                                          <span onClick={() =>
                                            TemplateEditBtnClicked(
                                              Template, "editPredefined"
                                            )
                                          }
                                            className="UpdateConfigValue"
                                          // data-bs-toggle="modal"

                                          // data-bs-target="#addUpdateModal"
                                          ><i class="fa fa-regular fa-bell"></i></span>
                                        </Tooltip>
                                      </>
                                    )}
                                    {isMobile ? (
                                      <>
                                        {" "}
                                        {Template.templateName.length > 20
                                          ? Template.templateName
                                            .substring(0, 20)
                                            .replace(/\b\w/g, (l) =>
                                              l.toUpperCase()
                                            ) + "..."
                                          : Template.templateName
                                            .substring(0, 20)
                                            .replace(/\b\w/g, (l) =>
                                              l.toUpperCase()
                                            )}
                                      </>
                                    ) : (
                                      <>
                                        {Template.templateName.length > 50 ? (
                                          <Tooltip
                                            title={Template.templateName}
                                          >
                                            {Template.templateName
                                              .substring(0, 50)
                                              .replace(/\b\w/g, (l) =>
                                                l.toUpperCase()
                                              ) + "..."}
                                          </Tooltip>
                                        ) : (
                                          <>
                                            {Template.templateName
                                              .replace(/\b\w/g, (l) =>
                                                l.toUpperCase()
                                              )}
                                          </>
                                        )}
                                      </>
                                    )}
                                  </td>
                                  {/* <td className="table-content-font">
                                    {showProfessionType &&
                                      Template.professionTypeNames}
                                  </td> */}
                                  <td className="table-content-font">
                                    {replaceNames(
                                      Template.templateType,
                                      EngagementName,
                                      proposalName
                                    )}
                                  </td>
                                  <td className="Switch table-content-font">
                                    <div
                                      style={{ alignItems: "none" }}
                                      class="d-flex gap-2 "
                                    >
                                      <div style={{ width: "20px" }}>
                                        {" "}
                                        {Template.isDefaultName}
                                      </div>
                                      {((userAccessData.Admin_Config_Email_Template_CanDelete &&
                                        common.organisationKeyID !== null) ||
                                        (userAccessData.SuperAdmin_Config_Email_Template_CanDelete &&
                                          common.organisationKeyID ===
                                          null)) && (
                                          <Tooltip
                                            title={getCrudButtonToolTipName(
                                              "Change Is Default"
                                            )}
                                          >
                                            <FormGroup>
                                              <FormControlLabel
                                                control={
                                                  <Android12Switch
                                                    onClick={() =>
                                                      setModelRequestData({
                                                        ...modelRequestData,
                                                        professionTypeNames:
                                                          Template.professionTypeNames,
                                                        BusinessTypeName:
                                                          Template.orgBusinessType,
                                                        status: Template.isDefaultName ===
                                                          "Yes" ?
                                                          "Active" :
                                                          "InActive",
                                                        templateKeyID: Template.templateKeyID,
                                                        isDefault:
                                                          Template.isDefaultName ===
                                                            "Yes"
                                                            ? false
                                                            : true,
                                                        StatusType: "IsDefault",
                                                        Action: "Status",
                                                      })
                                                    }
                                                    checked={
                                                      Template.isDefaultName ===
                                                      "Yes"
                                                    }
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#ConfirmModel"
                                                  />
                                                }
                                              />
                                            </FormGroup>
                                          </Tooltip>
                                        )}
                                    </div>
                                  </td>
                                  <td className="Switch table-content-font">
                                    <div
                                      style={{ alignItems: "none" }}
                                      class="d-flex gap-2 "
                                    >
                                      <div style={{ width: "40px" }}>
                                        {" "}
                                        {Template.statusName}
                                      </div>
                                      {((userAccessData.Admin_Config_Email_Template_CanDelete &&
                                        common.organisationKeyID !== null) ||
                                        (userAccessData.SuperAdmin_Config_Email_Template_CanDelete &&
                                          common.organisationKeyID ===
                                          null)) && (
                                          <Tooltip
                                            title={getCrudButtonToolTipName(
                                              "Change Status"
                                            )}
                                          >
                                            <FormGroup style={{ width: "55px" }}>
                                              <FormControlLabel
                                                control={
                                                  <Android12Switch
                                                    onClick={() =>
                                                      setModelRequestData({
                                                        ...modelRequestData,
                                                        professionTypeNames:
                                                          Template.professionTypeNames,
                                                        BusinessTypeName:
                                                          Template.orgBusinessType,
                                                        status: Template.statusName ===
                                                          "Active" ?
                                                          "Active" :
                                                          "InActive",
                                                        templateKeyID: Template.templateKeyID,
                                                        userKeyID:
                                                          common.userKeyID,
                                                        StatusType: null,
                                                        Action: "Status",
                                                      })
                                                    }
                                                    checked={
                                                      Template.statusName ===
                                                      "Active"
                                                    }
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#ConfirmModel"
                                                  />
                                                }
                                              />
                                            </FormGroup>
                                          </Tooltip>
                                        )}
                                    </div>
                                  </td>
                                  <td className="table-content-font">
                                    <div class="d-flex gap-2">
                                    <Tooltip
                                        title={getCrudButtonToolTipName(
                                          "Copy",
                                          moduleName
                                        )}
                                      >
                                        <div class="copy">
                                          <button
                                            class="btn btn-sm btn-success edit-item-btn edit"
                                            data-bs-toggle="modal"
                                            data-bs-target="#ConfirmModel"
                                            onClick={() =>
                                              setModelRequestData({
                                                ...modelRequestData,
                                                Action: "Copy",
                                                templateName: Template.templateName,
                                                templateKeyID: Template.templateKeyID,
                                                userKeyID: common.userKeyID
                                              })
                                            }
                                          >
                                            <i class="fa-solid fa-copy"></i>
                                          </button>
                                        </div>
                                      </Tooltip> 
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
                                            <div class="edit">
                                              <button
                                                onClick={() =>
                                                  TemplateEditBtnClicked(Template)
                                                }
                                                class="btn btn-sm btn-success edit-item-btn actionButtonsStyle"
                                              >
                                                <i class="ri-pencil-fill"></i>
                                              </button>
                                            </div>
                                          </Tooltip>
                                        )}
                                      {((userAccessData.Admin_Config_Email_Template_CanDelete &&
                                        common.organisationKeyID !== null) ||
                                        (userAccessData.SuperAdmin_Config_Email_Template_CanDelete &&
                                          common.organisationKeyID ===
                                          null)) && (
                                          <Tooltip
                                            title={getCrudButtonToolTipName(
                                              "Delete",
                                              moduleName
                                            )}
                                          >
                                            <div class="remove">
                                              <button
                                                onClick={() =>
                                                  setModelRequestData({
                                                    ...modelRequestData,
                                                    templateKeyID: Template.templateKeyID,
                                                    templateName:
                                                      Template.templateName,
                                                    userKeyID: common.userKeyID,
                                                    Action: "Delete",
                                                  })
                                                }
                                                class="btn btn-sm btn-danger remove-item-btn actionButtonsStyle"
                                                data-bs-toggle="modal"
                                                data-bs-target="#ConfirmModel"
                                              >
                                                <i class="ri-delete-bin-5-fill"></i>
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
                  {/* end card  */}
                  {listCount > pageSize && (
                    <PaginationComponent
                      totalCount={listCount}
                      totalPages={totalPage}
                      currentPage={currentPage}
                      onPageChange={handlePageChange}
                    />
                  )}
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
          UpdatedStatus={modelRequestData.Action === "Delete" || modelRequestData.Action === "Status" ? EmailTemplatesChangeStatusDataAndDeleteData : CopyReminderEmailTemplateData}
        />
        <RecordsAvailablePopupModel
          handleClose={handleClose}
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
          message={`${
            modelRequestData.Action === "Delete"
              ? `${moduleName} ${modelRequestData.templateName}`
              : modelRequestData.Action === "Copy"
              ? `Copy of ${modelRequestData.templateName}l has been created successfully!`
              : "Status has been changed successfully!"
          }`}
        />
        <FilterModel
          class="modal fade"
          id="FilterModel"
          tabIndex="-1"
          aria_labelledby="exampleModalLabel"
          aria_hidden="true"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          ModuleName={moduleName}
          isFilterApply={isFilterApply}
          setIsFilterApply={setIsFilterApply}
          ApplyFilter={ApplyFilter}
          TemplateType={TemplateType}
          setTemplateType={setTemplateType}

        />
        <Footer />
      </div>
      {/* end back-to-top */}
    </div>
  );
}

export default ReminderTemplateList;
