/* global $ */
import React, { useContext, useState } from "react";
import Select from "react-select";
import "./PredefineGlobalConstant.css";
import "./GlobalConstantModal-redesign.css";
import { useEffect } from "react";
import { GetProfessionTypeLookupList } from "../../../redux/Services/Master/ProfessionTypeApi";
import {
  GetGlobalConstantModel,
  AddUpdateGlobalConstant,
} from "../../../redux/Services/Config/GlobalConstantApi";
import { useSelector } from "react-redux";
import { USER_ROLE_TYPE } from "../../../Middleware/enums";
import { ERROR_MESSAGES } from "../../../components/GlobalMessage";
import SuccessModal from "../../../components/SuccessModal";
import { AuthContextProvider } from "../../../AuthContext/AuthContext";
import { NotifySuperAdminPredefinedChangesToAdmin } from "../../../redux/Services/Setting/NotificationApi";
import { DeclineSuperAdminChanges } from "../../../redux/Services/Config/ServiceCategoryApi";
import ErrorModel from "../../../components/ErrorModel";
import AcceptSuperAdminChangesConfirmation from "../../../components/AcceptSuperAdminChangesConfirmation";
import SAPredefinedChangesNotifyMessageModel from "../../../components/SAPredefinedChangesNotifyMessageModel";

function GlobalConstantModal(props) {
  // Declare all State
  const moduleName = "Global Constant";
  const [modelAction, setModelAction] = useState("");
  const [isCheck, setIsCheck] = useState(false);
  const [Status, setStatus] = React.useState(false);
  const [requireErrorMessage, setRequireErrorMessage] = useState(false);
  const [GlobalConstantObj, setGlobalConstantObj] = useState({
    globalPricingDriverKeyID: null,
    keyID: null,
    GlobalConstantDriverName: "",
    GlobalConstantDriverValue: "",
    isPredefined: null,
    addedFor: null,
    GlobalConstantDriverType: null,
    professionTypeList: [], //this will be professional type array
  });
  const [modelRequestData, setModelRequestData] = useState({
    Action: null,
    message: "",
    ServiceName: [],
    name: null,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [professionTypeLookupList, setProfessionTypeLookupList] = useState([]);
  const common = useSelector((state) => state.Storage); //Getting Logged Users Details From Persist Storage of redux hooks
  const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
  const [openErrorModal, setOpenErrorModal] = React.useState(false);
  const {
    setLoader,
    getCrudButtonTextName,
    getCrudPopUpTitleName,
    getCurrencySymbol,
  } = useContext(AuthContextProvider);

  const currencySymbol = getCurrencySymbol(common.currencyID);

  //c]Declare UseEffect
  useEffect(() => {
    setModelAction(props.modelRequestData.Action === null ? "Add" : "Update"); //Do not change this naming convention
    GetProfessionTypeLookupListData();
    if (
      props.modelRequestData.Action !== undefined &&
      props.modelRequestData.Action !== null
    ) {
      GetGlobalConstantModelData(
        props.modelRequestData.globalPricingDriverKeyID,
        props.modelRequestData.Type,
      );
    } else {
      SetInitialModelData();
    }
  }, [props.modelRequestData]);

  // C] This function will clear all data from popup model
  const SetInitialModelData = () => {
    setGlobalConstantObj({
      ...GlobalConstantObj,
      globalPricingDriverKeyID: null,
      keyID: null,
      GlobalConstantDriverName: "",
      GlobalConstantDriverValue: "",
      GlobalConstantDriverType: "",
      isPredefined: null,
      addedFor: null,
      professionTypeList: [], //this will be professional type array
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
          const ProfessionTypeLookupListData = data?.data?.responseData?.data;
          setProfessionTypeLookupList(ProfessionTypeLookupListData);
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
  const professionTypeValue = GlobalConstantObj?.professionTypeList?.map(
    (item) => ({
      value: item.professionTypeId,
      label: item.professionTypeName,
    }),
  );
  const professionTypeInputValue = professionTypeLookupList.filter(
    (item) => common.professionTypeLists[0] === item.professionTypeId,
  );
  // D] Event Handling Functions will call here.
  // 1) On Change Select Profession Type
  const OnChangeSelectProfessionType = (ptype) => {
    const updatedPfList = ptype.map((option) => ({
      professionTypeId: option.value,
      professionTypeName: option.label,
    }));
    setGlobalConstantObj({
      ...GlobalConstantObj,
      professionTypeList: updatedPfList,
    });
  };

  // F] Calling CRUD Api here
  // 1) Get Model Data Api
  const GetGlobalConstantModelData = async (id, GetSAChanges) => {
    //..............Global Constant Edit Data Api...................
    if (!id) {
      return;
    }
    setLoader(true);
    try {
      const data = await GetGlobalConstantModel(id, GetSAChanges);
      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          const ModelData = data?.data?.responseData?.data;
          setLoader(false);
          setGlobalConstantObj({
            ...GlobalConstantObj,
            globalPricingDriverKeyID: ModelData.globalPricingDriverKeyID,
            keyID: ModelData.keyID,
            userId: common.userId,
            GlobalConstantDriverName: ModelData.driverName,
            GlobalConstantDriverValue: ModelData.driverValue,
            GlobalConstantDriverType: ModelData.driverTypeID,
            isPredefined: ModelData.isPredefined,
            addedFor: "",
            professionTypeList: ModelData.professionTypeList, //this will be professional type array
          });
        }
      } else {
        setErrorMessage(data?.data?.errorMessage);
        setOpenErrorModal(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //2]Add Update Button Click Function
  const GlobalConstantAddUpdateBtnClicked = (Accept) => {
    if (
      (common.professionTypeLists?.length > 1 ||
        common.organisationKeyID === null) &&
      professionTypeValue?.length === 0
    ) {
      setRequireErrorMessage(true);
      return false; // Return false or handle your error logic here if needed.
    } else if (
      GlobalConstantObj.GlobalConstantDriverName === undefined ||
      GlobalConstantObj.GlobalConstantDriverName === "" ||
      GlobalConstantObj.GlobalConstantDriverValue === undefined ||
      GlobalConstantObj.GlobalConstantDriverValue === ""
    ) {
      setRequireErrorMessage(true);
      return false; // Return false or handle your error logic here if needed.
    } else {
      setRequireErrorMessage(""); // Clear the error message if there are no errors.
    }

    // Clear the error message and set close to true if there are no errors.
    setErrorMessage("");
    if (Accept === "Accept") {
      $("#" + "ConfirmSAChangesModel").modal("show");

      setStatus(true);
      return;
    }
    // Preparing Object For Add Update and if any modification then it will done here
    const ApiRequest_ParamsObj = {
      //global level params : fixed
      Action: props.modelRequestData.Action,
      userKeyID: common.userKeyID,
      organisationKeyID: common.organisationKeyID,
      acceptSAChanges: Accept,
      //form level params : fixed
      globalPricingDriverKeyID: props.modelRequestData.globalPricingDriverKeyID, //will change module wise

      //form level params : will change according to module
      driverName: GlobalConstantObj.GlobalConstantDriverName,
      driverValue:
        GlobalConstantObj.GlobalConstantDriverValue === ""
          ? null
          : GlobalConstantObj.GlobalConstantDriverValue,
      driverTypeID: 1,
      isPredefined: common.roleTypeId === USER_ROLE_TYPE.SuperAdmin ? 1 : 0,
      addedFor: "",
      professionTypeList:
        common.professionTypeLists?.length > 1 ||
        common.organisationKeyID === null
          ? GlobalConstantObj.professionTypeList
          : [
              {
                professionTypeId: professionTypeInputValue[0]?.professionTypeId,
                professionTypeName:
                  professionTypeInputValue[0]?.professionTypeName,
              },
            ],
    };
    AddUpdateGlobalConstantData(ApiRequest_ParamsObj);
  };

  // 3) Add Update Global category Data Api
  const AddUpdateGlobalConstantData = async (ApiRequest_ParamsObj) => {
    setLoader(true);
    try {
      let URL = "/AddUpdateGlobalConstants"; //Api URL For Add Data
      if (ApiRequest_ParamsObj.Action !== null) {
        URL = `/AddUpdateGlobalConstants?Action=${ApiRequest_ParamsObj.Action}`; //Api URL For Update Data
      }
      const response = await AddUpdateGlobalConstant(URL, ApiRequest_ParamsObj);
      if (response) {
        setLoader(false);
        if (response?.data?.statusCode === 200) {
          if (ApiRequest_ParamsObj.Action === null) {
            setOpenSuccessModal(true);
            props.setIsAddUpdateActionDone(true);
          } else {
            const services =
              response?.data.responseData.globalConstantExistsInServices;
            if (services && services.length >= 1) {
              const serviceName = services.map((item) => item.serviceName);
              setModelRequestData({
                Action: "Update",
                message: `This Global Constant is being used in the below Services:`,
                ServiceName: serviceName,
                name: "services",
              });
              setOpenSuccessModal(true);
              props.setIsAddUpdateActionDone(true);
            } else {
              setModelRequestData({
                ServiceName: [], // Reset to an empty array
              });
              setOpenSuccessModal(true);
              props.setIsAddUpdateActionDone(true);
            }
          }
        } else {
          setErrorMessage(response?.response?.data?.errorMessage);
        }
      }
    } catch (error) {
      console.log(error);
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
        moduleKeyID: props.modelRequestData.globalPricingDriverKeyID,
        moduleName: "Predefined-GlobalConstant",
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

  const handleClose = async () => {
    if (isCheck) {
      setLoader(true);
      const Notification = await NotifySuperAdminPredefinedChangesToAdmin({
        userKeyID: common.userKeyID,
        moduleKeyID: props.modelRequestData.globalPricingDriverKeyID,
        moduleName: "Predefined-GlobalConstant",
      });
      if (Notification?.data?.statusCode === 200) {
        setLoader(false);
        setModelAction("NotificationSend");
        setOpenSuccessModal(true);
        setIsCheck(false);
      }
    } else {
      $("#" + props.id).modal("hide");
      setOpenSuccessModal(false);
      $("#" + "ConfirmSAChangesModel").modal("hide");
      setOpenErrorModal(false);
      setIsCheck(false);
    }
  };

  const handleConfirmButton = () => {
    $("#" + "ConfirmSAChangesModel").modal("hide");
    if (Status) {
      GlobalConstantAddUpdateBtnClicked(true);
    } else {
      DeclineSuperAdminChangesData();
    }
  };
  return (
    <div className="global-constant-modal-redesign">
      <div
        style={{ display: openSuccessModal && "none" }}
        className={props.class}
        id={props.id}
        tabIndex={props.tabIndex}
        aria-labelledby={props.aria_labelledby}
        aria-hidden={props.aria_hidden}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div className="modal-dialog modal-md modal-dialog-centered global-constant-modal-dialog">
          <div className="modal-content global-constant-modal-content">
            {/* =========================
                HEADER
                ========================= */}
            <div className="modal-header global-constant-modal-header">
              <div className="global-constant-modal-heading">
                <span className="global-constant-modal-heading-icon">
                  <i className="ri-function-line"></i>
                </span>

                <div>
                  <h5 className="modal-title" id="exampleModalLabel">
                    {modelAction === "Add"
                      ? getCrudPopUpTitleName("Add", moduleName)
                      : getCrudPopUpTitleName("Update", moduleName)}
                  </h5>

                  <p>
                    {modelAction === "Add"
                      ? "Create a reusable global constant for your pricing and service workflows."
                      : "Update the global constant value and profession mapping."}
                  </p>
                </div>
              </div>

              <button
                onClick={SetInitialModelData}
                type="button"
                className="btn-close global-constant-modal-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="close-modal"
              ></button>
            </div>

            {/* =========================
                BODY
                ========================= */}
            <div className="modal-body global-constant-modal-body">
              <SAPredefinedChangesNotifyMessageModel
                Params={{
                  moduleName: moduleName,
                  SAChanges: props.modelRequestData.Type,
                }}
              />

              <div className="global-constant-modal-form">
                {(common.professionTypeLists?.length > 1 ||
                  common.organisationKeyID === null) && (
                  <div className="global-constant-modal-field">
                    <label className="global-constant-modal-label">
                      Profession Type
                      <span className="global-constant-required">*</span>
                    </label>

                    <Select
                      isMulti
                      className="user-role-select global-constant-modal-select"
                      classNamePrefix="global-constant-select"
                      options={ProfessionalTypeLookeupListOptions}
                      value={professionTypeValue}
                      onChange={OnChangeSelectProfessionType}
                      placeholder="Select profession type"
                    />

                    {requireErrorMessage &&
                    (common.professionTypeLists?.length > 1 ||
                      common.organisationKeyID === null) &&
                    professionTypeValue?.length === 0 ? (
                      <label className="validation global-constant-modal-validation">
                        {ERROR_MESSAGES}
                      </label>
                    ) : (
                      ""
                    )}
                  </div>
                )}

                <div className="global-constant-modal-field">
                  <label className="global-constant-modal-label">
                    Driver Name
                    <span className="global-constant-required">*</span>
                  </label>

                  <div className="global-constant-input-wrap">
                    <i className="ri-function-line global-constant-input-icon"></i>

                    <input
                      type="text"
                      className="input-text global-constant-modal-input global-constant-modal-input--with-icon"
                      placeholder="Enter driver name"
                      value={GlobalConstantObj.GlobalConstantDriverName}
                      onChange={(e) => {
                        setErrorMessage("");
                        const inputValue = e.target.value;
                        const trimmedValue = inputValue.replace(/^\s+/g, "");
                        const singleSpaceValue = trimmedValue.replace(
                          /\s{2,}/g,
                          " ",
                        );
                        const sanitizedValue = singleSpaceValue.replace(
                          / \./g,
                          " ",
                        );
                        const capitalizedValue =
                          sanitizedValue.charAt(0).toUpperCase() +
                          sanitizedValue.slice(1);

                        setGlobalConstantObj({
                          ...GlobalConstantObj,
                          GlobalConstantDriverName: capitalizedValue,
                        });
                      }}
                      maxLength={75}
                    />
                  </div>

                  <div className="global-constant-field-meta">
                    <span>
                      {GlobalConstantObj.GlobalConstantDriverName?.length || 0}
                      /75
                    </span>
                  </div>

                  {requireErrorMessage &&
                  GlobalConstantObj.GlobalConstantDriverName === "" ? (
                    <label className="validation global-constant-modal-validation">
                      {ERROR_MESSAGES}
                    </label>
                  ) : (
                    ""
                  )}
                </div>

                <div className="global-constant-modal-field">
                  <label className="global-constant-modal-label">
                    Driver Value
                    <span className="global-constant-required">*</span>
                  </label>

                  <div className="global-constant-input-wrap">
                    <span className="global-constant-input-icon global-constant-currency-symbol">
                      {currencySymbol}
                    </span>

                    <input
                      type="text"
                      className="input-text global-constant-modal-input global-constant-modal-input--with-icon"
                      placeholder="Enter driver value"
                      value={GlobalConstantObj.GlobalConstantDriverValue.toString().replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        ",",
                      )}
                      onChange={(e) => {
                        const inputValue = e.target.value;

                        const sanitizedInput = inputValue
                          .replace(/[^0-9.]/g, "")
                          .slice(0, 16);

                        const [integerPart, decimalPart] =
                          sanitizedInput.split(".");

                        const formattedIntegerPart = integerPart;

                        let formattedInput =
                          decimalPart !== undefined
                            ? `${formattedIntegerPart.slice(
                                0,
                                12,
                              )}.${decimalPart.slice(0, 2)}`
                            : formattedIntegerPart.slice(0, 12);

                        setGlobalConstantObj({
                          ...GlobalConstantObj,
                          GlobalConstantDriverValue: formattedInput,
                        });
                      }}
                    />
                  </div>

                  <div className="global-constant-field-help">
                    Enter a numeric value with up to 2 decimal places.
                  </div>

                  {requireErrorMessage &&
                  GlobalConstantObj.GlobalConstantDriverValue === "" ? (
                    <label className="validation global-constant-modal-validation">
                      {ERROR_MESSAGES}
                    </label>
                  ) : (
                    ""
                  )}
                </div>

                {errorMessage && (
                  <div className="global-constant-modal-api-error">
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

            {/* =========================
                FOOTER
                ========================= */}
            <div className="modal-footer global-constant-modal-footer">
              {props.modelRequestData.Type ? (
                <>
                  <div className="global-constant-sa-footer-copy">
                    Review the System Administrator changes before accepting or
                    declining.
                  </div>

                  <div className="global-constant-modal-actions">
                    <button
                      type="submit"
                      className="btn btn-md declined-item-btn global-constant-decline-btn"
                      onClick={() => DeclineSuperAdminChangesData("Decline")}
                    >
                      <i className="ri-close-line"></i>
                      <span>Decline</span>
                    </button>

                    <button
                      type="submit"
                      className="btn btn-md accept-item-btn global-constant-accept-btn"
                      onClick={() => {
                        GlobalConstantAddUpdateBtnClicked("Accept");
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

                  <div className="global-constant-modal-actions">
                    <button
                      onClick={() => {
                        SetInitialModelData();
                      }}
                      type="button"
                      className="btn btn-md btn-light global-constant-cancel-btn"
                      data-bs-dismiss="modal"
                    >
                      <span>{getCrudButtonTextName("Cancel")}</span>
                    </button>

                    <button
                      type="submit"
                      className="btn btn-md create-item-btn global-constant-save-btn"
                      onClick={() => GlobalConstantAddUpdateBtnClicked()}
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
          setIsCheck={setIsCheck}
          isCheck={isCheck}
          setOpenSuccessModal={setOpenSuccessModal}
          openSuccessModal={openSuccessModal}
          modelAction={modelAction}
          modelRequestData={modelRequestData}
          message={`${moduleName} ${GlobalConstantObj.GlobalConstantDriverName}`}
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

export default GlobalConstantModal;
