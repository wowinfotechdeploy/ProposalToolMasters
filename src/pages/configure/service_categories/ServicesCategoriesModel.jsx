/* global $ */
import React, { useEffect, useState, useRef, useContext } from "react";
import Select from "react-select";
import { useSelector } from "react-redux";
import { GetProfessionTypeLookupList } from "../../../redux/Services/Master/ProfessionTypeApi";
import {
  AddUpdateServiceCategory,
  DeclineSuperAdminChanges,
  GetServiceCategoryModel,
} from "../../../redux/Services/Config/ServiceCategoryApi";
import { USER_ROLE_TYPE } from "../../../Middleware/enums";
import { ERROR_MESSAGES } from "../../../components/GlobalMessage";
import SuccessModal from "../../../components/SuccessModal";
import { AuthContextProvider } from "../../../AuthContext/AuthContext";
import { NotifySuperAdminPredefinedChangesToAdmin } from "../../../redux/Services/Setting/NotificationApi";
import AcceptSuperAdminChangesConfirmation from "../../../components/AcceptSuperAdminChangesConfirmation";
import ErrorModel from "../../../components/ErrorModel";
import SAPredefinedChangesNotifyMessageModel from "../../../components/SAPredefinedChangesNotifyMessageModel";
import "./ServiceCategoryModal-redesign.css";

function ServicesCategoriesModel(props) {
  // A] States Declaration :
  const moduleName = "Service Category";
  const modalRef = useRef(null);
  const [modelAction, setModelAction] = useState("");
  const [serviceCatObj, setserviceCatObj] = useState({
    serviceCatKeyID: null,
    keyID: null,
    serviceCatName: undefined,
    description: "",
    createdByID: null,
    professionTypeList: [], //this will be professional type array
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [requireErrorMessage, setRequireErrorMessage] = useState(false);
  const [professionTypeLookupList, setProfessionTypeLookupList] = useState([]);
  const [dismissModal, setDismissModal] = useState(null);
  const [openErrorModal, setOpenErrorModal] = React.useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
  const [Status, setStatus] = React.useState(false);
  const { setLoader, getCrudButtonTextName, getCrudPopUpTitleName } =
    useContext(AuthContextProvider);
  const common = useSelector((state) => state.Storage); //Getting Logged Users Details From Persist Storage of redux hooks

  // B] Initial useEffect : Will call when Add/Update button click from list page
  useEffect(() => {
    setModelAction(props.modelRequestData.Action === null ? "Add" : "Update"); //Do not change this naming convention
    GetProfessionTypeLookupListData();

    if (
      props.modelRequestData.Action !== undefined &&
      props.modelRequestData.Action !== null
    ) {
      GetServiceCategoryModelData(
        props.modelRequestData.serviceCatKeyID,
        props.modelRequestData.Type,
      );
    } else {
      SetInitialModelData();
    }
  }, [props.modelRequestData]);

  // useEffect(() => {
  //   if (openErrorModal) {
  //     setTimeout(() => {
  //       $('#' + "addUpdateModal").modal('hide')
  //     }, 400);
  //   }
  // }, [
  //   openErrorModal
  // ])
  // C] This function will clear all data from popup model
  const SetInitialModelData = () => {
    setserviceCatObj({
      ...serviceCatObj,
      serviceCatKeyID: null,
      keyID: null,
      serviceCatName: "",
      description: "",
      createdByID: "",
      professionTypeList: [],
    });
    setErrorMessage("");
    setRequireErrorMessage(false);
  };

  // D] Calling All Api's like Lookup List and other Here :
  // 1) Profession Type Lookup List Api
  const GetProfessionTypeLookupListData = async () => {
    try {
      const data = await GetProfessionTypeLookupList();

      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          const professionTypeLookupListData = data?.data?.responseData?.data;
          setProfessionTypeLookupList(professionTypeLookupListData);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const ProfessionalTypeLookeupListOptions = professionTypeLookupList.map(
    (ptype) => ({
      value: ptype.professionTypeId,
      label: ptype.professionTypeName,
    }),
  );

  const professionTypeInputValue = professionTypeLookupList?.filter(
    (item) => common.professionTypeLists[0] === item.professionTypeId,
  );

  const professionTypeValue =
    serviceCatObj?.professionTypeList?.map((item) => ({
      value: item.professionTypeId,
      label: item.professionTypeName,
    })) || [];

  // E] Event Handling Functions will call here.
  // 1) On Change Select Profession Type
  const OnChangeSelectProfessionType = (ptype) => {
    const updatedPfList = ptype.map((option) => ({
      professionTypeId: option.value,
      professionTypeName: option.label,
    }));
    setserviceCatObj({
      ...serviceCatObj,
      professionTypeList: updatedPfList,
    });
  };

  // F] Calling CRUD Api here
  // 1) Get Model Data Api
  const GetServiceCategoryModelData = async (id, GetSAChanges) => {
    if (!id) {
      return;
    }
    setLoader(true);

    //..............Service Category Edit Data Api...................
    try {
      const data = await GetServiceCategoryModel(id, GetSAChanges);
      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          const ModelData = data?.data?.responseData?.data;
          setLoader(false);
          setserviceCatObj({
            ...serviceCatObj,
            serviceCatKeyID: ModelData.serviceCatKeyID,
            keyID: ModelData.keyID,
            serviceCatName: ModelData.serviceCatName,
            description:
              ModelData.description === null ? "" : ModelData.description,
            createdByID: ModelData.createdByID,
            professionTypeList: ModelData.professionTypeList, //this will be professional type array
          });
        }
      } else {
        setErrorMessage(data?.response?.data?.errorMessage);
        setOpenErrorModal(true);
        // setTimeout(() => {
        //   $('#' + "addUpdateModal").modal('hide')
        // }, 400);
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  // 2) Add Update Button Click Function
  const ServiceCategoryAddUpdateBtnClicked = (Accept) => {
    if (
      (common.professionTypeLists?.length > 1 ||
        common.organisationKeyID === null) &&
      serviceCatObj.professionTypeList?.length === 0 //
    ) {
      setRequireErrorMessage(true);
      return false; // Return false or handle your error logic here if needed.
    } else if (
      typeof serviceCatObj.serviceCatName === undefined ||
      serviceCatObj.serviceCatName.trim() === ""
    ) {
      setRequireErrorMessage(true);
      return false; // Return false or handle your error logic here if needed.
    } else {
      setRequireErrorMessage(""); // Clear the error message if there are no errors.
    }

    if (Accept === "Accept") {
      $("#" + "ConfirmSAChangesModel").modal("show");

      setStatus(true);
      return;
    }
    // Preparing Object For Add Update and if any modification then it will done here
    const ApiRequest_ParamsObj = {
      Action: props.modelRequestData.Action,
      userKeyID: common.userKeyID,
      organisationID: common.organisationID,
      organisationKeyID: common.organisationKeyID,

      serviceCatKeyID: serviceCatObj.serviceCatKeyID, //will change module wise
      acceptSAChanges: Accept,
      //form level params : will change according to module
      serviceCatName: serviceCatObj.serviceCatName,
      description:
        serviceCatObj.description === "" ? null : serviceCatObj.description,
      professionTypeList:
        common.professionTypeLists?.length > 1 ||
        common.organisationKeyID === null
          ? serviceCatObj.professionTypeList
          : [
              {
                professionTypeId: professionTypeInputValue[0]?.professionTypeId,
                professionTypeName:
                  professionTypeInputValue[0]?.professionTypeName,
              },
            ],
    };

    AddUpdateServiceCategoryData(ApiRequest_ParamsObj);
  };

  // const openExistingModel = () => {
  //   $('#' + "addUpdateModal").modal('show')
  // }
  const handleConfirmButton = () => {
    $("#" + "ConfirmSAChangesModel").modal("hide");
    if (Status) {
      ServiceCategoryAddUpdateBtnClicked(true);
    } else {
      DeclineSuperAdminChangesData();
    }
  };
  // Add or Update Service Category Data
  const AddUpdateServiceCategoryData = async (apiRequestParams) => {
    setLoader(true);
    try {
      let url = "/AddUpdateServiceCategory"; // Default URL for Adding Data
      if (apiRequestParams.Action !== null) {
        url = `/AddUpdateServiceCategory?Action=${props.modelRequestData.Action}`; // URL for Updating Data
      }
      const response = await AddUpdateServiceCategory(url, apiRequestParams);
      if (response) {
        setLoader(false);
        if (response?.data?.statusCode === 200) {
          if (apiRequestParams.Action === null) {
            $("#" + "ConfirmSAChangesModel").modal("hide");
            setOpenSuccessModal(true);
            props.setIsAddUpdateActionDone(true);
          } else {
            $("#" + "ConfirmSAChangesModel").modal("hide");
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
  const DeclineSuperAdminChangesData = async (Decline) => {
    if (Decline === "Decline") {
      // $('#' + props.id).modal('hide')

      setStatus(false);
      $("#" + "ConfirmSAChangesModel").modal("show");
      return;
    }
    setLoader(true);
    try {
      const apiRequestParams = {
        organisationKeyID: common.organisationKeyID,
        userKeyID: common.userKeyID,
        moduleKeyID: props.modelRequestData.serviceCatKeyID,
        moduleName: "Predefined-ServiceCategory",
        //Predefined-ServiceCategory, Predefined-GlobalConstant, Predefined-GlobalPricingDriver,
        //Predefined-PL-EL-Template, Predefined-TnC-Template, Predefined-Email-Template,
        //Predefined-Service, Predefined-ServicePackage
      };
      const response = await DeclineSuperAdminChanges(apiRequestParams);
      if (response) {
        setLoader(false);
        if (response?.data?.statusCode === 200) {
          if (apiRequestParams.Action === null) {
            $("#" + props.id).modal("hide");
            $("#" + "ConfirmSAChangesModel").modal("hide");
            // setOpenSuccessModal(true);
            props.setIsAddUpdateActionDone(true);
          } else {
            $("#" + props.id).modal("hide");
            $("#" + "ConfirmSAChangesModel").modal("hide");
            // setOpenSuccessModal(true);
            props.setIsAddUpdateActionDone(true);
          }
        } else {
          $("#" + "ConfirmSAChangesModel").modal("hide");
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
  // Handle Close
  const handleClose = async () => {
    if (isCheck) {
      setLoader(true);
      const Notification = await NotifySuperAdminPredefinedChangesToAdmin({
        userKeyID: common.userKeyID,
        moduleKeyID: serviceCatObj.serviceCatKeyID,
        moduleName: "Predefined-ServiceCategory",
      });
      if (Notification?.data?.statusCode === 200) {
        setLoader(false);
        setModelAction("NotificationSend");
        setOpenSuccessModal(true);
        setIsCheck(false);
      }
    } else {
      $("#" + props.id).modal("hide");
      $("#" + "ConfirmSAChangesModel").modal("hide");
      setOpenSuccessModal(false);
      setOpenErrorModal(false);
      setIsCheck(false);
    }
  };

  //Design part :
  return (
    <div className="service-category-modal-redesign">
      <div
        style={{ display: (openSuccessModal || openErrorModal) && "none" }}
        className={props.class}
        id={props.id}
        ref={modalRef}
        tabIndex={props.tabIndex}
        aria-labelledby={props.aria_labelledby}
        aria-hidden={props.aria_hidden}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div className="modal-dialog modal-md modal-dialog-centered service-category-modal-dialog">
          <div className="modal-content service-category-modal-content">
            {/* =========================
                HEADER
                ========================= */}
            <div className="modal-header service-category-modal-header">
              <div className="service-category-modal-heading">
                <span className="service-category-modal-heading-icon">
                  <i className="ri-stack-line"></i>
                </span>

                <div>
                  <h5 className="modal-title" id="exampleModalLabel">
                    {modelAction === "Add"
                      ? getCrudPopUpTitleName("Add", moduleName)
                      : getCrudPopUpTitleName("Update", moduleName)}
                  </h5>

                  <p>
                    {modelAction === "Add"
                      ? "Create a new service category"
                      : "Update the service category"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="btn-close service-category-modal-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={SetInitialModelData}
                id="close-modal"
              ></button>
            </div>

            {/* =========================
                BODY
                ========================= */}
            <div className="modal-body service-category-modal-body">
              <SAPredefinedChangesNotifyMessageModel
                Params={{
                  moduleName: moduleName,
                  SAChanges: props.modelRequestData.Type,
                }}
              />

              <div className="service-category-modal-form">
                {(common.professionTypeLists?.length > 1 ||
                  common.organisationKeyID === null) && (
                  <div className="service-category-modal-field">
                    <label className="service-category-modal-label">
                      Profession Type
                      <span className="service-category-required">*</span>
                    </label>

                    <Select
                      isMulti
                      className="user-role-select service-category-modal-select"
                      classNamePrefix="service-category-select"
                      options={ProfessionalTypeLookeupListOptions}
                      value={professionTypeValue}
                      onChange={OnChangeSelectProfessionType}
                      placeholder="Select profession type"
                    />

                    {requireErrorMessage &&
                    (common.professionTypeLists?.length > 1 ||
                      common.organisationKeyID === null) &&
                    professionTypeValue?.length === 0 ? (
                      <label className="validation service-category-modal-validation">
                        {ERROR_MESSAGES}
                      </label>
                    ) : (
                      ""
                    )}
                  </div>
                )}

                <div className="service-category-modal-field">
                  <label className="service-category-modal-label">
                    Service Category Name
                    <span className="service-category-required">*</span>
                  </label>

                  <div className="service-category-input-wrap">
                    <i className="ri-stack-line service-category-input-icon"></i>

                    <input
                      type="text"
                      className="input-text service-category-modal-input service-category-modal-input--with-icon"
                      placeholder="Enter service category name"
                      value={serviceCatObj.serviceCatName}
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
                        setserviceCatObj({
                          ...serviceCatObj,
                          serviceCatName: capitalizedValue,
                        });
                      }}
                      maxLength={50}
                    />
                  </div>

                  <div className="service-category-field-meta">
                    <span>{serviceCatObj.serviceCatName?.length || 0}/50</span>
                  </div>

                  {requireErrorMessage &&
                  serviceCatObj.serviceCatName === "" ? (
                    <label className="validation service-category-modal-validation">
                      {ERROR_MESSAGES}
                    </label>
                  ) : (
                    ""
                  )}
                </div>

                <div className="service-category-modal-field">
                  <label className="service-category-modal-label">
                    Service Category Description
                  </label>

                  <textarea
                    className="input-text service-category-modal-textarea"
                    placeholder="Enter a short description for this service category"
                    value={serviceCatObj.description}
                    onChange={(e) => {
                      const capitalizedValue =
                        e.target.value.charAt(0).toUpperCase() +
                        e.target.value.slice(1);
                      setserviceCatObj({
                        ...serviceCatObj,
                        description: capitalizedValue,
                      });
                    }}
                    maxLength={250}
                  ></textarea>

                  <div className="service-category-field-meta">
                    <span>{serviceCatObj.description?.length || 0}/250</span>
                  </div>
                </div>

                {errorMessage && (
                  <div className="service-category-modal-api-error">
                    <i className="ri-error-warning-line"></i>

                    <span>
                      {common.professionTypeLists?.length <= 1
                        ? errorMessage?.includes(
                            `Please don't choose this profession type`,
                          )
                          ? errorMessage.split(".")[0]
                          : errorMessage
                        : errorMessage}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* =========================
                FOOTER
                ========================= */}
            <div className="modal-footer service-category-modal-footer">
              {props.modelRequestData.Type ? (
                <>
                  <div className="service-category-sa-footer-copy">
                    Review the System Administrator changes before accepting or
                    declining.
                  </div>

                  <div className="service-category-modal-actions">
                    <button
                      type="submit"
                      className="btn btn-md declined-item-btn service-category-decline-btn"
                      onClick={() => DeclineSuperAdminChangesData("Decline")}
                    >
                      <i className="ri-close-line"></i>
                      <span>Decline</span>
                    </button>

                    <button
                      type="submit"
                      className="btn btn-md accept-item-btn service-category-accept-btn"
                      onClick={() => {
                        ServiceCategoryAddUpdateBtnClicked("Accept");
                      }}
                    >
                      <i className="ri-check-line"></i>
                      <span>Accept</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div></div>

                  <div className="service-category-modal-actions">
                    <button
                      type="button"
                      className="btn btn-md btn-light service-category-cancel-btn"
                      data-bs-dismiss="modal"
                      onClick={() => SetInitialModelData()}
                    >
                      <span>{getCrudButtonTextName("Cancel")}</span>
                    </button>

                    <button
                      type="submit"
                      className="btn btn-md create-item-btn service-category-save-btn"
                      onClick={() => {
                        ServiceCategoryAddUpdateBtnClicked();
                      }}
                    >
                      <span>
                        {modelAction === "Add"
                          ? getCrudButtonTextName("Add", moduleName)
                          : getCrudButtonTextName("Update", moduleName)}
                      </span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Existing functional modals */}
        <SuccessModal
          handleClose={handleClose}
          setDismissModal={setDismissModal}
          setIsCheck={setIsCheck}
          isCheck={isCheck}
          setOpenSuccessModal={setOpenSuccessModal}
          openSuccessModal={openSuccessModal}
          modelAction={modelAction}
          message={`${moduleName} ${serviceCatObj.serviceCatName}`}
        />

        <AcceptSuperAdminChangesConfirmation
          openErrorModal={openErrorModal}
          ModelId={props.id}
          Status={Status}
          openSuccessModal={openSuccessModal}
          modelRequestData={props.modelRequestData}
          UpdatedChanges={handleConfirmButton}
        />

        <ErrorModel
          ErrorModel={openErrorModal}
          handleClose={handleClose}
          ErrorMessage={errorMessage}
        />
      </div>
    </div>
  );
}

export default ServicesCategoriesModel;
