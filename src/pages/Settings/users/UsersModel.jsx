/* global $ */
import React, { useContext, useEffect, useState, useRef } from "react";
import "./UsersStyle.css";
import "./UsersModal-redesign.css";
import {
  AddUpdateUser,
  GetUserModel,
} from "../../../redux/Services/Setting/InviteUserApi";
import { UserRole } from "../../../redux/Services/Master/RoleTypeLookupListApi";
import { useSelector } from "react-redux";
import Select from "react-select";
import SuccessModal from "../../../components/SuccessModal";
import { ERROR_MESSAGES } from "../../../components/GlobalMessage";
import { AuthContextProvider } from "../../../AuthContext/AuthContext";
function UsersModel(props) {
  // A] States Declaration :
  const moduleName = "User";
  const modalRef = useRef(null);
  const [modelAction, setModelAction] = useState("");
  const [userRole, setUserRole] = useState([]);
  const [dismissModal, setDismissModal] = useState(null);
  const [role, setRole] = useState([]);
  const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
  const [userObj, setUserObj] = useState({
    userKeyID: null,
    firstName: undefined,
    lastName: undefined,
    email: undefined,
    roleTypeID: null,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [RequireErrorMessage, setRequireErrorMessage] = useState(false);
  const common = useSelector((state) => state.Storage); //Getting Logged Users Details From Persist Storage of redux hooks
  const {
    setLoader,
    setTopbar,
    prospectName,
    proposalName,
    EngagementName,
    getCrudButtonTextName,
    getCrudPopUpTitleName,
  } = useContext(AuthContextProvider);

  // B] Initial useEffect : Will call when Add/Update button click from list page
  useEffect(() => {
    setModelAction(props.modelRequestData.Action === null ? "Add" : "Update"); //Do not change this naming convention

    if (
      props.modelRequestData.Action !== undefined &&
      props.modelRequestData.Action !== null
    ) {
      GetUserModelData(props.modelRequestData.inviteUserKeyID);
    } else {
      SetInitialModelData();
    }
    GetRoleTypeLookupListData();
  }, [props.modelRequestData]);

  // C] This function will clear all data from popup model
  const SetInitialModelData = () => {
    setUserObj({
      ...userObj,
      userKeyID: null,
      firstName: "",
      lastName: "",
      email: "",
      roleTypeID: "",
    });
    setRole([]);
    setErrorMessage("");
    setRequireErrorMessage(false);
  };

  // D] Calling All Api's like Lookup List and other Here :
  // 1) Role Type Lookup List Api
  const GetRoleTypeLookupListData = async () => {
    try {
      let callingFrom = "Admin";
      if (
        common.roleTypeId === 1 &&
        (common.organisationKeyID === null || common.organisationKeyID === "")
      ) {
        callingFrom = "SuperAdmin";
      }
      const data = await UserRole(callingFrom);
      let UserRoleData = data.data.responseData.data;
      if (callingFrom === "Admin") {
        UserRoleData = UserRoleData.filter((role) => role.roleTypeId !== 1);
        setUserRole(UserRoleData);
      } else if (callingFrom === "SuperAdmin") {
        setUserRole(UserRoleData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const UserRoleTypeLookupList = userRole.map((userRoleType) => ({
    value: userRoleType.roleTypeId,
    label: userRoleType.roleName,
  }));

  // E] Event Handling Functions will call here.
  // 1) On Change Select Role Type
  const HandleSelectChange = (userRoleType) => {
    setRole(userRoleType);
    setUserObj({
      ...userObj,
      roleTypeID: userRoleType.value,
    });
  };

  // F] Calling CRUD Api here
  // 1) Get Model Data Api
  const GetUserModelData = async (id) => {
    if (!id) {
      return;
    }
    try {
      const data = await GetUserModel(id);
      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          const ModelData = data?.data?.responseData?.data;
          setUserObj({
            ...userObj,
            userKeyID: common.userKeyID,
            firstName: ModelData.firstName,
            lastName: ModelData.lastName,
            email: ModelData.email,
            organisationKeyID: common.organisationKeyID,
            roleTypeID: ModelData.roleTypeID,
          });

          const UserRoleTypeLookupListFilter = userRole.filter(
            (userRoleType) => userRoleType.roleTypeId === ModelData.roleTypeID,
          );
          const UserRoleTypeLookupList = UserRoleTypeLookupListFilter?.map(
            (userRoleType) => ({
              value: userRoleType.roleTypeId,
              label: userRoleType.roleName,
            }),
          );

          setRole(UserRoleTypeLookupList);
        }
      } else {
        setErrorMessage(data?.data?.errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 2) Add Update Button Click Function
  const UserAddUpdateBtnClicked = () => {
    //Check Validations will be done here
    if (
      typeof userObj.firstName === undefined ||
      userObj.firstName.trim() === ""
    ) {
      setRequireErrorMessage(true);
      return false; // Return false or handle your error logic here if needed.
    } else if (
      typeof userObj.lastName === undefined ||
      userObj.lastName.trim() === ""
    ) {
      setRequireErrorMessage(true);
      return false;
    } else if (
      typeof userObj.email === undefined ||
      userObj.email.trim() === ""
    ) {
      setRequireErrorMessage(true);
      return false;
    } else if (!validateEmail(userObj.email)) {
      setRequireErrorMessage(true);
      // setErrorMessage("Please enter a valid email address.");
      return false;
    } else if (
      userObj.roleTypeID === undefined ||
      userObj.roleTypeID === null ||
      userObj.roleTypeID === ""
    ) {
      setRequireErrorMessage(true);
      return false;
    } else {
      setRequireErrorMessage(""); // Clear the error message if there are no errors.
    }
    // Preparing Object For Add Update and if any modification then it will done here
    const ApiRequest_ParamsObj = {
      //global level params : fixed
      Action: props.modelRequestData.Action,
      organisationKeyID:
        props.modelRequestData.organisationKeyID === undefined ||
        props.modelRequestData.organisationKeyID === null ||
        props.modelRequestData.organisationKeyID === ""
          ? common.organisationKeyID
          : props.modelRequestData.organisationKeyID,
      userKeyID: common.userKeyID,
      //form level params : fixed
      InviteUserKeyID:
        props.modelRequestData.Action === null
          ? null
          : props.modelRequestData.inviteUserKeyID,
      //form level params : will change according to module
      firstName: userObj.firstName,
      lastName: userObj.lastName === "" ? null : userObj.lastName,
      email: userObj.email === "" ? null : userObj.email,
      roleTypeID: userObj.roleTypeID,
    };

    AddUpdateUserData(ApiRequest_ParamsObj);
  };

  // Add or Update User Data
  const AddUpdateUserData = async (apiRequestParams) => {
    setLoader(true);
    try {
      let url = "/AddUpdateInviteUsers"; // Default URL for Adding Data
      if (apiRequestParams.Action === "Update") {
        url = `/AddUpdateInviteUsers?Action=${apiRequestParams.Action}`; // URL for Updating Data
      }
      const response = await AddUpdateUser(url, apiRequestParams);
      if (response) {
        setLoader(false);
        if (response?.data?.statusCode === 200) {
          if (apiRequestParams.Action !== "Update") {
            // $("#" + props.id).modal("hide");
            setOpenSuccessModal(true);
            props.setIsAddUpdateActionDone(true);
          } else {
            // $("#" + props.id).modal("hide");
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

  //email validation function
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+[^.]$/;
    return re.test(email);
  };

  const HandleClose = () => {
    $("#" + props.id).modal("hide");
    setOpenSuccessModal(false);
  };

  //Design part :
  return (
    <div className="users-modal-redesign">
      <div
        style={{ display: openSuccessModal && "none" }}
        className={props.class}
        id={props.id}
        ref={modalRef}
        tabIndex={props.tabIndex}
        aria-labelledby={props.aria_labelledby}
        aria-hidden={props.aria_hidden}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div className="modal-dialog modal-md modal-dialog-centered users-modal-dialog">
          <div className="modal-content users-modal-content">
            {/* =========================
                HEADER
                ========================= */}
            <div className="modal-header users-modal-header">
              <div className="users-modal-heading">
                <span className="users-modal-heading-icon">
                  <i
                    className={
                      modelAction === "Add"
                        ? "ri-user-add-line"
                        : "ri-user-settings-line"
                    }
                  ></i>
                </span>

                <div className="users-modal-heading-copy">
                  <h5 className="modal-title" id="exampleModalLabel">
                    {modelAction === "Add"
                      ? getCrudPopUpTitleName("Invite", moduleName)
                      : getCrudPopUpTitleName("Update", moduleName)}
                  </h5>

                  <p>
                    {modelAction === "Add"
                      ? "Invite a user and assign the appropriate access role."
                      : "Review the user account and update the assigned role."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="btn-close users-modal-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={SetInitialModelData}
                id="close-modal"
              ></button>
            </div>

            {/* =========================
                BODY
                ========================= */}
            <div className="modal-body users-modal-body">
              <div className="users-modal-form">
                {props.modelRequestData.Action === null && (
                  <div className="users-modal-field-grid">
                    <div className="users-modal-field">
                      <label
                        htmlFor="UserFirstNameField"
                        className="users-modal-label"
                      >
                        First Name
                        <span className="users-modal-required">*</span>
                      </label>

                      <div className="users-modal-input-wrap">
                        <i className="ri-user-line users-modal-input-icon"></i>

                        <input
                          type="text"
                          id="UserFirstNameField"
                          className="input-text users-modal-input users-modal-input--with-icon"
                          placeholder="Enter first name"
                          value={userObj.firstName}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            const trimmedValue = inputValue.replace(
                              /^\s+/g,
                              "",
                            );
                            // Check if the trimmed value contains any spaces
                            if (
                              trimmedValue.includes(" ") ||
                              /^\d/.test(trimmedValue)
                            ) {
                              return; // Don't update state if there are spaces
                            }

                            // Ensure the first character is capitalized
                            const capitalizedValue =
                              trimmedValue.charAt(0).toUpperCase() +
                              trimmedValue.slice(1);

                            setUserObj({
                              ...userObj,
                              firstName: capitalizedValue,
                            });
                          }}
                          maxLength={30}
                        />
                      </div>

                      <div className="users-modal-field-meta">
                        <span>{userObj.firstName?.length || 0}/30</span>
                      </div>

                      {RequireErrorMessage && userObj.firstName === "" ? (
                        <label className="validation users-modal-validation">
                          {ERROR_MESSAGES}
                        </label>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="users-modal-field">
                      <label
                        htmlFor="UserLastNameField"
                        className="users-modal-label"
                      >
                        Last Name
                        <span className="users-modal-required">*</span>
                      </label>

                      <div className="users-modal-input-wrap">
                        <i className="ri-user-line users-modal-input-icon"></i>

                        <input
                          type="text"
                          id="UserLastNameField"
                          className="input-text users-modal-input users-modal-input--with-icon"
                          placeholder="Enter last name"
                          value={userObj.lastName}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            const trimmedValue = inputValue.replace(
                              /^\s+/g,
                              "",
                            );
                            if (
                              trimmedValue.includes(" ") ||
                              /^\d/.test(trimmedValue)
                            ) {
                              return;
                            }
                            const capitalizedValue =
                              trimmedValue.charAt(0).toUpperCase() +
                              trimmedValue.slice(1);
                            setUserObj({
                              ...userObj,
                              lastName: capitalizedValue,
                            });
                          }}
                          maxLength={30}
                        />
                      </div>

                      <div className="users-modal-field-meta">
                        <span>{userObj.lastName?.length || 0}/30</span>
                      </div>

                      {RequireErrorMessage && userObj.lastName === "" ? (
                        <label className="validation users-modal-validation">
                          {ERROR_MESSAGES}
                        </label>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                )}

                <div className="users-modal-field-grid">
                  <div className="users-modal-field">
                    <label
                      htmlFor="UserEmailField"
                      className="users-modal-label"
                    >
                      Email
                      <span className="users-modal-required">*</span>
                    </label>

                    <div className="users-modal-input-wrap">
                      <i className="ri-mail-line users-modal-input-icon"></i>

                      <input
                        type="email"
                        disabled={
                          props.modelRequestData.Action === null ? false : true
                        }
                        id="UserEmailField"
                        className="input-text users-modal-input users-modal-input--with-icon"
                        placeholder="Enter email address"
                        value={userObj.email}
                        onChange={(e) => {
                          setErrorMessage("");
                          // Convert the entered text to lowercase
                          const enteredValue = e.target.value.toLowerCase();

                          // Check for consecutive dots
                          if (enteredValue.includes("..")) {
                            // If consecutive dots found, do not update the state
                            return;
                          }

                          // Update the state with the entered value
                          setUserObj({ ...userObj, email: enteredValue });
                        }}
                        maxLength={50}
                      />
                    </div>

                    {props.modelRequestData.Action !== null && (
                      <div className="users-modal-field-help">
                        Email cannot be changed while updating this user.
                      </div>
                    )}

                    {RequireErrorMessage && userObj.email === "" ? (
                      <label className="validation users-modal-validation">
                        {ERROR_MESSAGES}
                      </label>
                    ) : !validateEmail(userObj.email) &&
                      userObj.email !== "" ? (
                      <label className="validation users-modal-validation">
                        Please enter a valid email address.
                      </label>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="users-modal-field">
                    <label
                      htmlFor="UserUserRoleField"
                      className="users-modal-label"
                    >
                      User Role
                      <span className="users-modal-required">*</span>
                    </label>

                    <Select
                      className="user-role-select users-modal-select"
                      classNamePrefix="users-role-select"
                      value={role}
                      onChange={HandleSelectChange}
                      options={UserRoleTypeLookupList}
                      placeholder="Select user role"
                    />

                    {RequireErrorMessage &&
                    (userObj.roleTypeID === undefined ||
                      userObj.roleTypeID === null ||
                      userObj.roleTypeID === "") ? (
                      <label className="validation users-modal-validation">
                        {ERROR_MESSAGES}
                      </label>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                {errorMessage && (
                  <div className="users-modal-api-error">
                    <i className="ri-error-warning-line"></i>

                    <span>
                      {errorMessage === "You cannot invite yourself"
                        ? "Oops! it looks like you're trying to invite yourself. Invite someone else."
                        : errorMessage}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* =========================
                FOOTER
                ========================= */}
            <div className="modal-footer users-modal-footer">
              <div className="users-modal-actions">
                <button
                  type="button"
                  className="btn btn-md btn-light users-modal-cancel-btn"
                  data-bs-dismiss="modal"
                  onClick={() => SetInitialModelData()}
                >
                  <span>{getCrudButtonTextName("Cancel")}</span>
                </button>

                <button
                  type="submit"
                  className="btn btn-md btn-success create-item-btn users-modal-submit-btn"
                  onClick={() => {
                    UserAddUpdateBtnClicked();
                  }}
                >
                  <i
                    className={
                      modelAction === "Add"
                        ? "ri-send-plane-line"
                        : "ri-check-line"
                    }
                  ></i>

                  <span>
                    {modelAction === "Add"
                      ? getCrudButtonTextName("Invite", moduleName)
                      : getCrudButtonTextName("Update", moduleName)}
                  </span>
                </button>
              </div>
            </div>

            <SuccessModal
              handleClose={HandleClose}
              setDismissModal={setDismissModal}
              setOpenSuccessModal={setOpenSuccessModal}
              openSuccessModal={openSuccessModal}
              modelAction={"ShowMessage"}
              message={
                modelAction === "Add"
                  ? `An invitation has been sent to ${userObj.firstName} ${userObj.lastName} on email id ${userObj.email}!`
                  : `User ${userObj.firstName} ${userObj.lastName} has been updated successfully!`
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersModel;
