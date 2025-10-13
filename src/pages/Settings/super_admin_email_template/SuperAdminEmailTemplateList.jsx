/* global $ */
import React, { useContext, useEffect, useState } from "react";
// import "./EmailTemplate.css";
import "../../configure/email_template/EmailTemplate.css";
import { useNavigate } from "react-router";
import CommonButtonComponent from "../../../components/CommonButtonComponent";
import ConfirmModel from "../../../components/ConfirmationBox";
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
import { updateState } from "../../../redux/Persist";
import RecordsAvailablePopupModel from "../../../components/RecordsAvailablePopupModel";
import {
  EmailTemplatesDelete,
  GetEmailTemplatesList,
  EmailTemplatesChangeStatus,
  GetChangeIsDefaultStatus,
} from "../../../redux/Services/Config/SuperEmailTemplateApi";

function SuperAdminEmailTemplateList() {
  const moduleName = "Super Admin Email Template";
  let getEmailTemplatesListApiCallCount = 0;
  //A]Declare state
  const common = useSelector((state) => state.Storage); //Getting Logged Users Details From Persist Storage of redux hooks
  const navigate = useNavigate();
  const {
    setLoader,
    setTopbar,
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
  const [EmailTemplateList, setEmailTemplateList] = useState([]);
  const [totalRecords, setTotalRecords] = useState(-1);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
  const [currentPage, setCurrentPage] = useState(
    common.currentPage === "" ? 1 : common.currentPage
  );
  const formattedErrorMessage = handleErrorMessage(errorMessage);

  const [sortType, setSortType] = useState(null);
  const [primarySortDirection, setPrimarySortDirection] = useState(null);
  const [primarySortDirectionObj, setPrimarySortDirectionObj] = useState({
    templateNameSort: null,
    TemplateTypeSort: null,
    BusinessType: null,
    ProspectBusinessType: null,
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [modelRequestData, setModelRequestData] = useState({
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
  const pageSize = isMobile ? isMobileRecords : desktopRecords;
  const isCurrentPage =
    common.currentPage === "" ? currentPage : common.currentPage;

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
      modelRequestData.templateKeyID !== null
    ) {
      setTopbar("none");
      navigate("/super-admin-email-template-model", {
        state: modelRequestData,
      });
    } else {
      GetEmailTemplatesListData(isCurrentPage);
    }
  }, [modelRequestData.TemplateID]);

  // C] Calling All Api's like List and other Here :
  // 1) Get Service Category List Data
  const GetEmailTemplatesListData = async (
    i,
    searchKeywordValue,
    sortValue,
    TemplateSort
  ) => {
    setLoader(true);
    const pageNoList = i - 1;
    if (pageSize === 0) {
      return;
    }
    try {
      const data = await GetEmailTemplatesList({
        pageSize: pageSize,
        pageNo: pageNoList,
        userKeyID: common.userKeyID,
        organisationID: common.organisationID,
        organisationKeyID: common.organisationKeyID,
        searchKeyword:
          searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        primarySortDirection:
          sortValue === undefined ? primarySortDirection : sortValue,
        PrimarySortColumnName: sortType == "" ? TemplateSort : sortType,
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
            setEmailTemplateList(TemplateListData);
            setTotalRecords(TemplateListData.length);
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

  // Update Function Modal
  // 2) On Click Template Status Button
  const EmailTemplatesChangeStatusDataAndDeleteData = async () => {
    setLoader(true);
    if (modelRequestData.Action === "Status") {
      if (modelRequestData.StatusType === null) {
        try {
          const Data = await EmailTemplatesChangeStatus(
            common.userKeyID,
            modelRequestData.templateKeyID
          );
          if (Data) {
            setLoader(false);
            if (Data?.data?.statusCode === 200) {
              GetEmailTemplatesListData(currentPage);
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
      } else if (modelRequestData.StatusType === "IsDefault") {
        try {
          const Data = await GetChangeIsDefaultStatus(
            common.userKeyID,
            modelRequestData.templateKeyID
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
        const Data = await EmailTemplatesDelete(
          common.userKeyID,
          modelRequestData.templateKeyID
        );
        if (Data) {
          setLoader(false);
          if (Data?.data?.statusCode === 200) {
            GetEmailTemplatesListData(currentPage);

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
  };

  //E] Update Function Modal
  // 1) On Click Service Category Add Button
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
    navigate("/super-admin-email-template-model", {
      state: addEmailTemplateRequestData,
    });
  };
  // 2) On Click Template Edit Button
  const TemplateEditBtnClicked = (Template) => {
    dispatch(
      updateState({
        currentPage: currentPage,
      })
    );
    setModelRequestData({
      ...modelRequestData,
      TemplateID: Template.templateID,
      templateKeyID: Template?.templateKeyID,
    });
  };

  // F] Pagination :
  const handlePageChange = async (pageNumber) => {
    setCurrentPage(pageNumber);
    await GetEmailTemplatesListData(pageNumber); // Call your function with the selected page number
  };

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
    }
  };
  // Handle Search
  const handleSearch = (e) => {
    const searchKeywordValue = e.target.value;
    setSearchKeyword(searchKeywordValue);
    setCurrentPage(1);
    GetEmailTemplatesListData(isCurrentPage, searchKeywordValue);
  };

  // Handle Close
  const handleClose = () => {
    $("#" + "ConfirmModel").modal("hide");
    $("#" + "RecordsAvailablePopupModel").modal("hide");
    setOpenSuccessModal(false);
    setOpenErrorModal(false);
  };

  return (
   <div className="container-fluid">
      {/* <div class="main-content"> */}
        <div class="services page-background">
          <div class="">
            <div class="row">
              <div class="col-lg-12">
                <div class="card">
                  {/* end card header  */}
                  <div class="card-body mb-2">
                    <div id="customerList" style={{ marginTop: "3rem" }}>
                      <div class="bg-light border-bottom px-2">
                          <div className="row">
                <div className="col-md-6 col-6">
                  <div class="page-title-cls">{moduleName}</div>
                </div>
                <div className="col-auto ms-auto">
                  <div className="d-flex justify-content-sm-end add-new-btn">
                    {userAccessData.SuperAdmin_Setting_Email_Template_CanAdd && (
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
          <div>
            <div class="row">
              <div class="col-lg-12">
                <div class="card">
                  {/* end card header  */}

                  <div class="card-body">
                    <div id="customerList">
                      <div class="row g-4 mb-3"></div>
                      <div class="table-responsive table-card mt-2 mb-3 table-padding">
                        <div class="search-box  col-md-3 col-6  width-searchbox mb-2">
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
                                : getPlaceholderTextName(
                                  "Search",
                                  moduleName
                                )
                            }
                          />
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
                                {(userAccessData.SuperAdmin_Setting_Email_Template_CanDelete ||
                                  userAccessData.SuperAdmin_Setting_Email_Template_CanEdit) && (
                                    <> Action</>
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
                                    {isMobile ? (
                                      <>
                                        {Template.templateName.length > 20
                                          ? Template.templateName.substring(
                                            0,
                                            20
                                          ) + "..."
                                          : Template.templateName}
                                      </>
                                    ) : (
                                      <>
                                        {Template.templateName.length > 50 ? (
                                          <Tooltip
                                            title={Template.templateName}
                                          >
                                            {Template.templateName.substring(
                                              0,
                                              50
                                            ) + "..."}
                                          </Tooltip>
                                        ) : (
                                          <>{Template.templateName}</>
                                        )}
                                      </>
                                    )}
                                  </td>

                                  <td className="table-content-font">
                                    {Template.templateType}
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
                                      {userAccessData.SuperAdmin_Setting_Email_Template_CanDelete && (
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
                                                      status:
                                                        Template.isDefaultName,
                                                      templateKeyID:
                                                        Template?.templateKeyID,
                                                      userKeyID:
                                                        common.userKeyID,
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
                                      {userAccessData.SuperAdmin_Setting_Email_Template_CanDelete && (
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
                                                      status:
                                                        Template.statusName,
                                                      templateKeyID:
                                                        Template?.templateKeyID,
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
                                      {userAccessData.SuperAdmin_Setting_Email_Template_CanEdit && (
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
                                      {userAccessData.SuperAdmin_Setting_Email_Template_CanDelete && (
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
                                                    Template?.templateKeyID,
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
                            name="Email Templates"
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
          ErrorMessage={formattedErrorMessage}
        />
        {/* Confirm Modal  */}
        <ConfirmModel
          openErrorModal={openErrorModal}
          openSuccessModal={openSuccessModal}
          modelRequestData={modelRequestData}
          UpdatedStatus={EmailTemplatesChangeStatusDataAndDeleteData}
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
          message={`${modelRequestData.Action === "Delete"
            ? `${moduleName} ${modelRequestData.templateName}`
            : "Status has been changed successfully!"
            }`}
        />
        </div>
        </div>
        </div>
        </div>
        </div>
        <Footer />
      </div>
      {/* end back-to-top */}
    </div>
  );
}

export default SuperAdminEmailTemplateList;
