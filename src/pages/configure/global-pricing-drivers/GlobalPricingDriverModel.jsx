/* global $ */
import React, { useContext, useEffect, useRef, useState } from "react";
import DropDown from "../../../components/DropDown";
import "./GlobalPricingDriversStyle.css";
import { GetProfessionTypeLookupList } from "../../../redux/Services/Master/ProfessionTypeApi";
import Select from "react-select";
import {
  AddUpdateGlobalPricingDriver,
  DriverTypeList,
  GetGlobalPricingDriverModel,
  GetPricingDriverUsedInModules,
  SlabTypeList,
} from "../../../redux/Services/Config/GlobalPricingDriverApi";
import { useSelector } from "react-redux";
import { USER_ROLE_TYPE } from "../../../Middleware/enums";
import SuccessModal from "../../../components/SuccessModal";
import { ERROR_MESSAGES } from "../../../components/GlobalMessage";
import { AuthContextProvider } from "../../../AuthContext/AuthContext";
import ErrorModel from "../../../components/ErrorModel";
import RecordsAvailablePopupModel from "../../../components/RecordsAvailablePopupModel";
import DeleteDriverModal from "../../../components/DeleteDriverModel";
import { NotifySuperAdminPredefinedChangesToAdmin } from "../../../redux/Services/Setting/NotificationApi";
import { DeclineSuperAdminChanges } from "../../../redux/Services/Config/ServiceCategoryApi";
import AcceptSuperAdminChangesConfirmation from "../../../components/AcceptSuperAdminChangesConfirmation";
import SAPredefinedChangesNotifyMessageModel from "../../../components/SAPredefinedChangesNotifyMessageModel";
function Modal(props) {
  //A] Declare State
  const moduleName = "Global Pricing Driver";
  const modalRef = useRef(null);
  const [Status, setStatus] = React.useState(false);
  const [gdrivererror, setGdriverError] = useState(false);
  const [openDeleteDriverModel, setOpenDeleteDriverModel] = useState(false);
  const [slabError, setSlabError] = useState({
    slab: false,
    slabType: false,
    slabValue: false,
  });
  const [modelRequestData, setModelRequestData] = useState({
    Action: null,
    message: "",
    ServiceName: [],
    name: null,
  });
  const [modelRequestDataForDeleteDriver, setModelRequestDataForDeleteDriver] =
    useState({
      Action: null,
      message: "",
      ServiceName: [],
      name: null,
    });
  const [variationError, setVariationError] = useState({
    variation: false,
    variationName: false,
    variationValue: false,
  });
  const [errorMessageTitle, setErrorMessageTitle] = useState("");
  const [slabType, setSlabType] = useState([]);
  const [variations, setVariations] = useState([
    {
      variationKeyID: null,
      variationID: "",
      variationName: "",
      variationValue: "",
      canDelete: true,
      isDefault: true,
    },
  ]);
  const [slabs, setSlabs] = useState([
    {
      slabKeyID: null,
      slabTypeID: "",
      slabValue: "",
      slabFrom: 0,
      slabTo: 0,
      isDefault: true,
    },
  ]);
  const [errorMessage, setErrorMessage] = useState("");
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [modelAction, setModelAction] = useState("");
  const [professionTypeLookupList, setProfessionTypeLookupList] = useState([]);
  const [driverType, setDriverType] = useState([]);
  const [driverTypeValue1, setDriverTypeValue1] = useState("");
  const [count, setCount] = useState(0);
  const [isCheck, setIsCheck] = useState(false);
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
  const {
    setLoader,
    getCrudButtonTextName,
    getCrudPopUpTitleName,
    problematicInputRef,
    scrollUpDownByElementID,
  } = useContext(AuthContextProvider);

  //B] Initial useEffect : Will call when Add/Update button click from list page
  useEffect(() => {
    setModelAction(props.modelRequestData.Action === null ? "Add" : "Update"); //Do not change this naming convention
    GetProfessionTypeLookupListData();
    GetDriverTypeData();
    getSlabTypeData();
    if (
      props.modelRequestData.Action !== undefined &&
      props.modelRequestData.Action !== null
    ) {
      GetServiceCategoryModelData(
        props.modelRequestData.globalPricingDriverKeyID, props.modelRequestData.Type
      );
    } else {
      SetInitialModelData();
    }
  }, [props.modelRequestData]);

  // C] This function will clear all data from popup model
  const SetInitialModelData = () => {
    setGlobalPricingDriverObj({
      ...globalPricingDriverObj,
      globalPricingDriverKeyID: null,
      keyID: null,
      organisationID: null, //pass organisationID if UserRoleType=Admin, else send null
      CreatedByID: null,
      driverName: "",
      driverValue: null,
      driverTypeID: "",
      isPredefined: null,
      addedFor: null,
      professionTypeList: [],
      slab: [
        {
          slabTypeID: "",
          slabValue: "",
          slabFrom: 0,
          slabTo: 0,
          isDefault: true,
        },
      ],
    });
    setDriverTypeValue1("");
    setVariations([]);
    setErrorMessage("");
    setGdriverError(false);
    setVariationError({
      variation: false,
      variationValue: false,
    });
    setSlabError({
      slab: false,
      slabType: false,
      slabValue: false,
    });
  };

  const AddSlab = () => {
    setCount(count + 1);
    const newSlabs = {
      slabTypeID: "",
      slabValue: "",
      slabFrom: 0,
      slabTo: 0,
      isDefault: true,
    };
    slabs.push(newSlabs);
  };

  const OnVariationChange = (index, field, value) => {
    const updatedVariations = [...variations];
    updatedVariations[index][field] = value;
    setVariations(updatedVariations);
    // Check if the current name is the same as the previous name
    if (
      index > 0 &&
      updatedVariations[index - 1][field] === updatedVariations[index][field]
    ) {
    } else {
      setErrorMessage(null);
    }
  };

  //onchange For Change the Slab
  const OnSlabChange = (index, field, value) => {
    let updatedSlabs = [...slabs];
    updatedSlabs[index][field] = value;
    if (value == 2) {
      updatedSlabs[index][field] = value;
      updatedSlabs.splice(index + 1);
    }
    setSlabs(updatedSlabs);
    const slabTypeFilter = slabType.find(
      (item) => item.slabTypeId === slabs[index].slabTypeID
    );

  };

  function OnVariationsRadioChange(selectedIndex) {
    setErrorMessage("");
    const updatedVariations = variations.map((variation, index) => ({
      ...variation,
      isDefault: index === selectedIndex, // Set the selected variation to true, others to false
    }));

    setVariations(updatedVariations);
    // Update your state or data with the updatedVariations array
    // For example, if you're using React state, set it with setState(updatedVariations);
  }

  function OnSlabsRadioChange(selectedIndex) {
    setErrorMessage("");
    const updatedSlabs = slabs.map((slab, index) => ({
      ...slab,
      isDefault: index === selectedIndex, // Set the selected variation to true, others to false
    }));

    setSlabs(updatedSlabs);
    // Update your state or data with the updatedVariations array
    // For example, if you're using React state, set it with setState(updatedVariations);
  }

  //Add Slab 
  const OnAddSlab = (i) => {
    setCount(count + 1);
    var fromValueForNewSlab = Number(slabs[slabs.length - 1].slabTo) + 0.01;
    fromValueForNewSlab = Math.round(fromValueForNewSlab * 100) / 100;
    const newSlabs = {
      slabKeyID: null,
      slabTypeID: "",
      slabValue: "",
      slabFrom: fromValueForNewSlab, //Number(slabs[slabs.length - 1].slabTo) + 0.01,
      slabTo: "",
      isDefault: slabs.length === 0 ? true : false,
    };

    if (
      slabs[slabs.length - 1].slabValue === "" ||
      slabs[slabs.length - 1].slabFrom === "" ||
      slabs[slabs.length - 1].slabTo === "" ||
      parseFloat(slabs[slabs.length - 1].slabTo) <
      parseFloat(slabs[slabs.length - 1].slabFrom)
    ) {
      setSlabError({ slabValue: true });
    } else {
      setSlabError({ slab: false, slabType: false, slabValue: false });

      slabs.push(newSlabs);
      setTimeout(function () {
        scrollUpDownByElementID(`Slab_Div_${slabs.length - 1}`);
      }, 200);
    }
  };

  //delete Slab 
  const OnDeleteSlabs = async (index) => {
    // First, create a copy of the slabs array to avoid modifying it directly
    const slabsCopy = [...slabs];
    if (slabsCopy[index].slabKeyID !== null) {
      setLoader(true);
      const pricingDriverDelete = await GetPricingDriverUsedInModules(
        globalPricingDriverObj.globalPricingDriverKeyID,
        common.userKeyID,
        null,
        null,
        slabsCopy[index].slabKeyID
      );
      setLoader(false);
      if (pricingDriverDelete?.data?.statusCode === 200) {
        setLoader(false);
        let moduleList = pricingDriverDelete.data.responseData.moduleList;
        if (moduleList.length > 0) {
          // moduleList.map()
          setModelRequestDataForDeleteDriver({
            ...modelRequestDataForDeleteDriver,
            Action: "PricingDriverDelete",
            message: `Cannot delete slab already exist in following`,
            ServiceName: moduleList,
          });
          $("#" + "DeleteDriverModel").modal("show");
        } else {
          setLoader(false);
          // Check if the provided index is within the valid range
          if (index >= 0 && index < slabsCopy.length) {
            // Use splice to remove the element at the specified index
            slabsCopy.splice(index, 1);

            // Update the slabTo for the remaining elements based on the previous element's slabTo
            for (let i = 1; i < slabsCopy.length; i++) {
              var fromValueForNewSlab = Number(slabsCopy[i - 1].slabTo) + 0.01;
              fromValueForNewSlab = Math.round(fromValueForNewSlab * 100) / 100;
              slabsCopy[i].slabFrom = fromValueForNewSlab; //Number(slabsCopy[i - 1].slabTo) + 0.01;
            }

            // If there are remaining elements, update isDefault to true for the new first element
            if (slabsCopy.length > 0) {
              slabsCopy[0].isDefault = true;
            }

            // Update the slabs state with the modified array
            setSlabs(slabsCopy);
          }
        }
      }
    } else {
      // Check if the provided index is within the valid range
      if (index >= 0 && index < slabsCopy.length) {
        // Use splice to remove the element at the specified index
        slabsCopy.splice(index, 1);

        // Update the slabTo for the remaining elements based on the previous element's slabTo
        for (let i = 1; i < slabsCopy.length; i++) {
          var fromValueForNewSlab = Number(slabsCopy[i - 1].slabTo) + 0.01;
          fromValueForNewSlab = Math.round(fromValueForNewSlab * 100) / 100;
          slabsCopy[i].slabFrom = fromValueForNewSlab; //Number(slabsCopy[i - 1].slabTo) + 0.01;
        }

        // If there are remaining elements, update isDefault to true for the new first element
        if (slabsCopy.length > 0) {
          slabsCopy[0].isDefault = true;
        }

        // Update the slabs state with the modified array
        setSlabs(slabsCopy);
      }
    }
  };

  //Delete Variations 
  const OnDeleteVariations = async (index) => {

    const variationsCopy = [...variations];
    if (variationsCopy[index].variationKeyID !== null) {
      setLoader(true);
      const pricingDriverDelete = await GetPricingDriverUsedInModules(
        globalPricingDriverObj.globalPricingDriverKeyID,
        common.userKeyID,
        null,
        variationsCopy[index].variationKeyID,
        null
      );
      setLoader(false);
      if (pricingDriverDelete?.data?.statusCode === 200) {
        setLoader(false);
        let moduleList = pricingDriverDelete?.data?.responseData?.moduleList;
        if (moduleList.length > 0) {
          // moduleList.map()
          setModelRequestDataForDeleteDriver({
            ...modelRequestDataForDeleteDriver,
            Action: "PricingDriverDelete",
            message: `Cannot delete variation already exist in following`,
            ServiceName: moduleList,
          });
          $("#" + "DeleteDriverModel").modal("show");
        } else {
          setLoader(false);
          setCount(count - 1);
          // First, create a copy of the variations array to avoid modifying it directly

          // Check if the provided index is within the valid range
          if (index >= 0 && index < variationsCopy.length) {
            // Use splice to remove the element at the specified index
            variationsCopy.splice(index, 1);
            // Set isDefault to true for the first element in the modified array
            if (variationsCopy.length > 0) {
              variationsCopy[0].isDefault = true;
            }
            // Update the variations state with the modified array
            setVariations(variationsCopy);
          }
        }
        // Check if the provided index is within the valid range
      }
    } else {
      setCount(count - 1);
      // First, create a copy of the variations array to avoid modifying it directly
      const variationsCopy = [...variations];
      // Check if the provided index is within the valid range
      if (index >= 0 && index < variationsCopy.length) {
        // Use splice to remove the element at the specified index
        variationsCopy.splice(index, 1);
        // Set isDefault to true for the first element in the modified array
        if (variationsCopy.length > 0) {
          variationsCopy[0].isDefault = true;
        }
        // Update the variations state with the modified array
        setVariations(variationsCopy);
      }
      // Check if the provided index is within the valid range
    }
  };

  // Add Variation 
  const OnAddVariations = () => {
    setErrorMessage("");
    setCount(count + 1);
    const newVariations = {
      variationKeyID: null,
      variationName: "",
      variationValue: "",
      isDefault: variations.length === 0 ? true : false,
    };
    if (
      variations[variations.length - 1]?.variationName !== "" &&
      variations[variations.length - 1]?.variationValue !== ""
    ) {
      setVariationError({ variationValue: false });
      variations.push(newVariations);
    } else if (
      variations[variations.length - 1]?.variationName === "" ||
      variations[variations.length - 1]?.variationValue === ""
    ) {
      setVariationError({ variationValue: true });
    }
    setTimeout(function () {
      scrollUpDownByElementID(`Variation_Div_${variations.length - 1}`);
    }, 200);
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

  const ProfessionalTypeLookeupListOptions = professionTypeLookupList.map(
    (ptype) => ({
      value: ptype.professionTypeId,
      label: ptype.professionTypeName,
    })
  );
  // Select Profession type
  const OnChangeSelectProfessionType = (ptype) => {
    const updatedPfList = ptype.map((option) => ({
      professionTypeId: option.value,
      professionTypeName: option.label,
    }));
    setErrorMessage("");
    setGlobalPricingDriverObj({
      ...globalPricingDriverObj,
      professionTypeList: updatedPfList,
    });
  };

  let professionTypeValue;

  professionTypeValue = globalPricingDriverObj.professionTypeList?.map(
    (item) => ({
      value: item.professionTypeId,
      label: item.professionTypeName,
    })
  );

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
  const OnDriverTypeChange = async (DriverType) => {
    let variationKeyIDs = null;
    let slabKeyIDs = null;

    if (globalPricingDriverObj.driverTypeID === 4) {
      if (globalPricingDriverObj.slab.length > 0) {
        slabKeyIDs = slabs.map((slab) => slab.slabKeyID).join(",");
      }
    }
    if (globalPricingDriverObj.driverTypeID === 3) {
      if (globalPricingDriverObj.variation.length > 0) {
        variationKeyIDs = variations
          .map((variation) => variation.variationKeyID)
          .join(",");
      }
    }
    if (globalPricingDriverObj.globalPricingDriverKeyID !== null) {
      // if ((slabKeyIDs !== "" && slabKeyIDs !== undefined && slabKeyIDs !== null) || (variationKeyIDs !== "" && variationKeyIDs !== undefined && variationKeyIDs !== null)) {
      setLoader(true);
      const pricingDriverDelete = await GetPricingDriverUsedInModules(
        globalPricingDriverObj.globalPricingDriverKeyID,
        common.userKeyID,
        null,
        variationKeyIDs,
        slabKeyIDs
      );


      if (pricingDriverDelete?.data?.statusCode === 200) {
        setLoader(false);
        let moduleList = pricingDriverDelete?.data?.responseData?.moduleList;
        if (moduleList.length > 0) {
          // moduleList.map()
          setModelRequestDataForDeleteDriver({
            ...modelRequestDataForDeleteDriver,
            Action: "PricingDriverDelete",
            message:
              slabKeyIDs !== null
                ? `Cannot delete slab already exist in following`
                : `Cannot delete variation already exist in following`,
            ServiceName: moduleList,
          });
          $("#" + "DeleteDriverModel").modal("show");
        } else {
          setErrorMessage("");
          setGlobalPricingDriverObj({
            ...globalPricingDriverObj,
            driverTypeID: DriverType.value,
            slab: [
              {
                slabTypeID: "",
                slabValue: "",
                slabFrom: 0,
                slabTo: 0,
                isDefault: false,
              },
            ],
          });
          if (DriverType.value === 4) {
            setSlabs([]);
          }
          setDriverTypeValue1(DriverType);
        }
      }
      // } else {
      //   setErrorMessage("");
      //   setGlobalPricingDriverObj({
      //     ...globalPricingDriverObj,
      //     driverTypeID: DriverType.value,
      //     slab: [
      //       {
      //         slabTypeID: "",
      //         slabValue: "",
      //         slabFrom: 0,
      //         slabTo: 0,
      //         isDefault: false,
      //       },
      //     ],
      //   });
      //   if (DriverType.value === 4) {
      //     setSlabs([]);
      //   }
      //   setDriverTypeValue1(DriverType);
      // }
    } else {
      setErrorMessage("");
      setGlobalPricingDriverObj({
        ...globalPricingDriverObj,
        driverTypeID: DriverType.value,
        slab: [
          {
            slabTypeID: "",
            slabValue: "",
            slabFrom: 0,
            slabTo: 0,
            isDefault: false,
          },
        ],
      });
      if (DriverType.value === 4) {
        setSlabs([]);
      }
      setDriverTypeValue1(DriverType);
    }
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
  const GetServiceCategoryModelData = async (id, GetSAChanges) => {
    //Service Category Edit Data Api
    if (!id) {
      return;
    }
    setLoader(true);
    try {
      const response = await GetGlobalPricingDriverModel(id, GetSAChanges);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          if (response?.data?.responseData?.data) {
            const ModelData = response?.data?.responseData?.data;
            const driverTypeValueNew = driverType?.filter(
              (DriverType) => DriverType.driverTypeId === ModelData.driverTypeID
            );
            const driverTypeConvert = driverTypeValueNew.map((i) => ({
              value: i.driverTypeId,
              label: i.driverTypeName,
            }));
            setDriverTypeValue1(driverTypeConvert);
            setGlobalPricingDriverObj({
              ...globalPricingDriverObj,
              globalPricingDriverKeyID: ModelData.globalPricingDriverKeyID,
              organisationKeyID: common.organisationKeyID,
              CreatedByID: common.userId,
              driverName: ModelData.driverName,
              driverTypeID: ModelData.driverTypeID,
              addedFor: ModelData.addedFor,
              professionTypeList: ModelData.professionTypeList,

              isDefault: ModelData.isDefault,
              keyID: ModelData.globalPricingDriverKeyID,
            });
            driverTypeValue = driverType?.map((DriverType) => ({
              value: DriverType.driverTypeId,
              label: DriverType.driverTypeName,
            }));
            let variation = [
              { variationName: "", variationValue: "", isDefault: false },
            ];
            if (ModelData.driverTypeID === 3) {
              const ModifyVariation = ModelData.variation.map((item) => ({
                ...item,
                variationValue: item.variationValue,
              }));
              variation = ModifyVariation;
            }
            setVariations(variation);

            const ModifySlab = ModelData.slab.map((item) => ({
              ...item,
              slabValue: item.slabValue,
            }));

            setSlabs(ModifySlab);
            professionTypeValue =
              globalPricingDriverObj.professionTypeList?.map((item) => ({
                value: item.professionTypeId,
                label: item.professionTypeName,
              }));
          }
        } else {
          setErrorMessage(response?.data?.errorMessage);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 2) Add Update Button Click Function
  const GlobalPricingDriverAddUpdateBtnClicked = (Accept) => {
    let hasError = false;
    const variationData =
      globalPricingDriverObj.driverTypeID === 3 ? variations : null;
    const slabData = globalPricingDriverObj.driverTypeID === 4 ? slabs : null;
    const ModifySlab = slabData?.map((item) => ({
      ...item,
      slabValue: item.slabValue,
    }));
    const ModifyVariation = variationData?.map((item) => ({
      ...item,
      variationValue: item.variationValue,
    }));
    if (Accept === "Accept") {
      $("#" + "ConfirmSAChangesModel").modal("show");

      setStatus(true)
      return
    }
    const ApiRequest_ParamsObj = {
      organisationKeyID: common.organisationKeyID,
      userKeyID: common.userKeyID,
      isPredefined: common.roleTypeId === USER_ROLE_TYPE.Admin ? 0 : 1,
      globalPricingDriverKeyID: globalPricingDriverObj.globalPricingDriverKeyID,
      driverName: globalPricingDriverObj.driverName,
      driverTypeID: globalPricingDriverObj.driverTypeID,
      addedFor: globalPricingDriverObj.addedFor,
      acceptSAChanges: Accept,
      professionTypeList:
        common.professionTypeLists?.length > 1 ||
          common.organisationKeyID === null
          ? globalPricingDriverObj.professionTypeList
          : [
            {
              professionTypeId: professionTypeInputValue[0]?.professionTypeId,
              professionTypeName:
                professionTypeInputValue[0]?.professionTypeName,
            },
          ],

      variation: ModifyVariation,
      slab: ModifySlab,
      isDefault: globalPricingDriverObj.isDefault,
    };
    //Check Validations if any
    //Return false if validation fails
    if (
      (common.professionTypeLists?.length > 1 ||
        common.organisationKeyID === null) &&
      professionTypeValue?.length === 0
    ) {
      setGdriverError(true);
      return false; // Return false or handle your error logic here if needed.
    } else if (globalPricingDriverObj.driverName === "") {
      scrollUpDownByElementID("DriverName");
      setGdriverError(true);
    } else if (globalPricingDriverObj.driverTypeID === "") {
      scrollUpDownByElementID("DriverName");
      setGdriverError(true);
    } else if (globalPricingDriverObj.driverTypeID === 3) {
      if (variations.length === 0) {
        scrollUpDownByElementID("Variation");
        setVariationError({ variation: true });
      } else {
        for (let varIndex = 0; varIndex < variations.length; varIndex++) {
          scrollUpDownByElementID(`Variation_Div_${varIndex}`);
          if (
            variations[varIndex]?.variationName === "" &&
            variations[varIndex]?.variationValue === ""
          ) {
            setVariationError({
              ...variationError,
              variationName: true,
              variationValue: true,
            });

            hasError = true;
            break;
          } else if (variations[varIndex]?.variationValue === "") {
            setVariationError({
              ...variationError,
              variationValue: true,
            });

            hasError = true;
            break;
          } else if (variations[varIndex]?.variationName === "") {
            setVariationError({
              ...variationError,
              variationName: true,
            });

            hasError = true;
            break;
          } else if (variations[varIndex]?.variationName !== "") {
            const duplicateVariationFound = variations?.filter(
              (item, index) => {
                // Check if there is any item with the same variationName before the current index
                return variations
                  .slice(0, index)
                  .some(
                    (prevItem) => prevItem.variationName === item.variationName
                  );
              }
            );

            if (duplicateVariationFound.length > 0) {
              // Remove duplicates from the array
              const uniqueVariations = Array.from(
                new Set(
                  duplicateVariationFound.map((item) => item.variationName)
                )
              );
              // Construct the error message
              const duplicateNames = uniqueVariations.join(", ");
              setErrorMessageTitle(
                `Variation ${duplicateNames} already exist. Please choose different name.`
              );
              setOpenErrorModal(true);
              hasError = true;
              break;
            }
          }
        }
        if (!hasError) {
          AddUpdateGlobalPricingDriverData(ApiRequest_ParamsObj);
        }
      }
    } else if (globalPricingDriverObj.driverTypeID === 4) {
      if (slabs.length === 0) {
        scrollUpDownByElementID("Slab");
        setSlabError({ slab: true });
      } else {
        let isValidSlabs = true;
        for (let i = 0; i < slabs.length; i++) {
          // const element = document.getElementById(`Slab_Value_${i}`);
          // if (element) {
          //   element.focus();
          // }

          // const element = document.getElementById(`Slab_Div_${i}`);
          // if (element) {
          //   element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // }
          scrollUpDownByElementID(`Slab_Div_${i}`);

          if (slabs[i].slabTypeID === "") {
            setSlabError({ slabType: true });
            isValidSlabs = false;

            break;
          } else if (slabs[i].slabValue === "") {
            setSlabError({ slabValue: true });
            isValidSlabs = false;
            break;
          } else if (slabs[i].slabFrom === "") {
            setSlabError({ slabValue: true });
            isValidSlabs = false;
            break;
          } else if (
            slabs[i].slabTypeID == 1 &&
            parseFloat(slabs[i].slabTo) < parseFloat(slabs[i].slabFrom)
          ) {
            setSlabError({ slabValue: true });
            isValidSlabs = false;
            break;
          } else if (slabs[i].slabTo === "") {
            setSlabError({ slabValue: true });
            isValidSlabs = false;
            break;
          }
        }

        if (isValidSlabs) {
          AddUpdateGlobalPricingDriverData(ApiRequest_ParamsObj);
        } else {
          return false; // Return false or handle your error logic here if needed.
        }
      }
    } else {
      setGdriverError(""); // Clear the error message if there are no errors.
      AddUpdateGlobalPricingDriverData(ApiRequest_ParamsObj);
    }
  };

  // Add or Update Service Category Data
  const AddUpdateGlobalPricingDriverData = async (ApiRequest_ParamsObj) => {
    setLoader(true);
    try {
      let URL = "/AddUpdateGlobalPricingDriver";
      if (props.modelRequestData.Action !== null) {
        URL = `/AddUpdateGlobalPricingDriver?Action=${props.modelRequestData.Action}`;
      }

      const response = await AddUpdateGlobalPricingDriver(
        URL,
        ApiRequest_ParamsObj
      );
      if (response) {
        setLoader(false);
        if (response?.data?.statusCode === 200) {
          if (ApiRequest_ParamsObj.Action === null) {
            // $('#' + props.id).modal('hide')
            $("#" + "ConfirmSAChangesModel").modal("hide");
            setOpenSuccessModal(true);
            props.setIsAddUpdateActionDone(true);
          } else {
            const services =
              response?.data.responseData.globalConstantExistsInServices;

            if (services.length > 0) {
              const serviceName = services.map((item) => item.serviceName);
              setModelRequestData({
                Action: "Update",
                message: `This Global Constant Driver is being used in the below Services:`,
                ServiceName: serviceName,
                name: "services",
              });
              setOpenSuccessModal(true);
              props.setIsAddUpdateActionDone(true);
            } else {
              setModelRequestData({ ServiceName: [] });
              setOpenSuccessModal(true);
              props.setIsAddUpdateActionDone(true);
            }
            $("#" + "ConfirmSAChangesModel").modal("hide");
          }
        } else {
          $("#" + "ConfirmSAChangesModel").modal("hide");
          setErrorMessage(response?.response?.data?.errorMessage);
        }
      }
    } catch (error) {
      $("#" + "ConfirmSAChangesModel").modal("hide");
      console.log(error);
    }
  };

  const handleClose = async () => {
    if (isCheck) {
      setLoader(true)
      const Notification = await NotifySuperAdminPredefinedChangesToAdmin({
        userKeyID: common.userKeyID,
        moduleKeyID: globalPricingDriverObj.globalPricingDriverKeyID,
        moduleName: "Predefined-GlobalPricingDriver"
      })
      if (Notification?.data?.statusCode === 200) {
        setLoader(false)
        setModelAction("NotificationSend")
        setOpenSuccessModal(true)
        setIsCheck(false)
      }
    } else {
      $("#" + props.id).modal("hide");
      setOpenSuccessModal(false);
    }
  };

  // Close Delete DriverModel 
  const handleCloseDeleteDriverModel = () => {
    $("#" + "DeleteDriverModel").modal("hide");

    setOpenDeleteDriverModel(false);
  };

  const professionTypeInputValue = professionTypeLookupList?.filter(
    (item) => common.professionTypeLists[0] === item.professionTypeId
  );

  const DriverValue = (e, index, Type) => {
    // Ensure that the input only contains numeric characters
    const sanitizedInput = e.target.value
      .replace(/[^0-9.-]/g, "") // Allow only numeric, dot, and negative sign characters
      .slice(0, 16); // Limit to 8 characters (5 digits + 1 dot + 1 decimal + 1 negative sign)

    // Split the input into integer and decimal parts
    const [integerPart, decimalPart] = sanitizedInput.split(".");

    // Combine integer and decimal parts with appropriate precision
    let formattedInput;
    if (decimalPart !== undefined) {
      if (integerPart.includes("-")) {
        // For negative values, ensure 5 digits after the negative sign
        formattedInput = `-${integerPart.slice(1, 13)}.${decimalPart.slice(
          0,
          2
        )}`;
      } else {
        // For positive values, limit to 5 digits before the decimal point
        formattedInput = `${integerPart.slice(0, 12)}.${decimalPart.slice(
          0,
          2
        )}`;
      }
    } else {
      // No decimal part, limit to 5 digits
      formattedInput = integerPart.includes("-")
        ? `-${integerPart.slice(1, 13)}`
        : `${integerPart.slice(0, 12)}`;
    }
    if (Type === "variationValue") {
      OnVariationChange(
        index,
        "variationValue",
        formattedInput.replace(/-/g, (match, index) =>
          index === 0 ? match : ""
        )
      );
    } else if (Type === "slabValue") {
      OnSlabChange(
        index,
        "slabValue",
        formattedInput.replace(/-/g, (match, index) =>
          index === 0 ? match : ""
        )
      );
    } else if (Type === "slabFrom") {
      OnSlabChange(
        index,
        "slabFrom",
        formattedInput.replace(/-/g, (match, index) =>
          index === 0 ? match : ""
        )
      );
    } else if (Type === "slabTo") {
      const updatedSlabs = [...slabs];
      updatedSlabs[index].slabTo = formattedInput.replace(
        /-/g,
        (match, index) => (index === 0 ? match : "")
      );
      // Update the next slab's slabFrom based on the current slab's slabTo
      const nextSlabIndex = index + 1;
      if (nextSlabIndex < slabs.length) {
        var fromValueForNewSlab = Number(formattedInput) + 0.01;
        fromValueForNewSlab = Math.round(fromValueForNewSlab * 100) / 100;
        updatedSlabs[nextSlabIndex].slabFrom = fromValueForNewSlab; //Number(formattedInput) + 0.01;
      }
      setSlabs(updatedSlabs);
    }
  };

  const HandleClose = () => {
    if (openErrorModal === true) {
      setOpenErrorModal(false);
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
        moduleKeyID: props.modelRequestData.globalPricingDriverKeyID,
        moduleName: "Predefined-GlobalPricingDriver"
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

  const handleConfirmButton = () => {
    $("#" + "ConfirmSAChangesModel").modal("hide");
    if (Status) {
      GlobalPricingDriverAddUpdateBtnClicked(true)
    } else {
      DeclineSuperAdminChangesData()
    }
  }
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
      data-bs-keyboard="true"
    >
      <div class="modal-dialog modal-md modal-dialog-centered pricing-driver-popup">
        <div class="modal-content">
          <div class="modal-header bg-light p-3">
            <h5 class="modal-title" id="exampleModalLabel">
              {modelAction === "Add"
                ? getCrudPopUpTitleName("Add", moduleName)
                : getCrudPopUpTitleName("Update", moduleName)}
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
          <div class="modal-body gpd-scroll">
            <div class="tab-content">
              <div className="row" id="DriverName">
                <SAPredefinedChangesNotifyMessageModel Params={{ moduleName: moduleName, SAChanges: props.modelRequestData.Type }} />
                {(common.professionTypeLists?.length > 1 ||
                  common.organisationKeyID === null) && (
                    <div className="col-lg-12">
                      <div className="mb-3 ">
                        <label className="form-label">
                          Profession Type<span className="text-danger">*</span>
                        </label>
                        <div className="col-12 ">
                          <div className="input-group">
                            {
                              common.professionTypeLists?.length > 1 ||
                                common.organisationKeyID === null ? (
                                <Select
                                  isMulti
                                  isDisabled={
                                    globalPricingDriverObj.addedFor ===
                                    "Predefined-NOB" ||
                                    globalPricingDriverObj.addedFor ===
                                    "Predefined-PT"
                                  }
                                  style={{ padding: "5px" }}
                                  className="user-role-select"
                                  options={ProfessionalTypeLookeupListOptions}
                                  value={professionTypeValue}
                                  onChange={OnChangeSelectProfessionType}
                                />
                              ) : (
                                ""
                              )
                            }
                          </div>
                          {gdrivererror &&
                            (common.professionTypeLists?.length > 1 ||
                              common.organisationKeyID === null) &&
                            professionTypeValue?.length === 0 ? (
                            <label className="validation">{ERROR_MESSAGES}</label>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                <div className="col-lg-12">
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
                        disabled={
                          globalPricingDriverObj.addedFor ===
                          "Predefined-NOB" ||
                          globalPricingDriverObj.addedFor === "Predefined-PT"
                        }
                        onChange={(e) => {
                          setErrorMessage("");
                          const inputValue = e.target.value;
                          const trimmedValue = inputValue.replace(/^\s+/g, ""); // Remove leading spaces
                          // Handle consecutive spaces
                          const singleSpaceValue = trimmedValue.replace(
                            /\s{2,}/g,
                            " "
                          );
                          // Remove dot if it follows a space
                          const sanitizedValue = singleSpaceValue.replace(
                            / \./g,
                            " "
                          );
                          const capitalizedValue =
                            sanitizedValue.charAt(0).toUpperCase() +
                            sanitizedValue.slice(1);
                          setGlobalPricingDriverObj({
                            ...globalPricingDriverObj,
                            driverName: capitalizedValue,
                          });
                        }}
                        maxLength={75}
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
                <div className="col-lg-12">
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
                        disabled={
                          globalPricingDriverObj.addedFor ===
                          "Predefined-NOB" ||
                          globalPricingDriverObj.addedFor === "Predefined-PT"
                        }
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
              {globalPricingDriverObj.driverTypeID === 3 && (
                <div class="row">
                  <div class="col-xl-12 col-lg-12">
                    {variations?.map((i, index) => {
                      return (
                        <div
                          id={`Variation_Div_${index}`}
                          class="card-1 pricing-box p-4 mt-4"
                          draggable="true"
                          onDragStart={(e) => {
                            e.dataTransfer.setData("index", index);
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            const sourceIndex = e.dataTransfer.getData("index");
                            const targetIndex = index;

                            // Rearrange the templateElementList based on the drag-and-drop
                            if (sourceIndex !== targetIndex) {
                              const variationsList = [...variations];
                              const [draggedItem] = variationsList.splice(
                                sourceIndex,
                                1
                              );
                              variationsList.splice(
                                targetIndex,
                                0,
                                draggedItem
                              );
                              setVariations(variationsList);
                            }
                          }}
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
                              disabled={
                                variations[index].canDelete === false
                                  ? true
                                  : false
                              }
                              onClick={() => OnDeleteVariations(index)}
                              class="btn btn-sm btn-danger remove-item-btn d-flex gap-1 globalDriver"
                            >
                              <i class="ri-delete-bin-5-fill"></i>
                              <p className="delete-margin font-12">
                                Delete Variation
                              </p>
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
                                    disabled={
                                      variations[index].canDelete === false
                                        ? true
                                        : false
                                    }
                                    type="text"
                                    className="input-text"
                                    placeholder="Enter Variation Name"
                                    value={
                                      variations[index]
                                        ? variations[index].variationName
                                        : ""
                                    }
                                    onChange={(e) => {
                                      setErrorMessage("");
                                      const inputValue = e.target.value;
                                      const trimmedValue = inputValue.replace(
                                        /^\s+/g,
                                        ""
                                      ); // Remove leading spaces
                                      if (/^\d/.test(trimmedValue)) {
                                        // setErrorMessage("Driver name cannot start with a number");
                                        return; // Do not update state if numeric value is detected
                                      }
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
                                  />
                                </div>
                                {variationError?.variationName &&
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
                                    type="text"
                                    className="input-text"
                                    placeholder="Enter Variation Value"
                                    // value={variations[index].variationValue === "" ? "" : variations[index].variationValue.includes("-") ?
                                    //   `-${Number(variations[index].variationValue.replace('-', '')).toLocaleString("en-US")}` :
                                    //   Number(variations[index].variationValue).toLocaleString("en-US")
                                    // }
                                    value={variations[index].variationValue
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    onChange={(e) => {
                                      DriverValue(e, index, "variationValue");
                                    }}
                                  />
                                </div>

                                {variationError.variationValue &&
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
                                style={{
                                  marginRight: "1rem",
                                  verticalAlign: "middle",
                                }}
                                type="radio"
                                id={`variation${index}`}
                                name="variations"
                                disabled={
                                  variations[index].canDelete === false
                                    ? true
                                    : false
                                }
                                checked={variations[index].isDefault}
                                onChange={(e) => OnVariationsRadioChange(index)}
                              />
                              <label
                                className="toggle"
                                name="variations"
                                style={{
                                  cursor: "pointer",
                                  marginTop: "0",
                                  marginBottom: "0",
                                }}
                                htmlFor={`variation${index}`}
                              >
                                Set to Default
                              </label>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {variationError.variation && variations.length === 0 ? (
                      <label
                        id="Variation"
                        className="col-lg-12 col-12 variation-validation"
                      >
                        At least 1 Variation is required.
                      </label>
                    ) : (
                      ""
                    )}
                    {/* <p class="delete-right mt-2">
                      <button
                        onClick={OnAddVariations}
                        class="btn btn-md btn-success create-item-btn d-flex gap-1"
                      >
                        <i class="bi bi-plus-circle"></i>
                        <span className="font-12">Add Variation</span>
                      </button>
                    </p> */}
                  </div>
                </div>
              )}

              {/* <!-- end tab row --> */}
              {globalPricingDriverObj.driverTypeID == 4 && (
                <div class="row">
                  <div class="col-xl-12 col-lg-12">
                    {slabError.slab && slabs.length === 0 ? (
                      <label
                        id="Slab"
                        className="col-lg-12 col-12 variation-validation"
                      >
                        At least 1 Slab is required.
                      </label>
                    ) : (
                      ""
                    )}
                    {/* {slabs.length === 0 && (
                      <p class="delete-right" style={{ marginBottom: "0" }}>
                        <button
                          onClick={AddSlab}
                          class="btn btn-md btn-success create-item-btn d-flex gap-1"
                        >
                          <i class="bi bi-plus-circle"></i>
                          <span className="font-12">Add Slab</span>
                        </button>
                      </p>
                    )} */}
                    {slabs?.map((i, index) => {
                      return (
                        <div
                          class="card-1 pricing-box p-4 mt-4"
                          key={index}
                          id={`Slab_Div_${index}`}
                        >
                          <div class="col-lg-6 col-md-6 ">
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
                              class="btn btn-sm btn-danger remove-item-btn d-flex gap-1 globalDriver"
                            >
                              <i class="ri-delete-bin-5-fill"></i>
                              <p className="delete-margin font-12">
                                Delete Slab
                              </p>
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
                                  <Select
                                    className="user-role-select"
                                    onChange={(selectedOption) => {
                                      setErrorMessage("");
                                      OnSlabChange(
                                        index,
                                        "slabTypeID",
                                        selectedOption.value
                                      );
                                    }}
                                    value={slabType
                                      ?.filter(
                                        (item) =>
                                          item.slabTypeId ===
                                          slabs[index].slabTypeID
                                      )
                                      .map((i) => ({
                                        value: i.slabTypeId,
                                        label: i.slabTypeName,
                                      }))}
                                    options={slabType?.map((item) => ({
                                      value: item.slabTypeId,
                                      label: item.slabTypeName,
                                    }))}
                                    placeholder="Select..."
                                  />
                                </div>
                                {slabError.slabType &&
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
                                        type="text"
                                        className="input-text"
                                        placeholder="Value"
                                        value={
                                          slabs[index].slabValue === ""
                                            ? ""
                                            : slabs[index].slabValue
                                              .toString()
                                              .replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                ","
                                              )
                                        }
                                        onChange={(e) => {
                                          DriverValue(e, index, "slabValue");
                                        }}
                                        onWheel={(e) => e.preventDefault()}
                                      />
                                    </div>
                                    <div className="invalid-feedback">
                                      Please enter Slab Value
                                    </div>
                                    {slabError.slabValue &&
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
                                        type="text"
                                        className="input-text"
                                        placeholder="From"
                                        // disabled={props.disable}
                                        disabled={index === 0 ? false : true}
                                        value={
                                          slabs[index].slabFrom === ""
                                            ? ""
                                            : slabs[index].slabFrom
                                              .toString()
                                              .replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                ","
                                              )
                                        }
                                        // onChange={(e) => OnSlabChange(index, 'slabFrom', e.target.value)}
                                        onChange={(e) => {
                                          DriverValue(e, index, "slabFrom");
                                        }}
                                      />
                                    </div>
                                    <div className="invalid-feedback">
                                      Please enter Slab Value
                                    </div>
                                    {slabError.slabValue &&
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
                                        type="text"
                                        className="input-text"
                                        disabled={props.disable}
                                        placeholder="To"
                                        value={
                                          slabs[index].slabTo === ""
                                            ? ""
                                            : slabs[index].slabTo
                                              .toString()
                                              .replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                ","
                                              )
                                        }
                                        onChange={(e) => {
                                          DriverValue(e, index, "slabTo");
                                        }}
                                      />
                                    </div>
                                    <div className="invalid-feedback">
                                      Please enter Slab Value
                                    </div>
                                    {slabError.slabValue &&
                                      parseFloat(slabs[index].slabTo) <
                                      parseFloat(slabs[index].slabFrom) ? (
                                      <label className="validation">
                                        The field must not be less than{" "}
                                        {slabs[index].slabFrom}.
                                      </label>
                                    ) : (
                                      ""
                                    )}
                                    {slabError.slabValue &&
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
                                        type="text"
                                        className="input-text"
                                        placeholder="Increment Value By"
                                        value={
                                          slabs[index].slabValue === ""
                                            ? ""
                                            : slabs[index].slabValue
                                              .toString()
                                              .replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                ","
                                              )
                                        }
                                        onChange={(e) => {
                                          DriverValue(e, index, "slabValue");
                                        }}
                                      />
                                    </div>
                                    <div className="invalid-feedback">
                                      Please enter Slab Value
                                    </div>
                                    {slabError.slabValue &&
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
                                        type="text"
                                        className="input-text"
                                        placeholder="From"
                                        disabled={
                                          slabs[index].isDefault === false
                                            ? true
                                            : false
                                        }
                                        value={
                                          slabs[index].slabFrom === ""
                                            ? 0
                                            : slabs[index].slabFrom
                                              .toString()
                                              .replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                ","
                                              )
                                        }
                                        onChange={(e) => {
                                          DriverValue(e, index, "slabFrom");
                                        }}
                                      />
                                    </div>

                                    {slabError.slabValue &&
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
                                        type="text"
                                        className="input-text"
                                        placeholder="Increment Slab By"
                                        disabled={props.disable}
                                        value={
                                          slabs[index].slabTo === ""
                                            ? ""
                                            : slabs[index].slabTo
                                              .toString()
                                              .replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                ","
                                              )
                                        }
                                        // onChange={(e) => OnSlabChange(index, 'slabTo', e.target.value)}
                                        onChange={(e) => {
                                          DriverValue(e, index, "slabTo");
                                        }}
                                      />
                                    </div>
                                    {slabError.slabValue &&
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
                    {/* {slabs && slabs[slabs.length - 1]?.slabTypeID == "1" && (
                      <p class="delete-right mt-2">
                        <button
                          onClick={() => OnAddSlab()}
                          class="btn btn-sm btn-primary create-item-btn d-flex gap-1"
                        >
                          <i class="bi bi-plus-circle"></i>
                          <p className="delete-margin font-12">Add Slab</p>
                        </button>
                      </p>
                    )} */}
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
                {common.professionTypeLists?.length <= 1 &&
                  errorMessage?.includes(
                    `Please dont choose this profession type`
                  )
                  ? errorMessage.split(".")[0]
                  : errorMessage}
              </label>
              {/* <!-- end tab row --> */}
            </div>
          </div>
          <div class="modal-footer">
            <div class="hstack gap-2 justify-content-end">
              {slabs &&
                slabs[slabs.length - 1]?.slabTypeID == "1" &&
                globalPricingDriverObj.driverTypeID == 4 && (
                  <button
                    onClick={() => OnAddSlab()}
                    class="btn btn-sm btn-primary create-item-btn d-flex gap-1"
                  >
                    <i class="bi bi-plus-circle"></i>
                    <p className="delete-margin font-12">Add Slab </p>
                  </button>
                )}
              {slabs.length === 0 &&
                globalPricingDriverObj.driverTypeID == 4 && (
                  <button
                    onClick={AddSlab}
                    class="btn btn-sm btn-primary create-item-btn d-flex gap-1"
                  >
                    <i class="bi bi-plus-circle "></i>
                    <span className="font-12 delete-margin">Add Slab</span>
                  </button>
                )}
              {globalPricingDriverObj.driverTypeID == 3 && (
                <button
                  type="submit"
                  class="btn btn-sm btn-primary create-item-btn d-flex gap-1"
                  onClick={OnAddVariations}
                >
                  <i class="bi bi-plus-circle"></i>
                  <span className="font-12 delete-margin">Add Variation</span>
                </button>
              )}
              {props.modelRequestData.Type ? (<>
                <button
                  type="submit"
                  class="btn btn-md btn-success accept-item-btn"
                  disabled={props.addCategoryLoader}
                  onClick={() => GlobalPricingDriverAddUpdateBtnClicked("Accept")}
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
                    onClick={SetInitialModelData}
                  >
                    <span>{getCrudButtonTextName("Cancel")}</span>
                  </button>
                  <button
                    type="submit"
                    class="btn btn-md btn-success create-item-btn"
                    disabled={props.addCategoryLoader}
                    onClick={() => GlobalPricingDriverAddUpdateBtnClicked()}
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
        </div>
      </div>
      <SuccessModal
        handleClose={handleClose}
        setDismissModal={setDismissModal}
        setOpenSuccessModal={setOpenSuccessModal}
        openSuccessModal={openSuccessModal}
        modelAction={modelAction}
        setIsCheck={setIsCheck}
        isCheck={isCheck}
        modelRequestData={modelRequestData}
        message={`${moduleName} ${globalPricingDriverObj.driverName}`}
      />

      <DeleteDriverModal
        handleClose={handleCloseDeleteDriverModel}
        openDeleteDriverModel={openDeleteDriverModel}
        modelRequestData={modelRequestDataForDeleteDriver}
        openSuccessModal={openSuccessModal}
        openErrorModal={openErrorModal}
      />
      <ErrorModel
        ErrorModel={openErrorModal}
        handleClose={HandleClose}
        ErrorMessage={errorMessageTitle}
        errorMessageTitle={""}
      />
      <AcceptSuperAdminChangesConfirmation
        openErrorModal={openErrorModal}
        ModelId={props.id}
        Status={Status}
        openSuccessModal={openSuccessModal}
        modelRequestData={props.modelRequestData}
        UpdatedChanges={handleConfirmButton}
      />
    </div>
  );
}

export default Modal;
