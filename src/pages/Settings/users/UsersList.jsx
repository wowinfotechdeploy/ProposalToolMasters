/* global $ */
import React, { useContext, useEffect, useState } from "react";
import "./UsersStyle.css";
import { useDispatch, useSelector } from "react-redux";
import PaginationComponent from "../../../components/PaginationModel";
import CommonButtonComponent from "../../../components/CommonButtonComponent";
import UsersModel from "./UsersModel";
import {
  DeleteUser,
  GetInviteUsersList,
  UserChangeStatus,
} from "../../../redux/Services/Setting/InviteUserApi";
import ConfirmModel from "../../../components/ConfirmationBox";
import { Tooltip } from "@mui/material";
import NoResultFoundModel from "../../../components/NoResultFoundModel";
import { AuthContextProvider } from "../../../AuthContext/AuthContext";
import ErrorModel from "../../../components/ErrorModel";
import SuccessModal from "../../../components/SuccessModal";
import Footer from "../../../components/Footer";
import { useNavigate } from "react-router-dom";
import { resetState, updateState } from "../../../redux/Persist";
import { GetOrganisationLookupList } from "../../../redux/Services/Master/OrganisationLookupList";

const UsersList = () => {
  let getUsersListApiCallCount = 0;
  const moduleName = "User";
  // A] States Declaration :
  const [usersList, setUsersList] = useState([]);
  const [modelRequestData, setModelRequestData] = useState({
    userName: null,
    InviteUserKeyID: null,
    Action: null,
    userKeyID: null,
  });
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const common = useSelector((state) => state.Storage); //Getting Logged Users Details From Persist Storage of redux hooks
  const [primarySortDirectionUsers, setPrimarySortDirectionUsers] =
    useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
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
  } = useContext(AuthContextProvider);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
  const [primaryUserSortDirectionObj, setPrimaryUserSortDirectionObj] =
    useState({
      UserNameTypeSort: null,
      LastNameTypeSort: null,
      RoleTypeSort: null,
      AcceptanceStatusTypeSort: null,
    });
  const [UserSortType, setUserSortType] = useState("");
  const dispatch = useDispatch();
  const [totalRecords, setTotalRecords] = useState(-1);
  // B] Initial useEffect :
  // 1) Will Call Initial Api Like List Api
  useEffect(() => {
    setTopbar("block");
  }, []);

  useEffect(() => {
    GetUsersListData(1);
  }, [common.organisationKeyID]);

  //2) This useEffect will trigger when we successfully add or update record from popup model
  useEffect(() => {
    if (isAddUpdateActionDone) {
      if (modelRequestData.Action === null) {
        setSearchKeyword("");
        setPrimarySortDirectionUsers(null);
        setCurrentPage(1);
        GetUsersListData(1, null, null);
      } else {
        GetUsersListData(currentPage);
      }

      setIsAddUpdateActionDone(false);
    }
  }, [isAddUpdateActionDone]);

  // C] Calling All Api's like List and other Here :
  // 1) Get Users List Data
  const GetUsersListData = async (
    i,
    searchKeywordValue,
    sortValue,
    InviteUserSort
  ) => {
    setLoader(true);
    const pageNoList = i - 1;
    try {
      const data = await GetInviteUsersList({
        pageSize: 10,
        pageNo: pageNoList,
        organisationKeyID: common.organisationKeyID,
        searchKeyword:
          searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        primarySortDirection:
          sortValue === undefined ? primarySortDirectionUsers : sortValue,
        PrimarySortColumnName:
          UserSortType == "" ? InviteUserSort : UserSortType,
      });
      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          getUsersListApiCallCount = 0;
          if (data?.data?.responseData?.data) {
            const totalCount = data.data.totalCount;
            const UsersListData = data.data.responseData.data;
            if (pageNoList > 0 && UsersListData.length === 0) {
              let newPaneNo = Number(pageNoList);
              if (newPaneNo > 1) {
                newPaneNo = newPaneNo - 1;
              }
              GetUsersListData(
                newPaneNo,
                searchKeywordValue,
                sortValue,
                InviteUserSort
              );
              setCurrentPage(pageNoList);
              return;
            }
            setListCount(totalCount);
            setUsersList(UsersListData);
            setTotalRecords(UsersListData.length);
          }
        } else {
          if (getUsersListApiCallCount < maxCountToRecallApi) {
            getUsersListApiCallCount += 1;
            setTimeout(function () {
              GetUsersListData(
                i,
                searchKeywordValue,
                sortValue,
                InviteUserSort
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

  // E] Event Handling Functions will call here.
  // 1) On Click Users Add Button
  const UsersAddBtnClicked = (users) => {
    {
      setModelRequestData({
        ...modelRequestData,
        InviteUserKeyID: null,
        Action: null,
      });
    }
  };
  // 2) On Click Users Edit Button
  const UsersEditBtnClicked = (users) => {
    {
      setModelRequestData({
        ...modelRequestData,
        Action: "Update",
        inviteUserKeyID: users.inviteUserKeyID,
      });
    }
  };

  // 2) On Click Users Delete Button
  const DeleteUserData = async () => {
    setLoader(true);
    try {
      const Data = await DeleteUser(
        modelRequestData.InviteUserKeyID,
        modelRequestData.userKeyID
      );
      if (Data) {
        setLoader(false);
        if (Data?.data?.statusCode === 200) {
          localStorage.removeItem("OrganisationLocalList");
          setOpenSuccessModal(true);
        } else {
          setErrorMessage(Data?.response?.data?.errors?.InviteUserKeyID[0]);
          setOpenErrorModal(true);
        }
        GetUsersListData(currentPage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // F] Pagination :
  const HandlePageChange = async (pageNumber) => {
    setCurrentPage(pageNumber);
    await GetUsersListData(pageNumber); // Call your function with the selected page number
  };

  // E] Sorting & handle Function
  const handleUserSort = (sortValue, UserSort) => {
    if (UserSort == "FirstName") {
      setPrimarySortDirectionUsers(sortValue);
      setPrimaryUserSortDirectionObj({
        ...primaryUserSortDirectionObj,
        UserNameTypeSort: sortValue,
      });
      setCurrentPage(1);
      GetUsersListData(1, searchKeyword, sortValue, UserSort);
    } else if (UserSort == "LastName") {
      setPrimarySortDirectionUsers(sortValue);
      setPrimaryUserSortDirectionObj({
        ...primaryUserSortDirectionObj,
        LastNameTypeSort: sortValue,
      });
      setCurrentPage(1);
      GetUsersListData(1, searchKeyword, sortValue, UserSort);
    } else if (UserSort == "RoleName") {
      setPrimarySortDirectionUsers(sortValue);
      setPrimaryUserSortDirectionObj({
        ...primaryUserSortDirectionObj,
        RoleTypeSort: sortValue,
      });
      setCurrentPage(1);
      GetUsersListData(1, searchKeyword, sortValue, UserSort);
    } else if (UserSort == "AcceptanceStatus") {
      setPrimarySortDirectionUsers(sortValue);
      setPrimaryUserSortDirectionObj({
        ...primaryUserSortDirectionObj,
        AcceptanceStatusTypeSort: sortValue,
      });
      setCurrentPage(1);
      GetUsersListData(1, searchKeyword, sortValue, UserSort);
    }
  };
  const HandleSearch = (e) => {
    const searchKeywordValue = e.target.value;
    setSearchKeyword(searchKeywordValue);
    setCurrentPage(1);
    GetUsersListData(1, searchKeywordValue);
  };

  const handleClose = () => {
    $("#" + "ConfirmModel").modal("hide");
    const navigateAndRefresh = async () => {
      setLoader(true);

      const response = await GetOrganisationLookupList(common.userKeyID);
      const OrganisationsListData = response.data.responseData.data;
      setLoader(false);
      let ExistOrganisation = OrganisationsListData?.filter(
        (item) =>
          item.organisationKeyID?.toUpperCase() ===
          common.organisationKeyID?.toUpperCase()
      );
      if (OrganisationsListData.length === 0) {
        localStorage.removeItem("userThemeSettingLocalStorage");
        localStorage.removeItem("accessCount");
        localStorage.removeItem("userAccess");
        localStorage.removeItem("subscriptionPlan");
        dispatch(resetState());
        navigate("/login");
      } else if (ExistOrganisation.length !== 0) {
        dispatch(
          updateState({
            businessTypeID: common.businessTypeID,
            organisationKeyID: common.organisationKeyID,
            professionTypeLists: common.professionTypeLists,
            organisationCount: ExistOrganisation.length,
          })
        );
      } else {
        localStorage.removeItem("OrganisationLocalList");
        localStorage.removeItem("userThemeSettingLocalStorage");
        localStorage.removeItem("accessCount");
        localStorage.removeItem("userAccess");
        localStorage.removeItem("subscriptionPlan");
        dispatch(
          updateState({
            businessTypeID: "",
            organisationKeyID: "",
            professionTypeLists: "",
          })
        );
        window.location.reload(true);
      }
      // navigate("/");
      // window.location.reload(true);
    };

    // Call the navigateAndRefresh function
    navigateAndRefresh();

    setOpenSuccessModal(false);
    setOpenErrorModal(false);
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
                    <div id="customerList" style={{ marginTop: "3rem" }}>
                      <div class="bg-light border-bottom px-2">
                        {/* <div className="container"> */}
                          <div className="row">
                            <div className="col-md-6 p-0 ">
                  <div class="page-title-cls">{moduleName}</div>
                </div>
                <div className="col-auto ms-auto">
                              <div className="d-flex justify-content-sm-end add-new-btn">
                                {userAccessData.Admin_Setting_user_CanAdd && (
                                  <CommonButtonComponent
                                    title={getCrudButtonToolTipName("Invite", moduleName)}
                                    name={getCrudButtonTextName("Invite", moduleName
                                    )}
                                    dataBsTarget="#addUpdateModal"
                                    data_bs_toggle="modal"
                                    AddBtn={() => UsersAddBtnClicked()}
                                  />
                                )}{" "}
                              </div>
                            </div>
                  </div>
                {/* </div> */}
                </div>
          <div class="">
            <div class="row">
              <div class="col-lg-12">
                <div class="card">
                  <div class="card-body">
                    <div id="customerList">
                      <div class="row g-4 mb-3"></div>
                      <div class="table-responsive table-card mt-2 mb-3 table-padding"
                      >
                        <div class="search-box ms-2 width-searchbox">
                          <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12 ">
                              <div className="row align-items-center">
                                <div className="col-3 mb-2">
                                  <div class="search-box w-100 width-searchbox">
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
                                          : getPlaceholderTextName(
                                            "Search",
                                            moduleName
                                          )
                                      }
                                    />
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
                                style={{
                                  width: "30%",
                                }}
                              >
                                First Name{" "}
                                {primaryUserSortDirectionObj.UserNameTypeSort ===
                                  "desc" && (
                                    <i
                                      onClick={() => {
                                        setUserSortType("FirstName");
                                        handleUserSort("asc", "FirstName");
                                      }}
                                      style={{ cursor: "pointer" }}
                                      class="fas fa-sort-alpha-up ml-1"
                                    ></i>
                                  )}
                                {(primaryUserSortDirectionObj.UserNameTypeSort ===
                                  null ||
                                  primaryUserSortDirectionObj.UserNameTypeSort ===
                                  "asc") && (
                                    <i
                                      onClick={() => {
                                        setUserSortType("FirstName");
                                        handleUserSort(
                                          primaryUserSortDirectionObj.UserNameTypeSort ===
                                            null
                                            ? "asc"
                                            : "desc",
                                          "FirstName"
                                        );
                                      }}
                                      style={{ cursor: "pointer" }}
                                      class="fas fa-sort-alpha-down ml-1"
                                    ></i>
                                  )}
                              </td>
                              <td
                                className="tr-table-class text-white"
                                style={{
                                  width: "30%",
                                }}
                              >
                                Last Name{" "}
                              </td>
                              <td className="tr-table-class  text-white">
                                Email
                              </td>

                              <td className="tr-table-class  text-white">
                                Role
                                {primaryUserSortDirectionObj.RoleTypeSort ===
                                  "desc" && (
                                    <i
                                      onClick={() => {
                                        setUserSortType("RoleName");
                                        handleUserSort("asc", "RoleName");
                                      }}
                                      style={{ cursor: "pointer" }}
                                      class="fas fa-sort-alpha-up ml-1"
                                    ></i>
                                  )}
                                {(primaryUserSortDirectionObj.RoleTypeSort ===
                                  null ||
                                  primaryUserSortDirectionObj.RoleTypeSort ===
                                  "asc") && (
                                    <i
                                      onClick={() => {
                                        setUserSortType("RoleName");
                                        handleUserSort(
                                          primaryUserSortDirectionObj.RoleTypeSort ===
                                            null
                                            ? "asc"
                                            : "desc",
                                          "RoleName"
                                        );
                                      }}
                                      style={{ cursor: "pointer" }}
                                      class="fas fa-sort-alpha-down ml-1"
                                    ></i>
                                  )}
                              </td>
                              <td className="tr-table-class  text-white">
                                Acceptance Status
                                {primaryUserSortDirectionObj.AcceptanceStatusTypeSort ===
                                  "desc" && (
                                    <i
                                      onClick={() => {
                                        setUserSortType("AcceptanceStatus");
                                        handleUserSort("asc", "AcceptanceStatus");
                                      }}
                                      style={{ cursor: "pointer" }}
                                      class="fas fa-sort-alpha-up ml-1"
                                    ></i>
                                  )}
                                {(primaryUserSortDirectionObj.AcceptanceStatusTypeSort ===
                                  null ||
                                  primaryUserSortDirectionObj.AcceptanceStatusTypeSort ===
                                  "asc") && (
                                    <i
                                      onClick={() => {
                                        setUserSortType("AcceptanceStatus");
                                        handleUserSort(
                                          primaryUserSortDirectionObj.AcceptanceStatusTypeSort ===
                                            null
                                            ? "asc"
                                            : "desc",
                                          "AcceptanceStatus"
                                        );
                                      }}
                                      style={{ cursor: "pointer" }}
                                      class="fas fa-sort-alpha-down ml-1"
                                    ></i>
                                  )}
                              </td>
                              <td className="tr-table-class  text-white">
                                {(userAccessData.Admin_Setting_user_CanEdit ||
                                  userAccessData.Admin_Setting_user_CanDelete) && (
                                    <>Action</>
                                  )}
                              </td>
                            </tr>
                          </thead>
                          <tbody class="list form-check-all">
                            {usersList
                              .slice(
                                0,
                                isMobile ? isMobileRecords : desktopRecords
                              )
                              .map((users) => {
                                return (
                                  <tr class="table_new">
                                    <td className="table-content-font">
                                      {isMobile ? (
                                        <>
                                          {users.firstName && users.firstName
                                            ?.substring(0, 20)
                                            .toLowerCase()
                                            .replace(/\b\w/g, (l) =>
                                              l.toUpperCase()
                                            ) + "..."}
                                        </>
                                      ) : (
                                        <>
                                          {users.firstName && users.firstName?.length > 40 ? (
                                            <Tooltip title={users.firstName}>
                                              {users.firstName
                                                .substring(0, 40)
                                                .toLowerCase()
                                                .replace(/\b\w/g, (l) =>
                                                  l.toUpperCase()
                                                ) + "..."}
                                            </Tooltip>
                                          ) : (
                                            <>
                                              {users.firstName && users.firstName
                                                ?.toLowerCase()
                                                .replace(/\b\w/g, (l) =>
                                                  l.toUpperCase()
                                                )}
                                            </>
                                          )}
                                        </>
                                      )}
                                      {/* {users.firstName.toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) + '...'} */}
                                    </td>
                                    <td className="table-content-font">
                                      {isMobile ? (
                                        <>
                                          {users.lastName && users.lastName?.substring(0, 20)
                                            .toLowerCase()
                                            .replace(/\b\w/g, (l) =>
                                              l.toUpperCase()
                                            ) + "..."}
                                        </>
                                      ) : (
                                        <>
                                          {users.lastName && users.lastName?.length > 40 ? (
                                            <Tooltip title={users.lastName}>
                                              {users.lastName && users.lastName?.substring(0, 40)
                                                .toLowerCase()
                                                .replace(/\b\w/g, (l) =>
                                                  l.toUpperCase()
                                                ) + "..."}
                                            </Tooltip>
                                          ) : (
                                            <>
                                              {users.lastName && users.lastName
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
                                      {users.email}
                                    </td>

                                    <td className="table-content-font">
                                      {users.roleName}
                                    </td>

                                    <td className="table-content-font">
                                      {users.acceptanceStatus}
                                    </td>
                                    <td>
                                      {users.roleName !== "Super Admin" ? (
                                        <div class="d-flex gap-2">
                                          {userAccessData.Admin_Setting_user_CanEdit && (
                                            <Tooltip
                                              title={getCrudButtonToolTipName(
                                                "Update",
                                                moduleName
                                              )}
                                            >
                                              <div class="edit">
                                                <button
                                                  onClick={() =>
                                                    UsersEditBtnClicked(users)
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
                                          {userAccessData.Admin_Setting_user_CanDelete && (
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
                                                      InviteUserKeyID:
                                                        users.inviteUserKeyID,
                                                      userName: users.firstName,
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
                                      ) : (
                                        ""
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
                  {listCount > 10 && (
                    <PaginationComponent
                      totalCount={listCount}
                      totalPages={totalPage}
                      currentPage={currentPage}
                      onPageChange={HandlePageChange}
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
              UpdatedStatus={DeleteUserData}
            />

            {/* Success Modal  */}
            <SuccessModal
              handleClose={handleClose}
              setOpenSuccessModal={setOpenSuccessModal}
              openSuccessModal={openSuccessModal}
              modelAction={modelRequestData.Action}
              message={
                modelRequestData.Action === "Delete"
                  ? `${moduleName} ${modelRequestData.userName}`
                  : "Status has been changed successfully!"
              }
            />
            {/* <!-- Modal --> */}

            <UsersModel
              class="modal fade"
              id="addUpdateModal"
              tabIndex="-1"
              aria_labelledby="addUpdateModal"
              aria_hidden="true"
              setIsAddUpdateActionDone={setIsAddUpdateActionDone}
              modelRequestData={modelRequestData}
            />
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

export default UsersList;
