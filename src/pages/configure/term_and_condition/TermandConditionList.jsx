/* global $ */
import React, { useContext, useEffect, useState } from "react";
import "./termAndCondition.css";
import { useNavigate } from "react-router";
import CommonButtonComponent from "../../../components/CommonButtonComponent";
import ConfirmModel from "../../../components/ConfirmationBox";
import {
  TermsAndConditionsDelete,
  GetTermsAndConditionsList,
  TermsAndConditionsChangeStatus,
  GetChangeIsDefaultStatus,
  GetTermsAndConditionsModel,
  CopyTermsAndConditions
} from "../../../redux/Services/Config/TermAndConditionApi";
import PaginationComponent from "../../../components/PaginationModel";
import Android12Switch from "../../../components/AndroidSwitch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { AuthContextProvider } from "../../../AuthContext/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import NoResultFoundModel from "../../../components/NoResultFoundModel";
import SuccessModal from "../../../components/SuccessModal";
import ErrorModel from "../../../components/ErrorModel";
import Footer from "../../../components/Footer";
import { USER_ROLE_TYPE } from "../../../Middleware/enums";
import { updateState } from "../../../redux/Persist";
import RecordsAvailablePopupModel from "../../../components/RecordsAvailablePopupModel";

function Term_and_Condition() {
  let getTermsAndConditionsListApiCallCount = 0;
  const moduleName = "Terms & Conditions";
  //A]Declare state
  const common = useSelector((state) => state.Storage); //Getting Logged Users Details From Persist Storage of redux hooks
  const navigate = useNavigate();
  const {
    setTopbar,
    prospectName,
    setLoader,
    EngagementName,
    proposalName,
    maxCountToRecallApi,
    totalPage,
    isMobile,
    setListCount,
    listCount,
    desktopRecords,
    isMobileRecords,
    getCrudButtonTextName,
    getPlaceholderTextName,
    getCrudButtonToolTipName,
    userAccessData,
    handleErrorMessage,
  } = useContext(AuthContextProvider);
  const [TermAndConditionList, setTermAndConditionList] = useState([]);
  const [totalRecords, setTotalRecords] = useState(-1);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
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
  const [modelRequestData, setModelRequestData] = useState({
    professionTypeNames: null,
    BusinessTypeName: null,
    TemplateID: null,
    templateName: null,
    templateKeyID: null,
    StatusType: null,
    isDefault: null,
    status: null,
    Action: "",
    userKeyID: null,
  });
  const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const isCurrentPage =
    common.currentPage === "" ? currentPage : common.currentPage;
  const pageSize = isMobile ? isMobileRecords : desktopRecords;
  const dispatch = useDispatch();
  const [showProfessionType, setShowProfessionType] = useState(
    common.organisationKeyID === null || common.professionTypeLists.length > 1
  );
  const formattedErrorMessage = handleErrorMessage(errorMessage);

  // B] Initial useEffect :
  // 1) Will Call Initial Api Like List Api
  useEffect(() => {
    setTopbar("block");
    GetTermsAndConditionsListData(isCurrentPage);
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
        setPrimarySortDirection(null);
        setCurrentPage(1);
        GetTermsAndConditionsListData(isCurrentPage, null, null);
      } else {
        GetTermsAndConditionsListData(isCurrentPage);
      }
      setIsAddUpdateActionDone(false);
    }
  }, [isAddUpdateActionDone]);

  useEffect(() => {
    if (
      modelRequestData.Action === "Update" ||
      modelRequestData.Action === null
    ) {
      if (
        modelRequestData.Action === "Update" &&
        modelRequestData.TemplateID !== null
      ) {
        setTopbar("none");
        navigate("/add-terms-and-conditions", { state: modelRequestData });
      } else if (
        modelRequestData.TemplateID === null &&
        modelRequestData.Action === null
      ) {
        setTopbar("none");
        navigate("/add-terms-and-conditions", { state: modelRequestData });
      }
    }
  }, [modelRequestData]);
  // C] Calling All Api's like List and other Here :
  // 1) Get Service Category List Data
  const GetTermsAndConditionsListData = async (
    i,
    searchKeywordValue,
    sortValue,
    TemplateSort
  ) => {
    setLoader(true);
    const pageNoList = i - 1;
    try {
      const data = await GetTermsAndConditionsList({
        pageSize: pageSize,
        pageNo: pageNoList,
        organisationID: common.organisationID,
        organisationKeyID: common.organisationKeyID,
        SearchKeyword:
          searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        primarySortDirection:
          sortValue === undefined ? primarySortDirection : sortValue,
        PrimarySortColumnName:
          TemplateSort == undefined || TemplateSort == ""
            ? sortType
            : TemplateSort,
      });
      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          getTermsAndConditionsListApiCallCount = 0;
          if (data?.data?.responseData?.data) {
            const totalCount = data.data.totalCount;
            const TemplateListData = data.data.responseData.data;
            if (pageNoList > 0 && TemplateListData.length === 0) {
              let newPaneNo = Number(pageNoList);
              if (newPaneNo > 1) {
                newPaneNo = newPaneNo - 1;
              }

              GetTermsAndConditionsListData(
                newPaneNo,
                searchKeywordValue,
                sortValue,
                TemplateSort
              );
              setCurrentPage(pageNoList);
              return;
            }
            setListCount(totalCount);
            setTermAndConditionList(TemplateListData);
            setTotalRecords(TemplateListData.length);
          }
        } else {
          if (getTermsAndConditionsListApiCallCount < maxCountToRecallApi) {
            getTermsAndConditionsListApiCallCount += 1;
            setTimeout(function () {
              GetTermsAndConditionsListData(
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
 // Copy TnC data
 const CopyTermsAndConditionsTemplateData = async() => {
  if(!common.organisationKeyID) return;
  try {
    const data = await CopyTermsAndConditions(modelRequestData.templateKeyID,common.userKeyID);
    if(data?.data?.statusCode === 200) {
      setOpenSuccessModal(true);
      GetTermsAndConditionsListData(currentPage);
    }
    else {
      setErrorMessage(data?.data?.errorMessage);
      setOpenErrorModal(true);
    }
  }
  catch(error) {
    console.error(error);
  }
}
  // Update Function Modal
  // 2) On Click Template Status Button
  const TermsAndConditionsChangeStatusDataAndDeleteData = async () => {
    setLoader(true);
    if (modelRequestData.Action === "Status") {
      if (modelRequestData.StatusType === null) {
        try {
          const Data = await TermsAndConditionsChangeStatus(
            modelRequestData.templateKeyID,
            modelRequestData.userKeyID
          );
          if (Data) {
            setLoader(false);
            if (Data?.data?.statusCode === 200) {
              if (
                Data?.data?.responseData.templateExistsInModule.length !== 0
              ) {
                const servicePackageNames =
                  Data?.data?.responseData.templateExistsInModule.map(
                    (item) => item.templateName
                  );
                const moduleNames =
                  Data?.data?.responseData.templateExistsInModule
                    .map((item) => item.moduleName)
                    .join(", ");
                setModelRequestData({
                  ...modelRequestData,
                  Action: "TermAndConditionWarning",
                  message: `Following ${moduleNames} are assigned to the selected ${moduleName}.You must remove the ${moduleNames} from this ${moduleName} before attempting to mark it as InActive.`,
                  ServiceName: servicePackageNames,
                });
                $("#" + "ConfirmModel").modal("hide");
                $("#" + "RecordsAvailablePopupModel").modal("show");
                GetTermsAndConditionsListData(currentPage);
              } else {
                GetTermsAndConditionsListData(currentPage);
                setOpenSuccessModal(true);
              }
            } else {
              let ErrorMessage = Data?.response?.data?.errorMessage;
              if (
                ErrorMessage.includes(
                  "At least one template should be defaulted."
                ) &&
                common.organisationKeyID === null
              ) {
                setErrorMessage(
                  ` Status cannot be changed to InActive. This template is marked as default for profession type ${modelRequestData.professionTypeNames} and business type ${modelRequestData.BusinessTypeName}.`
                );
                setOpenErrorModal(true);
              } else if (
                ErrorMessage.includes(
                  "At least one template should be defaulted."
                ) &&
                showProfessionType &&
                common.organisationKeyID !== null
              ) {
                setErrorMessage(
                  ` Status cannot be changed to InActive. This template is marked as default for profession type  ${modelRequestData.professionTypeNames}.`
                );
                setOpenErrorModal(true);
              } else if (
                ErrorMessage.includes(
                  "At least one template should be defaulted."
                )
              ) {
                setErrorMessage(
                  ` Status cannot be changed to InActive. This template is marked as default.`
                );
                setOpenErrorModal(true);
              } else {
                setErrorMessage(Data?.response?.data?.errorMessage);
                setOpenErrorModal(true);
              }
            }
            GetTermsAndConditionsListData(isCurrentPage);
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
              let ErrorMessage = Data?.response?.data?.errorMessage;
              if (
                ErrorMessage.includes(
                  "At least one template should be defaulted."
                ) &&
                common.organisationKeyID === null
              ) {
                setErrorMessage(
                  `This template is the only template of profession type ${modelRequestData.professionTypeNames} and business type ${modelRequestData.BusinessTypeName}  marked as default. At least one template must be defaulted.`
                );
                setOpenErrorModal(true);
              } else if (
                ErrorMessage.includes(
                  "At least one template should be defaulted."
                ) &&
                showProfessionType &&
                common.organisationKeyID !== null
              ) {
                setErrorMessage(
                  `This template is the only template of profession type ${modelRequestData.professionTypeNames} marked as default. At least one template must be defaulted.`
                );
                setOpenErrorModal(true);
              } else if (
                ErrorMessage.includes(
                  "At least one template should be defaulted."
                )
              ) {
                setErrorMessage(
                  `This template is the only template  marked as default. At least one template must be defaulted.`
                );
                setOpenErrorModal(true);
              } else {
                setErrorMessage(Data?.response?.data?.errorMessage);
                setOpenErrorModal(true);
              }
            }
            GetTermsAndConditionsListData(isCurrentPage);
          }
        } catch (error) {
          console.log(error);
        }
      }
    } else if (modelRequestData.Action === "Delete") {
      try {
        const Data = await TermsAndConditionsDelete(
          modelRequestData.templateKeyID,
          modelRequestData.userKeyID
        );
        if (Data) {
          setLoader(false);
          if (Data?.data?.statusCode === 200) {
            if (Data?.data?.responseData.templateExistsInModule.length !== 0) {
              const servicePackageNames =
                Data?.data?.responseData.templateExistsInModule.map(
                  (item) => item.templateName
                );
              setModelRequestData({
                ...modelRequestData,
                Action: "TermAndConditionWarning",
                message: `This Service  is used in below services.You must remove the service  from these before you InActive it.`,
                ServiceName: servicePackageNames,
              });
              $("#" + "ConfirmModel").modal("hide");
              $("#" + "RecordsAvailablePopupModel").modal("show");
              GetTermsAndConditionsListData(currentPage);
            } else {
              GetTermsAndConditionsListData(currentPage);
              setOpenSuccessModal(true);
            }
          } else {
            setErrorMessage(Data?.response?.data?.errorMessage);
            setOpenErrorModal(true);
          }
        }

        GetTermsAndConditionsListData(isCurrentPage);
      } catch (error) {
        console.log(error);
      }
    }
  };

  //E] Update Function Modal
  // 1) On Click Service Category Add Button
  const TemplateAddBtnClicked = () => {
    setModelRequestData({
      ...modelRequestData,
      Action: null,
      TemplateID: null,
      templateKeyID: null,
    });
  };

  // 2) On Click Template Edit Button
  const TemplateEditBtnClicked = async (Template, type) => {

    if (type === "editPredefined") {
      setLoader(true);
      const data = await GetTermsAndConditionsModel(
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

  // F] Pagination :
  const handlePageChange = async (pageNumber) => {
    setCurrentPage(pageNumber);
    await GetTermsAndConditionsListData(pageNumber); // Call your function with the selected page number
  };

  // G] Sorting & Handle Function:
  const handleSort = (sortValue, TemplateSort) => {
    if (TemplateSort === "TemplateName") {
      setPrimarySortDirection(sortValue);
      setPrimarySortDirectionObj({
        ...primarySortDirectionObj,
        templateNameSort: sortValue,
      });
      setCurrentPage(1);
      GetTermsAndConditionsListData(1, searchKeyword, sortValue, TemplateSort);
    } else if (TemplateSort === "TemplateType") {
      setPrimarySortDirection(sortValue);
      setPrimarySortDirectionObj({
        ...primarySortDirectionObj,
        TemplateTypeSort: sortValue,
      });
      setCurrentPage(1);
      GetTermsAndConditionsListData(1, searchKeyword, sortValue, TemplateSort);
    } else if (TemplateSort === "BusinessType") {
      setPrimarySortDirection(sortValue);
      setPrimarySortDirectionObj({
        ...primarySortDirectionObj,
        BusinessType: sortValue,
      });
      setCurrentPage(1);
      GetTermsAndConditionsListData(1, searchKeyword, sortValue, TemplateSort);
    } else if (TemplateSort === "ProspectBusinessType") {
      setPrimarySortDirection(sortValue);
      setPrimarySortDirectionObj({
        ...primarySortDirectionObj,
        ProspectBusinessType: sortValue,
      });
      setCurrentPage(1);
      GetTermsAndConditionsListData(1, searchKeyword, sortValue, TemplateSort);
    } else if (TemplateSort === "ProfessionType") {
      setPrimarySortDirection(sortValue);
      setPrimarySortDirectionObj({
        ...primarySortDirectionObj,
        ProfessionType: sortValue,
      });
      setCurrentPage(1);
      GetTermsAndConditionsListData(1, searchKeyword, sortValue, TemplateSort);
    }
  };
  const handleSearch = (e) => {
    const searchKeywordValue = e.target.value;
    setSearchKeyword(searchKeywordValue);
    setCurrentPage(1);
    GetTermsAndConditionsListData(isCurrentPage, searchKeywordValue);
  };

  const handleClose = () => {
    $("#" + "ConfirmModel").modal("hide");
    $("#" + "RecordsAvailablePopupModel").modal("hide");
    setOpenSuccessModal(false);
    setOpenErrorModal(false);
  };

  return (
    <div className="container">
      <div class="main-content">
        <div class="services page-background">
          <div class="page-info-header page-info-strip">
            <div class="container">
              <div className="row">
                <div className="col-md-6 col-6">
                  <div class="page-title-cls">Terms & Conditions</div>
                </div>
                <div className="col-md-6 col-6">
                  <div className="d-flex justify-content-sm-end add-new-btn">
                    {((userAccessData.Admin_Config_TnC_CanAdd &&
                      common.organisationKeyID !== null) ||
                      (userAccessData.SuperAdmin_Config_TnC_CanAdd &&
                        common.organisationKeyID === null)) && (
                        <CommonButtonComponent
                          title={getCrudButtonToolTipName("Add", moduleName)}
                          name={getCrudButtonTextName("Add", moduleName)}
                          AddBtn={() => TemplateAddBtnClicked()}
                        />
                      )}
                  </div>
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
                      <div class="table-responsive table-card  mb-3 table-padding">
                        <div class="search-box col-md-3 col-8 width-searchbox mb-2">
                          <i class="ri-search-line search-icon"></i>
                          <input
                            type="text"
                            value={searchKeyword}
                            onChange={(e) => {
                              handleSearch(e);
                            }}
                            className="form-control search"
                            placeholder={
                              isMobile
                                ? "Search"
                                : getPlaceholderTextName("Search", moduleName)
                            }
                          />
                        </div>
                        <table
                          class="table align-middle table-nowrap"
                          id="customerTable"
                        >
                          <thead class="table-light table-header-font">
                            <tr className="head-row">
                              <td
                                className="tr-table-class text-white"
                                style={{ width: "35%" }}
                              >
                                Name
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
                              <td className="tr-table-class text-white profession-type-column">
                                {showProfessionType && (
                                  <>
                                    Profession Type
                                    {primarySortDirectionObj.ProfessionType ===
                                      "desc" && (
                                        <i
                                          onClick={() => {
                                            setSortType("ProfessionType");
                                            handleSort("asc", "ProfessionType");
                                          }}
                                          class="fas fa-sort-alpha-up ml-1"
                                        ></i>
                                      )}
                                    {(primarySortDirectionObj.ProfessionType ===
                                      null ||
                                      primarySortDirectionObj.ProfessionType ===
                                      "asc") && (
                                        <i
                                          onClick={() => {
                                            setSortType("ProfessionType");
                                            handleSort(
                                              primarySortDirectionObj.ProfessionType ===
                                                null
                                                ? "asc"
                                                : "desc",
                                              "ProfessionType"
                                            );
                                          }}
                                          class="fas fa-sort-alpha-down  ml-1"
                                        ></i>
                                      )}
                                  </>
                                )}
                              </td>
                              {common.roleTypeId ===
                                USER_ROLE_TYPE.SuperAdmin &&
                                common.organisationKeyID === null ? (
                                <td className="tr-table-class text-white profession-type-column">
                                  Business Type
                                  {primarySortDirectionObj.BusinessType ===
                                    "desc" && (
                                      <i
                                        onClick={() => {
                                          setSortType("BusinessType");
                                          handleSort("asc", "BusinessType");
                                        }}
                                        class="fas fa-sort-alpha-up ml-1"
                                      ></i>
                                    )}
                                  {(primarySortDirectionObj.BusinessType ===
                                    null ||
                                    primarySortDirectionObj.BusinessType ===
                                    "asc") && (
                                      <i
                                        onClick={() => {
                                          setSortType("BusinessType");
                                          handleSort(
                                            primarySortDirectionObj.BusinessType ===
                                              null
                                              ? "asc"
                                              : "desc",
                                            "BusinessType"
                                          );
                                        }}
                                        class="fas fa-sort-alpha-down  ml-1"
                                      ></i>
                                    )}
                                </td>
                              ) : (
                                <td className="tr-table-class text-white profession-type-column">
                                  <span className="invisible">
                                    Business Type
                                    {primarySortDirectionObj.BusinessType ===
                                      "desc" && (
                                        <i
                                          onClick={() => {
                                            setSortType("BusinessType");
                                            handleSort("asc", "BusinessType");
                                          }}
                                          class="fas fa-sort-alpha-up ml-1"
                                        ></i>
                                      )}
                                    {(primarySortDirectionObj.BusinessType ===
                                      null ||
                                      primarySortDirectionObj.BusinessType ===
                                      "asc") && (
                                        <i
                                          onClick={() => {
                                            setSortType("BusinessType");
                                            handleSort(
                                              primarySortDirectionObj.BusinessType ===
                                                null
                                                ? "asc"
                                                : "desc",
                                              "BusinessType"
                                            );
                                          }}
                                          class="fas fa-sort-alpha-down  ml-1"
                                        ></i>
                                      )}
                                  </span>
                                </td>
                              )}
                              <td className="tr-table-class text-white isDefault-td">
                                Template Type
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
                                {((userAccessData.Admin_Config_TnC_CanEdit &&
                                  common.organisationKeyID !== null) ||
                                  (userAccessData.SuperAdmin_Config_TnC_CanEdit &&
                                    common.organisationKeyID === null) ||
                                  (userAccessData.Admin_Config_TnC_CanDelete &&
                                    common.organisationKeyID !== null) ||
                                  (userAccessData.SuperAdmin_Config_TnC_CanDelete &&
                                    common.organisationKeyID === null)) && (
                                    <>Action</>
                                  )}
                              </td>
                            </tr>
                          </thead>
                          <tbody class="list form-check-all">
                            {TermAndConditionList.slice(
                              0,
                              isMobile ? isMobileRecords : desktopRecords
                            ).map((Template) => {
                              return (
                                <tr class="table_new table-content-font">
                                  <td>
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
                                        {Template.templateName.length > 20
                                          ? Template.templateName
                                            .substring(0, 20)
                                            .replace(/\b\w/g, (l) =>
                                              l.toUpperCase()
                                            ) + "..."
                                          : Template.templateName
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

                                  <td>
                                    {" "}
                                    {showProfessionType &&
                                      Template.professionTypeNames}
                                  </td>

                                  {common.roleTypeId ===
                                    USER_ROLE_TYPE.SuperAdmin &&
                                    common.organisationKeyID === null ? (
                                    <td>{Template.orgBusinessType}</td>
                                  ) : (
                                    <td>&nbsp;</td>
                                  )}
                                  <td className="isDefault-td">
                                    {Template.templateType}
                                  </td>
                                  <td className="Switch">
                                    <div
                                      style={{
                                        alignItems: "none",
                                        marginLeft:
                                          ((userAccessData.Admin_Config_TnC_CanEdit &&
                                            common.organisationKeyID !==
                                            null) ||
                                            (userAccessData.SuperAdmin_Config_TnC_CanEdit &&
                                              common.organisationKeyID ===
                                              null)) &&
                                            ((userAccessData.Admin_Config_TnC_CanDelete &&
                                              common.organisationKeyID !==
                                              null) ||
                                              (userAccessData.SuperAdmin_Config_TnC_CanDelete &&
                                                common.organisationKeyID ===
                                                null))
                                            ? ""
                                            : "10px",
                                      }}
                                      class="d-flex gap-2 "
                                    >
                                      <div style={{ width: "20px" }}>
                                        {" "}
                                        {Template.isDefaultName}
                                      </div>
                                      {((userAccessData.Admin_Config_TnC_CanDelete &&
                                        common.organisationKeyID !== null) ||
                                        (userAccessData.SuperAdmin_Config_TnC_CanDelete &&
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
                                                        status:
                                                          Template.isDefaultName,
                                                        templateKeyID:
                                                          Template.templateKeyID,
                                                        StatusType: "IsDefault",
                                                        isDefault:
                                                          Template.isDefaultName ===
                                                            "Yes"
                                                            ? false
                                                            : true,
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
                                  <td className="Switch">
                                    <div
                                      style={{
                                        alignItems: "none",
                                        marginLeft:
                                          ((userAccessData.Admin_Config_TnC_CanEdit &&
                                            common.organisationKeyID !==
                                            null) ||
                                            (userAccessData.SuperAdmin_Config_TnC_CanEdit &&
                                              common.organisationKeyID ===
                                              null)) &&
                                            ((userAccessData.Admin_Config_TnC_CanDelete &&
                                              common.organisationKeyID !==
                                              null) ||
                                              (userAccessData.SuperAdmin_Config_TnC_CanDelete &&
                                                common.organisationKeyID ===
                                                null))
                                            ? ""
                                            : "10px",
                                      }}
                                      class="d-flex gap-2 "
                                    >
                                      <div style={{ width: "40px" }}>
                                        {" "}
                                        {Template.statusName}
                                      </div>
                                      {((userAccessData.Admin_Config_TnC_CanDelete &&
                                        common.organisationKeyID !== null) ||
                                        (userAccessData.SuperAdmin_Config_TnC_CanDelete &&
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
                                                        status:
                                                          Template.statusName,
                                                        templateKeyID:
                                                          Template.templateKeyID,
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
                                  <td>
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
                                      {((userAccessData.Admin_Config_TnC_CanEdit &&
                                        common.organisationKeyID !== null) ||
                                        (userAccessData.SuperAdmin_Config_TnC_CanEdit &&
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
                                      {((userAccessData.Admin_Config_TnC_CanDelete &&
                                        common.organisationKeyID !== null) ||
                                        (userAccessData.SuperAdmin_Config_TnC_CanDelete &&
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
                                                    templateKeyID:
                                                      Template.templateKeyID,
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
                  {listCount > pageSize && (
                    <PaginationComponent
                      totalCount={listCount}
                      totalPages={totalPage}
                      currentPage={currentPage}
                      onPageChange={handlePageChange}
                    />
                  )}
                  {/* end card  */}
                </div>
                {/* end col */}
              </div>
              {/* end col  */}
            </div>
            {/* end row */}
          </div>
          {/* container-fluid  */}
        </div>

        <ErrorModel
          ErrorModel={openErrorModal}
          handleClose={handleClose}
          ErrorMessage={formattedErrorMessage}
        />
        {/* Confirm Modal  */}
        <ConfirmModel
          openErrorModal={openErrorModal}
          openSuccessModal={openSuccessModal}
          modelRequestData={modelRequestData}
          UpdatedStatus = {modelRequestData.Action === "Delete" || modelRequestData.Action === "Status" ? TermsAndConditionsChangeStatusDataAndDeleteData : CopyTermsAndConditionsTemplateData}
        />
        <RecordsAvailablePopupModel
          handleClose={handleClose}
          openErrorModal={openErrorModal}
          openSuccessModal={openSuccessModal}
          modelRequestData={modelRequestData}
          UpdatedStatus={TermsAndConditionsChangeStatusDataAndDeleteData}
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
              ? `Copy of ${modelRequestData.templateName} has been created successfully!`
              : "Status has been changed successfully!"
          }`}
        />
        {/* End Page-content */}

        <Footer />
      </div>

      {/* start back-to-top */}
      <button
        onclick="topFunction()"
        class="btn btn-danger btn-icon"
        id="back-to-top"
      >
        <i class="ri-arrow-up-line"></i>
      </button>
      {/* end back-to-top */}
    </div>
  );
}

export default Term_and_Condition;
