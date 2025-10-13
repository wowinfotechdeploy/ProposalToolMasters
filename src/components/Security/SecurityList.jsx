/* global $ */
import React, { useContext, useEffect, useState } from "react";
import "../../pages/configure/service_categories/ServiceCategory.css";
import CommonButtonComponent from "../../components/CommonButtonComponent";
import ConfirmModel from "../../components/ConfirmationBox";
import {
  GetAuthenticationList,
  DeleteAuthentication,
  AuthenticationChangeStatus,
  GetChangeIsDefaultStatus,
  GetEnable2Fa,
} from "../../redux/Services/Auth/AuthenticatioApi";
import PaginationComponent from "../../components/PaginationModel";
import { useDispatch, useSelector } from "react-redux";
import Android12Switch from "../../components/AndroidSwitch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import NoResultFoundModel from "../../components/NoResultFoundModel";
import { AuthContextProvider } from "../../AuthContext/AuthContext";
import SuccessModal from "../../components/SuccessModal";
import ErrorModel from "../../components/ErrorModel";
import Footer from "../../components/Footer";
import RecordsAvailablePopupModel from "../../components/RecordsAvailablePopupModel";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { updateState } from "../../redux/Persist";

const SecurityList = () => {
  const dispatch = useDispatch();
  const [twoFaChecked, setTwoFaChecked] = useState(false);

  const handleToggle = () => {
    setTwoFaChecked(!twoFaChecked);
  };

  const navigate = useNavigate();
  // A] States Declaration :
  const moduleName = "Authenticator";
  const [authList, setAuthList] = useState([]);
  const [modelRequestData, setModelRequestData] = useState({
    mfaKeyID: null,
    authenticatorName: null,
    status: "",
    Action: "",
    userKeyID: null,
    isDefault: null,
    StatusType: null,
    keyID: null,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(-1);
  const common = useSelector((state) => state.Storage); //Getting Logged Users Details From Persist Storage of redux hooks
  const [primarySortDirection, setPrimarySortDirection] = useState(null);
  const [primarySortDirectionObj, setPrimarySortDirectionObj] = useState({
    AuthenticatorNameSort: null,
    authenticationType: null,
  });
  const [sortType, setSortType] = useState("");
  const [searchKeyword, setSearchKeyword] = useState(null);
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
    handleErrorMessage,
    getCrudButtonTextName,
    getPlaceholderTextName,
    getCrudButtonToolTipName,
  } = useContext(AuthContextProvider);

  let getAuthenticationListApiCallCount = 0;
  const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
  const [openErrorModal, setOpenErrorModal] = React.useState(false);

  const pageSize = isMobile ? isMobileRecords : desktopRecords;
  const formattedErrorMessage = handleErrorMessage(errorMessage);

  // B] Initial useEffect :
  // 1) Will Call Initial Api Like List Api
  useEffect(() => {
    setTopbar("block");
    GetAuthListData(1, null, null, null);
  }, []);

  //2) This useEffect will trigger when we successfully add or update record from popup model
  useEffect(() => {
    if (isAddUpdateActionDone) {
      if (modelRequestData.Action === null) {
        setSearchKeyword(null);
        setPrimarySortDirection(null);
        setCurrentPage(1);
        GetAuthListData(1, null, null, null);
      } else {
        GetAuthListData(currentPage);
      }
      setIsAddUpdateActionDone(false);
    }
  }, [isAddUpdateActionDone]);

  useEffect(() => {
    if (modelRequestData.Action === null) {
      navigate("/security-model", { state: modelRequestData });
    }
  }, [modelRequestData]);

  // C] Calling All Api's like List and other Here :
  // 1) Get Auth List Data
  const GetAuthListData = async (
    i,
    searchKeywordValue,
    sortValue,
    AuthSortType
  ) => {
    setLoader(true);
    const pageNoList = i - 1;

    try {
      const data = await GetAuthenticationList({
        pageSize: 10,
        pageNo: pageNoList,
        userKeyID: common.userKeyID,
        searchKeyword:
          searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        primarySortDirection:
          sortValue === undefined ? primarySortDirection : sortValue,
        PrimarySortColumnName: sortType == "" ? AuthSortType : sortType || null,
      });

      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          getAuthenticationListApiCallCount = 0;
          if (data?.data?.responseData?.data) {
            const totalCount = data.data.totalCount;
            const authListData = data.data.responseData.data;

            if (pageNoList > 1 && authListData.length === 0) {
              let newPaneNo = Number(pageNoList);
              if (newPaneNo > 1) {
                newPaneNo = newPaneNo - 1;
              }
              GetAuthListData(
                newPaneNo,
                searchKeywordValue,
                sortValue,
                AuthSortType
              );
              setCurrentPage(pageNoList);
              return;
            }

            setListCount(totalCount);
            setAuthList(authListData);
            setTotalRecords(authListData.length);
          }
        } else {
          if (getAuthenticationListApiCallCount < maxCountToRecallApi) {
            getAuthenticationListApiCallCount += 1;
            setTimeout(function () {
              GetAuthListData(i, searchKeywordValue, sortValue, AuthSortType);
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

  const AuthenticationChangeStatusDataAndDeleteData = async () => {
    setLoader(true);
    if (modelRequestData.Action === "Status") {
      if (modelRequestData.StatusType === null) {
        try {
          const Data = await AuthenticationChangeStatus(
            modelRequestData.mfaKeyID,
            modelRequestData.userKeyID
          );
          if (Data) {
            setLoader(false);
            if (Data?.data?.statusCode === 200) {
              GetAuthListData(currentPage);
              setOpenSuccessModal(true);
            } else {
              setErrorMessage(Data?.response?.data?.errorMessage);
              setOpenErrorModal(true);
            }
            GetAuthListData(currentPage);
          }
        } catch (error) {
          console.log(error);
        }
      } else if (modelRequestData.StatusType === "2FaIsDefault") {
        try {
          const Data = await GetChangeIsDefaultStatus(
            modelRequestData.mfaKeyID,
            common.userKeyID,
            modelRequestData.isDefault
          );
          if (Data) {
            setLoader(false);
            if (Data?.data?.statusCode === 200) {
              setOpenSuccessModal(true);
            } else {
              setErrorMessage(Data?.response?.data?.errorMessage);
              setOpenErrorModal(true);
            }
            GetAuthListData(currentPage);
          }
        } catch (error) {
          console.log(error);
        }
      }
    } else if (modelRequestData.Action === "Delete") {
      try {
        const Data = await DeleteAuthentication(
          modelRequestData.mfaKeyID,
          modelRequestData.userKeyID
        );
        if (Data) {
          setLoader(false);
          if (Data?.data?.statusCode === 200) {
            GetAuthListData(currentPage);
            setOpenSuccessModal(true);
          } else {
            setErrorMessage(Data?.response?.data?.errorMessage);
            setOpenErrorModal(true);
          }
          GetAuthListData(currentPage);
        }
      } catch (error) {
        console.log(error);
      }
    } else if (
      modelRequestData.StatusType === "2FaStatusChange" &&
      modelRequestData.Action === "2FaStatusChange"
    ) {
      try {
        const response = await GetEnable2Fa(common.userKeyID);
        if (response) {
          setLoader(false);
          if (response.data?.statusCode === 200) {
            setOpenSuccessModal(true);
          } else {
            setErrorMessage(response.response.data.errorMessage);
            setOpenErrorModal(true);
          }
        }
      } catch (error) { }
    }
  };

  // F] Pagination :
  const handlePageChange = async (pageNumber) => {
    setCurrentPage(pageNumber);
    await GetAuthListData(pageNumber); // Call your function with the selected page number
  };

  // E] Sorting & handle Function

  const handleSort = (sortValue, AuthSortType) => {
    if (AuthSortType == "AuthenticatorName") {
      setPrimarySortDirection(sortValue);
      setPrimarySortDirectionObj({
        ...primarySortDirectionObj,
        AuthenticatorNameSort: sortValue,
      });
      setCurrentPage(1);
      GetAuthListData(1, searchKeyword, sortValue, AuthSortType);
    } else if (AuthSortType == "AuthenticationTypeName") {
      setPrimarySortDirection(sortValue);
      setPrimarySortDirectionObj({
        ...primarySortDirectionObj,
        authenticationType: sortValue,
      });
      setCurrentPage(1);
      GetAuthListData(1, searchKeyword, sortValue, AuthSortType);
    }
  };

  const handleSearch = (e) => {
    const searchKeywordValue = e.target.value;
    setSearchKeyword(searchKeywordValue);
    setCurrentPage(1);
    GetAuthListData(1, searchKeywordValue);
  };

  const handleCloseSuccessModel = (data) => {
    if (modelRequestData.Action === "2FaStatusChange") {
      dispatch(
        updateState({
          enableMFA: common.enableMFA == 1 ? 0 : 1,
        })
      );
      $("#" + "ConfirmModel").modal("hide");
      $("#" + "RecordsAvailablePopupModel").modal("hide");
      setOpenSuccessModal(false);
      setOpenErrorModal(false);
    } else {
      $("#" + "ConfirmModel").modal("hide");
      $("#" + "RecordsAvailablePopupModel").modal("hide");
      setOpenSuccessModal(false);
      setOpenErrorModal(false);
    }
  };

  const handleClose = () => {
    $("#" + "ConfirmModel").modal("hide");
    $("#" + "RecordsAvailablePopupModel").modal("hide");
    setOpenSuccessModal(false);
    setOpenErrorModal(false);
  };

  const AuthenticationAddBtnClicked = () => {
    {
      setModelRequestData({
        ...modelRequestData,
        mfaKeyID: null,
        Action: null,
      });
    }
  };

  //Design part :
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
                    <div id="customerList" style={{marginTop: "3rem"}}>
                      <div class="bg-light border-bottom px-2">
                        <div class="">
                          <div className="row">
                <div className="col-md-4 col-4">
                  <div class="page-title-cls">Security</div>
                </div>
                <div class="col-md-8 ms-auto">
                  <div className="d-flex justify-content-sm-end">
                    <Tooltip title={`Enable/Disable 2 step verification`}>
                      <div
                        className="d-flex gap-2 justify-content-sm-end add-new-btn"
                        // style={{ marginRight: "10px" }}
                      >
                        <span style={{ marginBottom: "5px" }}>
                          {common.enableMFA == 1 ? "Disable" : "Enable"} 2 step
                          verification{" "}
                        </span>{" "}
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Android12Switch
                                checked={common.enableMFA == 1}
                                onClick={() =>
                                  setModelRequestData({
                                    ...modelRequestData,
                                    status:
                                      common.enableMFA == 1
                                        ? "Disable"
                                        : "Enable",
                                    StatusType: "2FaStatusChange",
                                    Action: "2FaStatusChange",
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
                    {isMobile && (
                      <div className="d-flex justify-content-sm-end add-new-btn text-nowrap">
                        <CommonButtonComponent
                          title={getCrudButtonToolTipName("Add", moduleName)}
                          name={getCrudButtonTextName("Add", moduleName)}
                          setTitle={"setTitle"}
                          onclick={() => AuthenticationAddBtnClicked()}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="">
            <div class="row">
              <div class="col-lg-12">
                <div class="card ">
                  <div class="card-body">
                    <div id="customerList">
                      <div class="row g-4 mb-3"></div>
                      <div class="table-responsive table-card mt-2 mb-3 table-padding">
                        {/* <div className="row">
                        
                        </div> */}

                        <div className="row">
                          <div class="col-lg-10 col-md-10 col-sm-9">
                            <span style={{ fontWeight: "600" }}>
                              Two-factor authentication adds an additional layer
                              of security to your account by requiring more than
                              just a password for signing in.
                            </span>
                          </div>
                          {!isMobile && (
                            <div class="col-lg-2 col-md-2 col-sm-3">
                              <div className="d-flex justify-content-sm-end add-new-btn mb-2">
                                <CommonButtonComponent
                                  title={getCrudButtonToolTipName(
                                    "Add",
                                    "Verification"
                                  )}
                                  name={getCrudButtonTextName(
                                    "Add",
                                    "Verification"
                                  )}
                                  setTitle={"setTitle"}
                                  onclick={() => AuthenticationAddBtnClicked()}
                                />
                              </div>
                            </div>
                          )}
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
                                Verification Name
                                {primarySortDirectionObj.AuthenticatorNameSort ===
                                  "desc" && (
                                    <i
                                      onClick={() => {
                                        setSortType("AuthenticatorName");
                                        handleSort("asc", "AuthenticatorName");
                                      }}
                                      style={{ cursor: "pointer" }}
                                      class="fas fa-sort-alpha-up ml-1"
                                    ></i>
                                  )}
                                {(primarySortDirectionObj.AuthenticatorNameSort ===
                                  null ||
                                  primarySortDirectionObj.AuthenticatorNameSort ===
                                  "asc") && (
                                    <i
                                      onClick={() => {
                                        setSortType("AuthenticatorName");
                                        handleSort(
                                          primarySortDirectionObj.AuthenticatorNameSort ===
                                            null
                                            ? "asc"
                                            : "desc",
                                          "AuthenticatorName"
                                        );
                                      }}
                                      style={{ cursor: "pointer" }}
                                      class="fas fa-sort-alpha-down ml-1"
                                    ></i>
                                  )}
                              </td>

                              <td className="tr-table-class text-white profession-type-column">
                                {/* {showProfessionType && ( */}
                                <>
                                  Verification Type
                                  {primarySortDirectionObj?.authenticationType ===
                                    "desc" && (
                                      <i
                                        onClick={() => {
                                          setSortType("AuthenticationTypeName");
                                          handleSort(
                                            "asc",
                                            "AuthenticationTypeName"
                                          );
                                        }}
                                        style={{ cursor: "pointer" }}
                                        class="fas fa-sort-alpha-up ml-1"
                                      ></i>
                                    )}
                                  {(primarySortDirectionObj?.authenticationType ===
                                    null ||
                                    primarySortDirectionObj?.authenticationType ===
                                    "asc") && (
                                      <i
                                        onClick={() => {
                                          setSortType("AuthenticationTypeName");
                                          handleSort(
                                            primarySortDirectionObj?.authenticationType ===
                                              null
                                              ? "asc"
                                              : "desc",
                                            "AuthenticationTypeName"
                                          );
                                        }}
                                        style={{ cursor: "pointer" }}
                                        class="fas fa-sort-alpha-down ml-1"
                                      ></i>
                                    )}
                                </>
                                {/* )} */}
                              </td>
                              <td className="tr-table-class text-white">
                                Is Default
                              </td>
                              <td className="tr-table-class text-white">
                                Status
                              </td>
                              <td className="tr-table-class text-white">
                                Action
                              </td>
                            </tr>
                          </thead>
                          <tbody class="list form-check-all">
                            {authList
                              ?.slice(
                                0,
                                isMobile ? isMobileRecords : desktopRecords
                              )
                              .map((auth, index) => {
                                return (
                                  <tr class="table_new" key={index}>
                                    <td className="table-content-font">
                                      {isMobile ? (
                                        <>
                                          {auth.authenticatorName?.length > 20
                                            ? auth.authenticatorName.substring(
                                              0,
                                              20
                                            ) + "..."
                                            : auth.authenticatorName}
                                        </>
                                      ) : (
                                        <>
                                          {auth.authenticatorName.length >
                                            45 ? (
                                            <Tooltip
                                              title={auth.authenticatorName}
                                            >
                                              {auth.authenticatorName.substring(
                                                0,
                                                45
                                              ) + "..."}
                                            </Tooltip>
                                          ) : (
                                            <>{auth?.authenticatorName}</>
                                          )}
                                        </>
                                      )}
                                    </td>
                                    <td className="table-content-font">
                                      {auth?.authenticationTypeName}
                                    </td>
                                    <td className="Switch table-content-font">
                                      <div
                                        style={{ alignItems: "none" }}
                                        class="d-flex gap-2 "
                                      >
                                        <div style={{ width: "20px" }}>
                                          {" "}
                                          {auth.isDefault === 0 ? "No" : "Yes"}
                                        </div>
                                        <Tooltip
                                          title={getCrudButtonToolTipName(
                                            "Change Is Default"
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
                                                        auth.isDefaultName,
                                                      keyID: auth.keyID,
                                                      mfaKeyID: auth.mfaKeyID,
                                                      userKeyID:
                                                        common.userKeyID,
                                                      isDefault:
                                                        auth.isDefault ===
                                                          1
                                                          ? false
                                                          : true,
                                                      StatusType:
                                                        "2FaIsDefault",
                                                      Action: "Status",
                                                    })
                                                  }
                                                  checked={auth.isDefault === 1}
                                                  data-bs-toggle="modal"
                                                  data-bs-target="#ConfirmModel"
                                                />
                                              }
                                            />
                                          </FormGroup>
                                        </Tooltip>
                                      </div>
                                    </td>
                                    <td className="Switch table-content-font">
                                      <div
                                        style={{ alignItems: "none" }}
                                        class="d-flex gap-2 "
                                      >
                                        <div style={{ width: "40px" }}>
                                          {" "}
                                          {auth.statusName}
                                        </div>
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
                                                      status: auth.statusName,
                                                      keyID: auth.keyID,
                                                      mfaKeyID: auth.mfaKeyID,
                                                      userKeyID:
                                                        common.userKeyID,
                                                      StatusType: null,
                                                      Action: "Status",
                                                    })
                                                  }
                                                  checked={
                                                    auth.statusName === "Active"
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
                                    <td className="table-content-font">
                                      <div class="d-flex gap-2">
                                        <Tooltip
                                          title={getCrudButtonToolTipName(
                                            "Delete",
                                            // moduleName
                                            "Verification"
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
                                                  mfaKeyID: auth.mfaKeyID,
                                                  authenticatorName:
                                                    auth.authenticatorName,
                                                  userKeyID: common.userKeyID,
                                                  StatusType: null,
                                                  Action: "Delete",
                                                })
                                              }
                                            >
                                              <i class="ri-delete-bin-5-fill"></i>
                                            </button>
                                          </div>
                                        </Tooltip>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>

                        {totalRecords <= 0 && (
                          <NoResultFoundModel
                            name={"2 Step Verification"}
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
              UpdatedStatus={AuthenticationChangeStatusDataAndDeleteData}
            />

            {/* Success Modal  */}
            <SuccessModal
              handleClose={handleCloseSuccessModel}
              setOpenSuccessModal={setOpenSuccessModal}
              openSuccessModal={openSuccessModal}
              modelAction={modelRequestData.Action}
              message={
                modelRequestData.Action === "Delete"
                  ? "Verification" + " " + modelRequestData.authenticatorName
                  : modelRequestData.Action === "2FaStatusChange"
                    ? `Verification status has been changed successfully!`
                    : "Status has been changed successfully!"
              }
            />
          </div>
        </div>
        </div>
        </div>
        </div>
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

export default SecurityList;
