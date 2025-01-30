/* global $ */
import React, { useContext, useEffect, useState } from "react";
import "./Package.css";
import CommonButtonComponent from "../../../components/CommonButtonComponent";
import { useNavigate } from "react-router";
import Android12Switch from "../../../components/AndroidSwitch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { AuthContextProvider } from "../../../AuthContext/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import {
  GetPackageList,
  GetServicePackageModel,
  ServicePackageChangeStatus,
  ServicePackageDelete,
} from "../../../redux/Services/Config/PackageApi";
import PaginationComponent from "../../../components/PaginationModel";
import NoResultFoundModel from "../../../components/NoResultFoundModel";
import ErrorModel from "../../../components/ErrorModel";
import ConfirmModel from "../../../components/ConfirmationBox";
import SuccessModal from "../../../components/SuccessModal";
import Footer from "../../../components/Footer";
import RecordsAvailablePopupModel from "../../../components/RecordsAvailablePopupModel";
import { updateState } from "../../../redux/Persist";
import FilterModel from "../../../components/FilterModel";
const Predefined_Package = () => {
  const moduleName = "Package";
  const dispatch = useDispatch();
  //A]Declare state
  const common = useSelector((state) => state.Storage); //Getting Logged Users Details From Persist Storage of redux hooks
  const navigate = useNavigate();
  const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
  const [totalRecords, setTotalRecords] = useState(-1);
  const {
    setLoader,
    setTopbar,
    isMobile,
    setListCount,
    listCount,
    desktopRecords,
    isMobileRecords,
    getCrudButtonTextName,
    getPlaceholderTextName,
    getCrudButtonToolTipName,
    userAccessData,
    EngagementName,
    proposalName,
    handleErrorMessage,
    formatValue,
  } = useContext(AuthContextProvider);

  const [PackagesList, setPackageList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [businessNatureID, setBusinessNatureID] = useState(null);
  const [prospectType, setProspectType] = useState(null);
  const [isFilterApply, setIsFilterApply] = useState(false);
  const [isAddUpdateActionDone, setIAddUpdateActionDone] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    common.currentPage === "" ? 1 : common.currentPage
  );
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [modelRequestData, setModelRequestData] = useState({
    servicePackageKeyID: null,
    servicePackageName: null,
    status: null,
    Action: "",
    userKeyID: null,
    Type: null,
  });
  const formattedErrorMessage = handleErrorMessage(errorMessage);
  const [primarySortDirection, setPrimarySortDirection] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showProfessionType, setShowProfessionType] = useState(
    common.organisationKeyID === null || common.professionTypeLists.length > 1
  );
  const pageSize = isMobile ? isMobileRecords : desktopRecords;
  const isCurrentPage =
    common.currentPage === "" ? currentPage : common.currentPage;
  // B] Initial useEffect :
  // 1) Will Call Initial Api Like List Api
  useEffect(() => {
    setTopbar("block");
    GetPackageListData(isCurrentPage);

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
        GetPackageListData(isCurrentPage, null, null);
      } else {
        GetPackageListData(isCurrentPage);
      }
      setIAddUpdateActionDone(false);
    }
  }, [isAddUpdateActionDone]);

  useEffect(() => {
    if (modelRequestData.Action === "Add") {
      setTopbar("none");
      navigate("/add-update-package", { state: modelRequestData });
    } else if (
      modelRequestData.servicePackageKeyID !== null &&
      modelRequestData.Action === "Update"
    ) {
      setTopbar("none");
      navigate("/add-update-package", { state: modelRequestData });
    }
  }, [modelRequestData.Action]);

  // C] Calling All Api's like List and other Here :
  // 1) Get Package List Data
  const GetPackageListData = async (
    i,
    searchKeywordValue,
    sortValue,
    businessNatureId,
    businessTypeId
  ) => {
    setLoader(true);
    const pageNoList = i - 1;
    try {
      const data = await GetPackageList({
        pageSize: Number(pageSize) - 1,
        pageNo: pageNoList,
        organisationID: common.organisationID,
        organisationKeyID: common.organisationKeyID,
        SearchKeyword:
          searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        primarySortDirection:
          sortValue === undefined ? primarySortDirection : sortValue,
        businessTypeID:
          businessTypeId === undefined ? prospectType : businessTypeId,
        businessNatureID:
          businessNatureId === undefined ? businessNatureID : businessNatureId,
      });
      if (data) {
        setLoader(false);
        if (data?.data?.statusCode === 200) {
          if (data?.data?.responseData?.data) {
            const totalCount = data.data.totalCount;
            const PackageListData = data.data.responseData.data;
            if (pageNoList > 0 && PackageListData.length === 0) {
              let newPaneNo = Number(pageNoList);
              if (newPaneNo > 1) {
                newPaneNo = newPaneNo - 1;
              }
              GetPackageListData(newPaneNo, searchKeywordValue, sortValue);
              setCurrentPage(pageNoList);
              return;
            }
            const modifiedPackage = PackageListData.map((item) => ({
              ...item,
              recurringOriginalPrice: formatValue(item.recurringOriginalPrice),
              recurringDefaultPrice: formatValue(item.recurringDefaultPrice),
              recurringMinPrice: formatValue(item.recurringMinPrice),
              oneOffOriginalPrice: formatValue(item.oneOffOriginalPrice),
              oneOffDefaultPrice: formatValue(item.oneOffDefaultPrice),
              oneOffMinPrice: formatValue(item.oneOffMinPrice),
            }));
            setListCount(totalCount);
            setPackageList(modifiedPackage);
            setTotalRecords(modifiedPackage.length);
          }
        } else {
          setErrorMessage(data?.data?.errorMessage);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Update Function Modal
  // 2) On Click Package Status Button
  const PackageChangeStatusDataAndDeleteData = async () => {
    setLoader(true);
    if (modelRequestData.Action === "Status") {
      try {
        const Data = await ServicePackageChangeStatus(
          modelRequestData.servicePackageKeyID,
          modelRequestData.userKeyID
        );
        if (Data) {
          setLoader(false);
          if (Data?.data?.statusCode === 200) {
            if (
              Data?.data?.responseData.servicePackageExistsInQuotes.length !== 0
            ) {
              const servicePackageNames =
                Data?.data?.responseData.servicePackageExistsInQuotes.map(
                  (item) => item.quoteName
                );
              setModelRequestData({
                ...modelRequestData,
                Action: "PackageListWarning",
                message: `Following ${proposalName}/${EngagementName} are assigned to the selected ${moduleName}.You must remove the ${proposalName}/${EngagementName} from this ${moduleName} before attempting to mark it as InActive.`,
                ServiceName: servicePackageNames,
              });
              $("#" + "ConfirmModel").modal("hide");
              $("#" + "RecordsAvailablePopupModel").modal("show");
              GetPackageListData(isCurrentPage);
            } else {
              GetPackageListData(isCurrentPage);
              setOpenSuccessModal(true);
            }
          } else {
            setErrorMessage(Data?.response?.data?.errorMessage);
            setOpenErrorModal(true);
          }
          GetPackageListData(currentPage);
        }
      } catch (error) {
        console.log(error);
      }
    } else if (modelRequestData.Action === "Delete") {
      try {
        const Data = await ServicePackageDelete(
          modelRequestData.servicePackageKeyID,
          modelRequestData.userKeyID
        );
        if (Data) {
          setLoader(false);
          if (Data?.data?.statusCode === 200) {
            if (
              Data?.data?.responseData.servicePackageExistsInQuotes.length !== 0
            ) {
              const servicePackageNames =
                Data?.data?.responseData.servicePackageExistsInQuotes.map(
                  (item) => item.serviceName
                );
              setModelRequestData({
                ...modelRequestData,
                Action: "PackageListWarning",
                message: `Following ${proposalName}/${EngagementName} are assigned to the selected ${moduleName}.You must remove the ${proposalName}/${EngagementName} from this ${moduleName} before attempting to mark it as InActive.`,
                ServiceName: servicePackageNames,
              });
              $("#" + "ConfirmModel").modal("hide");
              $("#" + "RecordsAvailablePopupModel").modal("show");
              GetPackageListData(isCurrentPage);
            } else {
              GetPackageListData(isCurrentPage);
              setOpenSuccessModal(true);
            }
          } else {
            setErrorMessage(Data?.response?.data?.errorMessage);
            setOpenErrorModal(true);
          }
          GetPackageListData(currentPage);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  //E] Update Function Modal
  // 1) On Click Service Category Add Button
  const PackageAddBtnClicked = () => {
    {
      setModelRequestData({
        ...modelRequestData,
        servicePackageKeyID: null,
        Action: "Add",
      });
    }
    setTopbar("none");
  };
  // 2) On Click Package Edit Button
  const PackageEditBtnClicked = async (Package, type) => {
    if (type === "editPredefined") {
      setLoader(true);
      const data = await GetServicePackageModel(
        Package.servicePackageKeyID,
        true
      );
      if (data?.data?.statusCode === 200) {
        setLoader(false);

        setModelRequestData({
          ...modelRequestData,
          servicePackageName: Package.servicePackageName,
          servicePackageKeyID: Package.servicePackageKeyID,
          Action: "Update",
          Type: true,
          moduleName: moduleName,
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
        servicePackageName: Package.servicePackageName,
        servicePackageKeyID: Package.servicePackageKeyID,
        Action: "Update",
        Type: null,
      });
    }
  };

  // F] Pagination :
  const handlePageChange = async (pageNumber) => {
    setCurrentPage(pageNumber);
    await GetPackageListData(pageNumber); // Call your function with the selected page number
  };

  // G] Sorting & Handle Function:
  const handleSort = (sortValue) => {
    setPrimarySortDirection(sortValue);
    setCurrentPage(1);
    GetPackageListData(isCurrentPage, searchKeyword, sortValue);
  };
  //Handle Search
  const handleSearch = (e) => {
    const searchKeywordValue = e.target.value;
    setSearchKeyword(searchKeywordValue);
    setCurrentPage(1);
    GetPackageListData(isCurrentPage, searchKeywordValue);
  };
  // handle Close
  const handleClose = () => {
    $("#" + "ConfirmModel").modal("hide");
    $("#" + "RecordsAvailablePopupModel").modal("hide");
    if (openErrorModal && formattedErrorMessage.includes("default state")) {
      GetPackageListData(
        currentPage,
        searchKeyword,
        primarySortDirection,
        businessNatureID,
        prospectType
      );
    }
    setOpenSuccessModal(false);
    setOpenErrorModal(false);
  };
  //Apply Filter
  const ApplyFilter = () => {
    if (
      (businessNatureID !== null && businessNatureID !== "") ||
      (prospectType !== null && prospectType !== "")
    ) {
      setIsFilterApply(true);
    } else {
      setIsFilterApply(false);
    }
    GetPackageListData(
      1,
      searchKeyword,
      primarySortDirection,
      businessNatureID,
      prospectType
    );
  };
  const ClearFilter = () => {
    setIsFilterApply(false);
    setBusinessNatureID(null);
    setProspectType(null);
    GetPackageListData(1, searchKeyword, primarySortDirection, null, null);
  };
  return (
    <div>
      <div class="main-content">
        <div class="services page-background">
          <div class="page-info-header page-info-strip">
            <div class="container">
              <div className="row">
                <div className="col-md-6 col-6">
                  <div class="page-title-cls">Package</div>
                </div>
                <div className="col-md-6 col-6">
                  <div className="d-flex justify-content-sm-end add-new-btn">
                    {((userAccessData.Admin_Config_ServicePackage_CanAdd &&
                      common.organisationKeyID !== null) ||
                      (userAccessData.SuperAdmin_Config_ServicePackage_CanAdd &&
                        common.organisationKeyID === null)) && (
                        <CommonButtonComponent
                          title={getCrudButtonToolTipName("Add", moduleName)}
                          name={getCrudButtonTextName("Add", moduleName)}
                          AddBtn={() => PackageAddBtnClicked()}
                        />
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="container" id="tablesections">
            <div class="row">
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
                                        isMobile
                                          ? "Search"
                                          : getPlaceholderTextName(
                                            "Search",
                                            moduleName
                                          )
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
                                        {/* <i class="ri-pencil-fill"></i> */}

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
                                        <div>
                                          <button
                                            className="btn btn-md btn-success create-Filter-item-btn text-nowrap"
                                            onClick={ClearFilter} // Corrected from onclick to onClick
                                          >
                                            <span>Clear Filter</span>
                                          </button>
                                        </div>
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
                          <thead class="table-light table-header-font">
                            <tr className="head-row">
                              <td
                                className="tr-table-class text-white"
                                style={{ width: "20%" }}
                              >
                                Name{" "}
                                {primarySortDirection === "desc" && (
                                  <i
                                    onClick={() => {
                                      handleSort("asc");
                                    }}
                                    class="fas fa-sort-alpha-up ml-1"
                                  ></i>
                                )}
                                {(primarySortDirection === null ||
                                  primarySortDirection === "asc") && (
                                    <i
                                      onClick={() => {
                                        handleSort(
                                          primarySortDirection === null
                                            ? "asc"
                                            : "desc"
                                        );
                                      }}
                                      class="fas fa-sort-alpha-down  ml-1"
                                    ></i>
                                  )}
                              </td>
                              <td className="tr-table-class text-white profession-type-column">
                                {showProfessionType && <>Profession Type</>}
                              </td>
                              <td className="tr-table-class text-white">
                                Original Price
                              </td>
                              <td className="tr-table-class text-white">
                                Default Price
                              </td>
                              <td className="tr-table-class text-white">
                                Minimum Price
                              </td>
                              <td className="tr-table-class text-white">
                                Status
                              </td>
                              <td className="tr-table-class text-white">
                                {((userAccessData.Admin_Config_ServicePackage_CanEdit &&
                                  common.organisationKeyID !== null) ||
                                  (userAccessData.SuperAdmin_Config_ServicePackage_CanEdit &&
                                    common.organisationKeyID === null) ||
                                  (userAccessData.Admin_Config_ServicePackage_CanDelete &&
                                    common.organisationKeyID !== null) ||
                                  (userAccessData.SuperAdmin_Config_ServicePackage_CanDelete &&
                                    common.organisationKeyID === null)) && (
                                    <>Action</>
                                  )}
                              </td>
                            </tr>
                          </thead>
                          <tbody class="list form-check-all">
                            {PackagesList?.slice(
                              0,
                              isMobile ? isMobileRecords : desktopRecords
                            ).map((Package) => {
                              return (
                                <tr class="table_new table-content-font">
                                  <td className="table-content-font">
                                    {Package.notifySAChanges !== null && common.organisationKeyID !== null && (
                                      <>
                                        <Tooltip
                                          title="View System Administrator Changes"

                                        >
                                          <span onClick={() =>
                                            PackageEditBtnClicked(Package, "editPredefined")

                                          } className="UpdateConfigValue" ><i class="fa fa-regular fa-bell"></i></span>
                                        </Tooltip>
                                      </>
                                    )}
                                    {Package.needToUpdate && (
                                      <span class="text-danger">*</span>
                                    )}

                                    {isMobile ? (
                                      <>
                                        {Package.servicePackageName.length > 20
                                          ? Package.servicePackageName
                                            .substring(0, 20)
                                            .toLowerCase()
                                            .replace(/\b\w/g, (l) =>
                                              l.toUpperCase()
                                            ) + "..."
                                          : Package.servicePackageName
                                            .substring(0, 20)
                                            .toLowerCase()
                                            .replace(/\b\w/g, (l) =>
                                              l.toUpperCase()
                                            )}
                                      </>
                                    ) : (
                                      <>
                                        {Package.servicePackageName.length >
                                          35 ? (
                                          !showProfessionType ? (
                                            <Tooltip
                                              title={Package.servicePackageName}
                                            >
                                              {Package.servicePackageName
                                                .substring(0, 80)
                                                .toLowerCase()
                                                .replace(/\b\w/g, (l) =>
                                                  l.toUpperCase()
                                                ) + "..."}
                                            </Tooltip>
                                          ) : (
                                            <Tooltip
                                              title={Package.servicePackageName}
                                            >
                                              {Package.servicePackageName
                                                .substring(0, 35)
                                                .toLowerCase()
                                                .replace(/\b\w/g, (l) =>
                                                  l.toUpperCase()
                                                ) + "..."}
                                            </Tooltip>
                                          )
                                        ) : (
                                          <>
                                            {Package.servicePackageName
                                              .toLowerCase()
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
                                      Package.professionTypeNames}
                                  </td>
                                  <td className="table-content-font">
                                    <div>
                                      Recurring:{" "}
                                      <b> {Package.recurringOriginalPrice}</b>
                                    </div>
                                    <div>
                                      One Off:{" "}
                                      <b> {Package.oneOffOriginalPrice}</b>
                                    </div>
                                  </td>
                                  <td className="table-content-font">
                                    <div>
                                      Recurring:{" "}
                                      <b> {Package.recurringDefaultPrice}</b>
                                    </div>
                                    <div>
                                      One Off:{" "}
                                      <b> {Package.oneOffDefaultPrice}</b>
                                    </div>
                                  </td>
                                  <td className="table-content-font">
                                    <div>
                                      Recurring:{" "}
                                      <b> {Package.recurringMinPrice}</b>
                                    </div>
                                    <div>
                                      One Off: <b> {Package.oneOffMinPrice}</b>
                                    </div>
                                  </td>
                                  <td className="Switch table-content-font">
                                    <div
                                      style={{ alignItems: "none" }}
                                      class="d-flex gap-2 "
                                    >
                                      <div style={{ width: "50px" }}>
                                        {" "}
                                        {Package.statusName}
                                      </div>
                                      {((userAccessData.Admin_Config_ServicePackage_CanDelete &&
                                        common.organisationKeyID !== null) ||
                                        (userAccessData.SuperAdmin_Config_ServicePackage_CanDelete &&
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
                                                        servicePackageKeyID:
                                                          Package.servicePackageKeyID,
                                                        status:
                                                          Package.statusName,
                                                        Action: "Status",
                                                        userKeyID:
                                                          common.userKeyID,
                                                      })
                                                    }
                                                    checked={
                                                      Package.statusName ===
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
                                      {((userAccessData.Admin_Config_ServicePackage_CanEdit &&
                                        common.organisationKeyID !== null) ||
                                        (userAccessData.SuperAdmin_Config_ServicePackage_CanEdit &&
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
                                                  PackageEditBtnClicked(Package)
                                                }
                                                class="btn btn-sm btn-success edit-item-btn actionButtonsStyle"
                                              >
                                                <i class="ri-pencil-fill"></i>
                                              </button>
                                            </div>
                                          </Tooltip>
                                        )}
                                      {((userAccessData.Admin_Config_ServicePackage_CanDelete &&
                                        common.organisationKeyID !== null) ||
                                        (userAccessData.SuperAdmin_Config_ServicePackage_CanDelete &&
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
                                                    servicePackageKeyID:
                                                      Package.servicePackageKeyID,
                                                    servicePackageName:
                                                      Package.servicePackageName,
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
                  {listCount > Number(pageSize) - 1 && (
                    <PaginationComponent
                      totalCount={listCount}
                      totalPages={
                        isMobile
                          ? Math.ceil(listCount / isMobileRecords)
                          : Math.ceil(listCount / (desktopRecords - 1))
                      }
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
          // ErrorMessage={errorMessage==='Please inActive this record first.'?'Please change the status to InActive first.':errorMessage}

          ErrorMessage={formattedErrorMessage}
        />
        {/* Confirm Modal  */}
        <ConfirmModel
          openErrorModal={openErrorModal}
          openSuccessModal={openSuccessModal}
          modelRequestData={modelRequestData}
          UpdatedStatus={PackageChangeStatusDataAndDeleteData}
        />
        <RecordsAvailablePopupModel
          handleClose={handleClose}
          openErrorModal={openErrorModal}
          openSuccessModal={openSuccessModal}
          modelRequestData={modelRequestData}
          UpdatedStatus={PackageChangeStatusDataAndDeleteData}
        />
        {/* Success Modal  */}
        <SuccessModal
          handleClose={handleClose}
          setOpenSuccessModal={setOpenSuccessModal}
          openSuccessModal={openSuccessModal}
          modelAction={modelRequestData.Action}
          message={`${modelRequestData.Action === "Delete"
            ? `${moduleName} ${modelRequestData.servicePackageName}`
            : "Status has been changed successfully!"
            }`}
        />
        {/* End Page-content */}
        <FilterModel
          class="modal fade"
          id="FilterModel"
          tabIndex="-1"
          aria_labelledby="exampleModalLabel"
          aria_hidden="true"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          ModuleName={moduleName}
          ApplyFilter={ApplyFilter}
          businessNatureID={businessNatureID}
          setBusinessNatureID={setBusinessNatureID}
          prospectType={prospectType}
          setProspectType={setProspectType}
        />
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
};

export default Predefined_Package;
