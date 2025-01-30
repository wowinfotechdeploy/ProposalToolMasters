import React, { useContext, useEffect, useState } from "react";
import "./Dashboard.css";
import { ColorContext, useColorContext } from "../../AuthContext/ColorContext";
import dayjs from "dayjs";
import DatePicker from "react-date-picker";
import "react-calendar/dist/Calendar.css";
import "react-date-picker/dist/DatePicker.css";
import { useNavigate } from "react-router-dom";
import DraftProposalPng from "../../assets/images/Web Icons Redo/Draft Proposal Icon.svg";
import SentProposalPng from "../../assets/images/Web Icons Redo/Proposal Sent Icon.svg";
import DraftEngagementLatterPng from "../../assets/images/gallery/Draft Engagement Letters icon.svg";
import EngagementLatterSendSvg from "../../assets/images/gallery/Engagement letters sent icon.svg";
import EngagementLatterAwaitingSignatureSvg from "../../assets/images/gallery/Engagement letter Awaiting sign icon.svg";
import EngagementLatterSignedSvg from "../../assets/images/gallery/Engagement letters signed icon.svg";
import EngagementLaterDeclinedSvg from "../../assets/images/gallery/Engagement Letter Declined icon.png";
import { AuthContextProvider } from "../../AuthContext/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../../components/Footer";
import { GetOrganisationLookupList } from "../../redux/Services/Master/OrganisationLookupList";
import { updateState } from "../../redux/Persist";
import Select from "react-select";
import { GetActivityLogsList } from "../../redux/Services/Setting/ActivityLogs";
import Utils from "../../Middleware/Utils";
import { DashboardCountList } from "../../redux/Services/Setting/DashBoardCountApi";
import { CalenderFilterEnum, statusID } from "../../Middleware/enums";
import * as XLSX from "xlsx";

const Dashboard = () => {
  const getFilterHeading = (selectedOption) => {
    switch (selectedOption.value) {
      case CalenderFilterEnum.All:
        return "All Records";
      case CalenderFilterEnum.This_Week:
        return "This Week ";
      case CalenderFilterEnum.Last_Week:
        return "Last Week ";
      case CalenderFilterEnum.Last_Week:
        return "Last Week ";
      case CalenderFilterEnum.This_Month:
        return "This Month ";
      case CalenderFilterEnum.Last_Month:
        return "Last Month ";
      case CalenderFilterEnum.This_Quarter:
        return "This Quarter ";
      case CalenderFilterEnum.Last_Quarter:
        return "Last Quarter ";
      case CalenderFilterEnum.This_6_Months:
        return "This 6 Months ";
      case CalenderFilterEnum.Last_6_Months:
        return "Last 6 Months ";
      case CalenderFilterEnum.This_Year:
        return "This Year ";
      case CalenderFilterEnum.Last_Year:
        return "Last Year ";
      case CalenderFilterEnum.Custom_Date_Range:
        return "Custom Date Range ";
      default:
        return "All Records";
    }
  };

  const {
    isMobile,
    setTopbar,
    setLoader,
    accessCount,
    proposalName,
    setListCount,
    prospectName,
    GetCustomDate,
    desktopRecords,
    userAccessData,
    EngagementName,
    setProposalName,
    isMobileRecords,
    setProspectName,
    setOrgLoaderList,
    setEngagementName,

    maxCountToRecallApi,
    setActiveOrganization,

    setDashboardCountListLoader,
    setDashboardActivityLogLoader,
    loader
  } = useContext(AuthContextProvider);
  let getActivityLogListApiCallCount = 0;
  let getOrganisationLookupListApiCallCount = 0;
  const { cardBackgroundColor, cardStyle } = useContext(ColorContext);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [selectedOption, setSelectedOption] = useState("");
  const [showUserModal, setShowUserModal] = useState(false);
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs().add(0, "day"));
  const [fromDateForFilter, setFromDateForFilter] = useState(null);
  const [toDateForFilter, setToDateForFilter] = useState(null);
  const [fromDateForExport, setFromDateForExport] = useState(null);
  const [toDateForExport, setToDateForExport] = useState(null);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [organisationsList, setOrganisationsList] = useState([]);
  const [modelRequestData, setModelRequestData] = useState({
    Draft: null,
    Sent: null,
    Accepted: null,
    Decline: null,
    Signed: null,
    Awaited: null,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const [activityLogsList, setActivityLogsList] = useState([]);
  const dispatch = useDispatch();
  const common = useSelector((state) => state.Storage);
  const [dashboardCount, setDashboardCount] = useState([]);

  useEffect(() => {
    GetActivityLog();
    DashboardCountData();
  }, [common.organisationKeyID, common.userKeyID]);

  const getWeekDateRange = () => {
    const startDate = dayjs().subtract(100, "day");
    const endDate = dayjs();
    return { startDate, endDate };
  };

  useEffect(() => {
    if (common.mobileNo === null) {
      setShowUserModal(true);
    }
  }, []);

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedDate = year + "-" + month + "-" + day;

  const GetActivityLog = async (i) => {
    if (
      common?.organisationKeyID === "" ||
      common?.organisationKeyID === undefined ||
      common?.userKeyID === "" ||
      common?.userKeyID === undefined
    ) {
      return;
    }
    const pageNoList = i - 1;
    try {
      const data = await GetActivityLogsList({
        pageSize: 4,
        pageNo: 0,
        organisationKeyID: common.organisationKeyID,
        userKeyID: common.userKeyID,
        fromDate: formattedDate,
        toDate: formattedDate,
      });

      if (data) {
        if (data?.data?.statusCode === 200) {
          setDashboardActivityLogLoader(true);
          getActivityLogListApiCallCount = 0;
          if (data?.data?.responseData?.data) {
            const totalCount = data.data.totalCount;
            const ActivityList = data?.data?.responseData?.data;

            if (pageNoList > 0 && ActivityList.length === 0) {
              let newPaneNo = Number(pageNoList);
              if (newPaneNo > 1) {
                newPaneNo = newPaneNo - 1;
              }
              GetActivityLog(newPaneNo);
              setCurrentPage(pageNoList);
              return;
            }
            setListCount(totalCount);
            setActivityLogsList(ActivityList);
          }
        } else {
          if (getActivityLogListApiCallCount < maxCountToRecallApi) {
            getActivityLogListApiCallCount += 1;
            setTimeout(() => {
              GetActivityLog(i);
            }, 2000);
          } else {
            setDashboardActivityLogLoader(true);
          }
          setErrorMessage(data?.data?.errorMessage);
        }
      }
    } catch (error) {
      console.log(error);
      setDashboardActivityLogLoader(true);
    }
  };
  const handleExport = async () => {
    // Fetch data for export
    const data = await DashboardCountData(fromDateForExport, toDateForExport);
    // Check if data is fetched successfully
    if (data && data.data.statusCode === 200) {
      // Check if data contains any records
      if (data?.data?.responseData) {
        // Extract ProposalListData from the fetched data
        const DashboardCountsListData = data?.data?.responseData;
        // Get the selected filter option
        const selectedFilterValue = selectedOption;
        // Get the filter heading
        const filterHeading = getFilterHeading(selectedFilterValue);
        // Define columns to show based on the condition of common.enableEL
        let columnsToShow = {
          quotationDraft: `${proposalName} Draft`,
          quotationSent: `${proposalName} Sent`,
          quotationAwaitingSignature: `${proposalName} Awaiting Response`,
          quotationAccepted: `${proposalName} Accepted`,
          quotationDeclined: `${proposalName} Decline`,
          contractDraft: `${EngagementName} Draft`,
          contractSent: `${EngagementName} Sent`,
          contractAwaitingSignature: `${EngagementName} Viewed`,
          contractSigned: `${EngagementName} Signed`,
          contractDeclined: `${EngagementName} Declined`,
        };
        // Update columns to show based on common.enableEL value
        if (common.enableEL === 0) {
          columnsToShow = {
            quotationDraft: `${proposalName} Draft`,
            quotationSent: `${proposalName} Sent`,
            quotationAwaitingSignature: `Awaiting Response`,
            quotationAccepted: `${proposalName} Accepted`,
            quotationDeclined: `${proposalName} Decline`,
          };
        } else if (common.enableEL === 1) {
          columnsToShow = {
            quotationDraft: `${proposalName} Draft`,
            quotationSent: `${proposalName} Sent`,
            contractDraft: `${EngagementName} Draft`,
            contractSent: `${EngagementName} Sent`,
            contractAwaitingSignature: `${EngagementName} Viewed`,
            contractSigned: `${EngagementName} Signed`,
            contractDeclined: `${EngagementName} Declined`,
          };
        }
        // Convert DashboardCountsListData to an array of key-value pairs
        const dataArray = Object.entries(DashboardCountsListData).flatMap(
          ([Key, value]) => {
            const rowData = [
              { "Column Name": "Practice Name :", Value: orgName },
              { "Column Name": "Reporting Period :", Value: filterHeading },
              { "Column Name": "", Value: "" },
              { "Column Name": "", Value: "" },
              ...Object.entries(value)
                .filter(([key]) => key in columnsToShow)
                .map(([key, val]) => ({
                  "Column Name": columnsToShow[key],
                  Value: val,
                })),
            ];
            return rowData;
          }
        );
        // Convert dataArray to Excel workbook
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(dataArray, {
          skipHeader: true,
        });

        // Calculate column widths
        const maxWidths = [0, 0]; // Initialize with two columns
        dataArray.forEach(row => {
          const columnNameLength = row["Column Name"] ? row["Column Name"].toString().length : 0;
          const valueLength = row["Value"] ? row["Value"].toString().length : 0;
          maxWidths[0] = Math.max(maxWidths[0], columnNameLength);
          maxWidths[1] = Math.max(maxWidths[1], valueLength);
        });

        // Set column widths
        worksheet['!cols'] = maxWidths.map(width => ({ wch: width + 2 })); // Add 2 for padding

        XLSX.utils.book_append_sheet(workbook, worksheet, "Summary");
        // Generate a file name for the Excel file
        const fileName = `Dashboard_data_${orgName}_${filterHeading}.xlsx`;
        // Save the Excel file
        XLSX.writeFile(workbook, fileName);
        // Fetch data again to reset page size for subsequent calls
        await DashboardCountData(fromDateForExport, toDateForExport);
      } else {
        // Handle error if data fetching fails
        console.error("Failed to fetch data for export");
      }
    } else {
      // Handle error if data fetching fails
      console.error("Failed to fetch data for export");
    }
  };

  const DashboardCountData = async (startDate, endDate, i) => {
    if (
      common?.organisationKeyID === "" ||
      common?.organisationKeyID === undefined ||
      common?.userKeyID === "" ||
      common?.userKeyID === undefined
    ) {
      return;
    }
    setDashboardCount([]);
    if (startDate !== undefined && endDate !== undefined) {
      setLoader(true);
    }
    // setLoader(true);
    try {
      const { startDate: defaultStartDate, endDate: defaultEndDate } =
        getWeekDateRange();
      const StartDate = startDate
        ? startDate.format("YYYY-MM-DD")
        : defaultStartDate.format("YYYY-MM-DD");
      const EndDate = endDate
        ? endDate.format("YYYY-MM-DD")
        : defaultEndDate.format("YYYY-MM-DD");

      const response = await DashboardCountList({
        organisationKeyID: common?.organisationKeyID,
        pageNo: 0,
        pageSize: 30,
        fromDate: StartDate,
        toDate: EndDate,
        userKeyID: common?.userKeyID,
      });

      if (response) {
        if (response?.data?.statusCode === 200) {
          setDashboardCountListLoader(true);
          if (startDate !== undefined && endDate !== undefined) {
            setLoader(false);
          }
          if (response?.data?.responseData?.data) {
            const DashboardNumb = response?.data?.responseData?.data;
            setDashboardCount(DashboardNumb);
          }
        } else {
          setDashboardCountListLoader(true);
          if (startDate !== undefined && endDate !== undefined) {
            setLoader(false);
          }
          setErrorMessage(response?.data?.errorMessage);
        }
        setTimeout(() => {
          setLoader(false);
        }, 2000);
        return response;
      }
    } catch (error) {
      console.log(error);
      if (startDate !== undefined && endDate !== undefined) {
        setLoader(false);
      }
      setTimeout(() => {
        setLoader(false);
      }, 2000);
      setDashboardCountListLoader(true);
    }
  };

  useEffect(() => {
    let OrganisationLocalList = localStorage.getItem("OrganisationLocalList");
    if (OrganisationLocalList === undefined || OrganisationLocalList === null) {
      GetOrganisationsListData(common.userKeyID);
    } else {
      OrganisationLocalListData();
    }
  }, []);

  const handleCalenderFilterChange = (selectedOption) => {
    const dateFormat = "mm-dd-yyyy";
    setSelectedOption(selectedOption);
    switch (selectedOption.value) {
      case CalenderFilterEnum.All:
        DashboardCountData(null, null);
        setShowDatePicker(false);
        break;
      case CalenderFilterEnum.This_Week:
        setFromDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Week).fromDate
        );
        setToDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Week).toDate
        );

        DashboardCountData(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Week).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Week).toDate,

          setFromDateForExport(
            GetCustomDate(dateFormat, CalenderFilterEnum.This_Week).fromDate
          ),
          setToDateForExport(
            GetCustomDate(dateFormat, CalenderFilterEnum.This_Week).toDate
          )
        );
        setShowDatePicker(false);
        break;
      case CalenderFilterEnum.Last_Week:
        setFromDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Week).fromDate
        );
        setToDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Week).toDate
        );
        DashboardCountData(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Week).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Week).toDate,

          setFromDateForExport(
            GetCustomDate(dateFormat, CalenderFilterEnum.Last_Week).fromDate
          ),
          setToDateForExport(
            GetCustomDate(dateFormat, CalenderFilterEnum.Last_Week).toDate
          )
        );
        setShowDatePicker(false);
        break;
      case CalenderFilterEnum.This_Month:
        setFromDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Month).fromDate
        );
        setToDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Month).toDate
        );
        DashboardCountData(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Month).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Month).toDate,
          setFromDateForFilter(
            GetCustomDate(dateFormat, CalenderFilterEnum.This_Month).fromDate
          ),
          setToDateForFilter(
            GetCustomDate(dateFormat, CalenderFilterEnum.This_Month).toDate
          )
        );
        setShowDatePicker(false);
        break;
      case CalenderFilterEnum.Last_Month:
        setFromDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Month).fromDate
        );
        setToDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Month).toDate
        );
        DashboardCountData(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Month).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Month).toDate,
          setToDateForExport(
            GetCustomDate(dateFormat, CalenderFilterEnum.Last_Month).toDate
          ),

          setFromDateForExport(
            GetCustomDate(dateFormat, CalenderFilterEnum.Last_Month).fromDate
          )
        );
        setShowDatePicker(false);
        break;
      case CalenderFilterEnum.This_Quarter:
        setFromDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Quarter).fromDate
        );
        setToDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Quarter).toDate
        );
        DashboardCountData(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Quarter).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Quarter).toDate,

          setFromDateForExport(
            GetCustomDate(dateFormat, CalenderFilterEnum.This_Quarter).fromDate
          ),
          setToDateForExport(
            GetCustomDate(dateFormat, CalenderFilterEnum.This_Quarter).toDate
          )
        );
        setShowDatePicker(false);
        break;
      case CalenderFilterEnum.Last_Quarter:
        setFromDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Quarter).fromDate
        );
        setToDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Quarter).toDate
        );
        DashboardCountData(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Quarter).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Quarter).toDate,

          setFromDateForExport(
            GetCustomDate(dateFormat, CalenderFilterEnum.Last_Quarter).fromDate
          ),
          setToDateForExport(
            GetCustomDate(dateFormat, CalenderFilterEnum.Last_Quarter).toDate
          )
        );
        setShowDatePicker(false);
        break;
      case CalenderFilterEnum.This_6_Months:
        setFromDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_6_Months).fromDate
        );
        setToDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_6_Months).toDate
        );
        DashboardCountData(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_6_Months).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.This_6_Months).toDate,

          setFromDateForExport(
            GetCustomDate(dateFormat, CalenderFilterEnum.This_6_Months).fromDate
          ),
          setToDateForExport(
            GetCustomDate(dateFormat, CalenderFilterEnum.This_6_Months).toDate
          )
        );
        setShowDatePicker(false);
        break;
      case CalenderFilterEnum.Last_6_Months:
        setFromDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_6_Months).fromDate
        );
        setToDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_6_Months).toDate
        );
        DashboardCountData(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_6_Months).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_6_Months).toDate,

          setFromDateForExport(
            GetCustomDate(dateFormat, CalenderFilterEnum.Last_6_Months).fromDate
          ),
          setToDateForExport(
            GetCustomDate(dateFormat, CalenderFilterEnum.Last_6_Months).toDate
          )
        );
        setShowDatePicker(false);
        break;
      case CalenderFilterEnum.This_Year:
        setFromDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Year).fromDate
        );
        setToDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Year).toDate
        );
        DashboardCountData(
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Year).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.This_Year).toDate,

          setFromDateForExport(
            GetCustomDate(dateFormat, CalenderFilterEnum.This_Year).fromDate
          ),
          setToDateForExport(
            GetCustomDate(dateFormat, CalenderFilterEnum.This_Year).toDate
          )
        );
        setShowDatePicker(false);
        break;
      case CalenderFilterEnum.Last_Year:
        const dates = GetCustomDate(dateFormat, selectedOption.value);
        setFromDateForFilter(dates.fromDate);
        setToDateForFilter(dates.toDate);
        setFromDateForExport(dates.fromDate);
        setToDateForExport(dates.toDate);
        DashboardCountData(dates.fromDate, dates.toDate);
        setShowDatePicker(false);
        setFromDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Year).fromDate
        );
        setToDateForFilter(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Year).toDate
        );
        DashboardCountData(
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Year).fromDate,
          GetCustomDate(dateFormat, CalenderFilterEnum.Last_Year).toDate,

          setFromDateForExport(
            GetCustomDate(dateFormat, CalenderFilterEnum.Last_Year).fromDate
          ),
          setToDateForExport(
            GetCustomDate(dateFormat, CalenderFilterEnum.Last_Year).toDate
          )
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
    // DashboardCountData(fromDate, toDate);
  };

  const OrganisationLocalListData = async () => {
    let OrganisationList = localStorage.getItem("OrganisationLocalList");

    if (OrganisationList) {
      // Parse the JSON string to a JavaScript object
      let OrganisationListData = JSON.parse(OrganisationList);
      setOrganisationsList(OrganisationListData);
      const MatchOrganisationKeyID = OrganisationListData.filter(
        (item) => item.organisationKeyID == common.organisationKeyID
      );
      // Check if userThemeSettings is not null or undefined

      // if (OrganisationListData.length === 0) {
      //   localStorage.removeItem("OrganisationLocalList");
      //   localStorage.removeItem("userThemeSettingLocalStorage");
      //   dispatch(resetState());
      //   navigate("/login");
      // }

      let organisationData = [];
      if (common.organisationKeyID == null) {
        organisationData = await OrganisationListData.find((item) => {
          return null == item.organisationKeyID;
        });
      } else if (common.organisationKeyID == "") {
        organisationData = OrganisationListData[0];
      } else {
        organisationData = await OrganisationListData.find((item) => {
          return (
            common.organisationKeyID?.toUpperCase() ==
            item.organisationKeyID?.toUpperCase()
          );
        });
      }
      if (organisationData == undefined) {
        return;
      }

      localStorage.setItem(
        "userAccess",
        JSON.stringify(organisationData.accessList)
      );
      setActiveOrganization(organisationData.accessList);

      if (organisationData) {
        const personalizeSettings = organisationData.personalizeSetting || [];
        personalizeSettings.forEach((setting) => {
          switch (setting.settingName) {
            case "VariableEngagementName":
              setEngagementName(setting.settingValue);

              break;
            case "VariableProposalName":
              setProposalName(setting.settingValue);
              break;
            case "VariableProspectName":
              setProspectName(setting.settingValue);
              break;
            default:
              // Handle other settings if needed
              break;
          }
        });
      } else {
        // Reset state variables if no organization is selected
        setEngagementName("");
        setProposalName("");
        setProspectName("");
      }

      if (OrganisationListData) {
        setOrganisationsList(OrganisationListData);
        if (common.organisationKeyID === "") {
          dispatch(
            updateState({
              businessTypeID: organisationData.businessTypeID,
              organisationKeyID: organisationData.organisationKeyID,
              professionTypeLists: organisationData.professionTypeLists,
              organisationCount: OrganisationListData.length,
              enableEL: organisationData.enableEL,
            })
          );
        }
      }
    }
  };

  const getOrganizationNameByKeyID = (organisationsList, organisationKeyID) => {
    // Find the organization object in the organisationsList array that matches the organisationKeyID
    const organization = organisationsList.find(
      (org) => org.organisationKeyID === organisationKeyID
    );

    // If the organization object is found, return its organisationName
    if (organization) {
      return organization.organisationName;
    }

    // If the organization object is not found, return an empty string or any default value you prefer
    return "";
  };

  // Usage
  const orgName = getOrganizationNameByKeyID(
    organisationsList,
    common.organisationKeyID
  );

  const GetOrganisationsListData = async (KeyID) => {
    try {
      setLoader(true);
      const response = await GetOrganisationLookupList(KeyID);

      if (response?.data?.statusCode === 200) {
        getOrganisationLookupListApiCallCount = 0;
        if (response?.data?.responseData?.data) {
          const totalCount = response.data.totalCount;
          const OrganisationsListData = response.data.responseData.data;
          localStorage.removeItem("OrganisationLocalList");
          localStorage.setItem(
            "OrganisationLocalList",
            JSON.stringify(OrganisationsListData)
          );
          setOrganisationsList(OrganisationsListData);

          let organisationData;
          if (common.organisationKeyID == null) {
            organisationData = await OrganisationsListData.find((item) => {
              return null == item.organisationKeyID;
            });
          } else if (common.organisationKeyID == "") {
            organisationData = OrganisationsListData[0];
          } else {
            organisationData = await OrganisationsListData.find((item) => {
              return (
                common.organisationKeyID?.toUpperCase() ==
                item.organisationKeyID?.toUpperCase()
              );
            });
          }
          if (organisationData == undefined) {
            return;
          }
          localStorage.setItem(
            "userAccess",
            JSON.stringify(organisationData.accessList)
          );
          setActiveOrganization(organisationData.accessList);

          if (organisationData) {
            const personalizeSettings =
              organisationData.personalizeSetting || [];
            personalizeSettings.forEach((setting) => {
              switch (setting.settingName) {
                case "VariableEngagementName":
                  setEngagementName(setting.settingValue);

                  break;
                case "VariableProposalName":
                  setProposalName(setting.settingValue);
                  break;
                case "VariableProspectName":
                  setProspectName(setting.settingValue);
                  break;
                default:
                  // Handle other settings if needed
                  break;
              }
            });
            setOrgLoaderList(true);
          } else {
            // Reset state variables if no organization is selected
            setOrgLoaderList(true);
            setEngagementName("");
            setProposalName("");
            setProspectName("");
          }
          if (organisationData) {
            setOrgLoaderList(true);
            dispatch(
              updateState({
                businessTypeID: organisationData.businessTypeID,
                organisationKeyID: organisationData.organisationKeyID,
                professionTypeLists:
                  organisationData.professionTypeLists === null
                    ? []
                    : organisationData.professionTypeLists,
                enableEL: organisationData.enableEL,
              })
            );
          } else if (
            getOrganisationLookupListApiCallCount < maxCountToRecallApi
          ) {
            setOrgLoaderList(true);
            getOrganisationLookupListApiCallCount += 1;
            setTimeout(function () {
              GetOrganisationsListData(KeyID);
            }, 2000);
          }
        }
      }
    } catch (error) {
      setOrgLoaderList(true);
      console.log(error);
    }
  };


  const handleActivityLog = () => {
    navigate("/activity-logs");
  };

  useEffect(() => {
    setTopbar("block");
  }, []);

  const handleAddData = (type, proposalValue) => {
    setModelRequestData((prevData) => ({
      ...prevData,
      Draft: type === "Draft" ? proposalValue : null,
      Sent: type === "Sent" ? proposalValue : null,
      Sent: type === "Accepted" ? proposalValue : null,
      Sent: type === "Decline" ? proposalValue : null,
    }));
    const fromDateStr = fromDateForFilter
      ? fromDateForFilter.toISOString()
      : null;
    const toDateStr = toDateForFilter ? toDateForFilter.toISOString() : null;

    const addFilterData = {
      proposalType: proposalValue,
      selectedOption: selectedOption ? selectedOption.value : null,
      fromDate: fromDateStr,
      toDate: toDateStr,
    };
    if (common.organisationKeyID !== null) {
      navigate("/proposals", { state: addFilterData });
    }
  };

  const GetHandleChangeFilter = (type, proposalValue) => {
    setModelRequestData((prevData) => ({
      ...prevData,
      Draft: type === "Draft" ? proposalValue : null,
      Sent: type === "Sent" ? proposalValue : null,
      Accepted: type === "Accepted" ? proposalValue : null,
      Decline: type === "Decline" ? proposalValue : null,
      Signed: type === "Signed" ? proposalValue : null,
      Awaited: type === "Awaiting" ? proposalValue : null,
    }));
    const fromDateStr = fromDateForFilter
      ? fromDateForFilter.toISOString()
      : null;
    const toDateStr = toDateForFilter ? toDateForFilter.toISOString() : null;

    // Create an object containing non-null values
    const addFilterData = {
      proposalType: proposalValue,
      selectedOption: selectedOption || null,
      fromDate: fromDateStr,
      toDate: toDateStr,
    };

    // Navigate to "/add-template" and pass addFilterData as state
    if (common.organisationKeyID !== null) {
      navigate("/engagement-letters", { state: addFilterData });
    }
  };
  const handleFromDateChange = (newValue) => {
    if (dayjs(newValue).isValid()) {
      const newFromDate = dayjs(newValue);
      setFromDate(newFromDate);
      setFromDateForFilter(newFromDate);
      setFromDateForExport(newFromDate);
      if (newFromDate.isAfter(toDate)) {
        const newToDate = newFromDate.add(1, "day");
        setToDate(newToDate);
        setToDateForFilter(newToDate);
        setToDateForExport(newToDate);
      }
      DashboardCountData(newFromDate, toDate);
    }
  }
  const handleToDateChange = (newValue) => {
    if (dayjs(newValue).isValid()) {
      const newToDate = dayjs(newValue);
      setToDate(newToDate);
      setToDateForFilter(newToDate);
      setToDateForExport(newToDate);
      if (newToDate.isBefore(fromDate)) {
        const newFromDate = newToDate.subtract(1, "day");
        setFromDate(newFromDate);
        setFromDateForFilter(newFromDate);
        setFromDateForExport(newFromDate);
      }
      DashboardCountData(fromDate, newToDate);
    }
  }

  return (
    <div class="main-content">
      <div class="page-content" style={{ height: '90vh' }}>
        {
          (accessCount === undefined || loader) ?
            (<div className="center-screen">
              <div className="text-center">
                <h5 className="mt-4">Loading...</h5>
              </div>
            </div>) :
            (accessCount !== 0) ? (
              <div class="container">
                <div class="col-lg-1">
                  <h5 className="page-title-cls mt-2">Dashboard</h5>
                </div>
                <div class="row align-items-center  left-margin">
                  <div className="col-lg-6 col-md-8 col-sm-8 ">
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
                      <div className="col-lg-2 col-md-5 col-sm-5 mt-1">
                        <DatePicker
                          label="From Date"
                          value={fromDate.toDate()} // Convert to JavaScript Date object
                          maxDate={toDate.subtract(0, "day").toDate()} // Convert to JavaScript Date object
                          onChange={handleFromDateChange}
                          renderInput={(params) => <input {...params.inputProps} />}
                          popperPlacement="bottom-start"
                        />
                      </div>
                      <div className="col-lg-2 col-md-5 col-sm-5 mt-1">
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

                  <div className="col-lg-6 col-sm-4 mt-1 ">
                    <div className="add-new-btn">
                      <button
                        onClick={handleExport}
                        className="btn btn-success create-item-btn add-new"
                      >
                        <span>Export</span>
                      </button>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="date-picker-div"></div>
                  </div>
                </div>
                <div class="row dashboard-top-class">
                  <div class="col">
                    <div class="h-100">
                      <div className="dashboard-top" class="row">
                        <div class="col-xl-8 col-lg-8 col-sm-12 ">
                          <div class="row">
                            {/* proposal start */}

                            {(userAccessData.Admin_Proposal_CanView ||
                              common.organisationKeyID == null) && (
                                <>
                                  <div
                                    className={`col-xl-3 col-lg-3 col-md-4 dashboard-box col-sm-12  ${common.organisationKeyID !== null
                                      ? "cursor-pointer"
                                      : ""
                                      } `}
                                  >
                                    <div className="dashboard-new-design">
                                      <div
                                        class="card"
                                        onClick={() =>
                                          handleAddData("Draft", statusID.Draft)
                                        }
                                      >
                                        <div
                                          class="card-header p-3 pt-2"
                                          style={cardStyle}
                                        >
                                          <div className="row">
                                            <div className="col-lg-6">
                                              <img
                                                src={DraftProposalPng}
                                                className="CardImage"
                                                alt
                                              />
                                            </div>
                                            <div className="col-lg-6">
                                              <div class="text-end pt-1">
                                                <h4 class="text-white mb-0">
                                                  {dashboardCount?.quotationDraft}
                                                </h4>
                                              </div>
                                            </div>
                                          </div>
                                          <div class="text-end pt-1"></div>
                                        </div>
                                        <hr class="dark horizontal my-0" />
                                        <div
                                          class="card-footer p-3"
                                          style={cardStyle}
                                        >
                                          <p class="mb-0 font-weight-bolder">
                                            <span class="text-success  text-white text-sm font-weight-bolder" />
                                            Draft {proposalName}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div
                                    className={`col-xl-3 col-lg-3 col-md-4 dashboard-box col-sm-12  ${common.organisationKeyID !== null
                                      ? "cursor-pointer"
                                      : ""
                                      } `}
                                  >
                                    <div className="dashboard-new-design">
                                      <div
                                        class="card"
                                        onClick={() =>
                                          handleAddData("Sent", statusID.Sent)
                                        }
                                      >
                                        <div
                                          class="card-header p-3 pt-2"
                                          style={cardStyle}
                                        >
                                          <div className="row">
                                            <div className="col-lg-6">
                                              <img
                                                src={SentProposalPng}
                                                className="CardImage"
                                                alt
                                              />
                                            </div>
                                            <div className="col-lg-6">
                                              <div class="text-end pt-1">
                                                <h4 class=" text-white  mb-0">
                                                  {dashboardCount?.quotationSent}{" "}
                                                </h4>
                                              </div>
                                            </div>
                                          </div>
                                          <div class="text-end pt-1">
                                            {/* <p class="text-sm mb-0 text-capitalize">Sent</p> */}
                                            {/* <h4 class=" text-white  mb-0">44</h4> */}
                                          </div>
                                        </div>
                                        <hr class="dark horizontal my-0" />
                                        <div
                                          class="card-footer p-3"
                                          style={cardStyle}
                                        >
                                          <p class="mb-0 font-weight-bolder">
                                            <span class="text-success text-sm font-weight-bolder" />
                                            {proposalName} Sent
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* proposal start */}
                                {(common.enableEL == 0 ||
                                  common.enableEL == null) && (
                                      <>
                                        <div
                                          className={`col-xl-3 col-lg-3 col-md-4 dashboard-box col-sm-12  ${common.organisationKeyID !== null
                                            ? "cursor-pointer"
                                            : ""
                                            } `}
                                        >
                                          <div className="dashboard-new-design">
                                            <div
                                              class="card"
                                              onClick={() =>
                                                handleAddData("Sent", statusID.Awaiting_Signature)
                                              }
                                            >
                                              <div
                                                class="card-header p-3 pt-2"
                                                style={cardStyle}
                                              >
                                                <div className="row">
                                                  <div className="col-lg-6">
                                                    <img
                                                      src={DraftEngagementLatterPng}
                                                      className="CardImage"
                                                      alt
                                                    />
                                                  </div>
                                                  <div className="col-lg-6">
                                                    <div class="text-end pt-1">
                                                      <h4 class="mb-0 text-white ">
                                                        {
                                                          dashboardCount?.quotationAwaitingSignature
                                                        }{" "}
                                                      </h4>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div class="text-end pt-1"></div>
                                              </div>
                                              <hr class="dark horizontal my-0" />
                                              <div
                                                class="card-footer p-3"
                                                style={cardStyle}
                                              >
                                                <p class="mb-0 font-weight-bolder">
                                                  <span class="text-success text-sm font-weight-bolder" />
                                              Awaiting Response
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                  )}
                                  {(common.enableEL == 0 ||
                                    common.enableEL == null) && (
                                      <>
                                        <div
                                          className={`col-xl-3 col-lg-3 col-md-4 dashboard-box col-sm-12  ${common.organisationKeyID !== null
                                            ? "cursor-pointer"
                                            : ""
                                            } `}
                                        >
                                          <div className="dashboard-new-design">
                                            <div
                                              class="card"
                                              onClick={() =>
                                                handleAddData(
                                                  "Accepted",
                                                  statusID.Accepted
                                                )
                                              }
                                            >
                                              <div
                                                class="card-header p-3 pt-2"
                                                style={cardStyle}
                                              >
                                                <div className="row">
                                                  <div className="col-lg-6">
                                                    <img
                                                      src={DraftEngagementLatterPng}
                                                      className="CardImage"
                                                      alt
                                                    />
                                                  </div>
                                                  <div className="col-lg-6">
                                                    <div class="text-end pt-1">
                                                      <h4 class="mb-0 text-white ">
                                                        {
                                                          dashboardCount?.quotationAccepted
                                                        }{" "}
                                                      </h4>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div class="text-end pt-1"></div>
                                              </div>
                                              <hr class="dark horizontal my-0" />
                                              <div
                                                class="card-footer p-3"
                                                style={cardStyle}
                                              >
                                                <p class="mb-0 font-weight-bolder">
                                                  <span class="text-success text-sm font-weight-bolder" />
                                                  {proposalName} Accepted
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        <div
                                          className={`col-xl-3 col-lg-3 col-md-4 dashboard-box col-sm-12  ${common.organisationKeyID !== null
                                            ? "cursor-pointer"
                                            : ""
                                            } `}
                                        >
                                          <div className="dashboard-new-design">
                                            <div
                                              class="card"
                                              onClick={() =>
                                                handleAddData(
                                                  "Decline",
                                                  statusID.Declined
                                                )
                                              }
                                            >
                                              <div
                                                class="card-header p-3 pt-2"
                                                style={cardStyle}
                                              >
                                                <div className="row">
                                                  <div className="col-lg-6">
                                                    <img
                                                      src={EngagementLatterSendSvg}
                                                      className="CardImage"
                                                      alt
                                                    />
                                                  </div>
                                                  <div className="col-lg-6">
                                                    <div class="text-end pt-1">
                                                      <h4 class="mb-0 text-white ">
                                                        {
                                                          dashboardCount?.quotationDeclined
                                                        }
                                                      </h4>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div class="text-end pt-1"></div>
                                              </div>
                                              <hr class="dark horizontal my-0" />
                                              <div
                                                class="card-footer p-3"
                                                style={cardStyle}
                                              >
                                                <p class="mb-0 font-weight-bolder">
                                                  <span class="text-success text-sm font-weight-bolder" />
                                                  {proposalName} Declined
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                </>
                              )}
                          </div>
                          {/* proposal end  */}

                          {/* engagement start */}
                          <div className="row">
                            {(common.enableEL == 1 || common.enableEL == null) &&
                              (userAccessData.Admin_Engagement_Latter_CanView ||
                                common.organisationKeyID == null) && (
                                <>
                                  <div
                                    className={`col-xl-3 col-lg-3 col-md-4 dashboard-box col-sm-12  ${common.organisationKeyID !== null
                                      ? "cursor-pointer"
                                      : ""
                                      } `}
                                  >
                                    <div className="dashboard-new-design">
                                      <div
                                        class="card"
                                        onClick={() =>
                                          GetHandleChangeFilter(
                                            "Draft",
                                            statusID.Draft
                                          )
                                        }
                                      >
                                        <div
                                          class="card-header p-3 pt-2"
                                          style={cardStyle}
                                        >
                                          <div className="row">
                                            <div className="col-lg-6">
                                              <img
                                                src={EngagementLatterSendSvg}
                                                className="CardImage"
                                                alt
                                              />
                                            </div>
                                            <div className="col-lg-6">
                                              <div class="text-end pt-1">
                                                <h4 class="mb-0 text-white ">
                                                  {dashboardCount?.contractDraft}
                                                </h4>
                                              </div>
                                            </div>
                                          </div>
                                          <div class="text-end pt-1"></div>
                                        </div>
                                        <hr class="dark horizontal my-0" />
                                        <div
                                          class="card-footer p-3"
                                          style={cardStyle}
                                        >
                                          <p class="mb-0 font-weight-bolder">
                                            <span class="text-success text-sm font-weight-bolder" />
                                            Draft {EngagementName}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div
                                    className={`col-xl-3 col-lg-3 col-md-4 dashboard-box col-sm-12  ${common.organisationKeyID !== null
                                      ? "cursor-pointer"
                                      : ""
                                      } `}
                                  >
                                    <div className="dashboard-new-design">
                                      <div
                                        class="card"
                                        onClick={() =>
                                          GetHandleChangeFilter(
                                            "sent",
                                            statusID.Sent
                                          )
                                        }
                                      >
                                        <div
                                          class="card-header p-3 pt-2"
                                          style={cardStyle}
                                        >
                                          <div className="row">
                                            <div className="col-lg-6">
                                              <img
                                                src={EngagementLatterSendSvg}
                                                className="CardImage"
                                                alt
                                              />
                                            </div>
                                            <div className="col-lg-6">
                                              <div class="text-end pt-1">
                                                <h4 class="mb-0 text-white ">
                                                  {dashboardCount?.contractSent}
                                                </h4>
                                              </div>
                                            </div>
                                          </div>
                                          <div class="text-end pt-1"></div>
                                        </div>
                                        <hr class="dark horizontal my-0" />
                                        <div
                                          class="card-footer p-3"
                                          style={cardStyle}
                                        >
                                          <p class="mb-0 font-weight-bolder">
                                            <span class="text-success text-sm font-weight-bolder" />
                                            {EngagementName} Sent
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div
                                    className={`col-xl-3 col-lg-3 col-md-4 dashboard-box col-sm-12  ${common.organisationKeyID !== null
                                      ? "cursor-pointer"
                                      : ""
                                      } `}
                                  >
                                    <div className="dashboard-new-design">
                                      <div
                                        class="card"
                                        onClick={() =>
                                          GetHandleChangeFilter(
                                            "Awaiting",
                                            statusID.Awaiting_Signature
                                          )
                                        }
                                      >
                                        <div
                                          class="card-header p-3 pt-2"
                                          style={cardStyle}
                                        >
                                          <div className="row">
                                            <div className="col-lg-6">
                                              <img
                                                src={
                                                  EngagementLatterAwaitingSignatureSvg
                                                }
                                                className="CardImage"
                                                alt
                                              />
                                            </div>
                                            <div className="col-lg-6">
                                              <div class="text-end pt-1">
                                                <h4 class="mb-0 text-white ">
                                                  {
                                                    dashboardCount?.contractAwaitingSignature
                                                  }
                                                </h4>
                                              </div>
                                            </div>
                                          </div>

                                          <div class="text-end pt-1"></div>
                                        </div>
                                        <hr class="dark horizontal my-0" />
                                        <div
                                          class="card-footer p-3"
                                          style={cardStyle}
                                        >
                                          <p class="mb-0 font-weight-bolder">
                                            <span class="text-success text-sm font-weight-bolder" />
                                            {EngagementName} Viewed
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div
                                    className={`col-xl-3 col-lg-3 col-md-4 dashboard-box col-sm-12  ${common.organisationKeyID !== null
                                      ? "cursor-pointer"
                                      : ""
                                      } `}
                                  >
                                    <div className="dashboard-new-design">
                                      <div
                                        class="card"
                                        onClick={() =>
                                          GetHandleChangeFilter(
                                            "Signed",
                                            statusID.Signed
                                          )
                                        }
                                      >
                                        <div
                                          class="card-header p-3 pt-2"
                                          style={cardStyle}
                                        >
                                          <div className="row">
                                            <div className="col-lg-6">
                                              <img
                                                src={EngagementLatterSignedSvg}
                                                className="CardImage"
                                                alt
                                              />
                                            </div>
                                            <div className="col-lg-6">
                                              <div class="text-end pt-1">
                                                <h4 class="mb-0 text-white ">
                                                  {" "}
                                                  {dashboardCount?.contractSigned}
                                                </h4>
                                              </div>
                                            </div>
                                          </div>
                                          <div class="text-end pt-1"></div>
                                        </div>
                                        <hr class="dark horizontal my-0" />
                                        <div
                                          class="card-footer p-3"
                                          style={cardStyle}
                                        >
                                          <p class="mb-0 font-weight-bolder">
                                            <span class="text-success text-sm font-weight-bolder" />
                                            {EngagementName} Signed
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div
                                    className={`col-xl-3 col-lg-3 col-md-4 dashboard-box col-sm-12  ${common.organisationKeyID !== null
                                      ? "cursor-pointer"
                                      : ""
                                      } `}
                                  >
                                    <div className="dashboard-new-design">
                                      <div
                                        class="card"
                                        onClick={() =>
                                          GetHandleChangeFilter(
                                            "Decline",
                                            statusID.Declined
                                          )
                                        }
                                      >
                                        <div
                                          class="card-header p-3 pt-2"
                                          style={cardStyle}
                                        >
                                          <div className="row">
                                            <div className="col-lg-6">
                                              <img
                                                src={EngagementLaterDeclinedSvg}
                                                className="CardImage"
                                                alt
                                              />
                                            </div>
                                            <div className="col-lg-6">
                                              <div class="text-end pt-1">
                                                <h4 class="mb-0 text-white ">
                                                  {dashboardCount?.contractDeclined}
                                                </h4>
                                              </div>
                                            </div>
                                          </div>
                                          <div class="text-end pt-1"></div>
                                        </div>
                                        <hr class="dark horizontal my-0" />
                                        <div
                                          class="card-footer p-3"
                                          style={cardStyle}
                                        >
                                          <p class="mb-0 font-weight-bolder">
                                            <span class="text-success text-sm font-weight-bolder" />
                                            {EngagementName} Declined
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                          </div>
                        </div>
                        {(userAccessData.Admin_Activity_Log_CanView ||
                          common.organisationKeyID == null) && (
                            <>
                              <div class="col-xl-4 col-lg-4">
                                <div class="card activity-section-cls">
                                  <div class="card-body dashboard-body">
                                    <h5 className="activity-cls">Activity</h5>
                                    <ol class="activity-feed">
                                      {activityLogsList.length == 0 ? (
                                        <>
                                          <h6 className="activity-cls">
                                            No Activity Logs Found Today..
                                          </h6>
                                        </>
                                      ) : (
                                        <>
                                          {activityLogsList?.map(
                                            (ActivityLogList) => {
                                              return (
                                                <>
                                                  <li class="feed-item">
                                                    <div class="feed-item-list">
                                                      <span
                                                        style={{ color: "black" }}
                                                      >
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
                                                            `/${ActivityLogList?.moduleURL}`
                                                          );
                                                        }}
                                                      >
                                                        {ActivityLogList.logMessage
                                                          ?.replace(
                                                            /quotation/g,
                                                            proposalName
                                                          )
                                                          ?.replace(
                                                            /client/g,
                                                            prospectName
                                                          )
                                                          ?.replace(
                                                            /contract/g,
                                                            EngagementName
                                                          )}
                                                      </span>
                                                    </div>
                                                  </li>
                                                </>
                                              );
                                            }
                                          )}
                                        </>
                                      )}
                                    </ol>
                                    <>
                                      {" "}
                                      <div className="col-lg-12 col-md-12 col-sm-12 text-center">
                                        <div className="add-new-btn">
                                          <button
                                            className="btn btn-success create-item-btn add-new"
                                            onClick={handleActivityLog}
                                          >
                                            <span>View All</span>
                                          </button>
                                        </div>
                                      </div>
                                    </>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div class="row dashboard-top-class">
                  <div class="col">
                    <div class="h-100">
                      <div class="container">
                        <div class="row">
                          <div class="col-md-12 " style={{ textAlign: "center" }}>
                            <div class="error-template">
                              <h1>Oops!</h1>
                              <h2>No Permission </h2>
                              <div class="error-details">
                                Sorry, No Permission , Please Contact Admin!
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
        {/* <!-- container-fluid --> */}
      </div>
      {/* <!-- End Page-content --> */}

      <Footer />
    </div>
  );
};

export default Dashboard;
