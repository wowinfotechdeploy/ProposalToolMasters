/* global $ */
import React, { useEffect, useState, useRef, useContext } from "react";
import {
  AddUpdatePricingSetting,
  GetPricingSettingModel,
} from "../redux/Services/Setting/PricingSettingApi";
import { useSelector } from "react-redux";
import SuccessModal from "../components/SuccessModal";
import { AuthContextProvider } from "../AuthContext/AuthContext";

function PricingModel(props) {
  const modalRef = useRef(null);
  const [requireErrorMessage, setRequireErrorMessage] = useState(false);
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [dismissModal, setDismissModal] = useState(null);
  const [prevError, SetPrevError] = useState("");
  const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
  const [pricingSettingObj, setPricingSettingObj] = useState({
    userKeyID: null,
    minOneOffPriceForQC: "",
    minMonthlyPriceForQC: "",
    maxDiscountForQC: null,
  });

  const [PrevPricingSettingObj, setPrevPricingSettingObj] = useState({
    userKeyID: null,
    minOneOffPriceForQC: "",
    minMonthlyPriceForQC: "",
    maxDiscountForQC: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const {
    setLoader,
    proposalName,
    EngagementName,
    staticCurrencySymbols,
    userAccessData,
    getCrudButtonTextName,
  } = useContext(AuthContextProvider);
  const common = useSelector((state) => state.Storage); //Getting Logged Users Details From Persist Storage of redux hooks

  useEffect(() => {
    if (common.organisationKeyID !== null) {
      GetPricingSettingModelData(common.organisationKeyID);
    }
    $("#" + "confirm").modal("hide");
  }, [common.organisationKeyID]);

  // 1) Get Model Data Api
  const GetPricingSettingModelData = async (id) => {
    if (!id) {
      return;
    }
    try {
      const data = await GetPricingSettingModel(id);
      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          const ModelData = data?.data?.responseData?.data;
          SetPrevError(false);
          setPricingSettingObj({
            ...pricingSettingObj,
            userKeyID: common.userKeyID,
            minOneOffPriceForQC: ModelData.minOneOffPriceForQC,
            minMonthlyPriceForQC: ModelData.minMonthlyPriceForQC,
            maxDiscountForQC: ModelData.maxDiscountForQC,
            organisationKeyID: ModelData.organisationKeyID,
          });
          setPrevPricingSettingObj({
            ...pricingSettingObj,
            userKeyID: common.userKeyID,
            minOneOffPriceForQC: ModelData.minOneOffPriceForQC,
            minMonthlyPriceForQC: ModelData.minMonthlyPriceForQC,
            maxDiscountForQC: ModelData.maxDiscountForQC,
            organisationKeyID: ModelData.organisationKeyID,
          });
        }
      } else {
        SetPrevError(false);
        setErrorMessage(data?.data?.errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // 2) Add Update Button Click Function
  const PricingSettingAddUpdateBtnClicked = () => {
    if (
      pricingSettingObj.maxDiscountForQC ==
      PrevPricingSettingObj.maxDiscountForQC &&
      pricingSettingObj.minMonthlyPriceForQC ==
      PrevPricingSettingObj.minMonthlyPriceForQC &&
      pricingSettingObj.minOneOffPriceForQC ==
      PrevPricingSettingObj.minOneOffPriceForQC
      // !pricingSettingObj.maxDiscountForQC &&
      // !pricingSettingObj.minMonthlyPriceForQC &&
      // !pricingSettingObj.minOneOffPriceForQC
    ) {
      SetPrevError(true);
      return false;
    }
    const ApiRequest_ParamsObj = {
      // global level params: fixed
      organisationKeyID: common.organisationKeyID,
      userKeyID: common.userKeyID,
      // form level params: fixed
      paymentFrequencyID: props.paymentFrequencyID,
      minOneOffPriceForQC: pricingSettingObj.minOneOffPriceForQC || null,
      minMonthlyPriceForQC: pricingSettingObj.minMonthlyPriceForQC || null,
      maxDiscountForQC: pricingSettingObj.maxDiscountForQC || null,
    };

    setErrorMessage("");
    AddUpdatePricingSettingData(ApiRequest_ParamsObj);
  };

  // Add or Update Pricing Setting Data
  const AddUpdatePricingSettingData = async (apiRequestParams) => {
    setLoader(true);
    try {
      let url = "/AddUpdatePricingSettings"; // Default URL for Adding Data
      if (apiRequestParams.Action === "Update") {
        url = `/AddUpdatePricingSettings?Action=${apiRequestParams.Action}`; // URL for Updating Data
      }
      const response = await AddUpdatePricingSetting(url, apiRequestParams);
      if (response) {
        setLoader(false);
        if (response?.data?.statusCode === 200) {
          if (apiRequestParams.Action === "Update") {
            setOpenSuccessModal(true);
            setIsAddUpdateActionDone(true);
            GetPricingSettingModelData(common.organisationKeyID);
            props.setIsAddUpdatePricingActionDone(true);
          } else {
            setOpenSuccessModal(true);
            setIsAddUpdateActionDone(true);
            GetPricingSettingModelData(common.organisationKeyID);
            props.setIsAddUpdatePricingActionDone(true);
          }
        } else {
          setErrorMessage(response?.response?.data?.errorMessage);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // handle Function
  const handleClose = () => {
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
                Pricing Setting{" "}
              </h5>
              {/* Close Button Start */}
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="close-modal"
              >
                {/* Close Button End */}
              </button>
            </div>
            {/*Heading End */}
            {/*Modal body Start */}
            <div class="modal-body">
              <div>
                <div className="row">
                  {/* Left side */}
                  <div class="fieldset col-12 col-md-12 col-sm-12">
                    <div class="row fieldset">
                      <div class="fieldset  col-md-6 col-sm-12">
                        <label class="fieldset-label table-content-font ">
                          Min. One-Off Price for {proposalName}/{EngagementName}{" "}
                          (£)
                        </label>
                      </div>
                      <div class="col-lg-12 col-md-12 col-sm-12 fieldset">
                        <input
                          className="input-text table-content-font"
                          type="text"
                          placeholder="Enter Min. One-Off Price"
                          value={pricingSettingObj.minOneOffPriceForQC
                            ?.toString()
                            ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          onChange={(e) => {
                            SetPrevError(false);
                            // Ensure that the input only contains numeric characters
                            const sanitizedInput = e.target.value
                              .replace(/[^0-9.]/g, "") // Allow only numeric and dot characters
                              .slice(0, 16); // Limit to 7 characters (5 digits + 1 dot + 1 decimal)

                            // Split the input into integer and decimal parts
                            const [integerPart, decimalPart] =
                              sanitizedInput.split(".");

                            // Combine integer and decimal parts with appropriate precision
                            const formattedInput =
                              decimalPart !== undefined
                                ? `${integerPart.slice(
                                  0,
                                  12
                                )}.${decimalPart.slice(0, 2)}`
                                : `${integerPart.slice(0, 12)}`;

                            setRequireErrorMessage(false);
                            setPricingSettingObj({
                              ...pricingSettingObj,
                              minOneOffPriceForQC: formattedInput,
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div class="fieldset col-12 col-md-12 col-sm-12">
                    <label class="fieldset-label table-content-font PricingSetting-Proposal">
                      Min. Monthly Price for {proposalName}/{EngagementName} (£)
                    </label>
                  </div>

                  <div class="col-lg-12 col-md-12 col-sm-12 fieldset">
                    <input
                      class="input-text table-content-font"
                      type="text"
                      placeholder="Enter Min. Monthly Price"
                      value={pricingSettingObj.minMonthlyPriceForQC
                        ?.toString()
                        ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      onChange={(e) => {
                        SetPrevError(false);
                        // Ensure that the input only contains numeric and dot characters
                        const sanitizedInput = e.target.value
                          .replace(/[^0-9.]/g, "") // Allow only numeric and dot characters
                          .slice(0, 16); // Limit to 7 characters (5 digits + 1 dot + 1 decimal)

                        // Split the input into integer and decimal parts
                        const [integerPart, decimalPart] =
                          sanitizedInput.split(".");

                        // Combine integer and decimal parts with appropriate precision
                        const formattedInput =
                          decimalPart !== undefined
                            ? `${integerPart.slice(0, 12)}.${decimalPart.slice(
                              0,
                              2
                            )}`
                            : integerPart.slice(0, 12);

                        setRequireErrorMessage(false);
                        setPricingSettingObj({
                          ...pricingSettingObj,
                          minMonthlyPriceForQC: formattedInput,
                        });
                      }}
                    />
                  </div>

                  {/* Right side */}
                  <div class="fieldset col-12 col-md-12 col-sm-12">
                    <div class="row fieldset">
                      <div class="fieldset col-12">
                        <label class="fieldset-label table-content-font PricingSetting-Proposal">
                          Max. Discount (%) for {proposalName}/{EngagementName}
                        </label>
                      </div>
                      <div class="col-lg-12 fieldset">
                        <input
                          className="input-text table-content-font"
                          digitOnly={true}
                          type="text" // Use type="text" instead of type="number" to allow custom validation
                          pattern="\d{0,3}(\.\d{0,2})?" // Pattern to match the allowed format
                          placeholder="Enter Max. Discount (%)"
                          maxLength={6} // Allowing 3 digits before the decimal and 2 after
                          value={pricingSettingObj.maxDiscountForQC}
                          onChange={(e) => {
                            const inputValue = e.target.value.replace(
                              /[^0-9.]/g,
                              ""
                            );

                            // Validate if the input is a valid percentage
                            const isValidPercentage =
                              /^\d{0,3}(\.\d{0,2})?$/.test(inputValue) &&
                              inputValue <= 100;

                            // Update state only if the input is a valid percentage
                            if (isValidPercentage || inputValue === "") {
                              setPricingSettingObj({
                                ...pricingSettingObj,
                                maxDiscountForQC: inputValue,
                              });
                            } else {
                              // Handle the case when the input is not a valid percentage
                              // You can choose to clear the input or keep the previous value
                              // In this example, I'm keeping the previous value
                              setPricingSettingObj({
                                ...pricingSettingObj,
                                maxDiscountForQC:
                                  pricingSettingObj.maxDiscountForQC,
                              });
                            }
                          }}
                        />
                      </div>
                      <div class="col-lg-2 col-md-4 col-sm-12"></div>
                      <div class="col-lg-2 col-md-4 col-sm-12"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                {prevError && (
                  <label className="validation">
                    You haven't changed any value
                  </label>
                )}
              </div>
            </div>
            {/*Modal body End */}
            {/*Footer body button Start */}
            <div class="modal-footer">
              <div class="hstack gap-2 justify-content-end">
                <button
                  type="button"
                  class="btn btn-md btn-light"
                  data-bs-dismiss="modal"
                  onClick={() => SetPrevError(false)}
                >
                  <span>{getCrudButtonTextName("Cancel")}</span>
                </button>
                {/* 
                {
                  userAccessData.Setting_Admin_CanAdd &&
                  userAccessData.Setting_Admin_CanEdit && (
                    <>
                      <label className="validation">{errorMessage}</label> */}
                <button
                  className="btn btn-primary create-item-btn"
                  type="submit"
                  onClick={() => {
                    PricingSettingAddUpdateBtnClicked();
                  }}
                >
                  <span>Submit</span>
                </button>

                {/*  </> )
                  // </div>
                } */}
              </div>
            </div>
            {/*Footer body button End */}
          </div>
        </div>
        <SuccessModal
          handleClose={handleClose}
          setDismissModal={setDismissModal}
          setOpenSuccessModal={setOpenSuccessModal}
          openSuccessModal={openSuccessModal}
          modelAction={"Update"}
          message={"Pricing setting"}
        />
      </div>
    </div>
  );
}

export default PricingModel;
