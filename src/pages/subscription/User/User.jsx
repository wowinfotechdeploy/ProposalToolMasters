import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./User.css";
import { AuthContextProvider } from "../../../AuthContext/AuthContext";
import Footer from "../../../components/Footer";
import Tooltip from "@mui/material/Tooltip";
import { GetUserList } from "../../../redux/Services/Subscription/UserListApi";
import PaginationComponent from "../../../components/PaginationModel";
import NoResultFoundModel from "../../../components/NoResultFoundModel";
import { useNavigate } from "react-router-dom";
import { updateState } from "../../../redux/Persist";
const User = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
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
    getCrudButtonToolTipName,
    getPlaceholderTextName,
    userAccessData, formatValue
  } = useContext(AuthContextProvider);
  const common = useSelector((state) => state.Storage);
  let getServiceCategoryListApiCallCount = 0;
  const [userListRecord, setUserListRecord] = useState([]);
  const [totalRecords, setTotalRecords] = useState(-1);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [modelRequestData, setModelRequestData] = useState({
    ospKeyID: null,
    packageName: null,
    status: "",
    Action: "",
    userKeyID: null,
  });
  const [primaryUserSortDirectionObj, setPrimaryUserSortDirectionObj] =
    useState({
      TradingBusinessName: null,
      EmailID: null,
      PackageName: null,
      SubscriptionStatus: null,
      PhoneNo: null,
      PackagePrice: null,
      NextRenewalDate: null,
      SubscriptionStartDate: null
    });
  const [primarySortDirectionUsers, setPrimarySortDirectionUsers] =
    useState(null);
  const pageSize = isMobile ? isMobileRecords : desktopRecords;
  const moduleName = "Practice";
  useEffect(() => {
    setTopbar("block");
    GetUserListData(1, null);
  }, []);
  useEffect(() => {
    if (isAddUpdateActionDone) {
      if (modelRequestData.Action === null) {
        navigate("/UserSubscriptionTab", { state: modelRequestData });
        setSearchKeyword("");

        setCurrentPage(1);
        GetUserListData(1, null);
      } else {
        GetUserListData(currentPage);
      }
      setIsAddUpdateActionDone(false);
    }
  }, [isAddUpdateActionDone]);

  useEffect(() => {
    if (modelRequestData.Action === "Update" && modelRequestData.ospKeyID !== null) {
      setTopbar("none");
      navigate("/UserSubscriptionTab", { state: modelRequestData });
    }
  }, [modelRequestData, navigate]);

  const SubscriptionPackageEditBtnClicked = (UserData) => {
    dispatch(updateState({ currentPage: currentPage }))
    setModelRequestData((prevState) => ({
      ...prevState,
      ospKeyID: UserData.ospKeyID,
      Action: "Update",
    }));

  };

  const GetUserListData = async (i, searchKeywordValue, sortValue,
    UserSort) => {
    setLoader(true);
    const pageNoList = i - 1;

    try {
      const data = await GetUserList({
        pageSize: pageSize,
        // pageNo: 0,
        pageNo: pageNoList,
        userKeyID: common.userKeyID,
        searchKeyword:
          searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        primarySortDirection:
          sortValue === undefined ? primarySortDirectionUsers : sortValue,
        PrimarySortColumnName:
          UserSort === undefined ||
            UserSort === null ||
            UserSort === ""
            ? null
            : UserSort,
      });

      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          getServiceCategoryListApiCallCount = 0;
          if (data?.data?.responseData?.data) {
            const totalCount = data.data.totalCount;
            const SubUserListData = data.data.responseData.data;

            if (pageNoList > 0 && SubUserListData.length === 0) {
              let newPaneNo = Number(pageNoList);
              if (newPaneNo > 1) {
                newPaneNo = newPaneNo - 1;
              }
              GetUserListData(newPaneNo, searchKeywordValue);
              setCurrentPage(pageNoList);
              return;
            }

            setListCount(totalCount);
            setUserListRecord(SubUserListData);
            setTotalRecords(SubUserListData.length);
          }
        } else {
          if (getServiceCategoryListApiCallCount < maxCountToRecallApi) {
            getServiceCategoryListApiCallCount += 1;
            setTimeout(function () {
              GetUserListData(i, searchKeywordValue);
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
  const handlePageChange = async (pageNumber) => {
    setCurrentPage(pageNumber);
    await GetUserListData(pageNumber); // Call your function with the selected page number
  };

  const handleSearch = (e) => {
    const searchKeywordValue = e.target.value;
    setSearchKeyword(searchKeywordValue);
    setCurrentPage(1);
    GetUserListData(1, searchKeywordValue);
  };

  const handleUserSort = (sortValue, UserSort) => {
    if (UserSort === "TradingBusinessName") {
      setPrimarySortDirectionUsers(sortValue);
      setPrimaryUserSortDirectionObj({
        ...primaryUserSortDirectionObj,
        TradingBusinessName: sortValue,
      });
      setCurrentPage(1);
      GetUserListData(1, searchKeyword, sortValue, UserSort);
    } else if (UserSort === "EmailID") {
      setPrimarySortDirectionUsers(sortValue);
      setPrimaryUserSortDirectionObj({
        ...primaryUserSortDirectionObj,
        EmailID: sortValue,
      });
      setCurrentPage(1);
      GetUserListData(1, searchKeyword, sortValue, UserSort);
    } else if (UserSort === "PackageName") {
      setPrimarySortDirectionUsers(sortValue);
      setPrimaryUserSortDirectionObj({
        ...primaryUserSortDirectionObj,
        PackageName: sortValue,
      });
      setCurrentPage(1);
      GetUserListData(1, searchKeyword, sortValue, UserSort);
    } else if (UserSort === "SubscriptionStatus") {
      setPrimarySortDirectionUsers(sortValue);
      setPrimaryUserSortDirectionObj({
        ...primaryUserSortDirectionObj,
        SubscriptionStatus: sortValue,
      });
      setCurrentPage(1);
      GetUserListData(1, searchKeyword, sortValue, UserSort);
    } else if (UserSort === "PackagePrice") {
      setPrimarySortDirectionUsers(sortValue);
      setPrimaryUserSortDirectionObj({
        ...primaryUserSortDirectionObj,
        PackagePrice: sortValue,
      });
      setCurrentPage(1);
      GetUserListData(1, searchKeyword, sortValue, UserSort);
    }
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
                <div className="col-md-6 col-6">
                  <div class="page-title-cls"> {moduleName}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div id="customerList">
                      <div class="row g-4 mb-3"></div>
                      <div class="table-responsive table-card mt-2 mb-3 table-padding">
                        <div className="search-box col-md-3 col-8 width-searchbox mb-2">
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
                              <td className="tr-table-class text-white">
                                Practice Name
                                {primaryUserSortDirectionObj.TradingBusinessName ===
                                  "desc" && (
                                    <i
                                      onClick={() => {
                                        handleUserSort(
                                          "asc",
                                          "TradingBusinessName"
                                        );
                                      }}
                                      style={{ cursor: "pointer" }}
                                      class="fas fa-sort-alpha-up ml-1"
                                    ></i>
                                  )}
                                {(primaryUserSortDirectionObj.TradingBusinessName ===
                                  null ||
                                  primaryUserSortDirectionObj.TradingBusinessName ===
                                  "asc") && (
                                    <i
                                      onClick={() => {
                                        handleUserSort(
                                          primaryUserSortDirectionObj.TradingBusinessName ===
                                            null
                                            ? "asc"
                                            : "desc",
                                          "TradingBusinessName"
                                        );
                                      }}
                                      style={{ cursor: "pointer" }}
                                      class="fas fa-sort-alpha-down ml-1"
                                    ></i>
                                  )}
                              </td>
                              <td className="tr-table-class text-white">
                                Email
                                {primaryUserSortDirectionObj.EmailID ===
                                  "desc" && (
                                    <i
                                      onClick={() => {
                                        handleUserSort(
                                          "asc",
                                          "EmailID"
                                        );
                                      }}
                                      style={{ cursor: "pointer" }}
                                      class="fas fa-sort-alpha-up ml-1"
                                    ></i>
                                  )}
                                {(primaryUserSortDirectionObj.EmailID ===
                                  null ||
                                  primaryUserSortDirectionObj.EmailID ===
                                  "asc") && (
                                    <i
                                      onClick={() => {
                                        handleUserSort(
                                          primaryUserSortDirectionObj.EmailID ===
                                            null
                                            ? "asc"
                                            : "desc",
                                          "EmailID"
                                        );
                                      }}
                                      style={{ cursor: "pointer" }}
                                      class="fas fa-sort-alpha-down ml-1"
                                    ></i>
                                  )}
                              </td>
                              <td className="tr-table-class text-white">
                                Contact No
                                {primaryUserSortDirectionObj.PhoneNo ===
                                  "desc" && (
                                    <i
                                      onClick={() => {
                                        handleUserSort(
                                          "asc",
                                          "PhoneNo"
                                        );
                                      }}
                                      style={{ cursor: "pointer" }}
                                      class="fas fa-sort-alpha-up ml-1"
                                    ></i>
                                  )}
                                {(primaryUserSortDirectionObj.PhoneNo ===
                                  null ||
                                  primaryUserSortDirectionObj.PhoneNo ===
                                  "asc") && (
                                    <i
                                      onClick={() => {
                                        handleUserSort(
                                          primaryUserSortDirectionObj.PhoneNo ===
                                            null
                                            ? "asc"
                                            : "desc",
                                          "PhoneNo"
                                        );
                                      }}
                                      style={{ cursor: "pointer" }}
                                      class="fas fa-sort-alpha-down ml-1"
                                    ></i>
                                  )}
                              </td>
                              <td className="tr-table-class text-white">
                                Package Name
                                {primaryUserSortDirectionObj.PackageName ===
                                  "desc" && (
                                    <i
                                      onClick={() => {
                                        handleUserSort(
                                          "asc",
                                          "PackageName"
                                        );
                                      }}
                                      style={{ cursor: "pointer" }}
                                      class="fas fa-sort-alpha-up ml-1"
                                    ></i>
                                  )}
                                {(primaryUserSortDirectionObj.PackageName ===
                                  null ||
                                  primaryUserSortDirectionObj.PackageName ===
                                  "asc") && (
                                    <i
                                      onClick={() => {
                                        handleUserSort(
                                          primaryUserSortDirectionObj.PackageName ===
                                            null
                                            ? "asc"
                                            : "desc",
                                          "PackageName"
                                        );
                                      }}
                                      style={{ cursor: "pointer" }}
                                      class="fas fa-sort-alpha-down ml-1"
                                    ></i>
                                  )}
                              </td>
                              <td className="tr-table-class text-white ">
                                Package Price
                                {primaryUserSortDirectionObj.PackagePrice ===
                                  "desc" && (
                                    <i
                                      onClick={() => {
                                        handleUserSort(
                                          "asc",
                                          "PackagePrice"
                                        );
                                      }}
                                      style={{ cursor: "pointer" }}
                                      class="fas fa-sort-alpha-up ml-1"
                                    ></i>
                                  )}
                                {(primaryUserSortDirectionObj.PackagePrice ===
                                  null ||
                                  primaryUserSortDirectionObj.PackagePrice ===
                                  "asc") && (
                                    <i
                                      onClick={() => {
                                        handleUserSort(
                                          primaryUserSortDirectionObj.PackagePrice ===
                                            null
                                            ? "asc"
                                            : "desc",
                                          "PackagePrice"
                                        );
                                      }}
                                      style={{ cursor: "pointer" }}
                                      class="fas fa-sort-alpha-down ml-1"
                                    ></i>
                                  )}
                              </td>

                              <td className="tr-table-class text-white">
                                Subscription <br />
                                Start Date
                                {primaryUserSortDirectionObj.SubscriptionStartDate ===
                                  "desc" && (
                                    <i
                                      onClick={() => {
                                        handleUserSort(
                                          "asc",
                                          "SubscriptionStartDate"
                                        );
                                      }}
                                      style={{ cursor: "pointer" }}
                                      class="fas fa-sort-alpha-up ml-1"
                                    ></i>
                                  )}
                                {(primaryUserSortDirectionObj.SubscriptionStartDate ===
                                  null ||
                                  primaryUserSortDirectionObj.SubscriptionStartDate ===
                                  "asc") && (
                                    <i
                                      onClick={() => {
                                        handleUserSort(
                                          primaryUserSortDirectionObj.SubscriptionStartDate ===
                                            null
                                            ? "asc"
                                            : "desc",
                                          "SubscriptionStartDate"
                                        );
                                      }}
                                      style={{ cursor: "pointer" }}
                                      class="fas fa-sort-alpha-down ml-1"
                                    ></i>
                                  )}
                              </td>
                              <td className="tr-table-class text-white">
                                Next Renewal <br /> Date
                                {primaryUserSortDirectionObj.NextRenewalDate ===
                                  "desc" && (
                                    <i
                                      onClick={() => {
                                        handleUserSort(
                                          "asc",
                                          "NextRenewalDate"
                                        );
                                      }}
                                      style={{ cursor: "pointer" }}
                                      class="fas fa-sort-alpha-up ml-1"
                                    ></i>
                                  )}
                                {(primaryUserSortDirectionObj.NextRenewalDate ===
                                  null ||
                                  primaryUserSortDirectionObj.NextRenewalDate ===
                                  "asc") && (
                                    <i
                                      onClick={() => {
                                        handleUserSort(
                                          primaryUserSortDirectionObj.NextRenewalDate ===
                                            null
                                            ? "asc"
                                            : "desc",
                                          "NextRenewalDate"
                                        );
                                      }}
                                      style={{ cursor: "pointer" }}
                                      class="fas fa-sort-alpha-down ml-1"
                                    ></i>
                                  )}
                              </td>
                              <td className="tr-table-class text-white">
                                Subscription <br /> Status

                              </td>
                              <td className="tr-table-class text-white">
                                Action
                              </td>
                            </tr>
                          </thead>
                          <tbody class="list form-check-all">
                            {userListRecord?.map((UserData) => {
                              return (
                                <tr class="table_new table-content-font">
                                  <td className="table-content-font">
                                    {UserData.organisationName}
                                  </td>
                                  <td className="table-content-font">
                                    {UserData.email}
                                  </td>
                                  <td className="table-content-font">
                                    {UserData.mobileNumber || "NA"}
                                  </td>
                                  <td className="table-content-font">
                                    {UserData.packageName}
                                  </td>
                                  <td className="table-content-font text-center">
                                    {formatValue(UserData.packagePrice)}
                                  </td>
                                  <td className="table-content-font text-center">
                                    {UserData.subscriptionStartDate
                                      ? UserData.subscriptionStartDate
                                      : "_"}
                                  </td>
                                  <td className="table-content-font text-center">
                                    {UserData.nextRenewalDate
                                      ? UserData.nextRenewalDate
                                      : "_"}
                                  </td>
                                  <td className="table-content-font">
                                    <div className="d-flex gap-2">
                                      {/* {UserData.subscriptionStatus ===
                                        "Active" && (
                                          <p
                                            className="  p-1 text-center text-white rounded"
                                            style={{ background: "#008000" }}
                                          >
                                            Active
                                          </p>
                                        )}
                                      {UserData.subscriptionStatus ===
                                        "Expired" && (
                                          <p
                                            className="  p-1 text-center text-white rounded"
                                            style={{ background: "#ff0a0a" }}
                                          >
                                            Expired
                                          </p>
                                        )} */}
                                      <div
                                        className="p-1 text-center  text-white rounded text-nowrap"
                                        style={{
                                          background:
                                            UserData.subscriptionStatus ===
                                              "Active"
                                              ? "#008000"
                                              : UserData.subscriptionStatus ===
                                                "Expired"
                                                ? "#FF0000"
                                                : UserData.subscriptionStatus ===
                                                  "Pending"
                                                  ? "#DAA520"
                                                  : UserData.subscriptionStatus ===
                                                    "InActive"
                                                    ? "#772424"
                                                    : "gray",
                                          width: "100px",
                                          padding: "1px 8px", // Add padding to the button
                                          display: "inline-block", // Ensure button stays in line
                                          borderRadius: "0.5rem", // Adjust border radius
                                        }}
                                      >
                                        {UserData.subscriptionStatus}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="table-content-font">
                                    {userAccessData.SuperAdmin_Config_Subscription_User_CanEdit && (
                                      <Tooltip
                                        title={"Update Subscription Package"}
                                      >
                                        <div class="edit">
                                          <button
                                            onClick={() =>
                                              SubscriptionPackageEditBtnClicked(
                                                UserData
                                              )
                                            }
                                            class="btn btn-sm btn-success edit-item-btn actionButtonsStyle"
                                          >
                                            <i class="ri-pencil-fill"></i>
                                          </button>
                                        </div>
                                      </Tooltip>
                                    )}
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
                {/* </div> */}
              </div>
            </div>

            {/* end row */}
          </div>
          {/* container-fluid  */}
        </div>
        {/* End Page-content */}
        </div>
        </div>
        </div>
        </div>
        </div>
      </div>
      <Footer />

      {/* start back-to-top */}
    </div>
  );
};

export default User;
