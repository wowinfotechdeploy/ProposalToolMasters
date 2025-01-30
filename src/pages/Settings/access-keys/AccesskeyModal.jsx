/* global $ */
import React, { useEffect, useState, useRef, useContext } from "react";
import { useSelector } from "react-redux";
import "./AccessKeyStyle.css";
import { ERROR_MESSAGES } from "../../../components/GlobalMessage";
import { AddUpdateAccessKey } from "../../../redux/Services/Setting/AccessKeyApi";
import SuccessModal from "../../../components/SuccessModal";
import { AuthContextProvider } from "../../../AuthContext/AuthContext";
const AccesskeyModal = (props) => {
  // A] States Declaration :
  const moduleName = "Access Key";
  const modalRef = useRef(null);
  const [dismissModal, setDismissModal] = useState(null);
  const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
  const [modelAction, setModelAction] = useState("");
  const [accessKeyObj, setAccessKeyObj] = useState({
    userKeyID: null,
    accessKeyName: undefined,
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
    SetInitialModelData();
  }, [props.modelRequestData]);

  // C] This function will clear all data from popup model
  const SetInitialModelData = () => {
    setAccessKeyObj({
      ...accessKeyObj,
      userKeyID: null,
      accessKeyName: "",
    });
    setErrorMessage("");
    setRequireErrorMessage(false);
  };

  // D] Calling CRUD Api here

  // 2) Add Update Button Click Function
  const AccessKeyAddUpdateBtnClicked = () => {
    //Check Validations will be done here
    if (
      typeof accessKeyObj.accessKeyName === undefined ||
      accessKeyObj.accessKeyName.trim() === ""
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
      organisationKeyID: common.organisationKeyID,
      userKeyID: common.userKeyID,

      //form level params : fixed
      // AccessKeyKeyID: accessKeyObj.AccessKeyKeyID,
      AccessKeyKeyID: props.modelRequestData.accessKeyKeyID,

      //form level params : will change according to module
      accessKeyName: accessKeyObj.accessKeyName,
    };
    AddUpdateAccessKeyData(ApiRequest_ParamsObj);
  };

  // Add or Update Access Key Data
  const AddUpdateAccessKeyData = async (apiRequestParams) => {
    setLoader(true);
    try {
      let url = "/AddAccessKey"; // Default URL for Adding Data
      if (apiRequestParams.AccessKeyKeyID !== null) {
        url = `/AddAccessKey?AccessKeyKeyID=${apiRequestParams.AccessKeyKeyID}`; // URL for Updating Data
      }
      const response = await AddUpdateAccessKey(url, apiRequestParams);
      if (response) {
        setLoader(false);
        if (response?.data?.statusCode === 200) {
          if (apiRequestParams.AccessKeyKeyID === null) {
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

  // handleFunction
  const handleClose = () => {
    $("#" + props.id).modal("hide");
    setOpenSuccessModal(false);
  };
  //Design part :
  return (
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

          <div class="modal-body">
            <div class="p-3">
              <div class="row fieldset">
                <div class="col-lg-2 col-md-3 col-sm-12 text-start text-md-end">
                  <label htmlFor="customerName-field">
                    Name
                    <span className="text-danger">*</span>
                  </label>
                </div>
                <div class="col-lg-10 col-md-9 col-sm-12">
                  <input
                    style={{ padding: "5px" }}
                    type="text"
                    id="customerName-field"
                    class="input-text"
                    placeholder="Access Key Name"
                    value={accessKeyObj.accessKeyName}
                    onChange={(e) => {
                      setErrorMessage("");
                      const inputValue = e.target.value;
                      const trimmedValue = inputValue.replace(/^\s+/g, "");
                      if (/^\d/.test(trimmedValue)) {
                        return;
                      }
                      const capitalizedValue =
                        trimmedValue.charAt(0).toUpperCase() +
                        trimmedValue.slice(1);
                      setAccessKeyObj({
                        ...accessKeyObj,
                        accessKeyName: capitalizedValue,
                      });
                    }}
                    maxLength={50}
                  />
                  {RequireErrorMessage && accessKeyObj.accessKeyName === "" ? (
                    <label className="validation">{ERROR_MESSAGES}</label>
                  ) : (
                    ""
                  )}
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
                {getCrudButtonTextName("Cancel")}
              </button>
              <button
                type="submit"
                class="btn btn-success create-item-btn"
                id="add-btn"
                onClick={() => {
                  AccessKeyAddUpdateBtnClicked();
                }}
              >
                <span>
                  {" "}
                  {modelAction === "Add"
                    ? getCrudButtonTextName("Add", moduleName)
                    : getCrudButtonTextName("Update", moduleName)}
                </span>
              </button>
            </div>
          </div>
          <SuccessModal
            handleClose={handleClose}
            setDismissModal={setDismissModal}
            setOpenSuccessModal={setOpenSuccessModal}
            openSuccessModal={openSuccessModal}
            modelAction={modelAction}
            message={`${moduleName} ${accessKeyObj.accessKeyName}`}
          />
        </div>
      </div>
    </div>
  );
};

export default AccesskeyModal;
