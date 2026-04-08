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
import { statusID } from "../../Middleware/enums";
import { Base_Url } from "../../Base-Url/Base_Url";

const View_Proposals = () => {
  const common = useSelector((state) => state.Storage);
  const [selectedRecurringServiceList, setSelectedRecurringServiceList] =
    useState([]);
  const [selectedOneOffServiceList, setSelectedOneOffServiceList] = useState(
    []
  );
  const [acceptedPackageIndex, setAcceptedIndex] = useState(false);
  const [visibleCount, setVisibleCount] = useState(1);

  const [acceptedPackageName, setAcceptedAcceptedName] = useState("");

  const [modelRequestData, setModelRequestData] = useState({
    ModuleName: null,
    ProposalId: null,
    keyID: null,
    SearchKeyword: "",
  });
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
    getTaxName,
    getCurrencySymbol,
  } = useContext(AuthContextProvider);
  const navigate = useNavigate();

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

  return (
    <div className="container">
      <div class="main-content">
        <div class="page-content page-background prospect-bg">
          <div class="page-info-header page-info-strip">
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
          </div>
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
                                                                .length > 10 ? (
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
                                                                  key={subIndex}
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

                                                        {packageCount >= 2 && (
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
                                                                  RecurringPricingInfo.DiscountPercentagePackageTwo
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
                                                              <div></div>
                                                            </div>
                                                          </td>
                                                        )}

                                                        {packageCount === 3 && (
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
                                                                  RecurringPricingInfo.DiscountPercentagePackageThree
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
                                                        fontSize: getFontStyles(
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
                                                                currency: "GBP",
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
                                                                  ).fontWeight,
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
                                                                  ).fontWeight,
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
                                                                currency: "GBP",
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
                                                                  ).fontWeight,
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
                                                                  ).fontWeight,
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
                                                            {formatValue(
                                                              RecurringPricingInfo.PackageTwoVaTPrice
                                                            )}
                                                          </td>
                                                        )}
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
                                                            {formatValue(
                                                              RecurringPricingInfo.PackageTwoGrandTotal
                                                            )}
                                                          </td>
                                                        )}
                                                        {packageCount == 3 && (
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
                                                                .length > 10 ? (
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
                                                                  key={subIndex}
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

                                                        {packageCount >= 2 && (
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
                                                                  OneOffPricingInfo.DiscountPercentagePackageTwo
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
                                                              <div></div>
                                                            </div>
                                                          </td>
                                                        )}

                                                        {packageCount === 3 && (
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
                                                                  OneOffPricingInfo.DiscountPercentagePackageThree
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
                                                                currency: "GBP",
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
                                                                  ).fontWeight,
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
                                                                  ).fontWeight,
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
                                                                currency: "GBP",
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
                                                                  ).fontWeight,
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
                                                                  ).fontWeight,
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
                                                            {formatValue(
                                                              OneOffPricingInfo.PackageTwoVaTPrice
                                                            )}
                                                          </td>
                                                        )}
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
                                                            {formatValue(
                                                              OneOffPricingInfo.PackageTwoGrandTotal
                                                            )}
                                                          </td>
                                                        )}
                                                        {packageCount == 3 && (
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
                                                                  key={subIndex}
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
                                                            formatValue(
                                                              RecurringPricingInfo.VATPrice
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
                                                          {
                                                            formatValue(
                                                              RecurringPricingInfo.GrandTotal
                                                            )
                                                            // Number(RecurringPricingInfo.GrandTotal)
                                                            //   .toFixed(2)
                                                            //   .toString()
                                                            //   .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                          }
                                                        </td>
                                                      </tr>
                                                    </>
                                                  )}
                                                </tbody>
                                              </table>
                                            </div>
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
                                                                  key={subIndex}
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
                                                            formatValue(
                                                              OneOffPricingInfo.VATPrice
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
                                                          {
                                                            formatValue(
                                                              OneOffPricingInfo.GrandTotal
                                                            )
                                                            // Number(OneOffPricingInfo.GrandTotal)
                                                            //   .toFixed(2)
                                                            //   .toString()
                                                            //   .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                          }
                                                        </td>
                                                      </tr>
                                                    </>
                                                  )}
                                                </tbody>
                                              </table>
                                            </div>
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

export default View_Proposals;
