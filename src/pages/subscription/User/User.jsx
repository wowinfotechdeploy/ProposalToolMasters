import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./User.css";
import "./User-redesign.css";
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
    getCrudButtonToolTipName,
    getPlaceholderTextName,
    userAccessData,
    formatValue,
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
      SubscriptionStartDate: null,
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
    if (
      modelRequestData.Action === "Update" &&
      modelRequestData.ospKeyID !== null
    ) {
      setTopbar("none");
      navigate("/UserSubscriptionTab", { state: modelRequestData });
    }
  }, [modelRequestData, navigate]);

  const SubscriptionPackageEditBtnClicked = (UserData) => {
    dispatch(updateState({ currentPage: currentPage }));
    setModelRequestData((prevState) => ({
      ...prevState,
      ospKeyID: UserData.ospKeyID,
      Action: "Update",
    }));
  };

  const GetUserListData = async (
    i,
    searchKeywordValue,
    sortValue,
    UserSort,
  ) => {
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
          UserSort === undefined || UserSort === null || UserSort === ""
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
    <div className="container-fluid subscription-user-list-redesign">
      <div className="subscription-user-list-page">
        {/* =====================================================
            PAGE HEADER
            ===================================================== */}
        <div className="subscription-user-page-header">
          <div className="subscription-user-heading-copy">
            <h1>Practice Subscriptions</h1>
            <p>
              Review practice subscription packages, pricing, renewal dates and
              current subscription status.
            </p>
          </div>

          <div className="subscription-user-count">
            <span className="subscription-user-count-icon">
              <i className="ri-building-4-line"></i>
            </span>

            <div>
              <span>Total Practices</span>
              <strong>{listCount > 0 ? listCount : 0}</strong>
            </div>
          </div>
        </div>

        {/* =====================================================
            LIST CARD
            ===================================================== */}
        <section className="subscription-user-list-card">
          {/* SEARCH */}
          <div className="subscription-user-toolbar">
            <div className="subscription-user-search-wrap">
              <i className="ri-search-line"></i>

              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => {
                  handleSearch(e);
                }}
                className="form-control subscription-user-search-input"
                placeholder={
                  isMobile
                    ? "Search"
                    : getPlaceholderTextName("Search", moduleName)
                }
              />
            </div>

            <span className="subscription-user-toolbar-note">
              {listCount > 0
                ? `${listCount} ${listCount === 1 ? "practice" : "practices"}`
                : "No practices"}
            </span>
          </div>

          {/* TABLE */}
          <div className="subscription-user-table-scroll">
            <table className="subscription-user-table" id="customerTable">
              <thead>
                <tr>
                  <th>
                    <button
                      type="button"
                      className="subscription-user-sort-btn"
                      onClick={() => {
                        handleUserSort(
                          primaryUserSortDirectionObj.TradingBusinessName ===
                            null
                            ? "asc"
                            : primaryUserSortDirectionObj.TradingBusinessName ===
                                "asc"
                              ? "desc"
                              : "asc",
                          "TradingBusinessName",
                        );
                      }}
                    >
                      <span>Practice Name</span>
                      <i
                        className={
                          primaryUserSortDirectionObj.TradingBusinessName ===
                          "desc"
                            ? "fas fa-sort-alpha-up"
                            : "fas fa-sort-alpha-down"
                        }
                      ></i>
                    </button>
                  </th>

                  <th>
                    <button
                      type="button"
                      className="subscription-user-sort-btn"
                      onClick={() => {
                        handleUserSort(
                          primaryUserSortDirectionObj.EmailID === null
                            ? "asc"
                            : primaryUserSortDirectionObj.EmailID === "asc"
                              ? "desc"
                              : "asc",
                          "EmailID",
                        );
                      }}
                    >
                      <span>Email</span>
                      <i
                        className={
                          primaryUserSortDirectionObj.EmailID === "desc"
                            ? "fas fa-sort-alpha-up"
                            : "fas fa-sort-alpha-down"
                        }
                      ></i>
                    </button>
                  </th>

                  <th>
                    <button
                      type="button"
                      className="subscription-user-sort-btn"
                      onClick={() => {
                        handleUserSort(
                          primaryUserSortDirectionObj.PhoneNo === null
                            ? "asc"
                            : primaryUserSortDirectionObj.PhoneNo === "asc"
                              ? "desc"
                              : "asc",
                          "PhoneNo",
                        );
                      }}
                    >
                      <span>Contact No</span>
                      <i
                        className={
                          primaryUserSortDirectionObj.PhoneNo === "desc"
                            ? "fas fa-sort-alpha-up"
                            : "fas fa-sort-alpha-down"
                        }
                      ></i>
                    </button>
                  </th>

                  <th>
                    <button
                      type="button"
                      className="subscription-user-sort-btn"
                      onClick={() => {
                        handleUserSort(
                          primaryUserSortDirectionObj.PackageName === null
                            ? "asc"
                            : primaryUserSortDirectionObj.PackageName === "asc"
                              ? "desc"
                              : "asc",
                          "PackageName",
                        );
                      }}
                    >
                      <span>Package Name</span>
                      <i
                        className={
                          primaryUserSortDirectionObj.PackageName === "desc"
                            ? "fas fa-sort-alpha-up"
                            : "fas fa-sort-alpha-down"
                        }
                      ></i>
                    </button>
                  </th>

                  <th>
                    <button
                      type="button"
                      className="subscription-user-sort-btn"
                      onClick={() => {
                        handleUserSort(
                          primaryUserSortDirectionObj.PackagePrice === null
                            ? "asc"
                            : primaryUserSortDirectionObj.PackagePrice === "asc"
                              ? "desc"
                              : "asc",
                          "PackagePrice",
                        );
                      }}
                    >
                      <span>Package Price</span>
                      <i
                        className={
                          primaryUserSortDirectionObj.PackagePrice === "desc"
                            ? "fas fa-sort-alpha-up"
                            : "fas fa-sort-alpha-down"
                        }
                      ></i>
                    </button>
                  </th>

                  <th>
                    <button
                      type="button"
                      className="subscription-user-sort-btn"
                      onClick={() => {
                        handleUserSort(
                          primaryUserSortDirectionObj.SubscriptionStartDate ===
                            null
                            ? "asc"
                            : primaryUserSortDirectionObj.SubscriptionStartDate ===
                                "asc"
                              ? "desc"
                              : "asc",
                          "SubscriptionStartDate",
                        );
                      }}
                    >
                      <span>Subscription Start Date</span>
                      <i
                        className={
                          primaryUserSortDirectionObj.SubscriptionStartDate ===
                          "desc"
                            ? "fas fa-sort-alpha-up"
                            : "fas fa-sort-alpha-down"
                        }
                      ></i>
                    </button>
                  </th>

                  <th>
                    <button
                      type="button"
                      className="subscription-user-sort-btn"
                      onClick={() => {
                        handleUserSort(
                          primaryUserSortDirectionObj.NextRenewalDate === null
                            ? "asc"
                            : primaryUserSortDirectionObj.NextRenewalDate ===
                                "asc"
                              ? "desc"
                              : "asc",
                          "NextRenewalDate",
                        );
                      }}
                    >
                      <span>Next Renewal Date</span>
                      <i
                        className={
                          primaryUserSortDirectionObj.NextRenewalDate === "desc"
                            ? "fas fa-sort-alpha-up"
                            : "fas fa-sort-alpha-down"
                        }
                      ></i>
                    </button>
                  </th>

                  <th>Subscription Status</th>

                  <th className="subscription-user-actions-heading">Action</th>
                </tr>
              </thead>

              <tbody>
                {userListRecord?.map((UserData, index) => {
                  const statusClass =
                    UserData.subscriptionStatus === "Active"
                      ? "is-active"
                      : UserData.subscriptionStatus === "Expired"
                        ? "is-expired"
                        : UserData.subscriptionStatus === "Pending"
                          ? "is-pending"
                          : UserData.subscriptionStatus === "InActive"
                            ? "is-inactive"
                            : "is-default";

                  return (
                    <tr key={UserData.ospKeyID || index}>
                      {/* PRACTICE */}
                      <td>
                        <div className="subscription-user-practice-cell">
                          {/* <span className="subscription-user-practice-icon">
                            <i className="ri-building-line"></i>
                          </span> */}

                          <strong>{UserData.organisationName}</strong>
                        </div>
                      </td>

                      {/* EMAIL */}
                      <td>
                        <Tooltip title={UserData.email || ""}>
                          <span className="subscription-user-ellipsis">
                            {UserData.email}
                          </span>
                        </Tooltip>
                      </td>

                      {/* CONTACT */}
                      <td>
                        <span>{UserData.mobileNumber || "NA"}</span>
                      </td>

                      {/* PACKAGE */}
                      <td>
                        <span className="subscription-user-package-pill">
                          {UserData.packageName}
                        </span>
                      </td>

                      {/* PRICE */}
                      <td>
                        <strong className="subscription-user-price">
                          {formatValue(UserData.packagePrice)}
                        </strong>
                      </td>

                      {/* START DATE */}
                      <td>
                        <span className="subscription-user-date">
                          {UserData.subscriptionStartDate
                            ? UserData.subscriptionStartDate
                            : "_"}
                        </span>
                      </td>

                      {/* RENEWAL */}
                      <td>
                        <span className="subscription-user-date">
                          {UserData.nextRenewalDate
                            ? UserData.nextRenewalDate
                            : "_"}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td>
                        <span
                          className={`subscription-user-status-pill ${statusClass}`}
                        >
                          <i className="ri-checkbox-blank-circle-fill"></i>
                          {UserData.subscriptionStatus}
                        </span>
                      </td>

                      {/* ACTION */}
                      <td className="subscription-user-actions-cell">
                        {userAccessData.SuperAdmin_Config_Subscription_User_CanEdit && (
                          <Tooltip title={"Update Subscription Package"}>
                            <button
                              type="button"
                              onClick={() =>
                                SubscriptionPackageEditBtnClicked(UserData)
                              }
                              className="subscription-user-action-btn"
                            >
                              <i className="ri-pencil-fill"></i>
                            </button>
                          </Tooltip>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalRecords <= 0 && (
            <div className="subscription-user-empty-state">
              <NoResultFoundModel
                name={moduleName}
                totalRecords={totalRecords}
              />
            </div>
          )}
        </section>

        {/* =====================================================
            PAGINATION OUTSIDE LIST CARD
            ===================================================== */}
        {listCount > pageSize && (
          <div className="subscription-user-pagination">
            <PaginationComponent
              totalCount={listCount}
              totalPages={totalPage}
              desktopRecords={desktopRecords}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      <div className="subscription-user-footer-wrap">
        <Footer />
      </div>
    </div>
  );
};

export default User;
