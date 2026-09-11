import React, { useContext, useEffect, useState } from "react";
// import "./Invoices.css";
import "./Invoices-redesign.css";
import Utils from "../../../Middleware/Utils";
import DropDown from "../../../components/DropDown";
import { AuthContextProvider } from "../../../AuthContext/AuthContext";
import { Tooltip } from "@mui/material";
import Footer from "../../../components/Footer";
import NoResultFoundModel from "../../../components/NoResultFoundModel";
import { GetOrganisationInvoiceList } from "../../../redux/Services/Subscription/PackageApi";
import { useSelector } from "react-redux";
import PaginationComponent from "../../../components/PaginationModel";
import { CreateStripeCheckoutSession } from "../../../redux/Services/Setting/PaymentGatewayApi";
import dayjs from "dayjs";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { statusID } from "../../../Middleware/enums";
const Invoices = () => {
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
    formatValue,
  } = useContext(AuthContextProvider);
  const [fromDate, setFromDate] = useState(null);
  const [primaryUserSortDirectionObj, setPrimaryUserSortDirectionObj] =
    useState({
      TradingBusinessName: null,
      InvoiceDate: null,
      FinalBillingAmount: null,
      InvoiceNumber: null,
      PaymentDate: null,
      PaymentStatus: null,
    });
  const [primarySortDirectionUsers, setPrimarySortDirectionUsers] =
    useState(null);
  const [organisationInvoiceList, setOrganisationInvoiceList] = useState([]);
  let getTemplateListApiCallCount = 0;
  const [currentPage, setCurrentPage] = useState(1);
  // const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null); // Default to "All"
  const [totalRecords, setTotalRecords] = useState(-1);

  const common = useSelector((state) => state.Storage);
  const pageSize = isMobile ? isMobileRecords : desktopRecords - 1;
  useEffect(() => {
    setTopbar("block");
    GetOrganisationInvoiceListData(currentPage, null, null, null);
  }, []);

  const GetOrganisationInvoiceListData = async (
    i,
    Status,
    FromDate,
    ToDate,
    sortValue,
    UserSort
  ) => {
    setLoader(true);
    const pageNoList = i - 1;
    try {
      const data = await GetOrganisationInvoiceList({
        userKeyID: common.userKeyID,
        pageSize: Number(pageSize),
        pageNo: pageNoList,
        SearchKeyword: null,
        StatusID: Status === undefined ? selectedStatus === null ? null : selectedStatus : Status,
        // StatusID: Status === 0 ? 0 : Status || null,
        fromDate:
          FromDate === null ? fromDate === null ? null : fromDate : dayjs(FromDate).format("YYYY-MM-DD"),
        toDate:
          FromDate === null ? fromDate === null ? null : fromDate : dayjs(FromDate).format("YYYY-MM-DD"),
        primarySortDirection:
          sortValue === undefined ? primarySortDirectionUsers : sortValue,
        PrimarySortColumnName:
          UserSort === undefined ||
            UserSort === null ||
            UserSort === ""
            ? null
            : UserSort,

      });
      if (data) {
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          getTemplateListApiCallCount = 0;
          if (data?.data?.responseData?.data) {
            const totalCount = data.data.totalCount;
            const OrganisationInvoiceListData = data.data.responseData.data;
            // setOrganisationInvoiceList(OrganisationInvoiceListData);
            if (pageNoList > 0 && OrganisationInvoiceListData.length === 0) {
              let newPaneNo = Number(pageNoList);
              if (newPaneNo > 1) {
                newPaneNo = newPaneNo - 1;
              }
              GetOrganisationInvoiceListData(newPaneNo);
              setCurrentPage(pageNoList);
              return;
            }
            setListCount(totalCount);
            setOrganisationInvoiceList(OrganisationInvoiceListData);
            setTotalRecords(OrganisationInvoiceListData.length);
          }
        } else {
          if (getTemplateListApiCallCount < maxCountToRecallApi) {
            getTemplateListApiCallCount += 1;
            setTimeout(function () {
              GetOrganisationInvoiceListData(
                i,
                selectedStatus,
                fromDate,
                fromDate
              );
            }, 2000);
          } else {
            setLoader(false);
          }

          // setErrorMessage(data?.data?.errorMessage);
        }
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const CreateStripeCheckoutSessionRedirection = async (
    item
  ) => {
    setLoader(true);
    try {
      const response = await CreateStripeCheckoutSession(
        common.userKeyID,
        item.InvoiceKeyID
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

  const handlePageChange = async (pageNumber) => {
    setCurrentPage(pageNumber);
    await GetOrganisationInvoiceListData(pageNumber, selectedStatus, fromDate, null); // Call your function with the selected page number
  };

  const handleFromDateChange = (newValue) => {
    if (newValue) {
      const formattedDate = newValue
      setFromDate(formattedDate);
      GetOrganisationInvoiceListData(1, selectedStatus, newValue, null)
    }
  };
  const handlePaymentStatusChange = (option) => {
    setSelectedStatus(option.value);
    GetOrganisationInvoiceListData(1, option.value, fromDate, null);
  };

  const handleUserSort = (sortValue, UserSort) => {
    if (UserSort === "TradingBusinessName") {
      setPrimarySortDirectionUsers(sortValue);
      setPrimaryUserSortDirectionObj({
        ...primaryUserSortDirectionObj,
        TradingBusinessName: sortValue,
      });
      setCurrentPage(1);
      GetOrganisationInvoiceListData(1, selectedStatus, fromDate, null, sortValue, UserSort);
    } else if (UserSort === "InvoiceDate") {
      setPrimarySortDirectionUsers(sortValue);
      setPrimaryUserSortDirectionObj({
        ...primaryUserSortDirectionObj,
        InvoiceDate: sortValue,
      });
      setCurrentPage(1);
      GetOrganisationInvoiceListData(1, selectedStatus, fromDate, null, sortValue, UserSort);
    } else if (UserSort === "FinalBillingAmount") {
      setPrimarySortDirectionUsers(sortValue);
      setPrimaryUserSortDirectionObj({
        ...primaryUserSortDirectionObj,
        FinalBillingAmount: sortValue,
      });
      setCurrentPage(1);
      GetOrganisationInvoiceListData(1, selectedStatus, fromDate, null, sortValue, UserSort);
    } else if (UserSort === "InvoiceNumber") {
      setPrimarySortDirectionUsers(sortValue);
      setPrimaryUserSortDirectionObj({
        ...primaryUserSortDirectionObj,
        InvoiceNumber: sortValue,
      });
      setCurrentPage(1);
      GetOrganisationInvoiceListData(1, selectedStatus, fromDate, null, sortValue, UserSort);
    } else if (UserSort === "PaymentDate") {
      setPrimarySortDirectionUsers(sortValue);
      setPrimaryUserSortDirectionObj({
        ...primaryUserSortDirectionObj,
        PaymentDate: sortValue,
      });
      setCurrentPage(1);
      GetOrganisationInvoiceListData(1, selectedStatus, fromDate, null, sortValue, UserSort);
    } else if (UserSort === "PaymentStatus") {
      setPrimarySortDirectionUsers(sortValue);
      setPrimaryUserSortDirectionObj({
        ...primaryUserSortDirectionObj,
        PaymentStatus: sortValue,
      });
      setCurrentPage(1);
      GetOrganisationInvoiceListData(1, selectedStatus, fromDate, null, sortValue, UserSort);
    }
  };

  const selectedStatusValue = Utils.paymentStatus.find((item) => item.value === selectedStatus)
  const className = "phone-input-country-code selectDropDown Drop-down-width";
  return (
    <div className="container-fluid invoices-list-redesign">
      <div className="invoices-list-page">
        {/* =====================================================
            PAGE HEADER
            ===================================================== */}
        <div className="invoices-page-header">
          <div className="invoices-heading-copy">
            <h1>Invoices</h1>
            <p>
              Review organisation invoices, payment status, billing amounts and
              invoice history.
            </p>
          </div>

          <div className="invoices-record-count">
            <span className="invoices-record-count-icon">
              <i className="ri-bill-line"></i>
            </span>

            <div>
              <span>Total Invoices</span>
              <strong>{listCount > 0 ? listCount : 0}</strong>
            </div>
          </div>
        </div>

        {/* =====================================================
            LIST CARD
            ===================================================== */}
        <section className="invoices-list-card">
          {/* FILTER TOOLBAR */}
          <div className="invoices-filter-toolbar">
            <div className="invoices-filter-group">
              <div className="invoices-filter-field invoices-date-filter">
                <label>Invoice Date</label>

                <div className="invoices-datepicker-wrap">
                  <i className="ri-calendar-line"></i>

                  <DatePicker
                    format="dd/MM/y"
                    dayPlaceholder="dd"
                    monthPlaceholder="mm"
                    yearPlaceholder="yyyy"
                    className="engagementCalender invoices-datepicker"
                    value={fromDate}
                    maxDate={dayjs().toDate()}
                    onChange={(e) => handleFromDateChange(e)}
                    popperPlacement="bottom-start"
                  />
                </div>
              </div>

              <div className="invoices-filter-field invoices-status-filter">
                <label>Payment Status</label>

                <DropDown
                  className={`${className} invoices-status-dropdown`}
                  options={Utils.paymentStatus}
                  value={selectedStatusValue}
                  onChange={handlePaymentStatusChange}
                />
              </div>
            </div>

            <div className="invoices-filter-summary">
              <span>
                {selectedStatusValue?.label
                  ? selectedStatusValue.label
                  : "All payment statuses"}
              </span>
            </div>
          </div>

          {/* TABLE */}
          <div className="invoices-table-scroll">
            <table className="invoices-table" id="customerTable">
              <thead>
                <tr>
                  <th>
                    <button
                      type="button"
                      className="invoices-sort-btn"
                      onClick={() => {
                        handleUserSort(
                          primaryUserSortDirectionObj.TradingBusinessName ===
                            null
                            ? "asc"
                            : primaryUserSortDirectionObj.TradingBusinessName ===
                                "asc"
                              ? "desc"
                              : "asc",
                          "TradingBusinessName"
                        );
                      }}
                    >
                      <span>Organisation Name</span>
                      <i
                        className={
                          primaryUserSortDirectionObj.TradingBusinessName ===
                          "desc"
                            ? "fas fa-sort-alpha-up"
                            : "fas fa-sort-alpha-down"
                        }
                      ></i>
                    </button>
                  </th>

                  <th>
                    <button
                      type="button"
                      className="invoices-sort-btn"
                      onClick={() => {
                        handleUserSort(
                          primaryUserSortDirectionObj.InvoiceDate === null
                            ? "asc"
                            : primaryUserSortDirectionObj.InvoiceDate === "asc"
                              ? "desc"
                              : "asc",
                          "InvoiceDate"
                        );
                      }}
                    >
                      <span>Invoice Date</span>
                      <i
                        className={
                          primaryUserSortDirectionObj.InvoiceDate === "desc"
                            ? "fas fa-sort-alpha-up"
                            : "fas fa-sort-alpha-down"
                        }
                      ></i>
                    </button>
                  </th>

                  <th>
                    <button
                      type="button"
                      className="invoices-sort-btn"
                      onClick={() => {
                        handleUserSort(
                          primaryUserSortDirectionObj.FinalBillingAmount === null
                            ? "asc"
                            : primaryUserSortDirectionObj.FinalBillingAmount ===
                                "asc"
                              ? "desc"
                              : "asc",
                          "FinalBillingAmount"
                        );
                      }}
                    >
                      <span>Amount</span>
                      <i
                        className={
                          primaryUserSortDirectionObj.FinalBillingAmount ===
                          "desc"
                            ? "fas fa-sort-alpha-up"
                            : "fas fa-sort-alpha-down"
                        }
                      ></i>
                    </button>
                  </th>

                  <th>Invoice Number</th>

                  <th>
                    <button
                      type="button"
                      className="invoices-sort-btn"
                      onClick={() => {
                        handleUserSort(
                          primaryUserSortDirectionObj.PaymentDate === null
                            ? "asc"
                            : primaryUserSortDirectionObj.PaymentDate === "asc"
                              ? "desc"
                              : "asc",
                          "PaymentDate"
                        );
                      }}
                    >
                      <span>Payment Date</span>
                      <i
                        className={
                          primaryUserSortDirectionObj.PaymentDate === "desc"
                            ? "fas fa-sort-alpha-up"
                            : "fas fa-sort-alpha-down"
                        }
                      ></i>
                    </button>
                  </th>

                  <th className="invoices-payment-heading">Payment Status</th>
                </tr>
              </thead>

              <tbody>
                {organisationInvoiceList
                  .slice(
                    0,
                    isMobile ? isMobileRecords : desktopRecords
                  )
                  .map((item, index) => {
                    return (
                      <tr key={item.InvoiceKeyID || item.invoiceKeyID || index}>
                        {/* ORGANISATION */}
                        <td>
                          <div className="invoices-organisation-cell">
                            <span className="invoices-organisation-icon">
                              <i className="ri-building-4-line"></i>
                            </span>

                            <Tooltip title={item.organisationName || ""}>
                              <strong className="invoices-ellipsis">
                                {item.organisationName}
                              </strong>
                            </Tooltip>
                          </div>
                        </td>

                        {/* INVOICE DATE */}
                        <td>
                          <span className="invoices-date-value">
                            {item.invoiceDate}
                          </span>
                        </td>

                        {/* AMOUNT */}
                        <td>
                          <strong className="invoices-amount-value">
                            {formatValue(item.finalBillingAmount)}
                          </strong>
                        </td>

                        {/* NUMBER */}
                        <td>
                          <span className="invoices-number-value">
                            {item.stripeInvoiceNo}
                          </span>
                        </td>

                        {/* PAYMENT DATE */}
                        <td>
                          <span className="invoices-date-value">
                            {item.paymentDate ? item.paymentDate : "_"}
                          </span>
                        </td>

                        {/* PAYMENT STATUS / EXISTING ACTION */}
                        <td className="invoices-payment-cell">
                          {item.paymentStatus === "Unpaid" && (
                            <div className="invoices-payment-action">
                              <span className="invoices-status-pill is-unpaid">
                                <i className="ri-checkbox-blank-circle-fill"></i>
                                Unpaid
                              </span>

                              <Tooltip title={`Pay Now`}>
                                <button
                                  type="button"
                                  className="invoices-pay-now-btn"
                                  onClick={() =>
                                    CreateStripeCheckoutSessionRedirection(item)
                                  }
                                >
                                  Pay Now
                                </button>
                              </Tooltip>
                            </div>
                          )}

                          {item.paymentStatus === "Paid" && (
                            <div className="invoices-payment-action">
                              <span className="invoices-status-pill is-paid">
                                <i className="ri-checkbox-blank-circle-fill"></i>
                                Paid
                              </span>

                              <Tooltip title={`Download`}>
                                <a
                                  href={item.hostedInvoiceUrl}
                                  className="invoices-download-btn"
                                >
                                  <i className="fa fa-download"></i>
                                  <span>Invoice</span>
                                </a>
                              </Tooltip>
                            </div>
                          )}

                          {item.paymentStatus === "Free" && (
                            <Tooltip title={`Free`}>
                              <span className="invoices-status-pill is-free">
                                <i className="ri-checkbox-blank-circle-fill"></i>
                                Free
                              </span>
                            </Tooltip>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {totalRecords <= 0 && (
            <div className="invoices-empty-state">
              <NoResultFoundModel
                name={"Invoices"}
                totalRecords={totalRecords}
              />
            </div>
          )}
        </section>

        {/* =====================================================
            PAGINATION OUTSIDE LIST CARD
            ===================================================== */}
        {listCount > Number(pageSize) && (
          <div className="invoices-pagination">
            <PaginationComponent
              totalCount={listCount}
              totalPages={
                isMobile
                  ? Math.ceil(listCount / isMobileRecords)
                  : Math.ceil(
                      listCount /
                        (desktopRecords > 5 && window.innerHeight == 652
                          ? 5
                          : desktopRecords)
                    )
              }
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      <div className="invoices-footer-wrap">
        <Footer />
      </div>
    </div>
  );
};

export default Invoices;
