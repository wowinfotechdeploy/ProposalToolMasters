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
    proposalName,
  } = useContext(AuthContextProvider);

  let getActivityLogListApiCallCount = 0;

  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());

  const [selectedOption, setSelectedOption] = useState(null);

  const pageSize = isMobile ? isMobileRecords : desktopRecords;

  const [activityLogsList, setActivityLogsList] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setTopbar("block");

    setCurrentPage(1);

    GetActivityLog(1);
  }, []);

  const getWeekDateRange = () => {
    const startDate = dayjs().subtract(100, "day");
    const endDate = dayjs();

    return {
      startDate,
      endDate,
    };
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

            const apiPageSize = isMobile ? 6 : 8;

            const totalPage = Math.ceil(totalCount / apiPageSize);

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
    const dateFormat = "mm-dd-yyyy";

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
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Week).toDate,
        );

        setShowDatePicker(false);

        break;

      case CalenderFilterEnum.Last_Week:
        setCurrentPage(1);

        GetActivityLog(
          1,
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Week).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Week).toDate,
        );

        setShowDatePicker(false);

        break;

      case CalenderFilterEnum.This_Month:
        setCurrentPage(1);

        GetActivityLog(
          1,
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Month).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Month).toDate,
        );

        setShowDatePicker(false);

        break;

      case CalenderFilterEnum.Last_Month:
        setCurrentPage(1);

        GetActivityLog(
          1,
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Month).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Month).toDate,
        );

        setShowDatePicker(false);

        break;

      case CalenderFilterEnum.This_Quarter:
        setCurrentPage(1);

        GetActivityLog(
          1,
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Quarter).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Quarter).toDate,
        );

        setShowDatePicker(false);

        break;

      case CalenderFilterEnum.Last_Quarter:
        setCurrentPage(1);

        GetActivityLog(
          1,
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Quarter).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Quarter).toDate,
        );

        setShowDatePicker(false);

        break;

      case CalenderFilterEnum.This_6_Months:
        setCurrentPage(1);

        GetActivityLog(
          1,
          GetCustomDate(dateFormat, CalenderFilterEnum.This_6_Months).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.This_6_Months).toDate,
        );

        setShowDatePicker(false);

        break;

      case CalenderFilterEnum.Last_6_Months:
        setCurrentPage(1);

        GetActivityLog(
          1,
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_6_Months).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_6_Months).toDate,
        );

        setShowDatePicker(false);

        break;

      case CalenderFilterEnum.This_Year:
        setCurrentPage(1);

        GetActivityLog(
          1,
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Year).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Year).toDate,
        );

        setShowDatePicker(false);

        break;

      case CalenderFilterEnum.Last_Year:
        setCurrentPage(1);

        GetActivityLog(
          1,
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Year).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Year).toDate,
        );

        setShowDatePicker(false);

        break;

      case CalenderFilterEnum.Custom_Date_Range:
        setCurrentPage(1);

        setShowDatePicker(true);

        break;

      default:
        break;
    }
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

  const handlePageChange = async (pageNumber) => {
    setCurrentPage(pageNumber);

    await GetActivityLog(pageNumber);
  };

  const getActivityDescription = (activity) => {
    return activity?.logMessage
      ?.replace(/quotation/g, proposalName)
      ?.replace(/client/g, prospectName)
      ?.replace(/contract/g, EngagementName);
  };

  return (
    <div className="activity-redesign">
      <div className="activity-redesign__inner">
        {/* =========================
            HEADER
            ========================= */}

        <div className="activity-redesign-header">
          <div>
            <h1 className="activity-redesign-header__title">Activity Logs</h1>

            <p className="activity-redesign-header__subtitle">
              Track proposal and engagement letter activity across your
              workspace.
            </p>
          </div>
        </div>

        {/* =========================
            FILTER AREA
            ========================= */}

        <section className="activity-redesign-filter">
          <div className="activity-redesign-filter__content">
            <div className="activity-redesign-filter__select">
              <Select
                className="activity-date-filter"
                classNamePrefix="activity-date-select"
                options={Utils.CalenderFilter}
                value={selectedOption}
                onChange={(selectedOption) =>
                  handleCalenderFilterChange(selectedOption)
                }
                isSearchable={false}
                placeholder="Filter by date"
              />
            </div>

            {showDatePicker && (
              <div className="activity-custom-dates">
                <div className="activity-custom-date">
                  <span className="activity-custom-date__label">From</span>

                  <DatePicker
                    value={fromDate.toDate()}
                    maxDate={toDate.toDate()}
                    onChange={handleFromDateChange}
                  />
                </div>

                <div className="activity-custom-date">
                  <span className="activity-custom-date__label">To</span>

                  <DatePicker
                    value={toDate.toDate()}
                    minDate={fromDate.toDate()}
                    maxDate={dayjs().toDate()}
                    onChange={handleToDateChange}
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* =========================
            ACTIVITY TIMELINE
            Date + Description only
            ========================= */}

        <section className="activity-timeline-card">
          {activityLogsList && activityLogsList.length > 0 ? (
            <div className="activity-timeline">
              {activityLogsList.map((ActivityLogList, index) => (
                <div
                  className="activity-timeline__row"
                  key={`${ActivityLogList.logDateTime}-${index}`}
                >
                  {/* Timeline rail */}

                  <div className="activity-timeline__rail">
                    <span
                      className={`activity-timeline__dot activity-timeline__dot--${
                        index % 5
                      }`}
                    />
                  </div>

                  {/* Card */}

                  <div className="activity-entry-card">
                    <div className="activity-entry-card__date">
                      {ActivityLogList.logDateTime}
                    </div>

                    <button
                      type="button"
                      className="activity-entry-card__description"
                      onClick={() => {
                        navigate(`/${ActivityLogList.moduleURL}`);
                      }}
                    >
                      {getActivityDescription(ActivityLogList)}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="activity-redesign-empty">
              <NoResultFoundModel name={" Activity Logs "} />
            </div>
          )}
        </section>

        {/* =========================
            EXISTING PAGINATION
            ========================= */}

        {listCount > pageSize && (
          <div className="activity-redesign-pagination">
            <PaginationComponent
              totalCount={listCount}
              totalPages={totalPage}
              desktopRecords={desktopRecords}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      <button className="btn btn-danger btn-icon" id="back-to-top">
        <i className="ri-arrow-up-line"></i>
      </button>

      <Footer />
    </div>
  );
};

export default Activity_Logs;
