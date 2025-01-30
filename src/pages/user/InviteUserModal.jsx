/* global $ */
import React, { useContext, useEffect, useState, useRef } from "react";
import DropDown from "../../components/DropDown";
import "./UsersStyle.css";
import {
  AddUpdateUser,
  GetUserModel,
} from "../../redux/Services/Setting/InviteUserApi";
import { UserRole } from "../../redux/Services/Master/RoleTypeLookupListApi";
import { useSelector } from "react-redux";
import { AuthContextProvider } from "../../AuthContext/AuthContext";
import SuccessModal from "../../components/SuccessModal";
function UsersModel(props) {
  // A] States Declaration :
  const moduleName = "User";
  const modalRef = useRef(null);
  const [modelAction, setModelAction] = useState("");
  const [userRole, setUserRole] = useState([]);
  const [role, setRole] = useState([]);
  const [userObj, setUserObj] = useState({
    userKeyID: null,
    firstName: undefined,
    lastName: undefined,
    email: undefined,
    createdByID: null,
    roleTypeID: null,
    roleName: null,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [RequireErrorMessage, setRequireErrorMessage] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const common = useSelector((state) => state.Storage); //Getting Logged Users Details From Persist Storage of redux hooks
  const { setLoader, getCrudButtonTextName, getCrudPopUpTitleName } =
    useContext(AuthContextProvider);

  // B] Initial useEffect : Will call when Add/Update button click from list page
  useEffect(() => {
    setModelAction(props.modelRequestData.Action === null ? "Add" : "Update"); //Do not change this naming convention
    GetRoleTypeLookupListData();
    if (
      props.modelRequestData.Action !== undefined &&
      props.modelRequestData.Action !== null
    ) {
      GetUserModelData(props.modelRequestData.inviteUserKeyID);
    } else {
      SetInitialModelData();
    }
  }, [props.modelRequestData]);

  // C] This function will clear all data from popup model
  const SetInitialModelData = () => {
    setUserObj({
      ...userObj,
      userKeyID: null,
      firstName: "",
      lastName: "",
      email: "",
      createdByID: "",
      roleTypeID: "",
    });

    setErrorMessage("");
    setRequireErrorMessage(false);
  };

  // D] Calling All Api's like Lookup List and other Here :
  // 1) Role Type Lookup List Api
  const GetRoleTypeLookupListData = async () => {
    try {
      const data = await UserRole();
      const UserRoleData = data.data.responseData.data;

      setUserRole(UserRoleData);
    } catch (error) {
      console.log(error);
    }
  };

  const options = userRole.map((uType) => ({
    value: uType.roleTypeId,
    label: uType.roleName,
  }));

  // E] Event Handling Functions will call here.
  // 1) On Change Select Role Type
  const handleSelectChange = (uType) => {
    setRole(uType);
    setUserObj({
      ...userObj,
      roleTypeID: uType.value,
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
            roleName: ModelData.ModelData,
            roleTypeID: ModelData.roleTypeID,
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
  const UserAddUpdateBtnClicked = () => {
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
      setErrorMessage("Please enter a valid email address.");
      return false;
    } else if (typeof userObj.roleTypeID === undefined) {
      setRequireErrorMessage(true);
      return false;
    } else {
      setRequireErrorMessage(""); // Clear the error message if there are no errors.
    }

    // Preparing Object For Add Update and if any modification then it will done here
    const ApiRequest_ParamsObj = {
      //global level params : fixed
      Action: props.modelRequestData.Action,
      organisationKeyID: common.organisationKeyID,

      //form level params : fixed
      userKeyID: common.userKeyID,
      InviteUserKeyID: props.modelRequestData.inviteUserKeyID,
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
          // $('#' + props.id).modal('hide')
          if (apiRequestParams.Action !== "Update") {
            // toast.success("Added Successfully.");
            setOpenSuccessModal(true);
            props.setIsAddUpdateActionDone(true);
          } else {
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
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const HandleClose = () => {
    // $("#" + "addUpdateModal").modal("hide");
    setOpenSuccessModal(false);
  };

  //Design part :
  return (
    <div>
      <div
        // style={{ display: openSuccessModal && "none" }}
        class={props.class}
        id={props.id}
        ref={modalRef}
        tabIndex={props.tabIndex}
        aria-labelledby={props.aria_labelledby}
        aria-hidden={props.aria_hidden}
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
            <div class="modal-body">
              <div class="p-3">
                <div className="row fieldset">
                  <div className="col-2 text-right">
                    <label
                      htmlFor="serviceCategoryNameField"
                      class="fieldset-label required"
                    >
                      First Name<span className="text-danger">*</span>
                    </label>
                  </div>

                  <div class="col-4">
                    <input
                      style={{ padding: "5px" }}
                      type="text"
                      id="serviceCategoryNameField"
                      class="input-text"
                      placeholder="First Name"
                      value={userObj.firstName}
                      onChange={(e) => {
                        let value = e.target.value;
                        // Remove any digits from the input
                        value = value.replace(/[0-9]/g, '');
                        // Capitalize the first letter and make the rest lowercase
                        const capitalizedValue =
                          value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
                        setUserObj({ ...userObj, firstName: capitalizedValue });
                      }}
                      maxLength={50}
                    />
                    {RequireErrorMessage && userObj.firstName === "" ? (
                      <label className="validation">
                        The first name field is required.
                      </label>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="col-2 text-right">
                    <label
                      htmlFor="serviceCategoryNameField"
                      class="fieldset-label required"
                    >
                      Last Name<span className="text-danger">*</span>
                    </label>
                  </div>

                  <div class="col-4">
                    <input
                      style={{ padding: "5px" }}
                      type="text"
                      id="serviceCategoryNameField"
                      class="input-text"
                      placeholder="Last Name"
                      value={userObj.lastName}
                      onChange={(e) => {
                        let value = e.target.value;
                        // Remove any digits from the input
                        value = value.replace(/[0-9]/g, '');
                        // Capitalize the first letter and make the rest lowercase
                        const capitalizedValue =
                          value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
                        setUserObj({ ...userObj, lastName: capitalizedValue });
                      }}
                      maxLength={50}
                    />
                    {RequireErrorMessage && userObj.lastName === "" ? (
                      <label className="validation">
                        The last name field is required.
                      </label>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div class="row fieldset">
                  <div class="col-2 text-right">
                    <label
                      htmlFor="serviceCategoryNameField"
                      class="fieldset-label required"
                    >
                      Email<span className="text-danger">*</span>
                    </label>
                  </div>
                  <div class="col-10">
                    <input
                      style={{ padding: "5px" }}
                      type="email"
                      // id="category-description"
                      id="serviceCategoryNameField"
                      className="input-text"
                      placeholder="Email"
                      value={userObj.email}
                      onChange={(e) => {
                        setUserObj({ ...userObj, email: e.target.value });
                      }}
                      maxLength={50}
                    />

                    {RequireErrorMessage && userObj.email === "" ? (
                      <label className="validation">
                        The email field is required.
                      </label>
                    ) : !validateEmail(userObj.email) &&
                      userObj.email !== "" ? (
                      <label className="validation">
                        Please enter a valid email address.
                      </label>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                <div class="row fieldset">
                  <div class="col-2 text-right">
                    <label
                      htmlFor="serviceCategoryNameField"
                      class="fieldset-label required"
                    >
                      User Role<span className="text-danger">*</span>
                    </label>
                  </div>
                  <div class="col-10">
                    <div className="input-group new-user-select">
                      <DropDown
                        className="phone-input-country-code selectDropDown Drop-down-width"
                        options={options.slice(1)}
                        value={role}
                        onChange={handleSelectChange}
                      />
                      {RequireErrorMessage && userObj.roleTypeID === "" ? (
                        <label className="validation">
                          The role type field is required.
                        </label>
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
                  {errorMessage}
                </label>
              </div>
            </div>
            {/*Modal body End */}
            {/*Footer body button Start */}
            <div class="modal-footer">
              <div class="hstack gap-2 justify-content-end">
                <button
                  type="button"
                  class="btn btn-light"
                  data-bs-dismiss="modal"
                  onClick={() => SetInitialModelData()}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="btn btn-success"
                  id="add-btn"
                  onClick={() => {
                    UserAddUpdateBtnClicked();
                  }}
                >
                  {modelAction === "Add"
                    ? getCrudButtonTextName("Add", moduleName)
                    : getCrudButtonTextName("Update", moduleName)}
                </button>
              </div>
            </div>
            {/*Footer body button End */}
            <SuccessModal
              handleClose={HandleClose}
              setOpenSuccessModal={setOpenSuccessModal}
              openSuccessModal={openSuccessModal}
              modelAction={modelAction}
              statusMessage={"Status Changed Successfully"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersModel;
