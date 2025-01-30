/* global $ */
import React, { useContext, useEffect, useState } from "react";
import "./ServiceCategory.css";
import CommonButtonComponent from "../../../components/CommonButtonComponent";
import ServicesCategoriesModel from "./ServicesCategoriesModel";
import ConfirmModel from "../../../components/ConfirmationBox";
import {
  DeleteServiceCategory,
  GetServiceCategoryList,
  GetServiceCategoryModel,
  ServiceCategoryChangeStatus,
} from "../../../redux/Services/Config/ServiceCategoryApi";
import PaginationComponent from "../../../components/PaginationModel";
import { useSelector } from "react-redux";
import Android12Switch from "../../../components/AndroidSwitch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import NoResultFoundModel from "../../../components/NoResultFoundModel";
import { AuthContextProvider } from "../../../AuthContext/AuthContext";
import SuccessModal from "../../../components/SuccessModal";
import ErrorModel from "../../../components/ErrorModel";
import Footer from "../../../components/Footer";
import RecordsAvailablePopupModel from "../../../components/RecordsAvailablePopupModel";

const Service_Categories = () => {
  // A] States Declaration :
  const moduleName = "Service Category";
  const [serviceCategoryList, setServiceCategoryList] = useState([]);
  const [modelRequestData, setModelRequestData] = useState({
    serviceCatKeyID: null,
    serviceCatName: null,
    status: "",
    Action: "",
    userKeyID: null,
    Type: null,
    moduleName: moduleName,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const common = useSelector((state) => state.Storage); //Getting Logged Users Details From Persist Storage of redux hooks
  const [primarySortDirection, setPrimarySortDirection] = useState(null);
  const [primarySortDirectionObj, setPrimarySortDirectionObj] = useState({
    ServiceNameSort: null,
    ProfessionTypeSort: null,
  });
  const [sortType, setSortType] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [totalRecords, setTotalRecords] = useState(-1);
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

  let getServiceCategoryListApiCallCount = 0;
  const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
  const [openErrorModal, setOpenErrorModal] = React.useState(false);
  const [showProfessionType, setShowProfessionType] = useState(
    common.organisationKeyID === null || common.professionTypeLists.length > 1
  );
  const pageSize = isMobile ? isMobileRecords : desktopRecords;
  const formattedErrorMessage = handleErrorMessage(errorMessage);

  // B] Initial useEffect :
  // 1) Will Call Initial Api Like List Api
  useEffect(() => {
    setTopbar("block");
    GetServiceCategoryListData(1, null, null, null);
  }, []);

  //2) This useEffect will trigger when we successfully add or update record from popup model
  useEffect(() => {
    if (isAddUpdateActionDone) {
      if (modelRequestData.Action === null) {
        setSearchKeyword("");
        setPrimarySortDirection(null);
        setCurrentPage(1);
        GetServiceCategoryListData(1, null, null, null);
      } else {
        GetServiceCategoryListData(currentPage);
      }
      setIsAddUpdateActionDone(false);
    }
  }, [isAddUpdateActionDone]);

  // C] Calling All Api's like List and other Here :
  // 1) Get Service Category List Data
  const GetServiceCategoryListData = async (
    i,
    searchKeywordValue,
    sortValue,
    ServiceSortType
  ) => {
    setLoader(true);
    const pageNoList = i - 1;

    try {
      const data = await GetServiceCategoryList({
        pageSize: pageSize,
        pageNo: pageNoList,
        organisationKeyID: common.organisationKeyID,
        searchKeyword:
          searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        primarySortDirection:
          sortValue === undefined ? primarySortDirection : sortValue,
        PrimarySortColumnName:
          sortType == "" ? ServiceSortType : sortType || null,
      });

      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          getServiceCategoryListApiCallCount = 0;
          if (data?.data?.responseData?.data) {
            const totalCount = data.data.totalCount;
            const ServiceCategoryListData = data.data.responseData.data;

            if (pageNoList > 0 && ServiceCategoryListData.length === 0) {
              let newPaneNo = Number(pageNoList);
              if (newPaneNo > 1) {
                newPaneNo = newPaneNo - 1;
              }
              GetServiceCategoryListData(
                newPaneNo,
                searchKeywordValue,
                sortValue,
                ServiceSortType
              );
              setCurrentPage(pageNoList);
              return;
            }

            setListCount(totalCount);
            setServiceCategoryList(ServiceCategoryListData);
            setTotalRecords(ServiceCategoryListData.length);
          }
        } else {
          if (getServiceCategoryListApiCallCount < maxCountToRecallApi) {
            getServiceCategoryListApiCallCount += 1;
            setTimeout(function () {
              GetServiceCategoryListData(
                i,
                searchKeywordValue,
                sortValue,
                ServiceSortType
              );
            }, 2000);
          } else {
            setLoader(false);
          }

          setErrorMessage(data?.data?.errorMessage);
        }
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  // E] Event Handling Functions will call here.
  // 1) On Click Service Category Add Button
  const ServiceCategoryAddBtnClicked = (serviceCategory) => {
    {
      setModelRequestData({
        ...modelRequestData,
        serviceCatKeyID: null,
        Action: null,
      });
    }
  };
  // 2) On Click Service Category Edit Button
  const ServiceCategoryEditBtnClicked = async (serviceCategory, type) => {
    if (type === "editPredefined") {
      setLoader(true);
      const data = await GetServiceCategoryModel(
        serviceCategory.serviceCatKeyID,
        true
      );
      if (data?.data?.statusCode === 200) {
        setLoader(false);
        $("#" + "addUpdateModal").modal("show");
        setModelRequestData({
          ...modelRequestData,
          serviceCatKeyID: serviceCategory.serviceCatKeyID,
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
      setModelRequestData({
        ...modelRequestData,
        serviceCatKeyID: serviceCategory.serviceCatKeyID,
        Action: "Update",
        Type: null,
      });
    }
  };

  // Update Function Modal
  // 2) On Click Service Category Status Button
  const ServiceCategoryChangeStatusDataAndDeleteData = async () => {
    setLoader(true);
    if (modelRequestData.Action === "Status") {
      try {
        const Data = await ServiceCategoryChangeStatus(
          modelRequestData.serviceCatKeyID,
          modelRequestData.userKeyID
        );
        if (Data) {
          setLoader(false);
          if (Data?.data?.statusCode === 200) {
            if (
              Data?.data?.responseData.serviceCategoryExistsinServices
                .length !== 0
            ) {
              const servicePackageNames =
                Data?.data?.responseData.serviceCategoryExistsinServices.map(
                  (item) => item.serviceName
                );
              setModelRequestData({
                ...modelRequestData,
                Action: "ServiceCategoriesWarning",
                message: `Following services are assigned to the selected ${moduleName.toLowerCase()}. You must remove the services from this ${moduleName.toLowerCase()} before attempting to mark it as InActive.`,
                ServiceName: servicePackageNames,
              });
              $("#" + "ConfirmModel").modal("hide");
              $("#" + "RecordsAvailablePopupModel").modal("show");
              GetServiceCategoryListData(currentPage);
            } else {
              GetServiceCategoryListData(currentPage);
              setOpenSuccessModal(true);
            }
          } else {
            setErrorMessage(Data?.response?.data?.errorMessage);
            setOpenErrorModal(true);
            GetServiceCategoryListData(currentPage);
          }
        }
        GetServiceCategoryListData(currentPage);
      } catch (error) {
        console.log(error);
      }
    } else if (modelRequestData.Action === "Delete") {
      try {
        const Data = await DeleteServiceCategory(
          modelRequestData.serviceCatKeyID,
          modelRequestData.userKeyID
        );
        if (Data) {
          setLoader(false);
          if (Data?.data?.statusCode === 200) {
            if (
              Data?.data?.responseData.serviceCategoryExistsinServices
                .length !== 0
            ) {
              const servicePackageNames =
                Data?.data?.responseData.serviceCategoryExistsinServices.map(
                  (item) => item.serviceName
                );
              setModelRequestData({
                ...modelRequestData,
                Action: "ServiceCategoriesWarning",
                message: `Following services are assigned to the selected ${moduleName.toLowerCase()}. You must remove the services from this ${moduleName.toLowerCase()} before attempting to mark it as InActive.`,
                ServiceName: servicePackageNames,
              });
              $("#" + "ConfirmModel").modal("hide");
              $("#" + "RecordsAvailablePopupModel").modal("show");
              GetServiceCategoryListData(currentPage);
            } else {
              GetServiceCategoryListData(currentPage);
              setOpenSuccessModal(true);
            }
          } else {
            setErrorMessage(Data?.response?.data?.errorMessage);
            setOpenErrorModal(true);
          }
          GetServiceCategoryListData(currentPage);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  // F] Pagination :
  const handlePageChange = async (pageNumber) => {
    setCurrentPage(pageNumber);
    await GetServiceCategoryListData(pageNumber); // Call your function with the selected page number
  };

  // E] Sorting & handle Function
  const handleSort = (sortValue, ServiceSortType) => {
    if (ServiceSortType == "ServiceCatName") {
      setPrimarySortDirection(sortValue);
      setPrimarySortDirectionObj({
        ...primarySortDirectionObj,
        ServiceNameSort: sortValue,
      });
      setCurrentPage(1);
      GetServiceCategoryListData(1, searchKeyword, sortValue, ServiceSortType);
    } else if (ServiceSortType == "ProfessionType") {
      setPrimarySortDirection(sortValue);
      setPrimarySortDirectionObj({
        ...primarySortDirectionObj,
        ProfessionTypeSort: sortValue,
      });
      setCurrentPage(1);
      GetServiceCategoryListData(1, searchKeyword, sortValue, ServiceSortType);
    }
  };

  //handle Search
  const handleSearch = (e) => {
    const searchKeywordValue = e.target.value;
    setSearchKeyword(searchKeywordValue);
    setCurrentPage(1);
    GetServiceCategoryListData(1, searchKeywordValue);
  };
  // handle Close
  const handleClose = () => {
    $("#" + "ConfirmModel").modal("hide");
    $("#" + "RecordsAvailablePopupModel").modal("hide");
    setOpenSuccessModal(false);
    setOpenErrorModal(false);
  };

  //Design part :
  return (
    <div>
      <div class="main-content">
        <div class="services page-background">
          <div class="page-info-header page-info-strip">
            <div class="container ">
              <div className="row">
                <div className="col-md-6 col-6">
                  <div class="page-title-cls">Service Categories
                  </div>
                </div>
                <div class="col-md-6 col-6">
                  <div className="d-flex justify-content-sm-end add-new-btn">
                    {((userAccessData.Admin_Config_ServiceCat_CanAdd &&
                      common.organisationKeyID !== null) ||
                      (userAccessData.SuperAdmin_Config_ServiceCat_CanAdd &&
                        common.organisationKeyID === null)) && (
                        <CommonButtonComponent
                          title={getCrudButtonToolTipName("Add", moduleName)}
                          dataBsTarget="#addUpdateModal"
                          data_bs_toggle="modal"
                          name={getCrudButtonTextName("Add", moduleName)}
                          AddBtn={() => ServiceCategoryAddBtnClicked()}
                        />
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="container">
            <div class="row">
              <div class="col-lg-12">
                <div class="card ">
                  <div class="card-body">
                    <div id="customerList">
                      <div class="row g-4 mb-3"></div>
                      <div class="table-responsive table-card mb-3 table-padding">
                        <div className="search-box col-md-3 col-6 width-searchbox mb-2">
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
                                style={{ width: "50%" }}
                              >
                                Service Categories
                                {primarySortDirectionObj.ServiceNameSort ===
                                  "desc" && (
                                    <i
                                      onClick={() => {
                                        setSortType("ServiceCatName");
                                        handleSort("asc", "ServiceCatName");
                                      }}
                                      style={{ cursor: "pointer" }}
                                      class="fas fa-sort-alpha-up ml-1"
                                    ></i>
                                  )}
                                {(primarySortDirectionObj.ServiceNameSort ===
                                  null ||
                                  primarySortDirectionObj.ServiceNameSort ===
                                  "asc") && (
                                    <i
                                      onClick={() => {
                                        setSortType("ServiceCatName");
                                        handleSort(
                                          primarySortDirectionObj.ServiceNameSort ===
                                            null
                                            ? "asc"
                                            : "desc",
                                          "ServiceCatName"
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
                              <td className="tr-table-class text-white">
                                Status
                              </td>
                              <td className="tr-table-class text-white">
                                {((userAccessData.Admin_Config_ServiceCat_CanEdit &&
                                  common.organisationKeyID !== null) ||
                                  (userAccessData.SuperAdmin_Config_ServiceCat_CanEdit &&
                                    common.organisationKeyID === null) ||
                                  (userAccessData.Admin_Config_ServiceCat_CanDelete &&
                                    common.organisationKeyID !== null) ||
                                  (userAccessData.SuperAdmin_Config_ServiceCat_CanEdit &&
                                    common.organisationKeyID === null)) && (
                                    <>Action</>
                                  )}
                              </td>
                            </tr>
                          </thead>
                          <tbody class="list form-check-all">
                            {serviceCategoryList
                              ?.slice(
                                0,
                                isMobile ? isMobileRecords : desktopRecords
                              )
                              .map((serviceCategory, index) => {
                                return (
                                  <tr class="table_new" key={index}>
                                    <td className="table-content-font">
                                      {/* {isMobile ? (
                                        <>
                                          {serviceCategory.serviceCatName
                                            .length > 20
                                            ? serviceCategory.serviceCatName.substring(
                                              0,
                                              20
                                            ) + "..."
                                            : serviceCategory.serviceCatName}
                                        </>
                                      ) : (
                                        <>
                                          {serviceCategory.serviceCatName
                                            .length > 45 ? (
                                            <Tooltip
                                              title={
                                                serviceCategory.serviceCatName
                                              }
                                            >
                                              {serviceCategory.serviceCatName.substring(
                                                0,
                                                45
                                              ) + "..."}
                                            </Tooltip>
                                          ) : (
                                            <>
                                              {serviceCategory.serviceCatName}
                                            </>
                                          )}
                                        </>
                                      )} */}
                                      {serviceCategory.notifySAChanges !== null && common.organisationKeyID !== null && (
                                        <>
                                          <Tooltip
                                            title="View System Administrator Changes"

                                          >
                                            <span onClick={() =>
                                              ServiceCategoryEditBtnClicked(
                                                serviceCategory, "editPredefined"
                                              )
                                            } className="UpdateConfigValue"
                                            // data-bs-toggle="modal"

                                            // data-bs-target="#addUpdateModal"
                                            >
                                              <i class="fa fa-regular fa-bell"></i>
                                            </span>
                                          </Tooltip>
                                        </>
                                      )}
                                      {isMobile ? (
                                        <>
                                          {serviceCategory.serviceCatName
                                            .length > 20
                                            ? serviceCategory.serviceCatName
                                              .substring(0, 20)
                                              .toLowerCase()
                                              .replace(/\b\w/g, (l) =>
                                                l.toUpperCase()
                                              ) + "..."
                                            : serviceCategory.serviceCatName
                                              .substring(0, 20)
                                              .toLowerCase()
                                              .replace(/\b\w/g, (l) =>
                                                l.toUpperCase()
                                              )}
                                        </>
                                      ) : (
                                        <>
                                          {serviceCategory.serviceCatName
                                            .length > 50 ? (
                                            <Tooltip
                                              title={
                                                serviceCategory.serviceCatName
                                              }
                                            >
                                              {serviceCategory.serviceCatName
                                                .substring(0, 50)
                                                .toLowerCase()
                                                .replace(/\b\w/g, (l) =>
                                                  l.toUpperCase()
                                                ) + "..."}
                                            </Tooltip>
                                          ) : (
                                            <>
                                              {serviceCategory.serviceCatName
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
                                        serviceCategory.professionTypeNames}
                                    </td>
                                    <td className="Switch table-content-font">
                                      <div
                                        style={{
                                          alignItems: "none",
                                          marginLeft:
                                            (((userAccessData.Admin_Config_ServiceCat_CanEdit &&
                                              common.organisationKeyID !==
                                              null) ||
                                              (userAccessData.SuperAdmin_Config_ServiceCat_CanEdit &&
                                                common.organisationKeyID ===
                                                null)) &&
                                              common.organisationKeyID !==
                                              null) ||
                                              (userAccessData.SuperAdmin_Config_ServiceCat_CanEdit &&
                                                common.organisationKeyID === null)
                                              ? ""
                                              : "10px",
                                        }}
                                        class="d-flex gap-2 "
                                      >
                                        <div style={{ width: "50px" }}>
                                          {" "}
                                          {serviceCategory.statusName}
                                        </div>
                                        {((userAccessData.Admin_Config_ServiceCat_CanDelete &&
                                          common.organisationKeyID !== null) ||
                                          (userAccessData.SuperAdmin_Config_ServiceCat_CanDelete &&
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
                                                            serviceCategory.statusName,
                                                          serviceCatKeyID:
                                                            serviceCategory.serviceCatKeyID,
                                                          userKeyID:
                                                            common.userKeyID,
                                                          Action: "Status",
                                                        })
                                                      }
                                                      checked={
                                                        serviceCategory.statusName ===
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
                                        {((userAccessData.Admin_Config_ServiceCat_CanEdit &&
                                          common.organisationKeyID !== null) ||
                                          (userAccessData.SuperAdmin_Config_ServiceCat_CanEdit &&
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
                                                    ServiceCategoryEditBtnClicked(
                                                      serviceCategory
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
                                        {((userAccessData.Admin_Config_ServiceCat_CanDelete &&
                                          common.organisationKeyID !== null) ||
                                          (userAccessData.SuperAdmin_Config_ServiceCat_CanDelete &&
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
                                                  class="btn btn-sm btn-danger remove-item-btn actionButtonsStyle"
                                                  data-bs-toggle="modal"
                                                  data-bs-target="#ConfirmModel"
                                                  onClick={() =>
                                                    setModelRequestData({
                                                      ...modelRequestData,
                                                      serviceCatKeyID:
                                                        serviceCategory.serviceCatKeyID,
                                                      serviceCatName:
                                                        serviceCategory.serviceCatName,
                                                      userKeyID: common.userKeyID,
                                                      Action: "Delete",
                                                    })
                                                  }
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
                      desktopRecords={desktopRecords}
                      currentPage={currentPage}
                      onPageChange={handlePageChange}
                    />
                  )}
                </div>
              </div>
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
              UpdatedStatus={ServiceCategoryChangeStatusDataAndDeleteData}
            />
            <RecordsAvailablePopupModel
              handleClose={handleClose}
              openErrorModal={openErrorModal}
              openSuccessModal={openSuccessModal}
              modelRequestData={modelRequestData}
              UpdatedStatus={ServiceCategoryChangeStatusDataAndDeleteData}
            />
            {/* Success Modal  */}
            <SuccessModal
              handleClose={handleClose}
              setOpenSuccessModal={setOpenSuccessModal}
              openSuccessModal={openSuccessModal}
              modelAction={modelRequestData.Action}
              message={`${modelRequestData.Action === "Delete"
                ? `${moduleName} ${modelRequestData.serviceCatName}`
                : "Status has been changed successfully!"
                }`}
            />

            {/* service Category Modal  */}
            <ServicesCategoriesModel
              class="modal fade"
              id="addUpdateModal"
              tabIndex="-1"
              aria_labelledby="exampleModalLabel"
              aria_hidden="true"
              setIsAddUpdateActionDone={setIsAddUpdateActionDone}
              modelRequestData={modelRequestData}
            />
          </div>
        </div>
        <Footer />
      </div>

      {/* start back-to-top */}
      <button
        onClick="topFunction()"
        class="btn btn-danger btn-icon"
        id="back-to-top"
      >
        <i class="ri-arrow-up-line"></i>
      </button>
      {/* end back-to-top */}
    </div>
  );
};

export default Service_Categories;
