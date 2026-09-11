/* global $ */
import React, { useEffect, useState, useRef, useContext } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  SetAccess,
  UpdatePermission,
} from "../../../../redux/Services/Config/UserRoleApi";
import { ERROR_MESSAGES } from "../../../../components/GlobalMessage";
import SuccessModal from "../../../../components/SuccessModal";
import { AuthContextProvider } from "../../../../AuthContext/AuthContext";
import "./SuperAdminUserRole.css";
import "./AccessModel-redesign.css";
import { updateState } from "../../../../redux/Persist";
import { GetOrganisationLookupList } from "../../../../redux/Services/Master/OrganisationLookupList";
import ConfirmModel from "../../../../components/ConfirmationBox";
import DeleteDriverModal from "../../../../components/DeleteDriverModel";
import Tooltip from "@mui/material/Tooltip";
function AccessModel(props) {
  // A] States Declaration :
  const dispatch = useDispatch();
  const moduleName = "Set Default Access";
  const modalRef = useRef(null);
  const [modelAction, setModelAction] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [requireErrorMessage, setRequireErrorMessage] = useState(false);
  const [dismissModal, setDismissModal] = useState(null);
  const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
  const [defaultData, setDefaultData] = useState();
  const [modelRequestData, setModelRequestData] = useState({
    status: null,
    Action: "",
  });
  const [RoleTypeIndex, setRoleTypeIndex] = useState(null);
  const {
    setActiveOrganization,
    setLoader,
    getCrudButtonTextName,
    getCrudPopUpTitleName,
    SetAccessCount,
    accessCount,
    setEngagementName,
    setProposalName,
    setProspectName,
    setOrgLoaderList,
  } = useContext(AuthContextProvider);
  const common = useSelector((state) => state.Storage); //Getting Logged Users Details From Persist Storage of redux hooks
  const [permission, setPermission] = useState([]);
  const [checkbox, setCheckBox] = useState();
  const [openRole, setOpenRole] = useState(null);
  const [organisationsList, setOrganisationsList] = useState([]);
  const [mainData, setMainData] = useState({
    userKeyID: null,
    roleTypeActionList: null,
  });

  const [isOpens, setIsOpens] = useState(false);
  useEffect(() => {
    setModelAction(props.modelRequestData.Action === null ? "Add" : "Update");
    SetInitialModelData();
    if (props.modelRequestData.Action === "accessModel") {
      SetAccessDefault();
    }
  }, [props.modelRequestData]);

  // useEffect(() => {
  //   setModelAction(props.modelRequestData.Action === null ? "" : "Update")
  //   SetPermission();
  // },[props.modelRequestData.Action==="Update"]);

  const toggleSelect = (event) => {
    event.stopPropagation();
    setIsOpens(!isOpens);
  };
  // C] This function will clear all data from popup model
  const SetInitialModelData = () => {
    // SetAccessDefault()

    setOpenRole(null);
    setMainData({
      ...mainData,
      userKeyID: null,
      roleTypeActionList: null,
    });
    setErrorMessage("");
    setRequireErrorMessage(false);
  };

  // F] Calling CRUD Api here
  // 1) Get Model Data Api
  const SetAccessDefault = async () => {
    setLoader(true);
    try {
      const data = await SetAccess();
      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          const AccessData =
            data?.data?.responseData?.data?.roleTypePermissions;
          setLoader(false);
          setDefaultData(AccessData);
        }
      } else {
        setLoader(false);
        setErrorMessage(data?.data?.errorMessage);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  const SetPermission = async () => {
    const roleTypeActionList = [];
    let allActionsUnselected = true;
    defaultData?.forEach((role) => {
      const mActionList = [];
      role.modules?.forEach((module) => {
        module.moduleActions?.forEach((action) => {
          if (action.setDefaultAction) {
            mActionList.push({ mActionId: action.mActionId });
            allActionsUnselected = false;
          }
        });
      });
      if (mActionList.length > 0) {
        roleTypeActionList.push({
          roleTypeID: role.roleTypeID,
          mActionList: mActionList,
        });
      }
    });
    // Set access count based on whether any action is selected
    const newAccessCount = allActionsUnselected ? 0 : 1;
    // Update accessCount state
    SetAccessCount(newAccessCount);
    setLoader(true);
    // Store accessCount in local storage
    localStorage.setItem("accessCount", newAccessCount);
    try {
      const data = await UpdatePermission({
        userKeyID: common.userKeyID,
        roleTypeActionList: roleTypeActionList,
      });

      if (data?.data?.statusCode === 200) {
        localStorage.removeItem("OrganisationLocalList");

        try {
          setLoader(true);
          const response = await GetOrganisationLookupList(common.userKeyID);
          if (response?.data?.statusCode === 200) {
            if (response?.data?.responseData?.data) {
              const OrganisationsListData = response.data.responseData.data;
              localStorage.removeItem("OrganisationLocalList");
              localStorage.setItem(
                "OrganisationLocalList",
                JSON.stringify(OrganisationsListData),
              );
              setOrganisationsList(OrganisationsListData);

              let organisationData;
              if (common.organisationKeyID == null) {
                organisationData = await OrganisationsListData.find((item) => {
                  return null == item.organisationKeyID;
                });
              } else if (common.organisationKeyID == "") {
                organisationData = OrganisationsListData[0];
              } else {
                organisationData = await OrganisationsListData.find((item) => {
                  return (
                    common.organisationKeyID?.toUpperCase() ==
                    item.organisationKeyID?.toUpperCase()
                  );
                });
              }

              localStorage.setItem(
                "userAccess",
                JSON.stringify(organisationData.accessList),
              );
              setActiveOrganization(organisationData.accessList);

              if (organisationData) {
                const personalizeSettings =
                  organisationData.personalizeSetting || [];
                personalizeSettings.forEach((setting) => {
                  switch (setting.settingName) {
                    case "VariableEngagementName":
                      setEngagementName(setting.settingValue);
                      break;
                    case "VariableProposalName":
                      setProposalName(setting.settingValue);
                      break;
                    case "VariableProspectName":
                      setProspectName(setting.settingValue);
                      break;
                    default:
                      // Handle other settings if needed
                      break;
                  }
                });
                setOrgLoaderList(true);
                setLoader(false);
              } else {
                // Reset state variables if no organization is selected
                setOrgLoaderList(true);
                setLoader(false);
                setEngagementName("");
                setProposalName("");
                setProspectName("");
              }
              if (organisationData) {
                setOrgLoaderList(true);
                setLoader(false);
                dispatch(
                  updateState({
                    businessTypeID: organisationData.businessTypeID,
                    organisationKeyID: organisationData.organisationKeyID,
                    professionTypeLists:
                      organisationData.professionTypeLists === null
                        ? []
                        : organisationData.professionTypeLists,
                    enableEL: organisationData.enableEL,
                  }),
                );
              }
            }
          }
        } catch (error) {
          setOrgLoaderList(true);
          setLoader(false);
          console.log(error);
        }

        if (data?.data?.responseData?.data) {
          const AccessData =
            data?.data?.responseData?.data?.roleTypePermissions;
          setPermission(AccessData);
          setOpenSuccessModal(true);
          SetInitialModelData();
        }
      } else {
        setErrorMessage(data?.data?.errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   setModelAction(props.modelRequestData.Action === null ? "" : "Update")
  //   SetPermission();
  // },[props.modelRequestData.Action==="Update"]);

  const handleCloseModal = () => {
    setOpenSuccessModal(false);
  };

  const handleClose = () => {
    dispatch(
      updateState({
        isUpdateRole: true,
      }),
    );
    $("#" + props.id).modal("hide");
    setOpenSuccessModal(false);
  };
  const closeConfirmModel = () => {
    $("#" + "DeleteDriverModel").modal("hide");
  };

  const toggleDropdown = (roleTypeID) => {
    setIsOpens(!isOpens);
    // setOpenRole(openRole === roleTypeID ? null : roleTypeID);
    setOpenRole((prevOpenRole) =>
      prevOpenRole === roleTypeID ? null : roleTypeID,
    );
  };

  const handleCheckboxChange = (
    roleIndex,
    moduleIndex,
    moduleActionIndex,
    e,
  ) => {
    let checked = e.target.checked;
    let data = [...defaultData];

    data[roleIndex].modules[moduleIndex].moduleActions[
      moduleActionIndex
    ].setDefaultAction = checked;

    setCheckBox(data);
  };

  const handleCheckAllModules = (roleIndex, e) => {
    const checked = e.target.checked;
    if (checked === false) {
      setModelRequestData({
        ...modelRequestData,
        Action: "AccessModel",
      });
      setRoleTypeIndex(roleIndex);
      // $("#" + "ConfirmModel").modal("show");
      $("#" + "DeleteDriverModel").modal("show");
    } else {
      const data = [...defaultData];

      data[roleIndex].modules.forEach((module) => {
        module.moduleActions.forEach(
          (action) => (action.setDefaultAction = checked),
        );
      });

      setCheckBox(data);
    }
  };
  const UpdatedStatus = () => {
    const data = [...defaultData];

    data[RoleTypeIndex].modules.forEach((module) => {
      module.moduleActions.forEach(
        (action) => (action.setDefaultAction = false),
      );
    });

    setCheckBox(data);
    $("#" + "DeleteDriverModel").modal("hide");
  };
  const handleCheckAllActionsInModule = (roleIndex, moduleIndex, e) => {
    const checked = e.target.checked;
    const data = [...defaultData];

    data[roleIndex].modules[moduleIndex].moduleActions.forEach(
      (action) => (action.setDefaultAction = checked),
    );

    setCheckBox(data);
  };

  const areAllActionsChecked = (roleIndex, moduleIndex) => {
    const moduleActions =
      defaultData[roleIndex].modules[moduleIndex].moduleActions;
    return moduleActions.every((action) => action.setDefaultAction);
  };

  const areAllModulesChecked = (roleIndex) => {
    const modules = defaultData[roleIndex].modules;
    return modules.every((module) =>
      module.moduleActions.every((action) => action.setDefaultAction),
    );
  };

  //Design part :
  return (
    <div>
      <div
        style={{ display: openSuccessModal && "none" }}
        className={`${props.class} access-role-modal`}
        id={props.id}
        ref={modalRef}
        tabIndex={props.tabIndex}
        aria-labelledby={props.aria_labelledby}
        aria-hidden={props.aria_hidden}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div className="modal-dialog modal-dialog-centered access-role-dialog">
          <div className="modal-content access-role-content">
            {/* =====================================================
                HEADER
                ===================================================== */}
            <div className="modal-header access-role-header">
              <div className="access-role-header-copy">
                <span className="access-role-header-icon">
                  <i className="ri-shield-user-line"></i>
                </span>

                <div>
                  <h5 className="modal-title" id="exampleModalLabel">
                    {modelAction === "Add"
                      ? getCrudPopUpTitleName("Add", moduleName)
                      : getCrudPopUpTitleName("Update", moduleName)}
                  </h5>

                  <p>
                    Configure the default module permissions available for each
                    user role.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="btn-close access-role-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={SetInitialModelData}
                id="close-modal"
              ></button>
            </div>

            {/* =====================================================
                BODY
                ===================================================== */}
            <div className="modal-body access-role-body">
              {!defaultData || defaultData.length === 0 ? (
                <div className="access-role-empty">
                  <span className="access-role-empty-icon">
                    <i className="ri-shield-user-line"></i>
                  </span>

                  <h6>No roles available</h6>
                  <p>
                    Role permissions are not available right now. Please close
                    the modal and try again.
                  </p>
                </div>
              ) : (
                <div className="access-role-list">
                  {defaultData.map((role, roleIndex) => {
                    const isOpen = openRole === role.roleTypeID;
                    const allRolePermissionsChecked =
                      areAllModulesChecked(roleIndex);

                    const selectedPermissionCount =
                      role?.modules?.reduce((roleTotal, module) => {
                        return (
                          roleTotal +
                          (module?.moduleActions?.filter(
                            (action) => action.setDefaultAction,
                          )?.length || 0)
                        );
                      }, 0) || 0;

                    const totalPermissionCount =
                      role?.modules?.reduce((roleTotal, module) => {
                        return roleTotal + (module?.moduleActions?.length || 0);
                      }, 0) || 0;

                    return (
                      <section
                        className={`access-role-item ${
                          isOpen ? "is-open" : ""
                        }`}
                        key={role.roleTypeID}
                      >
                        {/* ROLE HEADER
                            NOTE: React state controls expansion. We intentionally
                            do not use Bootstrap collapse here because the old
                            data-bs-target did not match the rendered panel id. */}
                        <button
                          type="button"
                          className="access-role-toggle"
                          aria-expanded={isOpen}
                          aria-controls={`role-permissions-${role.roleTypeID}`}
                          onClick={() => toggleDropdown(role.roleTypeID)}
                        >
                          <div className="access-role-toggle-left">
                            <span className="access-role-avatar">
                              <i className="ri-shield-star-line"></i>
                            </span>

                            <div className="access-role-toggle-copy">
                              <strong>{role?.roleName}</strong>
                              <span>
                                {selectedPermissionCount} of{" "}
                                {totalPermissionCount} permissions selected
                              </span>
                            </div>
                          </div>

                          <div className="access-role-toggle-right">
                            <span
                              className={`access-role-selection-badge ${
                                allRolePermissionsChecked ? "is-complete" : ""
                              }`}
                            >
                              {allRolePermissionsChecked
                                ? "Full Access"
                                : `${selectedPermissionCount}/${totalPermissionCount}`}
                            </span>

                            <i
                              className={`ri-arrow-down-s-line access-role-chevron ${
                                isOpen ? "is-open" : ""
                              }`}
                            ></i>
                          </div>
                        </button>

                        {isOpen && (
                          <div
                            id={`role-permissions-${role.roleTypeID}`}
                            className="access-role-panel"
                          >
                            {/* SELECT ALL FOR ROLE */}
                            <div className="access-role-select-all">
                              <div>
                                <strong>
                                  {allRolePermissionsChecked
                                    ? "All permissions selected"
                                    : `Select all ${role?.roleName} permissions`}
                                </strong>
                                <span>
                                  Apply or remove access across every module for
                                  this role.
                                </span>
                              </div>

                              <label
                                className="access-role-master-check"
                                htmlFor={`roleIndex${roleIndex}`}
                              >
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`roleIndex${roleIndex}`}
                                  onChange={(e) =>
                                    handleCheckAllModules(roleIndex, e)
                                  }
                                  checked={allRolePermissionsChecked}
                                />

                                <span>
                                  {allRolePermissionsChecked
                                    ? "Unselect All"
                                    : "Select All"}
                                </span>
                              </label>
                            </div>

                            {/* MODULES */}
                            <div className="access-role-modules-grid">
                              {role?.modules?.map((module, moduleIndex) => {
                                const moduleChecked = areAllActionsChecked(
                                  roleIndex,
                                  moduleIndex,
                                );

                                const moduleCheckboxId = `role_${role.roleTypeID}_${module.moduleId}_${moduleIndex}`;

                                return (
                                  <div
                                    className="access-role-module-card"
                                    key={module?.moduleId}
                                  >
                                    <div className="access-role-module-header">
                                      <div className="access-role-module-title">
                                        <span className="access-role-module-icon">
                                          <i className="ri-layout-grid-line"></i>
                                        </span>

                                        <div>
                                          <strong>{module?.moduleName}</strong>
                                          <span>
                                            {module?.moduleActions?.length || 0}{" "}
                                            permissions
                                          </span>
                                        </div>
                                      </div>

                                      <label
                                        className="access-role-module-check"
                                        htmlFor={moduleCheckboxId}
                                        title={
                                          moduleChecked
                                            ? "Unselect module"
                                            : "Select module"
                                        }
                                      >
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          id={moduleCheckboxId}
                                          onChange={(e) =>
                                            handleCheckAllActionsInModule(
                                              roleIndex,
                                              moduleIndex,
                                              e,
                                            )
                                          }
                                          checked={moduleChecked}
                                        />

                                        <span>
                                          {moduleChecked ? "All" : "Select All"}
                                        </span>
                                      </label>
                                    </div>

                                    <div className="access-role-actions-list">
                                      {module?.moduleActions?.map(
                                        (action, moduleActionIndex) => {
                                          const actionId = `checkbox_${role.roleTypeID}_${module.moduleId}_${action?.mActionId}`;

                                          return (
                                            <label
                                              className={`access-role-action-row ${
                                                action?.setDefaultAction
                                                  ? "is-selected"
                                                  : ""
                                              }`}
                                              key={action?.mActionId}
                                              htmlFor={actionId}
                                            >
                                              <input
                                                className="form-check-input"
                                                id={actionId}
                                                type="checkbox"
                                                checked={
                                                  action?.setDefaultAction
                                                }
                                                onChange={(e) =>
                                                  handleCheckboxChange(
                                                    roleIndex,
                                                    moduleIndex,
                                                    moduleActionIndex,
                                                    e,
                                                  )
                                                }
                                              />

                                              <Tooltip
                                                title={
                                                  action?.mActionName ===
                                                  "Can Delete"
                                                    ? "Can Delete / Change Status / Is Default"
                                                    : action?.mActionName
                                                }
                                              >
                                                <span>
                                                  {action?.mActionName ===
                                                  "Can Delete"
                                                    ? "Can Delete / Change Status / Is Default"
                                                    : action?.mActionName}
                                                </span>
                                              </Tooltip>
                                            </label>
                                          );
                                        },
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </section>
                    );
                  })}
                </div>
              )}

              {errorMessage && (
                <div className="access-role-error">
                  <i className="ri-error-warning-line"></i>
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            {/* =====================================================
                FOOTER
                ===================================================== */}
            <div className="modal-footer access-role-footer">
              <button
                type="button"
                className="btn access-role-cancel-btn"
                data-bs-dismiss="modal"
                onClick={() => SetInitialModelData()}
              >
                <span>{getCrudButtonTextName("Cancel")}</span>
              </button>

              <button
                type="submit"
                className="btn access-role-save-btn"
                onClick={() => {
                  SetPermission(mainData);
                }}
              >
                <i className="ri-check-line"></i>

                <span>
                  {modelAction === "Add"
                    ? getCrudButtonTextName("Add", moduleName)
                    : getCrudButtonTextName("Update", moduleName)}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* EXISTING MODALS — FUNCTIONALITY PRESERVED */}
        <ConfirmModel
          openErrorModal={false}
          openSuccessModal={openSuccessModal}
          modelRequestData={modelRequestData}
          UpdatedStatus={UpdatedStatus}
        />

        <DeleteDriverModal
          handleClose={closeConfirmModel}
          modelRequestData={modelRequestData}
          UpdatedStatus={UpdatedStatus}
        />

        <SuccessModal
          handleClose={handleClose}
          setDismissModal={setDismissModal}
          setOpenSuccessModal={setOpenSuccessModal}
          openSuccessModal={openSuccessModal}
          modelAction={modelAction}
          message={"Default Access "}
        />
      </div>
    </div>
  );
}

export default AccessModel;
