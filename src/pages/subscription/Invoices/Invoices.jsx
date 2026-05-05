import React, { useContext, useEffect, useState } from "react";
// import "./Invoices.css";
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
                        <div className="container">
                          <div className="row align-items-center">
                {/* Invoice Name */}
                <div className="col-sm-12 col-md-4 col-lg-4"> {/* Invoice Title: 4 columns on desktop, full-width on mobile */}
                  <div className="page-title-cls">
                    Invoice
                  </div>
                </div>

                {/* Invoice Date and Payment Status */}
                <div className="col-sm-12 col-md-8 col-lg-8"> {/* Invoice Date and Payment Status: 8 columns on desktop, full-width on mobile */}
                  <div className="d-flex align-items-center flex-wrap flex-md-nowrap"> {/* Wrap on mobile, single line on desktop */}
                    {/* Invoice Date */}
                    <div className="d-flex align-items-center me-3">
                      <label className="form-label me-2 mb-0 mx-2">Invoice Date</label>
                      <div style={{ minWidth: "300px" }}>
                        <DatePicker
                          format="dd/MM/y"
                          dayPlaceholder="dd"
                          monthPlaceholder="mm"
                          yearPlaceholder="yyyy"
                          className="engagementCalender w-100"
                          value={fromDate}
                          maxDate={dayjs().toDate()}
                          onChange={(e) => handleFromDateChange(e)}
                          popperPlacement="bottom-start"
                        />
                      </div>
                    </div>

                    {/* Payment Status */}
                    <div className="d-flex align-items-center">
                      <label className="form-label me-2 mb-0">Payment Status</label>
                      <div style={{ minWidth: "300px" }}>
                        <DropDown
                          className={`${className} w-100`}
                          options={Utils.paymentStatus}
                          value={selectedStatusValue}
                          onChange={handlePaymentStatusChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div class="">
            <div class="row">
              <div class="col-lg-12">
                <div class="card">
                  <div class="card-body">
                    <div id="customerList">
                      <div class="row g-4 mb-3"></div>
                      <div
                        class="table-responsive table-card mt-2 mb-3 table-padding invoice-margin"
                      >
                        <div className="row align-items-center mb-2 "></div>

                        <div class="search-box  ms-2 width-searchbox">
                          <table
                            class="table align-middle table-nowrap"
                            id="customerTable"
                          >
                            <thead class="table-light table-header-font">
                              <tr className="head-row">
                                <td
                                  className="tr-table-class text-white"
                                  style={{ width: "30%" }}
                                >
                                  Organisation Name
                                  {primaryUserSortDirectionObj.TradingBusinessName ===
                                    "desc" && (
                                      <i
                                        onClick={() => {
                                          handleUserSort(
                                            "asc",
                                            "TradingBusinessName"
                                          );
                                        }}
                                        style={{ cursor: "pointer" }}
                                        class="fas fa-sort-alpha-up ml-1"
                                      ></i>
                                    )}
                                  {(primaryUserSortDirectionObj.TradingBusinessName ===
                                    null ||
                                    primaryUserSortDirectionObj.TradingBusinessName ===
                                    "asc") && (
                                      <i
                                        onClick={() => {
                                          handleUserSort(
                                            primaryUserSortDirectionObj.TradingBusinessName ===
                                              null
                                              ? "asc"
                                              : "desc",
                                            "TradingBusinessName"
                                          );
                                        }}
                                        style={{ cursor: "pointer" }}
                                        class="fas fa-sort-alpha-down ml-1"
                                      ></i>
                                    )}
                                </td>
                                <td className="tr-table-class text-white">
                                  Invoice Date
                                  {primaryUserSortDirectionObj.InvoiceDate ===
                                    "desc" && (
                                      <i
                                        onClick={() => {
                                          handleUserSort(
                                            "asc",
                                            "InvoiceDate"
                                          );
                                        }}
                                        style={{ cursor: "pointer" }}
                                        class="fas fa-sort-alpha-up ml-1"
                                      ></i>
                                    )}
                                  {(primaryUserSortDirectionObj.InvoiceDate ===
                                    null ||
                                    primaryUserSortDirectionObj.InvoiceDate ===
                                    "asc") && (
                                      <i
                                        onClick={() => {
                                          handleUserSort(
                                            primaryUserSortDirectionObj.InvoiceDate ===
                                              null
                                              ? "asc"
                                              : "desc",
                                            "InvoiceDate"
                                          );
                                        }}
                                        style={{ cursor: "pointer" }}
                                        class="fas fa-sort-alpha-down ml-1"
                                      ></i>
                                    )}
                                </td>
                                <td className="tr-table-class text-white">
                                  Amount
                                  {primaryUserSortDirectionObj.FinalBillingAmount ===
                                    "desc" && (
                                      <i
                                        onClick={() => {
                                          handleUserSort(
                                            "asc",
                                            "FinalBillingAmount"
                                          );
                                        }}
                                        style={{ cursor: "pointer" }}
                                        class="fas fa-sort-alpha-up ml-1"
                                      ></i>
                                    )}
                                  {(primaryUserSortDirectionObj.FinalBillingAmount ===
                                    null ||
                                    primaryUserSortDirectionObj.FinalBillingAmount ===
                                    "asc") && (
                                      <i
                                        onClick={() => {
                                          handleUserSort(
                                            primaryUserSortDirectionObj.FinalBillingAmount ===
                                              null
                                              ? "asc"
                                              : "desc",
                                            "FinalBillingAmount"
                                          );
                                        }}
                                        style={{ cursor: "pointer" }}
                                        class="fas fa-sort-alpha-down ml-1"
                                      ></i>
                                    )}
                                </td>
                                <td className="tr-table-class text-white">
                                  Invoice Number
                                </td>
                                <td className="tr-table-class text-white">
                                  Payment Date
                                  {primaryUserSortDirectionObj.PaymentDate ===
                                    "desc" && (
                                      <i
                                        onClick={() => {
                                          handleUserSort(
                                            "asc",
                                            "PaymentDate"
                                          );
                                        }}
                                        style={{ cursor: "pointer" }}
                                        class="fas fa-sort-alpha-up ml-1"
                                      ></i>
                                    )}
                                  {(primaryUserSortDirectionObj.PaymentDate ===
                                    null ||
                                    primaryUserSortDirectionObj.PaymentDate ===
                                    "asc") && (
                                      <i
                                        onClick={() => {
                                          handleUserSort(
                                            primaryUserSortDirectionObj.PaymentDate ===
                                              null
                                              ? "asc"
                                              : "desc",
                                            "PaymentDate"
                                          );
                                        }}
                                        style={{ cursor: "pointer" }}
                                        class="fas fa-sort-alpha-down ml-1"
                                      ></i>
                                    )}
                                </td>
                                <td className="tr-table-class text-center text-white">
                                  Payment Status
                                  {/* {primaryUserSortDirectionObj.PaymentStatus ===
                                    "desc" && (
                                      <i
                                        onClick={() => {
                                          handleUserSort(
                                            "asc",
                                            "PaymentStatus"
                                          );
                                        }}
                                        style={{ cursor: "pointer" }}
                                        class="fas fa-sort-alpha-up ml-1"
                                      ></i>
                                    )}
                                  {(primaryUserSortDirectionObj.PaymentStatus ===
                                    null ||
                                    primaryUserSortDirectionObj.PaymentStatus ===
                                    "asc") && (
                                      <i
                                        onClick={() => {
                                          handleUserSort(
                                            primaryUserSortDirectionObj.PaymentStatus ===
                                              null
                                              ? "asc"
                                              : "desc",
                                            "PaymentStatus"
                                          );
                                        }}
                                        style={{ cursor: "pointer" }}
                                        class="fas fa-sort-alpha-down ml-1"
                                      ></i>
                                    )} */}
                                </td>
                                {/* <td className="tr-table-class text-white text-center">
                                  Action
                                </td> */}
                              </tr>
                            </thead>
                            <tbody class="list form-check-all">
                              {organisationInvoiceList
                                .slice(
                                  0,
                                  isMobile ? isMobileRecords : desktopRecords
                                )
                                .map((item) => {
                                  return (
                                    <tr class="table_new">
                                      <td className="table-content-font">
                                        {item.organisationName}
                                      </td>
                                      <td className="table-content-font">
                                        {item.invoiceDate}
                                      </td>

                                      <td className="table-content-font ">
                                        {formatValue(item.finalBillingAmount)}

                                      </td>

                                      <td className="table-content-font">

                                        {item.stripeInvoiceNo}

                                      </td>
                                      <td>

                                        {item.paymentDate
                                          ? item.paymentDate
                                          : "_"}

                                      </td>
                                      <td className="text-center">
                                        {item.paymentStatus === "Unpaid" && (
                                          <Tooltip title={`Pay Now`}>
                                            <button
                                              style={{
                                                width: "100px",
                                                display: "inline-block",
                                                borderRadius: "0.5rem",
                                              }}
                                              className="btn btn-md btn-success create-item-btn"
                                              onClick={() =>
                                                CreateStripeCheckoutSessionRedirection(item)
                                              }
                                            >
                                              <span>Pay Now</span>
                                            </button>
                                          </Tooltip>
                                        )}
                                        {item.paymentStatus === "Paid" && (
                                          <Tooltip title={`Download`}>
                                            <a
                                              style={{
                                                width: "100px",
                                                padding: "2px 0px",
                                                display: "inline-block",
                                                borderRadius: "0.5rem",
                                              }}
                                              href={item.hostedInvoiceUrl}
                                              className="btn btn-secondary btn-xs"
                                            >
                                              <i className="fa fa-download"></i>
                                            </a>
                                          </Tooltip>
                                        )}
                                        {item.paymentStatus === "Free" && (
                                          <Tooltip title={`Free`}>
                                            <p
                                              className="text-center table-content-font"
                                              style={{
                                                background: "#DAA520",
                                                width: "100px",
                                                padding: "6px 5px",
                                                display: "inline-block",
                                                borderRadius: "0.5rem",
                                                marginBottom: "0px"
                                              }}
                                            >
                                              Free
                                            </p>
                                          </Tooltip>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                          {totalRecords <= 0 && (
                            <NoResultFoundModel
                              name={"Invoices"}
                              totalRecords={totalRecords}
                            />
                          )}
                        </div>
                      </div>
                      <div>
                        {listCount > Number(pageSize) && (
                          <PaginationComponent
                            totalCount={listCount}
                            totalPages={isMobile
                              ? Math.ceil(listCount / isMobileRecords)
                              : Math.ceil(listCount / ((desktopRecords > 5 && window.innerHeight == 652) ? 5 : desktopRecords))}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                          />
                        )}
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
      </div>
      </div>
      </div>
      </div>
      </div>
      </div>

      <Footer />
    </div>
  );
};

export default Invoices;
