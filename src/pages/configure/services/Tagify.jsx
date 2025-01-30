import Tags from "@yaireo/tagify/dist/react.tagify";
import React, { useContext, useEffect, useState } from "react";
import "@yaireo/tagify/dist/tagify.css";
import {
  GetGCAndGPDListForPricingFormula,
} from "../../../redux/Services/Config/GlobalConstantApi";
import { useSelector } from "react-redux";
import { AuthContextProvider } from "../../../AuthContext/AuthContext";

//tagify Library Basic tagify Setting

const BaseTagifySettings = {
  mode: "mix",
  pattern: /@/,
  dropdown: {
    enabled: 0,
    highlightFirst: true,
    maxItems: 30,
  },
  enforceWhitelist: true,
  duplicates: false,
  autoFocus: true,
  // delimiters: " "
}

const TagIfy = ({
  pricingDriver,
  tagifyRef,
  servicesObj,
  handleChange,
  EditPricingFormulaValue,
  PricingFormulaValue,
}) => {
  // A] States Declaration :
  const [globalConstantList, setGlobalConstantList] = useState([]);
  const [globalPricingDriverList, setGlobalPricingDriverList] = useState([]);
  const [editFormulaCount, setEditFormulaCount] = useState(0);
  const [onBackButtonSavedPricingFormula, setOnBackButtonSavedPricingFormula] =
    useState(null);
  const common = useSelector((state) => state.Storage);
  const { setLoader } = useContext(AuthContextProvider);
  // B] Initial useEffect :
  // 1) Will Call Initial Api Like List Api
  useEffect(() => {
    GetGlobalConstantListData();
    // GetGlobalPricingDriverListData();
  }, []);

  useEffect(() => {
    if (editFormulaCount === 0) {
      setOnBackButtonSavedPricingFormula(EditPricingFormulaValue);
    }
    setEditFormulaCount(editFormulaCount + 1);
  }, [EditPricingFormulaValue]);

  // C] Calling All Api's like List and other Here :
  // 1) Get Global Constant List Data
  const GetGlobalConstantListData = async () => {
    setLoader(true);
    try {
      const data = await GetGCAndGPDListForPricingFormula({
        organisationKeyID: common.organisationKeyID,
        userKeyID: common.userKeyID,
        professionTypeIDs:
          common.professionTypeLists?.length > 1 ||
            common.organisationKeyID === null
            ? servicesObj.professionTypeList.map(
              (item) => item.professionTypeId
            )
            : common.professionTypeLists,

        natureOfBusinessIDs: servicesObj.businessNatureID,
        businessTypeIDs: servicesObj.clientBusinessTypeID,
      });
      if (data?.data?.statusCode === 200) {
        setLoader(false);
        const GlobalConstantListData =
          data.data.responseData.globalConstantList;
        setGlobalConstantList(GlobalConstantListData);

        const GlobalPricingDriverListData =
          data.data.responseData.globalPricingDriverList;
        setGlobalPricingDriverList(GlobalPricingDriverListData);
      } else {
        setLoader(false);

      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  // D] Pricing Formula in Showing Variables Mapping Here
  const LocalWhiteListVariables = servicesObj?.pricingDriverList
    ?.map((i) => {
      if (i.parentGlobalPricingDriverKeyID == null) {
        return {
          value: i.driverName + "(P)",
          key: i.globalPricingDriverKeyID,
          tempId: i.temp_GlobalPricingDriverID_ForDependancy,
          class: "private-tag",
          type: "Private",
        };
      }
    })
    .filter((item) => item !== undefined);

  const GlobalWhiteListVariables1 = globalConstantList?.map((i) => {
    return {
      value: i.driverName + "(C)",
      key: i.globalPricingDriverKeyID,
      class: "global-tag",
      type: "Global",
    };
  });

  const GlobalWhiteListVariables2 = globalPricingDriverList?.map((i) => {
    return {
      value: i.driverName + "(G)",
      key: i.globalPricingDriverKeyID,
      class: "global-tag",
      type: "Global",
    };
  });

  let WhiteListVariables = [];
  WhiteListVariables = [
    ...LocalWhiteListVariables,
    ...GlobalWhiteListVariables1,
    ...GlobalWhiteListVariables2,
  ];

  WhiteListVariables.map((elem) => {
    elem.value = elem.value?.replaceAll(" ", "_");
    return elem;
  });

  // if (servicesObj.pricingFormula) {
  if (servicesObj.pricingFormula || onBackButtonSavedPricingFormula) {
    const formatTags = (value, type, globalPricingDriverId) => {
      if (globalPricingDriverId == "") {
        return;
      }
      return `[[{"value":"${value}","key":"${globalPricingDriverId}","class":"${type.toLowerCase()}-tag","type":"${type}","prefix":"@"}]]`;
    };

    const formatPrivateTags = (value, type, globalPricingDriverId, tempId) => {
      if (tempId == "") {
        return;
      }
      return `[[{"value":"${value}","key":${globalPricingDriverId},"tempId":"${tempId}","class":"${type.toLowerCase()}-tag","type":"${type}","prefix":"@"}]]`;
    };

    if (editFormulaCount === 0) {
      PricingFormulaValue = EditPricingFormulaValue?.split(" ");
    } else {
      // PricingFormulaValue = EditPricingFormulaValue?.split(" ");
      PricingFormulaValue = onBackButtonSavedPricingFormula?.split(" ");
    }

    let insideArray = false;

    PricingFormulaValue = PricingFormulaValue?.map((i) => {
      const match =
        i.match(/Var\("?(.*?)"?\)/) ||
        i.match(/var\("?.*?"?\)/) ||
        i.match(/Var\("?.*?"?\)/) ||
        i.match(/var\("([^"]+)"\)/) ||
        i.match(
          /var([a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12})/i
        );

      let firstSplit = [];
      let secondSplit = [];
      if (i.includes('var("')) {
        firstSplit = i.split('var("');
        secondSplit = firstSplit[1].split('")');
        let tempId = secondSplit[0];
        const filterLocalPricingDriver = servicesObj?.pricingDriverList?.filter(
          (item) =>
            item.temp_GlobalPricingDriverID_ForDependancy === Number(tempId)
        );
        if (filterLocalPricingDriver && filterLocalPricingDriver.length > 0) {
          //insideArray = true;
          return formatPrivateTags(
            filterLocalPricingDriver[0]?.driverName?.replaceAll(" ", "_") +
            "(P)",
            "Private",
            null,
            tempId
          );
        }
      }

      if (match && match[1]) {
        const globalPricingDriverId = match[1];

        const filter1 = globalPricingDriverList?.filter(
          (item) =>
            item.globalPricingDriverKeyID?.toLowerCase() ===
            globalPricingDriverId?.toLowerCase()
        );
        const filter2 = globalConstantList?.filter(
          (item) =>
            item.globalPricingDriverKeyID?.toLowerCase() ===
            globalPricingDriverId?.toLowerCase()
        );
        const filter3 = pricingDriver?.filter(
          (item) =>
            item.globalPricingDriverKeyID?.toLowerCase() ===
            globalPricingDriverId?.toLowerCase()
        );

        const filter4 = servicesObj?.pricingDriverList?.filter(
          (item) =>
            item.globalPricingDriverKeyID?.toLowerCase() ===
            globalPricingDriverId?.toLowerCase()
        );

        if (filter1 && filter1.length > 0) {
          insideArray = true;
          return formatTags(
            filter1[0]?.driverName?.replaceAll(" ", "_") + "(G)",
            "Global",
            globalPricingDriverId
          );
        } else if (filter2 && filter2.length > 0) {
          insideArray = true;
          return formatTags(
            filter2[0]?.driverName?.replaceAll(" ", "_") + "(C)",
            "Global",
            globalPricingDriverId
          );
        } else if (filter3 && filter3.length > 0) {
          insideArray = true;
          return formatTags(
            filter3[0]?.driverName?.replaceAll(" ", "_") + "(G)",
            "Global",
            globalPricingDriverId
          );
        } else if (filter4 && filter4.length > 0) {
          insideArray = true;
          return formatTags(
            filter4[0]?.driverName?.replaceAll(" ", "_") + "(P)",
            "Private",
            globalPricingDriverId
          );
        }
      } else {
        return i;
      }
      // If the value is empty or contains only spaces, skip it
      if (i.trim() === "" || i == "") {
        return null;
      }

      if (insideArray) {
        insideArray = false;
        return `${i?.replaceAll("+", " + ")}`;
      }

      // Return the original string without spaces
      return formatTags(i.replace(/\s/g, ""), "Private", "");
    })
      .filter((item) => item !== null)
      .join(``);
  }

  // F] Tagify Main Setting Here:
  const Settings = {
    ...BaseTagifySettings,
    callbacks: {
      input: function (e) {
        // debugger
        handleChange(e, "Input");
      },
      remove: function (e) {
        // debugger
        handleChange(e, "remove");
      },
      select: function (e) {
        // debugger
        handleChange(e, "select");
      },
    },
  };

  //Design part :
  return (
    <>
      <Tags
        settings={Settings}
        tagifyRef={tagifyRef}
        value={PricingFormulaValue?.replace(
          /\[\[{"value":"​","key":"","class":"private-tag","type":"Private","prefix":"@"}\]\]/g,
          ""
        )}

        onChange={(e) => handleChange(e, "OnChange")}
        //onFocus={(e) => handleChange(e, "OnChange")}
        //onBlur={(e) => handleChange(e, "OnBlur")}
        onInput={(e) => handleChange(e, "Input")}
        onRemove={(e) => handleChange(e, "Input")}
        whitelist={WhiteListVariables}
      />
      {/* <div>{"PricingFormulaValue : " + PricingFormulaValue}</div><br></br>
      <div>{" |||| EditPricingFormulaValue : " + EditPricingFormulaValue}</div><br></br>
      <div>{" |||| onBackButtonSavedPricingFormula : " + onBackButtonSavedPricingFormula}</div> */}
    </>
  );

};

export default TagIfy;
