/* global $ */
import React, { useEffect, useState, useRef, useContext } from "react";

import { useSelector } from "react-redux";
import {
  AddUpdateUserRole,
  GetRoleTypeModel,
} from "../../../../redux/Services/Config/UserRoleApi";
import { ERROR_MESSAGES } from "../../../../components/GlobalMessage";
import SuccessModal from "../../../../components/SuccessModal";
import { AuthContextProvider } from "../../../../AuthContext/AuthContext";
import "./UserRoleModel-redesign.css";

function UserRoleModel(props) {
  // A] States Declaration :
  const moduleName = "User Role";
  const modalRef = useRef(null);
  const [modelAction, setModelAction] = useState("");
  const [userRoleObj, setUserRoleObj] = useState({
    roleTypeID: null,
    keyID: null,
    roleName: undefined,
    createdByID: null,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [requireErrorMessage, setRequireErrorMessage] = useState(false);
  const [dismissModal, setDismissModal] = useState(null);
  const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
  const { setLoader, getCrudButtonTextName, getCrudPopUpTitleName } =
    useContext(AuthContextProvider);
  const common = useSelector((state) => state.Storage); //Getting Logged Users Details From Persist Storage of redux hooks

  // B] Initial useEffect : Will call when Add/Update button click from list page
  useEffect(() => {
    setModelAction(props.modelRequestData.Action === null ? "Add" : "Update"); //Do not change this naming convention

    if (
      props.modelRequestData.Action !== undefined &&
      props.modelRequestData.Action !== null
    ) {
      GetUserRoleModelData(props.modelRequestData.roleTypeID);
    } else {
      SetInitialModelData();
    }
  }, [props.modelRequestData]);

  // C] This function will clear all data from popup model
  const SetInitialModelData = () => {
    setUserRoleObj({
      ...userRoleObj,

      roleTypeID: null,
      keyID: null,
      roleName: "",
      createdByID: "",
    });
    setErrorMessage("");
    setRequireErrorMessage(false);
  };

  // F] Calling CRUD Api here
  // 1) Get Model Data Api
  const GetUserRoleModelData = async (id) => {
    if (!id) {
      return;
    }
    //..............User Role Edit Data Api...................
    try {
      const data = await GetRoleTypeModel(id);
      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          const ModelData = data?.data?.responseData?.data;
          setUserRoleObj({
            ...userRoleObj,
            roleTypeID: ModelData.roleTypeID,
            keyID: ModelData.keyID,
            roleName: ModelData.roleName,
            createdByID: ModelData.createdByID,
          });
        }
      } else {
        setErrorMessage(data?.data?.errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // 2) Add Update Button Click Function
  const UserRoleAddUpdateBtnClicked = () => {
    //Check Validations will be done here
    if (
      typeof userRoleObj?.roleName === undefined ||
      userRoleObj?.roleName?.trim() === ""
    ) {
      setRequireErrorMessage(true);
      return false; // Return false or handle your error logic here if needed.
    } else {
      setRequireErrorMessage(""); // Clear the error message if there are no errors.
    }

    // Preparing Object For Add Update and if any modification then it will done here
    const ApiRequest_ParamsObj = {
      //global level params : fixed
      Action: props.modelRequestData.Action,
      userKeyID: common.userKeyID,
      organisationID: common.organisationID,
      organisationKeyID: common.organisationKeyID,
      //form level params : fixed
      roleTypeID: userRoleObj.roleTypeID, //will change module wise

      //form level params : will change according to module
      roleName: userRoleObj.roleName,
    };

    AddUpdateUserRoleData(ApiRequest_ParamsObj);
  };

  // Add or Update User Role Data
  const AddUpdateUserRoleData = async (apiRequestParams) => {
    setLoader(true);
    try {
      let url = "/AddUpdateRoleType"; // Default URL for Adding Data
      if (apiRequestParams.Action !== null) {
        url = `/AddUpdateRoleType?Action=${props.modelRequestData.Action}`; // URL for Updating Data
      }
      const response = await AddUpdateUserRole(url, apiRequestParams);
      if (response) {
        setLoader(false);
        if (response?.data?.statusCode === 200) {
          if (apiRequestParams.Action === null) {
            // $('#' + props.id).modal('hide')
            setOpenSuccessModal(true);
            props.setIsAddUpdateActionDone(true);
          } else {
            // $('#' + props.id).modal('hide')
            setOpenSuccessModal(true);
            props.setIsAddUpdateActionDone(true);
          }
        } else {
          setErrorMessage(response?.response?.data?.errorMessage);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    setOpenSuccessModal(false);
  };

  const handleClose = () => {
    $("#" + props.id).modal("hide");
    setOpenSuccessModal(false);
  };

  //Design part :
  return (
    <div>
      <div
        style={{ display: openSuccessModal && "none" }}
        className={`${props.class} user-role-modal-redesign`}
        id={props.id}
        ref={modalRef}
        tabIndex={props.tabIndex}
        aria-labelledby={props.aria_labelledby}
        aria-hidden={props.aria_hidden}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div className="modal-dialog modal-dialog-centered user-role-modal-dialog">
          <div className="modal-content user-role-modal-content">
            {/* HEADER */}
            <div className="modal-header user-role-modal-header">
              <div className="user-role-modal-header-copy">
                <span className="user-role-modal-header-icon">
                  <i className="ri-shield-user-line"></i>
                </span>

                <div>
                  <h5 className="modal-title" id="exampleModalLabel">
                    {modelAction === "Add"
                      ? getCrudPopUpTitleName("Add", moduleName)
                      : getCrudPopUpTitleName("Update", moduleName)}
                  </h5>

                  <p>
                    {modelAction === "Add"
                      ? "Create a new role for managing user access."
                      : "Update the selected user role name."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="btn-close user-role-modal-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={SetInitialModelData}
                id="close-modal"
              ></button>
            </div>

            {/* BODY */}
            <div className="modal-body user-role-modal-body">
              <div className="user-role-form-card">
                <div className="user-role-field">
                  <label htmlFor="user-role-name">
                    User Role Name
                    <span className="text-danger">*</span>
                  </label>

                  <div className="user-role-input-wrap">
                    <span className="user-role-input-icon">
                      <i className="ri-user-settings-line"></i>
                    </span>

                    <input
                      id="user-role-name"
                      type="text"
                      className="input-text user-role-input"
                      placeholder="Enter user role name"
                      value={userRoleObj.roleName}
                      onChange={(e) => {
                        setErrorMessage("");
                        const inputValue = e.target.value;
                        const trimmedValue = inputValue.replace(/\s{2,}/g, " ");
                        if (
                          /\d/.test(trimmedValue) ||
                          /^\s/.test(trimmedValue)
                        ) {
                          return;
                        }
                        const capitalizedValue =
                          trimmedValue.charAt(0).toUpperCase() +
                          trimmedValue.slice(1);
                        setUserRoleObj({
                          ...userRoleObj,
                          roleName: capitalizedValue,
                        });
                      }}
                      maxLength={20}
                    />
                  </div>

                  <div className="user-role-field-meta">
                    <span>Maximum 20 characters</span>
                    <span>{userRoleObj.roleName?.length || 0}/20</span>
                  </div>

                  {requireErrorMessage && userRoleObj.roleName === "" ? (
                    <label className="validation user-role-validation">
                      {ERROR_MESSAGES}
                    </label>
                  ) : (
                    ""
                  )}
                </div>

                {errorMessage && (
                  <div className="user-role-api-error">
                    <i className="ri-error-warning-line"></i>

                    <span>
                      {common.professionTypeLists?.length <= 1 &&
                      errorMessage?.includes(
                        `Please don't choose this profession type`,
                      )
                        ? errorMessage.split(".")[0]
                        : errorMessage}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* FOOTER */}
            <div className="modal-footer user-role-modal-footer">
              <button
                type="button"
                className="btn user-role-cancel-btn"
                data-bs-dismiss="modal"
                onClick={() => SetInitialModelData()}
              >
                <span>{getCrudButtonTextName("Cancel")}</span>
              </button>

              <button
                type="submit"
                className="btn user-role-submit-btn"
                onClick={() => {
                  UserRoleAddUpdateBtnClicked();
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

        <SuccessModal
          handleClose={handleClose}
          setDismissModal={setDismissModal}
          setOpenSuccessModal={setOpenSuccessModal}
          openSuccessModal={openSuccessModal}
          modelAction={modelAction}
          message={`${moduleName} ${userRoleObj.roleName}`}
        />
      </div>
    </div>
  );
}

export default UserRoleModel;
