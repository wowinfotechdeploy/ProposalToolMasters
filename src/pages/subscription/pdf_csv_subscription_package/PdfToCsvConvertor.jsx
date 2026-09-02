import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, Col, Row } from "reactstrap";
import { Tooltip } from "@mui/material";
import Select from "react-select";
import dayjs from "dayjs";
import axios from "axios";

import { AuthContextProvider } from "../../../AuthContext/AuthContext";
import BackButtonSvg from "../../../components/BackButtonSvg";
import {
  ChoosePlanApi,
  CreateStripeCheckoutSession,
} from "../../../redux/Services/Setting/PaymentGatewayApi";
import {
  BuyPDFToCSVPlan,
  ChoosePDFToCSVPlanApi,
  getPreviouslyConvertedList,
  GetSubscriptionHistoryAPI,
  remainingPageCountAPI,
  uploadPdfForConversion,
} from "../../../redux/Services/PDFToCSVAPI/PDFToCSVAPI";
import { useSelector } from "react-redux";
import SuccessModal from "../../../components/SuccessModal";
import NoResultFoundModel from "../../../components/NoResultFoundModel";
import PaginationComponent from "../../../components/PaginationModel";
import NoSubscriptionModal from "../../../components/NoSubscriptionModal";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { GetOrganisationLookupList } from "../../../redux/Services/Master/OrganisationLookupList";
import { CalenderFilterEnum, PDFToCSVToggle } from "../../../Middleware/enums";
import Utils from "../../../Middleware/Utils";
import DatePicker from "react-date-picker";
import CurruptedFileFormate from "../../../components/CurruptedFileFormate";
import "./PDFToCSVRedesign.css";

import * as pdfjsLib from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.js";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

function PdfToCsvConvertorModel(props) {
  const [pdfFile, setPdfFile] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [hasSubcription, setHasSubcription] = useState(true);
  const [toggleID, setToggleID] = useState(1);
  const [convertablePageCount, setConvertablePageCount] = useState(10);
  const [previouslyConvertedFiles, setPreviouslyConvertedFiles] = useState([]);
  const [pdfToCSVSubscriptionHistory, setPDFToCSVSubscriptionHistory] =
    useState([]);
  const [totalRecords, setTotalRecords] = useState(-1);
  const [totalMontlyRemainingPages, setTotalMontlyRemainingPages] = useState(0);
  const [totalOneOffRemainingPages, setTotalOneOffRemainingPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pagesInUploadedPDF, setPagesInUploadedPDF] = useState(null);
  const [enoughPages, setEnoughPages] = useState(true);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openNosubscriptionModal, setOpenNosubscriptionModal] = useState(false);
  const [openCurruptedFileModal, setOpenCurruptedFileModal] = useState(false);
  const [remainingCount, setRemainingCount] = useState(null);
  const [totalPagesUsed, setTotalPagesUsed] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const [pagesPackages, setPagesPackages] = useState([]);
  const [selectedOption, setSelectedOption] = useState(Utils.CalenderFilter[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [fromDateForFilter, setFromDateForFilter] = useState(null);
  const [toDateForFilter, setToDateForFilter] = useState(null);

  const [pdfToCSVSubscriptionStatus, setPDFToCSVSubscriptionStatus] =
    useState(null); // Basically tells us if the user ever purchased the pages package or they ran out of the pages.

  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs().add(0, "day"));
  const {
    setLoader,
    EngagementName,
    proposalName,
    formatValue,
    formatValueWithoutCurrencySymbol,
    setListCount,
    listCount,
    isMobile,
    isMobileRecords,
    desktopRecords,
    setTopbar,
    GetCustomDate,
    getCurrencySymbol,
  } = useContext(AuthContextProvider);
  //   const [convertedFiles, setConvertedFiles] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionCompleted, setConversionCompleted] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [pageNo, setPageNo] = useState();
  const [pageSize, setPageSize] = useState(6);
  const API_KEY = `828c1ceb-7702-4a15-a71b-c4f186884dc1`;
  const common = useSelector((state) => state.Storage);
  // const plan = JSON.parse(localStorage.getItem("subscriptionPlan"));
  // const remainingCount = plan?.remaningPDFtoCSVPages || 0;

  const currencySymbol = getCurrencySymbol(common.currencyID);

  const navigate = useNavigate();
  // const pageSize = isMobile
  //   ? isMobileRecords
  //   : desktopRecords > 5 && window.innerHeight == 652
  //   ? 5
  //   : desktopRecords;

  useEffect(() => {
    ChoosePlanApiModelData();
  }, []);

  useEffect(() => {
    OrganisationLookupList();
  }, [conversionCompleted]);

  // useEffect(() => {
  //   if (!enoughPages) {
  //     setOpenNosubscriptionModal(true);
  //   }
  // }, [enoughPages]);

  useEffect(() => {
    RemainingPageCount(common.organisationKeyID);
    GetPreviouslyConvertedFilesList();
  }, [conversionCompleted]);

  useEffect(() => {
    GetSubscriptionHistory(common.organisationKeyID);
  }, []);

  const setInitialData = () => {
    setPdfFile(null);
  };

  const OrganisationLookupList = async () => {
    try {
      const res = await GetOrganisationLookupList(common.userKeyID);
      if (res?.data?.statusCode === 200) {
        if (res?.data?.responseData?.data) {
          const OrganisationsListData = res.data.responseData.data;
          const CurrentOrganisation = OrganisationsListData.find(
            (item) => item.organisationKeyID === common.organisationKeyID,
          );
          setRemainingCount(
            CurrentOrganisation.subscriptionPlan
              .availablePages_SubscriptionPackage,
          );
          setPDFToCSVSubscriptionStatus(
            CurrentOrganisation.subscriptionPlan.enablePdfToCsv,
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setError("");
      setCsvData(null);

      const reader = new FileReader();

      reader.onload = async function () {
        const typedArray = new Uint8Array(reader.result);

        try {
          const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
          const totalPages = pdf.numPages;

          setPagesInUploadedPDF(totalPages);
          setEnoughPages(false);
          if (totalPages > remainingCount) {
            setOpenNosubscriptionModal(true);
            handleRemoveFile();
          }
          // console.log("Total Pages:", totalPages);
          // setPdfPageCount(totalPages);
        } catch (err) {
          console.log("Error reading PDF:", err);
          setError("Failed to read the PDF.");
        }
      };

      reader.readAsArrayBuffer(file);
    } else {
      setError("Please upload a valid PDF file.");
    }
  };

  const handleConvert = async () => {
    if (!pdfFile) {
      setError("No file selected.");
      return;
    }
    setLoader(true);
    setConversionCompleted(false);
    setIsConverting(true);
    setError("");

    try {
      const res = await uploadPdfForConversion({
        organisationKeyID: common.organisationKeyID,
        userKeyID: common.userKeyID,
        pdfFile: pdfFile,
      });

      if (res.status === 200) {
        setLoader(false);
        setIsConverting(false);
        setInitialData();
        handleClearFile();
        setConversionCompleted(true);
        setOpenSuccessModal(true);
      } else {
        setLoader(false);
        setIsConverting(false);
        setOpenCurruptedFileModal(true);
        handleRemoveFile();
        setErrorMessage(res.response.data.errorMessage);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  const GetPreviouslyConvertedFilesList = async (startDate, endDate) => {
    // debugger;
    setLoader(true);
    // const pageNoList = i - 1;
    try {
      const res = await getPreviouslyConvertedList({
        pageSize: 30,
        pageNo: 0,
        organisationKeyID: common.organisationKeyID,
        searchKeyword: null,
        userKeyID: common.userKeyID,
        fromDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : null,
        toDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : null,
      });
      if (res.status === 200) {
        setLoader(false);
        const listData = res.data.responseData.data;
        const totalConsumed = listData.reduce(
          (sum, item) => sum + item.pagesProcessed,
          0,
        );

        setTotalPagesUsed(totalConsumed);
        // setTotalMontlyRemainingPages(res.data.remainingMainPackagePages);
        // setTotalOneOffRemainingPages(res.data.remainingTopupPackagePages);

        // if (pageNo > 0 && listData.length === 0) {
        //   let newPaneNo = Number(pageNoList);
        //   if (newPaneNo > 1) {
        //     newPaneNo = newPaneNo - 1;
        //   }
        //   GetPreviouslyConvertedFilesList(newPaneNo);
        //   setCurrentPage(pageNoList);
        //   return;
        // }
        setPreviouslyConvertedFiles(listData);
        setListCount(res.data.totalCount);
        setTotalRecords(listData.length);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  const [convertedFiles, setConvertedFiles] = useState([
    {
      fileName: "invoice_march_2025.pdf",
      convertedAt: "2025-06-05 10:15 AM",
      csvContent: `Item,Quantity,Price\nApple,10,200\nBanana,5,50`,
    },
    {
      fileName: "client_list_april.pdf",
      convertedAt: "2025-06-03 3:45 PM",
      csvContent: `Name,Email,Phone\nAmit Sharma,amit@example.com,9876543210\nPriya Patel,priya@example.com,9123456780`,
    },
    {
      fileName: "sales_report_q1.pdf",
      convertedAt: "2025-05-28 11:00 AM",
      csvContent: `Product,Region,Sales\nShoes,West,15000\nBags,North,12000`,
    },
  ]);

  const CreateStripeCheckoutSessionRedirection = async (
    userKeyID,
    InvoiceKeyID,
  ) => {
    setLoader(true);

    try {
      const response = await CreateStripeCheckoutSession(
        userKeyID,
        InvoiceKeyID,
      );
      const data = response.data;

      if (data.statusCode === 200) {
        const sessionURL = data.responseData.sessionURL;
        setLoader(false);

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

  const ChoosePlanApiModelData = async () => {
    try {
      const data = await ChoosePDFToCSVPlanApi(common.userKeyID);
      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          const ModelData = data?.data?.responseData?.data;

          setPagesPackages(ModelData);
        }
      } else {
        setErrorMessage(data?.data?.errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const BuyPlanData = async (i, pcspKeyID) => {
    setLoader(true);
    try {
      const data = await BuyPDFToCSVPlan({
        organisationKeyID: common.organisationKeyID,
        userKeyID: common.userKeyID,
        pcspKeyID: pcspKeyID,
      });

      if (data && data?.data?.statusCode === 200) {
        setLoader(false);

        const invoiceKeyID = data.data.responseData.invoiceKeyID;
        const finalBillingAmount = data.data.responseData.finalBillingAmount;
        if (finalBillingAmount !== null) {
          CreateStripeCheckoutSessionRedirection(
            common.userKeyID,
            invoiceKeyID,
          );
        } else {
          navigate("/pdf-to-csv");
        }

        // setOpenSuccessModal(true); // Open success modal upon successful purchase
        // Additional logic if needed
      } else {
        setLoader(false);
        setErrorMessage(data?.data?.errorMessage);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  const RemainingPageCount = async (organisationKeyID) => {
    setLoader(true);
    // debugger;
    try {
      const res = await remainingPageCountAPI(organisationKeyID);
      if (res.status === 200) {
        setLoader(false);
        const counts = res.data.responseData.data;

        setTotalMontlyRemainingPages(counts.remainingMainPackagePages);
        setTotalOneOffRemainingPages(counts.remainingTopupPackagePages);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  const GetSubscriptionHistory = async (organisationKeyID) => {
    // debugger;
    setLoader(true);
    try {
      const data = await GetSubscriptionHistoryAPI(organisationKeyID);

      if (data && data?.data?.statusCode === 200) {
        setLoader(false);

        setPDFToCSVSubscriptionHistory(data.data.responseData.data);
      } else {
        setLoader(false);
        setErrorMessage(data?.data?.errorMessage);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  const handleRemoveFile = () => {
    setPdfFile(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePageChange = async (pageNumber) => {
    setCurrentPage(pageNumber);
    await GetPreviouslyConvertedFilesList(pageNumber); // Call your function with the selected page number
  };

  const chooseApiData = [
    {
      subscriptionPackageKeyID: "0ff66006-7bba-4157-9cb9-b5f871b9853b",
      packageName: "Free",
      isFreePackage: true,
      apiIntegration: false,
      isMailBox: null,
      prepareQuote: true,
      sendQuote: true,
      prepareContract: true,
      sendContract: true,
      signContract: true,
      eSignaturePerMonth: 5,
      yearlyValuePlan: 0.0,
      discountPercentage: null,
      discountPrice: null,
      monthFree: null,
      getMonths: null,
      inPriceOfMonth: null,
      monthlyOffer: [],
      yearlyOffer: [],
    },
    {
      subscriptionPackageKeyID: "35092371-c544-4ae9-b607-8f749646dc17",
      packageName: "Premium",
      isFreePackage: false,
      apiIntegration: false,
      isMailBox: true,
      prepareQuote: true,
      sendQuote: true,
      prepareContract: true,
      sendContract: true,
      signContract: true,
      eSignaturePerMonth: 50,
      yearlyValuePlan: 360.0,
      discountPercentage: null,
      discountPrice: null,
      monthFree: null,
      getMonths: null,
      inPriceOfMonth: null,
      monthlyOffer: [],
      yearlyOffer: [
        {
          offerID: "DiscountPrice",
          offerName: "Get at £300.00",
          value: "300.00",
        },
      ],
    },
    {
      subscriptionPackageKeyID: "cd87c6c2-f474-4b1b-8669-fe8854abb06e",
      packageName: "Unlimited",
      isFreePackage: false,
      apiIntegration: true,
      isMailBox: true,
      prepareQuote: true,
      sendQuote: true,
      prepareContract: true,
      sendContract: true,
      signContract: true,
      eSignaturePerMonth: 999,
      yearlyValuePlan: 3000.0,
      discountPercentage: null,
      discountPrice: null,
      monthFree: null,
      getMonths: null,
      inPriceOfMonth: null,
      monthlyOffer: [],
      yearlyOffer: [
        {
          offerID: "DiscountPrice",
          offerName: "Get at £2000.00",
          value: "2000.00",
        },
      ],
    },
    {
      subscriptionPackageKeyID: "3e04f731-2cb0-4c35-acd1-4c53bebe3710",
      packageName: "Test Package",
      isFreePackage: false,
      apiIntegration: true,
      isMailBox: true,
      prepareQuote: true,
      sendQuote: true,
      prepareContract: true,
      sendContract: true,
      signContract: true,
      eSignaturePerMonth: 100,
      yearlyValuePlan: 1.0,
      discountPercentage: null,
      discountPrice: null,
      monthFree: null,
      getMonths: null,
      inPriceOfMonth: null,
      monthlyOffer: [],
      yearlyOffer: [],
    },
  ];

  const isYearly = true;

  const handleCloseNoSubscriptionModal = () => {
    setOpenNosubscriptionModal(false);
  };

  const upgradeBtnClicked = () => {
    setOpenNosubscriptionModal(false);
    setHasSubcription(false);
    setToggleID(PDFToCSVToggle.Upgrade);
  };

  const handleButtonClick = async (i, pcspKeyID) => {
    // Pass the value of 'i' and 'searchKeywordValue' into the BuyPlanData function
    BuyPlanData(i, pcspKeyID);
    // Your logic after BuyPlanData completes, if needed
  };

  const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const subScriptionPlanList = [
    {
      email: "john.doe@example.com",
      mobileNumber: "Package_test",
      packageName: "Basic Plan",
      packagePrice: 999,
      subscriptionStartDate: "2025-01-01",
      // nextRenewalDate: "2026-01-01",
      // finalBillingAmount: 999,
      // paymentStatus: "Paid",
      // hostedInvoiceUrl: "https://example.com/invoice/john",
      subscriptionStatus: "Active",
    },
    {
      email: "jane.smith@example.com",
      mobileNumber: "Package1",
      packageName: "Standard Plan",
      packagePrice: 1999,
      subscriptionStartDate: "2024-07-01",
      // nextRenewalDate: "2025-07-01",
      // finalBillingAmount: 1999,
      // paymentStatus: "Unpaid",
      // hostedInvoiceUrl: null,
      subscriptionStatus: "Pending",
    },
    {
      email: "alex.johnson@example.com",
      mobileNumber: "Page_Package",
      packageName: "Premium Plan",
      packagePrice: 2999,
      subscriptionStartDate: null,
      // nextRenewalDate: null,
      // finalBillingAmount: 0,
      // paymentStatus: "Free",
      // hostedInvoiceUrl: null,
      subscriptionStatus: "InActive",
    },
    {
      email: "maria.garcia@example.com",
      mobileNumber: "Page Package test",
      packageName: "Enterprise Plan",
      packagePrice: 4999,
      subscriptionStartDate: "2024-05-15",
      // nextRenewalDate: "2025-05-15",
      // finalBillingAmount: 4999,
      // paymentStatus: "Paid",
      // hostedInvoiceUrl: "https://example.com/invoice/maria",
      subscriptionStatus: "Expired",
    },
    {
      email: "david.lee@example.com",
      mobileNumber: "test package",
      packageName: "Startup Plan",
      packagePrice: 1499,
      subscriptionStartDate: "2025-03-10",
      // nextRenewalDate: "2026-03-10",
      // finalBillingAmount: 1499,
      // paymentStatus: "Unpaid",
      // hostedInvoiceUrl: null,
      subscriptionStatus: "Active",
    },
  ];

  const formatWithCommas = (value) => {
    return new Intl.NumberFormat("en-GB", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(value);
  };

  const handleCalenderFilterChange = (selectedOption) => {
    const dateFormat = "mm-dd-yyyy";
    setSelectedOption(selectedOption);
    switch (selectedOption.value) {
      case CalenderFilterEnum.All:
        GetPreviouslyConvertedFilesList(null, null);
        setShowDatePicker(false);
        break;
      case CalenderFilterEnum.This_Week:
        setFromDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Week).fromDate,
        );
        setToDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Week).toDate,
        );

        GetPreviouslyConvertedFilesList(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Week).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Week).toDate,
        );
        setShowDatePicker(false);
        break;
      case CalenderFilterEnum.Last_Week:
        setFromDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Week).fromDate,
        );
        setToDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Week).toDate,
        );
        GetPreviouslyConvertedFilesList(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Week).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Week).toDate,
        );
        setShowDatePicker(false);
        break;
      case CalenderFilterEnum.This_Month:
        setFromDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Month).fromDate,
        );
        setToDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Month).toDate,
        );
        GetPreviouslyConvertedFilesList(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Month).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Month).toDate,
        );
        setShowDatePicker(false);
        break;
      case CalenderFilterEnum.Last_Month:
        setFromDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Month).fromDate,
        );
        setToDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Month).toDate,
        );
        GetPreviouslyConvertedFilesList(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Month).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Month).toDate,
        );
        setShowDatePicker(false);
        break;
      case CalenderFilterEnum.This_Quarter:
        setFromDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Quarter).fromDate,
        );
        setToDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Quarter).toDate,
        );
        GetPreviouslyConvertedFilesList(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Quarter).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Quarter).toDate,
        );
        setShowDatePicker(false);
        break;
      case CalenderFilterEnum.Last_Quarter:
        setFromDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Quarter).fromDate,
        );
        setToDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Quarter).toDate,
        );
        GetPreviouslyConvertedFilesList(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Quarter).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Quarter).toDate,
        );
        setShowDatePicker(false);
        break;
      case CalenderFilterEnum.This_6_Months:
        setFromDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_6_Months).fromDate,
        );
        setToDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_6_Months).toDate,
        );
        GetPreviouslyConvertedFilesList(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_6_Months).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.This_6_Months).toDate,
        );
        setShowDatePicker(false);
        break;
      case CalenderFilterEnum.Last_6_Months:
        setFromDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_6_Months).fromDate,
        );
        setToDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_6_Months).toDate,
        );
        GetPreviouslyConvertedFilesList(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_6_Months).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_6_Months).toDate,
        );
        setShowDatePicker(false);
        break;
      case CalenderFilterEnum.This_Year:
        setFromDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Year).fromDate,
        );
        setToDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Year).toDate,
        );
        GetPreviouslyConvertedFilesList(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Year).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Year).toDate,
        );
        setShowDatePicker(false);
        break;
      case CalenderFilterEnum.Last_Year:
        const dates = GetCustomDate(dateFormat, selectedOption.value);
        setFromDateForFilter(dates.fromDate);
        setToDateForFilter(dates.toDate);
        GetPreviouslyConvertedFilesList(dates.fromDate, dates.toDate);
        setShowDatePicker(false);
        setFromDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Year).fromDate,
        );
        setToDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Year).toDate,
        );
        GetPreviouslyConvertedFilesList(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Year).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Year).toDate,
        );
        setShowDatePicker(false);
        break;
      case CalenderFilterEnum.Custom_Date_Range:
        setShowDatePicker(true);
        // Handle custom date range selection, if needed
        break;
      default:
        // Handle default case
        break;
    }
    // GetPreviouslyConvertedFilesList(fromDate, toDate);
  };

  const handleFromDateChange = (newValue) => {
    if (dayjs(newValue).isValid()) {
      const newFromDate = dayjs(newValue);
      setFromDate(newFromDate);
      setFromDateForFilter(newFromDate);
      // setFromDateForExport(newFromDate);
      if (newFromDate.isAfter(toDate)) {
        const newToDate = newFromDate.add(1, "day");
        setToDate(newToDate);
        setToDateForFilter(newToDate);
        // setToDateForExport(newToDate);
      }
      // DashboardCountData(newFromDate, toDate);
    }
  };
  const handleToDateChange = (newValue) => {
    if (dayjs(newValue).isValid()) {
      const newToDate = dayjs(newValue);
      setToDate(newToDate);
      setToDateForFilter(newToDate);
      // setToDateForExport(newToDate);
      if (newToDate.isBefore(fromDate)) {
        const newFromDate = newToDate.subtract(1, "day");
        setFromDate(newFromDate);
        setFromDateForFilter(newFromDate);
        // setFromDateForExport(newFromDate);
      }
      // DashboardCountData(fromDate, newToDate);
    }
  };

  return (
    <div className="pdfcsv-page-root">
      <div className="container-fluid new-item-page-container mt-4">
        {toggleID === PDFToCSVToggle.Convertor ? (
          <div className="pdfcsv-redesign">
            {/* =========================
                HEADER
                ========================= */}
            <div className="pdfcsv-header">
              <div className="pdfcsv-header__left">
                <h3 className="modal-title pdfcsv-page-title">
                  <BackButtonSvg onClick={() => navigate("/")} />
                  PDF To CSV
                </h3>
              </div>

              <div className="pdfcsv-header__actions">
                <button
                  className="btn pdfcsv-secondary-btn"
                  onClick={() => setToggleID(PDFToCSVToggle.MySubscription)}
                >
                  PDF To CSV Subscription
                </button>

                <button
                  className="btn pdfcsv-primary-btn"
                  onClick={() => setToggleID(PDFToCSVToggle.Upgrade)}
                >
                  Upgrade
                </button>
              </div>
            </div>

            {/* =========================
                PAGE USAGE CARDS
                ========================= */}
            <div className="pdfcsv-usage-grid">
              <article className="pdfcsv-usage-card">
                <div>
                  <div className="pdfcsv-usage-card__label">
                    Total Pages Used
                  </div>
                  <div className="pdfcsv-usage-card__value">
                    {formatWithCommas(totalPagesUsed || 0)}
                  </div>
                </div>

                <span className="pdfcsv-usage-card__icon">
                  <i className="bi bi-file-earmark-text"></i>
                </span>
              </article>

              <article className="pdfcsv-usage-card">
                <div>
                  <div className="pdfcsv-usage-card__label">
                    Remaining Monthly Pages
                  </div>
                  <div className="pdfcsv-usage-card__value">
                    {formatWithCommas(totalMontlyRemainingPages || 0)}
                  </div>
                </div>

                <span className="pdfcsv-usage-card__icon">
                  <i className="bi bi-calendar2-check"></i>
                </span>
              </article>

              <article className="pdfcsv-usage-card">
                <div>
                  <div className="pdfcsv-usage-card__label">
                    Remaining One-Off Pages
                  </div>
                  <div className="pdfcsv-usage-card__value">
                    {formatWithCommas(totalOneOffRemainingPages || 0)}
                  </div>
                </div>

                <span className="pdfcsv-usage-card__icon">
                  <i className="bi bi-lightning-charge"></i>
                </span>
              </article>
            </div>

            {/* =========================
                PDF UPLOAD / CONVERSION
                ========================= */}
            <section className="pdfcsv-upload-card">
              <label htmlFor="pdfUpload" className="pdfcsv-dropzone">
                <input
                  type="file"
                  id="pdfUpload"
                  accept="application/pdf"
                  className="pdfcsv-file-input"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />

                <span className="pdfcsv-dropzone__icon">
                  <i className="bi bi-file-earmark-arrow-up"></i>
                </span>

                {pdfFile ? (
                  <>
                    <div className="pdfcsv-dropzone__title">{pdfFile.name}</div>
                    <div className="pdfcsv-dropzone__subtitle">
                      {pagesInUploadedPDF
                        ? `${pagesInUploadedPDF} page${
                            pagesInUploadedPDF === 1 ? "" : "s"
                          } selected`
                        : "PDF selected and ready to convert"}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="pdfcsv-dropzone__title">
                      Upload a PDF file
                    </div>
                    <div className="pdfcsv-dropzone__subtitle">
                      Click to browse your files
                    </div>
                  </>
                )}
              </label>

              {error && <div className="pdfcsv-upload-error">{error}</div>}

              <div className="pdfcsv-upload-actions">
                <button
                  className="btn pdfcsv-convert-btn"
                  onClick={handleConvert}
                  disabled={isConverting}
                >
                  <i className="bi bi-arrow-left-right"></i>
                  <span>
                    {isConverting ? "Converting..." : "Convert to CSV"}
                  </span>
                </button>

                {pdfFile && (
                  <button
                    className="btn pdfcsv-remove-btn"
                    onClick={handleRemoveFile}
                  >
                    Remove
                  </button>
                )}
              </div>
            </section>

            {/* =========================
                PREVIOUS CONVERSIONS
                ========================= */}
            <section className="pdfcsv-history-card">
              <div className="pdfcsv-history-header">
                <h5>Previously Converted Files</h5>

                <div className="pdfcsv-history-filter">
                  <Select
                    className="pdfcsv-filter-select"
                    classNamePrefix="pdfcsv-select"
                    options={Utils.CalenderFilter}
                    value={selectedOption}
                    onChange={(selectedOption) =>
                      handleCalenderFilterChange(selectedOption)
                    }
                    isSearchable={false}
                  />
                </div>
              </div>

              {showDatePicker && (
                <div className="pdfcsv-date-range">
                  <div className="pdfcsv-date-field">
                    <span>From</span>
                    <DatePicker
                      label="From Date"
                      value={fromDate.toDate()}
                      maxDate={toDate.subtract(0, "day").toDate()}
                      onChange={handleFromDateChange}
                      renderInput={(params) => <input {...params.inputProps} />}
                      popperPlacement="bottom-start"
                    />
                  </div>

                  <div className="pdfcsv-date-field">
                    <span>To</span>
                    <DatePicker
                      label="To Date"
                      value={toDate.toDate()}
                      minDate={fromDate.toDate()}
                      maxDate={dayjs().toDate()}
                      onChange={handleToDateChange}
                      renderInput={(params) => <input {...params.inputProps} />}
                      popperPlacement="bottom-start"
                    />
                  </div>
                </div>
              )}

              {previouslyConvertedFiles.length > 0 ? (
                <>
                  <div className="pdfcsv-table-wrap">
                    <table className="pdfcsv-table">
                      <thead>
                        <tr>
                          <th>PDF File</th>
                          <th>CSV File</th>
                          <th>Pages Converted</th>
                          <th>Converted On</th>
                          <th className="pdfcsv-table__action-heading">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {previouslyConvertedFiles
                          .slice(0, visibleCount)
                          .map((file, index) => (
                            <tr key={index}>
                              <td>
                                <a
                                  className="pdfcsv-file-link"
                                  href={file.uploadDocPath}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title={file.pdfFileName}
                                >
                                  <span className="pdfcsv-file-type-icon pdfcsv-file-type-icon--pdf">
                                    <i className="bi bi-file-earmark-pdf-fill"></i>
                                  </span>
                                  <span>{file.pdfFileName}</span>
                                </a>
                              </td>

                              <td>
                                <a
                                  className="pdfcsv-file-link"
                                  href={file.convertedDocPath}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title={file?.pdfFileName?.replace(
                                    /\.pdf$/,
                                    ".csv",
                                  )}
                                >
                                  <span className="pdfcsv-file-type-icon pdfcsv-file-type-icon--csv">
                                    <i className="bi bi-filetype-csv"></i>
                                  </span>
                                  <span>
                                    {file?.pdfFileName?.replace(
                                      /\.pdf$/,
                                      ".csv",
                                    )}
                                  </span>
                                </a>
                              </td>

                              <td>{file.pagesProcessed} pages</td>

                              <td>
                                {formatDateToDDMMYYYY(file.createdOnDate)}
                              </td>

                              <td className="pdfcsv-table__action">
                                <Tooltip title="Open CSV">
                                  <a
                                    className="pdfcsv-download-btn"
                                    href={file.convertedDocPath}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <i className="bi bi-download"></i>
                                  </a>
                                </Tooltip>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="pdfcsv-history-footer">
                    <div className="pdfcsv-history-count">
                      Showing 1–
                      {Math.min(
                        visibleCount,
                        previouslyConvertedFiles.length,
                      )}{" "}
                      of {listCount || previouslyConvertedFiles.length}{" "}
                      conversions
                    </div>

                    {visibleCount < previouslyConvertedFiles.length && (
                      <button
                        onClick={handleShowMore}
                        className="btn pdfcsv-show-more-btn"
                      >
                        Show More
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="pdfcsv-empty-state">
                  <NoResultFoundModel
                    name="Records"
                    totalRecords={totalRecords}
                  />
                </div>
              )}
            </section>
          </div>
        ) : toggleID === PDFToCSVToggle.Upgrade ? (
          <div className="pdfpages-redesign">
            {/* Header */}
            <div className="pdfpages-header">
              <div>
                <h3 className="pdfpages-title">Purchase Pages</h3>
                <p className="pdfpages-subtitle">
                  Choose a page package that fits your PDF conversion needs.
                </p>
              </div>

              {convertablePageCount > 0 && (
                <button
                  className="btn pdfpages-back-btn"
                  onClick={() => setToggleID(PDFToCSVToggle.Convertor)}
                >
                  <i className="bi bi-arrow-left"></i>
                  <span>Back</span>
                </button>
              )}
            </div>

            {/* Package Cards */}
            <div className="pdfpages-plans-grid">
              {pagesPackages.map((PurchasePlanList, index) => (
                <article
                  className="pdfpages-plan-card"
                  key={PurchasePlanList.pcspKeyID || index}
                >
                  <div className="pdfpages-plan-card__top">
                    <span className="pdfpages-plan-icon">
                      <i className="bi bi-file-earmark-text"></i>
                    </span>

                    <div className="pdfpages-plan-name">
                      {PurchasePlanList?.packageName}
                    </div>
                  </div>

                  <div className="pdfpages-plan-price">
                    <span className="pdfpages-plan-price__currency">£</span>
                    <span className="pdfpages-plan-price__value">
                      {formatWithCommas(PurchasePlanList?.discountedPrice)}
                    </span>
                  </div>

                  <div className="pdfpages-plan-divider"></div>

                  <div className="pdfpages-plan-features">
                    <div className="pdfpages-plan-feature">
                      <span className="pdfpages-feature-check">
                        <i className="bi bi-check-lg"></i>
                      </span>

                      <div>
                        <span className="pdfpages-feature-label">Validity</span>

                        <strong>
                          {PurchasePlanList.months !== null
                            ? `${PurchasePlanList.months} ${PurchasePlanList.validity}`
                            : PurchasePlanList.validity}
                        </strong>
                      </div>
                    </div>

                    <div className="pdfpages-plan-feature">
                      <span className="pdfpages-feature-check">
                        <i className="bi bi-check-lg"></i>
                      </span>

                      <div>
                        <span className="pdfpages-feature-label">Pages</span>
                        <strong>{PurchasePlanList.pages}</strong>
                      </div>
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="pdfpages-plan-error">{errorMessage}</div>
                  )}

                  <div className="pdfpages-plan-card__footer">
                    <button
                      onClick={() =>
                        handleButtonClick(index, PurchasePlanList.pcspKeyID)
                      }
                      className="btn pdfpages-purchase-btn"
                    >
                      Purchase
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {pagesPackages.length === 0 && (
              <div className="pdfpages-empty-state">
                <i className="bi bi-file-earmark-x"></i>
                <h5>No page packages available</h5>
                <p>Please check again later.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="pdfsub-redesign">
            {/* Header */}
            <div className="pdfsub-header">
              <div>
                <h3 className="pdfsub-title">PDF To CSV Subscription</h3>
                <p className="pdfsub-subtitle">
                  View your purchased page packages and current subscription
                  status.
                </p>
              </div>

              {convertablePageCount > 0 && (
                <button
                  className="btn pdfsub-back-btn"
                  onClick={() => setToggleID(PDFToCSVToggle.Convertor)}
                >
                  <i className="bi bi-arrow-left"></i>
                  <span>Back</span>
                </button>
              )}
            </div>

            {/* Subscription Table Card */}
            <section className="pdfsub-table-card">
              <div className="pdfsub-table-toolbar">
                <div>
                  <h5>Subscription History</h5>
                </div>
              </div>

              <div className="pdfsub-table-wrap">
                <table className="pdfsub-table">
                  <thead>
                    <tr>
                      <th>Package Name</th>
                      <th>Validity</th>
                      <th>Price</th>
                      <th>Pages Purchased</th>
                      <th>Subscription Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {pdfToCSVSubscriptionHistory.map((subscription, index) => (
                      <tr key={index}>
                        <td>
                          <div className="pdfsub-package-cell">
                            <span className="pdfsub-package-icon">
                              <i className="bi bi-file-earmark-text"></i>
                            </span>

                            <span className="pdfsub-package-name">
                              {subscription.packageName}
                            </span>
                          </div>
                        </td>

                        <td>
                          <span className="pdfsub-cell-text">
                            {subscription.validity}
                          </span>
                        </td>

                        <td>
                          <span className="pdfsub-price">
                            {currencySymbol}{formatValue(subscription.price)}
                          </span>
                        </td>

                        <td>
                          <span className="pdfsub-pages-badge">
                            {subscription.pages}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`pdfsub-status pdfsub-status--${
                              subscription.subscriptionStatus === "Active"
                                ? "active"
                                : subscription.subscriptionStatus === "Expired"
                                  ? "expired"
                                  : subscription.subscriptionStatus ===
                                      "Pending"
                                    ? "pending"
                                    : subscription.subscriptionStatus ===
                                        "InActive"
                                      ? "inactive"
                                      : "default"
                            }`}
                          >
                            <span className="pdfsub-status__dot"></span>
                            {subscription.subscriptionStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalRecords <= 0 && (
                <div className="pdfsub-empty-wrap">
                  <NoResultFoundModel
                    name={"Subscription"}
                    totalRecords={totalRecords}
                  />
                </div>
              )}
            </section>
          </div>
        )}
      </div>
      <SuccessModal
        openSuccessModal={openSuccessModal}
        handleClose={() => setOpenSuccessModal(false)}
        isBackDropDisplay={true}
        message="PDF converted to CSV successfully! "
        modelAction={null}
      />

      <NoSubscriptionModal
        open={openNosubscriptionModal}
        handleClose={handleCloseNoSubscriptionModal}
        upgradeBtn={upgradeBtnClicked}
        isBackDropDisplay={true}
        pdfToCSVSubscriptionStatus={pdfToCSVSubscriptionStatus}
      />

      <CurruptedFileFormate
        open={openCurruptedFileModal}
        handleClose={() => setOpenCurruptedFileModal(false)}
        isBackDropDisplay={true}
        message={errorMessage}
      />
    </div>
  );
}

export default PdfToCsvConvertorModel;
