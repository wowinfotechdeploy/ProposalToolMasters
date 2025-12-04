/* global $ */
import React, { useContext, useEffect, useState } from "react";
import "./ServiceStyle.css";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import CommonButtonComponent from "../../../components/CommonButtonComponent";
import { useNavigate } from "react-router-dom";
import Android12Switch from "../../../components/AndroidSwitch";
import { AuthContextProvider } from "../../../AuthContext/AuthContext";
import NoResultFoundModel from "../../../components/NoResultFoundModel";
import {
  CopyService,
  DeleteService,
  GetServiceModel,
  GetServicesList,
  ServicesChangeStatus,
} from "../../../redux/Services/Config/ServicesApi";
import { useSelector } from "react-redux";
import { Tooltip } from "@mui/material";
import ConfirmModel from "../../../components/ConfirmationBox";
import ServicesModel from "../service_categories/ServicesCategoriesModel";
import SuccessModal from "../../../components/SuccessModal";
import ErrorModel from "../../../components/ErrorModel";
import Footer from "../../../components/Footer";
import RecordsAvailablePopupModel from "../../../components/RecordsAvailablePopupModel";
import FilterModel from "../../../components/FilterModel";
const Services = () => {
  // A] States Declaration :
  const moduleName = "Service";
  const {
    setLoader,
    setTopbar,
    maxCountToRecallApi,

    isMobile,
    setListCount,
    getCrudButtonTextName,
    getPlaceholderTextName,
    getCrudButtonToolTipName,
    userAccessData,
    handleErrorMessage,
  } = useContext(AuthContextProvider);
  let getServiceListApiCallCount = 0;
  const navigate = useNavigate();
  const [totalRecords, setTotalRecords] = useState(-1);
  const [serviceList, setServiceList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [modelRequestData, setModelRequestData] = useState({
    serviceKeyID: null,
    ProfessionTypeId: null,
    keyID: null,
    searchKeyword: "",
    Status: "",
    Action: "",
    userKeyID: null,
    Type: null,
  });
  const [businessNatureID, setBusinessNatureID] = useState(null);
  const [prospectType, setProspectType] = useState(null);
  const [isFilterApply, setIsFilterApply] = useState(false);
  const common = useSelector((state) => state.Storage);
  const [showProfessionType, setShowProfessionType] = useState(
    common.organisationKeyID === null || common.professionTypeLists.length > 1
  );
  const formattedErrorMessage = handleErrorMessage(errorMessage);

  // B] Initial useEffect :
  // 1) Will Call Initial Api Like List Api
  useEffect(() => {
    GetServiceListData();
  }, [common.organisationKeyID]);

  useEffect(() => {
    setTopbar("block");
  }, []);

  useEffect(() => {
    if (
      modelRequestData.Action === null &&
      modelRequestData.serviceKeyID === null
    ) {
      navigate("/add-update-service", { state: modelRequestData });
    } else if (
      modelRequestData.Action === "Update" &&
      modelRequestData.serviceKeyID !== null
    ) {
      navigate("/add-update-service", { state: modelRequestData });
    }
  }, [modelRequestData]);
  // B] Calling All Api's like List and other Here :
  // 1) Get Service Category List Data
  const GetServiceListData = async (
    searchKeywordValue,
    businessNatureId,
    businessTypeId
  ) => {
    setLoader(true);
    try {
      const data = await GetServicesList({
        pageSize: 10,
        pageNo: 1,
        organisationKeyID: common.organisationKeyID,
        SearchKeyword:
          searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
        businessTypeID:
          businessTypeId === undefined ? prospectType : businessTypeId,
        businessNatureID:
          businessNatureId === undefined ? businessNatureID : businessNatureId,
      });
      if (data) {
        setLoader(false);
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          getServiceListApiCallCount = 0;
          if (data?.data?.responseData?.data) {
            const totalCount = data.data.totalCount;
            const ServiceListData = data.data.responseData.data;
            setListCount(totalCount);
            setServiceList(ServiceListData);
            setTotalRecords(ServiceListData.length);
          }
        } else {
          if (getServiceListApiCallCount < maxCountToRecallApi) {
            getServiceListApiCallCount += 1;
            setTimeout(function () {
              GetServiceListData();
            }, 1000);
          } else {
            setLoader(false);
          }

          setErrorMessage(data?.data?.errorMessage);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 2) On Click Service Edit Button
  const ServiceEditBtnClicked = async (service, type) => {
    if (type === "editPredefined") {
      setLoader(true);
      const data = await GetServiceModel(service.serviceKeyID, true);
      if (data?.data?.statusCode === 200) {
        setLoader(false);
        setModelRequestData({
          serviceName: service.serviceName,
          serviceKeyID: service.serviceKeyID,
          Action: "Update",
          Type: true,
        });
      } else {
        setLoader(false);
        setErrorMessage(data?.response?.data?.errorMessage);
        setOpenErrorModal(true);
      }
    } else {
      setModelRequestData({
        serviceName: service.serviceName,
        serviceKeyID: service.serviceKeyID,
        Action: "Update",
        Type: null,
      });
    }
  };

  //Handle Change Status Data and Delete Data
  const serviceChangeStatusDataAndDeleteData = async () => {
    console.log(modelRequestData.Action);
    setLoader(true);
    if (modelRequestData.Action === "Status") {
      try {
        const Data = await ServicesChangeStatus(
          modelRequestData.serviceKeyID,
          modelRequestData.userKeyID
        );
        if (Data) {
          setLoader(false);
          if (Data?.data?.statusCode === 200) {
            const servicePackageNames =
              Data?.data?.responseData.serviceExistInPackage
                .map((item) => item.servicePackageName)
                .slice(0, 5);
            const moduleNamesForQuote =
              Data?.data?.responseData.serviceExistinQuote
                .map((item) => item.refID)
                .slice(0, 5);
            const moduleNamesForContract =
              Data?.data?.responseData.serviceExistinContract
                .map((item) => item.refID)
                .slice(0, 5);

            if (
              servicePackageNames.length > 0 ||
              moduleNamesForQuote.length > 0 ||
              moduleNamesForContract.length > 0
            ) {
              let warningMessage = `Following modules are linked to the selected ${moduleName.toLowerCase()}. You must remove these before attempting to mark it as InActive.\n`;

              if (servicePackageNames.length > 0) {
                warningMessage += "\nPackages:\n";
                warningMessage += servicePackageNames
                  .map((x) => `• ${x}`)
                  .join("\n");
              }

              if (moduleNamesForQuote.length > 0) {
                warningMessage += "\nProposals:\n";
                warningMessage += moduleNamesForQuote
                  .map((x) => `• ${x}`)
                  .join("\n");
              }

              if (moduleNamesForContract.length > 0) {
                warningMessage += "\nEngagement Letters:\n";
                warningMessage += moduleNamesForContract
                  .map((x) => `• ${x}`)
                  .join("\n");
              }

              setModelRequestData({
                ...modelRequestData,
                Action: "ServiceWarning",

                message: warningMessage,
                ServiceName: [],
              });
              setErrorMessage(warningMessage);
              setOpenErrorModal(true);
              // $("#" + "RecordsAvailablePopupModel").modal("show");
            } else {
              GetServiceListData(null, null, null);
            }
            // GetServiceListData(null, null, null);
          } else {
            setErrorMessage(Data?.response?.data?.errorMessage);
            GetServiceListData(null, null, null);
            setOpenErrorModal(true);
          }
          $("#ConfirmModel").modal("hide");
        }
      } catch (error) {
        console.log(error);
      }
    } else if (modelRequestData.Action === "Delete") {
      try {
        const Data = await DeleteService(
          modelRequestData.serviceKeyID,
          modelRequestData.userKeyID
        );
        if (Data) {
          setLoader(false);
          if (Data?.data?.statusCode === 200) {
            if (Data?.data?.responseData.serviceExistInPackage.length !== 0) {
              const servicePackageNames =
                Data?.data?.responseData.serviceExistInPackage.map(
                  (item) => item.servicePackageName
                );
              setModelRequestData({
                ...modelRequestData,
                Action: "ServiceWarning",
                message: `Following packages are assigned to the selected ${moduleName.toLowerCase()}.You must remove the packages from this ${moduleName.toLowerCase()} before attempting to mark it as InActive.`,
                ServiceName: servicePackageNames,
              });
              $("#" + "ConfirmModel").modal("show");
              //  GetServiceListData(null, null, null);
            } else {
              setOpenSuccessModal(true);
              GetServiceListData(null, null, null);
            }
          } else {
            setErrorMessage(Data?.response?.data?.errorMessage);
            setOpenErrorModal(true);
          }
          //  GetServiceListData(null, null, null);
        }
      } catch (error) {
        console.log(error);
      }
    } else if (modelRequestData.Action === "Copy") {
      try {
        const CopyServiceData = await CopyService(
          modelRequestData.serviceKeyID,
          modelRequestData.userKeyID
        );
        if (CopyServiceData.data.statusCode === 200) {
          setLoader(false);
          setOpenSuccessModal(true);
          GetServiceListData(null, null, null);
        }
      } catch (error) {
        setLoader(false);
        console.log(error);
      }
    }
  };

  // E] Add Service Click
  const AddServiceBtn = () => {
    if (common.professionTypeLists.length === 1) {
      setModelRequestData({
        serviceName: null,
        ProfessionTypeId: common.professionTypeLists,
        serviceKeyID: null,
        Action: null,
      });
    } else {
      setModelRequestData({
        ProfessionTypeId: null,
        serviceKeyID: null,
        Action: null,
      });
    }
  };

  // Handle Search
  const handleSearch = (e) => {
    const searchKeywordValue = e.target.value;
    setSearchKeyword(searchKeywordValue);
    GetServiceListData(e.target.value);
  };

  //Handle Close
  const handleClose = () => {
    $("#" + "ConfirmModel").modal("hide");
    $("#" + "RecordsAvailablePopupModel").modal("hide");
    if (openErrorModal && formattedErrorMessage?.includes("default state")) {
      GetServiceListData(searchKeyword, businessNatureID, prospectType);
    }
    setOpenSuccessModal(false);
    setOpenErrorModal(false);
  };

  const ApplyFilter = () => {
    if (
      (businessNatureID !== null && businessNatureID !== "") ||
      (prospectType !== null && prospectType !== "")
    ) {
      setIsFilterApply(true);
    } else {
      setIsFilterApply(false);
    }
    GetServiceListData(searchKeyword, businessNatureID, prospectType);
  };
  const ClearFilter = () => {
    setIsFilterApply(false);
    setBusinessNatureID(null);
    setProspectType(null);
    GetServiceListData(searchKeyword, null, null);
  };

  //Design part :
  return (
    <>
    <div className="container-fluid">
      {/* <div class="main-content"> */}
      <div class="services page-background">
        <div class="">
          <div class="row">
            <div class="col-lg-12">
              <div class="card">
                {/* end card header  */}
                <div class="card-body mb-2">
                  <div id="customerList" style={{ marginTop: "3rem" }}>
                    <div class="bg-light border-bottom px-2">
                      <div className="row">
                        <div className="col-md-6 p-0 ">
                          <div class="page-title-cls">Services</div>
                        </div>
                        <div className="col-auto ms-auto">
                          {((userAccessData.Admin_Config_Service_CanAdd &&
                            common.organisationKeyID !== null) ||
                            (userAccessData.SuperAdmin_Config_Service_CanAdd &&
                              common.organisationKeyID === null)) && (
                            <CommonButtonComponent
                              title={getCrudButtonToolTipName(
                                "Add",
                                moduleName
                              )}
                              name={getCrudButtonTextName("Add", moduleName)}
                              AddBtn={() => AddServiceBtn()}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="" id="tablesections">
                    <div class="row">
                      <div class="col-lg-12">
                        <div class="card ">
                          <div class="card-body">
                            <div id="customerList">
                              <div class="row g-4 mb-3"></div>
                              <div class="table-responsive table-card mt-2 mb-3 table-padding">
                                <div className="div">
                                  <div class="search-box ms-2 width-searchbox  ">
                                    <div className="row">
                                      <div className="col-lg-12 col-md-12 col-sm-12 ">
                                        <div className="row align-items-center mt-2">
                                          <div className="col-md-3 col-7">
                                            <div class="search-box w-100 width-searchbox">
                                              <i class="ri-search-line search-icon"></i>
                                              <input
                                                type="text"
                                                value={searchKeyword}
                                                onChange={(e) => {
                                                  handleSearch(e);
                                                }}
                                                className="form-control search"
                                                placeholder={
                                                  isMobile
                                                    ? "Search"
                                                    : getPlaceholderTextName(
                                                        "Search",
                                                        moduleName
                                                      )
                                                }
                                              />
                                            </div>
                                          </div>
                                          <div className="col-md-6 col-3 d-flex align-items-start justify-content-start">
                                            {/* <div className="row"> */}
                                            {/* <div className="col-3"> */}
                                            <Tooltip
                                              title={getCrudButtonToolTipName(
                                                "Filter",
                                                moduleName
                                              )}
                                            >
                                              <div>
                                                <button
                                                  className={
                                                    isFilterApply
                                                      ? "btn btn-md btn-success create-item-btn filter me-2"
                                                      : "btn btn-md btn-success create-item-btn-apply filter me-2"
                                                  }
                                                  data-bs-toggle="modal"
                                                  data-bs-target="#FilterModel"
                                                >
                                                  {/* <i class="ri-pencil-fill"></i> */}

                                                  <i
                                                    className={
                                                      isFilterApply
                                                        ? "ri-filter-fill align-bottom "
                                                        : "ri-filter-fill align-bottom Filter-apply-color"
                                                    }
                                                  ></i>
                                                </button>
                                              </div>
                                            </Tooltip>
                                            {/* </div> */}
                                            {/* <div className="col-9"> */}
                                            {isFilterApply ? (
                                              <Tooltip title={"Clear Filter"}>
                                                <div>
                                                  <button
                                                    className="btn btn-md btn-success create-Filter-item-btn text-nowrap"
                                                    onClick={ClearFilter} // Corrected from onclick to onClick
                                                  >
                                                    <span>Clear Filter</span>
                                                  </button>
                                                </div>
                                              </Tooltip>
                                            ) : (
                                              ""
                                            )}
                                            {/* </div> */}

                                            {/* </div> */}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <table
                                  class="table align-middle table-nowrap  mt-2"
                                  style={{ width: "100%" }}
                                  id="customerTable"
                                >
                                  <tbody class="list form-check-all">
                                    {serviceList?.map((service) => {
                                      return (
                                        <>
                                          <tr>
                                            <td
                                              colSpan={3}
                                              style={{ paddingRight: "0px" }}
                                            >
                                              <div className="d-flex gap-2">
                                                <table
                                                  class="table align-middle table-nowrap"
                                                  id="customerTable"
                                                >
                                                  <tr className="head-row ">
                                                    {isMobile ? (
                                                      <td className="table-content-font">
                                                        {service?.serviceCatName
                                                          .substring(0, 20)
                                                          .replace(
                                                            /\b\w/g,
                                                            (l) =>
                                                              l.toUpperCase()
                                                          )}
                                                      </td>
                                                    ) : service?.serviceCatName
                                                        .length > 40 ? (
                                                      <Tooltip
                                                        title={
                                                          service?.serviceCatName
                                                        }
                                                        style={{
                                                          width: "30%",
                                                        }}
                                                      >
                                                        <td className="table-content-font">
                                                          {service?.serviceCatName
                                                            .substring(0, 40)
                                                            .replace(
                                                              /\b\w/g,
                                                              (l) =>
                                                                l.toUpperCase()
                                                            ) + "..."}
                                                        </td>
                                                      </Tooltip>
                                                    ) : (
                                                      <td>
                                                        {service?.serviceCatName.replace(
                                                          /\b\w/g,
                                                          (l) => l.toUpperCase()
                                                        )}
                                                      </td>
                                                    )}
                                                    <td
                                                      className="tr-table-class text-white profession-type-column"
                                                      style={{
                                                        width: "30%",
                                                      }}
                                                    >
                                                      {showProfessionType && (
                                                        <>Profession Type</>
                                                      )}
                                                    </td>
                                                    <td
                                                      className="tr-table-class text-white"
                                                      style={{
                                                        // backgroundColor:'#808080',
                                                        width: "20%",
                                                      }}
                                                    >
                                                      Status
                                                    </td>
                                                    <td
                                                      className="tr-table-class text-white"
                                                      style={{
                                                        // backgroundColor:'#808080',
                                                        width: "20%",
                                                      }}
                                                    >
                                                      {((userAccessData.Admin_Config_Service_CanEdit &&
                                                        common.organisationKeyID !==
                                                          null) ||
                                                        (userAccessData.SuperAdmin_Config_Service_CanEdit &&
                                                          common.organisationKeyID ===
                                                            null) ||
                                                        (userAccessData.Admin_Config_Service_CanDelete &&
                                                          common.organisationKeyID !==
                                                            null) ||
                                                        (userAccessData.SuperAdmin_Config_Service_CanDelete &&
                                                          common.organisationKeyID ===
                                                            null)) && (
                                                        <>Action</>
                                                      )}
                                                    </td>
                                                  </tr>
                                                  {service?.servicesList?.map(
                                                    (subService) => {
                                                      return (
                                                        <tr
                                                          class={`table_new ${
                                                            !(
                                                              (userAccessData.Admin_Config_Service_CanEdit &&
                                                                common.organisationKeyID !==
                                                                  null) ||
                                                              (userAccessData.SuperAdmin_Config_Service_CanEdit &&
                                                                common.organisationKeyID ===
                                                                  null)
                                                            )
                                                              ? ""
                                                              : "service-table-td"
                                                          } `}
                                                        >
                                                          <td
                                                            style={{
                                                              width: "30%",
                                                            }}
                                                            className="table-content-font"
                                                          >
                                                            {subService.notifySAChanges !==
                                                              null &&
                                                              common.organisationKeyID !==
                                                                null && (
                                                                <>
                                                                  <Tooltip title="View System Administrator Changes">
                                                                    <span
                                                                      onClick={() =>
                                                                        ServiceEditBtnClicked(
                                                                          subService,
                                                                          "editPredefined"
                                                                        )
                                                                      }
                                                                      className="UpdateConfigValue"
                                                                    >
                                                                      <i class="fa fa-regular fa-bell"></i>
                                                                    </span>
                                                                  </Tooltip>
                                                                </>
                                                              )}
                                                            {service.needToUpdate && (
                                                              <span class="text-danger">
                                                                *
                                                              </span>
                                                            )}
                                                            {isMobile ? (
                                                              <>
                                                                {subService
                                                                  .serviceName
                                                                  .length >
                                                                15 ? (
                                                                  <>
                                                                    {subService.serviceName
                                                                      .substring(
                                                                        0,
                                                                        15
                                                                      )
                                                                      .replace(
                                                                        /\b\w/g,
                                                                        (l) =>
                                                                          l.toUpperCase()
                                                                      ) + "..."}
                                                                  </>
                                                                ) : (
                                                                  <>
                                                                    {subService.serviceName.replace(
                                                                      /\b\w/g,
                                                                      (l) =>
                                                                        l.toUpperCase()
                                                                    )}
                                                                  </>
                                                                )}
                                                              </>
                                                            ) : (
                                                              <>
                                                                {subService
                                                                  .serviceName
                                                                  .length >
                                                                45 ? (
                                                                  <Tooltip
                                                                    style={{
                                                                      padding:
                                                                        "0px",
                                                                      color:
                                                                        "#5B626B",
                                                                    }}
                                                                    title={
                                                                      subService.serviceName
                                                                    }
                                                                  >
                                                                    {subService.serviceName
                                                                      .substring(
                                                                        0,
                                                                        45
                                                                      )
                                                                      .replace(
                                                                        /\b\w/g,
                                                                        (l) =>
                                                                          l.toUpperCase()
                                                                      ) + "..."}
                                                                  </Tooltip>
                                                                ) : (
                                                                  <>
                                                                    {subService.serviceName.replace(
                                                                      /\b\w/g,
                                                                      (l) =>
                                                                        l.toUpperCase()
                                                                    )}
                                                                  </>
                                                                )}
                                                              </>
                                                            )}
                                                          </td>

                                                          <td
                                                            style={{
                                                              width: "30%",
                                                            }}
                                                            className="table-content-font"
                                                          >
                                                            {showProfessionType &&
                                                              subService.professionTypeNames}
                                                          </td>
                                                          <td
                                                            style={{
                                                              width: "20%",
                                                            }}
                                                            className="table-content-font"
                                                          >
                                                            <div
                                                              class="d-flex gap-2 "
                                                              style={{
                                                                padding: "0px",
                                                              }}
                                                            >
                                                              <div className="edit">
                                                                {" "}
                                                                {
                                                                  subService.statusName
                                                                }
                                                              </div>
                                                              {((userAccessData.Admin_Config_Service_CanDelete &&
                                                                common.organisationKeyID !==
                                                                  null) ||
                                                                (userAccessData.SuperAdmin_Config_Service_CanDelete &&
                                                                  common.organisationKeyID ===
                                                                    null)) && (
                                                                <Tooltip
                                                                  title={getCrudButtonToolTipName(
                                                                    "Change Status"
                                                                  )}
                                                                >
                                                                  <FormGroup>
                                                                    <FormControlLabel
                                                                      control={
                                                                        <Android12Switch
                                                                          onClick={() =>
                                                                            setModelRequestData(
                                                                              {
                                                                                ...modelRequestData,
                                                                                serviceKeyID:
                                                                                  subService.serviceKeyID,
                                                                                status:
                                                                                  subService.statusName,
                                                                                userKeyID:
                                                                                  common.userKeyID,
                                                                                Action:
                                                                                  "Status",
                                                                              }
                                                                            )
                                                                          }
                                                                          checked={
                                                                            subService.statusName ===
                                                                            "Active"
                                                                          }
                                                                          data-bs-toggle="modal"
                                                                          data-bs-target="#ConfirmModel"
                                                                        />
                                                                      }
                                                                    />
                                                                  </FormGroup>
                                                                </Tooltip>
                                                              )}
                                                            </div>
                                                          </td>
                                                          <td
                                                            style={{
                                                              width: "20%",
                                                            }}
                                                            className="table-content-font"
                                                          >
                                                            <div
                                                              style={{
                                                                padding: "0px",
                                                              }}
                                                              class="d-flex gap-2"
                                                            >
                                                              <Tooltip
                                                                title={getCrudButtonToolTipName(
                                                                  "Copy",
                                                                  moduleName
                                                                )}
                                                              >
                                                                <div class="edit">
                                                                  <button
                                                                    onClick={() =>
                                                                      setModelRequestData(
                                                                        {
                                                                          ...modelRequestData,
                                                                          serviceKeyID:
                                                                            subService.serviceKeyID,
                                                                          serviceCatName:
                                                                            subService.serviceName,
                                                                          userKeyID:
                                                                            common.userKeyID,
                                                                          Action:
                                                                            "Copy",
                                                                        }
                                                                      )
                                                                    }
                                                                    class="btn btn-sm btn-success edit-item-btn edit"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#ConfirmModel"
                                                                  >
                                                                    <i class="fa-solid fa-copy"></i>
                                                                  </button>
                                                                </div>
                                                              </Tooltip>
                                                              {((userAccessData.Admin_Config_Service_CanEdit &&
                                                                common.organisationKeyID !==
                                                                  null) ||
                                                                (userAccessData.SuperAdmin_Config_Service_CanEdit &&
                                                                  common.organisationKeyID ===
                                                                    null)) && (
                                                                <Tooltip
                                                                  title={getCrudButtonToolTipName(
                                                                    "Update",
                                                                    moduleName
                                                                  )}
                                                                >
                                                                  <div class="edit">
                                                                    <button
                                                                      onClick={() =>
                                                                        ServiceEditBtnClicked(
                                                                          subService
                                                                        )
                                                                      }
                                                                      class="btn btn-sm btn-success edit-item-btn actionButtonsStyle"
                                                                    >
                                                                      <i class="ri-pencil-fill"></i>
                                                                    </button>
                                                                  </div>
                                                                </Tooltip>
                                                              )}
                                                              {((userAccessData.Admin_Config_Service_CanDelete &&
                                                                common.organisationKeyID !==
                                                                  null) ||
                                                                (userAccessData.SuperAdmin_Config_Service_CanDelete &&
                                                                  common.organisationKeyID ===
                                                                    null)) && (
                                                                <Tooltip
                                                                  title={getCrudButtonToolTipName(
                                                                    "Delete",
                                                                    moduleName
                                                                  )}
                                                                >
                                                                  <div class="remove">
                                                                    <button
                                                                      class="btn btn-sm btn-danger remove-item-btn actionButtonsStyle"
                                                                      data-bs-toggle="modal"
                                                                      data-bs-target="#ConfirmModel"
                                                                      onClick={() =>
                                                                        setModelRequestData(
                                                                          {
                                                                            ...modelRequestData,
                                                                            serviceKeyID:
                                                                              subService.serviceKeyID,
                                                                            serviceCatName:
                                                                              subService.serviceName,
                                                                            userKeyID:
                                                                              common.userKeyID,
                                                                            Action:
                                                                              "Delete",
                                                                          }
                                                                        )
                                                                      }
                                                                    >
                                                                      <i class="ri-delete-bin-5-fill"></i>
                                                                    </button>
                                                                  </div>
                                                                </Tooltip>
                                                              )}
                                                            </div>
                                                          </td>
                                                        </tr>
                                                      );
                                                    }
                                                  )}
                                                </table>
                                              </div>
                                            </td>
                                          </tr>
                                        </>
                                      );
                                    })}
                                  </tbody>
                                </table>

                                {totalRecords <= 0 && (
                                  <NoResultFoundModel
                                    name={moduleName}
                                    totalRecords={totalRecords}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <ErrorModel
                      ErrorModel={openErrorModal}
                      handleClose={handleClose}
                      ErrorMessage={formattedErrorMessage}
                    />

                    <ConfirmModel
                      openErrorModal={openErrorModal}
                      openSuccessModal={openSuccessModal}
                      modelRequestData={modelRequestData}
                      UpdatedStatus={serviceChangeStatusDataAndDeleteData}
                    />
                    <RecordsAvailablePopupModel
                      handleClose={handleClose}
                      openErrorModal={openErrorModal}
                      openSuccessModal={openSuccessModal}
                      modelRequestData={modelRequestData}
                      UpdatedStatus={serviceChangeStatusDataAndDeleteData}
                    />

                    <SuccessModal
                      handleClose={handleClose}
                      setOpenSuccessModal={setOpenSuccessModal}
                      openSuccessModal={openSuccessModal}
                      modelAction={modelRequestData.Action}
                      message={
                        modelRequestData.Action === "Copy"
                          ? `The Copy of ${modelRequestData.serviceCatName} has been created successfully!`
                          : modelRequestData.Action === "Delete"
                          ? `${moduleName} ${modelRequestData.serviceCatName}`
                          : "Status has been changed successfully!"
                      }
                    />

                    {/* Modal  */}
                    <ServicesModel
                      class="modal fade"
                      id="addUpdateModal"
                      tabIndex="-1"
                      aria_labelledby="exampleModalLabel"
                      aria_hidden="true"
                      setIsAddUpdateActionDone={setIsAddUpdateActionDone}
                      modelRequestData={modelRequestData}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* container-fluid  */}
      </div>
      {/* End Page-content */}
      
      {/* </div> */}
      <FilterModel
        class="modal fade"
        id="FilterModel"
        tabIndex="-1"
        aria_labelledby="exampleModalLabel"
        aria_hidden="true"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        ModuleName={moduleName}
        ApplyFilter={ApplyFilter}
        businessNatureID={businessNatureID}
        setBusinessNatureID={setBusinessNatureID}
        prospectType={prospectType}
        setProspectType={setProspectType}
      />
      {/* start back-to-top */}
      <button class="btn btn-danger btn-icon" id="back-to-top">
        <i class="ri-arrow-up-line"></i>
      </button>
      {/* end back-to-top */}
    </div>
    <Footer />
    </>
  );
};

export default Services;
