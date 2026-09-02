import React, { useContext, useEffect, useState } from "react";
import { AuthContextProvider } from "../AuthContext/AuthContext";
import Footer from "./Footer";
import { Tooltip } from "@mui/material";
import { GetOrganisationPlanList } from "../redux/Services/Setting/Organisation";
import { useSelector } from "react-redux";
import PaginationComponent from "./PaginationModel";
import { Row, Col, Card, CardBody } from "reactstrap";
import { useLocation, useNavigate } from "react-router-dom";
import CommonButtonComponent from "./CommonButtonComponent";
import NoResultFoundModel from "../components/NoResultFoundModel";
import SubscriptionView from "./SubscriptionView";
import {
  ChoosePlanApi,
  CreateStripeCheckoutSession,
} from "../redux/Services/Setting/PaymentGatewayApi";
import { GetUserSubscriptionPackageModel } from "../redux/Services/Subscription/UserListApi";
import "./MySubscriptionRedesign.css";
const MySubscription = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [subScriptionPlanList, setSubScriptionPlanList] = useState([]);
  const [subScriptionActiveList, setSubScriptionActiveList] = useState({});
  const [chooseApiData, setChooseApiData] = useState([]);
  const location = useLocation();
  const [subscriptionPackageObj, setSubscriptionPackageObj] = useState({
    ospKeyID: null,
    remainingESignatures: null,
    remainingQuotesPerMonth: null,
    apiIntegration: null,
    subscriptionPackageKeyID: null,
    packageName: "",
    prepareQuote: false,
    sendQuote: false,
    quotesPerMonth: null,
    prepareContract: false,
    sendContract: false,
    signContract: false,
    eSignaturePerMonth: "",
    yearlyValuePlan: "",
    discountPercentage: "",
    discountPrice: "",
    subscriptionStartDate: "",
    monthFree: "",
    getMonths: "",
    inPriceOfMonth: "",
    isMailBox: false,
    paymentFrequencyID: null,
    renewDate: "",
    paymentStatus: "",
    subscriptionStatus: "",
    subscriptionPackageObj: "",
    hostedInvoiceUrl: "",
    invoiceKeyID: "",
  });
  const {
    setTopbar,
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
    getCrudButtonToolTipName,
    formatValue,
    formatValueWithoutCurrencySymbol,
    getCurrencySymbol,
  } = useContext(AuthContextProvider);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [totalRecords, setTotalRecords] = useState(-1);
  const pageSize = isMobile ? isMobileRecords : desktopRecords;
  const common = useSelector((state) => state.Storage);
  const currencySymbol = getCurrencySymbol(common.currencyID);
  const navigate = useNavigate();
  const moduleName = "Plan";
  useEffect(() => {
    setTopbar("block");
    GetOrganisationPlanListData(1, null);
  }, []);

  const GetOrganisationPlanListData = async (i, searchKeywordValue) => {
    setLoader(true);
    const pageNoList = i - 1;
    let getOrganisationListCallCount = 0;
    try {
      const data = await GetOrganisationPlanList({
        pageSize: pageSize,
        pageNo: pageNoList,
        userKeyID: common.userKeyID,
        organisationKeyID: common.organisationKeyID,
        searchKeyword:
          searchKeywordValue === undefined ? searchKeyword : searchKeywordValue,
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
              GetOrganisationPlanListData(newPaneNo, searchKeywordValue);
              setCurrentPage(pageNoList);
              return;
            }
            const PlanList =
              SubScriptionListData?.planList === null
                ? [
                    {
                      organisationKeyID: null,
                      ospKeyID: null,
                      organisationName: null,
                      email: null,
                      mobileNumber: null,
                      packageName: null,
                      packagePrice: null,
                      subscriptionStartDate: null,
                      nextRenewalDate: null,
                      subscriptionStatus: null,
                      invoiceKeyID: null,
                      finalBillingAmount: null,
                      paymentStatus: null,
                      hostedInvoiceUrl: null,
                      invoicePdf: null,
                    },
                  ]
                : SubScriptionListData?.planList;
            const ActivePlanList =
              SubScriptionListData?.activePlan === null
                ? {
                    ospKeyID: null,
                    isPlanActive: null,
                    subscriptionPackageKeyID: null,
                    packageName: null,
                    paymentFrequencyID: null,
                    prepareQuote: null,
                    sendQuote: null,
                    prepareContract: null,
                    sendContract: null,
                    signContract: null,
                    eSignaturePerMonth: null,
                    remainingESignatures: null,
                    yearlyValuePlan: null,
                    offerID: null,
                    discountPercentage: null,
                    discountPrice: null,
                    monthFree: null,
                    getMonths: null,
                    inPriceOfMonth: null,
                    isMailBox: null,
                    subscriptionStartDate: null,
                    subscriptionEndDate: null,
                    subscriptionCancelledDate: null,
                    renewDate: null,
                    invoiceKeyID: null,
                    finalBillingAmount: null,
                    paymentStatus: null,
                    subscriptionStatus: null,
                    hostedInvoiceUrl: null,
                    invoicePdf: null,
                    organisationKeyID: null,
                    status: null,
                    statusName: null,
                    userKeyID: null,
                    createdBy: null,
                    createdOn: null,
                    lastUpdatedBy: null,
                    lastUpdatedOn: null,
                    notifySAChanges: null,
                    acceptSAChanges: null,
                    keyID: null,
                    createdByID: null,
                    organisationID: null,
                  }
                : SubScriptionListData?.activePlan;
            setListCount(totalCount);
            // Extract planList and store in subscriptionList state
            setSubScriptionPlanList(PlanList);
            setSubScriptionActiveList(ActivePlanList);

            setTotalRecords(SubScriptionListData.length);
          }
        } else {
          if (getOrganisationListCallCount < maxCountToRecallApi) {
            getOrganisationListCallCount += 1;
            setTimeout(function () {
              GetOrganisationPlanListData(i, searchKeywordValue);
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

  const handlePageChange = async (pageNumber) => {
    setCurrentPage(pageNumber);
    await GetOrganisationPlanListData(pageNumber); // Call your function with the selected page number
  };
  const handleRedirectSubscription = async () => {
    await ChoosePlanApiModelData();
    navigate("/ChoosePlan", {
      state: { organizationKeyId: common.organisationKeyID },
    });
  };

  const handleOpenSubscriptionModel = (subscriptionObj) => {
    GetSubscriptionPackageModelData(subscriptionObj.ospKeyID);
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
            remainingESignatures: ModelData.remainingESignatures,
            remainingQuotesPerMonth: ModelData.remainingQuotesPerMonth,
            apiIntegration: ModelData.apiIntegration,
            subscriptionPackageKeyID: ModelData.subscriptionPackageKeyID,
            packageName: ModelData.packageName,
            prepareQuote: ModelData.prepareQuote,
            sendQuote: ModelData.sendQuote,
            quotesPerMonth: ModelData.quotesPerMonth,
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
            paymentFrequencyID: ModelData.paymentFrequencyID,
            subscriptionStartDate: ModelData.subscriptionStartDate,
            renewDate: ModelData.renewDate,
            paymentStatus: ModelData.paymentStatus,
            subscriptionStatus: ModelData.subscriptionStatus,
            subscriptionPackageObj: ModelData.subscriptionPackageObj,
            hostedInvoiceUrl: ModelData.hostedInvoiceUrl,
            invoiceKeyID: ModelData.invoiceKeyID,
          });
        }
      } else {
        setErrorMessage(data?.data?.errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const RedirectStripeCheckout = (subscription) => {
    CreateStripeCheckoutSessionRedirection(
      common.userKeyID,
      subscription.invoiceKeyID,
    );
  };
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
  // console.log(subScriptionActiveList, "subScriptionActiveList");

  return (
    <div className="my-subscription-redesign">
      <div className="my-subscription-page">
        {/* =========================
            PAGE HEADER
            ========================= */}
        <div className="my-subscription-header">
          <div>
            <h1 className="my-subscription-title">My Subscription</h1>
            <p className="my-subscription-subtitle">
              View your current plan, package features and subscription history.
            </p>
          </div>

          <div className="my-subscription-upgrade">
            <CommonButtonComponent
              title={getCrudButtonToolTipName("Upgrade", moduleName)}
              name={getCrudButtonTextName("Upgrade", moduleName)}
              AddBtn={() => handleRedirectSubscription()}
            />
          </div>
        </div>

        {/* =========================
            CURRENT SUBSCRIPTION
            ========================= */}
        <div className="my-subscription-summary-grid">
          {/* LEFT: SUBSCRIPTION DETAILS */}
          <section className="my-subscription-card">
            <div className="my-subscription-card__header">
              <h2>Subscription Details</h2>

              <div className="my-subscription-status-group">
                {subScriptionActiveList.subscriptionStatus && (
                  <span
                    className={`my-subscription-status my-subscription-status--${
                      subScriptionActiveList.subscriptionStatus === "Active"
                        ? "active"
                        : subScriptionActiveList.subscriptionStatus ===
                            "Expired"
                          ? "expired"
                          : subScriptionActiveList.subscriptionStatus ===
                              "Pending"
                            ? "pending"
                            : subScriptionActiveList.subscriptionStatus ===
                                "InActive"
                              ? "inactive"
                              : "default"
                    }`}
                  >
                    <span className="my-subscription-status__dot"></span>
                    {subScriptionActiveList.subscriptionStatus}
                  </span>
                )}

                {subScriptionActiveList.paymentStatus && (
                  <span
                    className={`my-subscription-status my-subscription-status--${
                      subScriptionActiveList.paymentStatus === "Paid"
                        ? "active"
                        : subScriptionActiveList.paymentStatus === "Unpaid"
                          ? "pending"
                          : "default"
                    }`}
                  >
                    {subScriptionActiveList.paymentStatus}
                  </span>
                )}
              </div>
            </div>

            <div className="my-subscription-card__body">
              <div className="my-subscription-details-grid">
                <div className="my-subscription-detail">
                  <span>Package Name</span>
                  <strong>{subScriptionActiveList.packageName || "-"}</strong>
                </div>

                <div className="my-subscription-detail">
                  <span>Payment Frequency</span>
                  <strong>
                    {subScriptionActiveList.paymentFrequencyID === 1
                      ? "Yearly"
                      : subScriptionActiveList.paymentFrequencyID === 4
                        ? "Monthly"
                        : "-"}
                  </strong>
                </div>

                <div className="my-subscription-detail">
                  <span>Billing Cycle</span>
                  <strong>
                    {subScriptionActiveList.paymentFrequencyID === 1
                      ? "365 Days"
                      : subScriptionActiveList.paymentFrequencyID === 4
                        ? "30 Days"
                        : "-"}
                  </strong>
                </div>

                <div className="my-subscription-detail">
                  <span>Start Date</span>
                  <strong>
                    {subScriptionActiveList.subscriptionStartDate === null
                      ? "-"
                      : subScriptionActiveList.subscriptionStartDate || "-"}
                  </strong>
                </div>

                <div className="my-subscription-detail">
                  <span>Next Renewal</span>
                  <strong>
                    {subScriptionActiveList.renewDate === null
                      ? "-"
                      : subScriptionActiveList.renewDate || "-"}
                  </strong>
                </div>

                <div className="my-subscription-detail">
                  <span>Payment Status</span>
                  <strong>{subScriptionActiveList.paymentStatus || "-"}</strong>
                </div>
              </div>

              <div className="my-subscription-payment-action">
                {subScriptionActiveList.paymentStatus === "Unpaid" && (
                  <Tooltip title="Pay Now">
                    <button
                      className="btn my-subscription-primary-btn"
                      onClick={() =>
                        RedirectStripeCheckout(subScriptionActiveList)
                      }
                    >
                      Pay Now
                    </button>
                  </Tooltip>
                )}

                {subScriptionActiveList.paymentStatus === "Paid" && (
                  <Tooltip title="Download">
                    <a
                      href={subScriptionActiveList.hostedInvoiceUrl}
                      className="my-subscription-invoice-btn"
                    >
                      <i className="bi bi-download"></i>
                      <span>Invoice</span>
                    </a>
                  </Tooltip>
                )}

                {subScriptionActiveList.paymentStatus === "Free" && (
                  <span className="my-subscription-free-badge">Free</span>
                )}
              </div>

              <div className="my-subscription-balance-grid">
                <div className="my-subscription-balance">
                  <span>Remaining Proposals</span>
                  <strong>
                    {subScriptionActiveList.remainingQuotesPerMonth < 0
                      ? 0
                      : (subScriptionActiveList.remainingQuotesPerMonth ?? 0)}
                  </strong>
                </div>

                <div className="my-subscription-balance">
                  <span>Remaining E-Signatures</span>
                  <strong>
                    {subScriptionActiveList.remainingESignatures < 0
                      ? 0
                      : (subScriptionActiveList.remainingESignatures ?? 0)}
                  </strong>
                </div>

                <div className="my-subscription-balance">
                  <span>Remaining Pages</span>
                  <strong>
                    {subScriptionActiveList.noOfPages < 0 ||
                    subScriptionActiveList.noOfPages === null
                      ? 0
                      : subScriptionActiveList.noOfPages}
                  </strong>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT: PACKAGE DETAILS */}
          <section className="my-subscription-card">
            <div className="my-subscription-card__header my-subscription-package-header">
              <h2>Package Details</h2>

              <div className="my-subscription-package-price">
                <strong>
                  {(() => {
                    const MonthlyPrice =
                      Number(subScriptionActiveList?.yearlyValuePlan) / 12;
                    return formatValue(MonthlyPrice);
                  })()}
                </strong>
                <span>/ Month</span>
              </div>
            </div>

            <div className="my-subscription-card__body">
              <div className="my-subscription-feature-grid">
                <div
                  className={`my-subscription-feature ${
                    subScriptionActiveList?.apiIntegration
                      ? "is-enabled"
                      : "is-disabled"
                  }`}
                >
                  <i
                    className={
                      subScriptionActiveList?.apiIntegration
                        ? "bi bi-check-circle-fill"
                        : "bi bi-x-circle"
                    }
                  ></i>
                  <span>API Integration</span>
                </div>

                <div
                  className={`my-subscription-feature ${
                    subScriptionActiveList?.prepareQuote
                      ? "is-enabled"
                      : "is-disabled"
                  }`}
                >
                  <i
                    className={
                      subScriptionActiveList?.prepareQuote
                        ? "bi bi-check-circle-fill"
                        : "bi bi-x-circle"
                    }
                  ></i>
                  <span>Prepare {proposalName}</span>
                </div>

                <div
                  className={`my-subscription-feature ${
                    subScriptionActiveList?.sendQuote
                      ? "is-enabled"
                      : "is-disabled"
                  }`}
                >
                  <i
                    className={
                      subScriptionActiveList?.sendQuote
                        ? "bi bi-check-circle-fill"
                        : "bi bi-x-circle"
                    }
                  ></i>
                  <span>Send {proposalName}</span>
                </div>

                <div
                  className={`my-subscription-feature ${
                    subScriptionActiveList?.prepareContract
                      ? "is-enabled"
                      : "is-disabled"
                  }`}
                >
                  <i
                    className={
                      subScriptionActiveList?.prepareContract
                        ? "bi bi-check-circle-fill"
                        : "bi bi-x-circle"
                    }
                  ></i>
                  <span>Prepare {EngagementName}</span>
                </div>

                {subScriptionActiveList?.sendQuote === true &&
                  subScriptionActiveList?.quotesPerMonth > 0 && (
                    <div className="my-subscription-feature is-enabled">
                      <i className="bi bi-check-circle-fill"></i>
                      <span>
                        Prepare and Send {proposalName}:{" "}
                        {formatValueWithoutCurrencySymbol(
                          subScriptionActiveList?.quotesPerMonth,
                        )}
                        /Month
                      </span>
                    </div>
                  )}

                <div
                  className={`my-subscription-feature ${
                    subScriptionActiveList?.signContract
                      ? "is-enabled"
                      : "is-disabled"
                  }`}
                >
                  <i
                    className={
                      subScriptionActiveList?.signContract
                        ? "bi bi-check-circle-fill"
                        : "bi bi-x-circle"
                    }
                  ></i>
                  <span>
                    Send And Digitally Sign The {EngagementName}:{" "}
                    {subScriptionActiveList?.eSignaturePerMonth}/Month
                  </span>
                </div>

                <div
                  className={`my-subscription-feature ${
                    subScriptionActiveList?.isMailBox
                      ? "is-enabled"
                      : "is-disabled"
                  }`}
                >
                  <i
                    className={
                      subScriptionActiveList?.isMailBox
                        ? "bi bi-check-circle-fill"
                        : "bi bi-x-circle"
                    }
                  ></i>
                  <span>Personalized Outgoing Mailbox</span>
                </div>

                <div
                  className={`my-subscription-feature ${
                    subScriptionActiveList?.enablePdfToCsv
                      ? "is-enabled"
                      : "is-disabled"
                  }`}
                >
                  <i
                    className={
                      subScriptionActiveList?.enablePdfToCsv
                        ? "bi bi-check-circle-fill"
                        : "bi bi-x-circle"
                    }
                  ></i>
                  <span>
                    {subScriptionActiveList?.noOfPages === null
                      ? "PDF To CSV"
                      : "PDF To CSV: "}
                    {subScriptionActiveList?.noOfPages === 1
                      ? `${subScriptionActiveList?.noOfPages} Page`
                      : subScriptionActiveList?.noOfPages > 1
                        ? `${subScriptionActiveList?.noOfPages} Pages`
                        : ""}
                  </span>
                </div>

                {subScriptionActiveList &&
                  subScriptionActiveList?.enableXERO !== null && (
                    <div
                      className={`my-subscription-feature ${
                        subScriptionActiveList?.enableXERO
                          ? "is-enabled"
                          : "is-disabled"
                      }`}
                    >
                      <i
                        className={
                          subScriptionActiveList?.enableXERO
                            ? "bi bi-check-circle-fill"
                            : "bi bi-x-circle"
                        }
                      ></i>
                      <span>Xero Subscription</span>
                    </div>
                  )}

                {subScriptionActiveList &&
                  subScriptionActiveList?.enableQBO !== null && (
                    <div
                      className={`my-subscription-feature ${
                        subScriptionActiveList?.enableQBO
                          ? "is-enabled"
                          : "is-disabled"
                      }`}
                    >
                      <i
                        className={
                          subScriptionActiveList?.enableQBO
                            ? "bi bi-check-circle-fill"
                            : "bi bi-x-circle"
                        }
                      ></i>
                      <span>Quickbooks Subscription</span>
                    </div>
                  )}

                {subScriptionActiveList &&
                  subScriptionActiveList?.enableAIAgent !== null && (
                    <div
                      className={`my-subscription-feature ${
                        subScriptionActiveList?.enableAIAgent
                          ? "is-enabled"
                          : "is-disabled"
                      }`}
                    >
                      <i
                        className={
                          subScriptionActiveList?.enableAIAgent
                            ? "bi bi-check-circle-fill"
                            : "bi bi-x-circle"
                        }
                      ></i>
                      <span>AI Agent Subscription</span>
                    </div>
                  )}
              </div>
            </div>
          </section>
        </div>

        {/* =========================
            SUBSCRIPTION HISTORY
            No filters added.
            ========================= */}
        <section className="my-subscription-history-card">
          <div className="my-subscription-history-header">
            <div>
              <h2>Subscription History</h2>
              <p>Review previous and current billing records.</p>
            </div>
          </div>

          <div className="my-subscription-table-wrap">
            <table className="my-subscription-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Contact No</th>
                  <th>Package Name</th>
                  <th>Package Price</th>
                  <th>Subscription Start Date</th>
                  <th>Next Renewal Date</th>
                  <th>Payable Amount</th>
                  <th>Payment Status</th>
                  <th>Subscription Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {subScriptionPlanList.map((subscription, index) => (
                  <tr key={index}>
                    <td>{subscription.email}</td>

                    <td>{subscription.mobileNumber}</td>

                    <td>
                      <strong className="my-subscription-package-name">
                        {subscription.packageName}
                      </strong>
                    </td>

                    <td>
                      <strong>
                        {currencySymbol}
                        {formatValue(subscription.packagePrice)}
                      </strong>
                    </td>

                    <td>
                      {subscription.subscriptionStartDate === null
                        ? "-"
                        : subscription.subscriptionStartDate}
                    </td>

                    <td>
                      {subscription.nextRenewalDate === null
                        ? "-"
                        : subscription.nextRenewalDate}
                    </td>

                    <td>
                      <strong>
                        {currencySymbol}{formatValue(subscription.finalBillingAmount)}
                      </strong>
                    </td>

                    <td>
                      {subscription.paymentStatus === "Unpaid" && (
                        <Tooltip title="Pay Now">
                          <button
                            className="btn my-subscription-pay-btn"
                            onClick={() => RedirectStripeCheckout(subscription)}
                          >
                            Pay Now
                          </button>
                        </Tooltip>
                      )}

                      {subscription.paymentStatus === "Paid" && (
                        <Tooltip title="Download">
                          <a
                            href={subscription.hostedInvoiceUrl}
                            className="my-subscription-payment-pill my-subscription-payment-pill--paid"
                          >
                            <i className="bi bi-download"></i>
                            Paid
                          </a>
                        </Tooltip>
                      )}

                      {subscription.paymentStatus === "Free" && (
                        <span className="my-subscription-payment-pill my-subscription-payment-pill--free">
                          Free
                        </span>
                      )}
                    </td>

                    <td>
                      <span
                        className={`my-subscription-status my-subscription-status--${
                          subscription.subscriptionStatus === "Active"
                            ? "active"
                            : subscription.subscriptionStatus === "Expired"
                              ? "expired"
                              : subscription.subscriptionStatus === "Pending"
                                ? "pending"
                                : subscription.subscriptionStatus === "InActive"
                                  ? "inactive"
                                  : "default"
                        }`}
                      >
                        <span className="my-subscription-status__dot"></span>
                        {subscription.subscriptionStatus}
                      </span>
                    </td>

                    <td>
                      <Tooltip title="View Subscription">
                        <button
                          className="btn my-subscription-view-btn"
                          onClick={() =>
                            handleOpenSubscriptionModel(subscription)
                          }
                          data-bs-toggle="modal"
                          data-bs-target="#addSubscriptionViewModalUser"
                        >
                          <i className="bi bi-eye"></i>
                          <span>View</span>
                        </button>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalRecords <= 0 && (
            <div className="my-subscription-empty">
              <NoResultFoundModel
                name={"Subscription"}
                totalRecords={totalRecords}
              />
            </div>
          )}

          {listCount > pageSize && (
            <div className="my-subscription-pagination">
              <PaginationComponent
                totalCount={listCount}
                totalPages={totalPage}
                desktopRecords={desktopRecords}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </section>

        <SubscriptionView
          class="modal fade"
          id="addSubscriptionViewModalUser"
          tabIndex="-1"
          aria_labelledby="exampleModalLabel"
          aria_hidden="true"
          subscriptionPackageObj={subscriptionPackageObj}
        />
      </div>

      <Footer />

      <button
        onClick="topFunction()"
        className="btn btn-danger btn-icon"
        id="back-to-top"
      >
        <i className="ri-arrow-up-line"></i>
      </button>
    </div>
  );
};

export default MySubscription;
