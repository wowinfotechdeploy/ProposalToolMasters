/* global $ */
import React, { useContext, useEffect, useState } from "react";
import CommonButtonComponent from "../../../../components/CommonButtonComponent";
import "./AccessKeyStyle.css";
import { useSelector } from "react-redux";
import hint from "../../../../assets/images/hint.png";
import AccesskeyModal from "./AccesskeyModal";
import PaginationComponent from "../../../../components/PaginationModel";
import NoResultFoundModel from "../../../../components/NoResultFoundModel";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import SuccessModal from "../../../../components/SuccessModal";
import ErrorModel from "../../../../components/ErrorModel";
import ConfirmModel from "../../../../components/ConfirmationBox";
import Footer from "../../../../components/Footer";
import { AuthContextProvider } from "../../../../AuthContext/AuthContext";
import Android12Switch from "../../../../components/AndroidSwitch";
import {
  AccessKeyChangeStatus,
  DeleteAccessKey,
  EnableAccessKeyApiIntegationChangeStatus,
  GetAccessKeyList,
} from "../../../../redux/Services/Setting/AccessKeyApi";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { AccessKeyBaseUrl } from "../../../../Base-Url/Base_Url";
import AccessKeyUsesModal from "./AccessKeyUsesModel";
const AccessKeyList = () => {
  let getAccessKeyListApiCallCount = 0;
  const navigate = useNavigate();
  // A] States Declaration :
  const moduleName = "Access Key";
  const [accessKeyList, setAccessKeyList] = useState([]);

  const [modelRequestData, setModelRequestData] = useState({
    AccessKeyName: "",
    accessKeyKeyID: null,
    Action: null,
    userKeyID: null,
    status: null,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(-1);
  const common = useSelector((state) => state.Storage); //Getting Logged Users Details From Persist Storage of redux hooks
  const [primarySortDirection, setPrimarySortDirection] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [isSingleApiAccessKeyEnable, setIsSingleApiAccessKeyEnable] =
    useState(false);

  const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
  const {
    setLoader,
    setTopbar,
    maxCountToRecallApi,
    isMobile,
    setListCount,
    listCount,
    getCrudButtonTextName,
    getPlaceholderTextName,
    getCrudButtonToolTipName,
    userAccessData,
    activeOrganizationSubscriptionPlan,
    isSubscriptionLoading,
    desktopRecords,
    isMobileRecords,
  } = useContext(AuthContextProvider);
  const totalPage = isMobile
    ? Math.ceil(listCount / isMobileRecords)
    : Math.ceil(listCount / desktopRecords);
  const pageSize = isMobile ? isMobileRecords : desktopRecords;
  // B] Initial useEffect :
  // 1) Will Call Initial Api Like List Api
  useEffect(() => {
    // console.log("activeOrganizationSubscriptionPlan", activeOrganizationSubscriptionPlan);
    if (isSubscriptionLoading || !activeOrganizationSubscriptionPlan) return;
    if (
      common.organisationKeyID !== null &&
      !activeOrganizationSubscriptionPlan?.apiIntegration
    ) {
      navigate(-1); // Redirect to the previous page
    }
    setTopbar("block");
    GetAccessKeyListData(1);
  }, [isSubscriptionLoading, activeOrganizationSubscriptionPlan]);

  //2) This useEffect will trigger when we successfully add or update record from popup model
  useEffect(() => {
    if (isAddUpdateActionDone) {
      if (modelRequestData.Action === null) {
        setSearchKeyword("");
        setPrimarySortDirection(null);
        setCurrentPage(1);
        GetAccessKeyListData(1, null, null);
      } else {
        GetAccessKeyListData(currentPage);
      }
      setIsAddUpdateActionDone(false);
    }
  }, [isAddUpdateActionDone]);

  // C] Calling All Api's like List and other Here :
  // 1) Get Access Key List Data
  const GetAccessKeyListData = async (i, searchKeywordValue, sortValue) => {
    setLoader(true);
    const pageNoList = i - 1;
    try {
      const data = await GetAccessKeyList({
        pageSize: pageSize,
        pageNo: pageNoList,
        organisationKeyID: common.organisationKeyID,
        userKeyID: common.userKeyID,
        searchKeyword:
          searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        primarySortDirection:
          sortValue === undefined ? primarySortDirection : sortValue,
      });
      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          getAccessKeyListApiCallCount = 0;
          if (data?.data?.responseData?.data) {
            const totalCount = data.data.totalCount;
            const AccessKeyListData = data.data.responseData.data;
            const isSingleApiAccessKeyEnable =
              data.data.responseData.isSingleApiAccessKeyEnable;
            setIsSingleApiAccessKeyEnable(isSingleApiAccessKeyEnable);
            if (pageNoList > 0 && AccessKeyListData.length === 0) {
              let newPaneNo = Number(pageNoList);
              if (newPaneNo > 1) {
                newPaneNo = newPaneNo - 1;
              }
              GetAccessKeyListData(newPaneNo, searchKeywordValue, sortValue);
              setCurrentPage(pageNoList);
              return;
            }
            setListCount(totalCount);
            setAccessKeyList(AccessKeyListData);
            setTotalRecords(AccessKeyListData.length);
          }
        } else {
          if (getAccessKeyListApiCallCount < maxCountToRecallApi) {
            getAccessKeyListApiCallCount += 1;
            setTimeout(function () {
              GetAccessKeyListData(i, searchKeywordValue, sortValue);
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

  // E] Event Handling Functions will call here.
  // 1) On Click Access Key Add Button
  const AccessKeyAddBtnClicked = () => {
    {
      setModelRequestData({
        ...modelRequestData,
        Action: null,
      });
    }
  };

  // 2) On Click Access Key ChangeStatus Button
  const ChangeStatusAccessKeyData = async () => {
    if (modelRequestData.Action === "EnableApiIntegration") {
      try {
        const Data = await EnableAccessKeyApiIntegationChangeStatus(
          common.organisationKeyID,
          modelRequestData.userKeyID,
        );
        if (Data) {
          setLoader(false);
          if (Data?.data?.statusCode === 200) {
            setOpenSuccessModal(true);
          } else {
            setErrorMessage(Data?.response?.data?.errorMessage);
            setOpenErrorModal(true);
          }
          GetAccessKeyListData(currentPage);
        }
      } catch (error) {
        console.log(error);
      }
    } else if (modelRequestData.Action === "Status") {
      try {
        const Data = await AccessKeyChangeStatus(
          modelRequestData.accessKeyKeyID,
          modelRequestData.userKeyID,
        );
        if (Data) {
          setLoader(false);
          if (Data?.data?.statusCode === 200) {
            setOpenSuccessModal(true);
          } else {
            setErrorMessage(Data?.response?.data?.errorMessage);
            setOpenErrorModal(true);
          }
          GetAccessKeyListData(currentPage);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setLoader(true);
      try {
        const Data = await DeleteAccessKey(
          modelRequestData.accessKeyKeyID,
          modelRequestData.userKeyID,
        );
        if (Data) {
          setLoader(false);
          if (Data?.data?.statusCode === 200) {
            setOpenSuccessModal(true);
          } else {
            setErrorMessage(Data?.response?.data?.errorMessage);
            setOpenErrorModal(true);
          }
          GetAccessKeyListData(currentPage);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  // F] Pagination :
  const handlePageChange = async (pageNumber) => {
    setCurrentPage(pageNumber);
    await GetAccessKeyListData(pageNumber); // Call your function with the selected page number
  };

  // E] Sorting
  const HandleSort = (sortValue) => {
    setPrimarySortDirection(sortValue);
    setCurrentPage(1);
    GetAccessKeyListData(1, searchKeyword, sortValue);
  };

  const handleSearch = (e) => {
    const searchKeywordValue = e.target.value;
    setSearchKeyword(searchKeywordValue);
    setCurrentPage(1);
    GetAccessKeyListData(1, searchKeywordValue);
  };

  const handleClose = () => {
    $("#" + "ConfirmModel").modal("hide");
    setOpenSuccessModal(false);
    setOpenErrorModal(false);
  };

  //Design part :
  return (
    <>
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
                        {/* <div className="container"> */}
                        <div className="row">
                          <div className="col-md-6 p-0 justify-content-start d-flex align-items-center">
                            Access Keys
                            {/* <i style={{ cursor: "pointer" }} data-bs-toggle="modal"
                      data-bs-target="#AccessKeyInstructionModel" class="fas fa-question-circle mx-2"></i> */}
                          </div>

                          <div className="col-auto ms-auto">
                            {common.organisationKeyID !== null && (
                              <div className="d-flex justify-content-sm-end add-new-btn">
                                <Tooltip
                                  title={`Enable/Disable Single API Access Key`}
                                >
                                  <div
                                    className="d-flex gap-2 justify-content-sm-end add-new-btn"
                                    style={{ marginRight: "10px" }}
                                  >
                                    <span style={{ marginBottom: "5px" }}>
                                      {isSingleApiAccessKeyEnable
                                        ? "Enable"
                                        : "Disable"}{" "}
                                      Single API Access Key
                                    </span>{" "}
                                    <FormGroup>
                                      <FormControlLabel
                                        control={
                                          <Android12Switch
                                            checked={isSingleApiAccessKeyEnable}
                                            onClick={() =>
                                              setModelRequestData({
                                                ...modelRequestData,
                                                userKeyID: common.userKeyID,
                                                status:
                                                  isSingleApiAccessKeyEnable
                                                    ? "Enable"
                                                    : "Disable",
                                                Action: "EnableApiIntegration",
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
                            )}
                          </div>
                        </div>
                        {/* </div> */}
                      </div>
                      {/* </div> */}
                      <div class="">
                        <div class="row">
                          <div class="col-lg-12">
                            <div class="card">
                              <div class="card-body">
                                <div id="customerList">
                                  <div class="row g-4 mb-3"></div>
                                  <div class="table-responsive table-card mt-2 mb-3 table-padding">
                                    <div className="d-flex justify-content-between">
                                      <div class="search-box width-searchbox mb-2">
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
                                                  moduleName,
                                                )
                                          }
                                        />
                                      </div>
                                      <div>
                                        {common.organisationKeyID === null && (
                                          <CommonButtonComponent
                                            title={getCrudButtonToolTipName(
                                              "Add",
                                              moduleName,
                                            )}
                                            name={getCrudButtonTextName(
                                              "Add",
                                              moduleName,
                                            )}
                                            dataBsTarget="#showModal1"
                                            data_bs_toggle="modal"
                                            AddBtn={() =>
                                              AccessKeyAddBtnClicked()
                                            }
                                          />
                                        )}
                                        {common.organisationKeyID !== null && (
                                          <Tooltip
                                            title={` How To Use ${moduleName}`}
                                          >
                                            {/* <button
                                  className="btn btn-md btn-success create-item-btn"
                                  data-bs-target="#AccessKeyUsesModel"
                                  data-bs-toggle="modal"
                                // AddBtn={() => AccessKeyAddBtnClicked()}
                                >
                                  How To Use {moduleName}
                                </button> */}
                                            <a
                                              style={{ cursor: "pointer" }}
                                              data-bs-target="#AccessKeyUsesModel"
                                              data-bs-toggle="modal"
                                            >
                                              How To Use {moduleName} ?{" "}
                                              <img
                                                src={hint}
                                                className="hint"
                                              />
                                            </a>
                                          </Tooltip>
                                        )}
                                      </div>
                                    </div>
                                    {/* <div className="AccessKeyTable"> */}
                                    <table
                                      class="table align-middle table-nowrap"
                                      id="customerTable"
                                      // style={{ height: "50px", overflowY: "auto" }}
                                    >
                                      <thead class="table-light table-header-font">
                                        <tr className="head-row ">
                                          <td
                                            className="tr-table-class text-white"
                                            style={{
                                              width: "10%",
                                            }}
                                          >
                                            Access Key
                                            {primarySortDirection ===
                                              "desc" && (
                                              <i
                                                onClick={() => {
                                                  HandleSort("asc");
                                                }}
                                                style={{ cursor: "pointer" }}
                                                class="fas fa-sort-alpha-up ml-1"
                                              ></i>
                                            )}
                                            {(primarySortDirection === null ||
                                              primarySortDirection ===
                                                "asc") && (
                                              <i
                                                onClick={() => {
                                                  HandleSort(
                                                    primarySortDirection ===
                                                      null
                                                      ? "asc"
                                                      : "desc",
                                                  );
                                                }}
                                                style={{ cursor: "pointer" }}
                                                class="fas fa-sort-alpha-down ml-1"
                                              ></i>
                                            )}
                                          </td>
                                          <td className="tr-table-class  text-white">
                                            Token
                                          </td>
                                          <td className="tr-table-class  text-white">
                                            Organisation Name
                                          </td>
                                          {common.organisationKeyID !==
                                            null && (
                                            <>
                                              <td className="tr-table-class  text-white">
                                                Status
                                              </td>
                                            </>
                                          )}
                                          <td className="tr-table-class  text-white">
                                            Expiry Date
                                          </td>

                                          {common.organisationKeyID ===
                                            null && (
                                            <>
                                              <td className="tr-table-class  text-white">
                                                Status
                                              </td>

                                              <td className="tr-table-class text-center text-white">
                                                {userAccessData.Admin_Setting_AccessKeyCanDelete && (
                                                  <>Action</>
                                                )}
                                              </td>
                                            </>
                                          )}
                                        </tr>
                                      </thead>
                                      <tbody class="list form-check-all ">
                                        {accessKeyList
                                          .slice(
                                            0,
                                            isMobile
                                              ? isMobileRecords
                                              : desktopRecords,
                                          )
                                          .map((AccessKey) => {
                                            return (
                                              <tr class="table_new">
                                                <td className="table-content-font">
                                                  {AccessKey.accessKeyName
                                                    .toLowerCase()
                                                    .replace(/\b\w/g, (l) =>
                                                      l.toUpperCase(),
                                                    )}
                                                </td>

                                                <td className="table-content-font">
                                                  {" "}
                                                  {AccessKey.token}
                                                </td>
                                                <td className="table-content-font">
                                                  {AccessKey.organisationName}
                                                </td>
                                                {common.organisationKeyID !==
                                                  null && (
                                                  <td className="table-content-font">
                                                    {AccessKey.expiryStatus}
                                                  </td>
                                                )}
                                                <td className="table-content-font">
                                                  {" "}
                                                  {AccessKey.expiryDate
                                                    ? dayjs(
                                                        AccessKey.expiryDate,
                                                      ).format("DD/MM/YYYY")
                                                    : " "}
                                                </td>
                                                {common.organisationKeyID ===
                                                  null && (
                                                  <>
                                                    <td className="table-content-font">
                                                      <div
                                                        style={{
                                                          alignItems: "none",
                                                        }}
                                                        class="d-flex gap-2"
                                                      >
                                                        <Tooltip
                                                          title={
                                                            "Change Status"
                                                          }
                                                        >
                                                          <div
                                                            style={{
                                                              width: "40px",
                                                            }}
                                                          >
                                                            {
                                                              AccessKey.statusName
                                                            }
                                                          </div>
                                                        </Tooltip>
                                                        <Tooltip
                                                          title={getCrudButtonToolTipName(
                                                            "Change Status",
                                                          )}
                                                        >
                                                          <FormGroup>
                                                            <FormControlLabel
                                                              control={
                                                                <Android12Switch
                                                                  checked={
                                                                    AccessKey.statusName ===
                                                                    "Active"
                                                                  }
                                                                  onClick={() =>
                                                                    setModelRequestData(
                                                                      {
                                                                        ...modelRequestData,
                                                                        accessKeyKeyID:
                                                                          AccessKey.accessKeyKeyID,
                                                                        AccessKeyName:
                                                                          AccessKey.accessKeyName,
                                                                        userKeyID:
                                                                          common.userKeyID,
                                                                        status:
                                                                          AccessKey.statusName,
                                                                        Action:
                                                                          "Status",
                                                                      },
                                                                    )
                                                                  }
                                                                  data-bs-toggle="modal"
                                                                  data-bs-target="#ConfirmModel"
                                                                />
                                                              }
                                                            />
                                                          </FormGroup>
                                                        </Tooltip>
                                                      </div>
                                                    </td>
                                                    {/* <td> {AccessKey.statusName}</td> */}
                                                    <td className="table-content-font">
                                                      <div class="d-flex gap-2 justify-content-center">
                                                        <Tooltip
                                                          title={getCrudButtonToolTipName(
                                                            "Delete",
                                                            moduleName,
                                                          )}
                                                        >
                                                          <div class="remove">
                                                            <button
                                                              class="btn btn-sm btn-danger remove-item-btn actionButtonsStyle"
                                                              data-bs-toggle="modal"
                                                              data-bs-target="#ConfirmModel"
                                                              onClick={() =>
                                                                setModelRequestData(
                                                                  {
                                                                    ...modelRequestData,
                                                                    accessKeyKeyID:
                                                                      AccessKey.accessKeyKeyID,
                                                                    AccessKeyName:
                                                                      AccessKey.accessKeyName,
                                                                    userKeyID:
                                                                      common.userKeyID,
                                                                    Action:
                                                                      "Delete",
                                                                  },
                                                                )
                                                              }
                                                            >
                                                              <i class="ri-delete-bin-5-fill"></i>
                                                            </button>
                                                          </div>
                                                        </Tooltip>
                                                      </div>
                                                    </td>
                                                  </>
                                                )}
                                              </tr>
                                            );
                                          })}
                                      </tbody>
                                    </table>

                                    {/* </div> */}
                                    {/* <div class="card">
                          <div className="card-body d-flex justify-content-center flex-column">
                            <h5>
                              {moduleName} Uses:
                            </h5>
                            <p>Follow these steps to authenticate using the access key:</p>
                            <ol>
                              <li>Call below API from your website.<br></br>
                                API: <b>{`${AccessKeyBaseUrl}/api/login/authenticate?accessKey={Token}`}</b>
                              </li>
                              <li>After calling the above API, you will receive the redirection URL in the response.<br></br>
                                Response:<br></br>
                                <b> {`{redirectUrl: redirectUrl}`}</b>
                              </li>
                              <li>Open the redirection URL in a new tab or popup.</li>
                              <li>Finish.</li>
                            </ol>
                          </div>
                        </div> */}
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
                            </div>
                          </div>
                        </div>
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
                          UpdatedStatus={ChangeStatusAccessKeyData}
                        />

                        {/* Success Modal  */}
                        <SuccessModal
                          handleClose={handleClose}
                          setOpenSuccessModal={setOpenSuccessModal}
                          openSuccessModal={openSuccessModal}
                          modelAction={modelRequestData.Action}
                          message={
                            modelRequestData.Action === "Delete"
                              ? moduleName +
                                " " +
                                modelRequestData.AccessKeyName
                              : "Status has been changed successfully!"
                          }
                        />
                        {/* Modal  */}
                        <AccesskeyModal
                          class="modal fade"
                          id="showModal1"
                          tabIndex="-1"
                          aria_labelledby="exampleModalLabel"
                          aria_hidden="true"
                          setIsAddUpdateActionDone={setIsAddUpdateActionDone}
                          modelRequestData={modelRequestData}
                        />
                        <AccessKeyUsesModal
                          class="modal fade"
                          id="AccessKeyUsesModel"
                          tabIndex="-1"
                          aria_labelledby="exampleModalLabel"
                          aria_hidden="true"
                          setIsAddUpdateActionDone={setIsAddUpdateActionDone}
                          modelRequestData={modelRequestData}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
      <Footer />
    </>
  );
};

export default AccessKeyList;
