/* global $ */
import React, { useState, useEffect, useContext } from "react";
import "./SubscriptionPackage.css";
import { useNavigate } from "react-router-dom";
import CommonButtonComponent from "../../../components/CommonButtonComponent";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Android12Switch from "../../../components/AndroidSwitch";
import SubscriptionPackageModel from "./SubscriptionPackageModel";
import ConfirmModel from "../../../components/ConfirmationBox";
import PaginationComponent from "../../../components/PaginationModel";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import NoResultFoundModel from "../../../components/NoResultFoundModel";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteSubscriptionPackage,
  GetSubscriptionPackageList,
  SubscriptionPackageChangeStatus,
} from "../../../redux/Services/Subscription/PackageApi";
import { AuthContextProvider } from "../../../AuthContext/AuthContext";
import ErrorModel from "../../../components/ErrorModel";
import SuccessModal from "../../../components/SuccessModal";
import Footer from "../../../components/Footer";
// import { updateState } from "../../../redux/Persist";
import { updateState } from "../../../redux/Persist";
const Subscription_Package = () => {
  const moduleName = "Subscription Package";
  // A] States Declaration :
  const [subscriptionPackageList, setSubscriptionPackageList] = useState([]);
  const [totalRecords, setTotalRecords] = useState(-1);
  const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [modelRequestData, setModelRequestData] = useState({
    isFreePackage: null,
    subscriptionPackageKeyID: null,
    packageName: null,
    status: "",
    Action: "",
    userKeyID: null,
  });
  // const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  // const totalPage = Math.ceil(listCount / 10); // Calculate the total number of pages based on listCount
  const common = useSelector((state) => state.Storage); //Getting Logged Users Details From Persist Storage of redux hooks
  const [primarySortDirection, setPrimarySortDirection] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const {
    setLoader,
    setTopbar,
    userAccessData,
    maxCountToRecallApi,
    totalPage,
    isMobile,
    setListCount,
    listCount,
    desktopRecords,
    isMobileRecords,
    handleErrorMessage,
    getPlaceholderTextName,
    formatValue,
  } = useContext(AuthContextProvider);
  let getServiceCategoryListApiCallCount = 0;

  const pageSize = isMobile ? isMobileRecords : desktopRecords;
  const formattedErrorMessage = handleErrorMessage(errorMessage);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isEditAction, setIsEditAction] = useState(false);
  // B] Initial useEffect :
  // 1) Will Call Initial Api Like List Api
  useEffect(() => {
    setTopbar("block");
    GetSubscriptionPackageListData(1);
  }, []);

  //2) This useEffect will trigger when we successfully add or update record from popup model
  useEffect(() => {
    if (isAddUpdateActionDone) {
      if (modelRequestData.Action === null) {
        setSearchKeyword("");
        setPrimarySortDirection(null);
        setCurrentPage(1);
        GetSubscriptionPackageListData(1, null, null);
      } else {
        GetSubscriptionPackageListData(currentPage);
      }

      setIsAddUpdateActionDone(false);
    }
  }, [isAddUpdateActionDone]);

  useEffect(() => {
    if (
      modelRequestData.Action === "Update" &&
      modelRequestData.subscriptionPackageKeyID !== null
    ) {
      setTopbar("none");
      navigate("/subscriptionModal", { state: modelRequestData });
    } else if (modelRequestData.Action === null) {
      GetSubscriptionPackageListData(1);
    }
  }, [modelRequestData, navigate]);

  // C] Calling All Api's like List and other Here :
  // 1) Get subscription package List Data
  const GetSubscriptionPackageListData = async (
    i,
    searchKeywordValue,
    sortValue
  ) => {
    setLoader(true);
    const pageNoList = i - 1;
    try {
      const data = await GetSubscriptionPackageList({
        pageSize: pageSize,
        pageNo: pageNoList,
        searchKeyword:
          searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        primarySortDirection:
          sortValue === undefined ? primarySortDirection : sortValue,
      });
      if (data) {
        setLoader(false);
        getServiceCategoryListApiCallCount = 0;
        if (data?.data?.statusCode === 200) {
          if (data?.data?.responseData?.data) {
            const totalCount = data.data.totalCount;
            const SubscriptionPackageListData = data.data.responseData.data;
            if (pageNoList > 0 && SubscriptionPackageListData.length === 0) {
              let newPaneNo = Number(pageNoList);
              if (newPaneNo > 1) {
                newPaneNo = newPaneNo - 1;
              }
              GetSubscriptionPackageListData(
                newPaneNo,
                searchKeywordValue,
                sortValue
              );
              setCurrentPage(pageNoList);
              return;
            }
            setListCount(totalCount);
            setSubscriptionPackageList(SubscriptionPackageListData);
            setTotalRecords(SubscriptionPackageListData.length);
          }
        } else {
          if (getServiceCategoryListApiCallCount < maxCountToRecallApi) {
            getServiceCategoryListApiCallCount += 1;
            setTimeout(function () {
              GetSubscriptionPackageListData(i, searchKeywordValue, sortValue);
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
  // 1) On Click subscription package Add Button
  const SubscriptionPackageAddBtnClicked = () => {
    {
      setModelRequestData({
        ...modelRequestData,
        subscriptionPackageKeyID: null,
        Action: null,
      });
    }
    let addEmailTemplateRequestData = {
      subscriptionPackageKeyID: null,
      packageName: null,
      status: "",
      Action: null,
      userKeyID: null,
    };
    setTopbar("none");
    navigate("/subscriptionModal", { state: addEmailTemplateRequestData });
  };
  // 2) On Click subscription package Edit Button
  const SubscriptionPackageEditBtnClicked = (subscriptionPackage) => {
    // debugger;
    // dispatch(updateState({ currentPage: currentPage }));
    setModelRequestData(() => ({
      ...modelRequestData,
      subscriptionPackageKeyID: subscriptionPackage?.subscriptionPackageKeyID,
      Action: "Update",
      isFreePackage: subscriptionPackage.isFreePackage,
    }));
  };
  const handleChangeStatus = (subscriptionPackage) => {
    setModelRequestData((prevState) => ({
      ...prevState,
      status: subscriptionPackage.statusName,
      subscriptionPackageKeyID: subscriptionPackage.subscriptionPackageKeyID,
      userKeyID: common.userKeyID,
      Action: "Status",
    }));
  };
  // Update Function Modal
  // 2) On Click subscription package Status Button
  const SubscriptionPackageChangeStatusDataAndDeleteData = async () => {
    setLoader(true);
    if (modelRequestData.Action === "Status") {
      try {
        const Data = await SubscriptionPackageChangeStatus(
          modelRequestData.subscriptionPackageKeyID,
          modelRequestData.userKeyID
        );
        if (Data) {
          setLoader(false);
          if (Data?.data?.statusCode === 200) {
            setOpenSuccessModal(true);
          } else {
            setErrorMessage(
              Data?.response?.data?.errors?.SubscriptionPackageKeyID[0]
            );
            setOpenErrorModal(true);
          }
          GetSubscriptionPackageListData(currentPage);
        }
      } catch (error) {
        console.log(error);
      }
    } else if (modelRequestData.Action === "Delete") {
      try {
        const Data = await DeleteSubscriptionPackage(
          modelRequestData.subscriptionPackageKeyID,
          modelRequestData.userKeyID
        );
        if (Data) {
          setLoader(false);
          if (Data?.data?.statusCode === 200) {
            setOpenSuccessModal(true);
          } else {
            setErrorMessage(Data?.response?.data.errorMessage);
            setOpenErrorModal(true);
          }
        }

        GetSubscriptionPackageListData(currentPage);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // F] Pagination :
  const handlePageChange = async (pageNumber) => {
    setCurrentPage(pageNumber);
    await GetSubscriptionPackageListData(pageNumber); // Call your function with the selected page number
  };

  // E] Sorting & handle Function
  const HandleSort = (sortValue) => {
    setPrimarySortDirection(sortValue);
    setCurrentPage(1);
    GetSubscriptionPackageListData(1, searchKeyword, sortValue);
  };
  const HandleSearch = (e) => {
    const searchKeywordValue = e.target.value;
    setSearchKeyword(searchKeywordValue);
    setCurrentPage(1);
    GetSubscriptionPackageListData(1, searchKeywordValue);
  };

  const handleClose = () => {
    $("#" + "ConfirmModel").modal("hide");
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
                        <div className="container">
                          <div className="row">
                            <div className="col-md-6 p-0 ">
                  <div class="page-title-cls">Subscription Packages</div>
                </div>
                <div class="col-auto ms-auto">
                  <div className="d-flex justify-content-sm-end add-new-btn">
                    {userAccessData.SuperAdmin_Config_Subscription_Package_CanAdd && (
                      <CommonButtonComponent
                        title={`Add ${moduleName} `}
                        // dataBsTarget="#addUpdateModal"
                        // data_bs_toggle="modal"
                        name={`Add ${moduleName} `}
                        AddBtn={() => SubscriptionPackageAddBtnClicked()}
                      />
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
                        <div class="search-box col-md-3 col-8 width-searchbox mb-2">
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
                                style={{ width: "50%" }}
                              >
                                {moduleName} Name
                                {primarySortDirection === "desc" && (
                                  <i
                                    onClick={() => {
                                      HandleSort("asc");
                                    }}
                                    style={{ cursor: "pointer" }}
                                    class="fas fa-sort-alpha-up ml-1"
                                  ></i>
                                )}{" "}
                                {(primarySortDirection === null ||
                                  primarySortDirection === "asc") && (
                                  <i
                                    onClick={() => {
                                      HandleSort(
                                        primarySortDirection === null
                                          ? "asc"
                                          : "desc"
                                      );
                                    }}
                                    style={{ cursor: "pointer" }}
                                    class="fas fa-sort-alpha-down ml-1"
                                  ></i>
                                )}
                              </td>
                              <td className="tr-table-class text-white">
                                Monthly Price
                              </td>
                              <td className="tr-table-class text-white">
                                Yearly Price
                              </td>

                              <td className="tr-table-class text-white">
                                Status
                              </td>
                              <td className="tr-table-class text-white">
                                {(userAccessData.SuperAdmin_Config_Subscription_Package_CanDelete ||
                                  userAccessData.SuperAdmin_Config_Subscription_Package_CanEdit) && (
                                  <>Action</>
                                )}
                              </td>
                            </tr>
                          </thead>
                          <tbody class="list form-check-all">
                            {subscriptionPackageList.map(
                              (subscriptionPackage) => {
                                return (
                                  <tr class="table_new">
                                    <td className="table-content-font">
                                      {subscriptionPackage.packageName}
                                    </td>
                                    <td className="table-content-font">
                                      {formatValue(
                                        subscriptionPackage.monthlyPrice
                                      )}
                                      {/* {Number(subscriptionPackage.monthlyPrice)
                                        .toFixed(2)
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} */}
                                      {/* {subscriptionPackage.monthlyPrice} */}
                                    </td>
                                    <td className="table-content-font">
                                      {formatValue(
                                        subscriptionPackage.yearlyPrice
                                      )}
                                      {/* {Number(subscriptionPackage.yearlyPrice)
                                        .toFixed(2)
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} */}
                                      {/* {subscriptionPackage.yearlyPrice} */}
                                    </td>
                                    <td className="Switch">
                                      <div
                                        style={{
                                          alignItems: "none",
                                          marginLeft:
                                            userAccessData.SuperAdmin_Config_Subscription_Package_CanEdit
                                              ? ""
                                              : "10px",
                                        }}
                                        class="d-flex gap-2 "
                                      >
                                        <div style={{ width: "50px" }}>
                                          {" "}
                                          {subscriptionPackage.statusName}
                                        </div>
                                        {userAccessData.SuperAdmin_Config_Subscription_Package_CanEdit && (
                                          <Tooltip title={"Change Status"}>
                                            <FormGroup>
                                              <FormControlLabel
                                                control={
                                                  <Android12Switch
                                                    disabled={
                                                      subscriptionPackage.isFreePackage
                                                    }
                                                    onClick={() =>
                                                      setModelRequestData(
                                                        (prevState) => ({
                                                          ...prevState,
                                                          status:
                                                            subscriptionPackage.statusName,
                                                          subscriptionPackageKeyID:
                                                            subscriptionPackage.subscriptionPackageKeyID,
                                                          userKeyID:
                                                            common.userKeyID,
                                                          Action: "Status",
                                                        })
                                                      )
                                                    }
                                                    checked={
                                                      subscriptionPackage.statusName ===
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
                                        {userAccessData.SuperAdmin_Config_Subscription_Package_CanEdit && (
                                          <Tooltip
                                            title={
                                              "Update Subscription Package"
                                            }
                                          >
                                            <div class="edit">
                                              <button
                                                onClick={() =>
                                                  SubscriptionPackageEditBtnClicked(
                                                    subscriptionPackage
                                                  )
                                                }
                                                class="btn btn-sm btn-success edit-item-btn actionButtonsStyle"
                                              >
                                                <i class="ri-pencil-fill"></i>
                                              </button>
                                            </div>
                                          </Tooltip>
                                        )}
                                        {userAccessData.SuperAdmin_Config_Subscription_Package_CanDelete &&
                                          !subscriptionPackage.isFreePackage && (
                                            <Tooltip
                                              title={
                                                "Delete Subscription Package"
                                              }
                                            >
                                              <div class="remove">
                                                <button
                                                  class="btn btn-sm btn-danger remove-item-btn actionButtonsStyle"
                                                  data-bs-toggle="modal"
                                                  data-bs-target="#ConfirmModel"
                                                  onClick={() =>
                                                    setModelRequestData({
                                                      ...modelRequestData,
                                                      subscriptionPackageKeyID:
                                                        subscriptionPackage.subscriptionPackageKeyID,
                                                      packageName:
                                                        subscriptionPackage.packageName,
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
                                );
                              }
                            )}
                          </tbody>
                        </table>

                        {totalRecords <= 0 && (
                          <NoResultFoundModel
                            name={moduleName}
                            totalRecords={totalRecords}
                          />
                        )}
                        {listCount > 6 && (
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
              UpdatedStatus={SubscriptionPackageChangeStatusDataAndDeleteData}
            />

            {/* Success Modal  */}
            <SuccessModal
              handleClose={handleClose}
              setOpenSuccessModal={setOpenSuccessModal}
              openSuccessModal={openSuccessModal}
              modelAction={modelRequestData.Action}
              message={`${
                modelRequestData.Action === "Delete"
                  ? `Subscription package ${modelRequestData.packageName}`
                  : "Status has been changed successfully!"
              }`}
            />

            {/* Modal  */}
            {/* <SubscriptionPackageModel
              class="modal fade"
              id="addUpdateModal"
              tabIndex="-1"
              aria_labelledby="exampleModalLabel"
              aria_hidden="true"
              setIsAddUpdateActionDone={setIsAddUpdateActionDone}
              modelRequestData={modelRequestData}
            /> */}
          </div>
        </div>
        <Footer />
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
  );
};
export default Subscription_Package;
