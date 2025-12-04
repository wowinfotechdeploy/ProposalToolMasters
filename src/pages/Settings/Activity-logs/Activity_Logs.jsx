import React, { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import "./Activity_Logs.css";
import { AuthContextProvider } from "../../../AuthContext/AuthContext";
import Footer from "../../../components/Footer";
import { GetActivityLogsList } from "../../../redux/Services/Setting/ActivityLogs";
import { useSelector } from "react-redux";
import PaginationComponent from "../../../components/PaginationModel";
import Select from "react-select";
import Utils from "../../../Middleware/Utils";
import NoResultFoundModel from "../../../components/NoResultFoundModel";
import { CalenderFilterEnum } from "../../../Middleware/enums";
import { useNavigate } from "react-router-dom";
const Activity_Logs = () => {
  const navigate = useNavigate();
  const common = useSelector((state) => state.Storage);
  const {
    setLoader,
    setTopbar,
    maxCountToRecallApi,
    
    isMobile,
    setListCount,
    listCount,
    desktopRecords,
    isMobileRecords,
    GetCustomDate,
    EngagementName,
    prospectName,
    proposalName
  } = useContext(AuthContextProvider);
  let getActivityLogListApiCallCount = 0;
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs().add(0, "day"));
  const [selectedOption, setSelectedOption] = useState(null);
  const pageSize = isMobile ? isMobileRecords : desktopRecords;
  const [activityLogsList, setActivityLogsList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setTopbar("block");
    // GetActivityLog();
    setCurrentPage(1);
    GetActivityLog(currentPage);
  }, []);
  const getWeekDateRange = () => {
    const startDate = dayjs().subtract(100, "day");
    const endDate = dayjs();
    return { startDate, endDate };
  };
  const GetActivityLog = async (i, startDate, endDate) => {
    setActivityLogsList([]);
    setLoader(true);
    const pageNoList = i - 1;
    try {
      const { startDate: defaultStartDate, endDate: defaultEndDate } =
        getWeekDateRange();
      const StartDate = startDate
        ? startDate.format("YYYY-MM-DD")
        : defaultStartDate.format("YYYY-MM-DD");
      const EndDate = endDate
        ? endDate.format("YYYY-MM-DD")
        : defaultEndDate.format("YYYY-MM-DD");

      const response = await GetActivityLogsList({
        fromDate: StartDate,
        pageNo: pageNoList,
        organisationKeyID: common.organisationKeyID,
        pageSize: isMobile ? 6 : 8,
        toDate: EndDate,
        userKeyID: common.userKeyID,
      });

      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          getActivityLogListApiCallCount = 0;
          if (response?.data?.responseData?.data) {
            const totalCount = response.data.totalCount;
            const pageSize = isMobile ? 6 : 8; // Make sure this matches your API call
                    const totalPage = Math.ceil(totalCount / pageSize); 

            const ActivityListData = response?.data?.responseData?.data;
            if (pageNoList > 0 && ActivityListData.length === 0) {
              let newPageNo = Number(pageNoList);
              if (newPageNo > 1) {
                newPageNo = newPageNo - 1;
              }
              GetActivityLog(newPageNo);
              setCurrentPage(pageNoList);
              return;
            }
            setListCount(totalCount);
            setActivityLogsList(ActivityListData);
            setTotalPage(totalPage); 
          }
        } else {
          if (getActivityLogListApiCallCount < maxCountToRecallApi) {
            getActivityLogListApiCallCount += 1;
            setTimeout(() => {
              GetActivityLog(i);
            }, 2000);
          } else {
            setLoader(false);
          }
          setErrorMessage(response?.data?.errorMessage);
        }
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  const handleCalenderFilterChange = (selectedOption) => {
    let dateFormat = "mm-dd-yyyy";
    setSelectedOption(selectedOption);
    switch (selectedOption.value) {
      case CalenderFilterEnum.All:
        setCurrentPage(1);
        GetActivityLog(1, null, null);
        setShowDatePicker(false);
        break;
      case CalenderFilterEnum.This_Week:
        setCurrentPage(1);
        GetActivityLog(
          1,
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Week).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Week).toDate
        );
        setShowDatePicker(false);
        break;
      case CalenderFilterEnum.Last_Week:
        setCurrentPage(1);
        GetActivityLog(
          1,
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Week).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Week).toDate
        );
        setShowDatePicker(false);
        break;
      case CalenderFilterEnum.This_Month:
        setCurrentPage(1);
        GetActivityLog(
          1,
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Month).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Month).toDate
        );
        setShowDatePicker(false);
        break;
      case CalenderFilterEnum.Last_Month:
        setCurrentPage(1);
        GetActivityLog(
          1,
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Month).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Month).toDate
        );
        setShowDatePicker(false);
        break;
      case CalenderFilterEnum.This_Quarter:
        setCurrentPage(1);
        GetActivityLog(
          1,
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Quarter).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Quarter).toDate
        );
        setShowDatePicker(false);
        break;
      case CalenderFilterEnum.Last_Quarter:
        setCurrentPage(1);
        GetActivityLog(
          1,
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Quarter).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Quarter).toDate
        );
        setShowDatePicker(false);
        break;
      case CalenderFilterEnum.This_6_Months:
        setCurrentPage(1);
        GetActivityLog(
          1,
          GetCustomDate(dateFormat, CalenderFilterEnum.This_6_Months).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.This_6_Months).toDate
        );
        setShowDatePicker(false);
        break;
      case CalenderFilterEnum.Last_6_Months:
        setCurrentPage(1);
        GetActivityLog(
          1,
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_6_Months).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_6_Months).toDate
        );
        setShowDatePicker(false);
        break;
      case CalenderFilterEnum.This_Year:
        setCurrentPage(1);
        GetActivityLog(
          1,
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Year).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Year).toDate
        );
        setShowDatePicker(false);
        break;
      case CalenderFilterEnum.Last_Year:
        setCurrentPage(1);
        GetActivityLog(
          1,
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Year).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Year).toDate
        );
        setShowDatePicker(false);
        break;
      case CalenderFilterEnum.Custom_Date_Range:
        setCurrentPage(1);
        setShowDatePicker(true);
        // Handle custom date range selection, if needed
        break;
      default:
        // Handle default case
        break;
    }
    // GetActivityLog(fromDate, toDate);
  };

  const handleFromDateChange = (newValue) => {
    if (dayjs(newValue).isValid()) {
      const newFromDate = dayjs(newValue);
      setFromDate(newFromDate);
      if (newFromDate.isAfter(toDate)) {
        setToDate(newFromDate.add(1, "day"));
      }
      GetActivityLog(currentPage, newFromDate, toDate);
    }
  };
  const handleToDateChange = (newValue) => {
    if (dayjs(newValue).isValid()) {
      const newToDate = dayjs(newValue);
      setToDate(newToDate);
      if (newToDate.isBefore(fromDate)) {
        setFromDate(newToDate.subtract(1, "day"));
      }
      GetActivityLog(currentPage, fromDate, newToDate);
    }
  };

  // F] Pagination :

  const handlePageChange = async (pageNumber) => {
    setCurrentPage(pageNumber);
    await GetActivityLog(pageNumber); // Call your function with the selected page number
  };

  return (
    <div className="container">
      <div class="main-content">
        <div class="activity-logs-content page-background">
          <div class="page-info-header page-info-strip">
            <div class="container ">
              <div class="page-display-title">Activity Logs</div>
            </div>
          </div>
          <div class="container-fluid  ">
            {/* .............new code.............. */}
            <div
              class="row left-margin table-padding"
              style={{ justifyContent: "initial" }}
            >
              {/* <div className="col-1"></div> */}
              <div class="col-lg-3 col-md-3 col-sm-4 ">
                <div>
                  <Select
                    className="user-role-select phone-input-country-code"
                    options={Utils.CalenderFilter}
                    value={selectedOption}
                    onChange={(selectedOption) =>
                      handleCalenderFilterChange(selectedOption)
                    }
                  />
                </div>
              </div>
              {showDatePicker && (
                <>
                  <div className="col-lg-3 col-md-4 col-sm-4 ">
                    <DatePicker
                      label="From Date"
                      value={fromDate.toDate()} // Convert to JavaScript Date object
                      maxDate={toDate.subtract(0, "day").toDate()} // Convert to JavaScript Date object
                      onChange={handleFromDateChange}
                      renderInput={(params) => <input {...params.inputProps} />}
                      popperPlacement="bottom-start"
                    />
                  </div>
                  <div className="col-lg-3  col-md-4 col-sm-4 ">
                    <DatePicker
                      label="To Date"
                      value={toDate.toDate()} // Convert to JavaScript Date object
                      minDate={fromDate.toDate()} // Convert to JavaScript Date object
                      maxDate={dayjs().toDate()} // Convert to JavaScript Date object
                      onChange={handleToDateChange}
                      renderInput={(params) => <input {...params.inputProps} />}
                      popperPlacement="bottom-start"
                    />
                  </div>
                </>
              )}

              {/* <div className="col-lg-1 col-md-1 col-sm-1">
            <button className="btn btn-success create-item add-new dashboard-export">Export</button>
          </div> */}
            </div>
            {/* .............new code.............. */}
            <div class="row table-padding ">
              <div class="col-12">
                <div class="card">
                  {/* <div class=" "> */}
                    <ol class="activity-feed" style={{marginTop:'-20px'}}>
                      {activityLogsList && activityLogsList.length > 0 ? (
                        <div class="row table-padding ">
                          <div class="col-md-6">
                            {activityLogsList
                              .slice(0, Math.ceil(activityLogsList.length / 2))
                              .map((ActivityLogList, index) => (
                                <div
                                  key={ActivityLogList.logDateTime}
                                  class="feed-item"
                                >
                                  <div class="feed-item-list">
                                    <span style={{ color: "black" }}>
                                      {ActivityLogList.logDateTime}
                                    </span>
                                    <br />
                                    <span
                                      class="activity-text"
                                      style={{
                                        color: "blue",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => {
                                        navigate(
                                          `/${ActivityLogList.moduleURL}`
                                        );
                                      }}
                                    >
                                      {ActivityLogList?.logMessage
                                        ?.replace(/quotation/g, proposalName)
                                        ?.replace(/client/g, prospectName)
                                        ?.replace(/contract/g, EngagementName)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                          </div>
                          <div class="col-md-6">
                            {activityLogsList
                              .slice(Math.ceil(activityLogsList.length / 2))
                              .map((ActivityLogList, index) => (
                                <div
                                  key={ActivityLogList.logDateTime}
                                  class="feed-item"
                                >
                                  <div class="feed-item-list">
                                    <span style={{ color: "black" }}>
                                      {ActivityLogList.logDateTime}
                                    </span>
                                    <br />
                                    <span
                                      class="activity-text"
                                      style={{
                                        color: "blue",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => {
                                        navigate(
                                          `/${ActivityLogList.moduleURL}`
                                        );
                                      }}
                                    >
                                      {ActivityLogList?.logMessage
                                        ?.replace(/quotation/g, proposalName)
                                        ?.replace(/client/g, prospectName)
                                        ?.replace(/contract/g, EngagementName)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      ) : (
                        <NoResultFoundModel name={" Activity Logs "} />
                      )}
                    </ol>
                  {/* </div> */}
                </div>
                    {listCount > pageSize && (
                      <PaginationComponent
                        totalCount={listCount}
                        totalPages={totalPage}
                        desktopRecords={desktopRecords}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                      />
                    )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      <button class="btn btn-danger btn-icon" id="back-to-top">
        <i class="ri-arrow-up-line"></i>
      </button>
    </div>
  );
};
export default Activity_Logs;
