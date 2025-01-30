/* global $ */
import React, { useEffect, useRef, useState } from "react";
import DropDown from "../../../components/DropDown";
import "../global-pricing-drivers/GlobalPricingDriversStyle.css";
import { GetProfessionTypeLookupList } from "../../../redux/Services/Master/ProfessionTypeApi";
import {
  DriverTypeList,
  SlabTypeList,
} from "../../../redux/Services/Config/GlobalPricingDriverApi";
import { useSelector } from "react-redux";
import SuccessModal from "../../../components/SuccessModal";
import { ERROR_MESSAGES } from "../../../components/GlobalMessage";

function GlobalPricingDriverModal(props) {
  //A] Declare State
  const modalRef = useRef(null);
  const [gdrivererror, setGdriverError] = useState(false);
  const [newVariation, setNewVariation] = useState([]);
  const [slabType, setSlabType] = useState([]);
  const [variations, setVariations] = useState([]);
  const [slabs, setSlabs] = useState([
    {
      SlabKeyID: null,
      slabTypeID: "",
      slabValue: "",
      slabFrom: "",
      slabTo: "",
      isDefault: true,
    },
  ]);
  const [errorMessage, setErrorMessage] = useState("");
  const [modelAction, setModelAction] = useState("");
  const [professionTypeLookupList, setProfessionTypeLookupList] = useState([]);
  const [driverType, setDriverType] = useState([]);
  const [driverTypeValue1, setDriverTypeValue1] = useState("");
  const [count, setCount] = useState(0);
  const [globalPricingDriverObj, setGlobalPricingDriverObj] = useState({
    globalPricingDriverKeyID: null,
    keyID: null,
    organisationID: null, //pass organisationID if UserRoleType=Admin, else send null
    CreatedByID: null,
    driverName: "",
    driverValue: null,
    driverTypeID: null,
    isPredefined: null,
    addedFor: null,
    professionTypeList: [],
    variation: variations,
    slab: slabs,
  });
  const [dismissModal, setDismissModal] = useState(null);
  const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
  const common = useSelector((state) => state.Storage);

  //B] Initial useEffect : Will call when Add/Update button click from list page
  useEffect(() => {
    setNewVariation(common.globalPricingDriver);
    setVariations(common.globalPricingDriver.variation);
    setSlabs(common.globalPricingDriver.slab);
    setModelAction(props.modelRequestData.Action === null ? "Add" : "Update"); //Do not change this naming convention
    GetProfessionTypeLookupListData();
    GetDriverTypeData();
    getSlabTypeData();
    if (props.modelRequestData.Action !== null) {
      GetServiceCategoryModelData(
        props.modelRequestData.globalPricingDriverKeyID
      );
    } else {
      SetInitialModelData();
    }
  }, [props.modelRequestData]);

  const AddSlab = () => {
    setCount(count + 1);
    const newSlabs = {
      slabTypeID: "",
      slabValue: "",
      slabFrom: "",
      slabTo: "",
      isDefault: true,
    };
    slabs.push(newSlabs);
  };
  // Handle Variation Change 
  const OnVariationChange = (index, field, value) => {
    // Clone the existing state array
    const updatedVariations = [...variations];

    // Clone the object at the specified index
    const updatedVariation = { ...updatedVariations[index] };

    // Update the specific field in the cloned object
    updatedVariation[field] = value;

    // Update the cloned object in the cloned array
    updatedVariations[index] = updatedVariation;

    // Set the updated state
    setVariations(updatedVariations);
  };

  // Handle Slab Change
  const OnSlabChange = (index, field, value) => {
    // Clone the existing state array
    const updatedSlabs = [...slabs];

    // Clone the object at the specified index
    const updatedSlab = { ...updatedSlabs[index] };

    // Update the specific field in the cloned object
    updatedSlab[field] = value;

    // Update the cloned object in the cloned array
    updatedSlabs[index] = updatedSlab;

    // Set the updated state
    setSlabs(updatedSlabs);
  };

  // Handle Variation change 
  function OnVariationsRadioChange(selectedIndex) {
    const updatedVariations = variations.map((variation, index) => ({
      ...variation,
      isDefault: index === selectedIndex, // Set the selected variation to true, others to false
    }));

    setVariations(updatedVariations);
    // Update your state or data with the updatedVariations array
    // For example, if you're using React state, set it with setState(updatedVariations);
  }
  // handle Change Slab Radio 
  function OnSlabsRadioChange(selectedIndex) {
    const updatedSlabs = slabs.map((slab, index) => ({
      ...slab,
      isDefault: index === selectedIndex, // Set the selected variation to true, others to false
    }));

    setSlabs(updatedSlabs);
    // Update your state or data with the updatedVariations array
    // For example, if you're using React state, set it with setState(updatedVariations);
  }

  // Add Slab 
  const OnAddSlab = (i) => {
    setCount(count + 1);
    const newSlabs = {
      SlabKeyID: null,
      slabTypeID: "",
      slabValue: "",
      slabFrom: "",
      slabTo: "",
      isDefault: slabs.length === 0 ? true : false,
    };
    if (
      slabs[slabs.length - 1].slabValue !== "" ||
      slabs[slabs.length - 1].slabFrom !== "" ||
      slabs[slabs.length - 1].slabTo !== ""
    ) {
      setGdriverError(false);
      slabs.push(newSlabs);
    } else if (
      slabs[slabs.length - 1].slabValue === "" ||
      slabs[slabs.length - 1].slabFrom === "" ||
      slabs[slabs.length - 1].slabTo === ""
    ) {
      setGdriverError(true);
    }
  };
  // Delete Slab
  const OnDeleteSlabs = (index) => {
    // First, create a copy of the slabs array to avoid modifying it directly
    const slabsCopy = [...slabs];
    // Check if the provided index is within the valid range
    if (index >= 0 && index < slabsCopy.length) {
      // Use splice to remove the element at the specified index
      slabsCopy.splice(index, 1);
      // Update the slabs state with the modified array
      setSlabs(slabsCopy);
    }
  };

  // Delete variations 
  const OnDeleteVariations = (index) => {
    setCount(count - 1);
    // First, create a copy of the slabs array to avoid modifying it directly
    const variationsCopy = [...variations];
    // Check if the provided index is within the valid range
    if (index >= 0 && index < variationsCopy.length) {
      // Use splice to remove the element at the specified index
      variationsCopy.splice(index, 1);

      // Update the slabs state with the modified array
      setVariations(variationsCopy);
    }
  };
  // Add Variations 
  const OnAddVariations = () => {
    setCount(count + 1);
    const newVariations = {
      VariationKeyID: null,
      variationName: "",
      variationValue: "",
      isDefault: variations.length === 0 ? true : false,
    };
    if (
      variations[variations.length - 1]?.variationName !== "" &&
      variations[variations.length - 1]?.variationValue !== ""
    ) {
      setGdriverError(false);
      variations.push(newVariations);
    } else if (
      variations[variations.length - 1]?.variationName === "" ||
      variations[variations.length - 1]?.variationValue === ""
    ) {
      setGdriverError(true);
    }
  };

  // D] Calling All Api's like Lookup List and other Here :
  // 1) On Change Select Profession Type
  const GetProfessionTypeLookupListData = async () => {
    try {
      const response = await GetProfessionTypeLookupList();
      if (response) {
        if (response?.data?.statusCode === 200) {
          if (response?.data?.responseData?.data) {
            const ProfessionTypeLookupListData =
              response?.data?.responseData?.data;
            setProfessionTypeLookupList(ProfessionTypeLookupListData);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  //2] On Change Select Driver Type
  const GetDriverTypeData = async () => {
    //Driver Type Api
    try {
      const response = await DriverTypeList();
      if (response) {
        const driverTypeData = response?.data?.responseData.data;
        setDriverType(driverTypeData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Driver Type Change 
  const OnDriverTypeChange = (DriverType) => {
    setGlobalPricingDriverObj({
      ...globalPricingDriverObj,
      driverTypeID: DriverType.value,
      slab: [
        {
          slabTypeID: "",
          slabValue: "",
          slabFrom: "",
          slabTo: "",
          isDefault: false,
        },
      ],
    });
    if (DriverType.value === 4) {
      setSlabs([]);
    }
    setDriverTypeValue1(DriverType);
  };

  let driverTypeValue;

  driverTypeValue = driverType?.map((DriverType) => ({
    value: DriverType.driverTypeId,
    label: DriverType.driverTypeName,
  }));

  //3] On Change Select Driver Type
  const getSlabTypeData = async () => {
    try {
      const response = await SlabTypeList();
      if (response) {
        const slabTypeData = response?.data?.responseData.data;
        setSlabType(slabTypeData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // F] Calling CRUD Api here
  // 1) Get Model Data Api
  const GetServiceCategoryModelData = async (id) => {
    if (!id) {
      return;
    }
    const ModelData = props.modelRequestData?.globalPricingDriver;
    const driverTypeValueNew = driverType?.filter(
      (DriverType) => DriverType?.driverTypeId === ModelData?.driverTypeID
    );
    const driverTypeConvert = driverTypeValueNew?.map((i) => ({
      value: i.driverTypeId,
      label: i.driverTypeName,
    }));
    setDriverTypeValue1(driverTypeConvert);
    setGlobalPricingDriverObj({
      ...globalPricingDriverObj,
      globalPricingDriverKeyID: ModelData?.globalPricingDriverKeyID,
      organisationKeyID: common.organisationKeyID,
      CreatedByID: common.userId,
      driverName: ModelData?.driverName,
      driverTypeID: ModelData?.driverTypeID,
      addedFor: null,
      professionTypeList: ModelData?.professionTypeList,

      isDefault: ModelData?.isDefault,
      keyID: ModelData?.globalPricingDriverKeyID,
    });
    driverTypeValue = driverType?.map((DriverType) => ({
      value: DriverType.driverTypeId,
      label: DriverType.driverTypeName,
    }));
    let variation = [
      { variationName: "", variationValue: "", isDefault: false },
    ];
    if (ModelData?.driverTypeID === 3) {
      variation = ModelData?.variation;
    }
    setVariations(variation);
    setSlabs(ModelData?.slab);
    professionTypeValue = globalPricingDriverObj.professionTypeList?.map(
      (item) => ({
        value: item.professionTypeId,
        label: item.professionTypeName,
      })
    );
  };

  // 2) Add Update Button Click Function
  const GlobalPricingDriverAddUpdateBtnClicked = async () => {
    const updatedGlobalPricingDrivers = [...props.globalPricingDriver];

    // Update the variation array in the first element
    const VariationSet = {
      globalPricingDriverID: null,
      driverValue: null,
      driverTypeID: common.globalPricingDriver.driverTypeID,
      variation: variations,
      slab: slabs,
      globalPricingDriverKeyID:
        common.globalPricingDriver.globalPricingDriverKeyID,
      driverName: common.globalPricingDriver.driverName,
      isPredefined: null,
      addedFor: null,
      organisationKeyID: null,
      status: null,
      statusName: null,
      userKeyID: null,
      createdBy: null,
      createdOn: null,
      lastUpdatedBy: null,
      lastUpdatedOn: null,
      keyID: null,
      createdByID: null,
      organisationID: null,
      isUpdated: true,
    };
    updatedGlobalPricingDrivers[props.modelRequestData.index] = {
      ...VariationSet,
    };
    props.setGlobalPricingDrivers(updatedGlobalPricingDrivers);
    $("#" + props.id).modal("hide");
    // Set the updated state
  };

  // Handle Close 
  const handleClose = () => {
    $("#" + props.id).modal("hide");
    setOpenSuccessModal(false);
  };

  //Design part :
  return (
    <div
      class={props.class}
      id={props.id}
      ref={modalRef}
      tabIndex={props.tabIndex}
      aria-labelledby={props.aria_labelledby}
      aria-hidden={props.aria_hidden}
    >
      <div class="modal-dialog modal-md modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-light p-3">
            <h5 class="modal-title" id="exampleModalLabel">
              {modelAction === "Add"
                ? "Add Global Pricing Driver"
                : "Edit Global Pricing Driver"}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close-modal"
              onClick={SetInitialModelData}
            ></button>
          </div>
          <div class="modal-body">
            <div class="tab-content">
              <div className="row">
                <div className="col-lg-6">
                  <div className="mb-3 ">
                    <label className="form-label">
                      Driver Name <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="input-text"
                        placeholder="Enter Driver Name"
                        value={globalPricingDriverObj.driverName}
                        disabled={props.disable}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          const trimmedValue = inputValue.replace(/^\s+/g, ""); // Remove leading spaces
                          const capitalizedValue =
                            trimmedValue.charAt(0).toUpperCase() +
                            trimmedValue.slice(1);
                          setGlobalPricingDriverObj({
                            ...globalPricingDriverObj,
                            driverName: capitalizedValue,
                          });
                        }}
                        maxLength={50}
                      />
                    </div>
                    {gdrivererror &&
                      globalPricingDriverObj.driverName === "" ? (
                      <label className="validation">{ERROR_MESSAGES}</label>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="mb-3 ">
                    <label className="form-label">
                      Driver Type <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <DropDown
                        className="phone-input-country-code selectDropDown Drop-down-width driver-type-cls"
                        options={driverTypeValue}
                        value={driverTypeValue1}
                        onChange={OnDriverTypeChange}
                        placeholder="Select..."
                        disabled={props.disable}
                      />
                    </div>
                    {gdrivererror && driverTypeValue1.length === 0 ? (
                      <label className="validation">{ERROR_MESSAGES}</label>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
              {/* <!-- end tab row --> */}
              {/* <!-- Start tab row --> */}

              {newVariation.driverTypeID === 3 && (
                <div class="row">
                  <div class="col-xl-12 col-lg-12 mt-2">
                    {variations?.map((i, index) => {
                      return (
                        <div
                          class="card-1 pricing-box p-4 m-3 mt-0"
                          key={index}
                        >
                          <div class="col-lg-6 col-md-6">
                            <p
                              class="office-name font-weight"
                              style={{ width: "auto", zIndex: "0" }}
                            >
                              Variation {index + 1}
                            </p>
                          </div>
                          <p
                            class="delete delete-margin "
                            style={{ marginBottom: "0", width: "auto" }}
                          >
                            <button
                              disabled={props.disable}
                              onClick={() => OnDeleteVariations(index)}
                              class="btn btn-sm btn-danger remove-item-btn d-flex gap-1"
                            >
                              <i class="ri-delete-bin-5-fill"></i>
                              <p className="delete-margin">Delete Variation</p>
                            </button>
                          </p>
                          <div class="row mt-1">
                            <div className="col-lg-6">
                              <div className="mb-3 ">
                                <label className="form-label">
                                  Variation Name{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <div className="input-group">
                                  <input
                                    type="text"
                                    className="form-control placeholderStyle"
                                    placeholder="Enter Variation Name"
                                    value={
                                      variations[index]
                                        ? variations[index].variationName
                                        : ""
                                    }
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      const trimmedValue = inputValue.replace(
                                        /^\s+/g,
                                        ""
                                      ); // Remove leading spaces
                                      const capitalizedValue =
                                        trimmedValue.charAt(0).toUpperCase() +
                                        trimmedValue.slice(1);
                                      OnVariationChange(
                                        index,
                                        "variationName",
                                        capitalizedValue
                                      );
                                    }}
                                    maxLength={50}
                                    disabled={props.disable}
                                  />
                                </div>
                                {gdrivererror &&
                                  variations[index].variationName === "" ? (
                                  <label className="validation">
                                    {ERROR_MESSAGES}
                                  </label>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>

                            <div className="col-lg-6">
                              <div className="mb-3 ">
                                <label className="form-label">
                                  Variation Value{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <div className="input-group">
                                  <input
                                    type="number"
                                    className="form-control placeholderStyle"
                                    placeholder="Enter Variation Value"
                                    maxLength={5}
                                    defaultValue={0}
                                    value={
                                      variations[index].variationValue === ""
                                        ? 0
                                        : variations[index].variationValue
                                    }
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      const sanitizedValue = inputValue.replace(
                                        /^0+/,
                                        ""
                                      );
                                      const wholeNumberValue =
                                        sanitizedValue.split(".")[0];
                                      const isNegative =
                                        sanitizedValue.startsWith("-");
                                      if (
                                        !isNegative &&
                                        sanitizedValue.length <= 5
                                      ) {
                                        OnVariationChange(
                                          index,
                                          "variationValue",
                                          wholeNumberValue
                                        );
                                      }
                                    }}
                                  />
                                </div>
                                {gdrivererror &&
                                  variations[index].variationValue === "" ? (
                                  <label className="validation">
                                    {ERROR_MESSAGES}
                                  </label>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>

                            <div
                              className="col-lg-12 col-12"
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              {" "}
                              <input
                                style={{ marginRight: "1rem" }}
                                type="radio"
                                id={`variation${index}`}
                                name="variations"
                                disabled={props.disable}
                                checked={variations[index].isDefault}
                                // onChange={(e) => OnVariationChange(index, 'isDefault', true)}
                                onChange={(e) => OnVariationsRadioChange(index)}
                              />
                              <label
                                className="toggle"
                                name="variations"
                                style={{ cursor: "pointer" }}
                                htmlFor={`variation${index}`}
                              >
                                Set to Default
                              </label>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {gdrivererror && variations.length === 0 ? (
                      <label className="col-lg-12 col-12 variation-validation">
                        At least 1 Variation is required.
                      </label>
                    ) : (
                      ""
                    )}
                    <p class="delete-right" style={{ marginBottom: "0" }}>
                      <button
                        onClick={OnAddVariations}
                        class="btn btn-md btn-success create-item-btn d-flex gap-1"
                      >
                        <i class="bi bi-plus-circle"></i>
                        <span>Add Variation</span>
                      </button>
                    </p>
                  </div>
                </div>
              )}

              {/* <!-- end tab row --> */}
              {globalPricingDriverObj.driverTypeID == 4 && (
                <div class="row">
                  <div class="col-xl-12 col-lg-12">
                    {gdrivererror && slabs.length === 0 ? (
                      <label className="col-lg-12 col-12 variation-validation">
                        At least 1 Slab Based is required.
                      </label>
                    ) : (
                      ""
                    )}
                    {slabs.length === 0 && (
                      <p class="delete-right" style={{ marginBottom: "0" }}>
                        <button
                          onClick={AddSlab}
                          class="btn btn-md btn-success create-item-btn d-flex gap-1"
                        >
                          <i class="bi bi-plus-circle"></i>
                          <span>Add Slab</span>
                        </button>
                      </p>
                    )}
                    {slabs?.map((i, index) => {
                      return (
                        <div
                          class="card-1 pricing-box p-4 m-3 mt-0"
                          key={index}
                        >
                          <div class="col-lg-6 col-md-6">
                            <p
                              class="office-name font-weight"
                              style={{ width: "auto", zIndex: "0" }}
                            >
                              Slab{index + 1}
                            </p>
                          </div>

                          <p
                            class="delete delete-margin "
                            style={{ marginBottom: "0", width: "auto" }}
                          >
                            <button
                              disabled={props.disable}
                              onClick={() => OnDeleteSlabs(index)}
                              class="btn btn-sm btn-danger remove-item-btn d-flex gap-1"
                            >
                              <i class="ri-delete-bin-5-fill"></i>
                              <p className="delete-margin">Delete Slab</p>
                            </button>
                          </p>
                          <div class="row mt-1">
                            <div className="col-lg-6">
                              <div className="mb-3 ">
                                <label className="form-label">
                                  Slab Type{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <div className="input-group">
                                  <select
                                    disabled={props.disable}
                                    onChange={(e) =>
                                      OnSlabChange(
                                        index,
                                        "slabTypeID",
                                        e.target.value
                                      )
                                    }
                                    className="form-select placeholderStyle"
                                  >
                                    <option value="" class="input-text">
                                      Select...
                                    </option>
                                    {slabType.map((i) => {
                                      return (
                                        <>
                                          <option
                                            class="input-text"
                                            selected={
                                              i.slabTypeId ===
                                              slabs[index].slabTypeID
                                            }
                                            value={i.slabTypeId}
                                          >
                                            {i.slabTypeName}
                                          </option>
                                        </>
                                      );
                                    })}
                                  </select>
                                </div>
                                {gdrivererror &&
                                  slabs[index].slabTypeID === "" ? (
                                  <label className="validation">
                                    {ERROR_MESSAGES}
                                  </label>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                            {slabs && slabs[index]?.slabTypeID == "1" && (
                              <>
                                <div className="col-lg-6">
                                  <div className="mb-3 ">
                                    <label className="form-label">
                                      Value{" "}
                                      <span className="text-danger">*</span>
                                    </label>
                                    <div className="input-group">
                                      <input
                                        type="number"
                                        className="form-control placeholderStyle"
                                        placeholder="Value"
                                        value={
                                          slabs[index].slabValue === ""
                                            ? 0
                                            : slabs[index].slabValue
                                        }
                                        onChange={(e) => {
                                          const inputValue = e.target.value;
                                          const sanitizedValue =
                                            inputValue.replace(/^0+/, "");
                                          const wholeNumberValue =
                                            sanitizedValue.split(".")[0];
                                          const isNegative =
                                            sanitizedValue.startsWith("-");
                                          if (
                                            !isNegative &&
                                            sanitizedValue.length <= 5
                                          ) {
                                            OnSlabChange(
                                              index,
                                              "slabValue",
                                              wholeNumberValue
                                            );
                                          }
                                        }}
                                      />
                                    </div>
                                    <div className="invalid-feedback">
                                      Please enter Slab Value
                                    </div>
                                    {gdrivererror &&
                                      slabs[index].slabValue === "" ? (
                                      <label className="validation">
                                        {ERROR_MESSAGES}
                                      </label>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>

                                <div className="col-lg-6">
                                  <div className="mb-3 ">
                                    <label
                                      htmlFor="useremail"
                                      className="form-label"
                                    >
                                      From{" "}
                                      <span className="text-danger">*</span>
                                    </label>
                                    <div className="input-group">
                                      <input
                                        type="number"
                                        className="form-control placeholderStyle"
                                        placeholder="From"
                                        disabled={props.disable}
                                        value={
                                          slabs[index].slabFrom === ""
                                            ? 0
                                            : slabs[index].slabFrom
                                        }
                                        // onChange={(e) => OnSlabChange(index, 'slabFrom', e.target.value)}
                                        onChange={(e) => {
                                          const inputValue = e.target.value;
                                          // if (inputValue.length <= 5) {
                                          //   OnSlabChange(index, 'slabFrom', inputValue);
                                          // }
                                          const sanitizedValue =
                                            inputValue.replace(/^0+/, "");
                                          if (sanitizedValue.length <= 5) {
                                            OnSlabChange(
                                              index,
                                              "slabFrom",
                                              sanitizedValue
                                            );
                                          }
                                        }}
                                      />
                                    </div>
                                    <div className="invalid-feedback">
                                      Please enter Slab Value
                                    </div>
                                    {gdrivererror &&
                                      slabs[index].slabFrom === "" ? (
                                      <label className="validation">
                                        {ERROR_MESSAGES}
                                      </label>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="mb-3 ">
                                    <label className="form-label">
                                      To <span className="text-danger">*</span>
                                    </label>
                                    <div className="input-group">
                                      <input
                                        type="number"
                                        className="form-control placeholderStyle"
                                        disabled={props.disable}
                                        placeholder="Increment Slab By"
                                        value={
                                          slabs[index].slabTo === ""
                                            ? 0
                                            : slabs[index].slabTo
                                        }
                                        // onChange={(e) => OnSlabChange(index, 'slabTo', e.target.value)}
                                        onChange={(e) => {
                                          const inputValue = e.target.value;
                                          // if (inputValue.length <= 5) {
                                          //   OnSlabChange(index, 'slabTo', inputValue);
                                          // }
                                          const sanitizedValue =
                                            inputValue.replace(/^0+/, "");
                                          if (sanitizedValue.length <= 5) {
                                            OnSlabChange(
                                              index,
                                              "slabTo",
                                              sanitizedValue
                                            );
                                          }
                                        }}
                                      />
                                    </div>
                                    <div className="invalid-feedback">
                                      Please enter Slab Value
                                    </div>
                                    {gdrivererror &&
                                      parseFloat(slabs[index].slabTo) <=
                                      parseFloat(slabs[index].slabFrom) ? (
                                      <label className="validation">
                                        The field must not be less than{" "}
                                        {slabs[index].slabFrom}.
                                      </label>
                                    ) : (
                                      ""
                                    )}
                                    {gdrivererror &&
                                      slabs[index].slabTo === "" ? (
                                      <label className="validation">
                                        {ERROR_MESSAGES}
                                      </label>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>
                                <div
                                  className="col-lg-12 col-12"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {" "}
                                  <input
                                    style={{ marginRight: "1rem" }}
                                    type="radio"
                                    id={`slab block${index}`}
                                    disabled={props.disable}
                                    checked={slabs[index].isDefault}
                                    name="slabs"
                                    onChange={(e) => OnSlabsRadioChange(index)}
                                  />
                                  <label
                                    className="toggle"
                                    name="slabs"
                                    style={{ cursor: "pointer" }}
                                    htmlFor={`slab block${index}`}
                                  >
                                    Set to Default
                                  </label>
                                </div>
                              </>
                            )}

                            {slabs && slabs[index]?.slabTypeID == "2" && (
                              <>
                                <div className="col-lg-6">
                                  <div className="mb-3 ">
                                    <label
                                      htmlFor="useremail"
                                      className="form-label"
                                    >
                                      Increment Value By{" "}
                                      <span className="text-danger">*</span>
                                    </label>
                                    <div className="input-group">
                                      <input
                                        type="number"
                                        className="form-control placeholderStyle"
                                        placeholder="Increment Value By"
                                        value={
                                          slabs[index].slabValue === ""
                                            ? 0
                                            : slabs[index].slabValue
                                        }
                                        onChange={(e) => {
                                          const inputValue = e.target.value;

                                          const sanitizedValue =
                                            inputValue.replace(/^0+/, "");
                                          if (sanitizedValue.length <= 5) {
                                            OnSlabChange(
                                              index,
                                              "slabValue",
                                              sanitizedValue
                                            );
                                          }
                                        }}
                                      />
                                    </div>
                                    <div className="invalid-feedback">
                                      Please enter Slab Value
                                    </div>
                                    {gdrivererror &&
                                      slabs[index].slabValue === "" ? (
                                      <label className="validation">
                                        {ERROR_MESSAGES}
                                      </label>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>

                                <div className="col-lg-6">
                                  <div className="mb-3 ">
                                    <label className="form-label">
                                      From{" "}
                                      <span className="text-danger">*</span>
                                    </label>
                                    <div className="input-group">
                                      <input
                                        type="number"
                                        className="form-control placeholderStyle"
                                        placeholder="From"
                                        disabled={props.disable}
                                        value={
                                          slabs[index].slabFrom === ""
                                            ? 0
                                            : slabs[index].slabFrom
                                        }
                                        onChange={(e) => {
                                          const inputValue = e.target.value;

                                          const sanitizedValue =
                                            inputValue.replace(/^0+/, "");
                                          if (sanitizedValue.length <= 5) {
                                            OnSlabChange(
                                              index,
                                              "slabFrom",
                                              sanitizedValue
                                            );
                                          }
                                        }}
                                      />
                                    </div>

                                    {gdrivererror &&
                                      slabs[index].slabFrom === "" ? (
                                      <label className="validation">
                                        {ERROR_MESSAGES}
                                      </label>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="mb-3 ">
                                    <label
                                      htmlFor="useremail"
                                      className="form-label"
                                    >
                                      Increment Slab By{" "}
                                      <span className="text-danger">*</span>
                                    </label>
                                    <div className="input-group">
                                      <input
                                        type="number"
                                        className="form-control placeholderStyle"
                                        placeholder="Increment Slab By"
                                        disabled={props.disable}
                                        value={
                                          slabs[index].slabTo === ""
                                            ? 0
                                            : slabs[index].slabTo
                                        }
                                        // onChange={(e) => OnSlabChange(index, 'slabTo', e.target.value)}
                                        onChange={(e) => {
                                          const inputValue = e.target.value;
                                          // if (inputValue.length <= 5) {
                                          //   OnSlabChange(index, 'slabTo', inputValue);
                                          // }
                                          const sanitizedValue =
                                            inputValue.replace(/^0+/, "");
                                          if (sanitizedValue.length <= 5) {
                                            OnSlabChange(
                                              index,
                                              "slabTo",
                                              sanitizedValue
                                            );
                                          }
                                        }}
                                      />
                                    </div>
                                    {gdrivererror &&
                                      slabs[index].slabTo === "" ? (
                                      <label className="validation">
                                        {ERROR_MESSAGES}
                                      </label>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>
                                <div
                                  className="col-lg-12 col-12"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {" "}
                                  <input
                                    style={{ marginRight: "1rem" }}
                                    type="radio"
                                    id={`incremental slab${index}`}
                                    disabled={props.disable}
                                    defaultChecked
                                    checked={slabs[index].isDefault}
                                    name="slabs"
                                    onChange={(e) => OnSlabsRadioChange(index)}
                                  />
                                  <label
                                    className="toggle"
                                    name="slabs"
                                    style={{ cursor: "pointer" }}
                                    htmlFor={`incremental slab${index}`}
                                  >
                                    Set to Default
                                  </label>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {slabs && slabs[slabs.length - 1]?.slabTypeID == "1" && (
                      <p class="delete-right" style={{ marginBottom: "0" }}>
                        <button
                          onClick={OnAddSlab}
                          class="btn btn-sm btn-primary create-item-btn d-flex gap-1"
                        >
                          <i class="bi bi-plus-circle"></i>
                          <p className="delete-margin">Add Slab</p>
                        </button>
                      </p>
                    )}
                  </div>
                </div>
              )}
              <label
                className="validation"
                style={{
                  fontSize: "15px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {errorMessage === "Driver Name Already Exists" &&
                  `Global Pricing Driver with name ${globalPricingDriverObj.driverName} already exists!`}
              </label>
              {/* <!-- end tab row --> */}
            </div>
          </div>
          <div class="modal-footer">
            <div class="hstack gap-2 justify-content-end">
              <button
                type="button"
                class="btn btn-md btn-light"
                data-bs-dismiss="modal"
                onClick={SetInitialModelData}
              >
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                class="btn btn-md btn-success create-item-btn"
                disabled={props.addCategoryLoader}
                onClick={() => GlobalPricingDriverAddUpdateBtnClicked()}
              >
                <span>
                  {modelAction === "Add" ? "Add Global Pricing Driver" : "Save"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <SuccessModal
        handleClose={handleClose}
        setDismissModal={setDismissModal}
        setOpenSuccessModal={setOpenSuccessModal}
        openSuccessModal={openSuccessModal}
        modelAction={modelAction}
        message={
          "The global pricing driver " + globalPricingDriverObj.driverName
        }
      />
    </div>
  );
}

export default GlobalPricingDriverModal;
