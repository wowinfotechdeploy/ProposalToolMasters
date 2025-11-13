import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import "./Proposals.css";
import Switch from "@mui/material/Switch";
import Select from "react-select";
import { AuthContextProvider } from "../../AuthContext/AuthContext";
import Footer from "../../components/Footer";
import { GetProposalModelList } from "../../redux/Services/Proposal/ProposalApi";
import { useSelector } from "react-redux";
import Utils from "../../Middleware/Utils";
import "../configure/packages/Package.css";
import { fieldToIdMap, statusID } from "../../Middleware/enums";
import { Base_Url } from "../../Base-Url/Base_Url";

const View_Proposals = () => {
  const common = useSelector((state) => state.Storage);
  const [selectedRecurringServiceList, setSelectedRecurringServiceList] =
    useState([]);
  const [selectedOneOffServiceList, setSelectedOneOffServiceList] = useState(
    []
  );
  const [acceptedPackageIndex, setAcceptedIndex] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);

  const [acceptedPackageName, setAcceptedAcceptedName] = useState("");

  const [modelRequestData, setModelRequestData] = useState({
    ModuleName: null,
    ProposalId: null,
    keyID: null,
    SearchKeyword: "",
  });
  const [totalOnePackageValue, setTotalOnePackageValue] = useState(0);
  const [totalTwoPackageValue, setTotalTwoPackageValue] = useState(0);
  const [totalThreePackageValue, setTotalThreePackageValue] = useState(0);
  const [totalOnePackageValueOneOff, setTotalOnePackageValueOneOff] =
    useState(0);
  const [totalTwoPackageValueOneOff, setTotalTwoPackageValueOneOff] =
    useState(0);
  const [totalThreePackageValueOneOff, setTotalThreePackageValueOneOff] =
    useState(0);
  const location = useLocation();
  const [vatPercentage, setVATPercentage] = useState(null);
  const [packageList, setPackageList] = useState([]);
  const [selectedPackagesList, setSelectedPackagesList] = useState([]);
  const [officersForm, setOfficers] = useState([
    {
      officerID: null,
      firstName: null,
      lastName: null,
      countryCodeID: null,
      phoneCountryCodeID: null,
      phoneNo: null,
      emailID: null,
      addressID: null,
      isAuthorisedSignatory: null,
      officerRole: null,
      appointedOn: null,
      moduleName: null,
      moduleID: null,
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

  const [ProposalObject, setProposalObject] = useState({
    clientName: null,
    quoteFormatID: null,
    contractKeyID: [],
    statusID: null,
    templateName: null,
    currencyID: null,
    quoteTypeID: null,
    quoteTypeName: null,
    Payment_Frequency: null,
    feeTypeId: null,
    feesInQuoteName: null,
    DiscountLines: null,
    paymentGatewayID: null,
    paymentFrequencyName: null,
    recurringOriginalPrice: null,
    recurringDiscountedPrice: null,
    recurringDiscountPercentage: null,
    oneOffOriginalPrice: null,
    oneOffDiscountedPrice: null,
    oneOffDiscountPercentage: null,
    quoteFormatName: null,
    selectedOneOffServiceList: [],
    reccrunigServiceCatList: [],
    clientMasterBusinessTypeID: null,
    acceptedServicePackageID: null,
    draftOn: null,
    sentOn: null,
    AcceptedOn: null,
    SkippedOn: null,
  });

  const [pricingSettingObj, setPricingSettingObj] = useState({
    userKeyID: null,
    minOneOffPriceForQC: null,
    minMonthlyPriceForQC: null,
    maxDiscountForQC: null,
    PaymentFrequency: null,
    enableMasterProposalType: null,
  });

  const [requireMessage, setRequireMessage] = useState(false);
  const [pricingTableColumnIDs, setPricingTableColumnIDs] = useState("");
  const [visibleFieldsCustomTemp, setVisibleFieldsCustomTemp] = useState({
    serviceCategory: true,
    serviceName: true,
    vatRate: true,
    vat: true,
    fees: true,
    serviceScope: true,
    feesIncVat: true,
  });

  const updateVisibleFieldsFromIds = (idString) => {
    // Ensure idString is a string — handle undefined, null, object, or empty values safely
    if (typeof idString !== "string" || idString.trim() === "") {
      // If no ids provided, set all fields to false (optional)
      const allFalse = Object.fromEntries(
        Object.keys(fieldToIdMap).map((key) => [key, true])
      );
      setVisibleFieldsCustomTemp(allFalse);
      return;
    }

    const idsFromBackend = idString
      .split(",")
      .map((id) => Number(id.trim()))
      .filter((id) => !isNaN(id)); // avoid NaN if backend sends weird values

    const updatedFields = Object.fromEntries(
      Object.entries(fieldToIdMap).map(([key, id]) => [
        key,
        idsFromBackend.includes(id),
      ])
    );

    setVisibleFieldsCustomTemp(updatedFields);
  };

  // const draftOn = location.state.draftOn;
  // const sentOn = location.state.sentOn;
  // const AcceptedOn = location.state.AcceptedOn;
  // const SkippedOn = location.state.SkippedOn;

  const {
    setTopbar,
    proposalName,
    setLoader,
    prospectName,
    formatValue,
    isMobile,
    getValidationMessage,
    hasHyphenAfterNumber,
    getTaxName,
    getCurrencySymbol,
  } = useContext(AuthContextProvider);
  const navigate = useNavigate();

  const [totalRecServiceVAT, setTotalRecServiceVAT] = useState(null);
  const [totalOneOffServiceVAT, setTotalOneOffServiceVAT] = useState(null);

  const [RecurringPricingInfo, setRecurringPricingInfo] = useState({
    OriginalPrice: 0,
    DefaultDiscount: null,
    DiscountPercentagePackageOne: null,
    DiscountPercentagePackageTwo: null,
    DiscountPercentagePackageThree: null,
    DiscountedPrice: "",
    MaxDiscount: 0,
    MinPrice: "",
    NetTotal: 0,
    Services: null,
    ServicePrice: 0,
    Discount: 0,
    GrandTotal: 0,
    DiscountedTotal: 0,
    packageOneNetTotal: 0,
    packageTwoNetTotal: 0,
    packageThreeNetTotal: 0,
    packageOneDisCount: 0,
    packageTwoDisCount: 0,
    packageThreeDisCount: 0,
    packageOneDisCountedTotal: 0,
    packageTwoDisCountedTotal: 0,
    packageThreeDisCountedTotal: 0,
    PackageOneVaTPrice: null,
    PackageTwoVaTPrice: null,
    PackageThreeVaTPrice: null,
    PackageOneGrandTotal: null,
    PackageTwoGrandTotal: null,
    PackageThreeGrandTotal: null,
  });
  const [OneOffPricingInfo, setOneOffPricingInfo] = useState({
    OriginalPrice: 0,
    DefaultDiscount: null,
    DiscountPercentagePackageOne: null,
    DiscountPercentagePackageTwo: null,
    DiscountPercentagePackageThree: null,
    // DefaultDiscount: 0,
    DiscountedPrice: "",
    MaxDiscount: 0,
    MinPrice: "",
    NetTotal: 0,
    Services: null,
    ServicePrice: 0,
    Discount: 0,
    GrandTotal: 0,
    DiscountedTotal: 0,
    packageOneNetTotal: 0,
    packageTwoNetTotal: 0,
    packageThreeNetTotal: 0,
    packageOneDisCount: 0,
    packageTwoDisCount: 0,
    packageThreeDisCount: 0,
    packageOneDisCountedTotal: 0,
    packageTwoDisCountedTotal: 0,
    packageThreeDisCountedTotal: 0,
    PackageOneVaTPrice: null,
    PackageTwoVaTPrice: null,
    PackageThreeVaTPrice: null,
    PackageOneGrandTotal: null,
    PackageTwoGrandTotal: null,
    PackageThreeGrandTotal: null,
  });

  const [OneOffPricingInfoCopy, setOneOffPricingInfoCopy] = useState({
    OriginalPrice: 0,
    DefaultDiscount: null,
    // DefaultDiscount: 0,
    DiscountedPrice: "",
    MaxDiscount: 0,
    MinPrice: "",
    NetTotal: 0,
    Services: null,
    ServicePrice: 0,
    Discount: 0,
    GrandTotal: 0,
    DiscountedTotal: 0,
    packageOneDisCount: 0,
    packageTwoDisCount: 0,
    packageThreeDisCount: 0,
    packageOneDisCountedTotal: 0,
    packageTwoDisCountedTotal: 0,
    packageThreeDisCountedTotal: 0,
    PackageOneVaTPrice: null,
    PackageTwoVaTPrice: null,
    PackageThreeVaTPrice: null,
    PackageOneGrandTotal: null,
    PackageTwoGrandTotal: null,
    PackageThreeGrandTotal: null,
  });

  const [RecurringFrequencyPricingInfo, setRecurringFrequencyPricingInfo] =
    useState({
      OriginalPrice: 0,
      DefaultDiscount: null,
      // DefaultDiscount: 0,
      DiscountedPrice: "",
      MaxDiscount: 0,
      MinPrice: "",
      NetTotal: 0,
      Services: null,
      ServicePrice: 0,
      Discount: 0,
      DiscountedTotal: 0,
      packageOneDisCount: 0,
      packageTwoDisCount: 0,
      packageThreeDisCount: 0,
      packageOneDisCountedTotal: 0,
      packageTwoDisCountedTotal: 0,
      packageThreeDisCountedTotal: 0,
      PackageOneVaTPrice: null,
      PackageTwoVaTPrice: null,
      PackageThreeVaTPrice: null,
      PackageOneGrandTotal: null,
      PackageTwoGrandTotal: null,
      PackageThreeGrandTotal: null,
    });

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    setTopbar("block");
  }, []);

  useEffect(() => {
    if (location.state?.quoteKeyID !== null) {
      GetProposalDetailsData(location.state?.quoteKeyID);
    }
  }, [location.state]);

  // Get Proposal Details From Api
  const GetProposalDetailsData = async (id) => {
    if (!id) {
      return;
    }

    try {
      const data = await GetProposalModelList(id);
      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          const ModelData = data?.data?.responseData?.data;
          const ServiceMappingWithPackagesList =
            data?.data?.responseData?.serviceMappingWithPackagesList;
          const packageData = data?.data?.responseData?.packageList;
          const PackageOneID = packageData[0]?.servicePackageID;
          const PackageTwoID = packageData[1]?.servicePackageID;
          const PackageThreeID = packageData[2]?.servicePackageID;

          setPricingTableColumnIDs(ModelData.pricingTableColumnIDs);
          updateVisibleFieldsFromIds(ModelData.pricingTableColumnIDs);

          const finalQuotationAmountList =
            data?.data?.responseData?.finalQuotationAmountList;
          const clientOfficersList =
            data?.data?.responseData.clientOfficersList;

          let officerArray = [];
          clientOfficersList.forEach((item) => {
            let officerObj = {
              officerID: item.officerID,
              firstName: item.firstName,
              lastName: item.lastName,
              countryCodeID: item.countryCodeID,
              // phoneCountryCodeID: PhoneSelectedValue,
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

          setProposalObject({
            ...ProposalObject,
            statusID: ModelData.statusID,
            quoteFormatID: ModelData.quoteFormatID,
            contractKeyID: ModelData.contractKeyID,
            quotationName: ModelData.quotationName,
            clientName: ModelData.clientName,
            draftOn: ModelData.createdOn,
            sentOn: ModelData.sentOn,
            AcceptedOn: ModelData.acceptDeclineDate,
            SkippedOn: ModelData.lastUpdatedOn,
            templateName: ModelData.templateName,
            currencyID: ModelData.currencyID,
            quoteTypeID: ModelData.quoteTypeID,
            quoteTypeName: ModelData.quoteTypeName,
            feesInQuoteName: ModelData.feesInQuoteName,
            Payment_Frequency: ModelData.paymentFrequencyID,
            feeTypeId: ModelData.feesInQuoteID,
            DiscountLines: ModelData.showDiscountLine,
            paymentGatewayID: ModelData.paymentGatewayID,
            paymentFrequencyName: ModelData.paymentFrequencyName,
            recurringOriginalPrice: ModelData.recurringOriginalPrice,
            recurringDiscountedPrice: ModelData.recurringDiscountedPrice,
            recurringDiscountPercentage: ModelData.recurringDiscountPercentage,
            oneOffOriginalPrice: ModelData.oneOffOriginalPrice,
            oneOffDiscountedPrice: ModelData.oneOffDiscountedPrice,
            oneOffDiscountPercentage: ModelData.oneOffDiscountPercentage,
            quoteFormatName: ModelData.quoteFormatName,
            clientMasterBusinessTypeID: ModelData.clientMasterBusinessTypeID,
            acceptedServicePackageID: ModelData.acceptedServicePackageID,
          });

          const packageName = packageData.find(
            (item) =>
              item.servicePackageID == ModelData.acceptedServicePackageID
          );
          setAcceptedAcceptedName(packageName?.servicePackageName);
          const packageIndex = packageData.findIndex(
            (item) =>
              item.servicePackageID === ModelData.acceptedServicePackageID
          );
          setAcceptedIndex(packageIndex);

          if (packageData.length > 0) {
            const RecurringDetails = finalQuotationAmountList.filter(
              (obj) => obj.serviceChargeTypeID === 1
            );
            const OneOffDetails = finalQuotationAmountList.filter(
              (obj) => obj.serviceChargeTypeID === 2
            );
            if (
              RecurringDetails !== undefined &&
              RecurringDetails?.length !== 0
            ) {
              setVATPercentage(RecurringDetails[0]?.vatPercentage);
            } else {
              setVATPercentage(OneOffDetails[0]?.vatPercentage);
            }

            setRecurringPricingInfo({
              ...RecurringPricingInfo,
              DefaultDiscount:
                ModelData.quoteTypeID == 1 || ModelData.quoteTypeID == 2
                  ? RecurringDetails[0]?.discountPercentageWithAllDecimal
                  : ModelData.recurringDiscountPercentage == null
                  ? 0
                  : ModelData.recurringDiscountPercentage,
              DiscountPercentagePackageOne:
                RecurringDetails[0]?.discountPercentageWithAllDecimal,
              DiscountPercentagePackageTwo:
                RecurringDetails[1]?.discountPercentageWithAllDecimal,
              DiscountPercentagePackageThree:
                RecurringDetails[2]?.discountPercentageWithAllDecimal,
              packageOneNetTotal: RecurringDetails[0]?.netTotal,
              packageTwoNetTotal: RecurringDetails[1]?.netTotal,
              packageThreeNetTotal: RecurringDetails[2]?.netTotal,
              packageOneDisCount: RecurringDetails[0]?.discounted,
              packageTwoDisCount: RecurringDetails[1]?.discounted,
              packageThreeDisCount: RecurringDetails[2]?.discounted,
              packageOneDisCountedTotal: RecurringDetails[0]?.discountedTotal,
              packageTwoDisCountedTotal: RecurringDetails[1]?.discountedTotal,
              packageThreeDisCountedTotal: RecurringDetails[2]?.discountedTotal,
              PackageOneVaTPrice: RecurringDetails[0]?.vat,
              PackageTwoVaTPrice: RecurringDetails[1]?.vat,
              PackageThreeVaTPrice: RecurringDetails[2]?.vat,
              PackageOneGrandTotal: RecurringDetails[0]?.grandTotal,
              PackageTwoGrandTotal: RecurringDetails[1]?.grandTotal,
              PackageThreeGrandTotal: RecurringDetails[2]?.grandTotal,
            });
            setRecurringFrequencyPricingInfo({
              ...RecurringFrequencyPricingInfo,
              DefaultDiscount:
                ModelData.recurringDiscountPercentage_WithAllDecimal,
              packageOneNetTotal: RecurringDetails[0]?.netTotal,
              packageTwoNetTotal: RecurringDetails[1]?.netTotal,
              packageThreeNetTotal: RecurringDetails[2]?.netTotal,
              packageOneDisCount: RecurringDetails[0]?.discounted,
              packageTwoDisCount: RecurringDetails[1]?.discounted,
              packageThreeDisCount: RecurringDetails[2]?.discounted,
              packageOneDisCountedTotal: RecurringDetails[0]?.discountedTotal,
              packageTwoDisCountedTotal: RecurringDetails[1]?.discountedTotal,
              packageThreeDisCountedTotal: RecurringDetails[2]?.discountedTotal,
              PackageOneVaTPrice: RecurringDetails[0]?.vat,
              PackageTwoVaTPrice: RecurringDetails[1]?.vat,
              PackageThreeVaTPrice: RecurringDetails[2]?.vat,
              PackageOneGrandTotal: RecurringDetails[0]?.grandTotal,
              PackageTwoGrandTotal: RecurringDetails[1]?.grandTotal,
              PackageThreeGrandTotal: RecurringDetails[2]?.grandTotal,
            });

            setOneOffPricingInfo({
              ...OneOffPricingInfo,
              DefaultDiscount:
                ModelData.quoteTypeID == 1
                  ? OneOffDetails[0]?.discountPercentageWithAllDecimal
                  : ModelData.oneOffDiscountPercentage_WithAllDecimal == null
                  ? 0
                  : ModelData.oneOffDiscountPercentage_WithAllDecimal,
              DiscountPercentagePackageOne:
                OneOffDetails[0]?.discountPercentageWithAllDecimal,
              DiscountPercentagePackageTwo:
                OneOffDetails[1]?.discountPercentageWithAllDecimal,
              DiscountPercentagePackageThree:
                OneOffDetails[2]?.discountPercentageWithAllDecimal,
              packageOneDisCount: OneOffDetails[0]?.discounted,
              packageTwoDisCount: OneOffDetails[1]?.discounted,
              packageThreeDisCount: OneOffDetails[2]?.discounted,
              packageOneNetTotal: OneOffDetails[0]?.netTotal,
              packageTwoNetTotal: OneOffDetails[1]?.netTotal,
              packageThreeNetTotal: OneOffDetails[2]?.netTotal,
              packageOneDisCountedTotal: OneOffDetails[0]?.discountedTotal,
              packageTwoDisCountedTotal: OneOffDetails[1]?.discountedTotal,
              packageThreeDisCountedTotal: OneOffDetails[2]?.discountedTotal,
              PackageOneVaTPrice: OneOffDetails[0]?.vat,
              PackageTwoVaTPrice: OneOffDetails[1]?.vat,
              PackageThreeVaTPrice: OneOffDetails[2]?.vat,
              PackageOneGrandTotal: OneOffDetails[0]?.grandTotal,
              PackageTwoGrandTotal: OneOffDetails[1]?.grandTotal,
              PackageThreeGrandTotal: OneOffDetails[2]?.grandTotal,
            });
            setOneOffPricingInfoCopy({
              ...OneOffPricingInfoCopy,
              DefaultDiscount:
                ModelData.oneOffDiscountPercentage_WithAllDecimal,
              packageOneDisCount: OneOffDetails[0]?.discounted,
              packageTwoDisCount: OneOffDetails[1]?.discounted,
              packageThreeDisCount: OneOffDetails[2]?.discounted,
              packageOneNetTotal: OneOffDetails[0]?.netTotal,
              packageTwoNetTotal: OneOffDetails[1]?.netTotal,
              packageThreeNetTotal: OneOffDetails[2]?.netTotal,
              packageOneDisCountedTotal: OneOffDetails[0]?.discountedTotal,
              packageTwoDisCountedTotal: OneOffDetails[1]?.discountedTotal,
              packageThreeDisCountedTotal: OneOffDetails[2]?.discountedTotal,
              PackageOneVaTPrice: OneOffDetails[0]?.vat,
              PackageTwoVaTPrice: OneOffDetails[1]?.vat,
              PackageThreeVaTPrice: OneOffDetails[2]?.vat,
              PackageOneGrandTotal: OneOffDetails[0]?.grandTotal,
              PackageTwoGrandTotal: OneOffDetails[1]?.grandTotal,
              PackageThreeGrandTotal: OneOffDetails[2]?.grandTotal,
            });
          } else {
            const RecurringDetails = finalQuotationAmountList.find(
              (obj) => obj.serviceChargeTypeID === 1
            );
            const OneOffDetails = finalQuotationAmountList.find(
              (obj) => obj.serviceChargeTypeID === 2
            );
            if (
              RecurringDetails !== undefined &&
              RecurringDetails?.length === 0
            ) {
              setVATPercentage(RecurringDetails?.vatPercentage);
            } else {
              setVATPercentage(OneOffDetails?.vatPercentage);
            }
            setRecurringPricingInfo({
              ...RecurringPricingInfo,
              OriginalPrice: ModelData.recurringOriginalPrice,
              DefaultDiscount: Number(
                ModelData.recurringDiscountPercentage_WithAllDecimal
              ).toFixed(12),
              DiscountedPrice: ModelData.recurringDiscountedPrice,
              Discount: RecurringDetails?.discounted,
              DiscountedTotal: RecurringDetails?.discountedTotal,
              VATPrice: RecurringDetails?.vat,
              GrandTotal: RecurringDetails?.grandTotal,
            });

            setRecurringFrequencyPricingInfo({
              ...RecurringFrequencyPricingInfo,
              OriginalPrice: ModelData.recurringOriginalPrice_WithAllDecimal,
              DefaultDiscount:
                ModelData.recurringDiscountPercentage_WithAllDecimal,
              DiscountedPrice: ModelData.recurringDiscountedPrice,
              Discount: RecurringDetails?.discounted,
              DiscountedTotal: RecurringDetails?.discountedTotal,
              VATPrice: RecurringDetails?.vat,
              GrandTotal: RecurringDetails?.grandTotal,
            });
            setOneOffPricingInfo({
              ...OneOffPricingInfo,
              OriginalPrice: ModelData.oneOffOriginalPrice,
              DefaultDiscount: Number(
                ModelData.oneOffDiscountPercentage_WithAllDecimal
              ).toFixed(12),
              DiscountedPrice: ModelData.oneOffDiscountedPrice,
              Discount: OneOffDetails?.discounted,
              DiscountedTotal: OneOffDetails?.discountedTotal,
              VATPrice: OneOffDetails?.vat,
              GrandTotal: OneOffDetails?.grandTotal,
            });

            setOneOffPricingInfoCopy({
              ...OneOffPricingInfoCopy,
              OriginalPrice: ModelData.oneOffOriginalPrice,
              DefaultDiscount:
                ModelData.oneOffDiscountPercentage_WithAllDecimal,
              DiscountedPrice: ModelData.oneOffDiscountedPrice,
              Discount: OneOffDetails?.discounted,
              DiscountedTotal: OneOffDetails?.discountedTotal,
              VATPrice: OneOffDetails?.vat,
              GrandTotal: OneOffDetails?.grandTotal,
            });
          }
          let RecurringService = ModelData.reccrunigServiceCatList;
          let OneOffService = ModelData.oneOffServiceCatList;
          if (packageData.length !== 0) {
            const updateServicePackages = (
              services,
              servicesList,
              serviceChargeTypeID
            ) => {
              // Filter the services that match the provided serviceChargeTypeID

              const serviceMappings = ServiceMappingWithPackagesList.filter(
                (item) => item.serviceChargeTypeID === serviceChargeTypeID
              );

              return servicesList.map((SelectedService) => {
                // Find matching service mappings for the current SelectedService
                const matchedMappings = serviceMappings.filter(
                  (serviceMappingWithPackages) => {
                    return (
                      serviceMappingWithPackages.serviceCatID ===
                        services.serviceCatID &&
                      serviceMappingWithPackages.serviceID ===
                        SelectedService.serviceID
                    );
                  }
                );

                let packageOneValue = SelectedService.packageOneValue;
                let packageTwoValue = SelectedService.packageTwoValue;
                let packageThreeValue = SelectedService.packageThreeValue;

                // Loop through matchedMappings to update package values if a match is found
                matchedMappings.forEach((serviceMappingWithPackages) => {
                  //Set Package One Value
                  if (
                    PackageOneID === serviceMappingWithPackages.servicePackageID
                  ) {
                    packageOneValue =
                      serviceMappingWithPackages.priceWithAllDecimal !== null
                        ? serviceMappingWithPackages.priceWithAllDecimal
                        : SelectedService.packageOneValue;
                  }

                  //Set Package Two Value
                  if (
                    PackageTwoID === serviceMappingWithPackages.servicePackageID
                  ) {
                    packageTwoValue =
                      serviceMappingWithPackages.priceWithAllDecimal !== null
                        ? serviceMappingWithPackages.priceWithAllDecimal
                        : SelectedService.packageTwoValue;
                  }

                  //Set Package Three Value
                  if (
                    PackageThreeID ===
                    serviceMappingWithPackages.servicePackageID
                  ) {
                    packageThreeValue =
                      serviceMappingWithPackages.priceWithAllDecimal !== null
                        ? serviceMappingWithPackages.priceWithAllDecimal
                        : SelectedService.packageThreeValue;
                  }
                });

                // Return the updated SelectedService with new package values
                return {
                  ...SelectedService,
                  packageOneValue,
                  packageTwoValue,
                  packageThreeValue,
                };
              });
            };

            // Update RecurringService
            RecurringService = ModelData.reccrunigServiceCatList.map(
              (services) => {
                return {
                  ...services,
                  servicesList: updateServicePackages(
                    services,
                    services.servicesList,
                    1
                  ), // serviceChargeTypeID for RecurringService is 1
                };
              }
            );

            // Update OneOffService
            OneOffService = ModelData.oneOffServiceCatList.map((services) => {
              return {
                ...services,
                servicesList: updateServicePackages(
                  services,
                  services.servicesList,
                  2
                ), // serviceChargeTypeID for OneOffService is 2
              };
            });
          }

          setSelectedRecurringServiceList(RecurringService);
          setSelectedOneOffServiceList(OneOffService);
          setPackageList(packageData);
          setSelectedPackagesList(packageData);
          // setFinalQuotationAmountList(finalQuotationAmountList);

          // Service wise VAT
          const recurringVatSum =
            ModelData.reccrunigServiceCatList?.reduce((catAcc, cat) => {
              const catTotal = cat.servicesList?.reduce(
                (srvAcc, srv) => srvAcc + (srv.vatAmount || 0),
                0
              );
              return catAcc + catTotal;
            }, 0) || 0;

          const oneOffVatSum =
            ModelData.oneOffServiceCatList?.reduce((catAcc, cat) => {
              const catTotal = cat.servicesList?.reduce(
                (srvAcc, srv) => srvAcc + (srv.vatAmount || 0),
                0
              );
              return catAcc + catTotal;
            }, 0) || 0;

          setTotalRecServiceVAT(recurringVatSum);
          setTotalOneOffServiceVAT(oneOffVatSum);
        }
      } else {
        // setErrorMessage(data?.data?.errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const selectedFrequency = Utils.Payment_Frequency.find(
    (item) => ProposalObject.Payment_Frequency == item.value
  );
  const feeTypeValue = Utils.feeInProposal.find(
    (item) => ProposalObject.feeTypeId == item.value
  );
  const PaymentGatewayValue = Utils.payment_gateway.find(
    (item) => ProposalObject.paymentGatewayID == item.value
  );
  //HandleDownload
  const handleDownload = async (ContractKeyID) => {
    setLoader(true);
    if (ProposalObject.statusID !== statusID.Signed) {
      setModelRequestData({
        ...modelRequestData,
        ModuleName: "Quote",
        contractKeyID: location.state?.contractKeyID, // Change ClientKeyID to contractKeyID
        Action: "View",
      });
      let ViewPdfData = {
        ModuleName: "Quote",
        quoteKeyID: location.state?.quoteKeyID,
      };
      navigate("/view-pdf", { state: ViewPdfData });
    } else {
      try {
        const options = {
          method: "GET",
          headers: {
            Authorization: common.token,
          },
          responseType: "blob",
        };
        const response = await fetch(
          `${Base_Url}/SignEasy/DownloadDocumentAsZip?ContractKeyID=${location.state?.quoteKeyID}`,
          options
        );
        // const response = await DownloadDocumentAsZip(ContractKeyID);

        if (!response) {
          throw new Error("Failed to download ZIP file");
        }
        // Convert the response to a blob
        const blob = await response.blob();
        // Create a temporary anchor element to trigger the download
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `${proposalName} for-${ProposalObject.clientName}.Zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setLoader(false);
      } catch (error) {
        setLoader(false);
        console.error("Error downloading ZIP file:", error);
      }
    }
  };
  const packageCount = selectedPackagesList.length;

  const getFontStyles = (servicePackageID, Type) => {
    let fontWeight = "400";
    let fontSize = "14px";

    if (Type === "Index") {
      fontWeight =
        acceptedPackageIndex === servicePackageID &&
        ProposalObject.statusID !== statusID.Declined
          ? "600"
          : "400";
      fontSize =
        acceptedPackageIndex === servicePackageID &&
        ProposalObject.statusID !== statusID.Declined
          ? "16px"
          : "14px"; // Adjust font size as needed
    } else {
      fontWeight =
        servicePackageID === ProposalObject.acceptedServicePackageID &&
        ProposalObject.statusID !== statusID.Declined
          ? "600"
          : "400";
      fontSize =
        servicePackageID === ProposalObject.acceptedServicePackageID &&
        ProposalObject.statusID !== statusID.Declined
          ? "16px"
          : "14px"; // Adjust font size as needed
    }

    return { fontWeight, fontSize };
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const GetOnlyDate = (value) => {
    if (!value) return "";

    // Case 1: Format like "May 28 2025  6:03PM" or "May  9 2025  5:55PM"
    if (/[A-Za-z]{3}\s+\d{1,2}\s+\d{4}/.test(value)) {
      const [monthStr, day, year] = value.trim().split(/\s+/);
      const monthMap = {
        Jan: "01",
        Feb: "02",
        Mar: "03",
        Apr: "04",
        May: "05",
        Jun: "06",
        Jul: "07",
        Aug: "08",
        Sep: "09",
        Oct: "10",
        Nov: "11",
        Dec: "12",
      };
      const month = monthMap[monthStr];
      const formattedDay = day.padStart(2, "0");
      return `${formattedDay}/${month}/${year}`;
    }

    // Case 2: Format like "6/11/2025 10:21:35 AM"
    const [datePart] = value.split(" ");
    const [month, day, year] = datePart.split("/"); // US format mm/dd/yyyy
    const formattedDay = day.padStart(2, "0");
    const formattedMonth = month.padStart(2, "0");
    return `${formattedDay}/${formattedMonth}/${year}`;
  };

  const handleChangeFeesType = (e) => {
    const isRecurringDiscounted =
      Number(RecurringPricingInfo.DiscountedPrice) ===
      Number(RecurringPricingInfo.OriginalPrice);
    const isOneOffDiscounted =
      Number(OneOffPricingInfo.DiscountedPrice) ===
      Number(OneOffPricingInfo.OriginalPrice);

    const updatedProposalObj = {
      ...ProposalObject,
      feeTypeId: e.value,
    };

    if (e.value == 2 && isRecurringDiscounted && isOneOffDiscounted) {
      updatedProposalObj.DiscountLines = false;
    } else {
      updatedProposalObj.DiscountLines = true;
    }

    setProposalObject(updatedProposalObj);
  };
  const GetSingleDefaultDiscountPercentageOfPackages = (
    packageOneDiscountPercentage,
    packageTwoDiscountPercentage,
    packageThreeDiscountPercentage
  ) => {
    let DefaultDiscount = null;
    if (
      packageOneDiscountPercentage < 0 ||
      packageTwoDiscountPercentage < 0 ||
      packageThreeDiscountPercentage < 0
    ) {
      DefaultDiscount = -0.01;
    } else if (
      packageOneDiscountPercentage > 0 ||
      packageTwoDiscountPercentage > 0 ||
      packageThreeDiscountPercentage > 0
    ) {
      DefaultDiscount = 1.0;
    }
    return DefaultDiscount;
  };

  const checkAllPackageDiscountPercentageValidation = (
    discountPercentage,
    CurrentValue
  ) => {
    // Allow only numeric, dot, and negative sign characters and limit to 8 characters
    let sanitizedInput = discountPercentage
      .replace(/[^0-9.-]/g, "")
      .slice(0, 8);

    // Ensure the input is properly formatted with a hyphen if necessary
    sanitizedInput = hasHyphenAfterNumber(sanitizedInput);

    // Split the input into integer and decimal parts
    const [integerPart, decimalPart] = sanitizedInput.split(".");

    // Combine integer and decimal parts with appropriate precision
    let formattedInput;

    // Check if the input is within the valid range
    if (
      sanitizedInput === "-" ||
      (parseFloat(sanitizedInput) >= -999.0 &&
        parseFloat(sanitizedInput) <= 100)
    ) {
      if (decimalPart !== undefined) {
        if (integerPart.includes("-")) {
          // For negative values, ensure 4 digits after the negative sign
          formattedInput = `-${integerPart.slice(1, 4)}.${decimalPart.slice(
            0,
            2
          )}`;
        } else {
          // For positive values, limit to 4 digits before the decimal point
          formattedInput = `${integerPart.slice(0, 3)}.${decimalPart.slice(
            0,
            2
          )}`;
        }
      } else {
        // No decimal part, limit to 4 digits
        formattedInput = integerPart.includes("-")
          ? `-${integerPart.slice(1, 4)}`
          : `${integerPart.slice(0, 3)}`;
      }
      return formattedInput === undefined
        ? sanitizedInput === ""
          ? ""
          : CurrentValue
        : formattedInput;
    }
    return formattedInput === undefined
      ? sanitizedInput === ""
        ? ""
        : CurrentValue
      : formattedInput;
  };

  const handleAddAndRemoveAdditionalServices = (
    serviceType,
    serviceCatID,
    serviceID,
    packageID,
    isChecked
  ) => {
    if (serviceType === 1) {
      setSelectedRecurringServiceList((prevServices) =>
        prevServices.map((category) =>
          category.serviceCatID === serviceCatID
            ? {
                ...category,
                servicesList: category.servicesList.map((service) =>
                  service.serviceID === serviceID
                    ? {
                        ...service,
                        servicePackageIDs: isChecked
                          ? [...service.servicePackageIDs, packageID]
                          : service.servicePackageIDs.filter(
                              (id) => id !== packageID
                            ),
                      }
                    : service
                ),
              }
            : category
        )
      );
    } else {
      setSelectedOneOffServiceList((prevServices) =>
        prevServices.map((category) =>
          category.serviceCatID === serviceCatID
            ? {
                ...category,
                servicesList: category.servicesList.map((service) =>
                  service.serviceID === serviceID
                    ? {
                        ...service,
                        servicePackageIDs: isChecked
                          ? [...service.servicePackageIDs, packageID]
                          : service.servicePackageIDs.filter(
                              (id) => id !== packageID
                            ),
                      }
                    : service
                ),
              }
            : category
        )
      );
    }
  };

  const handlePackageOneDiscountPercentage = (e) => {
    let InputValue = checkAllPackageDiscountPercentageValidation(
      e.target.value,
      RecurringPricingInfo.DiscountPercentagePackageOne
    );

    // InputValue = InputValue.replace(
    //   /-/g,
    //   (match, index) => (index === 0 ? match : "")
    // )
    let DefaultDiscount = GetSingleDefaultDiscountPercentageOfPackages(
      InputValue,
      RecurringPricingInfo.DiscountPercentagePackageTwo,
      RecurringPricingInfo.DiscountPercentagePackageThree
    );

    setRecurringPricingInfo({
      ...RecurringPricingInfo,
      DiscountPercentagePackageOne: InputValue,
      DefaultDiscount: DefaultDiscount,
    });
    setRecurringFrequencyPricingInfo({
      ...RecurringFrequencyPricingInfo,
      DiscountPercentagePackageOne: InputValue,
      DefaultDiscount: DefaultDiscount,
    });
  };

  const handlePackageTwoDiscountPercentage = (e) => {
    let InputValue = checkAllPackageDiscountPercentageValidation(
      e.target.value,
      RecurringPricingInfo.DiscountPercentagePackageTwo
    );
    // InputValue = InputValue.replace(
    //   /-/g,
    //   (match, index) => (index === 0 ? match : "")
    // )
    let DefaultDiscount = GetSingleDefaultDiscountPercentageOfPackages(
      RecurringPricingInfo.DiscountPercentagePackageOne,
      InputValue,
      RecurringPricingInfo.DiscountPercentagePackageThree
    );

    setRecurringPricingInfo({
      ...RecurringPricingInfo,
      DiscountPercentagePackageTwo: InputValue,
      DefaultDiscount: DefaultDiscount,
    });
    setRecurringFrequencyPricingInfo({
      ...RecurringFrequencyPricingInfo,
      DiscountPercentagePackageTwo: InputValue,
      DefaultDiscount: DefaultDiscount,
    });
  };

  const handlePackageThreeDiscountPercentage = (e) => {
    let InputValue = checkAllPackageDiscountPercentageValidation(
      e.target.value,
      RecurringPricingInfo.DiscountPercentagePackageThree
    );
    // InputValue = InputValue.replace(
    //   /-/g,
    //   (match, index) => (index === 0 ? match : "")
    // )

    let DefaultDiscount = GetSingleDefaultDiscountPercentageOfPackages(
      RecurringPricingInfo.DiscountPercentagePackageOne,
      RecurringPricingInfo.DiscountPercentagePackageTwo,
      InputValue
    );

    setRecurringPricingInfo({
      ...RecurringPricingInfo,
      DiscountPercentagePackageThree: InputValue,
      DefaultDiscount: DefaultDiscount,
    });
    setRecurringFrequencyPricingInfo({
      ...RecurringFrequencyPricingInfo,
      DiscountPercentagePackageThree: InputValue,
      DefaultDiscount: DefaultDiscount,
    });
  };

  const handleOneOffPackageOneDiscountPercentage = (e) => {
    let InputValue = checkAllPackageDiscountPercentageValidation(
      e.target.value,
      OneOffPricingInfoCopy.DiscountPercentagePackageOne
    );
    // InputValue = InputValue.replace(
    //   /-/g,
    //   (match, index) => (index === 0 ? match : "")
    // )
    let DefaultDiscount = GetSingleDefaultDiscountPercentageOfPackages(
      InputValue,
      OneOffPricingInfoCopy.DiscountPercentagePackageTwo,
      OneOffPricingInfoCopy.DiscountPercentagePackageThree
    );

    setOneOffPricingInfo({
      ...OneOffPricingInfo,
      DiscountPercentagePackageOne: InputValue,
      DefaultDiscount: DefaultDiscount,
    });
    setOneOffPricingInfoCopy({
      ...OneOffPricingInfoCopy,
      DiscountPercentagePackageOne: InputValue,
      DefaultDiscount: DefaultDiscount,
    });
  };

  const handleOneOffPackageTwoDiscountPercentage = (e) => {
    let InputValue = checkAllPackageDiscountPercentageValidation(
      e.target.value,
      OneOffPricingInfoCopy.DiscountPercentagePackageTwo
    );
    // InputValue = InputValue.replace(
    //   /-/g,
    //   (match, index) => (index === 0 ? match : "")
    // )
    let DefaultDiscount = GetSingleDefaultDiscountPercentageOfPackages(
      OneOffPricingInfoCopy.DiscountPercentagePackageOne,
      InputValue,
      OneOffPricingInfoCopy.DiscountPercentagePackageThree
    );

    setOneOffPricingInfo({
      ...OneOffPricingInfo,
      DiscountPercentagePackageTwo: InputValue,
      DefaultDiscount: DefaultDiscount,
    });
    setOneOffPricingInfoCopy({
      ...OneOffPricingInfoCopy,
      DiscountPercentagePackageTwo: InputValue,
      DefaultDiscount: DefaultDiscount,
    });
  };

  const handleOneOffPackageThreeDiscountPercentage = (e) => {
    let InputValue = checkAllPackageDiscountPercentageValidation(
      e.target.value,
      OneOffPricingInfoCopy.DiscountPercentagePackageThree
    );
    // InputValue = InputValue.replace(
    //   /-/g,
    //   (match, index) => (index === 0 ? match : "")
    // )
    let DefaultDiscount = GetSingleDefaultDiscountPercentageOfPackages(
      OneOffPricingInfoCopy.DiscountPercentagePackageOne,
      OneOffPricingInfoCopy.DiscountPercentagePackageTwo,
      InputValue
    );

    setOneOffPricingInfo({
      ...OneOffPricingInfo,
      DiscountPercentagePackageThree: InputValue,
      DefaultDiscount: DefaultDiscount,
    });
    setOneOffPricingInfoCopy({
      ...OneOffPricingInfoCopy,
      DiscountPercentagePackageThree: InputValue,
      DefaultDiscount: DefaultDiscount,
    });
  };

  return (
    <div className="container">
      {/* <div class="main-content"> */}
        <div class="page-content page-background prospect-bg">
          {/* <div class="page-info-header page-info-strip"> */}
            <div class="container">
              <div className="row">
                <div className="col-md-6 col-sm-6 col-6">
                  <div class="prospects-title">
                    <h5>
                      {/* {proposalName}:{" "} */}
                      Reference ID:
                      {isMobile
                        ? ProposalObject?.quotationName &&
                          ProposalObject?.quotationName.length > 15
                          ? `${ProposalObject?.quotationName.substring(
                              0,
                              15
                            )}...`
                          : ProposalObject?.quotationName
                        : ProposalObject?.quotationName}
                    </h5>
                  </div>
                </div>

                <div className="col-md-6 col-sm-6 col-6">
                  <div className="d-flex justify-content-md-end justify-content-sm-end justify-content-end add-new-prospect">
                    {ProposalObject.statusID == statusID.Signed && (
                      <Tooltip title={`Download ${proposalName} `}>
                        <button
                          className="btn btn-md btn-success create-item-btn"
                          onClick={handleDownload}
                        >
                          <i className="bi bi-download"></i>{" "}
                          <span className="d-none d-sm-inline">
                            Download {proposalName}
                          </span>
                        </button>
                      </Tooltip>
                    )}
                    {ProposalObject.statusID !== null &&
                      ProposalObject.statusID !== statusID.Signed && (
                        <Tooltip title={`View Pdf`}>
                          <button
                            className="btn btn-md btn-success create-item-btn"
                            onClick={handleDownload}
                          >
                            <i class="bi bi-eye"></i>{" "}
                            <span className="d-none d-sm-inline">View Pdf</span>
                          </button>
                        </Tooltip>
                      )}
                    <Tooltip title={`Back`}>
                      <button
                        className="btn btn-md btn-success create-item-btn"
                        onClick={handleBack}
                        style={{ marginLeft: "10px" }}
                      >
                        <i className="fa fa-arrow-left d-md-none"></i>
                        <span className="d-none d-sm-inline">Back</span>
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          {/* </div> */}
          <div class="container-fluid ">
            <div class="row">
              <div class="col-lg-12">
                <div class="card" style={{ marginTop: "75px" }}>
                  <div class="card-body">
                    <div id="customerList">
                      <div class="row g-4 mb-3"></div>
                      <div class="search-box ms-2 width-searchbox prospect-form">
                        <div class=" table-card  mb-3 Height_View_scroll scroll-hidden">
                          <ul class="nav nav-tabs mb-3" role="tablist">
                            <li class="nav-item">
                              <a
                                class="nav-link tab_nav active"
                                data-bs-toggle="tab"
                                href="#base-justified-home"
                                role="tab"
                                aria-selected="false"
                              >
                                Basic Information
                              </a>
                            </li>
                            <li class="nav-item">
                              <a
                                class="nav-link tab_nav"
                                data-bs-toggle="tab"
                                href="#product"
                                role="tab"
                                aria-selected="false"
                              >
                                Selected Services
                              </a>
                            </li>
                            <li class="nav-item">
                              <a
                                class="nav-link tab_nav"
                                data-bs-toggle="tab"
                                href="#Officer"
                                role="tab"
                                aria-selected="false"
                              >
                                All Officers
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
                                    <td class="break-table" colspan="2"></td>
                                  </tr>
                                  <tr>
                                    <th colspan="2">Basic Information</th>
                                  </tr>
                                  <tr>
                                    <td>{prospectName} Name</td>
                                    <td class="text-end">
                                      {ProposalObject.clientName}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Template</td>
                                    <td class="text-end">
                                      {ProposalObject.templateName}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Proposal Type</td>
                                    <td class="text-end">
                                      {ProposalObject.quoteTypeName}
                                    </td>
                                  </tr>
                                  {ProposalObject.draftOn && (
                                    <tr>
                                      <td>Drafted On</td>
                                      <td class="text-end">
                                        {GetOnlyDate(ProposalObject.draftOn)}
                                      </td>
                                    </tr>
                                  )}
                                  {ProposalObject.sentOn && (
                                    <tr>
                                      <td>Sent On</td>
                                      <td class="text-end">
                                        {GetOnlyDate(ProposalObject.sentOn)}
                                      </td>
                                    </tr>
                                  )}
                                  {ProposalObject.AcceptedOn && (
                                    <tr>
                                      <td>Accepted On</td>
                                      <td class="text-end">
                                        {GetOnlyDate(ProposalObject.AcceptedOn)}
                                      </td>
                                    </tr>
                                  )}

                                  {ProposalObject.SkippedOn && (
                                    <tr>
                                      <td>Skipped On</td>
                                      <td class="text-end">
                                        {GetOnlyDate(ProposalObject.SkippedOn)}
                                      </td>
                                    </tr>
                                  )}
                                  {ProposalObject.contractKeyID
                                    ?.slice(0, visibleCount)
                                    .map((contract) => (
                                      <tr>
                                        <td>Linked Engagement Letter</td>
                                        <td
                                          class="text-end"
                                          style={{
                                            color: "blue",
                                            cursor: "pointer",
                                          }}
                                          onClick={() =>
                                            navigate("/view-letter", {
                                              state: {
                                                contractKeyID: contract,
                                              },
                                            })
                                          }
                                        >
                                          View EL
                                        </td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                              {visibleCount <
                                ProposalObject.contractKeyID?.length && (
                                <div className="text-left mt-3">
                                  <button
                                    onClick={handleShowMore}
                                    className="btn btn-primary"
                                  >
                                    Show More
                                  </button>
                                </div>
                              )}
                            </div>

                            <div
                              style={{ width: "98%" }}
                              class="tab-pane"
                              id="product"
                              role="tabpanel"
                            >
                              {packageList.length > 0 ? (
                                <>
                                  <div>
                                    <div className="tab-content">
                                      <div className="tab-pane p-3 active">
                                        <div className="row">
                                          <div className="row fieldset">
                                            <div className="col-lg-3 text-lg-right">
                                              <label className="fieldset-label required">
                                                Fees in the {proposalName}
                                              </label>
                                            </div>
                                            <div className="col-lg-9">
                                              <div className="input-group">
                                                {/* Add your Select component here */}
                                                <Select
                                                  // isDisabled
                                                  className="phone-input-country-code selectDropDown Drop-down-width"
                                                  value={feeTypeValue}
                                                  options={Utils.feeInProposal}
                                                  onChange={
                                                    handleChangeFeesType
                                                  }
                                                />
                                              </div>
                                            </div>
                                          </div>
                                          {ProposalObject.paymentGatewayID !==
                                            null && (
                                            <div className="row fieldset">
                                              <div className="col-lg-3 text-lg-right">
                                                <label className="fieldset-label required">
                                                  Payment Gateway
                                                  <span className="text-danger">
                                                    *
                                                  </span>
                                                </label>
                                              </div>
                                              <div className="col-md-9 mb-2">
                                                <div className="input-group">
                                                  {/* Adjust the Select component as needed */}
                                                  <Select
                                                    isDisabled
                                                    className="phone-input-country-code selectDropDown Drop-down-width"
                                                    value={PaymentGatewayValue}
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                          <div className="row fieldset">
                                            <div className="col-lg-3 text-lg-right">
                                              <label className="fieldset-label required">
                                                Show Discount
                                              </label>
                                            </div>
                                            <div className="col-lg-9">
                                              <div className="input-group">
                                                {/* Replace Select with Checkbox */}
                                                <input
                                                  type="checkbox"
                                                  disabled
                                                  checked={
                                                    ProposalObject.DiscountLines
                                                  }
                                                />
                                              </div>
                                            </div>
                                          </div>
                                          {ProposalObject.acceptedServicePackageID !==
                                            null &&
                                            ProposalObject.statusID !==
                                              statusID.Declined && (
                                              <div className="row fieldset mt-2">
                                                <div className="col-lg-3 text-lg-right">
                                                  <label className="fieldset-label required">
                                                    Accepted Package
                                                  </label>
                                                </div>
                                                <div className="col-lg-9">
                                                  <div className="input-group">
                                                    <label className="fieldset-label required">
                                                      {acceptedPackageName}
                                                    </label>
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                        </div>
                                      </div>
                                    </div>
                                    {selectedRecurringServiceList?.length !==
                                      0 && (
                                      <div className="tab-content">
                                        <div className="tab-pane p-3 active">
                                          <div className="row">
                                            <div className="col-lg-12">
                                              <div className="separator mb-2"></div>
                                              <h6>Recurring Services</h6>
                                              <div className="separator mb-3"></div>

                                              <div
                                                className="row"
                                                id="recurring_Default"
                                              >
                                                <div class="col-lg-2 mb-1 col-md-2 col-sm-12 mt-2 text-md-end">
                                                  {packageCount == 1 && (
                                                    <label className="fieldset-label">
                                                      Discount (%)
                                                    </label>
                                                  )}
                                                </div>
                                                <div className="col-lg-4">
                                                  {packageCount == 1 && (
                                                    <input
                                                      readonly=""
                                                      className="input-text"
                                                      type="number" // Change type to number
                                                      placeholder="Default Discount (%)"
                                                      value={Number(
                                                        Math.floor(
                                                          RecurringPricingInfo.DefaultDiscount *
                                                            100
                                                        ) / 100
                                                      )
                                                        .toFixed(2)
                                                        .replace(
                                                          /\B(?=(\d{3})+(?!\d))/g,
                                                          ","
                                                        )}
                                                    />
                                                  )}
                                                </div>
                                                <div className="col-lg-2 text-lg-right">
                                                  <label className="fieldset-label required mt-2">
                                                    Payment Frequency
                                                  </label>
                                                </div>
                                                <div className="col-lg-4">
                                                  <Select
                                                    isDisabled
                                                    className="phone-input-country-code selectDropDown Drop-down-width"
                                                    value={selectedFrequency}
                                                  />
                                                </div>
                                              </div>
                                              <div className="row fieldset"></div>
                                              <div className="mb-3"></div>

                                              {/* Recurring */}
                                              {pricingTableColumnIDs === null ||
                                              pricingTableColumnIDs === "" ||
                                              pricingTableColumnIDs ===
                                                undefined ? (
                                                <div
                                                  style={{ marginTop: "0px" }}
                                                  className="table-responsive"
                                                >
                                                  <table
                                                    class="table align-middle table-nowrap"
                                                    style={{ width: "100%" }}
                                                  >
                                                    <thead className="table-light table-header-font">
                                                      <tr className="head-row">
                                                        <td className="tr-table-class text-white">
                                                          Services
                                                        </td>
                                                        {selectedPackagesList.map(
                                                          (pkg, index) => (
                                                            <td
                                                              key={index}
                                                              style={{
                                                                fontWeight:
                                                                  getFontStyles(
                                                                    selectedPackagesList[
                                                                      index
                                                                    ]
                                                                      .servicePackageID,
                                                                    "ID"
                                                                  ).fontWeight,
                                                                fontSize:
                                                                  getFontStyles(
                                                                    selectedPackagesList[
                                                                      index
                                                                    ]
                                                                      .servicePackageID,
                                                                    "ID"
                                                                  ).fontSize,
                                                              }}
                                                              className="tr-table-class text-white text-right"
                                                            >
                                                              {pkg
                                                                .servicePackageName
                                                                .length > 10 ? (
                                                                <Tooltip
                                                                  title={
                                                                    pkg.servicePackageName
                                                                  }
                                                                >
                                                                  {pkg.servicePackageName
                                                                    .substring(
                                                                      0,
                                                                      10
                                                                    )
                                                                    .toLowerCase()
                                                                    .replace(
                                                                      /\b\w/g,
                                                                      (l) =>
                                                                        l.toUpperCase()
                                                                    ) + "..."}
                                                                </Tooltip>
                                                              ) : pkg
                                                                  .servicePackageName
                                                                  .length >
                                                                10 ? (
                                                                <Tooltip
                                                                  title={
                                                                    pkg.servicePackageName
                                                                  }
                                                                >
                                                                  {pkg.servicePackageName.substring(
                                                                    0,
                                                                    10
                                                                  ) + "..."}
                                                                </Tooltip>
                                                              ) : (
                                                                pkg.servicePackageName
                                                              )}
                                                            </td>
                                                          )
                                                        )}
                                                      </tr>
                                                    </thead>
                                                    <tbody>
                                                      {selectedRecurringServiceList.map(
                                                        (service, index) => {
                                                          return (
                                                            <>
                                                              <tr className="a-la-carte-services-review-head-row">
                                                                <th
                                                                  colSpan={
                                                                    1 +
                                                                    packageCount
                                                                  }
                                                                >
                                                                  {
                                                                    service.serviceCatName
                                                                  }
                                                                </th>
                                                              </tr>
                                                              {service.servicesList.map(
                                                                (
                                                                  subService,
                                                                  subIndex
                                                                ) => (
                                                                  <tr
                                                                    key={
                                                                      subIndex
                                                                    }
                                                                    className={` ${
                                                                      subService?.isAdditionalService ===
                                                                      true
                                                                        ? "bg-info  text-white"
                                                                        : ""
                                                                    }`}
                                                                  >
                                                                    <td>
                                                                      <div>
                                                                        {subService
                                                                          .serviceName
                                                                          .length >
                                                                        45
                                                                          ? subService.serviceName
                                                                              .substring(
                                                                                0,
                                                                                45
                                                                              )
                                                                              .toLowerCase()
                                                                              .replace(
                                                                                /\b\w/g,
                                                                                (
                                                                                  l
                                                                                ) =>
                                                                                  l.toUpperCase()
                                                                              ) +
                                                                            "..."
                                                                          : subService.serviceName}
                                                                      </div>
                                                                      <div className="package-variables"></div>
                                                                    </td>

                                                                    <td
                                                                      style={{
                                                                        fontWeight:
                                                                          getFontStyles(
                                                                            0,
                                                                            "Index"
                                                                          )
                                                                            .fontWeight,
                                                                        fontSize:
                                                                          getFontStyles(
                                                                            0,
                                                                            "Index"
                                                                          )
                                                                            .fontSize,
                                                                      }}
                                                                      className="text-right"
                                                                    >
                                                                      {ProposalObject.feeTypeId ===
                                                                      1 ? (
                                                                        <>
                                                                          {" "}
                                                                          {subService.packageOneValue ===
                                                                          null ? (
                                                                            <span className="fa fa-times"></span>
                                                                          ) : (
                                                                            formatValue(
                                                                              subService.packageOneValue
                                                                            )
                                                                          )}
                                                                        </>
                                                                      ) : subService.packageOneValue !==
                                                                        null ? (
                                                                        <span className="fa fa-check"></span>
                                                                      ) : (
                                                                        <span className="fa fa-times"></span>
                                                                      )}
                                                                    </td>
                                                                    {packageCount >=
                                                                      2 && (
                                                                      <td
                                                                        style={{
                                                                          fontWeight:
                                                                            getFontStyles(
                                                                              1,
                                                                              "Index"
                                                                            )
                                                                              .fontWeight,
                                                                          fontSize:
                                                                            getFontStyles(
                                                                              1,
                                                                              "Index"
                                                                            )
                                                                              .fontSize,
                                                                        }}
                                                                        className="text-right"
                                                                      >
                                                                        {ProposalObject.feeTypeId ===
                                                                        1 ? (
                                                                          <>
                                                                            {" "}
                                                                            {
                                                                              subService.packageTwoValue ===
                                                                              null ? (
                                                                                <span className="fa fa-times"></span>
                                                                              ) : (
                                                                                formatValue(
                                                                                  subService.packageTwoValue
                                                                                )
                                                                              )
                                                                              // Number(
                                                                              //   subService.packageTwoValue
                                                                              // )
                                                                              //   .toFixed(2)
                                                                              //   .toString()
                                                                              //   .replace(
                                                                              //     /\B(?=(\d{3})+(?!\d))/g,
                                                                              //     ","
                                                                              //   )
                                                                            }
                                                                          </>
                                                                        ) : subService.packageTwoValue !==
                                                                          null ? (
                                                                          <span className="fa fa-check"></span>
                                                                        ) : (
                                                                          <span className="fa fa-times"></span>
                                                                        )}
                                                                      </td>
                                                                    )}
                                                                    {packageCount ===
                                                                      3 && (
                                                                      <td
                                                                        style={{
                                                                          fontWeight:
                                                                            getFontStyles(
                                                                              2,
                                                                              "Index"
                                                                            )
                                                                              .fontWeight,
                                                                          fontSize:
                                                                            getFontStyles(
                                                                              2,
                                                                              "Index"
                                                                            )
                                                                              .fontSize,
                                                                        }}
                                                                        className="text-right"
                                                                      >
                                                                        {ProposalObject.feeTypeId ===
                                                                        1 ? (
                                                                          <>
                                                                            {" "}
                                                                            {
                                                                              subService.packageThreeValue ===
                                                                              null ? (
                                                                                <span className="fa fa-times"></span>
                                                                              ) : (
                                                                                formatValue(
                                                                                  subService.packageThreeValue
                                                                                )
                                                                              )
                                                                              // Number(
                                                                              //   subService.packageThreeValue
                                                                              // )
                                                                              //   .toFixed(2)
                                                                              //   .toString()
                                                                              //   .replace(
                                                                              //     /\B(?=(\d{3})+(?!\d))/g,
                                                                              //     ","
                                                                              //   )
                                                                            }
                                                                          </>
                                                                        ) : subService.packageThreeValue !==
                                                                          null ? (
                                                                          <span className="fa fa-check"></span>
                                                                        ) : (
                                                                          <span className="fa fa-times"></span>
                                                                        )}
                                                                      </td>
                                                                    )}
                                                                  </tr>
                                                                )
                                                              )}
                                                            </>
                                                          );
                                                        }
                                                      )}
                                                    </tbody>
                                                    {packageCount > 1 && (
                                                      <>
                                                        <tr id="recurring_DefaultWithPackages">
                                                          <td>
                                                            <div>
                                                              Discount (%)
                                                            </div>
                                                            {/* <div className="package-variables"></div> */}
                                                          </td>

                                                          <td
                                                            style={{
                                                              width: "35%",
                                                              padding: "0px",
                                                              whiteSpace:
                                                                "normal",
                                                            }}
                                                          >
                                                            <div
                                                              style={{
                                                                display: "flex",
                                                                flexDirection:
                                                                  "column",
                                                                alignItems:
                                                                  "flex-start",
                                                              }}
                                                            >
                                                              <input
                                                                readOnly
                                                                className="input-text"
                                                                type="number" // Change type to number
                                                                placeholder="Discount (%)"
                                                                value={Number(
                                                                  RecurringPricingInfo.DiscountPercentagePackageOne
                                                                )
                                                                  .toFixed(2)
                                                                  .replace(
                                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                                    ","
                                                                  )}
                                                                style={{
                                                                  width: "100%",
                                                                  textAlign:
                                                                    "right",
                                                                }}
                                                              />
                                                            </div>
                                                          </td>

                                                          {packageCount >=
                                                            2 && (
                                                            <td
                                                              style={{
                                                                width: "35%",
                                                                padding: "0px",
                                                                whiteSpace:
                                                                  "normal",
                                                              }}
                                                            >
                                                              <div
                                                                style={{
                                                                  display:
                                                                    "flex",
                                                                  flexDirection:
                                                                    "column",
                                                                  alignItems:
                                                                    "flex-start",
                                                                }}
                                                              >
                                                                <input
                                                                  readOnly
                                                                  className="input-text"
                                                                  type="number" // Change type to number
                                                                  placeholder="Discount (%)"
                                                                  value={Number(
                                                                    RecurringPricingInfo.DiscountPercentagePackageTwo
                                                                  )
                                                                    .toFixed(2)
                                                                    .replace(
                                                                      /\B(?=(\d{3})+(?!\d))/g,
                                                                      ","
                                                                    )}
                                                                  style={{
                                                                    width:
                                                                      "100%",
                                                                    textAlign:
                                                                      "right",
                                                                  }}
                                                                />
                                                                <div></div>
                                                              </div>
                                                            </td>
                                                          )}

                                                          {packageCount ===
                                                            3 && (
                                                            <td
                                                              style={{
                                                                width: "35%",
                                                                padding: "0px",
                                                                whiteSpace:
                                                                  "normal",
                                                              }}
                                                            >
                                                              <div
                                                                style={{
                                                                  display:
                                                                    "flex",
                                                                  flexDirection:
                                                                    "column",
                                                                  alignItems:
                                                                    "flex-start",
                                                                }}
                                                              >
                                                                <input
                                                                  readOnly
                                                                  className="input-text"
                                                                  type="number" // Change type to number
                                                                  placeholder="Discount (%)"
                                                                  value={Number(
                                                                    RecurringPricingInfo.DiscountPercentagePackageThree
                                                                  )
                                                                    .toFixed(2)
                                                                    .replace(
                                                                      /\B(?=(\d{3})+(?!\d))/g,
                                                                      ","
                                                                    )}
                                                                  style={{
                                                                    width:
                                                                      "100%",
                                                                    textAlign:
                                                                      "right",
                                                                  }}
                                                                />
                                                              </div>
                                                            </td>
                                                          )}
                                                        </tr>
                                                      </>
                                                    )}
                                                    <tr className="head-row">
                                                      <td className="tr-table-class font-14 text-white">
                                                        Net Total
                                                      </td>
                                                      <td
                                                        style={{
                                                          fontWeight:
                                                            getFontStyles(
                                                              0,
                                                              "Index"
                                                            ).fontWeight,
                                                          fontSize:
                                                            getFontStyles(
                                                              0,
                                                              "Index"
                                                            ).fontSize,
                                                        }}
                                                        className="tr-table-class font-14 text-white text-right"
                                                      >
                                                        {" "}
                                                        {Number(
                                                          RecurringPricingInfo.packageOneNetTotal
                                                        ) <
                                                          Number(
                                                            RecurringPricingInfo.packageOneDisCountedTotal
                                                          ) ||
                                                        (Number(
                                                          RecurringPricingInfo.packageOneDisCount
                                                        ) > 0 &&
                                                          !ProposalObject.DiscountLines)
                                                          ? formatValue(
                                                              RecurringPricingInfo.packageOneDisCountedTotal
                                                            )
                                                          : formatValue(
                                                              RecurringPricingInfo.packageOneNetTotal
                                                            )}
                                                      </td>
                                                      {packageCount >= 2 && (
                                                        <td
                                                          style={{
                                                            fontWeight:
                                                              getFontStyles(
                                                                1,
                                                                "Index"
                                                              ).fontWeight,
                                                            fontSize:
                                                              getFontStyles(
                                                                1,
                                                                "Index"
                                                              ).fontSize,
                                                          }}
                                                          className="tr-table-class font-14 text-white text-right"
                                                        >
                                                          {" "}
                                                          {Number(
                                                            RecurringPricingInfo.packageTwoNetTotal
                                                          ) <
                                                            Number(
                                                              RecurringPricingInfo.packageTwoDisCountedTotal
                                                            ) ||
                                                          (Number(
                                                            RecurringPricingInfo.packageTwoDisCount
                                                          ) > 0 &&
                                                            !ProposalObject.DiscountLines)
                                                            ? formatValue(
                                                                RecurringPricingInfo.packageTwoDisCountedTotal
                                                              )
                                                            : formatValue(
                                                                RecurringPricingInfo.packageTwoNetTotal
                                                              )}
                                                        </td>
                                                      )}{" "}
                                                      {packageCount === 3 && (
                                                        <td
                                                          style={{
                                                            fontWeight:
                                                              getFontStyles(
                                                                2,
                                                                "Index"
                                                              ).fontWeight,
                                                            fontSize:
                                                              getFontStyles(
                                                                2,
                                                                "Index"
                                                              ).fontSize,
                                                          }}
                                                          className="tr-table-class font-14 text-white text-right"
                                                        >
                                                          {" "}
                                                          {Number(
                                                            RecurringPricingInfo.packageThreeNetTotal
                                                          ) <
                                                            Number(
                                                              RecurringPricingInfo.packageThreeDisCountedTotal
                                                            ) ||
                                                          (Number(
                                                            RecurringPricingInfo.packageThreeDisCount
                                                          ) > 0 &&
                                                            !ProposalObject.DiscountLines)
                                                            ? formatValue(
                                                                RecurringPricingInfo.packageThreeDisCountedTotal
                                                              )
                                                            : formatValue(
                                                                RecurringPricingInfo.packageThreeNetTotal
                                                              )}
                                                        </td>
                                                      )}
                                                    </tr>

                                                    {(Number(
                                                      RecurringPricingInfo.packageThreeDisCount
                                                    ) > 0 ||
                                                      Number(
                                                        RecurringPricingInfo.packageOneDisCount
                                                      ) > 0 ||
                                                      Number(
                                                        RecurringPricingInfo.packageTwoDisCount
                                                      ) > 0) &&
                                                      ProposalObject.DiscountLines && (
                                                        <>
                                                          <tr className="head-grey-row">
                                                            <td className="tr-table-class font-14  text-white">
                                                              Discount
                                                            </td>
                                                            <td
                                                              style={{
                                                                fontWeight:
                                                                  getFontStyles(
                                                                    0,
                                                                    "Index"
                                                                  ).fontWeight,
                                                                fontSize:
                                                                  getFontStyles(
                                                                    0,
                                                                    "Index"
                                                                  ).fontSize,
                                                              }}
                                                              className="tr-table-class font-14 text-white text-right"
                                                            >
                                                              (-){" "}
                                                              {new Intl.NumberFormat(
                                                                "en-GB",
                                                                {
                                                                  style:
                                                                    "currency",
                                                                  currency:
                                                                    "GBP",
                                                                }
                                                              ).format(
                                                                Number(
                                                                  RecurringPricingInfo.packageOneDisCount
                                                                )
                                                              )}
                                                              {/* NewDiscount Rs.{RecurringPackageCalculation.PackageOneDiscountAmount} */}
                                                            </td>
                                                            {packageCount >=
                                                              2 && (
                                                              <td
                                                                style={{
                                                                  fontWeight:
                                                                    getFontStyles(
                                                                      1,
                                                                      "Index"
                                                                    )
                                                                      .fontWeight,
                                                                  fontSize:
                                                                    getFontStyles(
                                                                      1,
                                                                      "Index"
                                                                    ).fontSize,
                                                                }}
                                                                className="tr-table-class font-14 text-white text-right"
                                                              >
                                                                (-){" "}
                                                                {new Intl.NumberFormat(
                                                                  "en-GB",
                                                                  {
                                                                    style:
                                                                      "currency",
                                                                    currency:
                                                                      "GBP",
                                                                  }
                                                                ).format(
                                                                  Number(
                                                                    RecurringPricingInfo.packageTwoDisCount
                                                                  )
                                                                )}
                                                              </td>
                                                            )}
                                                            {packageCount ===
                                                              3 && (
                                                              <td
                                                                style={{
                                                                  fontWeight:
                                                                    getFontStyles(
                                                                      2,
                                                                      "Index"
                                                                    )
                                                                      .fontWeight,
                                                                  fontSize:
                                                                    getFontStyles(
                                                                      2,
                                                                      "Index"
                                                                    ).fontSize,
                                                                }}
                                                                className="tr-table-class font-14 text-white text-right"
                                                              >
                                                                (-){" "}
                                                                {new Intl.NumberFormat(
                                                                  "en-GB",
                                                                  {
                                                                    style:
                                                                      "currency",
                                                                    currency:
                                                                      "GBP",
                                                                  }
                                                                ).format(
                                                                  Number(
                                                                    RecurringPricingInfo.packageThreeDisCount
                                                                  )
                                                                )}
                                                              </td>
                                                            )}
                                                          </tr>
                                                          <tr className="head-row">
                                                            <td className="tr-table-class font-14 text-white">
                                                              Discounted Total
                                                            </td>
                                                            <td
                                                              style={{
                                                                fontWeight:
                                                                  getFontStyles(
                                                                    0,
                                                                    "Index"
                                                                  ).fontWeight,
                                                                fontSize:
                                                                  getFontStyles(
                                                                    0,
                                                                    "Index"
                                                                  ).fontSize,
                                                              }}
                                                              className="tr-table-class font-14 text-white text-right"
                                                            >
                                                              {new Intl.NumberFormat(
                                                                "en-GB",
                                                                {
                                                                  style:
                                                                    "currency",
                                                                  currency:
                                                                    "GBP",
                                                                }
                                                              ).format(
                                                                Number(
                                                                  RecurringPricingInfo.packageOneDisCountedTotal
                                                                )
                                                              )}

                                                              {/* New Rs.{RecurringPackageCalculation.PackageOneDiscountedTotalAmount} */}
                                                            </td>
                                                            {packageCount >=
                                                              2 && (
                                                              <td
                                                                style={{
                                                                  fontWeight:
                                                                    getFontStyles(
                                                                      1,
                                                                      "Index"
                                                                    )
                                                                      .fontWeight,
                                                                  fontSize:
                                                                    getFontStyles(
                                                                      1,
                                                                      "Index"
                                                                    ).fontSize,
                                                                }}
                                                                className="tr-table-class font-14  text-white text-right"
                                                              >
                                                                {new Intl.NumberFormat(
                                                                  "en-GB",
                                                                  {
                                                                    style:
                                                                      "currency",
                                                                    currency:
                                                                      "GBP",
                                                                  }
                                                                ).format(
                                                                  Number(
                                                                    RecurringPricingInfo.packageTwoDisCountedTotal
                                                                  )
                                                                )}
                                                              </td>
                                                            )}
                                                            {packageCount ===
                                                              3 && (
                                                              <td
                                                                style={{
                                                                  fontWeight:
                                                                    getFontStyles(
                                                                      2,
                                                                      "Index"
                                                                    )
                                                                      .fontWeight,
                                                                  fontSize:
                                                                    getFontStyles(
                                                                      2,
                                                                      "Index"
                                                                    ).fontSize,
                                                                }}
                                                                className="tr-table-class font-14 text-white text-right"
                                                              >
                                                                {new Intl.NumberFormat(
                                                                  "en-GB",
                                                                  {
                                                                    style:
                                                                      "currency",
                                                                    currency:
                                                                      "GBP",
                                                                  }
                                                                ).format(
                                                                  Number(
                                                                    RecurringPricingInfo.packageThreeDisCountedTotal
                                                                  )
                                                                )}
                                                              </td>
                                                            )}
                                                          </tr>
                                                        </>
                                                      )}

                                                    {vatPercentage && (
                                                      <>
                                                        <tr class="head-grey-row">
                                                          <td className="tr-table-class font-14 text-white">
                                                            {getTaxName(
                                                              ProposalObject.currencyID
                                                            )}
                                                          </td>
                                                          <td
                                                            style={{
                                                              fontWeight:
                                                                getFontStyles(
                                                                  0,
                                                                  "Index"
                                                                ).fontWeight,
                                                              fontSize:
                                                                getFontStyles(
                                                                  0,
                                                                  "Index"
                                                                ).fontSize,
                                                            }}
                                                            className="tr-table-class font-14 text-white text-right"
                                                          >
                                                            {" "}
                                                            {formatValue(
                                                              RecurringPricingInfo.PackageOneVaTPrice
                                                            )}
                                                          </td>
                                                          {packageCount >=
                                                            2 && (
                                                            <td
                                                              style={{
                                                                fontWeight:
                                                                  getFontStyles(
                                                                    1,
                                                                    "Index"
                                                                  ).fontWeight,
                                                                fontSize:
                                                                  getFontStyles(
                                                                    1,
                                                                    "Index"
                                                                  ).fontSize,
                                                              }}
                                                              className="tr-table-class font-14 text-white text-right"
                                                            >
                                                              {" "}
                                                              {formatValue(
                                                                RecurringPricingInfo.PackageTwoVaTPrice
                                                              )}
                                                            </td>
                                                          )}
                                                          {packageCount ===
                                                            3 && (
                                                            <td
                                                              style={{
                                                                fontWeight:
                                                                  getFontStyles(
                                                                    2,
                                                                    "Index"
                                                                  ).fontWeight,
                                                                fontSize:
                                                                  getFontStyles(
                                                                    2,
                                                                    "Index"
                                                                  ).fontSize,
                                                              }}
                                                              className="tr-table-class font-14 text-white text-right"
                                                            >
                                                              {" "}
                                                              {formatValue(
                                                                RecurringPricingInfo.PackageThreeVaTPrice
                                                              )}
                                                            </td>
                                                          )}
                                                        </tr>
                                                        <tr className="head-row">
                                                          <td className="tr-table-class font-14 text-white">
                                                            Grand Total
                                                          </td>
                                                          <td
                                                            style={{
                                                              fontWeight:
                                                                getFontStyles(
                                                                  0,
                                                                  "Index"
                                                                ).fontWeight,
                                                              fontSize:
                                                                getFontStyles(
                                                                  0,
                                                                  "Index"
                                                                ).fontSize,
                                                            }}
                                                            className="tr-table-class font-14 text-white text-right"
                                                          >
                                                            {" "}
                                                            {formatValue(
                                                              RecurringPricingInfo.PackageOneGrandTotal
                                                            )}
                                                          </td>
                                                          {packageCount >=
                                                            2 && (
                                                            <td
                                                              style={{
                                                                fontWeight:
                                                                  getFontStyles(
                                                                    1,
                                                                    "Index"
                                                                  ).fontWeight,
                                                                fontSize:
                                                                  getFontStyles(
                                                                    1,
                                                                    "Index"
                                                                  ).fontSize,
                                                              }}
                                                              className="tr-table-class font-14 text-white text-right"
                                                            >
                                                              {" "}
                                                              {formatValue(
                                                                RecurringPricingInfo.PackageTwoGrandTotal
                                                              )}
                                                            </td>
                                                          )}
                                                          {packageCount ==
                                                            3 && (
                                                            <td
                                                              style={{
                                                                fontWeight:
                                                                  getFontStyles(
                                                                    2,
                                                                    "Index"
                                                                  ).fontWeight,
                                                                fontSize:
                                                                  getFontStyles(
                                                                    2,
                                                                    "Index"
                                                                  ).fontSize,
                                                              }}
                                                              className="tr-table-class font-14 text-white text-right"
                                                            >
                                                              {" "}
                                                              {formatValue(
                                                                RecurringPricingInfo.PackageThreeGrandTotal
                                                              )}
                                                            </td>
                                                          )}
                                                        </tr>
                                                      </>
                                                    )}
                                                  </table>
                                                </div>
                                              ) : (
                                                <div
                                                  style={{ marginTop: "0px" }}
                                                  className="table-responsive"
                                                >
                                                  {/* <div
                                                                              dangerouslySetInnerHTML={{
                                                                                __html: currentPricingTableDesignRecurring,
                                                                              }}
                                                                            /> */}
                                                  <table
                                                    class="table align-middle table-nowrap"
                                                    style={{ width: "100%" }}
                                                  >
                                                    <thead className="table-light table-header-font">
                                                      <tr className="head-row">
                                                        <td></td>
                                                        {selectedPackagesList.map(
                                                          (pkg, index) => (
                                                            <>
                                                              <td
                                                                key={index}
                                                                className="tr-table-class font-14 text-white text-right"
                                                              >
                                                                {pkg
                                                                  .servicePackageName
                                                                  .length >
                                                                10 ? (
                                                                  <Tooltip
                                                                    title={
                                                                      pkg.servicePackageName
                                                                    }
                                                                  >
                                                                    {pkg.servicePackageName
                                                                      .substring(
                                                                        0,
                                                                        10
                                                                      )
                                                                      .toLowerCase()
                                                                      .replace(
                                                                        /\b\w/g,
                                                                        (l) =>
                                                                          l.toUpperCase()
                                                                      ) + "..."}
                                                                  </Tooltip>
                                                                ) : pkg
                                                                    .servicePackageName
                                                                    .length >
                                                                  10 ? (
                                                                  <Tooltip
                                                                    title={
                                                                      pkg.servicePackageName
                                                                    }
                                                                  >
                                                                    {pkg.servicePackageName.substring(
                                                                      0,
                                                                      10
                                                                    ) + "..."}
                                                                  </Tooltip>
                                                                ) : (
                                                                  pkg.servicePackageName
                                                                )}
                                                              </td>
                                                              {visibleFieldsCustomTemp.vat && (
                                                                <td></td>
                                                              )}
                                                              {visibleFieldsCustomTemp.serviceScope && (
                                                                <td></td>
                                                              )}

                                                              {/* {packageCount >= 2 && (
                                                                     <>
                                                                       <td
                                                                         key={index}
                                                                         className="tr-table-class font-14 text-white text-right"
                                                                       >
                                                                         {pkg.servicePackageName.length > 10 ? (
                                                                           <Tooltip title={pkg.servicePackageName}>
                                                                             {pkg.servicePackageName
                                                                               .substring(0, 10)
                                                                               .toLowerCase()
                                                                               .replace(/\b\w/g, (l) => l.toUpperCase()) +
                                                                               "..."}
                                                                           </Tooltip>
                                                                         ) : pkg.servicePackageName.length > 10 ? (
                                                                           <Tooltip title={pkg.servicePackageName}>
                                                                             {pkg.servicePackageName.substring(0, 10) +
                                                                               "..."}
                                                                           </Tooltip>
                                                                         ) : (
                                                                           pkg.servicePackageName
                                                                         )}
                                                                       </td>
                                                                       {visibleFieldsCustomTemp.vat && <td></td>}
                                                                       {visibleFieldsCustomTemp.serviceScope && <td></td>}
                                                                     </>
                                                                   )}
                                                                   {packageCount === 3 && (
                                                                     <>
                                                                       <td
                                                                         key={index}
                                                                         className="tr-table-class font-14 text-white text-right"
                                                                       >
                                                                         {pkg.servicePackageName.length > 10 ? (
                                                                           <Tooltip title={pkg.servicePackageName}>
                                                                             {pkg.servicePackageName
                                                                               .substring(0, 10)
                                                                               .toLowerCase()
                                                                               .replace(/\b\w/g, (l) => l.toUpperCase()) +
                                                                               "..."}
                                                                           </Tooltip>
                                                                         ) : pkg.servicePackageName.length > 10 ? (
                                                                           <Tooltip title={pkg.servicePackageName}>
                                                                             {pkg.servicePackageName.substring(0, 10) +
                                                                               "..."}
                                                                           </Tooltip>
                                                                         ) : (
                                                                           pkg.servicePackageName
                                                                         )}
                                                                       </td>
                                                                       {visibleFieldsCustomTemp.vat && <td></td>}
                                                                       {visibleFieldsCustomTemp.serviceScope && <td></td>}
                                                                     </>
                                                                   )} */}
                                                            </>
                                                          )
                                                        )}
                                                      </tr>
                                                      <tr className="head-row">
                                                        {visibleFieldsCustomTemp.serviceName && (
                                                          <td className="tr-table-class font-14 text-white">
                                                            Services
                                                          </td>
                                                        )}
                                                        {selectedPackagesList.map(
                                                          (pkg, index) => (
                                                            <>
                                                              {/* <td
                                                                     key={index}
                                                                     className="tr-table-class font-14 text-white text-right"
                                                                   >
                                                                     {pkg.servicePackageName.length > 10 ? (
                                                                       <Tooltip title={pkg.servicePackageName}>
                                                                         {pkg.servicePackageName
                                                                           .substring(0, 10)
                                                                           .toLowerCase()
                                                                           .replace(/\b\w/g, (l) => l.toUpperCase()) + "..."}
                                                                       </Tooltip>
                                                                     ) : pkg.servicePackageName.length > 10 ? (
                                                                       <Tooltip title={pkg.servicePackageName}>
                                                                         {pkg.servicePackageName.substring(0, 10) + "..."}
                                                                       </Tooltip>
                                                                     ) : (
                                                                       pkg.servicePackageName
                                                                     )}
                                                                   </td> */}

                                                              <th
                                                                className="tr-table-class text-white text-right"
                                                                style={{
                                                                  width:
                                                                    "16.66%",
                                                                }}
                                                              >
                                                                Fees (£)
                                                              </th>

                                                              {visibleFieldsCustomTemp.vat && (
                                                                <th
                                                                  className="tr-table-class text-white text-right"
                                                                  style={{
                                                                    width:
                                                                      "16.66%",
                                                                  }}
                                                                >
                                                                  VAT (£)
                                                                </th>
                                                              )}

                                                              {visibleFieldsCustomTemp.serviceScope && (
                                                                <th
                                                                  className="tr-table-class text-white text-right"
                                                                  style={{
                                                                    width:
                                                                      "16.66%",
                                                                  }}
                                                                >
                                                                  Service Scope
                                                                </th>
                                                              )}
                                                            </>
                                                          )
                                                        )}
                                                      </tr>
                                                    </thead>
                                                    <tbody>
                                                      {selectedRecurringServiceList.map(
                                                        (service, index) => {
                                                          return (
                                                            <>
                                                              <tr className="a-la-carte-services-review-head-row">
                                                                {visibleFieldsCustomTemp.serviceName && (
                                                                  <th
                                                                    colSpan={
                                                                      1 +
                                                                      packageCount
                                                                    }
                                                                  >
                                                                    {
                                                                      service.serviceCatName
                                                                    }
                                                                  </th>
                                                                )}

                                                                {/* <th></th> */}
                                                                {visibleFieldsCustomTemp.vat && (
                                                                  <th></th>
                                                                )}
                                                                {visibleFieldsCustomTemp.serviceScope && (
                                                                  <th></th>
                                                                )}
                                                                {packageCount >=
                                                                  2 && (
                                                                  <>
                                                                    {visibleFieldsCustomTemp.vat && (
                                                                      <th></th>
                                                                    )}
                                                                    {visibleFieldsCustomTemp.serviceScope && (
                                                                      <th></th>
                                                                    )}
                                                                  </>
                                                                )}

                                                                {packageCount ===
                                                                  3 && (
                                                                  <>
                                                                    {visibleFieldsCustomTemp.vat && (
                                                                      <th></th>
                                                                    )}
                                                                    {visibleFieldsCustomTemp.serviceScope && (
                                                                      <th></th>
                                                                    )}
                                                                  </>
                                                                )}
                                                              </tr>
                                                              {service.servicesList.map(
                                                                (
                                                                  subService,
                                                                  subIndex
                                                                ) => {
                                                                  const driverList =
                                                                    subService.pricingDriverList ||
                                                                    [];
                                                                  return (
                                                                    <tr
                                                                      key={
                                                                        subIndex
                                                                      }
                                                                      className={` ${
                                                                        subService?.isAdditionalService !==
                                                                        null
                                                                          ? "bg-info  text-white"
                                                                          : ""
                                                                      }`}
                                                                    >
                                                                      {visibleFieldsCustomTemp.serviceName && (
                                                                        <td>
                                                                          <div>
                                                                            {subService
                                                                              .serviceName
                                                                              .length >
                                                                            45 ? (
                                                                              <Tooltip
                                                                                title={
                                                                                  subService.serviceName
                                                                                }
                                                                              >
                                                                                {subService.serviceName
                                                                                  .substring(
                                                                                    0,
                                                                                    45
                                                                                  )
                                                                                  .toLowerCase()
                                                                                  .replace(
                                                                                    /\b\w/g,
                                                                                    (
                                                                                      l
                                                                                    ) =>
                                                                                      l.toUpperCase()
                                                                                  ) +
                                                                                  "..."}
                                                                              </Tooltip>
                                                                            ) : (
                                                                              subService.serviceName
                                                                            )}
                                                                          </div>
                                                                          <div className="package-variables"></div>
                                                                        </td>
                                                                      )}

                                                                      {/* <td
                                                                        className="text-right"
                                                                        style={{
                                                                          fontWeight:
                                                                            getFontStyles(
                                                                              0,
                                                                              "Index"
                                                                            )
                                                                              .fontWeight,
                                                                          fontSize:
                                                                            getFontStyles(
                                                                              0,
                                                                              "Index"
                                                                            )
                                                                              .fontSize,
                                                                        }}
                                                                      >
                                                                        {ProposalObject.feeTypeId ===
                                                                        1 ? (
                                                                          <>
                                                                            {subService.packageOneValue ===
                                                                              0 ||
                                                                            subService.packageOneValue ===
                                                                              null ||
                                                                            !subService?.servicePackageIDs?.includes(
                                                                              subService.packageOneID
                                                                            ) ? (
                                                                              <span className="fa fa-times"></span>
                                                                            ) : (
                                                                              formatValue(
                                                                                subService.packageOneValue
                                                                              )
                                                                            )}
                                                                          </>
                                                                        ) : subService.packageOneValue !==
                                                                            null &&
                                                                          subService?.servicePackageIDs?.includes(
                                                                            subService.packageOneID
                                                                          ) ? (
                                                                          <span className="fa fa-check"></span>
                                                                        ) : (
                                                                          <span className="fa fa-times"></span>
                                                                        )}
                                                                      </td> */}

                                                                      <td
                                                                        style={{
                                                                          fontWeight:
                                                                            getFontStyles(
                                                                              0,
                                                                              "Index"
                                                                            )
                                                                              .fontWeight,
                                                                          fontSize:
                                                                            getFontStyles(
                                                                              0,
                                                                              "Index"
                                                                            )
                                                                              .fontSize,
                                                                        }}
                                                                        className="text-right"
                                                                      >
                                                                        {ProposalObject.feeTypeId ===
                                                                        1 ? (
                                                                          <>
                                                                            {" "}
                                                                            {subService.packageOneValue ===
                                                                            null ? (
                                                                              <span className="fa fa-times"></span>
                                                                            ) : (
                                                                              formatValue(
                                                                                subService.packageOneValue
                                                                              )
                                                                            )}
                                                                          </>
                                                                        ) : subService.packageOneValue !==
                                                                          null ? (
                                                                          <span className="fa fa-check"></span>
                                                                        ) : (
                                                                          <span className="fa fa-times"></span>
                                                                        )}
                                                                      </td>
                                                                      {packageCount >=
                                                                        2 && (
                                                                        <td
                                                                          style={{
                                                                            fontWeight:
                                                                              getFontStyles(
                                                                                1,
                                                                                "Index"
                                                                              )
                                                                                .fontWeight,
                                                                            fontSize:
                                                                              getFontStyles(
                                                                                1,
                                                                                "Index"
                                                                              )
                                                                                .fontSize,
                                                                          }}
                                                                          className="text-right"
                                                                        >
                                                                          {ProposalObject.feeTypeId ===
                                                                          1 ? (
                                                                            <>
                                                                              {" "}
                                                                              {
                                                                                subService.packageTwoValue ===
                                                                                null ? (
                                                                                  <span className="fa fa-times"></span>
                                                                                ) : (
                                                                                  formatValue(
                                                                                    subService.packageTwoValue
                                                                                  )
                                                                                )
                                                                                // Number(
                                                                                //   subService.packageTwoValue
                                                                                // )
                                                                                //   .toFixed(2)
                                                                                //   .toString()
                                                                                //   .replace(
                                                                                //     /\B(?=(\d{3})+(?!\d))/g,
                                                                                //     ","
                                                                                //   )
                                                                              }
                                                                            </>
                                                                          ) : subService.packageTwoValue !==
                                                                            null ? (
                                                                            <span className="fa fa-check"></span>
                                                                          ) : (
                                                                            <span className="fa fa-times"></span>
                                                                          )}
                                                                        </td>
                                                                      )}
                                                                      {packageCount ===
                                                                        3 && (
                                                                        <td
                                                                          style={{
                                                                            fontWeight:
                                                                              getFontStyles(
                                                                                2,
                                                                                "Index"
                                                                              )
                                                                                .fontWeight,
                                                                            fontSize:
                                                                              getFontStyles(
                                                                                2,
                                                                                "Index"
                                                                              )
                                                                                .fontSize,
                                                                          }}
                                                                          className="text-right"
                                                                        >
                                                                          {ProposalObject.feeTypeId ===
                                                                          1 ? (
                                                                            <>
                                                                              {" "}
                                                                              {
                                                                                subService.packageThreeValue ===
                                                                                null ? (
                                                                                  <span className="fa fa-times"></span>
                                                                                ) : (
                                                                                  formatValue(
                                                                                    subService.packageThreeValue
                                                                                  )
                                                                                )
                                                                                // Number(
                                                                                //   subService.packageThreeValue
                                                                                // )
                                                                                //   .toFixed(2)
                                                                                //   .toString()
                                                                                //   .replace(
                                                                                //     /\B(?=(\d{3})+(?!\d))/g,
                                                                                //     ","
                                                                                //   )
                                                                              }
                                                                            </>
                                                                          ) : subService.packageThreeValue !==
                                                                            null ? (
                                                                            <span className="fa fa-check"></span>
                                                                          ) : (
                                                                            <span className="fa fa-times"></span>
                                                                          )}
                                                                        </td>
                                                                      )}

                                                                      {/* VAT */}

                                                                      {visibleFieldsCustomTemp.vat && (
                                                                        <>
                                                                          {/* Package One */}
                                                                          <td className="text-right">
                                                                            <div className="flex-end-item">
                                                                              {ProposalObject.feeTypeId ===
                                                                              1 ? (
                                                                                (subService.packageOneValue ===
                                                                                  0 ||
                                                                                  subService.packageOneValue ===
                                                                                    null) &&
                                                                                !subService.servicePackageIDs.some(
                                                                                  (
                                                                                    item
                                                                                  ) =>
                                                                                    item ===
                                                                                    selectedPackagesList[0]
                                                                                      .servicePackageID
                                                                                ) ? (
                                                                                  <span className="fa fa-times"></span>
                                                                                ) : !subService?.servicePackageIDs.includes(
                                                                                    subService.packageOneID
                                                                                  ) ? (
                                                                                  <span className="fa fa-times"></span>
                                                                                ) : (
                                                                                  ` ${formatValue(
                                                                                    (subService.packageOneValue *
                                                                                      20) /
                                                                                      100
                                                                                  )}`
                                                                                )
                                                                              ) : Number(
                                                                                  subService.packageOneValue
                                                                                ) !==
                                                                                  null &&
                                                                                subService?.servicePackageIDs.includes(
                                                                                  subService.packageOneID
                                                                                ) ? (
                                                                                <span className="fa fa-check"></span>
                                                                              ) : (
                                                                                <span className="fa fa-times"></span>
                                                                              )}

                                                                              {subService?.isAdditionalService !==
                                                                              null ? (
                                                                                <input
                                                                                  style={{
                                                                                    marginLeft:
                                                                                      "5px",
                                                                                  }}
                                                                                  type="checkbox"
                                                                                  disabled={
                                                                                    subService?.servicePackageIDs.includes(
                                                                                      subService.packageOneID
                                                                                    ) &&
                                                                                    subService
                                                                                      ?.servicePackageIDs
                                                                                      .length ===
                                                                                      1
                                                                                  }
                                                                                  checked={subService?.servicePackageIDs.includes(
                                                                                    subService.packageOneID
                                                                                  )}
                                                                                  onChange={(
                                                                                    e
                                                                                  ) =>
                                                                                    handleAddAndRemoveAdditionalServices(
                                                                                      1,
                                                                                      service.serviceCatID,
                                                                                      subService.serviceID,
                                                                                      subService.packageOneID,
                                                                                      e
                                                                                        .target
                                                                                        .checked
                                                                                    )
                                                                                  }
                                                                                />
                                                                              ) : (
                                                                                <div>
                                                                                  &nbsp;&nbsp;
                                                                                </div>
                                                                              )}
                                                                            </div>
                                                                          </td>

                                                                          {/* Package Two */}
                                                                          {/* {packageCount >= 2 && (
                                                                               <>
                                                                                 <td className="text-right">
                                                                                   <div className="flex-end-item">
                                                                                     {ProposalObject.feeTypeId === 1 ? (
                                                                                       (subService.packageTwoValue === 0 ||
                                                                                         subService.packageTwoValue ===
                                                                                           null) &&
                                                                                       !subService.servicePackageIDs.some(
                                                                                         (item) =>
                                                                                           item ===
                                                                                           selectedPackagesList[1]
                                                                                             .servicePackageID
                                                                                       ) ? (
                                                                                         <span className="fa fa-times"></span>
                                                                                       ) : !subService?.servicePackageIDs.includes(
                                                                                           subService.packageTwoID
                                                                                         ) ? (
                                                                                         <span className="fa fa-times"></span>
                                                                                       ) : (
                                                                                         ` ${formatValue(
                                                                                           subService.packageTwoValue
                                                                                         )}`
                                                                                       )
                                                                                     ) : Number(
                                                                                         subService.packageTwoValue
                                                                                       ) !== null &&
                                                                                       subService?.servicePackageIDs.includes(
                                                                                         subService.packageTwoID
                                                                                       ) ? (
                                                                                       <span className="fa fa-check"></span>
                                                                                     ) : (
                                                                                       <span className="fa fa-times"></span>
                                                                                     )}
                                             
                                                                                     {subService?.isAdditionalService !==
                                                                                     null ? (
                                                                                       <input
                                                                                         style={{ marginLeft: "5px" }}
                                                                                         type="checkbox"
                                                                                         disabled={
                                                                                           subService?.servicePackageIDs.includes(
                                                                                             subService.packageTwoID
                                                                                           ) &&
                                                                                           subService?.servicePackageIDs
                                                                                             .length === 1
                                                                                         }
                                                                                         checked={subService?.servicePackageIDs.includes(
                                                                                           subService.packageTwoID
                                                                                         )}
                                                                                         onChange={(e) =>
                                                                                           handleAddAndRemoveAdditionalServices(
                                                                                             1,
                                                                                             service.serviceCatID,
                                                                                             subService.serviceID,
                                                                                             subService.packageTwoID,
                                                                                             e.target.checked
                                                                                           )
                                                                                         }
                                                                                       />
                                                                                     ) : (
                                                                                       <div>&nbsp;&nbsp;</div>
                                                                                     )}
                                                                                   </div>
                                                                                 </td>
                                             
                                                                                 <td className="text-right">
                                                                                   <div className="flex-end-item">
                                                                                     {ProposalObject.feeTypeId === 1 ? (
                                                                                       (subService.packageTwoValue === 0 ||
                                                                                         subService.packageTwoValue ===
                                                                                           null) &&
                                                                                       !subService.servicePackageIDs.some(
                                                                                         (item) =>
                                                                                           item ===
                                                                                           selectedPackagesList[1]
                                                                                             .servicePackageID
                                                                                       ) ? (
                                                                                         <span className="fa fa-times"></span>
                                                                                       ) : !subService?.servicePackageIDs.includes(
                                                                                           subService.packageTwoID
                                                                                         ) ? (
                                                                                         <span className="fa fa-times"></span>
                                                                                       ) : (
                                                                                         ` ${formatValue(
                                                                                           (subService.packageTwoValue *
                                                                                             20) /
                                                                                             100
                                                                                         )}`
                                                                                       )
                                                                                     ) : Number(
                                                                                         subService.packageTwoValue
                                                                                       ) !== null &&
                                                                                       subService?.servicePackageIDs.includes(
                                                                                         subService.packageTwoID
                                                                                       ) ? (
                                                                                       <span className="fa fa-check"></span>
                                                                                     ) : (
                                                                                       <span className="fa fa-times"></span>
                                                                                     )}
                                             
                                                                                     {subService?.isAdditionalService !==
                                                                                     null ? (
                                                                                       <input
                                                                                         style={{ marginLeft: "5px" }}
                                                                                         type="checkbox"
                                                                                         disabled={
                                                                                           subService?.servicePackageIDs.includes(
                                                                                             subService.packageTwoID
                                                                                           ) &&
                                                                                           subService?.servicePackageIDs
                                                                                             .length === 1
                                                                                         }
                                                                                         checked={subService?.servicePackageIDs.includes(
                                                                                           subService.packageTwoID
                                                                                         )}
                                                                                         onChange={(e) =>
                                                                                           handleAddAndRemoveAdditionalServices(
                                                                                             1,
                                                                                             service.serviceCatID,
                                                                                             subService.serviceID,
                                                                                             subService.packageTwoID,
                                                                                             e.target.checked
                                                                                           )
                                                                                         }
                                                                                       />
                                                                                     ) : (
                                                                                       <div>&nbsp;&nbsp;</div>
                                                                                     )}
                                                                                   </div>
                                                                                 </td>
                                                                               </>
                                                                             )} */}

                                                                          {/* Package Three */}
                                                                          {/* {packageCount === 3 && (
                                                                               <>
                                                                                 <td className="text-right">
                                                                                   <div className="flex-end-item">
                                                                                     {ProposalObject.feeTypeId === 1 ? (
                                                                                       (subService.packageThreeValue === 0 ||
                                                                                         subService.packageThreeValue ===
                                                                                           null) &&
                                                                                       !subService.servicePackageIDs.some(
                                                                                         (item) =>
                                                                                           item ===
                                                                                           selectedPackagesList[2]
                                                                                             .servicePackageID
                                                                                       ) ? (
                                                                                         <span className="fa fa-times"></span>
                                                                                       ) : !subService?.servicePackageIDs.includes(
                                                                                           subService.packageThreeID
                                                                                         ) ? (
                                                                                         <span className="fa fa-times"></span>
                                                                                       ) : (
                                                                                         ` ${formatValue(
                                                                                           subService.packageThreeValue
                                                                                         )}`
                                                                                       )
                                                                                     ) : Number(
                                                                                         subService.packageThreeValue
                                                                                       ) !== null &&
                                                                                       subService?.servicePackageIDs.includes(
                                                                                         subService.packageThreeID
                                                                                       ) ? (
                                                                                       <span className="fa fa-check"></span>
                                                                                     ) : (
                                                                                       <span className="fa fa-times"></span>
                                                                                     )}
                                             
                                                                                     {subService?.isAdditionalService !==
                                                                                     null ? (
                                                                                       <input
                                                                                         style={{ marginLeft: "5px" }}
                                                                                         type="checkbox"
                                                                                         disabled={
                                                                                           subService?.servicePackageIDs.includes(
                                                                                             subService.packageThreeID
                                                                                           ) &&
                                                                                           subService?.servicePackageIDs
                                                                                             .length === 1
                                                                                         }
                                                                                         checked={subService?.servicePackageIDs.includes(
                                                                                           subService.packageThreeID
                                                                                         )}
                                                                                         onChange={(e) =>
                                                                                           handleAddAndRemoveAdditionalServices(
                                                                                             1,
                                                                                             service.serviceCatID,
                                                                                             subService.serviceID,
                                                                                             subService.packageThreeID,
                                                                                             e.target.checked
                                                                                           )
                                                                                         }
                                                                                       />
                                                                                     ) : (
                                                                                       <div>&nbsp;&nbsp;</div>
                                                                                     )}
                                                                                   </div>
                                                                                 </td>
                                             
                                                                                 <td className="text-right">
                                                                                   <div className="flex-end-item">
                                                                                     {ProposalObject.feeTypeId === 1 ? (
                                                                                       (subService.packageThreeValue === 0 ||
                                                                                         subService.packageThreeValue ===
                                                                                           null) &&
                                                                                       !subService.servicePackageIDs.some(
                                                                                         (item) =>
                                                                                           item ===
                                                                                           selectedPackagesList[2]
                                                                                             .servicePackageID
                                                                                       ) ? (
                                                                                         <span className="fa fa-times"></span>
                                                                                       ) : !subService?.servicePackageIDs.includes(
                                                                                           subService.packageThreeID
                                                                                         ) ? (
                                                                                         <span className="fa fa-times"></span>
                                                                                       ) : (
                                                                                         ` ${formatValue(
                                                                                           (subService.packageThreeValue *
                                                                                             20) /
                                                                                             100
                                                                                         )}`
                                                                                       )
                                                                                     ) : Number(
                                                                                         subService.packageThreeValue
                                                                                       ) !== null &&
                                                                                       subService?.servicePackageIDs.includes(
                                                                                         subService.packageThreeID
                                                                                       ) ? (
                                                                                       <span className="fa fa-check"></span>
                                                                                     ) : (
                                                                                       <span className="fa fa-times"></span>
                                                                                     )}
                                             
                                                                                     {subService?.isAdditionalService !==
                                                                                     null ? (
                                                                                       <input
                                                                                         style={{ marginLeft: "5px" }}
                                                                                         type="checkbox"
                                                                                         disabled={
                                                                                           subService?.servicePackageIDs.includes(
                                                                                             subService.packageThreeID
                                                                                           ) &&
                                                                                           subService?.servicePackageIDs
                                                                                             .length === 1
                                                                                         }
                                                                                         checked={subService?.servicePackageIDs.includes(
                                                                                           subService.packageThreeID
                                                                                         )}
                                                                                         onChange={(e) =>
                                                                                           handleAddAndRemoveAdditionalServices(
                                                                                             1,
                                                                                             service.serviceCatID,
                                                                                             subService.serviceID,
                                                                                             subService.packageThreeID,
                                                                                             e.target.checked
                                                                                           )
                                                                                         }
                                                                                       />
                                                                                     ) : (
                                                                                       <div>&nbsp;&nbsp;</div>
                                                                                     )}
                                                                                   </div>
                                                                                 </td>
                                                                               </>
                                                                             )} */}
                                                                        </>
                                                                      )}

                                                                      {/* Service Scope */}

                                                                      {visibleFieldsCustomTemp.serviceScope && (
                                                                        <>
                                                                          {/* Package One */}
                                                                          <td className="text-right">
                                                                            {driverList.length >
                                                                            0
                                                                              ? driverList
                                                                                  .filter(
                                                                                    (
                                                                                      d
                                                                                    ) =>
                                                                                      d.driverValue !==
                                                                                      null
                                                                                  )
                                                                                  .map(
                                                                                    (
                                                                                      d,
                                                                                      i,
                                                                                      arr
                                                                                    ) => (
                                                                                      <div
                                                                                        key={
                                                                                          i
                                                                                        }
                                                                                      >
                                                                                        {(subService.packageOneValue ===
                                                                                          0 ||
                                                                                          subService.packageOneValue ===
                                                                                            null) &&
                                                                                        !subService.servicePackageIDs.some(
                                                                                          (
                                                                                            item
                                                                                          ) =>
                                                                                            item ===
                                                                                            selectedPackagesList[0]
                                                                                              .servicePackageID
                                                                                        ) ? (
                                                                                          <span>
                                                                                            -
                                                                                          </span>
                                                                                        ) : !subService?.servicePackageIDs.includes(
                                                                                            subService.packageOneID
                                                                                          ) ? (
                                                                                          <span>
                                                                                            -
                                                                                          </span>
                                                                                        ) : (
                                                                                          ` ${
                                                                                            d.driverName
                                                                                          } = ${
                                                                                            d.driverValue
                                                                                          }${
                                                                                            i !==
                                                                                            arr.length -
                                                                                              1
                                                                                              ? ", "
                                                                                              : ""
                                                                                          }`
                                                                                        )}
                                                                                      </div>
                                                                                    )
                                                                                  )
                                                                              : "-"}
                                                                          </td>
                                                                        </>
                                                                      )}

                                                                      {/* Package Two */}
                                                                      {packageCount >=
                                                                        2 && (
                                                                        <>
                                                                          <td className="text-right">
                                                                            <div className="flex-end-item">
                                                                              {ProposalObject.feeTypeId ===
                                                                              1 ? (
                                                                                <div>
                                                                                  {(subService.packageTwoValue ===
                                                                                    0 ||
                                                                                    subService.packageTwoValue ===
                                                                                      null) &&
                                                                                  !subService.servicePackageIDs.some(
                                                                                    (
                                                                                      item
                                                                                    ) =>
                                                                                      item ==
                                                                                      selectedPackagesList[0]
                                                                                        .servicePackageID
                                                                                  ) ? (
                                                                                    <span className="fa fa-times"></span>
                                                                                  ) : !subService?.servicePackageIDs.includes(
                                                                                      subService.packageTwoID
                                                                                    ) ? (
                                                                                    <span className="fa fa-times"></span>
                                                                                  ) : (
                                                                                    ` ${formatValue(
                                                                                      subService.packageTwoValue
                                                                                    )}`
                                                                                  )}
                                                                                </div>
                                                                              ) : Number(
                                                                                  subService.packageTwoValue
                                                                                ) !==
                                                                                  null &&
                                                                                subService?.servicePackageIDs.includes(
                                                                                  subService.packageTwoID
                                                                                ) ? (
                                                                                <span className="fa fa-check"></span>
                                                                              ) : (
                                                                                <span className="fa fa-times"></span>
                                                                              )}
                                                                              {subService?.isAdditionalService !==
                                                                              null ? (
                                                                                <input
                                                                                  style={{
                                                                                    marginLeft:
                                                                                      "5px",
                                                                                  }}
                                                                                  disabled={
                                                                                    subService?.servicePackageIDs.includes(
                                                                                      subService.packageTwoID
                                                                                    ) &&
                                                                                    subService
                                                                                      ?.servicePackageIDs
                                                                                      .length ===
                                                                                      1
                                                                                  }
                                                                                  type="checkbox"
                                                                                  checked={subService?.servicePackageIDs.includes(
                                                                                    subService.packageTwoID
                                                                                  )}
                                                                                  onChange={(
                                                                                    e
                                                                                  ) =>
                                                                                    handleAddAndRemoveAdditionalServices(
                                                                                      1,
                                                                                      service.serviceCatID,
                                                                                      subService.serviceID,
                                                                                      subService.packageOneID,
                                                                                      e
                                                                                        .target
                                                                                        .checked
                                                                                    )
                                                                                  }
                                                                                />
                                                                              ) : (
                                                                                <div>
                                                                                  &nbsp;&nbsp;
                                                                                </div>
                                                                              )}
                                                                            </div>
                                                                          </td>
                                                                          {visibleFieldsCustomTemp.vat && (
                                                                            <td className="text-right">
                                                                              <div className="flex-end-item">
                                                                                {ProposalObject.feeTypeId ===
                                                                                1 ? (
                                                                                  (subService.packageTwoValue ===
                                                                                    0 ||
                                                                                    subService.packageTwoValue ===
                                                                                      null) &&
                                                                                  !subService.servicePackageIDs.some(
                                                                                    (
                                                                                      item
                                                                                    ) =>
                                                                                      item ===
                                                                                      selectedPackagesList[0]
                                                                                        .servicePackageID
                                                                                  ) ? (
                                                                                    <span className="fa fa-times"></span>
                                                                                  ) : !subService?.servicePackageIDs.includes(
                                                                                      subService.packageTwoID
                                                                                    ) ? (
                                                                                    <span className="fa fa-times"></span>
                                                                                  ) : (
                                                                                    ` ${formatValue(
                                                                                      (subService.packageTwoValue *
                                                                                        20) /
                                                                                        100
                                                                                    )}`
                                                                                  )
                                                                                ) : Number(
                                                                                    subService.packageTwoValue
                                                                                  ) !==
                                                                                    null &&
                                                                                  subService?.servicePackageIDs.includes(
                                                                                    subService.packageTwoID
                                                                                  ) ? (
                                                                                  <span className="fa fa-check"></span>
                                                                                ) : (
                                                                                  <span className="fa fa-times"></span>
                                                                                )}

                                                                                {subService?.isAdditionalService !==
                                                                                null ? (
                                                                                  <input
                                                                                    style={{
                                                                                      marginLeft:
                                                                                        "5px",
                                                                                    }}
                                                                                    type="checkbox"
                                                                                    disabled={
                                                                                      subService?.servicePackageIDs.includes(
                                                                                        subService.packageTwoID
                                                                                      ) &&
                                                                                      subService
                                                                                        ?.servicePackageIDs
                                                                                        .length ===
                                                                                        1
                                                                                    }
                                                                                    checked={subService?.servicePackageIDs.includes(
                                                                                      subService.packageTwoID
                                                                                    )}
                                                                                    onChange={(
                                                                                      e
                                                                                    ) =>
                                                                                      handleAddAndRemoveAdditionalServices(
                                                                                        1,
                                                                                        service.serviceCatID,
                                                                                        subService.serviceID,
                                                                                        subService.packageOneID,
                                                                                        e
                                                                                          .target
                                                                                          .checked
                                                                                      )
                                                                                    }
                                                                                  />
                                                                                ) : (
                                                                                  <div>
                                                                                    &nbsp;&nbsp;
                                                                                  </div>
                                                                                )}
                                                                              </div>
                                                                            </td>
                                                                          )}
                                                                          {visibleFieldsCustomTemp.serviceScope && (
                                                                            <td className="text-right">
                                                                              {driverList.length >
                                                                              0
                                                                                ? driverList
                                                                                    .filter(
                                                                                      (
                                                                                        d
                                                                                      ) =>
                                                                                        d.driverValue !==
                                                                                        null
                                                                                    )
                                                                                    .map(
                                                                                      (
                                                                                        d,
                                                                                        i,
                                                                                        arr
                                                                                      ) => (
                                                                                        <div
                                                                                          key={
                                                                                            i
                                                                                          }
                                                                                        >
                                                                                          {(subService.packageTwoValue ===
                                                                                            0 ||
                                                                                            subService.packageTwoValue ===
                                                                                              null) &&
                                                                                          !subService.servicePackageIDs.some(
                                                                                            (
                                                                                              item
                                                                                            ) =>
                                                                                              item ===
                                                                                              selectedPackagesList[0]
                                                                                                .servicePackageID
                                                                                          ) ? (
                                                                                            <span>
                                                                                              -
                                                                                            </span>
                                                                                          ) : !subService?.servicePackageIDs.includes(
                                                                                              subService.packageTwoID
                                                                                            ) ? (
                                                                                            <span>
                                                                                              -
                                                                                            </span>
                                                                                          ) : (
                                                                                            ` ${
                                                                                              d.driverName
                                                                                            } = ${
                                                                                              d.driverValue
                                                                                            }${
                                                                                              i !==
                                                                                              arr.length -
                                                                                                1
                                                                                                ? ", "
                                                                                                : ""
                                                                                            }`
                                                                                          )}
                                                                                        </div>
                                                                                      )
                                                                                    )
                                                                                : "-"}
                                                                            </td>
                                                                          )}
                                                                        </>
                                                                      )}
                                                                      {/* Package Three */}
                                                                      {packageCount ===
                                                                        3 && (
                                                                        <>
                                                                          <td className="text-right">
                                                                            <div className="flex-end-item">
                                                                              {ProposalObject.feeTypeId ===
                                                                              1 ? (
                                                                                <div>
                                                                                  {(subService.packageThreeValue ===
                                                                                    0 ||
                                                                                    subService.packageThreeValue ===
                                                                                      null) &&
                                                                                  !subService.servicePackageIDs.some(
                                                                                    (
                                                                                      item
                                                                                    ) =>
                                                                                      item ==
                                                                                      selectedPackagesList[0]
                                                                                        .servicePackageID
                                                                                  ) ? (
                                                                                    <span className="fa fa-times"></span>
                                                                                  ) : !subService?.servicePackageIDs.includes(
                                                                                      subService.packageThreeID
                                                                                    ) ? (
                                                                                    <span className="fa fa-times"></span>
                                                                                  ) : (
                                                                                    ` ${formatValue(
                                                                                      subService.packageThreeValue
                                                                                    )}`
                                                                                  )}
                                                                                </div>
                                                                              ) : Number(
                                                                                  subService.packageThreeValue
                                                                                ) !==
                                                                                  null &&
                                                                                subService?.servicePackageIDs.includes(
                                                                                  subService.packageThreeID
                                                                                ) ? (
                                                                                <span className="fa fa-check"></span>
                                                                              ) : (
                                                                                <span className="fa fa-times"></span>
                                                                              )}
                                                                              {subService?.isAdditionalService !==
                                                                              null ? (
                                                                                <input
                                                                                  style={{
                                                                                    marginLeft:
                                                                                      "5px",
                                                                                  }}
                                                                                  disabled={
                                                                                    subService?.servicePackageIDs.includes(
                                                                                      subService.packageThreeID
                                                                                    ) &&
                                                                                    subService
                                                                                      ?.servicePackageIDs
                                                                                      .length ===
                                                                                      1
                                                                                  }
                                                                                  type="checkbox"
                                                                                  checked={subService?.servicePackageIDs.includes(
                                                                                    subService.packageThreeID
                                                                                  )}
                                                                                  onChange={(
                                                                                    e
                                                                                  ) =>
                                                                                    handleAddAndRemoveAdditionalServices(
                                                                                      1,
                                                                                      service.serviceCatID,
                                                                                      subService.serviceID,
                                                                                      subService.packageOneID,
                                                                                      e
                                                                                        .target
                                                                                        .checked
                                                                                    )
                                                                                  }
                                                                                />
                                                                              ) : (
                                                                                <div>
                                                                                  &nbsp;&nbsp;
                                                                                </div>
                                                                              )}
                                                                            </div>
                                                                          </td>

                                                                          {visibleFieldsCustomTemp.vat && (
                                                                            <td className="text-right">
                                                                              <div className="flex-end-item">
                                                                                {ProposalObject.feeTypeId ===
                                                                                1 ? (
                                                                                  (subService.packageThreeValue ===
                                                                                    0 ||
                                                                                    subService.packageThreeValue ===
                                                                                      null) &&
                                                                                  !subService.servicePackageIDs.some(
                                                                                    (
                                                                                      item
                                                                                    ) =>
                                                                                      item ===
                                                                                      selectedPackagesList[0]
                                                                                        .servicePackageID
                                                                                  ) ? (
                                                                                    <span className="fa fa-times"></span>
                                                                                  ) : !subService?.servicePackageIDs.includes(
                                                                                      subService.packageThreeID
                                                                                    ) ? (
                                                                                    <span className="fa fa-times"></span>
                                                                                  ) : (
                                                                                    ` ${formatValue(
                                                                                      (subService.packageThreeValue *
                                                                                        20) /
                                                                                        100
                                                                                    )}`
                                                                                  )
                                                                                ) : Number(
                                                                                    subService.packageThreeValue
                                                                                  ) !==
                                                                                    null &&
                                                                                  subService?.servicePackageIDs.includes(
                                                                                    subService.packageThreeID
                                                                                  ) ? (
                                                                                  <span className="fa fa-check"></span>
                                                                                ) : (
                                                                                  <span className="fa fa-times"></span>
                                                                                )}

                                                                                {subService?.isAdditionalService !==
                                                                                null ? (
                                                                                  <input
                                                                                    style={{
                                                                                      marginLeft:
                                                                                        "5px",
                                                                                    }}
                                                                                    type="checkbox"
                                                                                    disabled={
                                                                                      subService?.servicePackageIDs.includes(
                                                                                        subService.packageThreeID
                                                                                      ) &&
                                                                                      subService
                                                                                        ?.servicePackageIDs
                                                                                        .length ===
                                                                                        1
                                                                                    }
                                                                                    checked={subService?.servicePackageIDs.includes(
                                                                                      subService.packageThreeID
                                                                                    )}
                                                                                    onChange={(
                                                                                      e
                                                                                    ) =>
                                                                                      handleAddAndRemoveAdditionalServices(
                                                                                        1,
                                                                                        service.serviceCatID,
                                                                                        subService.serviceID,
                                                                                        subService.packageOneID,
                                                                                        e
                                                                                          .target
                                                                                          .checked
                                                                                      )
                                                                                    }
                                                                                  />
                                                                                ) : (
                                                                                  <div>
                                                                                    &nbsp;&nbsp;
                                                                                  </div>
                                                                                )}
                                                                              </div>
                                                                            </td>
                                                                          )}

                                                                          {visibleFieldsCustomTemp.serviceScope && (
                                                                            <td className="text-right">
                                                                              {driverList.length >
                                                                              0
                                                                                ? driverList
                                                                                    .filter(
                                                                                      (
                                                                                        d
                                                                                      ) =>
                                                                                        d.driverValue !==
                                                                                        null
                                                                                    )
                                                                                    .map(
                                                                                      (
                                                                                        d,
                                                                                        i,
                                                                                        arr
                                                                                      ) => (
                                                                                        <div
                                                                                          key={
                                                                                            i
                                                                                          }
                                                                                        >
                                                                                          {(subService.packageThreeValue ===
                                                                                            0 ||
                                                                                            subService.packageThreeValue ===
                                                                                              null) &&
                                                                                          !subService.servicePackageIDs.some(
                                                                                            (
                                                                                              item
                                                                                            ) =>
                                                                                              item ===
                                                                                              selectedPackagesList[0]
                                                                                                .servicePackageID
                                                                                          ) ? (
                                                                                            <span>
                                                                                              -
                                                                                            </span>
                                                                                          ) : !subService?.servicePackageIDs.includes(
                                                                                              subService.packageThreeID
                                                                                            ) ? (
                                                                                            <span>
                                                                                              -
                                                                                            </span>
                                                                                          ) : (
                                                                                            ` ${
                                                                                              d.driverName
                                                                                            } = ${
                                                                                              d.driverValue
                                                                                            }${
                                                                                              i !==
                                                                                              arr.length -
                                                                                                1
                                                                                                ? ", "
                                                                                                : ""
                                                                                            }`
                                                                                          )}
                                                                                        </div>
                                                                                      )
                                                                                    )
                                                                                : "-"}
                                                                            </td>
                                                                          )}
                                                                        </>
                                                                      )}
                                                                    </tr>
                                                                  );
                                                                }
                                                              )}
                                                            </>
                                                          );
                                                        }
                                                      )}
                                                    </tbody>
                                                    {packageCount > 1 && (
                                                      <>
                                                        <tr id="recurring_DefaultWithPackages">
                                                          <td
                                                            style={{
                                                              padding: "8px",
                                                            }}
                                                          >
                                                            Discount (%)
                                                          </td>

                                                          <td
                                                            style={{
                                                              width: "35%",
                                                              padding: "0px",
                                                              whiteSpace:
                                                                "normal",
                                                            }}
                                                          >
                                                            <div
                                                              style={{
                                                                display: "flex",
                                                                flexDirection:
                                                                  "column",
                                                                alignItems:
                                                                  "flex-start",
                                                              }}
                                                            >
                                                              <input
                                                                className="input-text"
                                                                type="text"
                                                                placeholder="Discount (%)"
                                                                value={RecurringPricingInfo.DiscountPercentagePackageOne?.toString()?.replace(
                                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                                  ","
                                                                )}
                                                                onChange={(
                                                                  e
                                                                ) => {
                                                                  handlePackageOneDiscountPercentage(
                                                                    e
                                                                  );
                                                                }}
                                                                style={{
                                                                  width: "100%",
                                                                  textAlign:
                                                                    "right",
                                                                }}
                                                              />
                                                              <div>
                                                                {getValidationMessage(
                                                                  requireMessage,
                                                                  pricingSettingObj.maxDiscountForQC,
                                                                  RecurringPricingInfo.DiscountPercentagePackageOne
                                                                )}
                                                              </div>
                                                            </div>
                                                          </td>

                                                          {packageCount >=
                                                            2 && (
                                                            <>
                                                              {visibleFieldsCustomTemp.vat && (
                                                                <th></th>
                                                              )}
                                                              {visibleFieldsCustomTemp.serviceScope && (
                                                                <th></th>
                                                              )}
                                                              <td
                                                                style={{
                                                                  width: "35%",
                                                                  padding:
                                                                    "0px",
                                                                  whiteSpace:
                                                                    "normal",
                                                                }}
                                                              >
                                                                <div
                                                                  style={{
                                                                    display:
                                                                      "flex",
                                                                    flexDirection:
                                                                      "column",
                                                                    alignItems:
                                                                      "flex-start",
                                                                  }}
                                                                >
                                                                  <input
                                                                    className="input-text"
                                                                    type="text"
                                                                    placeholder="Discount (%)"
                                                                    value={RecurringPricingInfo.DiscountPercentagePackageTwo?.toString()?.replace(
                                                                      /\B(?=(\d{3})+(?!\d))/g,
                                                                      ","
                                                                    )}
                                                                    onChange={(
                                                                      e
                                                                    ) => {
                                                                      handlePackageTwoDiscountPercentage(
                                                                        e
                                                                      );
                                                                    }}
                                                                    style={{
                                                                      width:
                                                                        "100%",
                                                                      textAlign:
                                                                        "right",
                                                                    }}
                                                                  />
                                                                  <div>
                                                                    {getValidationMessage(
                                                                      requireMessage,
                                                                      pricingSettingObj.maxDiscountForQC,
                                                                      RecurringPricingInfo.DiscountPercentagePackageTwo
                                                                    )}
                                                                  </div>
                                                                </div>
                                                              </td>
                                                            </>
                                                          )}

                                                          {packageCount ===
                                                            3 && (
                                                            <>
                                                              {visibleFieldsCustomTemp.vat && (
                                                                <th></th>
                                                              )}
                                                              {visibleFieldsCustomTemp.serviceScope && (
                                                                <th></th>
                                                              )}
                                                              <td
                                                                style={{
                                                                  width: "35%",
                                                                  padding:
                                                                    "0px",
                                                                  whiteSpace:
                                                                    "normal",
                                                                }}
                                                              >
                                                                <div
                                                                  style={{
                                                                    display:
                                                                      "flex",
                                                                    flexDirection:
                                                                      "column",
                                                                    alignItems:
                                                                      "flex-start",
                                                                  }}
                                                                >
                                                                  <input
                                                                    className="input-text"
                                                                    type="text"
                                                                    placeholder="Discount (%)"
                                                                    value={RecurringPricingInfo.DiscountPercentagePackageThree?.toString()?.replace(
                                                                      /\B(?=(\d{3})+(?!\d))/g,
                                                                      ","
                                                                    )}
                                                                    onChange={(
                                                                      e
                                                                    ) => {
                                                                      handlePackageThreeDiscountPercentage(
                                                                        e
                                                                      );
                                                                    }}
                                                                    style={{
                                                                      width:
                                                                        "100%",
                                                                      textAlign:
                                                                        "right",
                                                                    }}
                                                                  />
                                                                  <div>
                                                                    {getValidationMessage(
                                                                      requireMessage,
                                                                      pricingSettingObj.maxDiscountForQC,
                                                                      RecurringPricingInfo.DiscountPercentagePackageThree
                                                                    )}
                                                                  </div>
                                                                </div>
                                                              </td>
                                                            </>
                                                          )}
                                                        </tr>
                                                      </>
                                                    )}

                                                    <tr className="head-row">
                                                      <td className="tr-table-class font-14 text-white">
                                                        Net Total
                                                      </td>
                                                      <td className="tr-table-class font-14 text-white text-right">
                                                        {" "}
                                                        {totalOnePackageValue >
                                                          Number(
                                                            RecurringPricingInfo.packageOneNetTotal
                                                          ) ||
                                                        (Number(
                                                          RecurringPricingInfo.packageOneDisCount
                                                        ) > 0 &&
                                                          !ProposalObject.DiscountLines)
                                                          ? Number(
                                                              RecurringPricingInfo.packageOneDisCount
                                                            ) > 0 &&
                                                            !ProposalObject.DiscountLines
                                                            ? formatValue(
                                                                RecurringPricingInfo.packageOneDisCountedTotal
                                                              )
                                                            : formatValue(
                                                                totalOnePackageValue
                                                              )
                                                          : formatValue(
                                                              RecurringPricingInfo.packageOneNetTotal
                                                            )}
                                                      </td>
                                                      {visibleFieldsCustomTemp.vat && (
                                                        <td className="tr-table-class font-14 text-white text-right">
                                                          {RecurringPricingInfo.PackageOneVaTPriceWithoutDiscout
                                                            ? formatValue(
                                                                RecurringPricingInfo.PackageOneVaTPriceWithoutDiscout
                                                              )
                                                            : formatValue(
                                                                RecurringPricingInfo.PackageOneVaTPriceWithoutDiscount
                                                              )}
                                                        </td>
                                                      )}
                                                      {visibleFieldsCustomTemp.serviceScope && (
                                                        <td></td>
                                                      )}
                                                      {packageCount >= 2 && (
                                                        <>
                                                          <td className="tr-table-class font-14 text-white text-right">
                                                            {" "}
                                                            {totalTwoPackageValue >
                                                              Number(
                                                                RecurringPricingInfo.packageTwoNetTotal
                                                              ) ||
                                                            (Number(
                                                              RecurringPricingInfo.packageTwoDisCount
                                                            ) > 0 &&
                                                              !ProposalObject.DiscountLines)
                                                              ? Number(
                                                                  RecurringPricingInfo.packageTwoDisCount
                                                                ) > 0 &&
                                                                !ProposalObject.DiscountLines
                                                                ? formatValue(
                                                                    RecurringPricingInfo.packageTwoDisCountedTotal
                                                                  )
                                                                : formatValue(
                                                                    totalTwoPackageValue
                                                                  )
                                                              : formatValue(
                                                                  RecurringPricingInfo.packageTwoNetTotal
                                                                )}
                                                          </td>

                                                          {visibleFieldsCustomTemp.vat && (
                                                            <td className="tr-table-class font-14 text-white text-right">
                                                              {" "}
                                                              {formatValue(
                                                                RecurringPricingInfo.PackageTwoVaTPriceWithoutDiscout
                                                              )}
                                                            </td>
                                                          )}
                                                          {visibleFieldsCustomTemp.serviceScope && (
                                                            <td></td>
                                                          )}
                                                        </>
                                                      )}{" "}
                                                      {packageCount === 3 && (
                                                        <>
                                                          <td className="tr-table-class font-14 text-white text-right">
                                                            {" "}
                                                            {totalThreePackageValue >
                                                              Number(
                                                                RecurringPricingInfo.packageThreeNetTotal
                                                              ) ||
                                                            (Number(
                                                              RecurringPricingInfo.packageThreeDisCount
                                                            ) > 0 &&
                                                              !ProposalObject.DiscountLines)
                                                              ? Number(
                                                                  RecurringPricingInfo.packageThreeDisCount
                                                                ) > 0 &&
                                                                !ProposalObject.DiscountLines
                                                                ? formatValue(
                                                                    RecurringPricingInfo.packageThreeDisCountedTotal
                                                                  )
                                                                : formatValue(
                                                                    totalThreePackageValue
                                                                  )
                                                              : formatValue(
                                                                  RecurringPricingInfo.packageThreeNetTotal
                                                                )}
                                                          </td>

                                                          {visibleFieldsCustomTemp.vat && (
                                                            <td className="tr-table-class font-14 text-white text-right">
                                                              {" "}
                                                              {formatValue(
                                                                RecurringPricingInfo.PackageThreeVaTPriceWithoutDiscout
                                                              )}
                                                            </td>
                                                          )}
                                                          {visibleFieldsCustomTemp.serviceScope && (
                                                            <td></td>
                                                          )}
                                                        </>
                                                      )}
                                                    </tr>

                                                    {(Number(
                                                      RecurringPricingInfo.packageThreeDisCount
                                                    ) > 0 ||
                                                      Number(
                                                        RecurringPricingInfo.packageOneDisCount
                                                      ) > 0 ||
                                                      Number(
                                                        RecurringPricingInfo.packageTwoDisCount
                                                      ) > 0) &&
                                                      ProposalObject.DiscountLines && (
                                                        <>
                                                          <tr className="head-grey-row">
                                                            <td className="tr-table-class font-14 text-white">
                                                              Discount
                                                            </td>
                                                            <td className="tr-table-class font-14 text-white text-right">
                                                              (-){" "}
                                                              {formatValue(
                                                                RecurringPricingInfo.packageOneDisCount
                                                              )}
                                                            </td>
                                                            {/* Discounted VAT */}

                                                            {/* {visibleFieldsCustomTemp.vat && (
                                                                     <td className="tr-table-class font-14 text-white text-right">
                                                                       (-){" "}
                                                                       {(() => {
                                                                         const discountVat =
                                                                           (RecurringPricingInfo.PackageOneVaTPriceWithoutDiscout *
                                                                             RecurringPricingInfo.DiscountPercentagePackageOne) /
                                                                           100;
                                             
                                                                         return discountVat && !isNaN(discountVat)
                                                                           ? formatValue(discountVat)
                                                                           : formatValue(
                                                                               RecurringPricingInfo.PackageOneVaTPriceWithoutDiscout -
                                                                                 RecurringPricingInfo.PackageOneVaTPrice
                                                                             );
                                                                       })()}
                                                                     </td>
                                                                   )} */}

                                                            {visibleFieldsCustomTemp.vat && (
                                                              <td className="tr-table-class font-14 text-white text-right">
                                                                (-){" "}
                                                                {formatValue(
                                                                  RecurringPricingInfo.PackageOneVaTPriceWithoutDiscount -
                                                                    RecurringPricingInfo.PackageOneVaTPrice
                                                                )}
                                                              </td>
                                                            )}

                                                            {visibleFieldsCustomTemp.serviceScope && (
                                                              <td></td>
                                                            )}

                                                            {/* <td className="tr-table-class font-14 text-white text-right"></td> */}
                                                            {packageCount >=
                                                              2 && (
                                                              <>
                                                                <td className="tr-table-class font-14 text-white text-right">
                                                                  (-){" "}
                                                                  {formatValue(
                                                                    RecurringPricingInfo.packageTwoDisCount
                                                                  )}
                                                                </td>

                                                                {visibleFieldsCustomTemp.vat && (
                                                                  <td className="tr-table-class font-14 text-white text-right">
                                                                    (-){" "}
                                                                    {formatValue(
                                                                      RecurringPricingInfo.PackageTwoVaTPriceWithoutDiscout -
                                                                        RecurringPricingInfo.PackageTwoVaTPrice
                                                                    )}
                                                                  </td>
                                                                  // <td className="tr-table-class font-14 text-white text-right">
                                                                  //   (-){" "}
                                                                  //   {formatValue(
                                                                  //     (RecurringPricingInfo.PackageTwoVaTPriceWithoutDiscout *
                                                                  //       RecurringPricingInfo.DiscountPercentagePackageTwo) /
                                                                  //       100
                                                                  //   )}
                                                                  // </td>
                                                                )}
                                                                {visibleFieldsCustomTemp.serviceScope && (
                                                                  <td></td>
                                                                )}
                                                              </>
                                                            )}
                                                            {packageCount ===
                                                              3 && (
                                                              <>
                                                                <td className="tr-table-class font-14 text-white text-right">
                                                                  (-){" "}
                                                                  {formatValue(
                                                                    RecurringPricingInfo.packageThreeDisCount
                                                                  )}
                                                                </td>

                                                                {visibleFieldsCustomTemp.vat && (
                                                                  <td className="tr-table-class font-14 text-white text-right">
                                                                    (-){" "}
                                                                    {formatValue(
                                                                      RecurringPricingInfo.PackageThreeVaTPriceWithoutDiscout -
                                                                        RecurringPricingInfo.PackageThreeVaTPrice
                                                                    )}
                                                                  </td>
                                                                  // <td className="tr-table-class font-14 text-white text-right">
                                                                  //   (-){" "}
                                                                  //   {formatValue(
                                                                  //     (RecurringPricingInfo.PackageThreeVaTPriceWithoutDiscout *
                                                                  //       RecurringPricingInfo.DiscountPercentagePackageThree) /
                                                                  //       100
                                                                  //   )}
                                                                  // </td>
                                                                )}
                                                                {visibleFieldsCustomTemp.serviceScope && (
                                                                  <td></td>
                                                                )}
                                                              </>
                                                            )}
                                                          </tr>
                                                          {/* <tr className="head-row">
                                                                   <td className="tr-table-class font-14 text-white">
                                                                     Discounted Total
                                                                   </td>
                                                                   <td className="tr-table-class font-14 text-white text-right">
                                                                     {" "}
                                                                     {formatValue(
                                                                       RecurringPricingInfo.packageOneDisCountedTotal
                                                                     )}
                                                                   </td>
                                             
                                                                   {visibleFieldsCustomTemp.vat && (
                                                                     <td className="tr-table-class font-14 text-white text-right">
                                                                       {" "}
                                                                       {formatValue(
                                                                         RecurringPricingInfo.PackageOneVaTPriceWithoutDiscout -
                                                                           (RecurringPricingInfo.PackageOneVaTPriceWithoutDiscout *
                                                                             20) /
                                                                             100
                                                                       )}
                                                                     </td>
                                                                   )}
                                                                  
                                             
                                                                   {packageCount >= 2 && (
                                                                     <>
                                                                       <td className="tr-table-class font-14 text-white text-right">
                                                                         {" "}
                                                                         {formatValue(
                                                                           RecurringPricingInfo.packageTwoDisCountedTotal
                                                                         )}
                                                                       </td>
                                                                       {visibleFieldsCustomTemp.vat && (
                                                                         <td className="tr-table-class font-14 text-white text-right">
                                                                           {" "}
                                                                           {formatValue(
                                                                             RecurringPricingInfo.PackageTwoVaTPriceWithoutDiscout -
                                                                               (RecurringPricingInfo.PackageTwoVaTPriceWithoutDiscout *
                                                                                 20) /
                                                                                 100
                                                                           )}
                                                                         </td>
                                                                       )}
                                                                     </>
                                                                   )}
                                                                   {packageCount === 3 && (
                                                                     <>
                                                                       <td className="tr-table-class font-14 text-white text-right">
                                                                         {" "}
                                                                         {formatValue(
                                                                           RecurringPricingInfo.packageThreeDisCountedTotal
                                                                         )}
                                                                       </td>
                                                                       {visibleFieldsCustomTemp.vat && (
                                                                         <td className="tr-table-class font-14 text-white text-right">
                                                                           {" "}
                                                                           {formatValue(
                                                                             RecurringPricingInfo.PackageThreeVaTPriceWithoutDiscout -
                                                                               (RecurringPricingInfo.PackageThreeVaTPriceWithoutDiscout *
                                                                                 20) /
                                                                                 100
                                                                           )}
                                                                         </td>
                                                                       )}
                                                                     </>
                                                                   )}
                                             
                                                                   {visibleFieldsCustomTemp.serviceScope && <td></td>}
                                                                 </tr> */}
                                                          <tr className="head-row">
                                                            <td className="tr-table-class font-14 text-white">
                                                              {/* Fees inc VAT (£) */}
                                                              Grand Total
                                                            </td>
                                                            {/* <td className="tr-table-class font-14 text-white text-right">
                                                                     {" "}
                                                                     {formatValue(RecurringPricingInfo.PackageOneGrandTotal)}
                                                                   </td> */}
                                                            <td className="tr-table-class font-14 text-white text-right">
                                                              {" "}
                                                              {totalOnePackageValue >
                                                                Number(
                                                                  RecurringPricingInfo.packageOneNetTotal
                                                                ) ||
                                                              (Number(
                                                                RecurringPricingInfo.packageOneDisCount
                                                              ) > 0 &&
                                                                !ProposalObject.DiscountLines)
                                                                ? Number(
                                                                    RecurringPricingInfo.packageOneDisCount
                                                                  ) > 0 &&
                                                                  !ProposalObject.DiscountLines
                                                                  ? formatValue(
                                                                      RecurringPricingInfo.packageOneDisCountedTotal -
                                                                        RecurringPricingInfo.packageOneDisCount
                                                                    )
                                                                  : formatValue(
                                                                      totalOnePackageValue -
                                                                        RecurringPricingInfo.packageOneDisCount
                                                                    )
                                                                : formatValue(
                                                                    RecurringPricingInfo.packageOneNetTotal -
                                                                      RecurringPricingInfo.packageOneDisCount
                                                                  )}
                                                            </td>
                                                            {visibleFieldsCustomTemp.vat && (
                                                              <td className="tr-table-class font-14 text-white text-right">
                                                                {formatValue(
                                                                  RecurringPricingInfo.PackageOneVaTPrice
                                                                )}
                                                              </td>
                                                              // <td className="tr-table-class font-14 text-white text-right">
                                                              //   {formatValue(
                                                              //     RecurringPricingInfo.PackageOneVaTPriceWithoutDiscout -
                                                              //       (RecurringPricingInfo.PackageOneVaTPriceWithoutDiscout *
                                                              //         RecurringPricingInfo.DiscountPercentagePackageOne) /
                                                              //         100
                                                              //   )}
                                                              // </td>
                                                            )}
                                                            {visibleFieldsCustomTemp.serviceScope && (
                                                              <td></td>
                                                            )}
                                                            {packageCount >=
                                                              2 && (
                                                              <>
                                                                <td className="tr-table-class font-14 text-white text-right">
                                                                  {" "}
                                                                  {formatValue(
                                                                    RecurringPricingInfo.PackageTwoGrandTotal
                                                                  )}
                                                                </td>
                                                                {visibleFieldsCustomTemp.vat && (
                                                                  <td className="tr-table-class font-14 text-white text-right">
                                                                    {formatValue(
                                                                      RecurringPricingInfo.PackageTwoVaTPriceWithoutDiscout -
                                                                        (RecurringPricingInfo.PackageTwoVaTPriceWithoutDiscout *
                                                                          RecurringPricingInfo.DiscountPercentagePackageTwo) /
                                                                          100
                                                                    )}
                                                                  </td>
                                                                )}
                                                                {visibleFieldsCustomTemp.serviceScope && (
                                                                  <td></td>
                                                                )}
                                                              </>
                                                            )}
                                                            {packageCount ==
                                                              3 && (
                                                              <>
                                                                <td className="tr-table-class font-14 text-white text-right">
                                                                  {" "}
                                                                  {formatValue(
                                                                    RecurringPricingInfo.PackageThreeGrandTotal
                                                                  )}
                                                                </td>
                                                                {visibleFieldsCustomTemp.vat && (
                                                                  <td className="tr-table-class font-14 text-white text-right">
                                                                    {formatValue(
                                                                      RecurringPricingInfo.PackageThreeVaTPriceWithoutDiscout -
                                                                        (RecurringPricingInfo.PackageThreeVaTPriceWithoutDiscout *
                                                                          RecurringPricingInfo.DiscountPercentagePackageThree) /
                                                                          100
                                                                    )}
                                                                  </td>
                                                                )}
                                                                {visibleFieldsCustomTemp.serviceScope && (
                                                                  <td></td>
                                                                )}
                                                              </>
                                                            )}
                                                          </tr>
                                                        </>
                                                      )}

                                                    {vatPercentage && (
                                                      <>
                                                        {/* <tr class="head-grey-row">
                                                                                      <td className="tr-table-class font-14 text-white">
                                                                                        VAT
                                                                                      </td>
                                                                                      <td className="tr-table-class font-14 text-white text-right">
                                                                                        {" "}
                                                                                        {formatValue(
                                                                                          RecurringPricingInfo
                                                                                            .PackageOneVaTPrice
                                                                                        )}
                                                                                      </td>
                                                                                      {packageCount >= 2 && (
                                                                                        <td className="tr-table-class font-14 text-white text-right">
                                                                                          {" "}
                                                                                          {formatValue(
                                                                                            RecurringPricingInfo
                                                                                              .PackageTwoVaTPrice
                                                                                          )}
                                                                                        </td>
                                                                                      )}
                                                                                      {packageCount === 3 && (
                                                                                        <td className="tr-table-class font-14 text-white text-right">
                                                                                          {" "}
                                                                                          {formatValue(
                                                                                            RecurringPricingInfo
                                                                                              .PackageThreeVaTPrice
                                                                                          )}
                                                                                        </td>
                                                                                      )}
                                                                                    </tr> */}
                                                      </>
                                                    )}
                                                  </table>
                                                </div>
                                              )}

                                              {/* Recurring */}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {selectedOneOffServiceList?.length !==
                                      0 && (
                                      <div className="tab-content">
                                        <div className="tab-pane p-3 active">
                                          <div className="row">
                                            <div className="col-lg-12">
                                              <div className="separator mb-2"></div>
                                              <h6>One-Off Services</h6>
                                              <div className="separator mb-3"></div>
                                              <div
                                                class="row"
                                                id="OneOff_Default"
                                              >
                                                <div class="col-lg-2 mb-1 col-md-2 col-sm-12 mt-2 text-md-end">
                                                  <div class="mb-1 text-md-end">
                                                    {packageCount == 1 && (
                                                      <label class="form-label">
                                                        Discount (%)
                                                      </label>
                                                    )}
                                                  </div>
                                                </div>
                                                <div className="col-lg-4">
                                                  {packageCount == 1 && (
                                                    <input
                                                      readonly=""
                                                      class="input-text"
                                                      type="text"
                                                      placeholder="Default Discount (%)"
                                                      value={
                                                        Number(
                                                          Math.floor(
                                                            OneOffPricingInfo.DefaultDiscount *
                                                              100
                                                          ) / 100
                                                        )
                                                          .toFixed(2)
                                                          .replace(
                                                            /\B(?=(\d{3})+(?!\d))/g,
                                                            ","
                                                          )

                                                        // OneOffPricingInfo.DefaultDiscount
                                                      }
                                                    />
                                                  )}
                                                </div>
                                              </div>
                                              <div className="mb-3"></div>
                                              {/* One-off */}
                                              {pricingTableColumnIDs === null ||
                                              pricingTableColumnIDs === "" ||
                                              pricingTableColumnIDs ===
                                                undefined ? (
                                                <div
                                                  style={{ marginTop: "0px" }}
                                                  className="table-responsive"
                                                >
                                                  <table
                                                    class="table align-middle table-nowrap"
                                                    style={{ width: "100%" }}
                                                  >
                                                    <thead className="table-light table-header-font">
                                                      <tr className="head-row">
                                                        <td className="tr-table-class text-white">
                                                          Services
                                                        </td>

                                                        {selectedPackagesList.map(
                                                          (pkg, index) => (
                                                            <td
                                                              key={index}
                                                              className="tr-table-class text-white text-right"
                                                              style={{
                                                                fontWeight:
                                                                  getFontStyles(
                                                                    selectedPackagesList[
                                                                      index
                                                                    ]
                                                                      .servicePackageID,
                                                                    "ID"
                                                                  ).fontWeight,
                                                                fontSize:
                                                                  getFontStyles(
                                                                    selectedPackagesList[
                                                                      index
                                                                    ]
                                                                      .servicePackageID,
                                                                    "ID"
                                                                  ).fontSize,
                                                              }}
                                                            >
                                                              {pkg
                                                                .servicePackageName
                                                                .length > 10 ? (
                                                                <Tooltip
                                                                  title={
                                                                    pkg.servicePackageName
                                                                  }
                                                                >
                                                                  {pkg.servicePackageName
                                                                    .substring(
                                                                      0,
                                                                      10
                                                                    )
                                                                    .toLowerCase()
                                                                    .replace(
                                                                      /\b\w/g,
                                                                      (l) =>
                                                                        l.toUpperCase()
                                                                    ) + "..."}
                                                                </Tooltip>
                                                              ) : pkg
                                                                  .servicePackageName
                                                                  .length >
                                                                10 ? (
                                                                <Tooltip
                                                                  title={
                                                                    pkg.servicePackageName
                                                                  }
                                                                >
                                                                  {pkg.servicePackageName.substring(
                                                                    0,
                                                                    10
                                                                  ) + "..."}
                                                                </Tooltip>
                                                              ) : (
                                                                pkg.servicePackageName
                                                              )}
                                                            </td>
                                                          )
                                                        )}
                                                      </tr>
                                                    </thead>
                                                    <tbody>
                                                      {selectedOneOffServiceList.map(
                                                        (service, index) => {
                                                          return (
                                                            <>
                                                              <tr className="a-la-carte-services-review-head-row">
                                                                <th
                                                                  colSpan={
                                                                    1 +
                                                                    packageCount
                                                                  }
                                                                >
                                                                  {
                                                                    service.serviceCatName
                                                                  }
                                                                </th>
                                                              </tr>
                                                              {service.servicesList.map(
                                                                (
                                                                  subService,
                                                                  subIndex
                                                                ) => (
                                                                  <tr
                                                                    key={
                                                                      subIndex
                                                                    }
                                                                    className={` ${
                                                                      subService?.isAdditionalService ===
                                                                      true
                                                                        ? "bg-info  text-white"
                                                                        : ""
                                                                    }`}
                                                                  >
                                                                    <td>
                                                                      <div>
                                                                        {subService
                                                                          .serviceName
                                                                          .length >
                                                                        45
                                                                          ? subService.serviceName
                                                                              .substring(
                                                                                0,
                                                                                45
                                                                              )
                                                                              .toLowerCase()
                                                                              .replace(
                                                                                /\b\w/g,
                                                                                (
                                                                                  l
                                                                                ) =>
                                                                                  l.toUpperCase()
                                                                              ) +
                                                                            "..."
                                                                          : subService.serviceName}
                                                                      </div>
                                                                      <div className="package-variables"></div>
                                                                    </td>

                                                                    <td
                                                                      style={{
                                                                        fontWeight:
                                                                          getFontStyles(
                                                                            0,
                                                                            "Index"
                                                                          )
                                                                            .fontWeight,
                                                                        fontSize:
                                                                          getFontStyles(
                                                                            0,
                                                                            "Index"
                                                                          )
                                                                            .fontSize,
                                                                      }}
                                                                      className="text-right"
                                                                    >
                                                                      {ProposalObject.feeTypeId ===
                                                                      1 ? (
                                                                        <>
                                                                          {" "}
                                                                          {subService.packageOneValue ===
                                                                          null ? (
                                                                            <span className="fa fa-times"></span>
                                                                          ) : (
                                                                            formatValue(
                                                                              subService.packageOneValue
                                                                            )
                                                                          )}
                                                                        </>
                                                                      ) : subService.packageOneValue !==
                                                                        null ? (
                                                                        <span className="fa fa-check"></span>
                                                                      ) : (
                                                                        <span className="fa fa-times"></span>
                                                                      )}
                                                                    </td>
                                                                    {packageCount >=
                                                                      2 && (
                                                                      <td
                                                                        style={{
                                                                          fontWeight:
                                                                            getFontStyles(
                                                                              1,
                                                                              "Index"
                                                                            )
                                                                              .fontWeight,
                                                                          fontSize:
                                                                            getFontStyles(
                                                                              1,
                                                                              "Index"
                                                                            )
                                                                              .fontSize,
                                                                        }}
                                                                        className="text-right"
                                                                      >
                                                                        {ProposalObject.feeTypeId ===
                                                                        1 ? (
                                                                          <>
                                                                            {" "}
                                                                            {subService.packageTwoValue ===
                                                                            null ? (
                                                                              <span className="fa fa-times"></span>
                                                                            ) : (
                                                                              formatValue(
                                                                                subService.packageTwoValue
                                                                              )
                                                                            )}
                                                                          </>
                                                                        ) : subService.packageTwoValue !==
                                                                          null ? (
                                                                          <span className="fa fa-check"></span>
                                                                        ) : (
                                                                          <span className="fa fa-times"></span>
                                                                        )}
                                                                      </td>
                                                                    )}
                                                                    {packageCount ===
                                                                      3 && (
                                                                      <td
                                                                        style={{
                                                                          fontWeight:
                                                                            getFontStyles(
                                                                              2,
                                                                              "Index"
                                                                            )
                                                                              .fontWeight,
                                                                          fontSize:
                                                                            getFontStyles(
                                                                              2,
                                                                              "Index"
                                                                            )
                                                                              .fontSize,
                                                                        }}
                                                                        className="text-right"
                                                                      >
                                                                        {ProposalObject.feeTypeId ===
                                                                        1 ? (
                                                                          <>
                                                                            {" "}
                                                                            {subService.packageThreeValue ===
                                                                            null ? (
                                                                              <span className="fa fa-times"></span>
                                                                            ) : (
                                                                              formatValue(
                                                                                subService.packageThreeValue
                                                                              )
                                                                            )}
                                                                          </>
                                                                        ) : subService.packageThreeValue !==
                                                                          null ? (
                                                                          <span className="fa fa-check"></span>
                                                                        ) : (
                                                                          <span className="fa fa-times"></span>
                                                                        )}
                                                                      </td>
                                                                    )}
                                                                  </tr>
                                                                )
                                                              )}
                                                            </>
                                                          );
                                                        }
                                                      )}
                                                    </tbody>
                                                    {packageCount > 1 && (
                                                      <>
                                                        <tr id="recurring_DefaultWithPackages">
                                                          <td>
                                                            <div>
                                                              Discount (%)
                                                            </div>
                                                            {/* <div className="package-variables"></div> */}
                                                          </td>

                                                          <td
                                                            style={{
                                                              width: "35%",
                                                              padding: "0px",
                                                              whiteSpace:
                                                                "normal",
                                                            }}
                                                          >
                                                            <div
                                                              style={{
                                                                display: "flex",
                                                                flexDirection:
                                                                  "column",
                                                                alignItems:
                                                                  "flex-start",
                                                              }}
                                                            >
                                                              <input
                                                                readOnly
                                                                className="input-text"
                                                                type="number" // Change type to number
                                                                placeholder="Discount (%)"
                                                                value={Number(
                                                                  OneOffPricingInfo.DiscountPercentagePackageOne
                                                                )
                                                                  .toFixed(2)
                                                                  .replace(
                                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                                    ","
                                                                  )}
                                                                style={{
                                                                  width: "100%",
                                                                  textAlign:
                                                                    "right",
                                                                }}
                                                              />
                                                            </div>
                                                          </td>

                                                          {packageCount >=
                                                            2 && (
                                                            <td
                                                              style={{
                                                                width: "35%",
                                                                padding: "0px",
                                                                whiteSpace:
                                                                  "normal",
                                                              }}
                                                            >
                                                              <div
                                                                style={{
                                                                  display:
                                                                    "flex",
                                                                  flexDirection:
                                                                    "column",
                                                                  alignItems:
                                                                    "flex-start",
                                                                }}
                                                              >
                                                                <input
                                                                  readOnly
                                                                  className="input-text"
                                                                  type="number" // Change type to number
                                                                  placeholder="Discount (%)"
                                                                  value={Number(
                                                                    OneOffPricingInfo.DiscountPercentagePackageTwo
                                                                  )
                                                                    .toFixed(2)
                                                                    .replace(
                                                                      /\B(?=(\d{3})+(?!\d))/g,
                                                                      ","
                                                                    )}
                                                                  style={{
                                                                    width:
                                                                      "100%",
                                                                    textAlign:
                                                                      "right",
                                                                  }}
                                                                />
                                                                <div></div>
                                                              </div>
                                                            </td>
                                                          )}

                                                          {packageCount ===
                                                            3 && (
                                                            <td
                                                              style={{
                                                                width: "35%",
                                                                padding: "0px",
                                                                whiteSpace:
                                                                  "normal",
                                                              }}
                                                            >
                                                              <div
                                                                style={{
                                                                  display:
                                                                    "flex",
                                                                  flexDirection:
                                                                    "column",
                                                                  alignItems:
                                                                    "flex-start",
                                                                }}
                                                              >
                                                                <input
                                                                  readOnly
                                                                  className="input-text"
                                                                  type="number" // Change type to number
                                                                  placeholder="Discount (%)"
                                                                  value={Number(
                                                                    OneOffPricingInfo.DiscountPercentagePackageThree
                                                                  )
                                                                    .toFixed(2)
                                                                    .replace(
                                                                      /\B(?=(\d{3})+(?!\d))/g,
                                                                      ","
                                                                    )}
                                                                  style={{
                                                                    width:
                                                                      "100%",
                                                                    textAlign:
                                                                      "right",
                                                                  }}
                                                                />
                                                              </div>
                                                            </td>
                                                          )}
                                                        </tr>
                                                      </>
                                                    )}
                                                    <thead className="table-light table-header-font">
                                                      <tr className="head-row">
                                                        <td className="tr-table-class text-white">
                                                          Net Total
                                                        </td>
                                                        <td
                                                          style={{
                                                            fontWeight:
                                                              getFontStyles(
                                                                0,
                                                                "Index"
                                                              ).fontWeight,
                                                            fontSize:
                                                              getFontStyles(
                                                                0,
                                                                "Index"
                                                              ).fontSize,
                                                          }}
                                                          className="tr-table-class text-white text-right"
                                                        >
                                                          {" "}
                                                          {Number(
                                                            OneOffPricingInfo.packageOneNetTotal
                                                          ) <
                                                            Number(
                                                              OneOffPricingInfo.packageOneDisCountedTotal
                                                            ) ||
                                                          (Number(
                                                            OneOffPricingInfo.packageOneDisCount
                                                          ) > 0 &&
                                                            !ProposalObject.DiscountLines)
                                                            ? formatValue(
                                                                OneOffPricingInfo.packageOneDisCountedTotal
                                                              )
                                                            : formatValue(
                                                                OneOffPricingInfo.packageOneNetTotal
                                                              )}
                                                        </td>
                                                        {packageCount >= 2 && (
                                                          <td
                                                            style={{
                                                              fontWeight:
                                                                getFontStyles(
                                                                  1,
                                                                  "Index"
                                                                ).fontWeight,
                                                              fontSize:
                                                                getFontStyles(
                                                                  1,
                                                                  "Index"
                                                                ).fontSize,
                                                            }}
                                                            className="tr-table-class text-white text-right"
                                                          >
                                                            {" "}
                                                            {Number(
                                                              OneOffPricingInfo.packageTwoNetTotal
                                                            ) <
                                                              Number(
                                                                OneOffPricingInfo.packageTwoDisCountedTotal
                                                              ) ||
                                                            (Number(
                                                              OneOffPricingInfo.packageTwoDisCount
                                                            ) > 0 &&
                                                              !ProposalObject.DiscountLines)
                                                              ? formatValue(
                                                                  OneOffPricingInfo.packageTwoDisCountedTotal
                                                                )
                                                              : formatValue(
                                                                  OneOffPricingInfo.packageTwoNetTotal
                                                                )}
                                                          </td>
                                                        )}{" "}
                                                        {packageCount === 3 && (
                                                          <td
                                                            style={{
                                                              fontWeight:
                                                                getFontStyles(
                                                                  2,
                                                                  "Index"
                                                                ).fontWeight,
                                                              fontSize:
                                                                getFontStyles(
                                                                  2,
                                                                  "Index"
                                                                ).fontSize,
                                                            }}
                                                            className="tr-table-class text-white text-right"
                                                          >
                                                            {" "}
                                                            {Number(
                                                              OneOffPricingInfo.packageThreeNetTotal
                                                            ) <
                                                              Number(
                                                                OneOffPricingInfo.packageThreeDisCountedTotal
                                                              ) ||
                                                            (Number(
                                                              OneOffPricingInfo.packageThreeDisCount
                                                            ) > 0 &&
                                                              !ProposalObject.DiscountLines)
                                                              ? formatValue(
                                                                  OneOffPricingInfo.packageThreeDisCountedTotal
                                                                )
                                                              : formatValue(
                                                                  OneOffPricingInfo.packageThreeNetTotal
                                                                )}
                                                          </td>
                                                        )}
                                                      </tr>
                                                    </thead>
                                                    {(Number(
                                                      OneOffPricingInfo.packageThreeDisCount
                                                    ) > 0 ||
                                                      Number(
                                                        OneOffPricingInfo.packageOneDisCount
                                                      ) > 0 ||
                                                      Number(
                                                        OneOffPricingInfo.packageTwoDisCount
                                                      ) > 0) &&
                                                      ProposalObject.DiscountLines && (
                                                        <>
                                                          <tr className="head-grey-row">
                                                            <td className="tr-table-class text-white">
                                                              Discount
                                                            </td>
                                                            <td
                                                              style={{
                                                                fontWeight:
                                                                  getFontStyles(
                                                                    0,
                                                                    "Index"
                                                                  ).fontWeight,
                                                                fontSize:
                                                                  getFontStyles(
                                                                    0,
                                                                    "Index"
                                                                  ).fontSize,
                                                              }}
                                                              className="tr-table-class text-white text-right"
                                                            >
                                                              (-){" "}
                                                              {new Intl.NumberFormat(
                                                                "en-GB",
                                                                {
                                                                  style:
                                                                    "currency",
                                                                  currency:
                                                                    "GBP",
                                                                }
                                                              ).format(
                                                                Number(
                                                                  OneOffPricingInfo.packageOneDisCount
                                                                )
                                                              )}
                                                            </td>
                                                            {packageCount >=
                                                              2 && (
                                                              <td
                                                                style={{
                                                                  fontWeight:
                                                                    getFontStyles(
                                                                      1,
                                                                      "Index"
                                                                    )
                                                                      .fontWeight,
                                                                  fontSize:
                                                                    getFontStyles(
                                                                      1,
                                                                      "Index"
                                                                    ).fontSize,
                                                                }}
                                                                className="tr-table-class text-white text-right"
                                                              >
                                                                (-){" "}
                                                                {new Intl.NumberFormat(
                                                                  "en-GB",
                                                                  {
                                                                    style:
                                                                      "currency",
                                                                    currency:
                                                                      "GBP",
                                                                  }
                                                                ).format(
                                                                  Number(
                                                                    OneOffPricingInfo.packageTwoDisCount
                                                                  )
                                                                )}
                                                              </td>
                                                            )}
                                                            {packageCount ==
                                                              3 && (
                                                              <td
                                                                style={{
                                                                  fontWeight:
                                                                    getFontStyles(
                                                                      2,
                                                                      "Index"
                                                                    )
                                                                      .fontWeight,
                                                                  fontSize:
                                                                    getFontStyles(
                                                                      2,
                                                                      "Index"
                                                                    ).fontSize,
                                                                }}
                                                                className="tr-table-class text-white text-right"
                                                              >
                                                                (-){" "}
                                                                {new Intl.NumberFormat(
                                                                  "en-GB",
                                                                  {
                                                                    style:
                                                                      "currency",
                                                                    currency:
                                                                      "GBP",
                                                                  }
                                                                ).format(
                                                                  Number(
                                                                    OneOffPricingInfo.packageThreeDisCount
                                                                  )
                                                                )}
                                                              </td>
                                                            )}
                                                          </tr>
                                                          <tr className="head-row">
                                                            <td className="tr-table-class text-white">
                                                              Discounted Total
                                                            </td>
                                                            <td
                                                              style={{
                                                                fontWeight:
                                                                  getFontStyles(
                                                                    0,
                                                                    "Index"
                                                                  ).fontWeight,
                                                                fontSize:
                                                                  getFontStyles(
                                                                    0,
                                                                    "Index"
                                                                  ).fontSize,
                                                              }}
                                                              className="tr-table-class text-white text-right"
                                                            >
                                                              {new Intl.NumberFormat(
                                                                "en-GB",
                                                                {
                                                                  style:
                                                                    "currency",
                                                                  currency:
                                                                    "GBP",
                                                                }
                                                              ).format(
                                                                Number(
                                                                  OneOffPricingInfo.packageOneDisCountedTotal
                                                                )
                                                              )}
                                                            </td>
                                                            {packageCount >=
                                                              2 && (
                                                              <td
                                                                style={{
                                                                  fontWeight:
                                                                    getFontStyles(
                                                                      1,
                                                                      "Index"
                                                                    )
                                                                      .fontWeight,
                                                                  fontSize:
                                                                    getFontStyles(
                                                                      1,
                                                                      "Index"
                                                                    ).fontSize,
                                                                }}
                                                                className="tr-table-class text-white text-right"
                                                              >
                                                                {new Intl.NumberFormat(
                                                                  "en-GB",
                                                                  {
                                                                    style:
                                                                      "currency",
                                                                    currency:
                                                                      "GBP",
                                                                  }
                                                                ).format(
                                                                  Number(
                                                                    OneOffPricingInfo.packageTwoDisCountedTotal
                                                                  )
                                                                )}
                                                              </td>
                                                            )}
                                                            {packageCount ==
                                                              3 && (
                                                              <td
                                                                style={{
                                                                  fontWeight:
                                                                    getFontStyles(
                                                                      2,
                                                                      "Index"
                                                                    )
                                                                      .fontWeight,
                                                                  fontSize:
                                                                    getFontStyles(
                                                                      2,
                                                                      "Index"
                                                                    ).fontSize,
                                                                }}
                                                                className="tr-table-class text-white text-right"
                                                              >
                                                                {new Intl.NumberFormat(
                                                                  "en-GB",
                                                                  {
                                                                    style:
                                                                      "currency",
                                                                    currency:
                                                                      "GBP",
                                                                  }
                                                                ).format(
                                                                  Number(
                                                                    OneOffPricingInfo.packageThreeDisCountedTotal
                                                                  )
                                                                )}
                                                              </td>
                                                            )}
                                                          </tr>
                                                        </>
                                                      )}
                                                    {vatPercentage && (
                                                      <>
                                                        <tr class="head-grey-row">
                                                          <td className="tr-table-class text-white">
                                                            {getTaxName(
                                                              ProposalObject.currencyID
                                                            )}
                                                          </td>
                                                          <td
                                                            style={{
                                                              fontWeight:
                                                                getFontStyles(
                                                                  0,
                                                                  "Index"
                                                                ).fontWeight,
                                                              fontSize:
                                                                getFontStyles(
                                                                  0,
                                                                  "Index"
                                                                ).fontSize,
                                                            }}
                                                            className="tr-table-class text-white text-right"
                                                          >
                                                            {" "}
                                                            {formatValue(
                                                              OneOffPricingInfo.PackageOneVaTPrice
                                                            )}
                                                          </td>
                                                          {packageCount >=
                                                            2 && (
                                                            <td
                                                              style={{
                                                                fontWeight:
                                                                  getFontStyles(
                                                                    1,
                                                                    "Index"
                                                                  ).fontWeight,
                                                                fontSize:
                                                                  getFontStyles(
                                                                    1,
                                                                    "Index"
                                                                  ).fontSize,
                                                              }}
                                                              className="tr-table-class text-white text-right"
                                                            >
                                                              {" "}
                                                              {formatValue(
                                                                OneOffPricingInfo.PackageTwoVaTPrice
                                                              )}
                                                            </td>
                                                          )}
                                                          {packageCount ===
                                                            3 && (
                                                            <td
                                                              style={{
                                                                fontWeight:
                                                                  getFontStyles(
                                                                    2,
                                                                    "Index"
                                                                  ).fontWeight,
                                                                fontSize:
                                                                  getFontStyles(
                                                                    2,
                                                                    "Index"
                                                                  ).fontSize,
                                                              }}
                                                              className="tr-table-class text-white text-right"
                                                            >
                                                              {" "}
                                                              {formatValue(
                                                                OneOffPricingInfo.PackageThreeVaTPrice
                                                              )}
                                                            </td>
                                                          )}
                                                        </tr>
                                                        <tr className="head-row">
                                                          <td className="tr-table-class text-white">
                                                            Grand Total
                                                          </td>
                                                          <td
                                                            style={{
                                                              fontWeight:
                                                                getFontStyles(
                                                                  0,
                                                                  "Index"
                                                                ).fontWeight,
                                                              fontSize:
                                                                getFontStyles(
                                                                  0,
                                                                  "Index"
                                                                ).fontSize,
                                                            }}
                                                            className="tr-table-class text-white text-right"
                                                          >
                                                            {" "}
                                                            {formatValue(
                                                              OneOffPricingInfo.PackageOneGrandTotal
                                                            )}
                                                          </td>
                                                          {packageCount >=
                                                            2 && (
                                                            <td
                                                              style={{
                                                                fontWeight:
                                                                  getFontStyles(
                                                                    1,
                                                                    "Index"
                                                                  ).fontWeight,
                                                                fontSize:
                                                                  getFontStyles(
                                                                    1,
                                                                    "Index"
                                                                  ).fontSize,
                                                              }}
                                                              className="tr-table-class text-white text-right"
                                                            >
                                                              {" "}
                                                              {formatValue(
                                                                OneOffPricingInfo.PackageTwoGrandTotal
                                                              )}
                                                            </td>
                                                          )}
                                                          {packageCount ==
                                                            3 && (
                                                            <td
                                                              style={{
                                                                fontWeight:
                                                                  getFontStyles(
                                                                    2,
                                                                    "Index"
                                                                  ).fontWeight,
                                                                fontSize:
                                                                  getFontStyles(
                                                                    2,
                                                                    "Index"
                                                                  ).fontSize,
                                                              }}
                                                              className="tr-table-class text-white text-right"
                                                            >
                                                              {" "}
                                                              {formatValue(
                                                                OneOffPricingInfo.PackageThreeGrandTotal
                                                              )}
                                                            </td>
                                                          )}
                                                        </tr>
                                                      </>
                                                    )}
                                                  </table>
                                                </div>
                                              ) : (
                                                <div
                                                  style={{ marginTop: "0px" }}
                                                  className="table-responsive"
                                                >
                                                  {/* <div
                                                                          dangerouslySetInnerHTML={{
                                                                            __html: currentPricingTableDesignRecurring,
                                                                          }}
                                                                        /> */}
                                                  <table
                                                    class="table align-middle table-nowrap"
                                                    style={{ width: "100%" }}
                                                  >
                                                    <thead className="table-light table-header-font">
                                                      <tr className="head-row">
                                                        <td></td>
                                                        {selectedPackagesList.map(
                                                          (pkg, index) => (
                                                            <>
                                                              <td
                                                                key={index}
                                                                className="tr-table-class font-14 text-white text-right"
                                                              >
                                                                {pkg
                                                                  .servicePackageName
                                                                  .length >
                                                                10 ? (
                                                                  <Tooltip
                                                                    title={
                                                                      pkg.servicePackageName
                                                                    }
                                                                  >
                                                                    {pkg.servicePackageName
                                                                      .substring(
                                                                        0,
                                                                        10
                                                                      )
                                                                      .toLowerCase()
                                                                      .replace(
                                                                        /\b\w/g,
                                                                        (l) =>
                                                                          l.toUpperCase()
                                                                      ) + "..."}
                                                                  </Tooltip>
                                                                ) : pkg
                                                                    .servicePackageName
                                                                    .length >
                                                                  10 ? (
                                                                  <Tooltip
                                                                    title={
                                                                      pkg.servicePackageName
                                                                    }
                                                                  >
                                                                    {pkg.servicePackageName.substring(
                                                                      0,
                                                                      10
                                                                    ) + "..."}
                                                                  </Tooltip>
                                                                ) : (
                                                                  pkg.servicePackageName
                                                                )}
                                                              </td>
                                                              {visibleFieldsCustomTemp.vat && (
                                                                <td></td>
                                                              )}
                                                              {visibleFieldsCustomTemp.serviceScope && (
                                                                <td></td>
                                                              )}
                                                            </>
                                                          )
                                                        )}
                                                      </tr>
                                                      <tr className="head-row">
                                                        {visibleFieldsCustomTemp.serviceName && (
                                                          <td className="tr-table-class font-14 text-white">
                                                            Services
                                                          </td>
                                                        )}
                                                        {selectedPackagesList.map(
                                                          (pkg, index) => (
                                                            <>
                                                              {/* <td
                                                                 key={index}
                                                                 className="tr-table-class font-14 text-white text-right"
                                                               >
                                                                 {pkg.servicePackageName.length > 10 ? (
                                                                   <Tooltip title={pkg.servicePackageName}>
                                                                     {pkg.servicePackageName
                                                                       .substring(0, 10)
                                                                       .toLowerCase()
                                                                       .replace(/\b\w/g, (l) => l.toUpperCase()) + "..."}
                                                                   </Tooltip>
                                                                 ) : pkg.servicePackageName.length > 10 ? (
                                                                   <Tooltip title={pkg.servicePackageName}>
                                                                     {pkg.servicePackageName.substring(0, 10) + "..."}
                                                                   </Tooltip>
                                                                 ) : (
                                                                   pkg.servicePackageName
                                                                 )}
                                                               </td> */}

                                                              <th
                                                                className="tr-table-class text-white text-right"
                                                                style={{
                                                                  width:
                                                                    "16.66%",
                                                                }}
                                                              >
                                                                Fees (£)
                                                              </th>
                                                              {visibleFieldsCustomTemp.vat && (
                                                                <th
                                                                  className="tr-table-class text-white text-right"
                                                                  style={{
                                                                    width:
                                                                      "16.66%",
                                                                  }}
                                                                >
                                                                  VAT (£)
                                                                </th>
                                                              )}

                                                              {visibleFieldsCustomTemp.serviceScope && (
                                                                <th
                                                                  className="tr-table-class text-white text-right"
                                                                  style={{
                                                                    width:
                                                                      "16.66%",
                                                                  }}
                                                                >
                                                                  Service Scope
                                                                </th>
                                                              )}
                                                            </>
                                                          )
                                                        )}
                                                      </tr>
                                                    </thead>
                                                    <tbody>
                                                      {selectedOneOffServiceList.map(
                                                        (service, index) => {
                                                          return (
                                                            <>
                                                              <tr className="a-la-carte-services-review-head-row">
                                                                {visibleFieldsCustomTemp.serviceName && (
                                                                  <th
                                                                    colSpan={
                                                                      1 +
                                                                      packageCount
                                                                    }
                                                                  >
                                                                    {
                                                                      service.serviceCatName
                                                                    }
                                                                  </th>
                                                                )}

                                                                {/* <th></th> */}
                                                                {visibleFieldsCustomTemp.vat && (
                                                                  <th></th>
                                                                )}
                                                                {visibleFieldsCustomTemp.serviceScope && (
                                                                  <th></th>
                                                                )}
                                                                {packageCount >=
                                                                  2 && (
                                                                  <>
                                                                    {visibleFieldsCustomTemp.vat && (
                                                                      <th></th>
                                                                    )}
                                                                    {visibleFieldsCustomTemp.serviceScope && (
                                                                      <th></th>
                                                                    )}
                                                                  </>
                                                                )}

                                                                {packageCount ===
                                                                  3 && (
                                                                  <>
                                                                    {visibleFieldsCustomTemp.vat && (
                                                                      <th></th>
                                                                    )}
                                                                    {visibleFieldsCustomTemp.serviceScope && (
                                                                      <th></th>
                                                                    )}
                                                                  </>
                                                                )}
                                                              </tr>
                                                              {service.servicesList.map(
                                                                (
                                                                  subService,
                                                                  subIndex
                                                                ) => {
                                                                  const driverList =
                                                                    subService.pricingDriverList ||
                                                                    [];
                                                                  return (
                                                                    <tr
                                                                      key={
                                                                        subIndex
                                                                      }
                                                                      className={` ${
                                                                        subService?.isAdditionalService !==
                                                                        null
                                                                          ? "bg-info  text-white"
                                                                          : ""
                                                                      }`}
                                                                    >
                                                                      {visibleFieldsCustomTemp.serviceName && (
                                                                        <td>
                                                                          <div>
                                                                            {subService
                                                                              .serviceName
                                                                              .length >
                                                                            45 ? (
                                                                              <Tooltip
                                                                                title={
                                                                                  subService.serviceName
                                                                                }
                                                                              >
                                                                                {subService.serviceName
                                                                                  .substring(
                                                                                    0,
                                                                                    45
                                                                                  )
                                                                                  .toLowerCase()
                                                                                  .replace(
                                                                                    /\b\w/g,
                                                                                    (
                                                                                      l
                                                                                    ) =>
                                                                                      l.toUpperCase()
                                                                                  ) +
                                                                                  "..."}
                                                                              </Tooltip>
                                                                            ) : (
                                                                              subService.serviceName
                                                                            )}
                                                                          </div>
                                                                          <div className="package-variables"></div>
                                                                        </td>
                                                                      )}

                                                                      <td className="text-right">
                                                                        <div className="flex-end-item">
                                                                          {ProposalObject.feeTypeId ===
                                                                          1 ? (
                                                                            <div>
                                                                              {(subService.packageOneValue ===
                                                                                0 ||
                                                                                subService.packageOneValue ===
                                                                                  null) &&
                                                                              !subService.servicePackageIDs.some(
                                                                                (
                                                                                  item
                                                                                ) =>
                                                                                  item ==
                                                                                  selectedPackagesList[0]
                                                                                    .servicePackageID
                                                                              ) ? (
                                                                                <span className="fa fa-times"></span>
                                                                              ) : !subService?.servicePackageIDs.includes(
                                                                                  subService.packageOneID
                                                                                ) ? (
                                                                                <span className="fa fa-times"></span>
                                                                              ) : (
                                                                                ` ${formatValue(
                                                                                  subService.packageOneValue
                                                                                )}`
                                                                              )}
                                                                            </div>
                                                                          ) : Number(
                                                                              subService.packageOneValue
                                                                            ) !==
                                                                              null &&
                                                                            subService?.servicePackageIDs.includes(
                                                                              subService.packageOneID
                                                                            ) ? (
                                                                            <span className="fa fa-check"></span>
                                                                          ) : (
                                                                            <span className="fa fa-times"></span>
                                                                          )}
                                                                          {subService?.isAdditionalService !==
                                                                          null ? (
                                                                            <input
                                                                              style={{
                                                                                marginLeft:
                                                                                  "5px",
                                                                              }}
                                                                              disabled={
                                                                                subService?.servicePackageIDs.includes(
                                                                                  subService.packageOneID
                                                                                ) &&
                                                                                subService
                                                                                  ?.servicePackageIDs
                                                                                  .length ===
                                                                                  1
                                                                              }
                                                                              type="checkbox"
                                                                              checked={subService?.servicePackageIDs.includes(
                                                                                subService.packageOneID
                                                                              )}
                                                                              onChange={(
                                                                                e
                                                                              ) =>
                                                                                handleAddAndRemoveAdditionalServices(
                                                                                  1,
                                                                                  service.serviceCatID,
                                                                                  subService.serviceID,
                                                                                  subService.packageOneID,
                                                                                  e
                                                                                    .target
                                                                                    .checked
                                                                                )
                                                                              }
                                                                            />
                                                                          ) : (
                                                                            <div>
                                                                              &nbsp;&nbsp;
                                                                            </div>
                                                                          )}
                                                                        </div>
                                                                      </td>

                                                                      {/* VAT */}

                                                                      {visibleFieldsCustomTemp.vat && (
                                                                        <>
                                                                          {/* Package One */}
                                                                          <td className="text-right">
                                                                            <div className="flex-end-item">
                                                                              {ProposalObject.feeTypeId ===
                                                                              1 ? (
                                                                                (subService.packageOneValue ===
                                                                                  0 ||
                                                                                  subService.packageOneValue ===
                                                                                    null) &&
                                                                                !subService.servicePackageIDs.some(
                                                                                  (
                                                                                    item
                                                                                  ) =>
                                                                                    item ===
                                                                                    selectedPackagesList[0]
                                                                                      .servicePackageID
                                                                                ) ? (
                                                                                  <span className="fa fa-times"></span>
                                                                                ) : !subService?.servicePackageIDs.includes(
                                                                                    subService.packageOneID
                                                                                  ) ? (
                                                                                  <span className="fa fa-times"></span>
                                                                                ) : (
                                                                                  ` ${formatValue(
                                                                                    (subService.packageOneValue *
                                                                                      20) /
                                                                                      100
                                                                                  )}`
                                                                                )
                                                                              ) : Number(
                                                                                  subService.packageOneValue
                                                                                ) !==
                                                                                  null &&
                                                                                subService?.servicePackageIDs.includes(
                                                                                  subService.packageOneID
                                                                                ) ? (
                                                                                <span className="fa fa-check"></span>
                                                                              ) : (
                                                                                <span className="fa fa-times"></span>
                                                                              )}

                                                                              {subService?.isAdditionalService !==
                                                                              null ? (
                                                                                <input
                                                                                  style={{
                                                                                    marginLeft:
                                                                                      "5px",
                                                                                  }}
                                                                                  type="checkbox"
                                                                                  disabled={
                                                                                    subService?.servicePackageIDs.includes(
                                                                                      subService.packageOneID
                                                                                    ) &&
                                                                                    subService
                                                                                      ?.servicePackageIDs
                                                                                      .length ===
                                                                                      1
                                                                                  }
                                                                                  checked={subService?.servicePackageIDs.includes(
                                                                                    subService.packageOneID
                                                                                  )}
                                                                                  onChange={(
                                                                                    e
                                                                                  ) =>
                                                                                    handleAddAndRemoveAdditionalServices(
                                                                                      1,
                                                                                      service.serviceCatID,
                                                                                      subService.serviceID,
                                                                                      subService.packageOneID,
                                                                                      e
                                                                                        .target
                                                                                        .checked
                                                                                    )
                                                                                  }
                                                                                />
                                                                              ) : (
                                                                                <div>
                                                                                  &nbsp;&nbsp;
                                                                                </div>
                                                                              )}
                                                                            </div>
                                                                          </td>

                                                                          {/* Package Two */}
                                                                          {/* {packageCount >= 2 && (
                                                                           <>
                                                                             <td className="text-right">
                                                                               <div className="flex-end-item">
                                                                                 {ProposalObject.feeTypeId === 1 ? (
                                                                                   (subService.packageTwoValue === 0 ||
                                                                                     subService.packageTwoValue ===
                                                                                       null) &&
                                                                                   !subService.servicePackageIDs.some(
                                                                                     (item) =>
                                                                                       item ===
                                                                                       selectedPackagesList[1]
                                                                                         .servicePackageID
                                                                                   ) ? (
                                                                                     <span className="fa fa-times"></span>
                                                                                   ) : !subService?.servicePackageIDs.includes(
                                                                                       subService.packageTwoID
                                                                                     ) ? (
                                                                                     <span className="fa fa-times"></span>
                                                                                   ) : (
                                                                                     ` ${formatValue(
                                                                                       subService.packageTwoValue
                                                                                     )}`
                                                                                   )
                                                                                 ) : Number(
                                                                                     subService.packageTwoValue
                                                                                   ) !== null &&
                                                                                   subService?.servicePackageIDs.includes(
                                                                                     subService.packageTwoID
                                                                                   ) ? (
                                                                                   <span className="fa fa-check"></span>
                                                                                 ) : (
                                                                                   <span className="fa fa-times"></span>
                                                                                 )}
                                         
                                                                                 {subService?.isAdditionalService !==
                                                                                 null ? (
                                                                                   <input
                                                                                     style={{ marginLeft: "5px" }}
                                                                                     type="checkbox"
                                                                                     disabled={
                                                                                       subService?.servicePackageIDs.includes(
                                                                                         subService.packageTwoID
                                                                                       ) &&
                                                                                       subService?.servicePackageIDs
                                                                                         .length === 1
                                                                                     }
                                                                                     checked={subService?.servicePackageIDs.includes(
                                                                                       subService.packageTwoID
                                                                                     )}
                                                                                     onChange={(e) =>
                                                                                       handleAddAndRemoveAdditionalServices(
                                                                                         1,
                                                                                         service.serviceCatID,
                                                                                         subService.serviceID,
                                                                                         subService.packageTwoID,
                                                                                         e.target.checked
                                                                                       )
                                                                                     }
                                                                                   />
                                                                                 ) : (
                                                                                   <div>&nbsp;&nbsp;</div>
                                                                                 )}
                                                                               </div>
                                                                             </td>
                                         
                                                                             <td className="text-right">
                                                                               <div className="flex-end-item">
                                                                                 {ProposalObject.feeTypeId === 1 ? (
                                                                                   (subService.packageTwoValue === 0 ||
                                                                                     subService.packageTwoValue ===
                                                                                       null) &&
                                                                                   !subService.servicePackageIDs.some(
                                                                                     (item) =>
                                                                                       item ===
                                                                                       selectedPackagesList[1]
                                                                                         .servicePackageID
                                                                                   ) ? (
                                                                                     <span className="fa fa-times"></span>
                                                                                   ) : !subService?.servicePackageIDs.includes(
                                                                                       subService.packageTwoID
                                                                                     ) ? (
                                                                                     <span className="fa fa-times"></span>
                                                                                   ) : (
                                                                                     ` ${formatValue(
                                                                                       (subService.packageTwoValue *
                                                                                         20) /
                                                                                         100
                                                                                     )}`
                                                                                   )
                                                                                 ) : Number(
                                                                                     subService.packageTwoValue
                                                                                   ) !== null &&
                                                                                   subService?.servicePackageIDs.includes(
                                                                                     subService.packageTwoID
                                                                                   ) ? (
                                                                                   <span className="fa fa-check"></span>
                                                                                 ) : (
                                                                                   <span className="fa fa-times"></span>
                                                                                 )}
                                         
                                                                                 {subService?.isAdditionalService !==
                                                                                 null ? (
                                                                                   <input
                                                                                     style={{ marginLeft: "5px" }}
                                                                                     type="checkbox"
                                                                                     disabled={
                                                                                       subService?.servicePackageIDs.includes(
                                                                                         subService.packageTwoID
                                                                                       ) &&
                                                                                       subService?.servicePackageIDs
                                                                                         .length === 1
                                                                                     }
                                                                                     checked={subService?.servicePackageIDs.includes(
                                                                                       subService.packageTwoID
                                                                                     )}
                                                                                     onChange={(e) =>
                                                                                       handleAddAndRemoveAdditionalServices(
                                                                                         1,
                                                                                         service.serviceCatID,
                                                                                         subService.serviceID,
                                                                                         subService.packageTwoID,
                                                                                         e.target.checked
                                                                                       )
                                                                                     }
                                                                                   />
                                                                                 ) : (
                                                                                   <div>&nbsp;&nbsp;</div>
                                                                                 )}
                                                                               </div>
                                                                             </td>
                                                                           </>
                                                                         )} */}

                                                                          {/* Package Three */}
                                                                          {/* {packageCount === 3 && (
                                                                           <>
                                                                             <td className="text-right">
                                                                               <div className="flex-end-item">
                                                                                 {ProposalObject.feeTypeId === 1 ? (
                                                                                   (subService.packageThreeValue === 0 ||
                                                                                     subService.packageThreeValue ===
                                                                                       null) &&
                                                                                   !subService.servicePackageIDs.some(
                                                                                     (item) =>
                                                                                       item ===
                                                                                       selectedPackagesList[2]
                                                                                         .servicePackageID
                                                                                   ) ? (
                                                                                     <span className="fa fa-times"></span>
                                                                                   ) : !subService?.servicePackageIDs.includes(
                                                                                       subService.packageThreeID
                                                                                     ) ? (
                                                                                     <span className="fa fa-times"></span>
                                                                                   ) : (
                                                                                     ` ${formatValue(
                                                                                       subService.packageThreeValue
                                                                                     )}`
                                                                                   )
                                                                                 ) : Number(
                                                                                     subService.packageThreeValue
                                                                                   ) !== null &&
                                                                                   subService?.servicePackageIDs.includes(
                                                                                     subService.packageThreeID
                                                                                   ) ? (
                                                                                   <span className="fa fa-check"></span>
                                                                                 ) : (
                                                                                   <span className="fa fa-times"></span>
                                                                                 )}
                                         
                                                                                 {subService?.isAdditionalService !==
                                                                                 null ? (
                                                                                   <input
                                                                                     style={{ marginLeft: "5px" }}
                                                                                     type="checkbox"
                                                                                     disabled={
                                                                                       subService?.servicePackageIDs.includes(
                                                                                         subService.packageThreeID
                                                                                       ) &&
                                                                                       subService?.servicePackageIDs
                                                                                         .length === 1
                                                                                     }
                                                                                     checked={subService?.servicePackageIDs.includes(
                                                                                       subService.packageThreeID
                                                                                     )}
                                                                                     onChange={(e) =>
                                                                                       handleAddAndRemoveAdditionalServices(
                                                                                         1,
                                                                                         service.serviceCatID,
                                                                                         subService.serviceID,
                                                                                         subService.packageThreeID,
                                                                                         e.target.checked
                                                                                       )
                                                                                     }
                                                                                   />
                                                                                 ) : (
                                                                                   <div>&nbsp;&nbsp;</div>
                                                                                 )}
                                                                               </div>
                                                                             </td>
                                         
                                                                             <td className="text-right">
                                                                               <div className="flex-end-item">
                                                                                 {ProposalObject.feeTypeId === 1 ? (
                                                                                   (subService.packageThreeValue === 0 ||
                                                                                     subService.packageThreeValue ===
                                                                                       null) &&
                                                                                   !subService.servicePackageIDs.some(
                                                                                     (item) =>
                                                                                       item ===
                                                                                       selectedPackagesList[2]
                                                                                         .servicePackageID
                                                                                   ) ? (
                                                                                     <span className="fa fa-times"></span>
                                                                                   ) : !subService?.servicePackageIDs.includes(
                                                                                       subService.packageThreeID
                                                                                     ) ? (
                                                                                     <span className="fa fa-times"></span>
                                                                                   ) : (
                                                                                     ` ${formatValue(
                                                                                       (subService.packageThreeValue *
                                                                                         20) /
                                                                                         100
                                                                                     )}`
                                                                                   )
                                                                                 ) : Number(
                                                                                     subService.packageThreeValue
                                                                                   ) !== null &&
                                                                                   subService?.servicePackageIDs.includes(
                                                                                     subService.packageThreeID
                                                                                   ) ? (
                                                                                   <span className="fa fa-check"></span>
                                                                                 ) : (
                                                                                   <span className="fa fa-times"></span>
                                                                                 )}
                                         
                                                                                 {subService?.isAdditionalService !==
                                                                                 null ? (
                                                                                   <input
                                                                                     style={{ marginLeft: "5px" }}
                                                                                     type="checkbox"
                                                                                     disabled={
                                                                                       subService?.servicePackageIDs.includes(
                                                                                         subService.packageThreeID
                                                                                       ) &&
                                                                                       subService?.servicePackageIDs
                                                                                         .length === 1
                                                                                     }
                                                                                     checked={subService?.servicePackageIDs.includes(
                                                                                       subService.packageThreeID
                                                                                     )}
                                                                                     onChange={(e) =>
                                                                                       handleAddAndRemoveAdditionalServices(
                                                                                         1,
                                                                                         service.serviceCatID,
                                                                                         subService.serviceID,
                                                                                         subService.packageThreeID,
                                                                                         e.target.checked
                                                                                       )
                                                                                     }
                                                                                   />
                                                                                 ) : (
                                                                                   <div>&nbsp;&nbsp;</div>
                                                                                 )}
                                                                               </div>
                                                                             </td>
                                                                           </>
                                                                         )} */}
                                                                        </>
                                                                      )}

                                                                      {/* Service Scope */}

                                                                      {visibleFieldsCustomTemp.serviceScope && (
                                                                        <>
                                                                          {/* Package One */}
                                                                          <td className="text-right">
                                                                            {driverList.length >
                                                                            0
                                                                              ? driverList
                                                                                  .filter(
                                                                                    (
                                                                                      d
                                                                                    ) =>
                                                                                      d.driverValue !==
                                                                                      null
                                                                                  )
                                                                                  .map(
                                                                                    (
                                                                                      d,
                                                                                      i,
                                                                                      arr
                                                                                    ) => (
                                                                                      <div
                                                                                        key={
                                                                                          i
                                                                                        }
                                                                                      >
                                                                                        {(subService.packageOneValue ===
                                                                                          0 ||
                                                                                          subService.packageOneValue ===
                                                                                            null) &&
                                                                                        !subService.servicePackageIDs.some(
                                                                                          (
                                                                                            item
                                                                                          ) =>
                                                                                            item ===
                                                                                            selectedPackagesList[0]
                                                                                              .servicePackageID
                                                                                        ) ? (
                                                                                          <span>
                                                                                            -
                                                                                          </span>
                                                                                        ) : !subService?.servicePackageIDs.includes(
                                                                                            subService.packageOneID
                                                                                          ) ? (
                                                                                          <span>
                                                                                            -
                                                                                          </span>
                                                                                        ) : (
                                                                                          ` ${
                                                                                            d.driverName
                                                                                          } = ${
                                                                                            d.driverValue
                                                                                          }${
                                                                                            i !==
                                                                                            arr.length -
                                                                                              1
                                                                                              ? ", "
                                                                                              : ""
                                                                                          }`
                                                                                        )}
                                                                                      </div>
                                                                                    )
                                                                                  )
                                                                              : "-"}
                                                                          </td>
                                                                        </>
                                                                      )}

                                                                      {/* Package Two */}
                                                                      {packageCount >=
                                                                        2 && (
                                                                        <>
                                                                          <td className="text-right">
                                                                            <div className="flex-end-item">
                                                                              {ProposalObject.feeTypeId ===
                                                                              1 ? (
                                                                                <div>
                                                                                  {(subService.packageTwoValue ===
                                                                                    0 ||
                                                                                    subService.packageTwoValue ===
                                                                                      null) &&
                                                                                  !subService.servicePackageIDs.some(
                                                                                    (
                                                                                      item
                                                                                    ) =>
                                                                                      item ==
                                                                                      selectedPackagesList[0]
                                                                                        .servicePackageID
                                                                                  ) ? (
                                                                                    <span className="fa fa-times"></span>
                                                                                  ) : !subService?.servicePackageIDs.includes(
                                                                                      subService.packageTwoID
                                                                                    ) ? (
                                                                                    <span className="fa fa-times"></span>
                                                                                  ) : (
                                                                                    ` ${formatValue(
                                                                                      subService.packageTwoValue
                                                                                    )}`
                                                                                  )}
                                                                                </div>
                                                                              ) : Number(
                                                                                  subService.packageTwoValue
                                                                                ) !==
                                                                                  null &&
                                                                                subService?.servicePackageIDs.includes(
                                                                                  subService.packageTwoID
                                                                                ) ? (
                                                                                <span className="fa fa-check"></span>
                                                                              ) : (
                                                                                <span className="fa fa-times"></span>
                                                                              )}
                                                                              {subService?.isAdditionalService !==
                                                                              null ? (
                                                                                <input
                                                                                  style={{
                                                                                    marginLeft:
                                                                                      "5px",
                                                                                  }}
                                                                                  disabled={
                                                                                    subService?.servicePackageIDs.includes(
                                                                                      subService.packageTwoID
                                                                                    ) &&
                                                                                    subService
                                                                                      ?.servicePackageIDs
                                                                                      .length ===
                                                                                      1
                                                                                  }
                                                                                  type="checkbox"
                                                                                  checked={subService?.servicePackageIDs.includes(
                                                                                    subService.packageTwoID
                                                                                  )}
                                                                                  onChange={(
                                                                                    e
                                                                                  ) =>
                                                                                    handleAddAndRemoveAdditionalServices(
                                                                                      1,
                                                                                      service.serviceCatID,
                                                                                      subService.serviceID,
                                                                                      subService.packageOneID,
                                                                                      e
                                                                                        .target
                                                                                        .checked
                                                                                    )
                                                                                  }
                                                                                />
                                                                              ) : (
                                                                                <div>
                                                                                  &nbsp;&nbsp;
                                                                                </div>
                                                                              )}
                                                                            </div>
                                                                          </td>
                                                                          {visibleFieldsCustomTemp.vat && (
                                                                            <td className="text-right">
                                                                              <div className="flex-end-item">
                                                                                {ProposalObject.feeTypeId ===
                                                                                1 ? (
                                                                                  (subService.packageTwoValue ===
                                                                                    0 ||
                                                                                    subService.packageTwoValue ===
                                                                                      null) &&
                                                                                  !subService.servicePackageIDs.some(
                                                                                    (
                                                                                      item
                                                                                    ) =>
                                                                                      item ===
                                                                                      selectedPackagesList[0]
                                                                                        .servicePackageID
                                                                                  ) ? (
                                                                                    <span className="fa fa-times"></span>
                                                                                  ) : !subService?.servicePackageIDs.includes(
                                                                                      subService.packageTwoID
                                                                                    ) ? (
                                                                                    <span className="fa fa-times"></span>
                                                                                  ) : (
                                                                                    ` ${formatValue(
                                                                                      (subService.packageTwoValue *
                                                                                        20) /
                                                                                        100
                                                                                    )}`
                                                                                  )
                                                                                ) : Number(
                                                                                    subService.packageTwoValue
                                                                                  ) !==
                                                                                    null &&
                                                                                  subService?.servicePackageIDs.includes(
                                                                                    subService.packageTwoID
                                                                                  ) ? (
                                                                                  <span className="fa fa-check"></span>
                                                                                ) : (
                                                                                  <span className="fa fa-times"></span>
                                                                                )}

                                                                                {subService?.isAdditionalService !==
                                                                                null ? (
                                                                                  <input
                                                                                    style={{
                                                                                      marginLeft:
                                                                                        "5px",
                                                                                    }}
                                                                                    type="checkbox"
                                                                                    disabled={
                                                                                      subService?.servicePackageIDs.includes(
                                                                                        subService.packageTwoID
                                                                                      ) &&
                                                                                      subService
                                                                                        ?.servicePackageIDs
                                                                                        .length ===
                                                                                        1
                                                                                    }
                                                                                    checked={subService?.servicePackageIDs.includes(
                                                                                      subService.packageTwoID
                                                                                    )}
                                                                                    onChange={(
                                                                                      e
                                                                                    ) =>
                                                                                      handleAddAndRemoveAdditionalServices(
                                                                                        1,
                                                                                        service.serviceCatID,
                                                                                        subService.serviceID,
                                                                                        subService.packageOneID,
                                                                                        e
                                                                                          .target
                                                                                          .checked
                                                                                      )
                                                                                    }
                                                                                  />
                                                                                ) : (
                                                                                  <div>
                                                                                    &nbsp;&nbsp;
                                                                                  </div>
                                                                                )}
                                                                              </div>
                                                                            </td>
                                                                          )}
                                                                          {visibleFieldsCustomTemp.serviceScope && (
                                                                            <td className="text-right">
                                                                              {driverList.length >
                                                                              0
                                                                                ? driverList
                                                                                    .filter(
                                                                                      (
                                                                                        d
                                                                                      ) =>
                                                                                        d.driverValue !==
                                                                                        null
                                                                                    )
                                                                                    .map(
                                                                                      (
                                                                                        d,
                                                                                        i,
                                                                                        arr
                                                                                      ) => (
                                                                                        <div
                                                                                          key={
                                                                                            i
                                                                                          }
                                                                                        >
                                                                                          {(subService.packageTwoValue ===
                                                                                            0 ||
                                                                                            subService.packageTwoValue ===
                                                                                              null) &&
                                                                                          !subService.servicePackageIDs.some(
                                                                                            (
                                                                                              item
                                                                                            ) =>
                                                                                              item ===
                                                                                              selectedPackagesList[0]
                                                                                                .servicePackageID
                                                                                          ) ? (
                                                                                            <span>
                                                                                              -
                                                                                            </span>
                                                                                          ) : !subService?.servicePackageIDs.includes(
                                                                                              subService.packageTwoID
                                                                                            ) ? (
                                                                                            <span>
                                                                                              -
                                                                                            </span>
                                                                                          ) : (
                                                                                            ` ${
                                                                                              d.driverName
                                                                                            } = ${
                                                                                              d.driverValue
                                                                                            }${
                                                                                              i !==
                                                                                              arr.length -
                                                                                                1
                                                                                                ? ", "
                                                                                                : ""
                                                                                            }`
                                                                                          )}
                                                                                        </div>
                                                                                      )
                                                                                    )
                                                                                : "-"}
                                                                            </td>
                                                                          )}
                                                                        </>
                                                                      )}
                                                                      {/* Package Three */}
                                                                      {packageCount ===
                                                                        3 && (
                                                                        <>
                                                                          <td className="text-right">
                                                                            <div className="flex-end-item">
                                                                              {ProposalObject.feeTypeId ===
                                                                              1 ? (
                                                                                <div>
                                                                                  {(subService.packageThreeValue ===
                                                                                    0 ||
                                                                                    subService.packageThreeValue ===
                                                                                      null) &&
                                                                                  !subService.servicePackageIDs.some(
                                                                                    (
                                                                                      item
                                                                                    ) =>
                                                                                      item ==
                                                                                      selectedPackagesList[0]
                                                                                        .servicePackageID
                                                                                  ) ? (
                                                                                    <span className="fa fa-times"></span>
                                                                                  ) : !subService?.servicePackageIDs.includes(
                                                                                      subService.packageThreeID
                                                                                    ) ? (
                                                                                    <span className="fa fa-times"></span>
                                                                                  ) : (
                                                                                    ` ${formatValue(
                                                                                      subService.packageThreeValue
                                                                                    )}`
                                                                                  )}
                                                                                </div>
                                                                              ) : Number(
                                                                                  subService.packageThreeValue
                                                                                ) !==
                                                                                  null &&
                                                                                subService?.servicePackageIDs.includes(
                                                                                  subService.packageThreeID
                                                                                ) ? (
                                                                                <span className="fa fa-check"></span>
                                                                              ) : (
                                                                                <span className="fa fa-times"></span>
                                                                              )}
                                                                              {subService?.isAdditionalService !==
                                                                              null ? (
                                                                                <input
                                                                                  style={{
                                                                                    marginLeft:
                                                                                      "5px",
                                                                                  }}
                                                                                  disabled={
                                                                                    subService?.servicePackageIDs.includes(
                                                                                      subService.packageThreeID
                                                                                    ) &&
                                                                                    subService
                                                                                      ?.servicePackageIDs
                                                                                      .length ===
                                                                                      1
                                                                                  }
                                                                                  type="checkbox"
                                                                                  checked={subService?.servicePackageIDs.includes(
                                                                                    subService.packageThreeID
                                                                                  )}
                                                                                  onChange={(
                                                                                    e
                                                                                  ) =>
                                                                                    handleAddAndRemoveAdditionalServices(
                                                                                      1,
                                                                                      service.serviceCatID,
                                                                                      subService.serviceID,
                                                                                      subService.packageOneID,
                                                                                      e
                                                                                        .target
                                                                                        .checked
                                                                                    )
                                                                                  }
                                                                                />
                                                                              ) : (
                                                                                <div>
                                                                                  &nbsp;&nbsp;
                                                                                </div>
                                                                              )}
                                                                            </div>
                                                                          </td>

                                                                          {visibleFieldsCustomTemp.vat && (
                                                                            <td className="text-right">
                                                                              <div className="flex-end-item">
                                                                                {ProposalObject.feeTypeId ===
                                                                                1 ? (
                                                                                  (subService.packageThreeValue ===
                                                                                    0 ||
                                                                                    subService.packageThreeValue ===
                                                                                      null) &&
                                                                                  !subService.servicePackageIDs.some(
                                                                                    (
                                                                                      item
                                                                                    ) =>
                                                                                      item ===
                                                                                      selectedPackagesList[0]
                                                                                        .servicePackageID
                                                                                  ) ? (
                                                                                    <span className="fa fa-times"></span>
                                                                                  ) : !subService?.servicePackageIDs.includes(
                                                                                      subService.packageThreeID
                                                                                    ) ? (
                                                                                    <span className="fa fa-times"></span>
                                                                                  ) : (
                                                                                    ` ${formatValue(
                                                                                      (subService.packageThreeValue *
                                                                                        20) /
                                                                                        100
                                                                                    )}`
                                                                                  )
                                                                                ) : Number(
                                                                                    subService.packageThreeValue
                                                                                  ) !==
                                                                                    null &&
                                                                                  subService?.servicePackageIDs.includes(
                                                                                    subService.packageThreeID
                                                                                  ) ? (
                                                                                  <span className="fa fa-check"></span>
                                                                                ) : (
                                                                                  <span className="fa fa-times"></span>
                                                                                )}

                                                                                {subService?.isAdditionalService !==
                                                                                null ? (
                                                                                  <input
                                                                                    style={{
                                                                                      marginLeft:
                                                                                        "5px",
                                                                                    }}
                                                                                    type="checkbox"
                                                                                    disabled={
                                                                                      subService?.servicePackageIDs.includes(
                                                                                        subService.packageThreeID
                                                                                      ) &&
                                                                                      subService
                                                                                        ?.servicePackageIDs
                                                                                        .length ===
                                                                                        1
                                                                                    }
                                                                                    checked={subService?.servicePackageIDs.includes(
                                                                                      subService.packageThreeID
                                                                                    )}
                                                                                    onChange={(
                                                                                      e
                                                                                    ) =>
                                                                                      handleAddAndRemoveAdditionalServices(
                                                                                        1,
                                                                                        service.serviceCatID,
                                                                                        subService.serviceID,
                                                                                        subService.packageOneID,
                                                                                        e
                                                                                          .target
                                                                                          .checked
                                                                                      )
                                                                                    }
                                                                                  />
                                                                                ) : (
                                                                                  <div>
                                                                                    &nbsp;&nbsp;
                                                                                  </div>
                                                                                )}
                                                                              </div>
                                                                            </td>
                                                                          )}

                                                                          {visibleFieldsCustomTemp.serviceScope && (
                                                                            <td className="text-right">
                                                                              {driverList.length >
                                                                              0
                                                                                ? driverList
                                                                                    .filter(
                                                                                      (
                                                                                        d
                                                                                      ) =>
                                                                                        d.driverValue !==
                                                                                        null
                                                                                    )
                                                                                    .map(
                                                                                      (
                                                                                        d,
                                                                                        i,
                                                                                        arr
                                                                                      ) => (
                                                                                        <div
                                                                                          key={
                                                                                            i
                                                                                          }
                                                                                        >
                                                                                          {(subService.packageThreeValue ===
                                                                                            0 ||
                                                                                            subService.packageThreeValue ===
                                                                                              null) &&
                                                                                          !subService.servicePackageIDs.some(
                                                                                            (
                                                                                              item
                                                                                            ) =>
                                                                                              item ===
                                                                                              selectedPackagesList[0]
                                                                                                .servicePackageID
                                                                                          ) ? (
                                                                                            <span>
                                                                                              -
                                                                                            </span>
                                                                                          ) : !subService?.servicePackageIDs.includes(
                                                                                              subService.packageThreeID
                                                                                            ) ? (
                                                                                            <span>
                                                                                              -
                                                                                            </span>
                                                                                          ) : (
                                                                                            ` ${
                                                                                              d.driverName
                                                                                            } = ${
                                                                                              d.driverValue
                                                                                            }${
                                                                                              i !==
                                                                                              arr.length -
                                                                                                1
                                                                                                ? ", "
                                                                                                : ""
                                                                                            }`
                                                                                          )}
                                                                                        </div>
                                                                                      )
                                                                                    )
                                                                                : "-"}
                                                                            </td>
                                                                          )}
                                                                        </>
                                                                      )}
                                                                    </tr>
                                                                  );
                                                                }
                                                              )}
                                                            </>
                                                          );
                                                        }
                                                      )}
                                                    </tbody>
                                                    {packageCount > 1 && (
                                                      <>
                                                        <tr id="recurring_DefaultWithPackages">
                                                          <td
                                                            style={{
                                                              padding: "8px",
                                                            }}
                                                          >
                                                            Discount (%)
                                                          </td>

                                                          <td
                                                            style={{
                                                              width: "35%",
                                                              padding: "0px",
                                                              whiteSpace:
                                                                "normal",
                                                            }}
                                                          >
                                                            <div
                                                              style={{
                                                                display: "flex",
                                                                flexDirection:
                                                                  "column",
                                                                alignItems:
                                                                  "flex-start",
                                                              }}
                                                            >
                                                              <input
                                                                className="input-text"
                                                                type="text"
                                                                placeholder="Discount (%)"
                                                                value={OneOffPricingInfo.DiscountPercentagePackageOne?.toString()?.replace(
                                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                                  ","
                                                                )}
                                                                onChange={(
                                                                  e
                                                                ) => {
                                                                  handleOneOffPackageOneDiscountPercentage(
                                                                    e
                                                                  );
                                                                }}
                                                                style={{
                                                                  width: "100%",
                                                                  textAlign:
                                                                    "right",
                                                                }}
                                                              />
                                                              <div>
                                                                {getValidationMessage(
                                                                  requireMessage,
                                                                  pricingSettingObj.maxDiscountForQC,
                                                                  OneOffPricingInfo.DiscountPercentagePackageOne
                                                                )}
                                                              </div>
                                                            </div>
                                                          </td>

                                                          {packageCount >=
                                                            2 && (
                                                            <>
                                                              {visibleFieldsCustomTemp.vat && (
                                                                <th></th>
                                                              )}
                                                              {visibleFieldsCustomTemp.serviceScope && (
                                                                <th></th>
                                                              )}
                                                              <td
                                                                style={{
                                                                  width: "35%",
                                                                  padding:
                                                                    "0px",
                                                                  whiteSpace:
                                                                    "normal",
                                                                }}
                                                              >
                                                                <div
                                                                  style={{
                                                                    display:
                                                                      "flex",
                                                                    flexDirection:
                                                                      "column",
                                                                    alignItems:
                                                                      "flex-start",
                                                                  }}
                                                                >
                                                                  <input
                                                                    className="input-text"
                                                                    type="text"
                                                                    placeholder="Discount (%)"
                                                                    value={OneOffPricingInfo.DiscountPercentagePackageTwo?.toString()?.replace(
                                                                      /\B(?=(\d{3})+(?!\d))/g,
                                                                      ","
                                                                    )}
                                                                    onChange={(
                                                                      e
                                                                    ) => {
                                                                      handleOneOffPackageTwoDiscountPercentage(
                                                                        e
                                                                      );
                                                                    }}
                                                                    style={{
                                                                      width:
                                                                        "100%",
                                                                      textAlign:
                                                                        "right",
                                                                    }}
                                                                  />
                                                                  <div>
                                                                    {getValidationMessage(
                                                                      requireMessage,
                                                                      pricingSettingObj.maxDiscountForQC,
                                                                      OneOffPricingInfo.DiscountPercentagePackageTwo
                                                                    )}
                                                                  </div>
                                                                </div>
                                                              </td>
                                                            </>
                                                          )}

                                                          {packageCount ===
                                                            3 && (
                                                            <>
                                                              {visibleFieldsCustomTemp.vat && (
                                                                <th></th>
                                                              )}
                                                              {visibleFieldsCustomTemp.serviceScope && (
                                                                <th></th>
                                                              )}
                                                              <td
                                                                style={{
                                                                  width: "35%",
                                                                  padding:
                                                                    "0px",
                                                                  whiteSpace:
                                                                    "normal",
                                                                }}
                                                              >
                                                                <div
                                                                  style={{
                                                                    display:
                                                                      "flex",
                                                                    flexDirection:
                                                                      "column",
                                                                    alignItems:
                                                                      "flex-start",
                                                                  }}
                                                                >
                                                                  <input
                                                                    className="input-text"
                                                                    type="text"
                                                                    placeholder="Discount (%)"
                                                                    value={OneOffPricingInfo.DiscountPercentagePackageThree?.toString()?.replace(
                                                                      /\B(?=(\d{3})+(?!\d))/g,
                                                                      ","
                                                                    )}
                                                                    onChange={(
                                                                      e
                                                                    ) => {
                                                                      handleOneOffPackageThreeDiscountPercentage(
                                                                        e
                                                                      );
                                                                    }}
                                                                    style={{
                                                                      width:
                                                                        "100%",
                                                                      textAlign:
                                                                        "right",
                                                                    }}
                                                                  />
                                                                  <div>
                                                                    {getValidationMessage(
                                                                      requireMessage,
                                                                      pricingSettingObj.maxDiscountForQC,
                                                                      OneOffPricingInfo.DiscountPercentagePackageThree
                                                                    )}
                                                                  </div>
                                                                </div>
                                                              </td>
                                                            </>
                                                          )}
                                                        </tr>
                                                      </>
                                                    )}

                                                    <tr className="head-row">
                                                      <td className="tr-table-class font-14 text-white">
                                                        Net Total
                                                      </td>
                                                      <td className="tr-table-class font-14 text-white text-right">
                                                        {" "}
                                                        {totalOnePackageValue >
                                                          Number(
                                                            OneOffPricingInfo.packageOneNetTotal
                                                          ) ||
                                                        (Number(
                                                          OneOffPricingInfo.packageOneDisCount
                                                        ) > 0 &&
                                                          !ProposalObject.DiscountLines)
                                                          ? Number(
                                                              OneOffPricingInfo.packageOneDisCount
                                                            ) > 0 &&
                                                            !ProposalObject.DiscountLines
                                                            ? formatValue(
                                                                OneOffPricingInfo.packageOneDisCountedTotal
                                                              )
                                                            : formatValue(
                                                                totalOnePackageValue
                                                              )
                                                          : formatValue(
                                                              OneOffPricingInfo.packageOneNetTotal
                                                            )}
                                                      </td>
                                                      {/* Net VAT */}
                                                      {visibleFieldsCustomTemp.vat && (
                                                        <td className="tr-table-class font-14 text-white text-right">
                                                          {" "}
                                                          {totalOnePackageValue >
                                                            Number(
                                                              OneOffPricingInfo.packageOneNetTotal
                                                            ) ||
                                                          (Number(
                                                            OneOffPricingInfo.packageOneDisCount
                                                          ) > 0 &&
                                                            !ProposalObject.DiscountLines)
                                                            ? Number(
                                                                OneOffPricingInfo.packageOneDisCount
                                                              ) > 0 &&
                                                              !ProposalObject.DiscountLines
                                                              ? formatValue(
                                                                  (OneOffPricingInfo.packageOneDisCountedTotal *
                                                                    20) /
                                                                    100
                                                                )
                                                              : formatValue(
                                                                  (totalOnePackageValue *
                                                                    20) /
                                                                    100
                                                                )
                                                            : formatValue(
                                                                (OneOffPricingInfo.packageOneNetTotal *
                                                                  20) /
                                                                  100
                                                              )}
                                                        </td>
                                                      )}
                                                      {visibleFieldsCustomTemp.serviceScope && (
                                                        <td></td>
                                                      )}
                                                      {packageCount >= 2 && (
                                                        <>
                                                          <td className="tr-table-class font-14 text-white text-right">
                                                            {" "}
                                                            {totalTwoPackageValue >
                                                              Number(
                                                                OneOffPricingInfo.packageTwoNetTotal
                                                              ) ||
                                                            (Number(
                                                              OneOffPricingInfo.packageTwoDisCount
                                                            ) > 0 &&
                                                              !ProposalObject.DiscountLines)
                                                              ? Number(
                                                                  OneOffPricingInfo.packageTwoDisCount
                                                                ) > 0 &&
                                                                !ProposalObject.DiscountLines
                                                                ? formatValue(
                                                                    OneOffPricingInfo.packageTwoDisCountedTotal
                                                                  )
                                                                : formatValue(
                                                                    totalTwoPackageValue
                                                                  )
                                                              : formatValue(
                                                                  OneOffPricingInfo.packageTwoNetTotal
                                                                )}
                                                          </td>
                                                          {/* Net VAT */}
                                                          {visibleFieldsCustomTemp.vat && (
                                                            <td className="tr-table-class font-14 text-white text-right">
                                                              {" "}
                                                              {totalTwoPackageValue >
                                                                Number(
                                                                  OneOffPricingInfo.packageTwoNetTotal
                                                                ) ||
                                                              (Number(
                                                                OneOffPricingInfo.packageTwoDisCount
                                                              ) > 0 &&
                                                                !ProposalObject.DiscountLines)
                                                                ? Number(
                                                                    OneOffPricingInfo.packageTwoDisCount
                                                                  ) > 0 &&
                                                                  !ProposalObject.DiscountLines
                                                                  ? formatValue(
                                                                      (OneOffPricingInfo.packageTwoDisCountedTotal *
                                                                        20) /
                                                                        100
                                                                    )
                                                                  : formatValue(
                                                                      (totalTwoPackageValue *
                                                                        20) /
                                                                        100
                                                                    )
                                                                : formatValue(
                                                                    (OneOffPricingInfo.packageTwoNetTotal *
                                                                      20) /
                                                                      100
                                                                  )}
                                                            </td>
                                                          )}
                                                          {visibleFieldsCustomTemp.serviceScope && (
                                                            <td></td>
                                                          )}
                                                        </>
                                                      )}{" "}
                                                      {packageCount === 3 && (
                                                        <>
                                                          <td className="tr-table-class font-14 text-white text-right">
                                                            {" "}
                                                            {totalThreePackageValue >
                                                              Number(
                                                                OneOffPricingInfo.packageThreeNetTotal
                                                              ) ||
                                                            (Number(
                                                              OneOffPricingInfo.packageThreeDisCount
                                                            ) > 0 &&
                                                              !ProposalObject.DiscountLines)
                                                              ? Number(
                                                                  OneOffPricingInfo.packageThreeDisCount
                                                                ) > 0 &&
                                                                !ProposalObject.DiscountLines
                                                                ? formatValue(
                                                                    OneOffPricingInfo.packageThreeDisCountedTotal
                                                                  )
                                                                : formatValue(
                                                                    totalThreePackageValue
                                                                  )
                                                              : formatValue(
                                                                  OneOffPricingInfo.packageThreeNetTotal
                                                                )}
                                                          </td>
                                                          {/* Net VAT */}
                                                          {visibleFieldsCustomTemp.vat && (
                                                            <td className="tr-table-class font-14 text-white text-right">
                                                              {" "}
                                                              {totalThreePackageValue >
                                                                Number(
                                                                  OneOffPricingInfo.packageThreeNetTotal
                                                                ) ||
                                                              (Number(
                                                                OneOffPricingInfo.packageThreeDisCount
                                                              ) > 0 &&
                                                                !ProposalObject.DiscountLines)
                                                                ? Number(
                                                                    OneOffPricingInfo.packageThreeDisCount
                                                                  ) > 0 &&
                                                                  !ProposalObject.DiscountLines
                                                                  ? formatValue(
                                                                      (OneOffPricingInfo.packageThreeDisCountedTotal *
                                                                        20) /
                                                                        100
                                                                    )
                                                                  : formatValue(
                                                                      (totalThreePackageValue *
                                                                        20) /
                                                                        100
                                                                    )
                                                                : formatValue(
                                                                    (OneOffPricingInfo.packageThreeNetTotal *
                                                                      20) /
                                                                      100
                                                                  )}
                                                            </td>
                                                          )}
                                                          {visibleFieldsCustomTemp.serviceScope && (
                                                            <td></td>
                                                          )}
                                                        </>
                                                      )}
                                                    </tr>

                                                    {(Number(
                                                      OneOffPricingInfo.packageThreeDisCount
                                                    ) > 0 ||
                                                      Number(
                                                        OneOffPricingInfo.packageOneDisCount
                                                      ) > 0 ||
                                                      Number(
                                                        OneOffPricingInfo.packageTwoDisCount
                                                      ) > 0) &&
                                                      ProposalObject.DiscountLines && (
                                                        <>
                                                          <tr className="head-grey-row">
                                                            <td className="tr-table-class font-14 text-white">
                                                              Discount
                                                            </td>
                                                            <td className="tr-table-class font-14 text-white text-right">
                                                              (-){" "}
                                                              {formatValue(
                                                                OneOffPricingInfo.packageOneDisCount
                                                              )}
                                                            </td>
                                                            {/* Discounted VAT */}

                                                            {visibleFieldsCustomTemp.vat && (
                                                              <td className="tr-table-class font-14 text-white text-right">
                                                                (-){" "}
                                                                {totalOnePackageValue >
                                                                  Number(
                                                                    OneOffPricingInfo.packageOneNetTotal
                                                                  ) ||
                                                                (Number(
                                                                  OneOffPricingInfo.packageOneDisCount
                                                                ) > 0 &&
                                                                  !ProposalObject.DiscountLines)
                                                                  ? Number(
                                                                      OneOffPricingInfo.packageOneDisCount
                                                                    ) > 0 &&
                                                                    !ProposalObject.DiscountLines
                                                                    ? formatValue(
                                                                        (((OneOffPricingInfo.packageOneDisCountedTotal *
                                                                          20) /
                                                                          100) *
                                                                          OneOffPricingInfo.DiscountPercentagePackageOne) /
                                                                          100
                                                                      )
                                                                    : formatValue(
                                                                        (((totalOnePackageValue *
                                                                          20) /
                                                                          100) *
                                                                          OneOffPricingInfo.DiscountPercentagePackageOne) /
                                                                          100
                                                                      )
                                                                  : formatValue(
                                                                      (((OneOffPricingInfo.packageOneNetTotal *
                                                                        20) /
                                                                        100) *
                                                                        OneOffPricingInfo.DiscountPercentagePackageOne) /
                                                                        100
                                                                    )}
                                                              </td>
                                                            )}
                                                            {visibleFieldsCustomTemp.serviceScope && (
                                                              <td></td>
                                                            )}

                                                            {/* <td className="tr-table-class font-14 text-white text-right"></td> */}
                                                            {packageCount >=
                                                              2 && (
                                                              <>
                                                                <td className="tr-table-class font-14 text-white text-right">
                                                                  (-){" "}
                                                                  {formatValue(
                                                                    OneOffPricingInfo.packageTwoDisCount
                                                                  )}
                                                                </td>
                                                                {/* Discounted VAT */}
                                                                {visibleFieldsCustomTemp.vat && (
                                                                  <td className="tr-table-class font-14 text-white text-right">
                                                                    (-){" "}
                                                                    {totalTwoPackageValue >
                                                                      Number(
                                                                        OneOffPricingInfo.packageTwoNetTotal
                                                                      ) ||
                                                                    (Number(
                                                                      OneOffPricingInfo.packageTwoDisCount
                                                                    ) > 0 &&
                                                                      !ProposalObject.DiscountLines)
                                                                      ? Number(
                                                                          OneOffPricingInfo.packageTwoDisCount
                                                                        ) > 0 &&
                                                                        !ProposalObject.DiscountLines
                                                                        ? formatValue(
                                                                            (((OneOffPricingInfo.packageTwoDisCountedTotal *
                                                                              20) /
                                                                              100) *
                                                                              OneOffPricingInfo.DiscountPercentagePackageTwo) /
                                                                              100
                                                                          )
                                                                        : formatValue(
                                                                            (((totalTwoPackageValue *
                                                                              20) /
                                                                              100) *
                                                                              OneOffPricingInfo.DiscountPercentagePackageTwo) /
                                                                              100
                                                                          )
                                                                      : formatValue(
                                                                          (((OneOffPricingInfo.packageTwoNetTotal *
                                                                            20) /
                                                                            100) *
                                                                            OneOffPricingInfo.DiscountPercentagePackageTwo) /
                                                                            100
                                                                        )}
                                                                  </td>
                                                                )}
                                                                {visibleFieldsCustomTemp.serviceScope && (
                                                                  <td></td>
                                                                )}
                                                              </>
                                                            )}
                                                            {packageCount ===
                                                              3 && (
                                                              <>
                                                                <td className="tr-table-class font-14 text-white text-right">
                                                                  (-){" "}
                                                                  {formatValue(
                                                                    OneOffPricingInfo.packageThreeDisCount
                                                                  )}
                                                                </td>

                                                                {visibleFieldsCustomTemp.vat && (
                                                                  <td className="tr-table-class font-14 text-white text-right">
                                                                    (-){" "}
                                                                    {totalThreePackageValue >
                                                                      Number(
                                                                        OneOffPricingInfo.packageThreeNetTotal
                                                                      ) ||
                                                                    (Number(
                                                                      OneOffPricingInfo.packageThreeDisCount
                                                                    ) > 0 &&
                                                                      !ProposalObject.DiscountLines)
                                                                      ? Number(
                                                                          OneOffPricingInfo.packageThreeDisCount
                                                                        ) > 0 &&
                                                                        !ProposalObject.DiscountLines
                                                                        ? formatValue(
                                                                            (((OneOffPricingInfo.packageThreeDisCountedTotal *
                                                                              20) /
                                                                              100) *
                                                                              OneOffPricingInfo.DiscountPercentagePackageThree) /
                                                                              100
                                                                          )
                                                                        : formatValue(
                                                                            (((totalThreePackageValue *
                                                                              20) /
                                                                              100) *
                                                                              OneOffPricingInfo.DiscountPercentagePackageThree) /
                                                                              100
                                                                          )
                                                                      : formatValue(
                                                                          (((OneOffPricingInfo.packageThreeNetTotal *
                                                                            20) /
                                                                            100) *
                                                                            OneOffPricingInfo.DiscountPercentagePackageThree) /
                                                                            100
                                                                        )}
                                                                  </td>
                                                                )}
                                                                {visibleFieldsCustomTemp.serviceScope && (
                                                                  <td></td>
                                                                )}
                                                              </>
                                                            )}
                                                          </tr>
                                                          {/* <tr className="head-row">
                                                               <td className="tr-table-class font-14 text-white">
                                                                 Discounted Total
                                                               </td>
                                                               <td className="tr-table-class font-14 text-white text-right">
                                                                 {" "}
                                                                 {formatValue(
                                                                   OneOffPricingInfo.packageOneDisCountedTotal
                                                                 )}
                                                               </td>
                                         
                                                               {visibleFieldsCustomTemp.vat && (
                                                                 <td className="tr-table-class font-14 text-white text-right">
                                                                   {" "}
                                                                   {formatValue(
                                                                     OneOffPricingInfo.PackageOneVaTPriceWithoutDiscout -
                                                                       (OneOffPricingInfo.PackageOneVaTPriceWithoutDiscout *
                                                                         20) /
                                                                         100
                                                                   )}
                                                                 </td>
                                                               )}
                                                              
                                         
                                                               {packageCount >= 2 && (
                                                                 <>
                                                                   <td className="tr-table-class font-14 text-white text-right">
                                                                     {" "}
                                                                     {formatValue(
                                                                       OneOffPricingInfo.packageTwoDisCountedTotal
                                                                     )}
                                                                   </td>
                                                                   {visibleFieldsCustomTemp.vat && (
                                                                     <td className="tr-table-class font-14 text-white text-right">
                                                                       {" "}
                                                                       {formatValue(
                                                                         OneOffPricingInfo.PackageTwoVaTPriceWithoutDiscout -
                                                                           (OneOffPricingInfo.PackageTwoVaTPriceWithoutDiscout *
                                                                             20) /
                                                                             100
                                                                       )}
                                                                     </td>
                                                                   )}
                                                                 </>
                                                               )}
                                                               {packageCount === 3 && (
                                                                 <>
                                                                   <td className="tr-table-class font-14 text-white text-right">
                                                                     {" "}
                                                                     {formatValue(
                                                                       OneOffPricingInfo.packageThreeDisCountedTotal
                                                                     )}
                                                                   </td>
                                                                   {visibleFieldsCustomTemp.vat && (
                                                                     <td className="tr-table-class font-14 text-white text-right">
                                                                       {" "}
                                                                       {formatValue(
                                                                         OneOffPricingInfo.PackageThreeVaTPriceWithoutDiscout -
                                                                           (OneOffPricingInfo.PackageThreeVaTPriceWithoutDiscout *
                                                                             20) /
                                                                             100
                                                                       )}
                                                                     </td>
                                                                   )}
                                                                 </>
                                                               )}
                                         
                                                               {visibleFieldsCustomTemp.serviceScope && <td></td>}
                                                             </tr> */}
                                                          <tr className="head-row">
                                                            <td className="tr-table-class font-14 text-white">
                                                              {/* Fees inc VAT (£) */}
                                                              Grand Total
                                                            </td>
                                                            {/* <td className="tr-table-class font-14 text-white text-right">
                                                                 {" "}
                                                                 {formatValue(OneOffPricingInfo.PackageOneGrandTotal)}
                                                               </td> */}
                                                            <td className="tr-table-class font-14 text-white text-right">
                                                              {" "}
                                                              {totalOnePackageValue >
                                                                Number(
                                                                  OneOffPricingInfo.packageOneNetTotal
                                                                ) ||
                                                              (Number(
                                                                OneOffPricingInfo.packageOneDisCount
                                                              ) > 0 &&
                                                                !ProposalObject.DiscountLines)
                                                                ? Number(
                                                                    OneOffPricingInfo.packageOneDisCount
                                                                  ) > 0 &&
                                                                  !ProposalObject.DiscountLines
                                                                  ? formatValue(
                                                                      OneOffPricingInfo.packageOneDisCountedTotal -
                                                                        OneOffPricingInfo.packageOneDisCount
                                                                    )
                                                                  : formatValue(
                                                                      totalOnePackageValue -
                                                                        OneOffPricingInfo.packageOneDisCount
                                                                    )
                                                                : formatValue(
                                                                    OneOffPricingInfo.packageOneNetTotal -
                                                                      OneOffPricingInfo.packageOneDisCount
                                                                  )}
                                                            </td>
                                                            {visibleFieldsCustomTemp.vat && (
                                                              <td className="tr-table-class font-14 text-white text-right">
                                                                {totalOnePackageValue >
                                                                  Number(
                                                                    OneOffPricingInfo.packageOneNetTotal
                                                                  ) ||
                                                                (Number(
                                                                  OneOffPricingInfo.packageOneDisCount
                                                                ) > 0 &&
                                                                  !ProposalObject.DiscountLines)
                                                                  ? Number(
                                                                      OneOffPricingInfo.packageOneDisCount
                                                                    ) > 0 &&
                                                                    !ProposalObject.DiscountLines
                                                                    ? formatValue(
                                                                        (OneOffPricingInfo.packageOneDisCountedTotal *
                                                                          20) /
                                                                          100 -
                                                                          (((OneOffPricingInfo.packageOneDisCountedTotal *
                                                                            20) /
                                                                            100) *
                                                                            OneOffPricingInfo.DiscountPercentagePackageOne) /
                                                                            100
                                                                      )
                                                                    : formatValue(
                                                                        (totalOnePackageValue *
                                                                          20) /
                                                                          100 -
                                                                          (((totalOnePackageValue *
                                                                            20) /
                                                                            100) *
                                                                            OneOffPricingInfo.DiscountPercentagePackageOne) /
                                                                            100
                                                                      )
                                                                  : formatValue(
                                                                      (OneOffPricingInfo.packageOneNetTotal *
                                                                        20) /
                                                                        100 -
                                                                        (((OneOffPricingInfo.packageOneNetTotal *
                                                                          20) /
                                                                          100) *
                                                                          OneOffPricingInfo.DiscountPercentagePackageOne) /
                                                                          100
                                                                    )}
                                                              </td>
                                                            )}
                                                            {visibleFieldsCustomTemp.serviceScope && (
                                                              <td></td>
                                                            )}
                                                            {packageCount >=
                                                              2 && (
                                                              <>
                                                                <td className="tr-table-class font-14 text-white text-right">
                                                                  {" "}
                                                                  {formatValue(
                                                                    OneOffPricingInfo.PackageTwoGrandTotal
                                                                  )}
                                                                </td>
                                                                {visibleFieldsCustomTemp.vat && (
                                                                  <td className="tr-table-class font-14 text-white text-right">
                                                                    {totalTwoPackageValue >
                                                                      Number(
                                                                        OneOffPricingInfo.packageTwoNetTotal
                                                                      ) ||
                                                                    (Number(
                                                                      OneOffPricingInfo.packageTwoDisCount
                                                                    ) > 0 &&
                                                                      !ProposalObject.DiscountLines)
                                                                      ? Number(
                                                                          OneOffPricingInfo.packageTwoDisCount
                                                                        ) > 0 &&
                                                                        !ProposalObject.DiscountLines
                                                                        ? formatValue(
                                                                            (OneOffPricingInfo.packageTwoDisCountedTotal *
                                                                              20) /
                                                                              100 -
                                                                              (((OneOffPricingInfo.packageTwoDisCountedTotal *
                                                                                20) /
                                                                                100) *
                                                                                OneOffPricingInfo.DiscountPercentagePackageTwo) /
                                                                                100
                                                                          )
                                                                        : formatValue(
                                                                            (totalTwoPackageValue *
                                                                              20) /
                                                                              100 -
                                                                              (((totalTwoPackageValue *
                                                                                20) /
                                                                                100) *
                                                                                OneOffPricingInfo.DiscountPercentagePackageTwo) /
                                                                                100
                                                                          )
                                                                      : formatValue(
                                                                          (OneOffPricingInfo.packageTwoNetTotal *
                                                                            20) /
                                                                            100 -
                                                                            (((OneOffPricingInfo.packageTwoNetTotal *
                                                                              20) /
                                                                              100) *
                                                                              OneOffPricingInfo.DiscountPercentagePackageTwo) /
                                                                              100
                                                                        )}
                                                                  </td>
                                                                )}
                                                                {visibleFieldsCustomTemp.serviceScope && (
                                                                  <td></td>
                                                                )}
                                                              </>
                                                            )}
                                                            {packageCount ==
                                                              3 && (
                                                              <>
                                                                <td className="tr-table-class font-14 text-white text-right">
                                                                  {" "}
                                                                  {formatValue(
                                                                    OneOffPricingInfo.PackageThreeGrandTotal
                                                                  )}
                                                                </td>
                                                                {visibleFieldsCustomTemp.vat && (
                                                                  <td className="tr-table-class font-14 text-white text-right">
                                                                    {totalThreePackageValue >
                                                                      Number(
                                                                        OneOffPricingInfo.packageThreeNetTotal
                                                                      ) ||
                                                                    (Number(
                                                                      OneOffPricingInfo.packageThreeDisCount
                                                                    ) > 0 &&
                                                                      !ProposalObject.DiscountLines)
                                                                      ? Number(
                                                                          OneOffPricingInfo.packageThreeDisCount
                                                                        ) > 0 &&
                                                                        !ProposalObject.DiscountLines
                                                                        ? formatValue(
                                                                            (OneOffPricingInfo.packageThreeDisCountedTotal *
                                                                              20) /
                                                                              100 -
                                                                              (((OneOffPricingInfo.packageThreeDisCountedTotal *
                                                                                20) /
                                                                                100) *
                                                                                OneOffPricingInfo.DiscountPercentagePackageThree) /
                                                                                100
                                                                          )
                                                                        : formatValue(
                                                                            (totalThreePackageValue *
                                                                              20) /
                                                                              100 -
                                                                              (((totalThreePackageValue *
                                                                                20) /
                                                                                100) *
                                                                                OneOffPricingInfo.DiscountPercentagePackageThree) /
                                                                                100
                                                                          )
                                                                      : formatValue(
                                                                          (OneOffPricingInfo.packageThreeNetTotal *
                                                                            20) /
                                                                            100 -
                                                                            (((OneOffPricingInfo.packageThreeNetTotal *
                                                                              20) /
                                                                              100) *
                                                                              OneOffPricingInfo.DiscountPercentagePackageThree) /
                                                                              100
                                                                        )}
                                                                  </td>
                                                                )}
                                                                {visibleFieldsCustomTemp.serviceScope && (
                                                                  <td></td>
                                                                )}
                                                              </>
                                                            )}
                                                          </tr>
                                                        </>
                                                      )}

                                                    {vatPercentage && (
                                                      <>
                                                        {/* <tr class="head-grey-row">
                                                                                  <td className="tr-table-class font-14 text-white">
                                                                                    VAT
                                                                                  </td>
                                                                                  <td className="tr-table-class font-14 text-white text-right">
                                                                                    {" "}
                                                                                    {formatValue(
                                                                                      OneOffPricingInfo
                                                                                        .PackageOneVaTPrice
                                                                                    )}
                                                                                  </td>
                                                                                  {packageCount >= 2 && (
                                                                                    <td className="tr-table-class font-14 text-white text-right">
                                                                                      {" "}
                                                                                      {formatValue(
                                                                                        OneOffPricingInfo
                                                                                          .PackageTwoVaTPrice
                                                                                      )}
                                                                                    </td>
                                                                                  )}
                                                                                  {packageCount === 3 && (
                                                                                    <td className="tr-table-class font-14 text-white text-right">
                                                                                      {" "}
                                                                                      {formatValue(
                                                                                        OneOffPricingInfo
                                                                                          .PackageThreeVaTPrice
                                                                                      )}
                                                                                    </td>
                                                                                  )}
                                                                                </tr> */}
                                                      </>
                                                    )}
                                                  </table>
                                                </div>
                                              )}

                                              {/* One-off */}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="row fieldset">
                                    <div className="col-lg-3 text-lg-right">
                                      <label className="fieldset-label required">
                                        Fees in the {proposalName}
                                      </label>
                                    </div>
                                    <div className="col-lg-9">
                                      <div className="input-group">
                                        {/* Add your Select component here */}
                                        <Select
                                          // isDisabled
                                          className="phone-input-country-code selectDropDown Drop-down-width"
                                          value={feeTypeValue}
                                          options={Utils.feeInProposal}
                                          onChange={handleChangeFeesType}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  {ProposalObject.paymentGatewayID !== null && (
                                    <div className="row fieldset">
                                      <div className="col-lg-3 text-lg-right">
                                        <label className="fieldset-label required">
                                          Payment Gateway
                                          <span className="text-danger">*</span>
                                        </label>
                                      </div>
                                      <div className="col-md-9 mb-2">
                                        <div className="input-group">
                                          {/* Adjust the Select component as needed */}
                                          <Select
                                            isDisabled
                                            className="phone-input-country-code selectDropDown Drop-down-width"
                                            value={PaymentGatewayValue}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  <div className="row fieldset">
                                    <div className="col-lg-3 text-lg-right">
                                      <label className="fieldset-label required">
                                        Show Discount
                                      </label>
                                    </div>
                                    <div className="col-lg-9">
                                      <div className="input-group">
                                        {/* Replace Select with Checkbox */}
                                        <input
                                          type="checkbox"
                                          disabled
                                          checked={ProposalObject.DiscountLines}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  {selectedRecurringServiceList?.length !==
                                    0 && (
                                    <div className="tab-content">
                                      <div className="tab-pane p-3 active">
                                        <div className="row">
                                          <div className="col-lg-12">
                                            <div className="separator mb-2"></div>
                                            <h6>Recurring Services</h6>
                                            <div className="separator mb-3"></div>
                                            {ProposalObject.quoteTypeID !==
                                              4 && (
                                              <>
                                                <div className="row fieldset">
                                                  <div className="col-md-2 col-sm-12  text-md-end">
                                                    <label className="fieldset-label">
                                                      Original Price (
                                                      {getCurrencySymbol(
                                                        ProposalObject.currencyID
                                                      )}
                                                      )
                                                    </label>
                                                  </div>
                                                  <div className="col-md-4 col-sm-12">
                                                    <input
                                                      readonly=""
                                                      type="text"
                                                      class="input-text"
                                                      value={
                                                        Number(
                                                          Math.floor(
                                                            RecurringPricingInfo.OriginalPrice *
                                                              100
                                                          ) / 100
                                                        )
                                                          .toFixed(2)
                                                          .replace(
                                                            /\B(?=(\d{3})+(?!\d))/g,
                                                            ","
                                                          )

                                                        // RecurringPricingInfo.OriginalPrice
                                                      }
                                                    />
                                                  </div>
                                                  <div className="col-md-2 col-sm-12  text-md-end">
                                                    <label className="fieldset-label required">
                                                      Payment Frequency
                                                    </label>
                                                  </div>
                                                  <div className="col-md-4 col-sm-12">
                                                    <Select
                                                      isDisabled
                                                      className="phone-input-country-code selectDropDown Drop-down-width"
                                                      value={selectedFrequency}
                                                    />
                                                  </div>
                                                </div>
                                                <div
                                                  class="row"
                                                  id="recurring_Default"
                                                >
                                                  <div class="col-lg-2 mb-1 col-md-2 col-sm-12 mt-2 text-md-end">
                                                    <label className="fieldset-label">
                                                      Discount (%)
                                                    </label>
                                                  </div>
                                                  <div class="col-lg-4 col-md-4 col-sm-12">
                                                    <input
                                                      readonly=""
                                                      class="input-text"
                                                      type="text"
                                                      placeholder="Discount (%)"
                                                      value={
                                                        Number(
                                                          Math.floor(
                                                            RecurringPricingInfo.DefaultDiscount *
                                                              100
                                                          ) / 100
                                                        )
                                                          .toFixed(2)
                                                          .replace(
                                                            /\B(?=(\d{3})+(?!\d))/g,
                                                            ","
                                                          )

                                                        // RecurringPricingInfo.DefaultDiscount
                                                      }
                                                    />
                                                  </div>
                                                  <div
                                                    style={{ padding: "0px" }}
                                                    class="col-lg-2 col-md-2  col-sm-12"
                                                  >
                                                    <div class="mt-2 text-md-end">
                                                      <label class="form-label">
                                                        Discounted Price (
                                                        {getCurrencySymbol(
                                                          ProposalObject.currencyID
                                                        )}
                                                        )
                                                      </label>
                                                    </div>
                                                  </div>
                                                  <div class="col-lg-4 col-md-4 col-sm-12">
                                                    <input
                                                      readonly=""
                                                      class="input-text"
                                                      type="text"
                                                      placeholder={`Discounted Price (${getCurrencySymbol(
                                                        ProposalObject.currencyID
                                                      )})`}
                                                      value={
                                                        Number(
                                                          Math.floor(
                                                            RecurringPricingInfo.DiscountedPrice *
                                                              100
                                                          ) / 100
                                                        )
                                                          .toFixed(2)
                                                          .replace(
                                                            /\B(?=(\d{3})+(?!\d))/g,
                                                            ","
                                                          )

                                                        // RecurringPricingInfo.DiscountedPrice
                                                      }
                                                    />
                                                  </div>
                                                </div>
                                              </>
                                            )}
                                            <div className="mb-3"></div>
                                            {/* Recurring Service Standard*/}
                                            {pricingTableColumnIDs === null ||
                                            pricingTableColumnIDs === "" ||
                                            pricingTableColumnIDs ===
                                              undefined ? (
                                              <div
                                                style={{ marginTop: "0px" }}
                                                className="table-responsive"
                                              >
                                                <table className="table align-middle table-nowrap">
                                                  <thead className="table-light table-header-font">
                                                    <tr className="head-row">
                                                      <th className="tr-table-class text-white">
                                                        Services
                                                      </th>
                                                      {ProposalObject.quoteTypeID !==
                                                        4 && (
                                                        <th className="tr-table-class text-white text-right">
                                                          Fees (
                                                          {getCurrencySymbol(
                                                            ProposalObject.currencyID
                                                          )}
                                                          )
                                                        </th>
                                                      )}
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {selectedRecurringServiceList.map(
                                                      (service, index) => {
                                                        return (
                                                          <>
                                                            <tr class="a-la-carte-services-review-head-row">
                                                              <th colspan="2">
                                                                {
                                                                  service.serviceCatName
                                                                }
                                                              </th>
                                                            </tr>
                                                            {service.servicesList.map(
                                                              (
                                                                subService,
                                                                subIndex
                                                              ) => {
                                                                return (
                                                                  <tr
                                                                    key={
                                                                      subIndex
                                                                    }
                                                                  >
                                                                    {/* */}
                                                                    <td>
                                                                      <div>
                                                                        {
                                                                          subService.serviceName
                                                                        }
                                                                      </div>
                                                                      <div class="package-variables"></div>
                                                                    </td>
                                                                    {ProposalObject.quoteTypeID !==
                                                                      4 && (
                                                                      <td className="text-right">
                                                                        {ProposalObject.feeTypeId ===
                                                                          1 && (
                                                                          <>
                                                                            {" "}
                                                                            {formatValue(
                                                                              subService.quotationPrice
                                                                            )}
                                                                          </>
                                                                        )}
                                                                        {ProposalObject.feeTypeId ===
                                                                          2 && (
                                                                          <span className="fa fa-check"></span>
                                                                        )}
                                                                      </td>
                                                                    )}
                                                                  </tr>
                                                                );
                                                              }
                                                            )}
                                                          </>
                                                        );
                                                      }
                                                    )}
                                                    {ProposalObject.quoteTypeID !==
                                                      4 && (
                                                      <tr className="head-row">
                                                        <td className="tr-table-class text-white">
                                                          Net Total
                                                        </td>
                                                        <td className="tr-table-class text-white text-right">
                                                          {" "}
                                                          {
                                                            Number(
                                                              RecurringPricingInfo.OriginalPrice
                                                            ) <
                                                              Number(
                                                                RecurringPricingInfo.DiscountedPrice
                                                              ) ||
                                                            (Number(
                                                              RecurringPricingInfo.Discount
                                                            ) > 0 &&
                                                              !ProposalObject.DiscountLines)
                                                              ? formatValue(
                                                                  RecurringPricingInfo.DiscountedPrice
                                                                )
                                                              : // Number(RecurringPricingInfo.DiscountedPrice)
                                                                //     .toFixed(2)
                                                                //     .toString()
                                                                //     .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                                formatValue(
                                                                  RecurringPricingInfo.OriginalPrice
                                                                )
                                                            // Number(RecurringPricingInfo.OriginalPrice)
                                                            //     .toFixed(2)
                                                            //     .toString()
                                                            //     .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                          }
                                                        </td>
                                                      </tr>
                                                    )}
                                                    {Number(
                                                      RecurringPricingInfo.Discount
                                                    ) > 0 &&
                                                      ProposalObject.DiscountLines && (
                                                        <>
                                                          <tr class="head-grey-row">
                                                            <td className="tr-table-class text-white">
                                                              Discount
                                                            </td>
                                                            <td className="tr-table-class text-white text-right">
                                                              (-){" "}
                                                              {
                                                                formatValue(
                                                                  RecurringPricingInfo.Discount
                                                                )
                                                                // Number(RecurringPricingInfo.Discount)
                                                                //   .toFixed(2)
                                                                //   .toString()
                                                                //   .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                              }
                                                            </td>
                                                          </tr>
                                                          <tr class="head-row">
                                                            <td className="tr-table-class text-white">
                                                              Discounted Total
                                                            </td>
                                                            <td className="tr-table-class text-white text-right">
                                                              {" "}
                                                              {
                                                                formatValue(
                                                                  RecurringPricingInfo.DiscountedTotal
                                                                )
                                                                // Number(
                                                                //   RecurringPricingInfo.DiscountedTotal
                                                                // )
                                                                //   .toFixed(2)
                                                                //   .toString()
                                                                //   .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                              }
                                                            </td>
                                                          </tr>
                                                        </>
                                                      )}

                                                    {vatPercentage && (
                                                      <>
                                                        <tr class="head-grey-row">
                                                          <td className="tr-table-class text-white">
                                                            {getTaxName(
                                                              ProposalObject.currencyID
                                                            )}
                                                          </td>
                                                          <td className="tr-table-class text-white text-right">
                                                            {" "}
                                                            {
                                                              // formatValue(
                                                              //   RecurringPricingInfo.VATPrice
                                                              // )
                                                              formatValue(
                                                                totalRecServiceVAT
                                                              )
                                                              // Number(RecurringPricingInfo.VATPrice)
                                                              //   .toFixed(2)
                                                              //   .toString()
                                                              //   .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                            }
                                                          </td>
                                                        </tr>
                                                        <tr className="head-row">
                                                          <td className="tr-table-class text-white">
                                                            Grand Total
                                                          </td>
                                                          <td className="tr-table-class text-white text-right">
                                                            {" "}
                                                            {/* {
                                                              formatValue(
                                                                RecurringPricingInfo.GrandTotal
                                                              )
                                                            } */}
                                                            {formatValue(
                                                              Number(
                                                                RecurringPricingInfo.Discount
                                                              ) > 0
                                                                ? Number(
                                                                    RecurringPricingInfo.DiscountedTotal
                                                                  ) +
                                                                    Number(
                                                                      totalRecServiceVAT
                                                                    )
                                                                : Number(
                                                                    RecurringPricingInfo.OriginalPrice
                                                                  ) +
                                                                    Number(
                                                                      totalRecServiceVAT
                                                                    )
                                                            )}
                                                          </td>
                                                        </tr>
                                                      </>
                                                    )}
                                                  </tbody>
                                                </table>
                                              </div>
                                            ) : (
                                              <div
                                                style={{ marginTop: "0px" }}
                                                className="table-responsive"
                                              >
                                                <table className="table align-middle table-nowrap">
                                                  <thead className="table-dark text-white">
                                                    <tr className="head-row">
                                                      {visibleFieldsCustomTemp?.serviceCategory && (
                                                        <th
                                                          className="tr-table-class text-white text-center"
                                                          style={{
                                                            width: "16.66%",
                                                          }}
                                                        >
                                                          Service Category
                                                        </th>
                                                      )}
                                                      {visibleFieldsCustomTemp.serviceName && (
                                                        <th
                                                          className="tr-table-class text-white text-center"
                                                          style={{
                                                            width: "16.66%",
                                                          }}
                                                        >
                                                          Services
                                                        </th>
                                                      )}
                                                      {visibleFieldsCustomTemp.serviceScope && (
                                                        <th
                                                          className="tr-table-class text-white text-center"
                                                          style={{
                                                            width: "16.66%",
                                                          }}
                                                        >
                                                          Service Scope
                                                        </th>
                                                      )}

                                                      {visibleFieldsCustomTemp.fees && (
                                                        <th
                                                          className="tr-table-class text-white text-center"
                                                          style={{
                                                            width: "16.66%",
                                                          }}
                                                        >
                                                          Fees (£)
                                                        </th>
                                                      )}
                                                      {vatPercentage &&
                                                        visibleFieldsCustomTemp.vatRate && (
                                                          <th
                                                            className="tr-table-class text-white text-center"
                                                            style={{
                                                              width: "16.66%",
                                                            }}
                                                          >
                                                            VAT Rate
                                                          </th>
                                                        )}
                                                      {vatPercentage &&
                                                        visibleFieldsCustomTemp.vat && (
                                                          <th
                                                            className="tr-table-class text-white text-center"
                                                            style={{
                                                              width: "16.66%",
                                                            }}
                                                          >
                                                            VAT (£)
                                                          </th>
                                                        )}
                                                      {vatPercentage &&
                                                        visibleFieldsCustomTemp.feesIncVat && (
                                                          <th
                                                            className="tr-table-class text-white text-center"
                                                            style={{
                                                              width: "16.66%",
                                                            }}
                                                          >
                                                            Fees inc VAT (£)
                                                          </th>
                                                        )}
                                                    </tr>
                                                  </thead>

                                                  <tbody>
                                                    {selectedRecurringServiceList.map(
                                                      (service, index) => {
                                                        return (
                                                          <>
                                                            {service.servicesList.map(
                                                              (
                                                                subService,
                                                                subIndex
                                                              ) => {
                                                                const price =
                                                                  subService.price ||
                                                                  0;
                                                                const vat =
                                                                  (price * 20) /
                                                                  100;
                                                                const total =
                                                                  price + vat;
                                                                const driverList =
                                                                  subService.pricingDriverList ||
                                                                  [];

                                                                return (
                                                                  <tr
                                                                    key={`sub-${index}-${subIndex}`}
                                                                  >
                                                                    {visibleFieldsCustomTemp?.serviceCategory && (
                                                                      <td className="text-center">
                                                                        {
                                                                          service.serviceCatName
                                                                        }
                                                                      </td>
                                                                    )}
                                                                    {visibleFieldsCustomTemp.serviceName && (
                                                                      <td className="text-center">
                                                                        {
                                                                          subService.serviceName
                                                                        }
                                                                      </td>
                                                                    )}
                                                                    {visibleFieldsCustomTemp.serviceScope && (
                                                                      <td className="text-center">
                                                                        {driverList.length >
                                                                        0
                                                                          ? driverList.map(
                                                                              (
                                                                                d,
                                                                                i
                                                                              ) => (
                                                                                <div
                                                                                  key={
                                                                                    i
                                                                                  }
                                                                                >
                                                                                  {
                                                                                    d.driverName
                                                                                  }{" "}
                                                                                  ={" "}
                                                                                  {
                                                                                    d.driverValue
                                                                                  }
                                                                                  {i !==
                                                                                    driverList.length -
                                                                                      1 &&
                                                                                    ", "}
                                                                                </div>
                                                                              )
                                                                            )
                                                                          : "-"}
                                                                      </td>
                                                                    )}
                                                                    {visibleFieldsCustomTemp.fees && (
                                                                      <td className="text-center">
                                                                        {ProposalObject.feeTypeId ===
                                                                          1 &&
                                                                          formatValue(
                                                                            price
                                                                          )}
                                                                        {ProposalObject.feeTypeId ===
                                                                          2 && (
                                                                          <span className="fa fa-check"></span>
                                                                        )}
                                                                      </td>
                                                                    )}
                                                                    {vatPercentage &&
                                                                      visibleFieldsCustomTemp.vatRate && (
                                                                        <td className="text-center">
                                                                          20%
                                                                        </td>
                                                                      )}
                                                                    {vatPercentage &&
                                                                      visibleFieldsCustomTemp.vat && (
                                                                        <td className="text-center">
                                                                          {ProposalObject.feeTypeId ===
                                                                            1 &&
                                                                            formatValue(
                                                                              vat
                                                                            )}
                                                                          {ProposalObject.feeTypeId ===
                                                                            2 && (
                                                                            <span className="fa fa-check"></span>
                                                                          )}
                                                                        </td>
                                                                      )}
                                                                    {vatPercentage &&
                                                                      visibleFieldsCustomTemp.feesIncVat && (
                                                                        <td className="text-center">
                                                                          {ProposalObject.feeTypeId ===
                                                                            1 &&
                                                                            formatValue(
                                                                              total
                                                                            )}
                                                                          {ProposalObject.feeTypeId ===
                                                                            2 && (
                                                                            <span className="fa fa-check"></span>
                                                                          )}
                                                                        </td>
                                                                      )}
                                                                  </tr>
                                                                );
                                                              }
                                                            )}
                                                          </>
                                                        );
                                                      }
                                                    )}

                                                    {/* === NET TOTAL ROW === */}
                                                    <tr className="head-row">
                                                      {/* {visibleFieldsCustomTemp.serviceCategory && (
          <td className="tr-table-class text-white">Net Total</td>
        )} */}
                                                      <td className="tr-table-class text-white">
                                                        Net Total
                                                      </td>
                                                      {visibleFieldsCustomTemp?.serviceCategory && (
                                                        <td></td>
                                                      )}
                                                      {visibleFieldsCustomTemp.serviceScope && (
                                                        <td></td>
                                                      )}
                                                      {visibleFieldsCustomTemp.fees && (
                                                        <td className="tr-table-class text-white text-center">
                                                          {Number(
                                                            RecurringPricingInfo.OriginalPrice
                                                          ) <
                                                            Number(
                                                              RecurringPricingInfo.DiscountedPrice
                                                            ) ||
                                                          (Number(
                                                            RecurringPricingInfo.Discount
                                                          ) > 0 &&
                                                            !ProposalObject.DiscountLines)
                                                            ? formatValue(
                                                                RecurringPricingInfo.DiscountedPrice
                                                              )
                                                            : formatValue(
                                                                RecurringPricingInfo.OriginalPrice
                                                              )}
                                                        </td>
                                                      )}
                                                      {vatPercentage &&
                                                        visibleFieldsCustomTemp.vatRate && (
                                                          <td></td>
                                                        )}
                                                      {vatPercentage &&
                                                        visibleFieldsCustomTemp.vat && (
                                                          <td className="tr-table-class text-white text-center">
                                                            {Number(
                                                              RecurringPricingInfo.OriginalPrice
                                                            ) <
                                                              Number(
                                                                RecurringPricingInfo.DiscountedPrice
                                                              ) ||
                                                            (Number(
                                                              RecurringPricingInfo.Discount
                                                            ) > 0 &&
                                                              !ProposalObject.DiscountLines)
                                                              ? formatValue(
                                                                  (Number(
                                                                    RecurringPricingInfo.DiscountedPrice
                                                                  ) *
                                                                    20) /
                                                                    100
                                                                )
                                                              : formatValue(
                                                                  (Number(
                                                                    RecurringPricingInfo.OriginalPrice
                                                                  ) *
                                                                    20) /
                                                                    100
                                                                )}
                                                          </td>
                                                        )}
                                                      {vatPercentage &&
                                                        visibleFieldsCustomTemp.feesIncVat && (
                                                          <td className="tr-table-class text-white text-center">
                                                            {Number(
                                                              RecurringPricingInfo.OriginalPrice
                                                            ) <
                                                              Number(
                                                                RecurringPricingInfo.DiscountedPrice
                                                              ) ||
                                                            (Number(
                                                              RecurringPricingInfo.Discount
                                                            ) > 0 &&
                                                              !ProposalObject.DiscountLines)
                                                              ? formatValue(
                                                                  Number(
                                                                    RecurringPricingInfo.DiscountedPrice
                                                                  ) +
                                                                    (Number(
                                                                      RecurringPricingInfo.DiscountedPrice
                                                                    ) *
                                                                      20) /
                                                                      100
                                                                )
                                                              : formatValue(
                                                                  Number(
                                                                    RecurringPricingInfo.OriginalPrice
                                                                  ) +
                                                                    (Number(
                                                                      RecurringPricingInfo.OriginalPrice
                                                                    ) *
                                                                      20) /
                                                                      100
                                                                )}
                                                          </td>
                                                        )}
                                                    </tr>

                                                    {/* === DISCOUNT + GRAND TOTAL ROWS === */}
                                                    {Number(
                                                      RecurringPricingInfo.Discount
                                                    ) > 0 &&
                                                      ProposalObject.DiscountLines && (
                                                        <>
                                                          <tr className="head-grey-row">
                                                            {visibleFieldsCustomTemp?.serviceCategory && (
                                                              <td className="tr-table-class font-14 text-white">
                                                                Discount
                                                              </td>
                                                            )}
                                                            {visibleFieldsCustomTemp.serviceName && (
                                                              <td></td>
                                                            )}
                                                            {visibleFieldsCustomTemp.serviceScope && (
                                                              <td></td>
                                                            )}
                                                            {visibleFieldsCustomTemp.fees && (
                                                              <td className="tr-table-class font-14 text-white text-center">
                                                                (-){" "}
                                                                {formatValue(
                                                                  RecurringPricingInfo.Discount
                                                                )}
                                                              </td>
                                                            )}
                                                            {vatPercentage &&
                                                              visibleFieldsCustomTemp.vatRate && (
                                                                <td></td>
                                                              )}
                                                            {vatPercentage &&
                                                              visibleFieldsCustomTemp.vat && (
                                                                <td className="tr-table-class text-white text-center">
                                                                  (-){" "}
                                                                  {Number(
                                                                    RecurringPricingInfo.OriginalPrice
                                                                  ) <
                                                                    Number(
                                                                      RecurringPricingInfo.DiscountedPrice
                                                                    ) ||
                                                                  (Number(
                                                                    RecurringPricingInfo.Discount
                                                                  ) > 0 &&
                                                                    !ProposalObject.DiscountLines)
                                                                    ? formatValue(
                                                                        ((Number(
                                                                          RecurringPricingInfo.DiscountedPrice
                                                                        ) *
                                                                          20) /
                                                                          100) *
                                                                          (RecurringPricingInfo.DefaultDiscount /
                                                                            100)
                                                                      )
                                                                    : formatValue(
                                                                        ((Number(
                                                                          RecurringPricingInfo.OriginalPrice
                                                                        ) *
                                                                          20) /
                                                                          100) *
                                                                          (RecurringPricingInfo.DefaultDiscount /
                                                                            100)
                                                                      )}
                                                                </td>
                                                              )}
                                                            {vatPercentage &&
                                                              visibleFieldsCustomTemp.feesIncVat && (
                                                                <td className="tr-table-class text-white text-center">
                                                                  (-){" "}
                                                                  {Number(
                                                                    RecurringPricingInfo.OriginalPrice
                                                                  ) <
                                                                    Number(
                                                                      RecurringPricingInfo.DiscountedPrice
                                                                    ) ||
                                                                  (Number(
                                                                    RecurringPricingInfo.Discount
                                                                  ) > 0 &&
                                                                    !ProposalObject.DiscountLines)
                                                                    ? formatValue(
                                                                        (Number(
                                                                          RecurringPricingInfo.DiscountedPrice
                                                                        ) +
                                                                          (Number(
                                                                            RecurringPricingInfo.DiscountedPrice
                                                                          ) *
                                                                            20) /
                                                                            100) *
                                                                          (RecurringPricingInfo.DefaultDiscount /
                                                                            100)
                                                                      )
                                                                    : formatValue(
                                                                        (Number(
                                                                          RecurringPricingInfo.OriginalPrice
                                                                        ) +
                                                                          (Number(
                                                                            RecurringPricingInfo.OriginalPrice
                                                                          ) *
                                                                            20) /
                                                                            100) *
                                                                          (RecurringPricingInfo.DefaultDiscount /
                                                                            100)
                                                                      )}
                                                                </td>
                                                              )}
                                                          </tr>

                                                          <tr className="head-row">
                                                            {visibleFieldsCustomTemp?.serviceCategory && (
                                                              <td className="tr-table-class font-14 text-white">
                                                                Grand Total
                                                              </td>
                                                            )}
                                                            {visibleFieldsCustomTemp.serviceName && (
                                                              <td></td>
                                                            )}
                                                            {visibleFieldsCustomTemp.serviceScope && (
                                                              <td></td>
                                                            )}
                                                            {visibleFieldsCustomTemp.fees && (
                                                              <td className="tr-table-class font-14 text-white text-center">
                                                                {Number(
                                                                  RecurringPricingInfo.OriginalPrice
                                                                ) <
                                                                  Number(
                                                                    RecurringPricingInfo.DiscountedPrice
                                                                  ) ||
                                                                (Number(
                                                                  RecurringPricingInfo.Discount
                                                                ) > 0 &&
                                                                  !ProposalObject.DiscountLines)
                                                                  ? formatValue(
                                                                      RecurringPricingInfo.DiscountedPrice -
                                                                        RecurringPricingInfo.Discount
                                                                    )
                                                                  : formatValue(
                                                                      RecurringPricingInfo.OriginalPrice -
                                                                        RecurringPricingInfo.Discount
                                                                    )}
                                                              </td>
                                                            )}
                                                            {vatPercentage &&
                                                              visibleFieldsCustomTemp.vatRate && (
                                                                <td></td>
                                                              )}
                                                            {vatPercentage &&
                                                              visibleFieldsCustomTemp.vat && (
                                                                <td className="tr-table-class font-14 text-white text-center">
                                                                  {Number(
                                                                    RecurringPricingInfo.OriginalPrice
                                                                  ) <
                                                                    Number(
                                                                      RecurringPricingInfo.DiscountedPrice
                                                                    ) ||
                                                                  (Number(
                                                                    RecurringPricingInfo.Discount
                                                                  ) > 0 &&
                                                                    !ProposalObject.DiscountLines)
                                                                    ? formatValue(
                                                                        (Number(
                                                                          RecurringPricingInfo.DiscountedPrice
                                                                        ) *
                                                                          20) /
                                                                          100 -
                                                                          ((Number(
                                                                            RecurringPricingInfo.DiscountedPrice
                                                                          ) *
                                                                            20) /
                                                                            100) *
                                                                            (RecurringPricingInfo.DefaultDiscount /
                                                                              100)
                                                                      )
                                                                    : formatValue(
                                                                        (Number(
                                                                          RecurringPricingInfo.OriginalPrice
                                                                        ) *
                                                                          20) /
                                                                          100 -
                                                                          ((Number(
                                                                            RecurringPricingInfo.OriginalPrice
                                                                          ) *
                                                                            20) /
                                                                            100) *
                                                                            (RecurringPricingInfo.DefaultDiscount /
                                                                              100)
                                                                      )}
                                                                </td>
                                                              )}
                                                            {vatPercentage &&
                                                              visibleFieldsCustomTemp.feesIncVat && (
                                                                <td className="tr-table-class font-14 text-white text-center">
                                                                  {formatValue(
                                                                    RecurringPricingInfo.GrandTotal
                                                                  )}
                                                                </td>
                                                              )}
                                                          </tr>
                                                        </>
                                                      )}
                                                  </tbody>
                                                </table>
                                              </div>
                                            )}

                                            {/* Recurring Service Standard*/}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {selectedOneOffServiceList?.length !== 0 && (
                                    <div className="tab-content">
                                      <div className="tab-pane p-3 active">
                                        <div className="row">
                                          <div className="col-lg-12">
                                            <div className="separator mb-2"></div>
                                            <h6>One-Off Services</h6>
                                            <div className="separator mb-3"></div>
                                            {ProposalObject.quoteTypeID !==
                                              4 && (
                                              <>
                                                <div className="row fieldset">
                                                  <div className="col-md-2 col-sm-12  text-md-end">
                                                    <label className="fieldset-label">
                                                      Original Price (
                                                      {getCurrencySymbol(
                                                        ProposalObject.currencyID
                                                      )}
                                                      )
                                                    </label>
                                                  </div>
                                                  <div className="col-md-10 col-sm-12">
                                                    <input
                                                      readonly=""
                                                      type="text"
                                                      class="input-text"
                                                      value={
                                                        Number(
                                                          Math.floor(
                                                            OneOffPricingInfo.OriginalPrice *
                                                              100
                                                          ) / 100
                                                        )
                                                          .toFixed(2)
                                                          .replace(
                                                            /\B(?=(\d{3})+(?!\d))/g,
                                                            ","
                                                          )

                                                        // formatValue(
                                                        //   OneOffPricingInfo.OriginalPrice
                                                        // )
                                                        //   OneOffPricingInfo.OriginalPrice.toString().replace(
                                                        //   /\B(?=(\d{3})+(?!\d))/g,
                                                        //   ","
                                                        // )
                                                      }
                                                    />
                                                  </div>
                                                </div>
                                                <div
                                                  class="row"
                                                  id="OneOff_Default"
                                                >
                                                  <div class="col-lg-2 mb-1 col-md-2 col-sm-12 mt-2 text-md-end">
                                                    <div class="mb-1 text-md-end">
                                                      <label class="form-label">
                                                        Discount (%)
                                                      </label>
                                                    </div>
                                                  </div>
                                                  <div class="col-lg-4 col-md-4 col-sm-12">
                                                    <input
                                                      readonly=""
                                                      class="input-text"
                                                      type="text"
                                                      placeholder="Discount (%)"
                                                      value={
                                                        Number(
                                                          Math.floor(
                                                            OneOffPricingInfo.DefaultDiscount *
                                                              100
                                                          ) / 100
                                                        )
                                                          .toFixed(2)
                                                          .replace(
                                                            /\B(?=(\d{3})+(?!\d))/g,
                                                            ","
                                                          )

                                                        // OneOffPricingInfo.DefaultDiscount
                                                      }
                                                    />
                                                  </div>
                                                  <div
                                                    style={{ padding: "0px" }}
                                                    class="col-lg-2 col-md-2 mt-2 col-sm-12"
                                                  >
                                                    <div class="mb-1  text-md-end">
                                                      <label class="form-label">
                                                        Discounted Price (
                                                        {getCurrencySymbol(
                                                          ProposalObject.currencyID
                                                        )}
                                                        )
                                                      </label>
                                                    </div>
                                                  </div>
                                                  <div class="col-lg-4 col-md-4 col-sm-12">
                                                    <input
                                                      readonly=""
                                                      class="input-text"
                                                      type="text"
                                                      placeholder={`Discounted Price (${getCurrencySymbol(
                                                        ProposalObject.currencyID
                                                      )})`}
                                                      value={
                                                        Number(
                                                          Math.floor(
                                                            OneOffPricingInfo.DiscountedPrice *
                                                              100
                                                          ) / 100
                                                        )
                                                          .toFixed(2)
                                                          .replace(
                                                            /\B(?=(\d{3})+(?!\d))/g,
                                                            ","
                                                          )

                                                        //     formatValue(
                                                        //   OneOffPricingInfo.DiscountedPrice
                                                        // )
                                                      }
                                                    />
                                                  </div>
                                                </div>
                                              </>
                                            )}
                                            <div className="mb-3"></div>
                                            {/* One-off Service */}
                                            {pricingTableColumnIDs === null ||
                                            pricingTableColumnIDs === "" ||
                                            pricingTableColumnIDs ===
                                              undefined ? (
                                              <div
                                                style={{ marginTop: "0px" }}
                                                className="table-responsive"
                                              >
                                                <table className="table align-middle table-nowrap">
                                                  <thead className="table-light table-header-font">
                                                    <tr className="head-row">
                                                      <th className="tr-table-class text-white">
                                                        Services
                                                      </th>
                                                      {ProposalObject.quoteTypeID !==
                                                        4 && (
                                                        <th className="tr-table-class text-white text-right">
                                                          Fees (
                                                          {getCurrencySymbol(
                                                            ProposalObject.currencyID
                                                          )}
                                                          )
                                                        </th>
                                                      )}
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {selectedOneOffServiceList.map(
                                                      (service, index) => {
                                                        return (
                                                          <>
                                                            <tr class="a-la-carte-services-review-head-row">
                                                              <th colspan="2">
                                                                {
                                                                  service.serviceCatName
                                                                }
                                                              </th>
                                                            </tr>
                                                            {service.servicesList.map(
                                                              (
                                                                subService,
                                                                subIndex
                                                              ) => {
                                                                return (
                                                                  <tr
                                                                    key={
                                                                      subIndex
                                                                    }
                                                                  >
                                                                    {/* */}
                                                                    <td>
                                                                      <div>
                                                                        {
                                                                          subService.serviceName
                                                                        }
                                                                      </div>
                                                                      <div class="package-variables"></div>
                                                                    </td>
                                                                    {ProposalObject.quoteTypeID !==
                                                                      4 && (
                                                                      <td className="text-right">
                                                                        {ProposalObject.feeTypeId ===
                                                                          1 && (
                                                                          <>
                                                                            {" "}
                                                                            {formatValue(
                                                                              subService.quotationPrice
                                                                            )}
                                                                          </>
                                                                        )}
                                                                        {ProposalObject.feeTypeId ===
                                                                          2 && (
                                                                          <span className="fa fa-check"></span>
                                                                        )}
                                                                      </td>
                                                                    )}
                                                                  </tr>
                                                                );
                                                              }
                                                            )}
                                                          </>
                                                        );
                                                      }
                                                    )}
                                                    {ProposalObject.quoteTypeID !==
                                                      4 && (
                                                      <tr className="head-row">
                                                        <td className="tr-table-class text-white">
                                                          Net Total
                                                        </td>
                                                        <td className="tr-table-class text-white text-right">
                                                          {" "}
                                                          {
                                                            Number(
                                                              OneOffPricingInfo.OriginalPrice
                                                            ) <
                                                              Number(
                                                                OneOffPricingInfo.DiscountedPrice
                                                              ) ||
                                                            (Number(
                                                              OneOffPricingInfo.Discount
                                                            ) > 0 &&
                                                              !ProposalObject.DiscountLines)
                                                              ? formatValue(
                                                                  OneOffPricingInfo.DiscountedPrice
                                                                )
                                                              : // Number(OneOffPricingInfo.DiscountedPrice)
                                                                //     .toFixed(2)
                                                                //     .toString()
                                                                //     .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                                formatValue(
                                                                  OneOffPricingInfo.OriginalPrice
                                                                )
                                                            //  Number(OneOffPricingInfo.OriginalPrice)
                                                            //     .toFixed(2)
                                                            //     .toString()
                                                            //     .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                          }
                                                        </td>
                                                      </tr>
                                                    )}
                                                    {Number(
                                                      OneOffPricingInfo.Discount
                                                    ) > 0 &&
                                                      ProposalObject.DiscountLines && (
                                                        <>
                                                          {" "}
                                                          <tr class="head-grey-row">
                                                            <td className="tr-table-class text-white">
                                                              Discount
                                                            </td>
                                                            <td className="tr-table-class text-white text-right">
                                                              (-){" "}
                                                              {formatValue(
                                                                OneOffPricingInfo.Discount
                                                              )}
                                                              {/* {OneOffPricingInfo.Discount.toFixed(2)
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} */}
                                                            </td>
                                                          </tr>
                                                          <tr class="head-row">
                                                            <td className="tr-table-class text-white">
                                                              Discounted Total
                                                            </td>
                                                            <td className="tr-table-class text-white text-right">
                                                              {" "}
                                                              {formatValue(
                                                                OneOffPricingInfo.DiscountedTotal
                                                              )}
                                                              {/* {Number(OneOffPricingInfo.DiscountedTotal)
                                  .toFixed(2)
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} */}
                                                            </td>
                                                          </tr>
                                                        </>
                                                      )}
                                                    {vatPercentage && (
                                                      <>
                                                        <tr class="head-grey-row">
                                                          <td className="tr-table-class text-white">
                                                            {getTaxName(
                                                              ProposalObject.currencyID
                                                            )}
                                                          </td>
                                                          <td className="tr-table-class text-white text-right">
                                                            {" "}
                                                            {
                                                              // formatValue(
                                                              //   OneOffPricingInfo.VATPrice
                                                              // )
                                                              formatValue(
                                                                totalOneOffServiceVAT
                                                              )
                                                              // Number(OneOffPricingInfo.VATPrice)
                                                              //   .toFixed(2)
                                                              //   .toString()
                                                              //   .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                            }
                                                          </td>
                                                        </tr>
                                                        <tr className="head-row">
                                                          <td className="tr-table-class text-white">
                                                            Grand Total
                                                          </td>
                                                          <td className="tr-table-class text-white text-right">
                                                            {" "}
                                                            {/* {
                                                              formatValue(
                                                                OneOffPricingInfo.GrandTotal
                                                              )
                                                            } */}
                                                            {formatValue(
                                                              Number(
                                                                OneOffPricingInfo.Discount
                                                              ) > 0
                                                                ? Number(
                                                                    OneOffPricingInfo.DiscountedTotal
                                                                  ) +
                                                                    Number(
                                                                      totalOneOffServiceVAT
                                                                    )
                                                                : Number(
                                                                    OneOffPricingInfo.OriginalPrice
                                                                  ) +
                                                                    Number(
                                                                      totalOneOffServiceVAT
                                                                    )
                                                            )}
                                                          </td>
                                                        </tr>
                                                      </>
                                                    )}
                                                  </tbody>
                                                </table>
                                              </div>
                                            ) : (
                                              <div
                                                style={{ marginTop: "0px" }}
                                                className="table-responsive"
                                              >
                                                <table className="table align-middle table-nowrap">
                                                  <thead className="table-dark text-white">
                                                    <tr className="head-row">
                                                      {visibleFieldsCustomTemp?.serviceCategory && (
                                                        <th
                                                          className="tr-table-class text-white text-center"
                                                          style={{
                                                            width: "16.66%",
                                                          }}
                                                        >
                                                          Service Category
                                                        </th>
                                                      )}
                                                      {visibleFieldsCustomTemp.serviceName && (
                                                        <th
                                                          className="tr-table-class text-white text-center"
                                                          style={{
                                                            width: "16.66%",
                                                          }}
                                                        >
                                                          Services
                                                        </th>
                                                      )}
                                                      {visibleFieldsCustomTemp.serviceScope && (
                                                        <th
                                                          className="tr-table-class text-white text-center"
                                                          style={{
                                                            width: "16.66%",
                                                          }}
                                                        >
                                                          Service scope
                                                        </th>
                                                      )}

                                                      {/* <th
                                className="tr-table-class text-white text-center"
                                style={{ width: "16.66%" }}
                                >
                                Scope value
                                </th> */}
                                                      {visibleFieldsCustomTemp.fees && (
                                                        <th
                                                          className="tr-table-class text-white text-center"
                                                          style={{
                                                            width: "16.66%",
                                                          }}
                                                        >
                                                          Fees (£)
                                                        </th>
                                                      )}
                                                      {visibleFieldsCustomTemp.vatRate && (
                                                        <th
                                                          className="tr-table-class text-white text-center"
                                                          style={{
                                                            width: "16.66%",
                                                          }}
                                                        >
                                                          VAT Rate
                                                        </th>
                                                      )}
                                                      {visibleFieldsCustomTemp.vat && (
                                                        <th
                                                          className="tr-table-class text-white text-center"
                                                          style={{
                                                            width: "16.66%",
                                                          }}
                                                        >
                                                          VAT (£)
                                                        </th>
                                                      )}
                                                      {visibleFieldsCustomTemp.feesIncVat && (
                                                        <th
                                                          className="tr-table-class text-white text-center"
                                                          style={{
                                                            width: "16.66%",
                                                          }}
                                                        >
                                                          Fees inc VAT (£)
                                                        </th>
                                                      )}
                                                    </tr>
                                                  </thead>

                                                  <tbody>
                                                    {selectedOneOffServiceList.map(
                                                      (service, index) => (
                                                        <>
                                                          {service.servicesList.map(
                                                            (
                                                              subService,
                                                              subIndex
                                                            ) => {
                                                              const price =
                                                                subService.price
                                                                  ? subService.price
                                                                  : subService.quotationPrice ||
                                                                    0;
                                                              const vat =
                                                                (price * 20) /
                                                                100;
                                                              const total =
                                                                price + vat;
                                                              const driverList =
                                                                subService.pricingDriverList ||
                                                                [];

                                                              return (
                                                                <tr
                                                                  key={`sub-${index}-${subIndex}`}
                                                                >
                                                                  {visibleFieldsCustomTemp?.serviceCategory && (
                                                                    <td className="text-center">
                                                                      {
                                                                        service.serviceCatName
                                                                      }
                                                                    </td>
                                                                  )}

                                                                  {visibleFieldsCustomTemp.serviceName && (
                                                                    <td className="text-center">
                                                                      {
                                                                        subService.serviceName
                                                                      }
                                                                    </td>
                                                                  )}

                                                                  {visibleFieldsCustomTemp.serviceScope && (
                                                                    <td className="text-center">
                                                                      {driverList.length >
                                                                      0
                                                                        ? driverList.map(
                                                                            (
                                                                              d,
                                                                              i
                                                                            ) => (
                                                                              <div
                                                                                key={
                                                                                  i
                                                                                }
                                                                              >
                                                                                {
                                                                                  d.driverName
                                                                                }{" "}
                                                                                ={" "}
                                                                                {
                                                                                  d.driverValue
                                                                                }
                                                                                {i !==
                                                                                  driverList.length -
                                                                                    1 &&
                                                                                  ", "}
                                                                              </div>
                                                                            )
                                                                          )
                                                                        : "-"}
                                                                    </td>
                                                                  )}

                                                                  {/* <td className="text-center">
                                            {driverList.length > 0
                                              ? driverList.map((d, i) => (
                                                  <div key={i}>
                                                    {d.driverValue}
                                        </div>
                                                ))
                                              : "-"}
                                          </td> */}

                                                                  {visibleFieldsCustomTemp.fees && (
                                                                    <td className="text-center">
                                                                      {ProposalObject.feeTypeId ===
                                                                        1 &&
                                                                        formatValue(
                                                                          price
                                                                        )}
                                                                      {ProposalObject.feeTypeId ===
                                                                        2 && (
                                                                        <span className="fa fa-check"></span>
                                                                      )}
                                                                    </td>
                                                                  )}

                                                                  {visibleFieldsCustomTemp.vatRate && (
                                                                    <td className="text-center">
                                                                      20%
                                                                    </td>
                                                                  )}

                                                                  {visibleFieldsCustomTemp.vat && (
                                                                    <td className="text-center">
                                                                      {ProposalObject.feeTypeId ===
                                                                        1 &&
                                                                        formatValue(
                                                                          vat
                                                                        )}
                                                                      {ProposalObject.feeTypeId ===
                                                                        2 && (
                                                                        <span className="fa fa-check"></span>
                                                                      )}
                                                                    </td>
                                                                  )}

                                                                  {visibleFieldsCustomTemp.feesIncVat && (
                                                                    <td className="text-center">
                                                                      {ProposalObject.feeTypeId ===
                                                                        1 &&
                                                                        formatValue(
                                                                          total
                                                                        )}
                                                                      {ProposalObject.feeTypeId ===
                                                                        2 && (
                                                                        <span className="fa fa-check"></span>
                                                                      )}
                                                                    </td>
                                                                  )}
                                                                </tr>
                                                              );
                                                            }
                                                          )}
                                                        </>
                                                      )
                                                    )}

                                                    {/* NET TOTAL ROW */}
                                                    <tr className="head-row">
                                                      {/* {visibleFieldsCustomTemp.serviceCategory && (
                                <td className="tr-table-class text-white">
                                  Net Total
                                </td>
                              )} */}
                                                      <td className="tr-table-class text-white">
                                                        Net Total
                                                      </td>
                                                      {visibleFieldsCustomTemp?.serviceCategory && (
                                                        <td></td>
                                                      )}
                                                      {visibleFieldsCustomTemp.serviceScope && (
                                                        <td></td>
                                                      )}
                                                      {visibleFieldsCustomTemp.fees && (
                                                        <td className="tr-table-class text-white text-center">
                                                          {Number(
                                                            OneOffPricingInfo.OriginalPrice
                                                          ) <
                                                            Number(
                                                              OneOffPricingInfo.DiscountedPrice
                                                            ) ||
                                                          (Number(
                                                            OneOffPricingInfo.Discount
                                                          ) > 0 &&
                                                            !ProposalObject.DiscountLines)
                                                            ? formatValue(
                                                                OneOffPricingInfo.DiscountedPrice
                                                              )
                                                            : formatValue(
                                                                OneOffPricingInfo.OriginalPrice
                                                              )}
                                                        </td>
                                                      )}
                                                      {visibleFieldsCustomTemp.vatRate && (
                                                        <td></td>
                                                      )}
                                                      {visibleFieldsCustomTemp.vat && (
                                                        <td className="tr-table-class text-white text-center">
                                                          {Number(
                                                            OneOffPricingInfo.OriginalPrice
                                                          ) <
                                                            Number(
                                                              OneOffPricingInfo.DiscountedPrice
                                                            ) ||
                                                          (Number(
                                                            OneOffPricingInfo.Discount
                                                          ) > 0 &&
                                                            !ProposalObject.DiscountLines)
                                                            ? formatValue(
                                                                (Number(
                                                                  OneOffPricingInfo.DiscountedPrice
                                                                ) *
                                                                  20) /
                                                                  100
                                                              )
                                                            : formatValue(
                                                                (Number(
                                                                  OneOffPricingInfo.OriginalPrice
                                                                ) *
                                                                  20) /
                                                                  100
                                                              )}
                                                        </td>
                                                      )}
                                                      {visibleFieldsCustomTemp.feesIncVat && (
                                                        <td className="tr-table-class text-white text-center">
                                                          {Number(
                                                            OneOffPricingInfo.OriginalPrice
                                                          ) <
                                                            Number(
                                                              OneOffPricingInfo.DiscountedPrice
                                                            ) ||
                                                          (Number(
                                                            OneOffPricingInfo.Discount
                                                          ) > 0 &&
                                                            !ProposalObject.DiscountLines)
                                                            ? formatValue(
                                                                Number(
                                                                  OneOffPricingInfo.DiscountedPrice
                                                                ) +
                                                                  (Number(
                                                                    OneOffPricingInfo.DiscountedPrice
                                                                  ) *
                                                                    20) /
                                                                    100
                                                              )
                                                            : formatValue(
                                                                Number(
                                                                  OneOffPricingInfo.OriginalPrice
                                                                ) +
                                                                  (Number(
                                                                    OneOffPricingInfo.OriginalPrice
                                                                  ) *
                                                                    20) /
                                                                    100
                                                              )}
                                                        </td>
                                                      )}
                                                    </tr>

                                                    {Number(
                                                      OneOffPricingInfo.Discount
                                                    ) > 0 &&
                                                      ProposalObject.DiscountLines && (
                                                        <>
                                                          <tr class="head-grey-row">
                                                            <td className="tr-table-class font-14 text-white">
                                                              Discount
                                                            </td>

                                                            {visibleFieldsCustomTemp?.serviceCategory && (
                                                              <td></td>
                                                            )}
                                                            {visibleFieldsCustomTemp.serviceScope && (
                                                              <td></td>
                                                            )}
                                                            {visibleFieldsCustomTemp.fees && (
                                                              <td className="tr-table-class text-white text-center">
                                                                {Number(
                                                                  OneOffPricingInfo.Discount
                                                                ) > 0
                                                                  ? formatValue(
                                                                      OneOffPricingInfo.Discount
                                                                    )
                                                                  : "-"}
                                                              </td>
                                                            )}
                                                            {visibleFieldsCustomTemp.vatRate && (
                                                              <td></td>
                                                            )}
                                                            {visibleFieldsCustomTemp.vat && (
                                                              <td className="tr-table-class text-white text-center">
                                                                (-){"  "}
                                                                {Number(
                                                                  OneOffPricingInfo.OriginalPrice
                                                                ) <
                                                                  Number(
                                                                    OneOffPricingInfo.DiscountedPrice
                                                                  ) ||
                                                                (Number(
                                                                  OneOffPricingInfo.Discount
                                                                ) > 0 &&
                                                                  !ProposalObject.DiscountLines)
                                                                  ? formatValue(
                                                                      ((Number(
                                                                        OneOffPricingInfo.DiscountedPrice
                                                                      ) *
                                                                        20) /
                                                                        100) *
                                                                        (OneOffPricingInfo.DefaultDiscount /
                                                                          100)
                                                                    )
                                                                  : formatValue(
                                                                      ((Number(
                                                                        OneOffPricingInfo.OriginalPrice
                                                                      ) *
                                                                        20) /
                                                                        100) *
                                                                        (OneOffPricingInfo.DefaultDiscount /
                                                                          100)
                                                                    )}
                                                              </td>
                                                            )}
                                                            {visibleFieldsCustomTemp.feesIncVat && (
                                                              <td className="tr-table-class text-white text-center">
                                                                (-){"  "}{" "}
                                                                {Number(
                                                                  OneOffPricingInfo.OriginalPrice
                                                                ) <
                                                                  Number(
                                                                    OneOffPricingInfo.DiscountedPrice
                                                                  ) ||
                                                                (Number(
                                                                  OneOffPricingInfo.Discount
                                                                ) > 0 &&
                                                                  !ProposalObject.DiscountLines)
                                                                  ? formatValue(
                                                                      (Number(
                                                                        OneOffPricingInfo.DiscountedPrice
                                                                      ) +
                                                                        (Number(
                                                                          OneOffPricingInfo.DiscountedPrice
                                                                        ) *
                                                                          20) /
                                                                          100) *
                                                                        (OneOffPricingInfo.DefaultDiscount /
                                                                          100)
                                                                    )
                                                                  : formatValue(
                                                                      (Number(
                                                                        OneOffPricingInfo.OriginalPrice
                                                                      ) +
                                                                        (Number(
                                                                          OneOffPricingInfo.OriginalPrice
                                                                        ) *
                                                                          20) /
                                                                          100) *
                                                                        (OneOffPricingInfo.DefaultDiscount /
                                                                          100)
                                                                    )}
                                                              </td>
                                                            )}
                                                          </tr>
                                                          <tr className="head-row">
                                                            <td className="tr-table-class font-14 text-white">
                                                              Grand Total
                                                            </td>

                                                            {visibleFieldsCustomTemp?.serviceCategory && (
                                                              <td></td>
                                                            )}
                                                            {visibleFieldsCustomTemp.serviceScope && (
                                                              <td></td>
                                                            )}
                                                            {visibleFieldsCustomTemp.fees && (
                                                              <td className="tr-table-class text-white text-center">
                                                                {formatValue(
                                                                  OneOffPricingInfo.DiscountedPrice
                                                                )}
                                                              </td>
                                                            )}
                                                            {visibleFieldsCustomTemp.vatRate && (
                                                              <td></td>
                                                            )}
                                                            {visibleFieldsCustomTemp.vat && (
                                                              <td className="tr-table-class text-white text-center">
                                                                {formatValue(
                                                                  (Number(
                                                                    OneOffPricingInfo.DiscountedPrice
                                                                  ) *
                                                                    20) /
                                                                    100
                                                                )}
                                                              </td>
                                                            )}
                                                            {visibleFieldsCustomTemp.feesIncVat && (
                                                              <td className="tr-table-class text-white text-center">
                                                                {formatValue(
                                                                  Number(
                                                                    OneOffPricingInfo.DiscountedPrice
                                                                  ) +
                                                                    (Number(
                                                                      OneOffPricingInfo.DiscountedPrice
                                                                    ) *
                                                                      20) /
                                                                      100
                                                                )}
                                                              </td>
                                                            )}
                                                          </tr>
                                                        </>
                                                      )}

                                                    {vatPercentage && (
                                                      <>
                                                        {/* <tr class="head-grey-row">
                                  <td className="tr-table-class font-14 text-white">
                                    VAT
                                  </td>
                                  <td className="tr-table-class font-14 text-white text-right">
                                    {" "}
                                    {formatValue(
                                      OneOffPricingInfo.VATPrice
                                    )}
                                  </td>
                                </tr> */}
                                                        {/* <tr className="head-row">
                                  <td className="tr-table-class font-14 text-white">
                                    Grand Total
                                  </td>
                                  <td></td>
                                  <td className="tr-table-class font-14 text-white text-center">
                                    {" "}
                                    {formatValue(
                                      OneOffPricingInfo.GrandTotal
                                    )}
                                  </td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                </tr> */}
                                                      </>
                                                    )}
                                                  </tbody>
                                                </table>
                                                {/* <div
                        dangerouslySetInnerHTML={{
                          __html: currentPricingTableDesignRecurring,
                        }}
                      /> */}
                                              </div>
                                            )}

                                            {/* One-off Service */}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                            <div class="tab-pane" id="Officer" role="tabpanel">
                              <div
                                class="tab-pane active"
                                id="Officer"
                                role="tabpanel"
                              >
                                <table className="table table-striped fs-13 view-details-table">
                                  <tbody>
                                    {officersForm.map((prospect, index) => (
                                      <React.Fragment key={index}>
                                        <tr>
                                          <th colspan="2">
                                            Officer {index + 1}
                                          </th>
                                        </tr>

                                        <tr>
                                          {(ProposalObject.clientMasterBusinessTypeID ===
                                            3 ||
                                            ProposalObject.clientMasterBusinessTypeID ===
                                              4 ||
                                            ProposalObject.clientMasterBusinessTypeID ===
                                              5) && (
                                            <>
                                              <td>Authorised </td>
                                              <td className="text-end">
                                                {officersForm[index]
                                                  ?.isAuthorisedSignatory
                                                  ? "Yes"
                                                  : "NO"}
                                                <Switch
                                                  checked={
                                                    officersForm[index]
                                                      ?.isAuthorisedSignatory
                                                  }
                                                  disabled
                                                  color="primary"
                                                />
                                              </td>
                                            </>
                                          )}
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

                                        {/* <tr>
                                          {(basicInfo.originalBusinessTypeID ===
                                            CLIENT_TYPES.Sole_Trader ||
                                            basicInfo.originalBusinessTypeID ===
                                              CLIENT_TYPES.Other ||
                                            basicInfo.originalBusinessTypeID ===
                                              CLIENT_TYPES.Partnership) && (
                                            <td>Residential Address</td>
                                          )}
                                          {(basicInfo.originalBusinessTypeID ===
                                            CLIENT_TYPES.Company ||
                                            basicInfo.originalBusinessTypeID ===
                                              CLIENT_TYPES.LLP) && (
                                            <td>Correspondence Address</td>
                                          )}

                                          <td className="text-right">
                                            {
                                              concatenatedResidentialAddress[
                                                index
                                              ]?.officersFullAddress
                                            }
                                          </td>
                                        </tr> */}
                                        <tr>
                                          <td
                                            class="break-table"
                                            colspan="2"
                                          ></td>
                                        </tr>
                                      </React.Fragment>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* end card  */}
                  </div>
                </div>
                {/* end col */}
              </div>
              {/* end col  */}
            </div>
            {/* end row */}

            {/* end modal  */}
          </div>
          {/* container-fluid  */}
        </div>
        {/* End Page-content */}

        <Footer />
      {/* </div> */}

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

export default View_Proposals;
