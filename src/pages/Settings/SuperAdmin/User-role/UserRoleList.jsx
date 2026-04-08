/* global $ */
import React, { useContext, useEffect, useState } from "react";
import "../../../configure/service_categories/ServiceCategory.css";
import CommonButtonComponent from "../../../../components/CommonButtonComponent";
import UserRoleModel from "./UserRoleModel";
import AccessModel from "./AccessModel";
import ConfirmModel from "../../../../components/ConfirmationBox";
import {
  DeleteUserRole,
  GetUserRoleList,
  UserRoleChangeStatus,
} from "../../../../redux/Services/Config/UserRoleApi";
import PaginationComponent from "../../../../components/PaginationModel";
import { useSelector } from "react-redux";
import Android12Switch from "../../../../components/AndroidSwitch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import NoResultFoundModel from "../../../../components/NoResultFoundModel";
import { AuthContextProvider } from "../../../../AuthContext/AuthContext";
import SuccessModal from "../../../../components/SuccessModal";
import ErrorModel from "../../../../components/ErrorModel";
import Footer from "../../../../components/Footer";
import RecordsAvailablePopupModel from "../../../../components/RecordsAvailablePopupModel";
import { USER_ROLE_TYPE } from "../../../../Middleware/enums";

const UserRoleList = () => {
  // A] States Declaration :
  const moduleName = "User Role";
  const [UserRoleList, setUserRoleList] = useState([]);
  const [modelRequestData, setModelRequestData] = useState({
    roleTypeID: null,
    UserKeyID: null,
    roleName: null,
    status: "",
    Action: "",
    userKeyID: null,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const common = useSelector((state) => state.Storage); //Getting Logged Users Details From Persist Storage of redux hooks
  const [primarySortDirection, setPrimarySortDirection] = useState(null);
  const [primarySortDirectionObj, setPrimarySortDirectionObj] = useState({
    UserNameSort: null,
    ProfessionTypeSort: null,
  });
  const [sortType, setSortType] = useState("");
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
  const [totalRecords, setTotalRecords] = useState(-1);
  let getServiceCategoryListApiCallCount = 0;
  const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
  const [openErrorModal, setOpenErrorModal] = React.useState(false);
  const [showProfessionType, setShowProfessionType] = useState(
    common.organisationKeyID === null || common.professionTypeLists.length > 1
  );
  const pageSize = isMobile ? isMobileRecords : desktopRecords;
  // B] Initial useEffect :
  // 1) Will Call Initial Api Like List Api
  useEffect(() => {
    setTopbar("block");
    GetUserRoleListData(1, null, null, null);
  }, [pageSize]);

  //2) This useEffect will trigger when we successfully add or update record from popup model
  useEffect(() => {
    if (isAddUpdateActionDone) {
      if (modelRequestData.Action === null) {
        setSearchKeyword("");
        setPrimarySortDirection(null);
        setCurrentPage(1);
        GetUserRoleListData(1, null, null, null);
      } else {
        GetUserRoleListData(currentPage);
      }
      setIsAddUpdateActionDone(false);
    }
  }, [isAddUpdateActionDone]);

  // C] Calling All Api's like List and other Here :
  // 1) Get User Role List Data
  const GetUserRoleListData = async (
    i,
    searchKeywordValue,
    sortValue,
    ServiceSortType
  ) => {
    setLoader(true);
    const pageNoList = i - 1;
    if (pageSize === 0) {
      return;
    }
    try {
      const data = await GetUserRoleList({
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
            const UserRoleListData = data.data.responseData.data;
            if (pageNoList > 0 && UserRoleListData.length === 0) {
              let newPageNo = Number(pageNoList);
              if (newPageNo > 1) {
                newPageNo = newPageNo - 1;
              }
              GetUserRoleListData(
                newPageNo,
                searchKeywordValue,
                sortValue,
                ServiceSortType
              );
              setCurrentPage(pageNoList);
              return;
            }

            setListCount(totalCount);
            setUserRoleList(UserRoleListData);
            setTotalRecords(UserRoleListData.length);
          }
        } else {
          if (getServiceCategoryListApiCallCount < maxCountToRecallApi) {
            getServiceCategoryListApiCallCount += 1;
            setTimeout(function () {
              GetUserRoleListData(
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
  // 1) On Click User Role Add Button
  const UserRoleAddBtnClicked = (Action) => {
    if (Action === "accessModel") {
      setModelRequestData({
        ...modelRequestData,
        roleTypeID: null,
        Action: Action,
      });
    } else {
      setModelRequestData({
        ...modelRequestData,
        roleTypeID: null,
        Action: null,
      });
    }
  };
  // 2) On Click User Role Edit Button
  const UserRoleEditBtnClicked = (userRole) => {
    {
      setModelRequestData({
        ...modelRequestData,
        roleTypeID: userRole.roleTypeID,
        Action: "Update",
      });
    }
  };

  // Update Function Modal
  // 2) On Click User Role Status Button
  const UserRoleChangeStatusDataAndDeleteData = async () => {
    setLoader(true);
    if (modelRequestData.Action === "Status") {
      try {
        const Data = await UserRoleChangeStatus(
          modelRequestData.roleTypeID,
          modelRequestData.userKeyID
        );
        if (Data) {
          setLoader(false);
          if (Data?.data?.statusCode === 200) {
            if (Data?.data?.responseData.roleTypeExistsInUsers.length !== 0) {
              const servicePackageNames =
                Data?.data?.responseData.roleTypeExistsInUsers[0].recordList.map(
                  (item) => item.name
                );
              setModelRequestData({
                ...modelRequestData,
                Action: "UserRolesWarning",
                message: `This user role is assigned to the users listed below. Before deactivating it, you must remove the user role from following users.`,
                UserName: servicePackageNames,
              });
              $("#" + "ConfirmModel").modal("hide");
              $("#" + "RecordsAvailablePopupModel").modal("show");
              GetUserRoleListData(currentPage);
            } else {
              GetUserRoleListData(currentPage);
              setOpenSuccessModal(true);
            }
          } else {
            setErrorMessage(Data?.response?.data?.errorMessage);
            setOpenErrorModal(true);
            GetUserRoleListData(currentPage);
          }
        }
        GetUserRoleListData(currentPage);
      } catch (error) {
        console.log(error);
      }
    } else if (modelRequestData.Action === "Delete") {
      try {
        const Data = await DeleteUserRole(
          modelRequestData.roleTypeID,
          modelRequestData.userKeyID
        );
        if (Data) {
          setLoader(false);
          if (Data?.data?.statusCode === 200) {
            if (Data?.data?.responseData.roleTypeExistsInUsers.length !== 0) {
              const servicePackageNames =
                Data?.data?.responseData.roleTypeExistsInUsers[0].recordList.map(
                  (item) => item.name
                );
              setModelRequestData({
                ...modelRequestData,
                Action: "UserRolesWarning",
                message: `This user role is assigned to the users listed below. Before deactivating it, you must remove the user role from following users.`,
                UserName: servicePackageNames,
              });
              $("#" + "ConfirmModel").modal("hide");
              $("#" + "RecordsAvailablePopupModel").modal("show");
              GetUserRoleListData(currentPage);
            } else {
              GetUserRoleListData(currentPage);
              setOpenSuccessModal(true);
            }
          } else {
            setErrorMessage(Data?.response?.data?.errorMessage);
            setOpenErrorModal(true);
          }
          GetUserRoleListData(currentPage);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  // F] Pagination :
  const handlePageChange = async (pageNumber) => {
    setCurrentPage(pageNumber);
    await GetUserRoleListData(pageNumber); // Call your function with the selected page number
  };

  // E] Sorting & handle Function

  const handleSort = (sortValue, ServiceSortType) => {
    if (ServiceSortType == "RoleName") {
      setPrimarySortDirection(sortValue);
      setPrimarySortDirectionObj({
        ...primarySortDirectionObj,
        UserNameSort: sortValue,
      });
      setCurrentPage(1);
      GetUserRoleListData(1, searchKeyword, sortValue, ServiceSortType);
    }
  };

  const handleSearch = (e) => {
    const searchKeywordValue = e.target.value;
    setSearchKeyword(searchKeywordValue);
    setCurrentPage(1);
    GetUserRoleListData(1, searchKeywordValue);
  };

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
                  <div class="page-title-cls">User Role</div>
                </div>
                <div class="col-md-6 col-6">
                  <div className="d-flex  add-new-btn">
                    <div class="text-right flex1">
                      <Tooltip title="Set Default Access">
                        <button
                          className="btn btn-md btn-success create-item-btn"
                          onClick={() => UserRoleAddBtnClicked("accessModel")}
                          data-bs-target="#AccessModal"
                          data-bs-toggle="modal"
                          name={"Set Default Access"}
                          title={getCrudButtonToolTipName("Set Default Access")}
                        >
                          <i className="bi bi-plus-circle "></i>
                          <span className="d-none d-sm-inline">
                            {" "}
                            {"Set Default Access"}
                          </span>
                          <span className="d-inline d-sm-none">
                            {" "}
                            Set Access
                          </span>
                        </button>
                      </Tooltip>
                    </div>
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
                        <div className="row justify-content-between">
                          <div class="col-lg-6 col-md-10 col-sm-9  d-flex align-items-center">
                            <div class="search-box col-md-3 col-6 width-searchbox mb-2">
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
                          <div className="col-lg-2 col-md-2 col-sm-3">
                            <div className="d-flex justify-content-sm-end add-new-btn mb-2">
                              {userAccessData.SuperAdmin_Setting_User_Role_CanAdd && (
                                <CommonButtonComponent
                                  title={getCrudButtonToolTipName(
                                    "Add",
                                    moduleName
                                  )}
                                  dataBsTarget="#addUpdateModal"
                                  data_bs_toggle="modal"
                                  name={getCrudButtonTextName(
                                    "Add",
                                    moduleName
                                  )}
                                  AddBtn={() => UserRoleAddBtnClicked("User")}
                                />
                              )}
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
                                style={{ width: "80%" }}
                              >
                                User Role
                                {primarySortDirectionObj.UserNameSort ===
                                  "desc" && (
                                    <i
                                      onClick={() => {
                                        setSortType("RoleName");
                                        handleSort("asc", "RoleName");
                                      }}
                                      style={{ cursor: "pointer" }}
                                      class="fas fa-sort-alpha-up ml-1"
                                    ></i>
                                  )}
                                {(primarySortDirectionObj.UserNameSort ===
                                  null ||
                                  primarySortDirectionObj.UserNameSort ===
                                  "asc") && (
                                    <i
                                      onClick={() => {
                                        setSortType("RoleName");
                                        handleSort(
                                          primarySortDirectionObj.UserNameSort ===
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
                              <td
                                className="tr-table-class text-white profession-type-column"
                                style={{ width: "10%" }}
                              ></td>
                              <td className="tr-table-class text-white">
                                Status
                              </td>
                              <td
                                className="tr-table-class text-white"
                                style={{ width: "10%" }}
                              >
                                {(userAccessData.SuperAdmin_Setting_User_Role_CanDelete ||
                                  userAccessData.SuperAdmin_Setting_User_Role_CanEdit) && (
                                    <>Action</>
                                  )}
                              </td>
                            </tr>
                          </thead>
                          <tbody class="list form-check-all">
                            {UserRoleList?.slice(
                              0,
                              isMobile ? isMobileRecords : desktopRecords
                            ).map((userRole, index) => {
                              return (
                                <tr class="table_new" key={index}>
                                  <td className="table-content-font">
                                    {isMobile ? (
                                      <>
                                        {userRole.roleName.length > 20
                                          ? userRole.roleName.substring(0, 20) +
                                          "..."
                                          : userRole.roleName}
                                      </>
                                    ) : (
                                      <>
                                        {userRole.roleName?.length > 45 ? (
                                          <Tooltip title={userRole.roleName}>
                                            {userRole.roleName.substring(
                                              0,
                                              45
                                            ) + "..."}
                                          </Tooltip>
                                        ) : (
                                          <>{userRole.roleName}</>
                                        )}
                                      </>
                                    )}
                                  </td>
                                  <td className="table-content-font"></td>

                                  <td className="Switch table-content-font">
                                    <div
                                      style={{ alignItems: "none" }}
                                      class="d-flex gap-2 "
                                    >
                                      <div style={{ width: "50px" }}>
                                        {" "}
                                        {userRole.statusName}
                                      </div>
                                      {userAccessData.SuperAdmin_Setting_User_Role_CanDelete &&
                                        userRole.roleTypeID !== 1 &&
                                        userRole.roleTypeID !== 2 && (
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
                                                          userRole.statusName,
                                                        roleTypeID:
                                                          userRole.roleTypeID,
                                                        userKeyID:
                                                          common.userKeyID,
                                                        Action: "Status",
                                                      })
                                                    }
                                                    checked={
                                                      userRole.statusName ===
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
                                      {userRole.roleTypeID !== 1 &&
                                        userRole.roleTypeID !== 2 && (
                                          <>
                                            {userAccessData.SuperAdmin_Setting_User_Role_CanEdit && (
                                              <Tooltip
                                                title={getCrudButtonToolTipName(
                                                  "Update",
                                                  moduleName
                                                )}
                                              >
                                                <div class="edit">
                                                  <button
                                                    onClick={() =>
                                                      UserRoleEditBtnClicked(
                                                        userRole
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
                                            {userAccessData.SuperAdmin_Setting_User_Role_CanDelete && (
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
                                                        roleTypeID:
                                                          userRole.roleTypeID,
                                                        roleName:
                                                          userRole.roleName,
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
                                          </>
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
              ErrorMessage={
                errorMessage === "Please InActive this record first."
                  ? "Please change the status to InActive first."
                  : errorMessage
              }
            />
            {/* Confirm Modal  */}
            <ConfirmModel
              openErrorModal={openErrorModal}
              openSuccessModal={openSuccessModal}
              modelRequestData={modelRequestData}
              UpdatedStatus={UserRoleChangeStatusDataAndDeleteData}
            />
            <RecordsAvailablePopupModel
              id="RecordsAvailablePopupModel"
              handleClose={handleClose}
              openErrorModal={openErrorModal}
              openSuccessModal={openSuccessModal}
              modelRequestData={modelRequestData}
              UpdatedStatus={UserRoleChangeStatusDataAndDeleteData}
            />
            {/* Success Modal  */}
            <SuccessModal
              handleClose={handleClose}
              setOpenSuccessModal={setOpenSuccessModal}
              openSuccessModal={openSuccessModal}
              modelAction={modelRequestData.Action}
              message={
                modelRequestData.Action === "Delete"
                  ? `${moduleName} ${modelRequestData.roleName}`
                  : "Status has been changed successfully!"
              }
            />

            {/* User Model Modal  */}
            <UserRoleModel
              class="modal fade"
              id="addUpdateModal"
              tabIndex="-1"
              aria_labelledby="exampleModalLabel"
              aria_hidden="true"
              setIsAddUpdateActionDone={setIsAddUpdateActionDone}
              modelRequestData={modelRequestData}
            />
            <AccessModel
              class="modal fade"
              id="AccessModal"
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

export default UserRoleList;
