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
      GetServiceCategoryModelData(props.modelRequestData.serviceCatKeyID, props.modelRequestData.Type);

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
    })
  );

  const professionTypeInputValue = professionTypeLookupList?.filter(
    (item) => common.professionTypeLists[0] === item.professionTypeId
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
            description: ModelData.description === null ? "" : ModelData.description,
            createdByID: ModelData.createdByID,
            professionTypeList: ModelData.professionTypeList, //this will be professional type array
          });
        }
      } else {
        setErrorMessage(data?.response?.data?.errorMessage);
        setOpenErrorModal(true)
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

      setStatus(true)
      return
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
      ServiceCategoryAddUpdateBtnClicked(true)
    } else {
      DeclineSuperAdminChangesData()
    }
  }
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

      setStatus(false)
      $("#" + "ConfirmSAChangesModel").modal("show");
      return
    }
    setLoader(true);
    try {
      const apiRequestParams = {
        organisationKeyID: common.organisationKeyID,
        userKeyID: common.userKeyID,
        moduleKeyID: props.modelRequestData.serviceCatKeyID,
        moduleName: "Predefined-ServiceCategory"
        //Predefined-ServiceCategory, Predefined-GlobalConstant, Predefined-GlobalPricingDriver,
        //Predefined-PL-EL-Template, Predefined-TnC-Template, Predefined-Email-Template,
        //Predefined-Service, Predefined-ServicePackage
      }
      const response = await DeclineSuperAdminChanges(apiRequestParams);
      if (response) {
        setLoader(false);
        if (response?.data?.statusCode === 200) {
          if (apiRequestParams.Action === null) {
            $('#' + props.id).modal('hide')
            $("#" + "ConfirmSAChangesModel").modal("hide");
            // setOpenSuccessModal(true);
            props.setIsAddUpdateActionDone(true);
          } else {
            $('#' + props.id).modal('hide')
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
  }
  const handleCloseModal = () => {
    setOpenSuccessModal(false);
  };
  // Handle Close 
  const handleClose = async () => {
    if (isCheck) {
      setLoader(true)
      const Notification = await NotifySuperAdminPredefinedChangesToAdmin({
        userKeyID: common.userKeyID,
        moduleKeyID: serviceCatObj.serviceCatKeyID,
        moduleName: "Predefined-ServiceCategory"
      })
      if (Notification?.data?.statusCode === 200) {
        setLoader(false)
        setModelAction("NotificationSend")
        setOpenSuccessModal(true)
        setIsCheck(false)
      }
    } else {
      $("#" + props.id).modal("hide");
      $("#" + "ConfirmSAChangesModel").modal("hide");
      setOpenSuccessModal(false);
      setOpenErrorModal(false)
      setIsCheck(false)
    }

  };

  //Design part :
  return (
    <div>
      <div
        style={{ display: (openSuccessModal || openErrorModal) && "none" }}
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
            <div class="modal-body">
              <div>
                <div class="row fieldset">
                  <SAPredefinedChangesNotifyMessageModel Params={{ moduleName: moduleName, SAChanges: props.modelRequestData.Type }} />
                  {(common.professionTypeLists?.length > 1 ||
                    common.organisationKeyID === null) && (
                      <>
                        <div class="col-12 mb-1">
                          <label>
                            Profession Type
                            <span className="text-danger">*</span>
                          </label>
                        </div>

                        <div className="col-12 input-group">
                          {
                            common.professionTypeLists?.length > 1 ||
                              common.organisationKeyID === null ? (
                              <Select
                                isMulti
                                style={{ padding: "5px" }}
                                className="user-role-select"
                                options={ProfessionalTypeLookeupListOptions}
                                value={professionTypeValue}
                                onChange={OnChangeSelectProfessionType}
                              />
                            ) : (
                              ""
                            )
                            // <input
                            //   disabled
                            //   style={{ padding: "5px" }}
                            //   type="text"
                            //   class="input-text"
                            //   placeholder=" Profession Type"
                            //   value={professionTypeInputValue[0]?.professionTypeName}
                            // />
                          }
                          {requireErrorMessage &&
                            (common.professionTypeLists?.length > 1 ||
                              common.organisationKeyID === null) &&
                            professionTypeValue?.length === 0 ? (
                            <label className="validation">{ERROR_MESSAGES}</label>
                          ) : (
                            ""
                          )}
                        </div>
                      </>
                    )}
                </div>
                <div class="row fieldset">
                  <div class="col-12 mb-1">
                    <label>
                      Service Category Name
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                  <div class="col-12">
                    <input
                      style={{ padding: "5px" }}
                      type="text"
                      class="input-text"
                      placeholder="Service Category Name"
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
                    {requireErrorMessage &&
                      serviceCatObj.serviceCatName === "" ? (
                      <label className="validation">{ERROR_MESSAGES}</label>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div class="row fieldset">
                  <div class="col-12 mb-1">
                    <label>Service Category Description</label>
                  </div>
                  <div class="col-12">
                    <textarea
                      style={{ padding: "5px" }}
                      class="input-text"
                      placeholder="Service Category Description"
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
                  </div>
                </div>
                <label
                  style={{ display: "flex", justifyContent: "center" }}
                  className="validation"
                >
                  {common.professionTypeLists?.length <= 1 ?
                    errorMessage?.includes(
                      `Please don't choose this profession type`
                    )
                      ? errorMessage.split(".")[0]
                      : errorMessage : errorMessage}
                </label>
              </div>
            </div>
            {/* {errorMessage} */}
            {/*Modal body End */}
            {/*Footer body button Start */}
            <div class="modal-footer">
              <div class="hstack gap-2 justify-content-end">

                {props.modelRequestData.Type ? (<>
                  <button
                    type="submit"
                    class="btn btn-md btn-success accept-item-btn"
                    onClick={() => {
                      ServiceCategoryAddUpdateBtnClicked("Accept");
                    }}
                  >
                    <span>
                      Accept
                    </span>
                  </button>
                  <button
                    type="submit"
                    class="btn btn-md btn-success declined-item-btn"
                    // data-bs-dismiss="modal"
                    onClick={() => DeclineSuperAdminChangesData("Decline")}
                  >
                    <span>
                      Decline
                    </span>
                  </button>
                </>) : (
                  <>
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
                        ServiceCategoryAddUpdateBtnClicked();
                      }}
                    >
                      <span>
                        {modelAction === "Add"
                          ? getCrudButtonTextName("Add", moduleName)
                          : getCrudButtonTextName("Update", moduleName)}
                      </span>
                    </button>
                  </>
                )}
              </div>
            </div>
            {/*Footer body button End */}
          </div>
        </div>
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
          // openExistingModel={openExistingModel}
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
