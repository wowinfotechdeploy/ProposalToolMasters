/* global $ */
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  GetUpdateThemeSettings,
  GetUserPersonalizeSetting,
} from "../redux/Services/Personalize/PersonalizeSetting";
import { useSelector } from "react-redux";
import { AuthContextProvider } from "./AuthContext";
import SuccessModal from "../components/SuccessModal";
import { set } from "date-fns";

const initialState = {
  loading: false,
};

export const ColorContext = createContext(initialState);

export const ColorProvider = ({ children }) => {
  /* -------------------------------------------------------------------------- */
  /*                                State Declare                               */
  /* -------------------------------------------------------------------------- */
  
  let getUserPersonalizeSettingApiCallCount = 0;
  const [currentCardColor, setCurrentCardColor] = useState("#fff");
  const [currentTopbarColor, setCurrentTopbarColor] = useState("#5a2eca");
  const [cardBgColor, setCardBgColor] = useState("#5a2eca");
  const [currentTopbarTextColor, setCurrentTopbarTextColor] =
    useState("#ffc058");
  const [CloseModal, setCloseModal] = useState(false);
  const [isAddUpdateDone, setIsAddUpdateDone] = useState(false);
  const [dismissModal, setDismissModal] = useState(null);
  const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
  const [modelAction, setModelAction] = useState("Update");
  const [MessageType, setMessageType] = useState();
  const [CardColor, setCardColor] = useState("");
  const [TopbarColor, setTopbarColor] = useState("");
  const [TopbarTextColor, setTopbarTextColor] = useState("");
  const {
    setLoader,
    prospectName,
    proposalName,
    EngagementName,
    maxCountToRecallApi,
    updatedProposalName,
    updatedProspectName,
    setDefaultVariables,
    updatedEngagementName,
  } = useContext(AuthContextProvider);
  const common = useSelector((state) => state.Storage); //Getting Logged Users Details From Persist Storage of redux hooks

  useEffect(() => {
    if (common.token) {
      let userThemeSettingLocalStorage = localStorage.getItem(
        "userThemeSettingLocalStorage"
      );
      if (
        userThemeSettingLocalStorage === undefined ||
        userThemeSettingLocalStorage === null
      ) {
        GetUserPersonalizeSettingData(
          common.userKeyID,
          common.organisationKeyID
        );
      } else {
        GetUserPersonalizeSettingDataFromLocalStorage();
      }
    }
  }, []);

  const GetUserPersonalizeSettingDataFromLocalStorage = () => {
    // Get the JSON-formatted string from localStorage
    let userThemeSettingLocalStorage = localStorage.getItem(
      "userThemeSettingLocalStorage"
    );

    if (userThemeSettingLocalStorage) {
      // Parse the JSON string to a JavaScript object
      let userThemeSettings = JSON.parse(userThemeSettingLocalStorage);

      // Check if userThemeSettings is not null or undefined
      if (userThemeSettings) {
        // Now, userThemeSettings is a JavaScript object containing the parsed JSON data     

        // Assuming the properties in ModelData match the setting names
        const AppearanceHeaderBgColorSetting = userThemeSettings.find(
          (item) => item.settingName === "AppearanceHeaderBgColor"
        );
        const AppearanceNavbarMenuListColorSetting = userThemeSettings.find(
          (item) => item.settingName === "AppearanceNavbarMenuListColor"
        );
        const AppearanceDashboardCardBgColorSetting = userThemeSettings.find(
          (item) => item.settingName === "AppearanceDashboardCardBgColor"
        );
        // Set values based on the found settings
        setCurrentCardColor(
          AppearanceDashboardCardBgColorSetting?.settingValue
        );
        setCurrentTopbarTextColor(
          AppearanceNavbarMenuListColorSetting?.settingValue
        );
        setCurrentTopbarColor(AppearanceHeaderBgColorSetting?.settingValue);

        setCardColor(AppearanceDashboardCardBgColorSetting?.settingValue);
        setTopbarTextColor(AppearanceNavbarMenuListColorSetting?.settingValue);
        setTopbarColor(AppearanceHeaderBgColorSetting?.settingValue);
        setCardBgColor(AppearanceDashboardCardBgColorSetting?.settingValue);
      }
    }
  };

  const GetUserPersonalizeSettingData = async (id) => {
    if (!id) {
      return;
    }
    try {
      const response = await GetUserPersonalizeSetting(id);
      if (response) {
        if (response?.data?.statusCode === 200) {
          getUserPersonalizeSettingApiCallCount = 0;
          const modelData =
            response?.data?.responseData.userPersonalSetting.userThemeSetting;

          localStorage.removeItem("userThemeSettingLocalStorage");
          localStorage.setItem(
            "userThemeSettingLocalStorage",
            JSON.stringify(modelData)
          );

          // Assuming the properties in ModelData match the setting names
          const AppearanceHeaderBgColorSetting = modelData.find(
            (item) => item.settingName === "AppearanceHeaderBgColor"
          );
          const AppearanceNavbarMenuListColorSetting = modelData.find(
            (item) => item.settingName === "AppearanceNavbarMenuListColor"
          );
          const AppearanceDashboardCardBgColorSetting = modelData.find(
            (item) => item.settingName === "AppearanceDashboardCardBgColor"
          );
          // Set values based on the found settings
          setCurrentCardColor(
            AppearanceDashboardCardBgColorSetting?.settingValue
          );
          setCurrentTopbarTextColor(
            AppearanceNavbarMenuListColorSetting?.settingValue
          );
          setCurrentTopbarColor(AppearanceHeaderBgColorSetting?.settingValue);
          setCardBgColor(AppearanceDashboardCardBgColorSetting?.settingValue);
          setCardColor(AppearanceDashboardCardBgColorSetting?.settingValue);
          setTopbarTextColor(
            AppearanceNavbarMenuListColorSetting?.settingValue
          );
          setTopbarColor(AppearanceHeaderBgColorSetting?.settingValue);
        } else {
          RecallGetUserPersonalizeSettingData(id);
        }
      } else {
        RecallGetUserPersonalizeSettingData(id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // if api call failed somehow , this function call 5 times 
  const RecallGetUserPersonalizeSettingData = (id) => {
    if (getUserPersonalizeSettingApiCallCount < maxCountToRecallApi) {
      getUserPersonalizeSettingApiCallCount += 1;
      setTimeout(function () {
        GetUserPersonalizeSettingData(id);
      }, 1000);
    } else {
    }
  };

  const UpdateThemeSettingsData = async (UpdateType) => {
    setLoader(true);

    // Your API request parameters
    let userThemeSetting = [];

    if (UpdateType === "Theme") {
      userThemeSetting = [
        {
          settingName: "AppearanceHeaderBgColor",
          settingValue: currentTopbarColor,
        },
        {
          settingName: "AppearanceNavbarMenuListColor",
          settingValue: currentTopbarTextColor,
        },
        {
          settingName: "AppearanceDashboardCardBgColor",
          settingValue: cardBgColor,
        },
      ];
    } else {
      userThemeSetting = [
        {
          settingName: "VariableProspectName",
          settingValue:
            updatedProspectName === "" ? prospectName : updatedProspectName,
        },
        {
          settingName: "VariableProposalName",
          settingValue:
            updatedProposalName === "" ? proposalName : updatedProposalName,
        },
        {
          settingName: "VariableEngagementName",
          settingValue:
            updatedEngagementName === ""
              ? EngagementName
              : updatedEngagementName,
        },
      ];
    }
    const ApiRequest_ParamsObj = { userThemeSetting };
    const SettingType =
      UpdateType === "Theme" ? "Appearance" : "PersonalizeSetting";

    try {
      const response = await GetUpdateThemeSettings(
        common.userKeyID,
        common.organisationKeyID,
        SettingType,
        ApiRequest_ParamsObj
      );
      if (response?.data?.statusCode === 200) {
        localStorage.removeItem("userThemeSettingLocalStorage");
        if (UpdateType !== "Theme") {
          localStorage.removeItem("OrganisationLocalList");
        }
        GetUserPersonalizeSettingData(common.userKeyID);
        setMessageType(UpdateType);
        setIsAddUpdateDone(true);
        setLoader(false);
        setOpenSuccessModal(true);
        setDefaultVariables(false);
        setCloseModal(true);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  const UserDefaultTheme = () => {
    setCurrentCardColor(CardColor);
    setCurrentTopbarTextColor(TopbarTextColor);
    setCurrentTopbarColor(TopbarColor);
  };

  //topbar Function
  const OnChangeTopbarColor = (event) => {
    const newColor = event.target.value;
    console.log(newColor);
    setCurrentTopbarColor(newColor);
  };

  ///text / font color
  const OnChangeTopbarTextColor = (event) => {
    const newColor = event.target.value;
    setCurrentTopbarTextColor(newColor);
  };

  const cardStyle = {
    backgroundColor: currentCardColor,
  };

  const TopbarStyle = {
    backgroundColor: currentTopbarColor,
  };

  const TopTextColor = {
    color: currentTopbarTextColor,
  };

  const handleSetDefault = () => {
    setCurrentCardColor("#fff");
    setCurrentTopbarColor("#5a2eca");
    setCardBgColor("#5a2eca");
    setCurrentTopbarTextColor("#ffc058");
  };

  const handleOnChangeCard = (event) => {
    const newColor = event.target.value;
    setCurrentCardColor(newColor);
    setCardBgColor(newColor);
  };
  const handleClose = () => {
    $("#" + "SetPersonalizeSettingModal").modal("hide");
    setOpenSuccessModal(false);
  };

  /* -------------------- Provide All Function at Globally -------------------- */
  return (
    <ColorContext.Provider
      value={{
        cardStyle,
        cardBgColor,
        CloseModal,
        TopbarStyle,
        TopTextColor,
        setCloseModal,
        isAddUpdateDone,
        currentCardColor,
        UserDefaultTheme,        
        handleSetDefault,
        currentTopbarColor,
        setIsAddUpdateDone,
        handleOnChangeCard,
        OnChangeTopbarColor,
        setCurrentCardColor,
        setCurrentTopbarColor,
        currentTopbarTextColor,
        OnChangeTopbarTextColor,
        UpdateThemeSettingsData,
        setCurrentTopbarTextColor,
        }}
    >
      <SuccessModal
        handleClose={handleClose}
        setDismissModal={setDismissModal}
        setOpenSuccessModal={setOpenSuccessModal}
        openSuccessModal={openSuccessModal}
        modelAction={modelAction}
        message={MessageType}
      />
      {children}
    </ColorContext.Provider>
  );
};
