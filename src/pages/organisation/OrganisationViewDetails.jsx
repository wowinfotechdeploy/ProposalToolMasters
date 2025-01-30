/* global $ */
import React, { useContext, useEffect, useState } from "react";
import "../proposals/Proposals.css";
import "../../pages/user/UsersStyle.css";
import { useSelector } from "react-redux";
import CommonButtonComponent from "../../components/CommonButtonComponent";
import { Row, Col, Card, CardBody } from "reactstrap";
import {
  DeleteUser,
  GetInviteUsersList,
} from "../../redux/Services/Setting/InviteUserApi";
import ConfirmModel from "../../components/ConfirmationBox";
import { Tooltip } from "@mui/material";
import SuccessModal from "../../components/SuccessModal";
import { AuthContextProvider } from "../../AuthContext/AuthContext";
import ErrorModel from "../../components/ErrorModel";
import Footer from "../../components/Footer";
import UsersModel from "../Settings/users/UsersModel";
import { useLocation, useNavigate } from "react-router-dom";
import {
  GetOrganisationInformationModel,
  GetOrganisationPlanList,
} from "../../redux/Services/Setting/Organisation";
import { CountryCode } from "../../redux/Services/CountryApi";
import { GetIncorporatedInLookUpList } from "../../redux/Services/Master/IncorporatedInLookUpList";
import { GetCurrencyTypeList } from "../../redux/Services/Master/CurrencyTypeLookUpList";
import { CLIENT_TYPES } from "../../Middleware/enums";
import PaginationComponent from "../../components/PaginationModel";
import SubscriptionView from "../../components/SubscriptionView";
import {
  ChoosePlanApi,
  CreateStripeCheckoutSession,
} from "../../redux/Services/Setting/PaymentGatewayApi";
import { GetUserSubscriptionPackageModel } from "../../redux/Services/Subscription/UserListApi";
const OrganisationViewDetails = () => {
  let getInviteUsersListApiCallCount = 0;
  // A] States Declaration :
  const [inviteUsersList, setInviteUsersList] = useState([]);
  const [openPurchaseModal, setOpenPurchaseModal] = React.useState(false);
  const location = useLocation();
  const [subScriptionPlaneList, setSubScriptionPlaneList] = useState([]);

  const [UserListCount, setUserListCount] = useState([]);
  const [currentPageUsers, setCurrentPageUsers] = useState(1);
  const totalUserPage = Math.ceil(UserListCount / 10); // Calculate the total number of pages based on listCount
  const [saveLocationState, setSaveLocationState] = useState(location.state);
  const [modelRequestData, setModelRequestData] = useState({
    userName: null,
    organisationKeyID: null,
    inviteUserKeyID: null,
    Action: null,
    userKeyID: null,
    status: null,
  });
  const [professionTypeValue, setProfessionTypeValue] = useState("");
  const [concatenatedRegisterAddress, setConcatenatedRegisterAddress] =
    useState("");
  const [concatenatedTradingAddress, setConcatenatedTradingAddress] =
    useState("");
  const [concatenatedResidentialAddress, setConcatenatedResidentialAddress] =
    useState([{ officersFullAddress: "" }]);
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currencyType, setCurrencyType] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeywordUsers, setSearchKeywordUsers] = useState("");
  const [primarySortDirectionUsers, setPrimarySortDirectionUsers] =
    useState(null); //setPrimarySortDirectionUsers
  const [primaryUserSortDirectionObj, setPrimaryUserSortDirectionObj] =
    useState({
      UserNameTypeSort: null,
      RoleTypeSort: null,
      AcceptanceStatusTypeSort: null,
      EmailTypeSort: null,
    });
  const [subScriptionActiveList, setSubScriptionActiveList] = useState({});

  const [UserSortType, setUserSortType] = useState("");
  const common = useSelector((state) => state.Storage); //Getting Logged Users Details From Persist Storage of redux hooks
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const {
    setTopbar,
    prospectName,
    setLoader,
    EngagementName,
    proposalName,
    maxCountToRecallApi,
    totalPage,
    isMobile,
    setListCount,
    listCount,
    desktopRecords,
    isMobileRecords,
    getCrudButtonTextName,
    getPlaceholderTextName,
    getCrudButtonToolTipName,
    userAccessData,
    GetCustomDate,
    formatValue,
    formatValueWithoutCurrencySymbol
  } = useContext(AuthContextProvider);
  const [chooseApiData, setChooseApiData] = useState();
  const pageSize = isMobile ? isMobileRecords : desktopRecords;
  const [basicInfo, setBasicInfo] = useState({
    businessTypeID: null,
    businessTypeName: null,
    tradingName: null,
    professionTypeList: [],
    tradingStartDate: "",
    signatureImageUrl: null,
    tradingAddress: {
      addressId: null,
      premises: null,
      addressLine1: null,
      addressLine2: null,
      locality: null,
      region: null,
      countryId: null,
      postcode: null,
      countryName: null,
    },
    signatoryName: null,
    signatoryImage: null,
    searchCompany: null,
    regOfficeAddress: null,
  });
  const [otherInfo, setOtherInfo] = useState({
    orgOtherInfoId: null,
    VATReg: null,
    vatNumber: null,
    preferredCurrency: 1,
    website: null,
    logoUrl: null,
    contactEmail: null,
    contactPhone: null,
    countryCode: null,
    logo: null,
    brandColor: "#00AFEF",
    businessTagline: null,
    countryCodeID: null,
    AffiliatedAcBodyName: null,
    webOfAffiliatedAccount: null,
  });
  const [companyForm, setCompanyForm] = useState({
    companyID: 0,
    companyName: null,
    companyType: null,
    companyNumber: null,
    companyStatus: null,
    addressID: 0,
    incorporationDate: null,
    incInID: 0,
    moduleName: null,
    moduleID: 0,
    companyAddress: {
      addressId: null,
      premises: null,
      addressLine1: null,
      addressLine2: null,
      locality: null,
      region: null,
      countryId: null,
      postcode: null,
    },
  });
  const [subscriptionPackageObj, setSubscriptionPackageObj] = useState({
    ospKeyID: null,
    subscriptionPackageKeyID: null,
    packageName: "",
    apiIntegration: null,
    prepareQuote: false,
    sendQuote: false,
    prepareContract: false,
    sendContract: false,
    signContract: false,
    eSignaturePerMonth: "",
    yearlyValuePlan: "",
    discountPercentage: "",
    discountPrice: "",
    monthFree: "",
    getMonths: "",
    inPriceOfMonth: "",
    isMailBox: false,
  });
  const [officersForm, setOfficers] = useState([
    {
      organisationKeyID: saveLocationState?.OrgKeyID,
      userKeyID: common.userKeyID,
      organisationID: common.organisationID,
      officerID: null,
      firstName: "",
      lastName: "",
      countryCodeID: 9,
      phoneCountryCodeID: { value: 9, label: "+44" },
      phoneNo: null,
      emailID: "",
      addressID: null,
      isAuthorisedSignatory: 0,
      officerRole: "",
      appointedOn: "",
      moduleName: null,
      moduleID: 0,
      officersAddress: {
        addressId: null,
        premises: null,
        addressLine1: null,
        addressLine2: null,
        locality: null,
        region: null,
        countryId: null,
        postcode: null,
      },
    },
  ]);
  const navigate = useNavigate();

  const [incorporatedInList, setIncorporatedInList] = useState([]);

  // B] Initial useEffect :
  // 1) Will Call Initial Api Like List Api
  useEffect(() => {
    setTopbar("block");
    GetInviteUsersListData(1);
    GetIncorporatedInLookUpListData();
    GetCurrencyListData();
  }, [common.organisationKeyID]);

  useEffect(() => {
    if (
      saveLocationState?.Action !== undefined &&
      saveLocationState?.Action !== null
    ) {
      GetOrganisationInformationModelData(saveLocationState?.OrgKeyID);
      GetOrganisationPlanListData(1);
    }
  }, [saveLocationState]);
  //2) This useEffect will trigger when we successfully add or update record from popup model
  useEffect(() => {
    if (isAddUpdateActionDone) {
      if (modelRequestData.Action === null) {
        setCurrentPage(1);
        GetInviteUsersListData(1, null, null);
      } else {
        GetInviteUsersListData(currentPage);
      }
      setIsAddUpdateActionDone(false);
    }
  }, [isAddUpdateActionDone]);
  // const handleOpenSubscriptionModel = (subscriptionObj) => {
  //   setActiveOrganizationKeyId(subscriptionObj.ospKeyID);
  //   // setSubscriptionModal(true)
  // };
  const handleClosePurchaseModel = () => {
    setOpenPurchaseModal(false);
  };
  const handleOpenPurchaseModel = async (value) => {
    // setActiveOrganizationKeyIdForUpgradePlan(value.organisationKeyID)
    await ChoosePlanApiModelData();
    navigate("/ChoosePlan", {
      state: { organizationKeyId: saveLocationState?.OrgKeyID },
    });
    // If API call is successful, set state to open the modal
    // setOpenPurchaseModal(true);
  };

  const handleOpenSubscriptionModel = (subscriptionObj) => {
    GetSubscriptionPackageModelData(subscriptionObj.ospKeyID);
    // setSubscriptionModal(true)
  };

  const GetSubscriptionPackageModelData = async (id) => {
    if (!id) {
      return;
    }
    //..............Subscription package Edit Data Api...................
    try {
      const data = await GetUserSubscriptionPackageModel(id);
      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          const ModelData = data?.data?.responseData?.data;
          setSubscriptionPackageObj({
            ...subscriptionPackageObj,
            ospKeyID: ModelData.ospKeyID,
            apiIntegration: ModelData.apiIntegration,
            subscriptionPackageKeyID: ModelData.subscriptionPackageKeyID,
            packageName: ModelData.packageName,
            prepareQuote: ModelData.prepareQuote,
            sendQuote: ModelData.sendQuote,
            prepareContract: ModelData.prepareContract,
            sendContract: ModelData.sendContract,
            signContract: ModelData.signContract,
            eSignaturePerMonth: ModelData.eSignaturePerMonth,
            yearlyValuePlan: ModelData.yearlyValuePlan,
            discountPercentage: ModelData.discountPercentage,
            discountPrice: ModelData.discountPrice,
            monthFree: ModelData.monthFree,
            getMonths: ModelData.getMonths,
            inPriceOfMonth: ModelData.inPriceOfMonth,
            isMailBox: ModelData.isMailBox,
          });
        }
      } else {
        // setErrorMessage(data?.data?.errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // C] Calling All Api's like List and other Here :
  // 1) Get Users List Data
  const GetInviteUsersListData = async (
    i,
    searchKeywordValue,
    sortValue,
    UserSort
  ) => {
    setLoader(true);
    try {
      const data = await GetInviteUsersList({
        pageSize: 10,
        pageNo: i - 1,
        organisationKeyID: saveLocationState?.OrgKeyID,
        userKeyID: common.userKeyID,
        searchKeyword:
          searchKeywordValue === undefined
            ? searchKeywordUsers
            : searchKeywordValue,
        primarySortDirection:
          sortValue === undefined ? primarySortDirectionUsers : sortValue,
        PrimarySortColumnName:
          UserSort == undefined || UserSort == null || UserSort == ""
            ? UserSortType
            : UserSort,
      });
      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          getInviteUsersListApiCallCount = 0;
          if (data?.data?.responseData?.data) {
            const totalCount = data.data.totalCount;
            const InviteUsersListData = data.data.responseData.data;
            setUserListCount(totalCount);
            setInviteUsersList(InviteUsersListData);
          }
        } else {
          if (getInviteUsersListApiCallCount < maxCountToRecallApi) {
            getInviteUsersListApiCallCount += 1;
            setTimeout(function () {
              GetInviteUsersListData(
                i,
                searchKeywordValue,
                sortValue,
                UserSort
              );
            }, 2000);
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
  const RedirectStripeCheckout = (subscription) => {
    CreateStripeCheckoutSessionRedirection(
      common.userKeyID,
      subscription.invoiceKeyID
    );
  };
  const CreateStripeCheckoutSessionRedirection = async (
    userKeyID,
    InvoiceKeyID
  ) => {
    setLoader(true);
    try {
      const response = await CreateStripeCheckoutSession(
        userKeyID,
        InvoiceKeyID
      );
      const data = response.data;

      if (data.statusCode === 200) {
        setLoader(false);
        const sessionURL = data.responseData.sessionURL;

        window.open(sessionURL, "_self");
      } else {
        console.error("Error fetching data from the API");
        setLoader(false);
      }
    } catch (error) {
      console.error("Error fetching data from the API", error);
      setLoader(false);
    }
  };
  // 2]Get Organisation details api
  const GetOrganisationInformationModelData = async (id) => {
    if (!id) {
      return;
    }
    setLoader(true);
    const response = await GetOrganisationInformationModel(id);
    if (response) {
      if (response?.data?.statusCode === 200) {
        setLoader(false);
        const ModelData = response?.data?.responseData?.data;
        let tradingAddressObj = {
          addressId: ModelData.organisationAddress.addressId,
          premises: ModelData.organisationAddress.premises,
          addressLine1: ModelData.organisationAddress.addressLine1,
          addressLine2: ModelData.organisationAddress.addressLine2,
          locality: ModelData.organisationAddress.locality,
          region: ModelData.organisationAddress.region,
          countryId: ModelData.organisationAddress.countryID,
          postcode: ModelData.organisationAddress.postcode,
          countryName: ModelData.organisationAddress.countryName,
        };

        setBasicInfo({
          businessTypeID: ModelData.businessTypeID,
          businessTypeName: ModelData.businessTypeName,
          tradingName: ModelData.tradingBusinessName,
          tradingStartDate: ModelData.tradingStartDate,
          tradingAddress: tradingAddressObj,
          signatoryName: ModelData.otherInformation.signatoryName,
          signatureImageUrl: ModelData.otherInformation.signatureImageUrl,
          professionTypeList: ModelData.professionTypeList, //this will be professional type array
        });
        const professionTypeName = ModelData.professionTypeList.map((item) => {
          return item.professionTypeName;
        });

        setProfessionTypeValue(professionTypeName);
        setOtherInfo({
          orgOtherInfoId: ModelData.otherInformation.orgOtherInfoId,
          VATReg: ModelData.otherInformation.isVatRegistered,
          vatNumber: ModelData.otherInformation.vatNumber,
          preferredCurrency: ModelData.otherInformation.preferredCurrencyId,
          website: ModelData.otherInformation.website,
          contactEmail: ModelData.otherInformation.emailID,
          contactPhone: ModelData.otherInformation.phoneNo,
          countryCode: ModelData.otherInformation.countryCode,
          logoUrl: ModelData.otherInformation.logoUrl,
          brandColor: ModelData.otherInformation.brandColor,
          businessTagline: ModelData.otherInformation.businessTagline,
          countryCodeID: ModelData.otherInformation.countryCodeID,
          AffiliatedAcBodyName:
            ModelData.otherInformation.affiliatedAccountingBodyName,
          webOfAffiliatedAccount:
            ModelData.otherInformation.affiliatedAccountingBodyWebsite,
        });

        let CountryList;
        const countryCodeData = await CountryCode();
        if (countryCodeData?.data?.statusCode === 200) {
          if (countryCodeData?.data?.responseData?.data) {
            CountryList = countryCodeData?.data?.responseData?.data;
            CountryList = CountryList.map((countryCode) => ({
              value: countryCode.countryCodeId,
              label: countryCode.countryCode,
            }));
          }
        }

        let officerArray = [];
        ModelData.officersList.forEach((item) => {
          const PhoneSelectedValue = CountryList.find(
            (countryCode) => item.countryCodeID == countryCode.value
          );
          let officerObj = {
            organisationKeyID: saveLocationState?.OrgKeyID,
            userKeyID: common.userKeyID,
            organisationID: common.organisationID,
            officerID: item.officerID,
            firstName: item.firstName,
            lastName: item.lastName,
            countryCodeID: item.countryCodeID,
            phoneCountryCodeID: PhoneSelectedValue,
            phoneNo: item.phoneNo,
            emailID: item.emailID,
            addressID: item.addressID,
            isAuthorisedSignatory: item.isAuthorisedSignatory,
            officerRole: item.officerRole,
            appointedOn: item.appointedOn,
            moduleName: item.moduleName,
            moduleID: item.moduleID,
            officersAddress: {
              addressId: item.officersAddress.addressId,
              premises: item.officersAddress.premises,
              addressLine1: item.officersAddress.addressLine1,
              addressLine2: item.officersAddress.addressLine2,
              locality: item.officersAddress.locality,
              region: item.officersAddress.region,
              countryId: item.officersAddress.countryID,
              postcode: item.officersAddress.postcode,
              countryName: item.officersAddress.countryName,
            },
          };
          officerArray.push(officerObj);
        });

        setOfficers(officerArray);
        let companyObj = {
          companyID: ModelData.companyDetails.companyID,
          companyName: ModelData.companyDetails.companyName,
          companyType: ModelData.companyDetails.companyType,
          companyNumber: ModelData.companyDetails.companyNumber,
          companyStatus: ModelData.companyDetails.companyStatus,
          addressID: ModelData.companyDetails.addressID,
          incorporationDate: ModelData.companyDetails.incorporationDate,
          incInID: ModelData.companyDetails.incInID,
          moduleName: ModelData.companyDetails.moduleName,
          moduleID: ModelData.companyDetails.moduleID,
          companyAddress: {
            addressId: ModelData.companyDetails.companyAddress?.addressId,
            premises: ModelData.companyDetails.companyAddress?.premises,
            addressLine1: ModelData.companyDetails.companyAddress?.addressLine1,
            addressLine2: ModelData.companyDetails.companyAddress?.addressLine2,
            locality: ModelData.companyDetails.companyAddress?.locality,
            region: ModelData.companyDetails.companyAddress?.region,
            countryId: ModelData.companyDetails.companyAddress?.countryId,
            postcode: ModelData.companyDetails.companyAddress?.postcode,
            countryName: ModelData.companyDetails.companyAddress?.countryName,
          },
        };

        setCompanyForm(companyObj);
        const fullAddress = concatenateFullAddress(
          ModelData.companyDetails?.companyAddress
        );
        setConcatenatedRegisterAddress(fullAddress);
        let CorrespondenceOrResidentialAddress = [];
        ModelData.officersList.forEach((officer, index) => {
          const address = officer.officersAddress;
          if (address) {
            let fullAddressConcatenation = concatenateFullAddress(address);
            let CorrespondenceOrResidentialAddressObj = {
              officersFullAddress: fullAddressConcatenation,
            };
            CorrespondenceOrResidentialAddress.push(
              CorrespondenceOrResidentialAddressObj
            );
          } else {
            CorrespondenceOrResidentialAddress.push({
              officersFullAddress: null,
            });
          }
        });
        setConcatenatedResidentialAddress(CorrespondenceOrResidentialAddress);
        if (ModelData.organisationAddress) {
          const fullAddress = concatenateFullAddress(
            ModelData.organisationAddress
          );
          setConcatenatedTradingAddress(fullAddress);
        }
      } else {
        setLoader(false);
        setErrorMessage(response?.data?.errorMessage);
      }
    }
  };
  const GetPlanList = () => {
    GetOrganisationPlanListData(1);
  };
  useEffect(() => {
    if (location.state?.organizationKeyId !== null) {
      GetOrganisationPlanListData(1, location.state?.organizationKeyId);
    }
  }, [location.state]);

  const GetOrganisationPlanListData = async (i, orgId) => {
    setLoader(true);
    const pageNoList = i - 1;
    let getOrganisationListCallCount = 0;
    try {
      const data = await GetOrganisationPlanList({
        pageSize: pageSize,
        pageNo: pageNoList,
        userKeyID: common.userKeyID,
        organisationKeyID: saveLocationState?.OrgKeyID || orgId,
      });

      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          if (data?.data?.responseData) {
            const SubScriptionListData = data?.data?.responseData;
            const totalCount = data.data.totalCount;
            if (pageNoList > 0 && SubScriptionListData.length === 0) {
              let newPaneNo = Number(pageNoList);
              if (newPaneNo > 1) {
                newPaneNo = newPaneNo - 1;
              }
              GetOrganisationPlanListData(newPaneNo);
              setCurrentPage(pageNoList);
              return;
            }
            setListCount(totalCount);
            // Extract planList and store in subscriptionList state
            setSubScriptionPlaneList(SubScriptionListData?.planList || []);
            setSubScriptionActiveList(SubScriptionListData?.activePlan || []);
          }
        } else {
          if (getOrganisationListCallCount < maxCountToRecallApi) {
            getOrganisationListCallCount += 1;
            setTimeout(function () {
              GetOrganisationPlanListData(i);
            }, 2000);
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
  // Currency Lookup list
  const GetCurrencyListData = async () => {
    try {
      const data = await GetCurrencyTypeList();
      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          let CurrencyList = data?.data?.responseData?.data;
          CurrencyList = CurrencyList.map((currency) => ({
            value: currency.currencyId,
            label: currency.currencyName,
          }));
          setCurrencyType(CurrencyList);
          officersForm.forEach((element) => {
            element.countryCodeID = CurrencyList[0].countryCodeId;
          });
        }
      }
    } catch (error) { }
  };

  const GetIncorporatedInLookUpListData = async () => {
    try {
      const data = await GetIncorporatedInLookUpList();
      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          let incorporateInListData = data?.data?.responseData?.data;
          incorporateInListData = incorporateInListData.map((incIn) => ({
            value: incIn.incInID,
            label: incIn.incInName,
          }));
          setIncorporatedInList(incorporateInListData);
        }
      }
    } catch (error) { }
  };

  // E] Event Handling Functions will call here.
  // 1) On Click Users Add Button
  const UsersAddBtnClicked = (users) => {
    {
      setModelRequestData({
        ...modelRequestData,
        organisationKeyID: saveLocationState?.OrgKeyID,
        Action: null,
      });
    }
  };

  // Update Function Modal
  // 2) On Click user Status Button
  const InviteUserChangeStatusData = async () => {
    setLoader(true);
    if (modelRequestData.Action === "Delete") {
      try {
        const Data = await DeleteUser(
          modelRequestData.inviteUserKeyID,
          common.userKeyID
        );
        if (Data) {
          setLoader(false);
          if (Data?.data?.statusCode === 200) {
            setSuccessMessage(
              `User ${modelRequestData.userName}`
            );
            setOpenSuccessModal(true);
          } else {
            setErrorMessage(Data?.response?.data?.errors?.InviteUserKeyID[0]);
            setOpenErrorModal(true);
          }

          GetInviteUsersListData(currentPage);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const concatenateFullAddress = (address) => {
    const addPart = (part) => (part ? `${part}, ` : "");
    let concatenatedAddress = `${addPart(address?.addressLine1)}${addPart(
      address?.addressLine2
    )}${addPart(address?.locality)}${addPart(address?.region)}${addPart(
      address?.country
    )}${addPart(address?.countryName)}${address?.postcode || ""}`;

    // Remove trailing comma, if present
    if (concatenatedAddress.endsWith(", ")) {
      concatenatedAddress = concatenatedAddress.slice(0, -2);
    }
    return concatenatedAddress;
  };

  // E] Sorting & handle Function
  const handleUserSort = (sortValue, UserSort) => {
    if (UserSort == "FirstName") {
      setPrimarySortDirectionUsers(sortValue);
      setPrimaryUserSortDirectionObj({
        ...primaryUserSortDirectionObj,
        UserNameTypeSort: sortValue,
      });
      setCurrentPage(1);
      GetInviteUsersListData(1, searchKeywordUsers, sortValue, UserSort);
    } else if (UserSort == "RoleName") {
      setPrimarySortDirectionUsers(sortValue);
      setPrimaryUserSortDirectionObj({
        ...primaryUserSortDirectionObj,
        RoleTypeSort: sortValue,
      });
      setCurrentPage(1);
      GetInviteUsersListData(1, searchKeywordUsers, sortValue, UserSort);
    } else if (UserSort == "Email") {
      setPrimarySortDirectionUsers(sortValue);
      setPrimaryUserSortDirectionObj({
        ...primaryUserSortDirectionObj,
        EmailTypeSort: sortValue,
      });
      setCurrentPage(1);
      GetInviteUsersListData(1, searchKeywordUsers, sortValue, UserSort);
    }
  };
  const HandleSearch = (e) => {
    const searchKeywordValue = e.target.value;
    setSearchKeywordUsers(searchKeywordValue);
    setCurrentPage(1);
    GetInviteUsersListData(1, searchKeywordValue);
  };

  const ChoosePlanApiModelData = async () => {
    try {
      const data = await ChoosePlanApi();
      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          const ModelData = data?.data?.responseData?.data;

          setChooseApiData(ModelData);
        }
      } else {
        setErrorMessage(data?.data?.errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleClose = () => {
    $("#" + "ConfirmModel").modal("hide");
    setOpenSuccessModal(false);
    setOpenErrorModal(false);
  };

  //pagination for invite user

  const HandlePageChangeUsers = async (pageNumber) => {
    setCurrentPageUsers(pageNumber);
    await GetInviteUsersListData(pageNumber); // Call your function with the selected page number
  };
  const currencyFilter = currencyType.find(
    (item) => otherInfo.preferredCurrency == item.value
  );

  const IncorporatedValue = incorporatedInList.filter(
    (item) => companyForm?.incInID == item.value
  );
  return (
    <div className="container">
      <div class="main-content">
        <div class="page-content page-background prospect-bg">
          <div class="page-info-header page-info-strip">
            <div class="container">
              <div className="row">
                <div className="col-md-6 col-sm-6 col-6 ">
                  <div class="page-title-cls">
                    Organisation/Practice Name: {basicInfo.tradingName}
                  </div>
                </div>
                <div class="col-md-6 col-sm-6 col-6">
                  <div
                    class="d-flex justify-content-sm-end add-new-btn"
                    style={{ float: "right" }}
                  >
                    <button
                      className="btn btn-success create-item create-item-btn "
                      onClick={() => navigate("/organisations")}
                    >
                      <Tooltip title={"Back"}>
                        <span>Back</span>
                      </Tooltip>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="container-fluid ">
            <div class="row">
              <div className="col-lg-12">
                <div class="card" style={{ marginTop: "75px" }}>
                  <div class="card-body">
                    <div id="customerList">
                      <div class="row g-4 mb-3"></div>
                      <div class="search-box ms-2 width-searchbox prospect-form">
                        <div class=" table-card  mb-3 Height_View_scroll scroll-hidden  ">
                          <ul class="nav nav-tabs mb-3">
                            <li class="nav-item">
                              <a
                                class="nav-link tab_nav active"
                                data-bs-toggle="tab"
                                href="#base-justified-home"
                                role="tab"
                                aria-selected="false"
                              >
                                Organisation/Practice Details
                              </a>
                            </li>
                            <li class="nav-item">
                              <a
                                onClick={() => GetInviteUsersListData(1)}
                                class="nav-link tab_nav"
                                data-bs-toggle="tab"
                                href="#product"
                                role="tab"
                                aria-selected="false"
                              >
                                Invite User
                              </a>
                            </li>
                            <li class="nav-item">
                              <a
                                class="nav-link tab_nav"
                                data-bs-toggle="tab"
                                href="#Plan"
                                role="tab"
                                aria-selected="false"
                              >
                                Subscription Plan
                              </a>
                            </li>
                          </ul>
                          <div class="tab-content  text-muted">
                            <div
                              class="tab-pane active"
                              id="base-justified-home"
                              role="tabpanel"
                            >
                              <table class="table table-striped fs-13 view-details-table">
                                <tbody>
                                  <tr>
                                    <th colspan="2">Basic Information</th>
                                  </tr>
                                  <tr>
                                    <td>Profession Type</td>
                                    <td class="text-end">
                                      {professionTypeValue}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Business Type</td>
                                    <td class="text-end">
                                      {basicInfo.businessTypeName}
                                    </td>
                                  </tr>

                                  <tr>
                                    <td class="break-table" colspan="2"></td>
                                  </tr>
                                  <tr>
                                    <th colspan="2">Other Information</th>
                                  </tr>
                                  <tr>
                                    <td>Currency Type</td>
                                    <td class="text-end">
                                      {currencyFilter?.label}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>VAT Number</td>
                                    <td class="text-end">
                                      {otherInfo.vatNumber}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Contact Email</td>
                                    <td class="text-end">
                                      {otherInfo.contactEmail}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Contact Phone</td>
                                    <td class="text-end">
                                      {otherInfo.contactPhone}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Logo</td>
                                    <td className="text-end">
                                      {otherInfo.logoUrl ? (
                                        <a
                                          href={otherInfo.logoUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          View Logo
                                        </a>
                                      ) : (
                                        <span>Not available</span>
                                      )}
                                    </td>
                                  </tr>

                                  <tr>
                                    <td>Website</td>
                                    <td class="text-end">
                                      {otherInfo.website}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Color</td>
                                    <td
                                      className="text-end"
                                      style={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                      }}
                                    >
                                      <div
                                        style={{
                                          backgroundColor: otherInfo.brandColor,
                                          width: "50px",
                                          height: "30px",
                                        }}
                                      ></div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Business Tagline </td>
                                    <td class="text-end">
                                      {otherInfo.businessTagline}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Affiliated Accounting Body Name</td>
                                    <td class="text-end">
                                      {otherInfo.AffiliatedAcBodyName}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      Website of Affiliated Accounting Body
                                    </td>
                                    <td class="text-end">
                                      {otherInfo.webOfAffiliatedAccount}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td class="break-table" colspan="2"></td>
                                  </tr>
                                  <tr>
                                    <th colspan="2">Trading Details</th>
                                  </tr>
                                  <tr>
                                    <td>Trading Name</td>
                                    <td class="text-end">
                                      {basicInfo.tradingName}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Trading Address</td>
                                    <td class="text-end">
                                      {concatenatedTradingAddress}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Trading Start Date</td>
                                    <td class="text-end">
                                      {basicInfo.tradingStartDate}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td class="break-table" colspan="2"></td>
                                  </tr>
                                  {(basicInfo.businessTypeID ==
                                    CLIENT_TYPES.LLP ||
                                    basicInfo.businessTypeID ==
                                    CLIENT_TYPES.Company) && (
                                      <>
                                        <tr>
                                          <th colspan="2">Company Details</th>
                                        </tr>
                                        <tr>
                                          <td>Company Name</td>
                                          <td class="text-end">
                                            {companyForm.companyName}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>Entity Type</td>
                                          <td class="text-end">
                                            {companyForm.companyType}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>Company Number</td>
                                          <td class="text-end">
                                            {" "}
                                            {companyForm.companyNumber}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>Company Incorporated In</td>
                                          <td class="text-end">
                                            {IncorporatedValue[0]?.label}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>Company Incorporation Date</td>
                                          <td class="text-end">
                                            {" "}
                                            {companyForm.incorporationDate}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>
                                            Company Registered Office Address
                                          </td>
                                          <td class="text-end">
                                            {concatenatedRegisterAddress}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td
                                            class="break-table"
                                            colspan="2"
                                          ></td>
                                        </tr>
                                      </>
                                    )}

                                  {officersForm.map((prospect, index) => (
                                    <React.Fragment key={index}>
                                      {basicInfo.businessTypeID ===
                                        CLIENT_TYPES.LLP ||
                                        basicInfo.businessTypeID ===
                                        CLIENT_TYPES.Company ? (
                                        <tr>
                                          <th colspan="2">Officers Details</th>
                                        </tr>
                                      ) : null}
                                      {basicInfo.businessTypeID ===
                                        CLIENT_TYPES.Partnership ? (
                                        <tr>
                                          <th colspan="2">
                                            Partnership Details
                                          </th>
                                        </tr>
                                      ) : null}
                                      <tr>
                                        {basicInfo.businessTypeID ===
                                          CLIENT_TYPES.Partnership ? (
                                          <th colspan="2">
                                            Partner {index + 1}
                                          </th>
                                        ) : null}
                                        {basicInfo.businessTypeID ===
                                          CLIENT_TYPES.Sole_Trader ? (
                                          <th colspan="2">Officers Details</th>
                                        ) : null}
                                        {basicInfo.businessTypeID ===
                                          CLIENT_TYPES.LLP ||
                                          basicInfo.businessTypeID ===
                                          CLIENT_TYPES.Company ? (
                                          <th colspan="2">
                                            Officer {index + 1}
                                          </th>
                                        ) : null}
                                      </tr>
                                      <tr>
                                        <td>First Name</td>
                                        <td className="text-end">
                                          {officersForm[index].firstName}
                                        </td>
                                      </tr>

                                      <tr>
                                        <td>Last Name</td>
                                        <td className="text-end">
                                          {officersForm[index].lastName}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>Phone</td>
                                        <td className="text-end">
                                          {officersForm[index].phoneNo}
                                        </td>
                                      </tr>

                                      <tr>
                                        <td>Email</td>
                                        <td className="text-end">
                                          {officersForm[index].emailID}
                                        </td>
                                      </tr>
                                      {basicInfo.businessTypeID ===
                                        CLIENT_TYPES.Sole_Trader ||
                                        basicInfo.businessTypeID ===
                                        CLIENT_TYPES.Partnership ? null : (
                                        <>
                                          {" "}
                                          <tr>
                                            <td>Role</td>
                                            <td className="text-end">
                                              {officersForm[index].officerRole}
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>Appointed On</td>
                                            <td className="text-end">
                                              {officersForm[index].appointedOn}
                                            </td>
                                          </tr>
                                        </>
                                      )}
                                      <tr>
                                        {(basicInfo.businessTypeID ===
                                          CLIENT_TYPES.Sole_Trader ||
                                          basicInfo.businessTypeID ===
                                          CLIENT_TYPES.Partnership) && (
                                            <td>Residential Address</td>
                                          )}
                                        {(basicInfo.businessTypeID ===
                                          CLIENT_TYPES.Company ||
                                          basicInfo.businessTypeID ===
                                          CLIENT_TYPES.LLP) && (
                                            <td>Correspondence Address</td>
                                          )}

                                        <td className="text-end">
                                          {
                                            concatenatedResidentialAddress[
                                              index
                                            ]?.officersFullAddress
                                          }
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          class="break-table"
                                          colspan="2"
                                        ></td>
                                      </tr>
                                    </React.Fragment>
                                  ))}
                                  <tr>
                                    <td class="break-table" colspan="2"></td>
                                  </tr>
                                  <tr>
                                    <th colspan="2">E Signature</th>
                                  </tr>
                                  <tr>
                                    <td>Signatory Name</td>
                                    <td class="text-end">
                                      {basicInfo.signatoryName}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Signature Image</td>
                                    <td class="text-end">
                                      {basicInfo.signatureImageUrl ? (
                                        <a
                                          href={basicInfo.signatureImageUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          View Signature
                                        </a>
                                      ) : (
                                        <span>Not available</span>
                                      )}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            {/* New Tab Start */}
                            {/* Officer details */}
                            <div class="tab-pane" id="product" role="tabpanel">
                              <div
                                class="tab-pane active"
                                id="base-justified-home"
                                role="tabpanel"
                              >
                                <div class="">
                                  <div className="row">
                                    <div class="col-md-6 col-6">
                                      <div
                                        class="search-box w-50 width-searchbox mb-2 "
                                        id="w-100"
                                      >
                                        <i class="ri-search-line search-icon"></i>
                                        <input
                                          type="text"
                                          value={searchKeywordUsers}
                                          onChange={(e) => {
                                            HandleSearch(e);
                                          }}
                                          className="form-control search"
                                          placeholder="Search User"
                                        />
                                      </div>
                                    </div>
                                    <div class="col-md-6 col-6">
                                      <div className="d-flex justify-content-sm-end add-new-btn">
                                        {userAccessData.User_CanAdd && (
                                          <CommonButtonComponent
                                            title="Invite New User"
                                            dataBsTarget="#addUpdateModal"
                                            data_bs_toggle="modal"
                                            name="Invite New User"
                                            AddBtn={() => UsersAddBtnClicked()}
                                          />
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <table
                                    class="table align-middle table-nowrap"
                                    id="customerTable"
                                  >
                                    <thead
                                      class="table-light table-header-font"
                                      style={{ width: "100%" }}
                                    >
                                      <tr className="head-row">
                                        <td
                                          className="tr-table-class text-white"
                                          style={{ width: "30%" }}
                                        >
                                          First Name{" "}
                                          {primaryUserSortDirectionObj.UserNameTypeSort ===
                                            "desc" && (
                                              <i
                                                onClick={() => {
                                                  setUserSortType("FirstName");
                                                  handleUserSort(
                                                    "asc",
                                                    "FirstName"
                                                  );
                                                }}
                                                style={{ cursor: "pointer" }}
                                                class="fas fa-sort-alpha-up ml-1"
                                              ></i>
                                            )}
                                          {(primaryUserSortDirectionObj.UserNameTypeSort ===
                                            null ||
                                            primaryUserSortDirectionObj.UserNameTypeSort ===
                                            "asc") && (
                                              <i
                                                onClick={() => {
                                                  setUserSortType("FirstName");
                                                  handleUserSort(
                                                    primaryUserSortDirectionObj.UserNameTypeSort ===
                                                      null
                                                      ? "asc"
                                                      : "desc",
                                                    "FirstName"
                                                  );
                                                }}
                                                style={{ cursor: "pointer" }}
                                                class="fas fa-sort-alpha-down ml-1"
                                              ></i>
                                            )}
                                        </td>
                                        <td className="tr-table-class text-white">
                                          Last Name{" "}
                                        </td>
                                        <td className="tr-table-class text-white">
                                          Email
                                          {primaryUserSortDirectionObj.EmailTypeSort ===
                                            "desc" && (
                                              <i
                                                onClick={() => {
                                                  setUserSortType("Email");
                                                  handleUserSort("asc", "Email");
                                                }}
                                                style={{ cursor: "pointer" }}
                                                class="fas fa-sort-alpha-up ml-1"
                                              ></i>
                                            )}
                                          {(primaryUserSortDirectionObj.EmailTypeSort ===
                                            null ||
                                            primaryUserSortDirectionObj.EmailTypeSort ===
                                            "asc") && (
                                              <i
                                                onClick={() => {
                                                  setUserSortType("Email");
                                                  handleUserSort(
                                                    primaryUserSortDirectionObj.EmailTypeSort ===
                                                      null
                                                      ? "asc"
                                                      : "desc",
                                                    "Email"
                                                  );
                                                }}
                                                style={{ cursor: "pointer" }}
                                                class="fas fa-sort-alpha-down ml-1"
                                              ></i>
                                            )}
                                        </td>
                                        <td className="tr-table-class text-white">
                                          Role
                                          {primaryUserSortDirectionObj.RoleTypeSort ===
                                            "desc" && (
                                              <i
                                                onClick={() => {
                                                  setUserSortType("RoleName");
                                                  handleUserSort(
                                                    "asc",
                                                    "RoleName"
                                                  );
                                                }}
                                                style={{ cursor: "pointer" }}
                                                class="fas fa-sort-alpha-up ml-1"
                                              ></i>
                                            )}
                                          {(primaryUserSortDirectionObj.RoleTypeSort ===
                                            null ||
                                            primaryUserSortDirectionObj.RoleTypeSort ===
                                            "asc") && (
                                              <i
                                                onClick={() => {
                                                  setUserSortType("RoleName");
                                                  handleUserSort(
                                                    primaryUserSortDirectionObj.RoleTypeSort ===
                                                      null
                                                      ? "asc"
                                                      : "desc",
                                                    "RoleName"
                                                  );
                                                }}
                                                style={{ cursor: "pointer" }}
                                                class="fas fa-sort-alpha-down ml-1"
                                              ></i>
                                            )}
                                        </td>
                                        <td className="tr-table-class  text-white">
                                          Acceptance Status
                                        </td>
                                        <td className="tr-table-class text-white">
                                          {userAccessData.User_CanDelete && (
                                            <>Action</>
                                          )}
                                        </td>
                                      </tr>
                                    </thead>
                                    <tbody class="list form-check-all table-content-font">
                                      {inviteUsersList.map((users) => {
                                        return (
                                          <tr class="table_new">
                                            <td className="table-content-font">
                                              {users.firstName}
                                            </td>
                                            <td className="table-content-font">
                                              {users.lastName}
                                            </td>
                                            <td className="table-content-font">
                                              {users.email}
                                            </td>
                                            <td className="table-content-font">
                                              {users.roleName}
                                            </td>
                                            <td className="table-content-font">
                                              {users.acceptanceStatus}
                                            </td>
                                            <td className="switch table-content-font">
                                              <div class="d-flex gap-2">
                                                {userAccessData.User_CanDelete && (
                                                  <Tooltip
                                                    title={"Delete User"}
                                                  >
                                                    <div class="remove">
                                                      <button
                                                        class="btn btn-sm btn-danger remove-item-btn actionButtonsStyle"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#ConfirmModel"
                                                        onClick={() =>
                                                          setModelRequestData({
                                                            ...modelRequestData,
                                                            userName:
                                                              users.firstName,
                                                            inviteUserKeyID:
                                                              users.inviteUserKeyID,
                                                            status:
                                                              users.statusName,
                                                            user: "Invite User",
                                                            Action: "Delete",
                                                          })
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
                                      })}
                                    </tbody>
                                  </table>

                                  {inviteUsersList &&
                                    inviteUsersList.length === 0 && (
                                      <noResultFoundModel />
                                    )}
                                  {UserListCount > 10 && (
                                    <PaginationComponent
                                      totalCount={UserListCount}
                                      totalPages={totalUserPage}
                                      currentPage={currentPageUsers}
                                      onPageChange={HandlePageChangeUsers}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                            <div class="tab-pane" id="Plan" role="tabpanel">
                              <div
                                class="tab-pane active"
                                id="base-justified-home"
                                role="tabpanel"
                              >
                                <div className="d-flex justify-content-sm-end p-2">
                                  <button
                                    class="btn btn-md btn-success create-item-btn view"
                                    // onClick={() =>
                                    //   handleViewOrganisation(Org)
                                    // }
                                    onClick={() => handleOpenPurchaseModel()}
                                  >
                                    {/* <i class="ri-pencil-fill"></i> */}
                                    <span>Upgrade Plan</span>{" "}
                                  </button>
                                </div>

                                <div className="">
                                  <div className="row">
                                    <div className="col-lg-12">
                                      <div
                                        className="card mb-3"
                                        style={{
                                          border: "1px solid #ced4da",
                                          borderRadius: "5px",
                                          boxShadow:
                                            "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          backgroundColor: "#fff",
                                        }}
                                      >
                                        <div
                                          // className="card-body"
                                          style={{ padding: "20px" }}
                                        >
                                          <div className="row" style={{ marginLeft: "0px" }}>
                                            {/* Left side for subscription details */}
                                            <div
                                              className="col-md-6 mt-2"
                                              style={{
                                                backgroundColor: "#f8f8fa",
                                                height: "303px",
                                              }}
                                            >
                                              <div
                                                className="d-flex rounded"
                                                style={{
                                                  backgroundColor: "#f8f8fa",
                                                  height: "303px",
                                                }}
                                              >
                                                <CardBody style={{ padding: "0px" }}>
                                                  <div className="media ">
                                                    <i className="ion ion-ios-airplane h1 align-self-center"></i>
                                                    <div className="media-body text-center ">
                                                      <div className="text-center login-logo">
                                                        <div
                                                          className="d-flex justify-content-between"

                                                        >
                                                          <h5 className="card-title">
                                                            Subscription Details
                                                          </h5>
                                                          <p className="mt-2">
                                                            {subScriptionActiveList.paymentStatus ===
                                                              "Unpaid" && (
                                                                <Tooltip
                                                                  title={`Pay Now`}
                                                                >
                                                                  <button
                                                                    className="btn btn-md btn-success create-item-btn"
                                                                    onClick={() =>
                                                                      RedirectStripeCheckout(
                                                                        subScriptionActiveList
                                                                      )
                                                                    }
                                                                  >
                                                                    <span>
                                                                      Pay Now
                                                                    </span>
                                                                  </button>
                                                                </Tooltip>
                                                              )}
                                                            {subScriptionActiveList.paymentStatus ===
                                                              "Paid" && (
                                                                <a
                                                                  href={
                                                                    subScriptionActiveList.hostedInvoiceUrl
                                                                  }
                                                                  className="btn btn-secondary btn-xs"
                                                                >
                                                                  <i className="fa fa-download"></i>
                                                                </a>
                                                              )}
                                                            {subScriptionActiveList.paymentStatus ===
                                                              "Free" && (

                                                                // <p>Free</p>
                                                                <p class='text-white'
                                                                  style={{
                                                                    background: "#DAA520",
                                                                    width: "100px",
                                                                    padding: "1px",
                                                                    display: "inline-block",
                                                                    borderRadius: "0.5rem",
                                                                  }}
                                                                >
                                                                  Free
                                                                </p>

                                                              )}
                                                          </p>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div className="pricing-features">
                                                    <p className="mt-2 mb-1 text-dark">
                                                      <b>Package Name</b>:{" "}
                                                      {
                                                        subScriptionActiveList.packageName
                                                      }
                                                    </p>
                                                    <p className="mt-0 mb-1 text-dark">
                                                      <b>Payment Frequency</b>:{" "}
                                                      {subScriptionActiveList.paymentFrequencyID ===
                                                        1
                                                        ? "Yearly"
                                                        : subScriptionActiveList.paymentFrequencyID ===
                                                          4
                                                          ? "Monthly"
                                                          : ""}
                                                    </p>

                                                    <p className="mt-0 mb-1 text-dark">
                                                      <b>Days</b>:{" "}
                                                      {subScriptionActiveList.paymentFrequencyID ===
                                                        1
                                                        ? "365 Days"
                                                        : subScriptionActiveList.paymentFrequencyID ===
                                                          4
                                                          ? "30 Days"
                                                          : ""}
                                                    </p>

                                                    <p className="mt-0 mb-1 text-dark">
                                                      <b>Subscription Date</b>:{" "}
                                                      {
                                                        subScriptionActiveList.subscriptionStartDate
                                                      }
                                                    </p>
                                                    <p className="mt-0 mb-1 text-dark">
                                                      <b> Next Renewal Date</b>:{" "}
                                                      {
                                                        subScriptionActiveList.renewDate
                                                      }
                                                    </p>
                                                    <p className="mt-0 mb-1 text-dark">
                                                      <b>Payment Status</b>:{" "}
                                                      {
                                                        subScriptionActiveList.paymentStatus
                                                      }
                                                    </p>
                                                    <p className="mt-0 mb-1 text-dark">
                                                      <b>Subscription Status</b>
                                                      :{" "}
                                                      {
                                                        subScriptionActiveList.paymentStatus
                                                      }
                                                    </p>
                                                  </div>
                                                </CardBody>
                                              </div>
                                            </div>

                                            {/* Right side for user name */}
                                            <div className="col-md-6 mt-2">
                                              <div
                                                className="d-flex rounded"
                                                style={{
                                                  backgroundColor: "#f8f8fa",
                                                  height: "303px",
                                                }}
                                              >
                                                <CardBody className="">
                                                  <div className="media ">
                                                    <i className="ion ion-ios-airplane h1 align-self-center"></i>
                                                    <div className="media-body text-center ">
                                                      <div className="text-center login-logo">
                                                        <h5 className="card-title">
                                                          Package Details{" "}
                                                        </h5>
                                                      </div>
                                                      <p>
                                                        {formatValue(subScriptionActiveList?.yearlyValuePlan /
                                                          12)}/ Month
                                                      </p>
                                                    </div>
                                                  </div>
                                                  <div className="pricing-features">
                                                    <p className="mt-0 mb-1 text-dark">
                                                      {subScriptionActiveList?.apiIntegration ==
                                                        true ? (
                                                        <span
                                                          style={{ color: "green" }}
                                                          className="fa fa-check"
                                                        ></span>
                                                      ) : (
                                                        <span
                                                          style={{ color: "red", marginRight: "2px" }}
                                                          className="fa fa-times"
                                                        ></span>
                                                      )}
                                                      <span
                                                        style={{ marginLeft: "10px" }}
                                                      >
                                                        {" "}
                                                        API Integration
                                                      </span>
                                                    </p>
                                                    <p className="mt-0 mb-1 text-dark">
                                                      {subScriptionActiveList?.prepareQuote ==
                                                        true ? (
                                                        <span
                                                          style={{
                                                            color: "green",
                                                          }}
                                                          className="fa fa-check"
                                                        ></span>
                                                      ) : (
                                                        <span
                                                          style={{ color: "red", marginRight: "2px" }}
                                                          className="fa fa-times"
                                                        ></span>
                                                      )}
                                                      <span
                                                        style={{
                                                          marginLeft: "10px",
                                                        }}
                                                      >
                                                        {" "}
                                                        Prepare {proposalName}
                                                      </span>
                                                    </p>
                                                    <p className="mt-0 mb-1 text-dark">
                                                      {subScriptionActiveList?.prepareContract ===
                                                        true ? (
                                                        <span
                                                          style={{
                                                            color: "green",
                                                          }}
                                                          className="fa fa-check"
                                                        ></span>
                                                      ) : (
                                                        <span
                                                          style={{ color: "red", marginRight: "2px" }}
                                                          className="fa fa-times"
                                                        ></span>
                                                      )}
                                                      <span
                                                        style={{
                                                          marginLeft: "10px",
                                                        }}
                                                      >
                                                        {" "}
                                                        Prepare {EngagementName}
                                                      </span>
                                                    </p>
                                                    <p className="mt-0 mb-1 text-dark">
                                                      {subScriptionActiveList?.sendQuote ===
                                                        true ? (
                                                        <span
                                                          style={{
                                                            color: "green",
                                                          }}
                                                          className="fa fa-check"
                                                        ></span>
                                                      ) : (
                                                        <span
                                                          style={{ color: "red", marginRight: "2px" }}
                                                          className="fa fa-times"
                                                        ></span>
                                                      )}
                                                      <span
                                                        style={{
                                                          marginLeft: "10px",
                                                        }}
                                                      >
                                                        {" "}
                                                        Send {proposalName}
                                                      </span>
                                                    </p>

                                                    <p className="mt-0 mb-1 text-dark">
                                                      {subScriptionActiveList?.signContract ===
                                                        true ? (
                                                        <span
                                                          style={{
                                                            color: "green",
                                                          }}
                                                          className="fa fa-check"
                                                        ></span>
                                                      ) : (
                                                        <span
                                                          style={{ color: "red", marginRight: "2px" }}
                                                          className="fa fa-times"
                                                        ></span>
                                                      )}
                                                      <span
                                                        style={{
                                                          marginLeft: "10px",
                                                        }}
                                                      >
                                                        {" "}
                                                        Send And Digitally Sign The{" "}
                                                        {EngagementName}:{" "}
                                                        {formatValueWithoutCurrencySymbol(subScriptionActiveList?.eSignaturePerMonth)}
                                                        /Month
                                                      </span>
                                                    </p>

                                                    <p className="mt-0 mb-1 text-dark">
                                                      {(subScriptionActiveList?.isMailBox ===
                                                        null || !subScriptionActiveList?.isMailBox) ? (
                                                        <span
                                                          style={{ color: "red", marginRight: "2px" }}
                                                          className="fa fa-times"
                                                        ></span>
                                                      ) : (
                                                        <span
                                                          style={{
                                                            color: "green",
                                                          }}
                                                          className="fa fa-check"
                                                        ></span>
                                                      )}
                                                      {"  "}
                                                      <span
                                                        style={{
                                                          marginLeft: "10px",
                                                        }}
                                                      >
                                                        {" "}
                                                        Personalized Outgoing
                                                        Mailbox
                                                      </span>
                                                    </p>
                                                  </div>
                                                </CardBody>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="mb-0">
                                  <table className="table table-striped">
                                    <thead>
                                      <tr>
                                        <th
                                          scope="col"
                                          className="tr-table-class text-white"
                                        >
                                          Email
                                        </th>
                                        <th
                                          scope="col"
                                          className="tr-table-class text-white"
                                        >
                                          Contact No
                                        </th>
                                        <th
                                          scope="col"
                                          className="tr-table-class text-white"
                                        >
                                          Package Name
                                        </th>
                                        <th
                                          scope="col"
                                          className="tr-table-class text-white"
                                        >
                                          Package Price
                                        </th>
                                        <th
                                          scope="col"
                                          className="tr-table-class text-white"
                                        >
                                          Subscription Start Date
                                        </th>
                                        <th
                                          scope="col"
                                          className="tr-table-class text-white text-nowrap"
                                        >
                                          Next Renewal <br /> Date
                                        </th>
                                        <th
                                          scope="col"
                                          className="tr-table-class text-white"
                                        >
                                          Payable Amount
                                        </th>
                                        <th
                                          scope="col"
                                          className="tr-table-class text-white"
                                        >
                                          Payment Status
                                        </th>
                                        <th
                                          scope="col"
                                          className="tr-table-class text-white"
                                        >
                                          Subscription Status
                                        </th>
                                        <th
                                          scope="col"
                                          className="tr-table-class text-white"
                                        >
                                          Action
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {subScriptionPlaneList.map(
                                        (subscription, index) => (
                                          <tr key={index}>
                                            <td className="table-content-font">
                                              {subscription.email}
                                            </td>
                                            <td className="table-content-font">
                                              {subscription.mobileNumber}
                                            </td>
                                            <td className="table-content-font">
                                              {subscription.packageName}
                                            </td>
                                            <td className="table-content-font">
                                              {formatValue(subscription.packagePrice)}
                                              {/* {Number(subscription.packagePrice)
                                                .toFixed(2)
                                                .replace(
                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                  ","
                                                )} */}
                                            </td>
                                            <td className="table-content-font">
                                              {subscription.subscriptionStartDate
                                                ? subscription.subscriptionStartDate
                                                : "_"}
                                            </td>
                                            <td className="table-content-font">
                                              {subscription.nextRenewalDate
                                                ? subscription.nextRenewalDate
                                                : " _"}
                                            </td>
                                            <td className="table-content-font">
                                              {formatValue(subscription.finalBillingAmount)}
                                              {/* {Number(
                                                subscription.finalBillingAmount
                                              )
                                                .toFixed(2)
                                                .replace(
                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                  ","
                                                )} */}
                                            </td>
                                            <td className=" table-content-font text-center">
                                              {subscription.paymentStatus ===
                                                "Unpaid" && (
                                                  <Tooltip title={`Pay Now`}>
                                                    <div class="view">
                                                      <button style={{ width: '100%' }}
                                                        class="btn btn-md btn-success create-item-btn view"
                                                        onClick={() =>
                                                          RedirectStripeCheckout(
                                                            subscription
                                                          )
                                                        }
                                                      >

                                                        <span  >
                                                          Pay Now
                                                        </span>
                                                      </button></div>
                                                  </Tooltip>
                                                )}
                                              {subscription.paymentStatus ===
                                                "Paid" && (
                                                  <a
                                                    href={
                                                      subscription.hostedInvoiceUrl
                                                    }
                                                    className="btn btn-secondary btn-xs"
                                                  >
                                                    <i className="fa fa-download"></i>
                                                  </a>
                                                )}
                                              {/* {subscription.paymentStatus ===
                                                "Free" && <p>Free</p>} */}
                                              {subscription.paymentStatus === "Free" && (
                                                <p
                                                  className="p text-center table-content-font text-white  "
                                                  style={{
                                                    background: "#DAA520",
                                                    width: "100px",
                                                    padding: "4px 5px",
                                                    display: "inline-block",
                                                    borderRadius: "0.5rem",
                                                  }}
                                                >
                                                  Free
                                                </p>
                                              )}
                                            </td>
                                            <td className="table-content-font">
                                              <div
                                                className=" text-center  text-white rounded text-nowrap"
                                                style={{
                                                  background:
                                                    subscription.subscriptionStatus ===
                                                      "Active"
                                                      ? "#008000"
                                                      : subscription.subscriptionStatus ===
                                                        "Expired"
                                                        ? "#FF0000"
                                                        : subscription.subscriptionStatus ===
                                                          "Pending"
                                                          ? "#DAA520"
                                                          : subscription.subscriptionStatus ===
                                                            "InActive"
                                                            ? "#772424"
                                                            : "gray",
                                                  width: "100px",

                                                  padding: "5px 8px", // Add padding to the button
                                                  display: "inline-block", // Ensure button stays in line
                                                  borderRadius: "0.5rem", // Adjust border radius
                                                }}
                                              >
                                                {
                                                  subscription.subscriptionStatus
                                                }
                                              </div>
                                            </td>
                                            <td>
                                              <div class="view text-nowrap ">
                                                <Tooltip
                                                  title={`View Subscription`}
                                                >
                                                  <div class="view">
                                                    <button
                                                      class="btn btn-md btn-success create-item-btn view "

                                                      onClick={() =>
                                                        handleOpenSubscriptionModel(
                                                          subscription
                                                        )
                                                      }
                                                      data-bs-toggle="modal"
                                                      data-bs-target="#addSubscriptionViewModalUser"
                                                    >
                                                      {/* <i class="ri-pencil-fill"></i> */}
                                                      <span  >View</span>{" "}
                                                      <span className="mt-4">
                                                        {" "}
                                                        <i class="bi bi-eye "></i>
                                                      </span>
                                                    </button>
                                                  </div>
                                                </Tooltip>
                                              </div>
                                            </td>
                                          </tr>
                                        )
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* end card  */}
                  </div>
                  {/* end col */}
                </div>
              </div>
              {/* end col  */}
            </div>
            {/* end row */}

            {/* end modal  */}
          </div>
          <ErrorModel
            ErrorModel={openErrorModal}
            handleClose={handleClose}
            ErrorMessage={errorMessage}
          />
          {/* Confirm Modal  */}
          <ConfirmModel
            openErrorModal={openErrorModal}
            openSuccessModal={openSuccessModal}
            modelRequestData={modelRequestData}
            UpdatedStatus={InviteUserChangeStatusData}
          />
          <SubscriptionView
            class="modal fade"
            id="addSubscriptionViewModalUser"
            tabIndex="-1"
            aria_labelledby="exampleModalLabel"
            aria_hidden="true"
            // setIsAddUpdateActionDone={setIsAddUpdateActionDone}
            subscriptionPackageObj={subscriptionPackageObj}

          //   handleClose={handleCloseSubscriptionModel}
          //   setSubscriptionModal={setSubscriptionModal}
          //   openSubscriptionModal={openSubscriptionModal}
          // title={"Update Plan"}
          // organizationKeyId={activeOrganizationKeyId}
          />

          {/* Success Modal  */}
          <SuccessModal
            handleClose={handleClose}
            setOpenSuccessModal={setOpenSuccessModal}
            openSuccessModal={openSuccessModal}
            modelAction={modelRequestData.Action}
            message={successMessage}
          />
          {/* Modal  */}
          <UsersModel
            class="modal fade"
            id="addUpdateModal"
            tabIndex="-1"
            aria_labelledby="exampleModalLabel"
            aria_hidden="true"
            setIsAddUpdateActionDone={setIsAddUpdateActionDone}
            modelRequestData={modelRequestData}
          />

          {/* container-fluid  */}
        </div>
        {/* End Page-content */}

        <Footer />
      </div>

      {/* start back-to-top */}
      <button
        onclick="topFunction()"
        class="btn btn-danger btn-icon"
        id="back-to-top"
      >
        <i class="ri-arrow-up-line"></i>
      </button>
      {/* end back-to-top */}
    </div>
  );
};

export default OrganisationViewDetails;
