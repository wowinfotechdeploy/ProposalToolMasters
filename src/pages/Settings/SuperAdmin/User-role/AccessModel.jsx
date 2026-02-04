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
        class={props.class}
        id={props.id}
        ref={modalRef}
        tabIndex={props.tabIndex}
        aria-labelledby={props.aria_labelledby}
        aria-hidden={props.aria_hidden}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div class="modal-dialog modal-md modal-dialog-centered">
          <div class="modal-content">
            {/*Heading Start */}
            <div class="modal-header bg-light p-3">
              <h5 class="modal-title" id="exampleModalLabel">
                {modelAction === "Add"
                  ? getCrudPopUpTitleName("Add", moduleName)
                  : getCrudPopUpTitleName("Update", moduleName)}
              </h5>
              {/* Close Button Start */}
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={SetInitialModelData}
                id="close-modal"
              >
                {/* Close Button End */}
              </button>
            </div>
            {/*Heading End */}
            {/*Modal body Start */}
            <div
              class="modal-body"
              style={{ height: "70vh", overflow: "auto" }}
            >
              <>
                <div
                  class="accordion accordion-flush accessModel"
                  id="accordionFlushExample"
                >
                  <div class="accordion-item ">
                    {defaultData?.map((role, roleIndex) => (
                      <div key={role.roleTypeID}>
                        <h2 class="accordion-header" id={role.roleTypeID}>
                          <button
                            class="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#flush-collapse-${role.roleTypeID}`}
                            aria-expanded={openRole === role.roleTypeID}
                            aria-controls={`flush-collapse-${role.roleTypeID}`}
                            onClick={() => toggleDropdown(role?.roleTypeID)}
                          >
                            <i
                              className={`fas ${
                                openRole === role.roleTypeID
                                  ? "fa-chevron-up"
                                  : "fa-chevron-down"
                              }`}
                              style={{
                                position: "absolute",
                                top: "50%",
                                right: "15px",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                pointerEvents: "none",
                                zIndex: "1000",
                                backgroundColor: "white",
                                color: "#1b1c25",
                                ...(isOpens ? { fontWeight: "bold" } : {}),
                              }}
                            ></i>
                            {role?.roleName}
                          </button>
                        </h2>

                        {openRole === role?.roleTypeID && (
                          <div
                            id="collapseOne"
                            class="accordion-collapse collapse show"
                            aria-labelledby="headingOne"
                            data-bs-parent="#default-accordion-example"
                          >
                            <div class="accordion-body">
                              <div class="row">
                                {/* check module start  */}
                                <div class="form-check form-check-outline form-check-dark mt-2">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    id={`roleIndex${roleIndex}`}
                                    onChange={(e) =>
                                      handleCheckAllModules(roleIndex, e)
                                    }
                                    checked={areAllModulesChecked(roleIndex)}
                                  />
                                  <label
                                    htmlFor={`roleIndex${roleIndex}`}
                                    class="form-check-label"
                                  >
                                    {areAllModulesChecked(roleIndex) ? (
                                      <span>
                                        Unselect all{" "}
                                        <b style={{ fontSize: "12px" }}>
                                          {" "}
                                          {role?.roleName}{" "}
                                        </b>{" "}
                                        Modules
                                      </span>
                                    ) : (
                                      <span>
                                        Select all{" "}
                                        <b style={{ fontSize: "12px" }}>
                                          {" "}
                                          {role?.roleName}{" "}
                                        </b>{" "}
                                        Modules{" "}
                                      </span>
                                    )}
                                  </label>
                                </div>

                                {role?.modules.map((module, moduleIndex) => (
                                  <div class="col-md-6">
                                    {/* M action end  */}
                                    <div key={module?.moduleId}>
                                      <h4
                                        style={{
                                          marginBottom: "20px  !important",
                                          color: "#00afef ",
                                          fontSize: "14px",
                                        }}
                                        class="card-title mb-0 flex-grow-1"
                                      >
                                        <input
                                          class="form-check-input"
                                          type="checkbox"
                                          id={`role${moduleIndex}`}
                                          onChange={(e) =>
                                            handleCheckAllActionsInModule(
                                              roleIndex,
                                              moduleIndex,
                                              e,
                                            )
                                          }
                                          checked={areAllActionsChecked(
                                            roleIndex,
                                            moduleIndex,
                                          )}
                                        />
                                        <label
                                          style={{ marginLeft: "8px" }}
                                          htmlFor={`role${moduleIndex}`}
                                        >
                                          {" "}
                                          {module?.moduleName}
                                        </label>
                                      </h4>

                                      <div class="row">
                                        <div class="col-md-7">
                                          <div class="row">
                                            <div class="mb-3">
                                              {module?.moduleActions.map(
                                                (action, moduleActionIndex) => (
                                                  <div
                                                    class="form-check form-check-outline form-check-dark mt-2"
                                                    key={action?.mActionId}
                                                  >
                                                    <input
                                                      class="form-check-input"
                                                      id={`checkbox_${action?.mActionId}`} // Make sure each ID is unique
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
                                                    <label
                                                      class="form-check-label new_checkbox text-nowrap"
                                                      htmlFor={`checkbox_${action?.mActionId}`} // Associate label with checkbox
                                                    >
                                                      <Tooltip title="Can Delete/Change Status/Is Default">
                                                        {action?.mActionName ===
                                                        "Can Delete"
                                                          ? "Can Delete / Change Status / Is Default".substring(
                                                              0,
                                                              26,
                                                            ) + "..."
                                                          : action?.mActionName}
                                                      </Tooltip>
                                                    </label>
                                                  </div>
                                                ),
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            </div>
            {/*Modal body End */}
            {/*Footer body button Start */}
            <div class="modal-footer">
              <div class="hstack gap-2 justify-content-end">
                <button
                  type="button"
                  class="btn btn-md btn-light"
                  data-bs-dismiss="modal"
                  onClick={() => SetInitialModelData()}
                >
                  <span>{getCrudButtonTextName("Cancel")}</span>
                </button>
                <button
                  type="submit"
                  class="btn btn-md btn-success create-item-btn"
                  onClick={() => {
                    SetPermission(mainData);
                  }}
                >
                  <span>
                    {modelAction === "Add"
                      ? getCrudButtonTextName("Add", moduleName)
                      : getCrudButtonTextName("Update", moduleName)}
                  </span>
                </button>
              </div>
            </div>
            {/*Footer body button End */}
          </div>
        </div>
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
