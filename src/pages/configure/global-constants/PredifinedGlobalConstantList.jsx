/* global $ */
import React, { useContext, useEffect, useState } from "react";
import "./PredefineGlobalConstant.css";
import CommonButtonComponent from "../../../components/CommonButtonComponent";
import GlobalConstantModal from "./GlobalConstantModel";
import ConfirmModel from "../../../components/ConfirmationBox";
import {
  GetGlobalConstantList,
  DeleteGlobalConstant,
  GlobalConstantChangeStatus,
  GetGlobalConstantModel,
  CopyGlobalConstant,
} from "../../../redux/Services/Config/GlobalConstantApi";
import PaginationComponent from "../../../components/PaginationModel";
import { useSelector } from "react-redux";
import Android12Switch from "../../../components/AndroidSwitch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Tooltip from "@mui/material/Tooltip";
import NoResultFoundModel from "../../../components/NoResultFoundModel";
import { AuthContextProvider } from "../../../AuthContext/AuthContext";
import SuccessModal from "../../../components/SuccessModal";
import ErrorModel from "../../../components/ErrorModel";
import Footer from "../../../components/Footer";
import RecordsAvailablePopupModel from "../../../components/RecordsAvailablePopupModel";

function Global_Constants() {
  // A] States Declaration :
  let getGlobalConstantListApiCallCount = 0;
  const [totalRecords, setTotalRecords] = useState(-1);

  const moduleName = "Global Constant";
  const [globalConstantList, setGlobalConstantList] = useState([]);
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [modelRequestData, setModelRequestData] = useState({
    globalPricingDriverKeyID: null,
    driverName: null,
    keyID: null,
    status: "",
    Action: "",
    userKeyID: null,
    Type: null,
  });
  const [primarySortDirectionObj, setPrimarySortDirectionObj] = useState({
    DriverNameSort: null,
    ProfessionTypeSort: null,
    TypeSort: null,
  });
  const [sortType, setSortType] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const common = useSelector((state) => state.Storage); //Getting Logged Users Details From Persist Storage of redux hooks
  const [primarySortDirection, setPrimarySortDirection] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState(null);
  const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
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
    formatValue,
  } = useContext(AuthContextProvider);
  const pageSize = isMobile ? isMobileRecords : desktopRecords;
  const [showProfessionType, setShowProfessionType] = useState(
    common.organisationKeyID === null || common.professionTypeLists.length > 1
  );
  const formattedErrorMessage = handleErrorMessage(errorMessage);
  // B] Initial useEffect :
  // 1) Will Call Initial Api Like List Api
  useEffect(() => {
    setTopbar("block");
  }, []);

  useEffect(() => {
    GetGlobalConstantListData(1, null, null, null);
  }, []);

  //2) This useEffect will trigger when we successfully add or update record from popup model
  useEffect(() => {
    if (isAddUpdateActionDone) {
      if (modelRequestData.Action === null) {
        setSearchKeyword(null);
        setPrimarySortDirection(null);
        setCurrentPage(1);
        setSortType(null);
        GetGlobalConstantListData(1, null, null, null);
      } else {
        GetGlobalConstantListData(currentPage);
      }

      setIsAddUpdateActionDone(false);
    }
  }, [isAddUpdateActionDone]);

  // C] Calling All Api's like List and other Here :
  // 1) Global Constant List Data
  const GetGlobalConstantListData = async (
    i,
    searchKeywordValue,
    sortValue,
    GlobalConstantSortType
  ) => {
    setLoader(true);
    const pageNoList = i - 1;
    try {
      const data = await GetGlobalConstantList({
        pageSize: pageSize,
        pageNo: pageNoList,
        OrganisationKeyID: common.organisationKeyID,
        searchKeyword:
          searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        primarySortDirection:
          sortValue === undefined ? primarySortDirection : sortValue,
        PrimarySortColumnName:
          GlobalConstantSortType === null
            ? null
            : GlobalConstantSortType == undefined ||
              GlobalConstantSortType == ""
              ? sortType
              : GlobalConstantSortType !== null
                ? GlobalConstantSortType
                : null,
      });
      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          getGlobalConstantListApiCallCount = 0;
          if (data?.data?.responseData?.data) {
            const totalCount = data.data.totalCount;
            const globalConstantListData = data.data.responseData.data;
            if (pageNoList > 0 && globalConstantListData.length === 0) {
              let newPaneNo = Number(pageNoList);
              if (newPaneNo > 1) {
                newPaneNo = newPaneNo - 1;
              }
              GetGlobalConstantListData(
                newPaneNo,
                searchKeywordValue,
                sortValue,
                GlobalConstantSortType
              );
              setCurrentPage(pageNoList);
              return;
            }
            setListCount(totalCount);
            setGlobalConstantList(globalConstantListData);
            setTotalRecords(globalConstantListData.length);
          }
        } else {
          if (getGlobalConstantListApiCallCount < maxCountToRecallApi) {
            getGlobalConstantListApiCallCount += 1;
            setTimeout(function () {
              GetGlobalConstantListData(
                i,
                searchKeywordValue,
                sortValue,
                GlobalConstantSortType
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

  // D] Event Handling Functions will call here.
  // 1) On Click Global Constant Add Button
  const GlobalConstantEditBtnClicked = async (GlobalConstant, type) => {
    if (type === "editPredefined") {
      setLoader(true);
      const data = await GetGlobalConstantModel(
        GlobalConstant.globalPricingDriverKeyID,
        true
      );
      if (data?.data?.statusCode === 200) {
        setLoader(false);
        $("#" + "addUpdateModal").modal("show");
        setModelRequestData({
          ...modelRequestData,
          globalPricingDriverKeyID: GlobalConstant.globalPricingDriverKeyID,
          Action: "Update",
          Type: true,
        });
      } else {
        setLoader(false);
        setErrorMessage(data?.response?.data?.errorMessage);
        setOpenErrorModal(true);
      }
    } else {
      setModelRequestData({
        ...modelRequestData,
        globalPricingDriverKeyID: GlobalConstant.globalPricingDriverKeyID,
        Action: "Update",
        Type: null,
      });
    }
  };

  // E] Event Handling Functions will call here.
  // 1) On Click Global Constant Add Button
  const GlobalConstantAddBtnClicked = () => {
    {
      setModelRequestData({
        ...modelRequestData,
        globalPricingDriverKeyID: null,
        Action: null,
      });
    }
  };

  // Update Function Modal
  // 2) On Click Global Constant Status Button
  const GlobalConstantChangeStatusDataAndDeleteData = async () => {
    setLoader(true);
    if (modelRequestData.Action === "Status") {
      try {
        const Data = await GlobalConstantChangeStatus(
          modelRequestData.globalPricingDriverKeyID,
          modelRequestData.userKeyID
        );
        if (Data) {
          setLoader(false);
          if (Data?.data?.statusCode === 200) {
            if (
              Data?.data?.responseData.globalConstantExistsInServices.length !==
              0
            ) {
              const servicePackageNames =
                Data?.data?.responseData.globalConstantExistsInServices.map(
                  (item) => item.serviceName
                );
              setModelRequestData({
                ...modelRequestData,
                Action: "GlobalConstantWarning",
                message: `Following services are assigned to the selected ${moduleName.toLowerCase()}.You must remove the services from this ${moduleName.toLowerCase()} before attempting to mark it as InActive.`,
                ServiceName: servicePackageNames,
              });
              $("#" + "ConfirmModel").modal("hide");
              $("#" + "RecordsAvailablePopupModel").modal("show");
              GetGlobalConstantListData(currentPage);
            } else {
              GetGlobalConstantListData(currentPage);
              setOpenSuccessModal(true);
            }
          } else {
            setErrorMessage(Data?.response?.data?.errorMessage);
            setOpenErrorModal(true);
          }
          GetGlobalConstantListData(currentPage);
        }
      } catch (error) {
        console.log(error);
      }
    } else if (modelRequestData.Action === "Delete") {
      try {
        const Data = await DeleteGlobalConstant(
          modelRequestData.globalPricingDriverKeyID,
          modelRequestData.userKeyID
        );
        if (Data) {
          setLoader(false);
          if (Data?.data?.statusCode === 200) {
            if (
              Data?.data?.responseData.globalConstantExistsInServices.length !==
              0
            ) {
              const servicePackageNames =
                Data?.data?.responseData.globalConstantExistsInServices.map(
                  (item) => item.serviceName
                );
              setModelRequestData({
                ...modelRequestData,
                Action: "GlobalConstantWarning",
                message: `Following services are assigned to the selected ${moduleName.toLowerCase()}.You must remove the services from this ${moduleName.toLowerCase()} before attempting to mark it as InActive.`,
                ServiceName: servicePackageNames,
              });
              $("#" + "ConfirmModel").modal("hide");
              $("#" + "RecordsAvailablePopupModel").modal("show");
              GetGlobalConstantListData(currentPage);
            } else {
              GetGlobalConstantListData(currentPage);
              setOpenSuccessModal(true);
            }
          } else {
            setErrorMessage(Data?.response?.data?.errorMessage);
            setOpenErrorModal(true);
          }
          GetGlobalConstantListData(currentPage);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Copy Record
  const CopyGlobalConstantData = async() => {
    if(!common.userKeyID) return;
    try {
      setLoader(true);
      const data = await CopyGlobalConstant(modelRequestData.globalPricingDriverKeyID,common.userKeyID);
      if(data?.data?.statusCode === 200) {
        setLoader(false);
        setOpenSuccessModal(true);
        GetGlobalConstantListData(currentPage);
      }
      else {
        setLoader(false);
        setErrorMessage(data?.data?.errorMessage);
        setOpenErrorModal(true);
      }
    }
    catch(error) {
      console.error(error);
    }
  }
  // F] Pagination :
  const HandlePageChange = async (pageNumber) => {
    setCurrentPage(pageNumber);
    await GetGlobalConstantListData(pageNumber); // Call your function with the selected page number
  };

  // E] Sorting
  const handleSort = (sortValue, GlobalConstantSortType) => {
    if (GlobalConstantSortType == "DriverName") {
      setPrimarySortDirection(sortValue);
      setPrimarySortDirectionObj({
        ...primarySortDirectionObj,
        DriverNameSort: sortValue,
      });
      setCurrentPage(1);
      GetGlobalConstantListData(
        1,
        searchKeyword,
        sortValue,
        GlobalConstantSortType
      );
    } else if (GlobalConstantSortType == "ProfessionType") {
      setPrimarySortDirection(sortValue);
      setPrimarySortDirectionObj({
        ...primarySortDirectionObj,
        ProfessionTypeSort: sortValue,
      });
      setCurrentPage(1);
      GetGlobalConstantListData(
        1,
        searchKeyword,
        sortValue,
        GlobalConstantSortType
      );
    }
  };

  //Searching
  const HandleSearch = (e) => {
    const searchKeywordValue = e.target.value;
    setSearchKeyword(searchKeywordValue);
    setCurrentPage(1);
    GetGlobalConstantListData(1, searchKeywordValue);
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
                  <div class="page-title-cls">Global Constants</div>
                </div>
                <div className="col-md-6 col-6">
                  <div className="d-flex justify-content-sm-end add-new-btn">
                    {((userAccessData.Admin_Config_Global_Constant_CanAdd &&
                      common.organisationKeyID !== null) ||
                      (userAccessData.SuperAdmin_Config_Global_Constant_CanAdd &&
                        common.organisationKeyID === null)) && (
                        <CommonButtonComponent
                          title={getCrudButtonToolTipName("Add", moduleName)}
                          AddBtn={() => GlobalConstantAddBtnClicked()}
                          dataBsTarget="#addUpdateModal"
                          data_bs_toggle="modal"
                          name={getCrudButtonTextName("Add", moduleName)}
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
                        <div class="search-box col-md-3 col-6 width-searchbox mb-2">
                          <i class="ri-search-line search-icon"></i>
                          <input
                            type="text"
                            value={searchKeyword}
                            onChange={(e) => {
                              HandleSearch(e);
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
                                style={{
                                  width: "36%",
                                }}
                              >
                                Driver Name
                                {primarySortDirectionObj.DriverNameSort ===
                                  "desc" && (
                                    <i
                                      onClick={() => {
                                        setSortType("DriverName");
                                        handleSort("asc", "DriverName");
                                      }}
                                      style={{ cursor: "pointer" }}
                                      class="fas fa-sort-alpha-up ml-1"
                                    ></i>
                                  )}
                                {(primarySortDirectionObj.DriverNameSort ===
                                  null ||
                                  primarySortDirectionObj.DriverNameSort ===
                                  "asc") && (
                                    <i
                                      onClick={() => {
                                        setSortType("DriverName");
                                        handleSort(
                                          primarySortDirectionObj.DriverNameSort ===
                                            null
                                            ? "asc"
                                            : "desc",
                                          "DriverName"
                                        );
                                      }}
                                      style={{ cursor: "pointer" }}
                                      class="fas fa-sort-alpha-down ml-1"
                                    ></i>
                                  )}
                              </td>
                              <td className="tr-table-class text-white profession-type-column">
                                {showProfessionType && (
                                  <>
                                    Profession Type
                                    {primarySortDirectionObj.ProfessionTypeSort ===
                                      "desc" && (
                                        <i
                                          onClick={() => {
                                            setSortType("ProfessionType");
                                            handleSort("asc", "ProfessionType");
                                          }}
                                          style={{ cursor: "pointer" }}
                                          class="fas fa-sort-alpha-up ml-1"
                                        ></i>
                                      )}
                                    {(primarySortDirectionObj.ProfessionTypeSort ===
                                      null ||
                                      primarySortDirectionObj.ProfessionTypeSort ===
                                      "asc") && (
                                        <i
                                          onClick={() => {
                                            setSortType("ProfessionType");
                                            handleSort(
                                              primarySortDirectionObj.ProfessionTypeSort ===
                                                null
                                                ? "asc"
                                                : "desc",
                                              "ProfessionType"
                                            );
                                          }}
                                          style={{ cursor: "pointer" }}
                                          class="fas fa-sort-alpha-down ml-1"
                                        ></i>
                                      )}
                                  </>
                                )}
                              </td>
                              <td className="tr-table-class  text-white">
                                Type
                              </td>
                              <td className="tr-table-class  text-white">
                                Value
                              </td>

                              <td className="tr-table-class  text-white">
                                Status
                              </td>
                              <td className="tr-table-class  text-white">
                                {((userAccessData.Admin_Config_Global_Constant_CanEdit &&
                                  common.organisationKeyID !== null) ||
                                  (userAccessData.SuperAdmin_Config_Global_Constant_CanEdit &&
                                    common.organisationKeyID === null) ||
                                  (userAccessData.Admin_Config_Global_Constant_CanDelete &&
                                    common.organisationKeyID !== null) ||
                                  (userAccessData.SuperAdmin_Config_Global_Constant_CanDelete &&
                                    common.organisationKeyID === null)) && (
                                    <>Action</>
                                  )}
                              </td>
                            </tr>
                          </thead>
                          <tbody class="list form-check-all table-content-font">
                            {globalConstantList
                              .slice(
                                0,
                                isMobile ? isMobileRecords : desktopRecords
                              )
                              .map((GlobalConstant) => {
                                return (
                                  <tr class="table_new">
                                    <td className="table-content-font">
                                      {GlobalConstant.notifySAChanges !== null && common.organisationKeyID !== null && (
                                        <>
                                          <Tooltip
                                            title="View System Administrator Changes"

                                          >
                                            <span onClick={() =>
                                              GlobalConstantEditBtnClicked(
                                                GlobalConstant, "editPredefined"
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
                                          {GlobalConstant.driverName.length > 20
                                            ? GlobalConstant.driverName
                                              .substring(0, 20)
                                              .replace(/\b\w/g, (l) =>
                                                l.toUpperCase()
                                              ) + "..."
                                            : GlobalConstant.driverName
                                              .substring(0, 20)
                                              .replace(/\b\w/g, (l) =>
                                                l.toUpperCase()
                                              )}
                                        </>
                                      ) : (
                                        <>
                                          {GlobalConstant.driverName.length >
                                            63 ? (
                                            <Tooltip
                                              title={GlobalConstant.driverName}
                                            >
                                              {GlobalConstant.driverName
                                                .substring(0, 63)
                                                .replace(/\b\w/g, (l) =>
                                                  l.toUpperCase()
                                                ) + "..."}
                                            </Tooltip>
                                          ) : (
                                            <>
                                              {GlobalConstant.driverName
                                                .replace(/\b\w/g, (l) =>
                                                  l.toUpperCase()
                                                )}
                                            </>
                                          )}
                                        </>
                                      )}

                                    </td>
                                    <td className="table-content-font">
                                      {showProfessionType &&
                                        GlobalConstant.professionTypeNames}
                                    </td>

                                    <td className="table-content-font">
                                      {GlobalConstant.driverTypeName}
                                    </td>
                                    <td className="table-content-font">
                                      {" "}
                                      {formatValue(GlobalConstant.driverValue)}
                                      {/* {Number(GlobalConstant.driverValue)
                                        .toFixed(2)
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} */}
                                    </td>
                                    <td className="Switch table-content-font">
                                      <div
                                        style={{
                                          alignItems: "none",
                                          marginLeft:
                                            ((userAccessData.Admin_Config_Global_Constant_CanEdit &&
                                              common.organisationKeyID !==
                                              null) ||
                                              (userAccessData.SuperAdmin_Config_Global_Constant_CanEdit &&
                                                common.organisationKeyID ===
                                                null)) &&
                                              ((userAccessData.Admin_Config_Global_Constant_CanDelete &&
                                                common.organisationKeyID !==
                                                null) ||
                                                (userAccessData.SuperAdmin_Config_Global_Constant_CanDelete &&
                                                  common.organisationKeyID ===
                                                  null))
                                              ? ""
                                              : "10px",
                                        }}
                                        class="d-flex gap-2 "
                                      >
                                        <div style={{ width: "50px" }}>
                                          {" "}
                                          {GlobalConstant.statusName}
                                        </div>
                                        {((userAccessData.Admin_Config_Global_Constant_CanDelete &&
                                          common.organisationKeyID !== null) ||
                                          (userAccessData.SuperAdmin_Config_Global_Constant_CanDelete &&
                                            common.organisationKeyID ===
                                            null)) && (
                                            <Tooltip
                                              title={getCrudButtonToolTipName(
                                                "Change Status"
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
                                                            GlobalConstant.statusName,
                                                          globalPricingDriverKeyID:
                                                            GlobalConstant.globalPricingDriverKeyID,
                                                          userKeyID:
                                                            common.userKeyID,
                                                          Action: "Status",
                                                        })
                                                      }
                                                      checked={
                                                        GlobalConstant.statusName ===
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
                                      <div class="d-flex gap-2 ">
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
                                                  driverName: GlobalConstant.driverName,
                                                  Action: "Copy",
                                                  globalPricingDriverKeyID: GlobalConstant.globalPricingDriverKeyID,
                                                  userKeyID: common.userKeyID
                                                })
                                              }
                                            >
                                              <i class="fa-solid fa-copy"></i>
                                            </button>
                                          </div>
                                        </Tooltip>
                                        {((userAccessData.Admin_Config_Global_Constant_CanEdit &&
                                          common.organisationKeyID !== null) ||
                                          (userAccessData.SuperAdmin_Config_Global_Constant_CanEdit &&
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
                                                    GlobalConstantEditBtnClicked(
                                                      GlobalConstant
                                                    )
                                                  }
                                                  class="btn btn-sm btn-success edit-item-btn actionButtonsStyle"
                                                  data-bs-toggle="modal"
                                                  data-bs-target="#addUpdateModal"
                                                >
                                                  <i class="ri-pencil-fill"></i>
                                                </button>
                                              </div>
                                            </Tooltip>
                                          )}
                                        {((userAccessData.Admin_Config_Global_Constant_CanDelete &&
                                          common.organisationKeyID !== null) ||
                                          (userAccessData.SuperAdmin_Config_Global_Constant_CanDelete &&
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
                                                      globalPricingDriverKeyID:
                                                        GlobalConstant.globalPricingDriverKeyID,
                                                      driverName:
                                                        GlobalConstant.driverName,
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
                      onPageChange={HandlePageChange}
                    />
                  )}

                  {/* end card  */}
                </div>
                {/* end col */}
              </div>
              {/* end col  */}
            </div>
            {/* end row */}

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
              UpdatedStatus={modelRequestData.Action === "Delete" || modelRequestData.Action === "Status" ? GlobalConstantChangeStatusDataAndDeleteData : CopyGlobalConstantData}
            />
            <RecordsAvailablePopupModel
              handleClose={handleClose}
              openErrorModal={openErrorModal}
              openSuccessModal={openSuccessModal}
              modelRequestData={modelRequestData}
              UpdatedStatus={GlobalConstantChangeStatusDataAndDeleteData}
            />

            {/* Success Modal  */}
            <SuccessModal
              handleClose={handleClose}
              setOpenSuccessModal={setOpenSuccessModal}
              openSuccessModal={openSuccessModal}
              modelAction={modelRequestData.Action}
              message={`${
                modelRequestData.Action === "Delete"
                  ? `${moduleName} ${modelRequestData.driverName}`
                  : modelRequestData.Action === "Copy"
                  ? `Copy of ${modelRequestData.driverName} has been created successfully!`
                  : "Status has been changed successfully!"
              }`}
            />
            {/* Model */}
            <GlobalConstantModal
              class="modal fade"
              id="addUpdateModal"
              tabIndex="-1"
              aria_labelledby="exampleModalLabel"
              aria_hidden="true"
              setIsAddUpdateActionDone={setIsAddUpdateActionDone}
              modelRequestData={modelRequestData}
            />
          </div>
          {/* container-fluid  */}
        </div>
        {/* End Page-content */}
        <Footer />
      </div>
    </div>
  );
}

export default Global_Constants;
