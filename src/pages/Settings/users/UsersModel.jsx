/* global $ */
import React, { useContext, useEffect, useState, useRef } from "react";
import "./UsersStyle.css";
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
            (userRoleType) => userRoleType.roleTypeId === ModelData.roleTypeID
          );
          const UserRoleTypeLookupList = UserRoleTypeLookupListFilter?.map(
            (userRoleType) => ({
              value: userRoleType.roleTypeId,
              label: userRoleType.roleName,
            })
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
                  ? getCrudPopUpTitleName("Invite", moduleName)
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

            <div class="modal-body">
              <div class="p-3">
                {props.modelRequestData.Action === null && (
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label
                        htmlFor="UserFirstNameField"
                        class="fieldset-label required"
                      >
                        First Name<span className="text-danger">*</span>
                      </label>
                      <input
                        style={{ padding: "5px" }}
                        type="text"
                        id="UserFirstNameField"
                        className="input-text"
                        placeholder="First Name"
                        value={userObj.firstName}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          const trimmedValue = inputValue.replace(/^\s+/g, "");
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
                      {RequireErrorMessage && userObj.firstName === "" ? (
                        <label className="validation">{ERROR_MESSAGES}</label>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label
                        htmlFor="UserLastNameField"
                        class="fieldset-label required"
                      >
                        Last Name<span className="text-danger">*</span>
                      </label>
                      <input
                        style={{ padding: "5px" }}
                        type="text"
                        id="UserLastNameField"
                        class="input-text"
                        placeholder="Last Name"
                        value={userObj.lastName}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          const trimmedValue = inputValue.replace(/^\s+/g, "");
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
                      {RequireErrorMessage && userObj.lastName === "" ? (
                        <label className="validation">{ERROR_MESSAGES}</label>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                )}

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label
                      htmlFor="UserEmailField"
                      class="fieldset-label required"
                    >
                      Email<span className="text-danger">*</span>
                    </label>
                    <input
                      style={{ padding: "5px" }}
                      type="email"
                      disabled={
                        props.modelRequestData.Action === null ? false : true
                      }
                      id="UserEmailField"
                      className="input-text"
                      placeholder="Email"
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
                    {RequireErrorMessage && userObj.email === "" ? (
                      <label className="validation">{ERROR_MESSAGES}</label>
                    ) : !validateEmail(userObj.email) &&
                      userObj.email !== "" ? (
                      <label className="validation">
                        Please enter a valid email address.
                      </label>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label
                      htmlFor="UserUserRoleField"
                      class="fieldset-label required"
                    >
                      User Role<span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <Select
                        className="user-role-select"
                        // id="customerName-field"
                        value={role}
                        onChange={HandleSelectChange}
                        options={UserRoleTypeLookupList}
                        placeholder="Select..."
                      // className="form-select placeholderStyle h-40"
                      />
                    </div>
                    <div>
                      {RequireErrorMessage &&
                        (userObj.roleTypeID === undefined ||
                          userObj.roleTypeID === null ||
                          userObj.roleTypeID === "") ? (
                        <label className="validation">{ERROR_MESSAGES}</label>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>

                <label
                  style={{ display: "flex", justifyContent: "center" }}
                  className="validation"
                >
                  {errorMessage === "You cannot invite yourself"
                    ? "Oops! it looks like you're trying to invite yourself. Invite someone else."
                    : errorMessage}
                </label>
              </div>
            </div>

            <div class="modal-footer">
              <div class="hstack gap-2 justify-content-end">
                <button
                  type="button"
                  class="btn btn-md btn-light"
                  data-bs-dismiss="modal"
                  onClick={() => SetInitialModelData()}
                >
                  <span> {getCrudButtonTextName("Cancel")}</span>
                </button>
                <button
                  type="submit"
                  class="btn btn-md btn-success create-item-btn"
                  onClick={() => {
                    UserAddUpdateBtnClicked();
                  }}
                >
                  <span>
                    {" "}
                    {modelAction === "Add"
                      ? getCrudButtonTextName("Invite", moduleName)
                      : getCrudButtonTextName("Update", moduleName)}
                  </span>
                </button>
              </div>
            </div>
            {/*Footer body button End */}

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
