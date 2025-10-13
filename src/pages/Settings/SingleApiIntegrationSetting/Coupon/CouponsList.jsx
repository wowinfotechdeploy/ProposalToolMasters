/* global $ */
import React, { useContext, useEffect, useState } from "react";
import CommonButtonComponent from "../../../../components/CommonButtonComponent";
import { useSelector } from "react-redux";
import CouponsModal from "./CouponModal";
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
import { ChangeCouponStatus, DeleteCouponCode, GetCouponCodeList } from "../../../../redux/Services/Setting/CouponApi";
import { useNavigate } from "react-router-dom";
const CouponCodeList = () => {
  let getCouponCodeListApiCallCount = 0;
  const navigate = useNavigate();
  // A] States Declaration :
  const moduleName = "Coupon";
  const [couponCodeList, setCouponCodeList] = useState([]);

  const [modelRequestData, setModelRequestData] = useState({
    CouponCodeName: "",
    couponKeyID: null,
    Action: null,
    userKeyID: null,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(-1);
  const common = useSelector((state) => state.Storage); //Getting Logged Users Details From Persist Storage of redux hooks
  const [primarySortDirection, setPrimarySortDirection] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
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
    formatValue,
    formatValueWithoutCurrencySymbol,
    activeOrganizationSubscriptionPlan
  } = useContext(AuthContextProvider);
  const pageSize = isMobile ? isMobileRecords : desktopRecords;
  // B] Initial useEffect :
  // 1) Will Call Initial Api Like List Api
  useEffect(() => {
    if (!activeOrganizationSubscriptionPlan?.apiIntegration) {
      navigate(-1); // Redirect to the previous page
    }
    setTopbar("block");
    GetCouponCodeListData(1);
  }, []);

  //2) This useEffect will trigger when we successfully add or update record from popup model
  useEffect(() => {
    if (isAddUpdateActionDone) {
      if (modelRequestData.Action === null) {
        setSearchKeyword("");
        setPrimarySortDirection(null);
        setCurrentPage(1);
        GetCouponCodeListData(1, null, null);
      } else {
        GetCouponCodeListData(currentPage);
      }
      setIsAddUpdateActionDone(false);
    }
  }, [isAddUpdateActionDone]);

  // C] Calling All Api's like List and other Here :
  // 1) Get Coupon List Data
  const GetCouponCodeListData = async (i, searchKeywordValue, sortValue) => {
    // setLoader(true);
    const pageNoList = i - 1;
    try {
      const data = await GetCouponCodeList({
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
          getCouponCodeListApiCallCount = 0;
          if (data?.data?.responseData?.data) {
            const totalCount = data.data.totalCount;
            const CouponCodeListData = data.data.responseData.data;
            if (pageNoList > 0 && CouponCodeListData.length === 0) {
              let newPaneNo = Number(pageNoList);
              if (newPaneNo > 1) {
                newPaneNo = newPaneNo - 1;
              }
              GetCouponCodeListData(newPaneNo, searchKeywordValue, sortValue);
              setCurrentPage(pageNoList);
              return;
            }
            setListCount(totalCount);
            setCouponCodeList(CouponCodeListData);
            setTotalRecords(CouponCodeListData.length);
          }
        } else {
          if (getCouponCodeListApiCallCount < maxCountToRecallApi) {
            getCouponCodeListApiCallCount += 1;
            setTimeout(function () {
              GetCouponCodeListData(i, searchKeywordValue, sortValue);
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
  // 1) On Click Coupon Add Button
  const CouponCodeAddBtnClicked = () => {
    setModelRequestData({
      ...modelRequestData,
      Action: null,
      couponKeyID: null
    });

  };

  // 2) On Click Coupon Delete Button
  const DeleteCouponCodeData = async () => {
    setLoader(true);
    try {
      if (modelRequestData.Action === "Status") {
        const Data = await ChangeCouponStatus(
          modelRequestData.couponKeyID,
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
          GetCouponCodeListData(currentPage);
        }
      } else {
        const Data = await DeleteCouponCode(
          modelRequestData.couponKeyID,
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
          GetCouponCodeListData(currentPage);
        }
      }

    } catch (error) {
      console.log(error);
    }
  };

  // F] Pagination :
  const handlePageChange = async (pageNumber) => {
    setCurrentPage(pageNumber);
    await GetCouponCodeListData(pageNumber); // Call your function with the selected page number
  };



  const handleSearch = (e) => {
    const searchKeywordValue = e.target.value;
    setSearchKeyword(searchKeywordValue);
    setCurrentPage(1);
    GetCouponCodeListData(1, searchKeywordValue);
  };

  const handleClose = () => {
    $("#" + "ConfirmModel").modal("hide");
    setOpenSuccessModal(false);
    setOpenErrorModal(false);
  };
  const UpdateCouponCode = (CouponCode) => {
    setModelRequestData({
      ...modelRequestData,
      couponKeyID: CouponCode.couponKeyID,
      Action: "Update"
    })
  }
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
                    <div id="customerList" style={{ marginTop: "3rem" }}>
                      <div class="bg-light border-bottom px-2">
                        <div className="container">
                          <div className="row">
                            <div className="col-md-6 p-0 justify-content-start d-flex align-items-center">
                  <div class="page-title-cls">Coupons</div>
                </div>
                <div className="col-auto ms-auto">
                  <div className="d-flex justify-content-sm-end add-new-btn">
                    {/* {userAccessData.Admin_Setting_CouponCodeCanAdd && */}
                    {common.organisationKeyID !== null && (
                      <CommonButtonComponent
                        title={getCrudButtonToolTipName("Add", moduleName)}
                        name={getCrudButtonTextName("Add", moduleName)}
                        dataBsTarget="#CouponModel"
                        data_bs_toggle="modal"
                        AddBtn={() => CouponCodeAddBtnClicked()}
                      />)}
                    {/* )} */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="">
            <div class="row">
              <div class="col-lg-12">
                <div class="card">
                  <div class="card-body">
                    <div id="customerList">
                      <div class="row g-4 mb-3"></div>
                      <div class="table-responsive table-card mt-2 mb-3 table-padding">
                        {/* <div class="search-box col-md-4 col-8 width-searchbox mb-2">
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
                        </div> */}
                        <table
                          class="table align-middle table-nowrap"
                          id="customerTable"
                        >
                          <thead class="table-light table-header-font">
                            <tr className="head-row ">
                              <td
                                className="tr-table-class text-white"
                                style={{
                                  width: "10%",
                                }}
                              >
                                Coupon Code
                              </td>
                              <td className="tr-table-class  text-white">
                                Coupon Amount
                              </td>
                              <td className="tr-table-class  text-white">
                                Validity Count
                              </td>
                              <td className="tr-table-class  text-white">
                                Coupon Type
                              </td>
                              <td className="tr-table-class  text-white">
                                Validity From Date
                              </td>
                              <td className="tr-table-class  text-white">
                                Validity To Date
                              </td>
                              <td className="tr-table-class  text-white">
                                Status
                              </td>
                              <td className="tr-table-class text-center text-white">

                                <>Action</>

                              </td>
                            </tr>
                          </thead>
                          <tbody class="list form-check-all ">
                            {couponCodeList
                              .slice(
                                0,
                                isMobile ? isMobileRecords : desktopRecords
                              )
                              .map((CouponCode) => {
                                return (
                                  <tr class="table_new">
                                    <td className="table-content-font" style={{ width: "40%" }}>
                                      {CouponCode.couponCode}
                                    </td>

                                    <td className="table-content-font">
                                      {" "}
                                      {formatValue(CouponCode.couponAmount)}
                                    </td>
                                    <td className="table-content-font">
                                      {" "}
                                      {formatValueWithoutCurrencySymbol(CouponCode.validityCount)}
                                    </td>
                                    <td className="table-content-font">
                                      {" "}
                                      {CouponCode.couponType}
                                    </td>
                                    <td className="table-content-font">
                                      {CouponCode.fromDate !== null ? new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(CouponCode.fromDate)) : ""}
                                    </td>
                                    <td className="table-content-font">
                                      {CouponCode.toDate !== null ? new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(CouponCode.toDate)) : ""}
                                    </td>

                                    <td className="Switch table-content-font">

                                      <div
                                        style={{ alignItems: "none" }}
                                        class="d-flex gap-2"
                                      >
                                        <Tooltip
                                          title={"Change Status"
                                          }
                                        >
                                          <div style={{ width: "50px" }}>
                                            {CouponCode.statusName}
                                          </div>
                                        </Tooltip>
                                        <Tooltip
                                          title={getCrudButtonToolTipName(
                                            "Change Status"
                                          )}
                                        >
                                          <FormGroup>
                                            <FormControlLabel
                                              control={
                                                <Android12Switch
                                                  data-bs-toggle="modal"
                                                  data-bs-target="#ConfirmModel"
                                                  onClick={() =>
                                                    setModelRequestData({
                                                      ...modelRequestData,
                                                      couponKeyID:
                                                        CouponCode.couponKeyID,
                                                      userKeyID: common.userKeyID,
                                                      Action: "Status",
                                                    })
                                                  }
                                                  checked={
                                                    CouponCode.statusName ===
                                                    "Active"
                                                  }
                                                />
                                              }
                                            />
                                          </FormGroup>
                                        </Tooltip>
                                      </div>
                                    </td>
                                    {/* <td> {CouponCode.statusName}</td> */}
                                    <td className="table-content-font">
                                      {!CouponCode.isUsed &&
                                        <>
                                          <div class="d-flex gap-2 justify-content-center">
                                            <Tooltip
                                              title={getCrudButtonToolTipName(
                                                "Update",
                                                moduleName
                                              )}
                                            >
                                              <div class="edit">
                                                <button

                                                  class="btn btn-sm btn-success edit-item-btn actionButtonsStyle"
                                                  data-bs-toggle="modal"
                                                  data-bs-target="#CouponModel"
                                                  onClick={() => UpdateCouponCode(CouponCode)}
                                                >
                                                  <i class="ri-pencil-fill"></i>
                                                </button>
                                              </div>
                                            </Tooltip>
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
                                                      couponKeyID:
                                                        CouponCode.couponKeyID,
                                                      CouponCodeName:
                                                        CouponCode.accessKeyName,
                                                      userKeyID: common.userKeyID,
                                                      Action: "Delete",
                                                    })
                                                  }
                                                >
                                                  <i class="ri-delete-bin-5-fill"></i>
                                                </button>
                                              </div>
                                            </Tooltip>
                                          </div>
                                        </>}

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
              UpdatedStatus={DeleteCouponCodeData}
            />

            {/* Success Modal  */}
            <SuccessModal
              handleClose={handleClose}
              setOpenSuccessModal={setOpenSuccessModal}
              openSuccessModal={openSuccessModal}
              modelAction={modelRequestData.Action}
              message={
                modelRequestData.Action === "Delete"
                  ? moduleName + " " + modelRequestData.CouponCodeName
                  : "Status has been changed successfully!"
              }
            />
            {/* Modal  */}
            <CouponsModal
              class="modal fade"
              id="CouponModel"
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

export default CouponCodeList;
