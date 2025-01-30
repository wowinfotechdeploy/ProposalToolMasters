/* global $ */
import React, { useContext, useEffect, useState } from "react";
import CommonButtonComponent from "../../components/CommonButtonComponent";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AuthContextProvider } from "../../AuthContext/AuthContext";
import FilterModel from "../../components/FilterModel";
import {
  GetClientList,
  DeleteClient,
  ClientChangeStatus,
} from "../../redux/Services/client/clientAPI";
import SuccessModal from "../../components/SuccessModal";
import ErrorModel from "../../components/ErrorModel";
import ConfirmModel from "../../components/ConfirmationBox";
import NoResultFoundModel from "../../components/NoResultFoundModel";
import PaginationComponent from "../../components/PaginationModel";
import Footer from "../../components/Footer";
import Android12Switch from "../../components/AndroidSwitch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Tooltip from "@mui/material/Tooltip";
const Prospects = () => {
  let getClientsListApiCallCount = 0;

  const [errorMessage, setErrorMessage] = useState("");
  const [openErrorModal, setOpenErrorModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  const common = useSelector((state) => state.Storage);
  const [clientList, setClientList] = useState([]);
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [primarySortDirection, setPrimarySortDirection] = useState(null);
  const [primarySortDirectionObj, setPrimarySortDirectionObj] = useState({
    ProspectNameSort: null,
    ProspectTypeSort: null,
  });
  const [isFilterApply, setIsFilterApply] = useState(false);
  const [sortType, setSortType] = useState("");
  const [totalRecords, setTotalRecords] = useState(-1);
  const {
    prospectName,
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
  const moduleName = `${prospectName}`;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [businessNatureID, setBusinessNatureID] = useState(null);
  const [prospectType, setProspectType] = useState(null);
  const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
  const [modelRequestData, setModelRequestData] = useState({
    clientKeyID: null,
    status: null,
    Action: "",
    clientName: null,
    userKeyID: null,
  });
  const pageSize = isMobile ? isMobileRecords : desktopRecords;
  const formattedErrorMessage = handleErrorMessage(errorMessage);
  const [shouldFetch, setShouldFetch] = useState(false);
  useEffect(() => {
    setTopbar("block");
    getClientsListData(1, null, null, null);
  }, []);

  useEffect(() => {
    if (isAddUpdateActionDone) {
      if (modelRequestData.Action === null) {
        setSearchKeyword("");
        setPrimarySortDirection(null);
        setCurrentPage(1);
        getClientsListData(1, null, null, null);
      } else {
        getClientsListData(currentPage);
      }
      setIsAddUpdateActionDone(false);
    }
  }, [isAddUpdateActionDone]);

  useEffect(() => {
    if (shouldFetch) {
      getClientsListData(
        1,
        searchKeyword,
        primarySortDirection,
        sortType,
        null,
        null
      );
      setShouldFetch(false);
    }
  }, [shouldFetch, searchKeyword, primarySortDirection, sortType]);

  useEffect(() => {
    if (
      modelRequestData.Action === "Update" ||
      modelRequestData.Action === "View" ||
      modelRequestData.Action === null
    ) {
      if (
        modelRequestData.Action === "Update" &&
        modelRequestData.clientKeyID !== null
      ) {
        setTopbar("none");
        navigate("/create-new-client", { state: modelRequestData });
      } else if (modelRequestData.Action === "View") {
        navigate("/view-prospects", { state: modelRequestData });
      } else if (
        modelRequestData.clientKeyID === null &&
        modelRequestData.Action === null
      ) {
        setTopbar("none");
        navigate("/create-new-client", { state: modelRequestData });
      }
    }
  }, [modelRequestData]);

  const getClientsListData = async (
    i,
    searchKeywordValue,
    sortValue,
    ProspectSortType,
    businessNatureId,
    businessTypeId
  ) => {
    setLoader(true);
    const pageNoList = i - 1;
    try {
      const data = await GetClientList({
        pageSize: pageSize,
        pageNo: pageNoList,
        organisationKeyID: common.organisationKeyID,
        searchKeyword:
          searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        primarySortDirection:
          sortValue === undefined ? primarySortDirection : sortValue,
        PrimarySortColumnName: sortType == "" ? ProspectSortType : sortType,
        businessTypeID:
          businessTypeId == undefined ? prospectType : businessTypeId,
        businessNatureID:
          businessNatureId == undefined ? businessNatureID : businessNatureId,
      });

      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          getClientsListApiCallCount = 0;
          if (data?.data?.responseData?.data) {
            const clientList = data?.data?.responseData?.data;
            const totalCount = data.data.totalCount;
            if (pageNoList > 0 && clientList.length === 0) {
              let newPaneNo = Number(pageNoList);
              if (newPaneNo > 1) {
                newPaneNo = newPaneNo - 1;
              }
              getClientsListData(
                newPaneNo,
                searchKeywordValue,
                sortValue,
                ProspectSortType
              );
              setCurrentPage(pageNoList);
              return;
            }
            setListCount(totalCount);
            setClientList(clientList);
            setTotalRecords(clientList.length);
          }
        } else {
          if (getClientsListApiCallCount < maxCountToRecallApi) {
            getClientsListApiCallCount += 1;
            setTimeout(function () {
              getClientsListData(
                i,
                searchKeywordValue,
                sortValue,
                ProspectSortType
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

  // 2) On Click Client Edit Button
  const ClientEditBtnClicked = (prospect) => {
    setModelRequestData({
      ...modelRequestData,
      clientName: prospect.clientName,
      clientKeyID: prospect.clientKeyID, // Change ClientKeyID to clientKeyID
      Action: "Update",
    });
  };

  // Update Function Modal
  // 2) On Click Service Category Status Button
  const ClientDeleteData = async () => {
    setLoader(true);

    if (modelRequestData.Action === "Delete") {
      try {
        const Data = await DeleteClient(
          modelRequestData.clientKeyID,
          modelRequestData.userKeyID
        );
        if (Data) {
          setLoader(false);
          if (Data?.data?.statusCode === 200) {
            setOpenSuccessModal(true);
          } else {
            if (Data?.response?.data?.errorMessage.includes("Prospect")) {
              let ErrorMessage = Data?.response?.data?.errorMessage;
              ErrorMessage = ErrorMessage.replace("Prospect", prospectName);
              setErrorMessage(ErrorMessage);
            } else {
              setErrorMessage(Data?.response?.data?.errorMessage);
            }
            setOpenErrorModal(true);
          }
          getClientsListData(currentPage);
        }
      } catch (error) {
        console.log(error);
      }
    } else if (modelRequestData.Action === "Status") {
      try {
        const Data = await ClientChangeStatus(
          modelRequestData.clientKeyID,
          modelRequestData.userKeyID
        );
        if (Data) {
          setLoader(false);
          if (Data?.data?.statusCode === 200) {
            setOpenSuccessModal(true);
          } else {
            setErrorMessage(Data?.response?.data?.errorMessage);
            setOpenErrorModal(true);
          }
        }
        getClientsListData(currentPage);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // E] Sorting & handle Function
  const handleSort = (sortValue, ProspectSortType) => {
    if (ProspectSortType == "ClientName") {
      setPrimarySortDirection(sortValue);
      setPrimarySortDirectionObj({
        ...primarySortDirectionObj,
        ProspectNameSort: sortValue,
      });
      setCurrentPage(1);
      getClientsListData(1, searchKeyword, sortValue, ProspectSortType);
    } else if (ProspectSortType == "ClientType") {
      setPrimarySortDirection(sortValue);
      setPrimarySortDirectionObj({
        ...primarySortDirectionObj,
        ProspectTypeSort: sortValue,
      });
      setCurrentPage(1);
      getClientsListData(1, searchKeyword, sortValue, ProspectSortType);
    }
  };
  const handleViewProspectDetails = (Prospect) => {
    setModelRequestData({
      ...modelRequestData,
      clientKeyID: Prospect.clientKeyID, // Change ClientKeyID to clientKeyID
      Action: "View",
    });
  };

  const AddClientBtn = () => {
    setModelRequestData({
      ...modelRequestData,
      clientKeyID: null, // Change ClientKeyID to clientKeyID
      Action: null,
    });
  };

  const handleClose = () => {
    setModelRequestData({
      clientKeyID: null,
      Action: "",
      clientName: null,
    });
    $("#" + "ConfirmModel").modal("hide");
    setOpenSuccessModal(false);
    setOpenErrorModal(false);
  };
  const handleSearch = (e) => {
    const searchKeywordValue = e.target.value;
    setSearchKeyword(searchKeywordValue);
    setCurrentPage(1);
    getClientsListData(1, searchKeywordValue);
  };

  // F] Pagination :
  const handlePageChange = async (pageNumber) => {
    setCurrentPage(pageNumber);
    await getClientsListData(pageNumber); // Call your function with the selected page number
  };

  const ApplyFilter = () => {
    if (
      (businessNatureID !== null && businessNatureID !== "") ||
      (prospectType !== null && prospectType !== "")
    ) {
      setIsFilterApply(true);
    } else {
      setIsFilterApply(false);
    }
    getClientsListData(
      1,
      searchKeyword,
      primarySortDirection,
      sortType,
      businessNatureID,
      prospectType
    );
  };
  const ClearFilter = () => {
    setIsFilterApply(false);
    setBusinessNatureID(null);
    setProspectType(null);
    setShouldFetch(true);
  };
  return (
    <div>
      <div class="main-content ">
        <div class="services page-background">
          <div class="page-info-header page-info-strip">
            <div class="container">
              <div className="row">
                <div className="col-md-6 col-6">
                  <div class="page-title-cls">{prospectName}</div>
                </div>
                <div class="col-md-6  col-6">
                  <div class="d-flex justify-content-sm-end add-new-btn">
                    {userAccessData.Admin_Prospect_CanAdd && (
                      <CommonButtonComponent
                        title={getCrudButtonToolTipName("Add", moduleName)}
                        AddBtn={() => AddClientBtn()}
                        name={getCrudButtonTextName("Add", moduleName)}
                      />
                    )}{" "}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="container " id="tablesections">
            <div class="row">
              <div class="col-lg-12">
                <div class="card">
                  {/* end card header  */}
                  <div class="card-body">
                    <div id="customerList">
                      <div class="row g-4 mb-3"></div>
                      <div class="table-responsive table-card mb-3 table-padding">
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
                                        <div>
                                          <button
                                            className="btn btn-md btn-success create-Filter-item-btn text-nowrap "
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
                                style={{ width: "30%" }}
                              >
                                {prospectName} Name{" "}
                                {primarySortDirectionObj.ProspectNameSort ===
                                  "desc" && (
                                    <i
                                      onClick={() => {
                                        setSortType("ClientName");
                                        handleSort("asc", "ClientName");
                                      }}
                                      style={{ cursor: "pointer" }}
                                      class="fas fa-sort-alpha-up ml-1"
                                    ></i>
                                  )}
                                {(primarySortDirectionObj.ProspectNameSort ===
                                  null ||
                                  primarySortDirectionObj.ProspectNameSort ===
                                  "asc") && (
                                    <i
                                      onClick={() => {
                                        setSortType("ClientName");
                                        handleSort(
                                          primarySortDirectionObj.ProspectNameSort ===
                                            null
                                            ? "asc"
                                            : "desc",
                                          "ClientName"
                                        );
                                      }}
                                      style={{ cursor: "pointer" }}
                                      class="fas fa-sort-alpha-down ml-1"
                                    ></i>
                                  )}
                              </td>
                              <td className="tr-table-class text-white">
                                Email
                              </td>
                              <td className="tr-table-class text-white">
                                {prospectName} Type{" "}
                                {primarySortDirectionObj.ProspectTypeSort ===
                                  "desc" && (
                                    <i
                                      onClick={() => {
                                        setSortType("ClientType");
                                        handleSort("asc", "ClientType");
                                      }}
                                      style={{ cursor: "pointer" }}
                                      class="fas fa-sort-alpha-up ml-1"
                                    ></i>
                                  )}
                                {(primarySortDirectionObj.ProspectTypeSort ===
                                  null ||
                                  primarySortDirectionObj.ProspectTypeSort ===
                                  "asc") && (
                                    <i
                                      onClick={() => {
                                        setSortType("ClientType");
                                        handleSort(
                                          primarySortDirectionObj.ProspectTypeSort ===
                                            null
                                            ? "asc"
                                            : "desc",
                                          "ClientType"
                                        );
                                      }}
                                      style={{ cursor: "pointer" }}
                                      class="fas fa-sort-alpha-down ml-1"
                                    ></i>
                                  )}
                              </td>
                              <td className="tr-table-class text-white">
                                Status
                              </td>
                              <td className="tr-table-class text-white">
                                {userAccessData.Admin_Proposal_CanView && (
                                  <>Action</>
                                )}
                              </td>
                            </tr>
                          </thead>
                          <tbody class="list form-check-all">
                            {clientList
                              .slice(
                                0,
                                isMobile ? isMobileRecords : desktopRecords
                              )
                              .map((Prospect) => {
                                const emailArray = Prospect.emailID
                                  ? Prospect.emailID.split(", ")
                                  : [];
                                const displayEmail =
                                  emailArray.length > 0 ? emailArray[0] : "";
                                const hasMoreEmails = emailArray.length > 1;
                                return (

                                  <>
                                    <tr
                                      class="table_new"
                                      key={Prospect.clientID}
                                    >
                                      <td className="table-content-font">
                                        {Prospect.clientName}
                                      </td>
                                      <td className="table-content-font">
                                        {/* {Prospect.emailID}
                                         */}

                                        {hasMoreEmails ? (
                                          <Tooltip
                                            title={Prospect.emailID}
                                            arrow
                                          >
                                            <span>
                                              {displayEmail}{" "}
                                              <strong>...</strong>
                                            </span>
                                          </Tooltip>
                                        ) : (
                                          <span>{displayEmail}</span>
                                        )}
                                      </td>
                                      <td className="table-content-font">
                                        {Prospect.businessTypeName}
                                      </td>
                                      <td className="Switch">
                                        <div
                                          style={{ alignItems: "none" }}
                                          class="d-flex gap-2 "
                                        >
                                          <div style={{ width: "50px" }}>
                                            {" "}
                                            {Prospect.statusName}
                                          </div>
                                          {userAccessData.Admin_Prospect_CanDelete && (
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
                                                            Prospect.statusName,
                                                          clientKeyID:
                                                            Prospect.clientKeyID,
                                                          clientName:
                                                            Prospect.clientName,
                                                          userKeyID:
                                                            common.userKeyID,
                                                          Action: "Status",
                                                        })
                                                      }
                                                      checked={
                                                        Prospect.statusName ===
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
                                              "View",
                                              moduleName
                                            )}
                                          >
                                            <div class="view">
                                              <button
                                                class="btn btn-md btn-success create-item-btn view"
                                                onClick={() =>
                                                  handleViewProspectDetails(
                                                    Prospect
                                                  )
                                                }
                                              >
                                                <span
                                                  style={{ marginRight: "4px" }}
                                                >
                                                  View
                                                </span>
                                                <i class="bi bi-eye"></i>
                                              </button>
                                            </div>
                                          </Tooltip>

                                          {userAccessData.Admin_Prospect_CanEdit && (
                                            <Tooltip
                                              title={getCrudButtonToolTipName(
                                                "Update",
                                                moduleName
                                              )}
                                            >
                                              <div class="edit">
                                                <button
                                                  class="btn btn-sm btn-success edit-item-btn actionButtonsStyle"
                                                  onClick={() =>
                                                    ClientEditBtnClicked(
                                                      Prospect
                                                    )
                                                  }
                                                >
                                                  <i class="ri-pencil-fill"></i>
                                                </button>
                                              </div>
                                            </Tooltip>
                                          )}
                                          {userAccessData.Admin_Prospect_CanDelete && (
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
                                                      clientKeyID:
                                                        Prospect.clientKeyID,
                                                      clientName:
                                                        Prospect.clientName,
                                                      userKeyID:
                                                        common.userKeyID,
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
                                  </>
                                );
                              })}
                          </tbody>
                        </table>
                        {totalRecords <= 0 && (
                          <NoResultFoundModel
                            name={prospectName}
                            totalRecords={totalRecords}
                          />
                        )}
                      </div>
                    </div>
                    {/* end card  */}
                  </div>
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
            <ConfirmModel
              openErrorModal={openErrorModal}
              openSuccessModal={openSuccessModal}
              modelRequestData={modelRequestData}
              UpdatedStatus={ClientDeleteData}
              handleClose={handleClose}
            />
            <ErrorModel
              ErrorModel={openErrorModal}
              handleClose={handleClose}
              ErrorMessage={formattedErrorMessage}
            />

            <SuccessModal
              handleClose={handleClose}
              setOpenSuccessModal={setOpenSuccessModal}
              openSuccessModal={openSuccessModal}
              modelAction={modelRequestData.Action}
              message={`${modelRequestData.Action === "Delete"
                ? `${moduleName} ${modelRequestData.clientName}`
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
              businessNatureID={businessNatureID}
              setBusinessNatureID={setBusinessNatureID}
              prospectType={prospectType}
              setProspectType={setProspectType}
            />
            {/* end modal  */}
          </div>
          {/* container-fluid  */}
        </div>
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
    </div>
  );
};

export default Prospects;