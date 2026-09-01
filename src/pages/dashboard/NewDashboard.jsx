import React, { useContext, useEffect, useState } from "react";
import "./Dashboard.css";
import "./NewDashboardFigmaV2.css";
import { ColorContext } from "../../AuthContext/ColorContext";
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
import { GetProspectTypeVariationLookupList } from "../../redux/Services/Master/BusinessTypeLookupListApi";
import { GetProposalList } from "../../redux/Services/Proposal/ProposalApi";
import { GetEngagementList } from "../../redux/Services/EngagementLetter/EngagementLetterApi";
import { GetNOBTypeLookupList } from "../../redux/Services/Master/NOBTypeLookupListApi";
import * as XLSX from "xlsx";
import { CalendarDays, Download } from "lucide-react";

const NewDashboard = () => {
  const getFilterHeading = (selectedOption) => {
    switch (selectedOption.value) {
      case CalenderFilterEnum.All:
        return "All Records";
      case CalenderFilterEnum.This_Week:
        return "This Week ";
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
    setTopbar,
    setLoader,
    accessCount,
    proposalName,
    setListCount,
    prospectName,
    GetCustomDate,
    userAccessData,
    EngagementName,
    setProposalName,
    setProspectName,
    setOrgLoaderList,
    setEngagementName,
    formatValue,
    maxCountToRecallApi,
    setActiveOrganization,
    getCurrencySymbol,
    setDashboardCountListLoader,
    setDashboardActivityLogLoader,
    loader,
    GetOnlyDate,
  } = useContext(AuthContextProvider);

  useContext(ColorContext);

  let getActivityLogListApiCallCount = 0;
  let getOrganisationLookupListApiCallCount = 0;

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currencyID, setCurrencyID] = useState(1);
  const [selectedOption, setSelectedOption] = useState(Utils.CalenderFilter[0]);
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());
  const [fromDateForFilter, setFromDateForFilter] = useState(null);
  const [toDateForFilter, setToDateForFilter] = useState(null);
  const [fromDateForExport, setFromDateForExport] = useState(null);
  const [toDateForExport, setToDateForExport] = useState(null);
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
  const [dashboardCount, setDashboardCount] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const common = useSelector((state) => state.Storage);

  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth() + 1,
  ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

  useEffect(() => {
    GetActivityLog();
    DashboardCountData();
  }, [common.organisationKeyID, common.userKeyID]);

  useEffect(() => {
    const OrganisationLocalList = localStorage.getItem("OrganisationLocalList");

    if (OrganisationLocalList === undefined || OrganisationLocalList === null) {
      GetOrganisationsListData(common.userKeyID);
    } else {
      OrganisationLocalListData();
    }
  }, []);

  useEffect(() => {
    setTopbar("block");
  }, []);

  const getWeekDateRange = () => {
    const startDate = dayjs().subtract(100, "day");
    const endDate = dayjs();
    return { startDate, endDate };
  };

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
            const ActivityList = data.data.responseData.data;

            if (pageNoList > 0 && ActivityList.length === 0) {
              let newPaneNo = Number(pageNoList);
              if (newPaneNo > 1) newPaneNo -= 1;
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
            setTimeout(() => GetActivityLog(i), 2000);
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
    try {
      let BusinessTypeListData = [];

      const ProspectData = await GetProspectTypeVariationLookupList(
        common.organisationKeyID,
        common.userKeyID,
      );

      if (
        ProspectData?.data?.statusCode === 200 &&
        ProspectData?.data?.responseData?.data
      ) {
        BusinessTypeListData = ProspectData.data.responseData.data.map(
          (BusinessType) => ({
            value: BusinessType.businessTypeID,
            label: BusinessType.businessTypeName,
          }),
        );
      }

      let NoBTypeListData = [];

      const NOBType = await GetNOBTypeLookupList(
        common.organisationKeyID,
        common.userKeyID,
      );

      if (
        NOBType?.data?.statusCode === 200 &&
        NOBType?.data?.responseData?.data
      ) {
        NoBTypeListData = NOBType.data.responseData.data.map((NOB) => ({
          value: NOB.businessNatureID,
          label: NOB.businessNatureName,
        }));
      }

      const data = await DashboardCountData(fromDateForExport, toDateForExport);

      if (data && data.data.statusCode === 200) {
        if (data?.data?.responseData) {
          const DashboardCountsListData = data.data.responseData;
          const filterHeading = getFilterHeading(selectedOption);

          let OrganisationList = localStorage.getItem("OrganisationLocalList");
          let OrganisationListData = [];

          if (OrganisationList) {
            OrganisationListData = JSON.parse(OrganisationList);
          }

          const orgName =
            OrganisationListData.find(
              (org) => org.organisationKeyID === common.organisationKeyID,
            )?.organisationName || "Unknown";

          const headersArray = [
            ["Practice Name", orgName],
            ["Reporting Period", filterHeading],
          ];

          const defaultColumns = {
            quotationDraft: `${proposalName} Draft`,
            quotationSent: `${proposalName} Sent`,
            quotationAccepted: `${proposalName} Accepted`,
            quotationDeclined: `${proposalName} Declined`,
          };

          const engagementColumns = {
            contractDraft: `${EngagementName} Draft`,
            contractSent: `${EngagementName} Sent`,
            contractAwaitingSignature: `${EngagementName} Viewed`,
            contractAccepted: `${EngagementName} Accepted`,
            contractSigned: `${EngagementName} Signed`,
            contractDeclined: `${EngagementName} Declined`,
            contractVoid: `${EngagementName} Void`,
          };

          const columnsToShow =
            common.enableEL == 1
              ? { ...defaultColumns, ...engagementColumns }
              : { ...defaultColumns };

          const baseRows = [];

          for (const [, value] of Object.entries(DashboardCountsListData)) {
            if (!value || typeof value !== "object") continue;

            for (const [subKey, val] of Object.entries(value)) {
              if (subKey in columnsToShow && val > 0) {
                baseRows.push([columnsToShow[subKey], val]);
              }
            }
          }

          headersArray.push([]);
          headersArray.push([]);

          const baseRowsProposal = [];
          const proposalHeader = [
            "Ref Id",
            "Prospect Name",
            "Prospect Type",
            "Nature Of Business",
            "Recurring Price",
            "One Off Price",
            "Status",
            "Last Updated On",
            "Drafted On Date",
            "Sent On Date",
            "Accepted On Date",
            "Declined On Date",
          ];

          baseRowsProposal.push(proposalHeader);
          baseRowsProposal.push([]);

          const proposalDataResponse = await GetProposalList({
            organisationKeyID: common.organisationKeyID,
            pageSize: 30,
            pageNo: 0,
            userKeyID: common.userKeyID || null,
            fromDate: fromDateForExport === "" ? null : fromDateForExport,
            toDate: toDateForExport === "" ? null : toDateForExport,
          });

          if (proposalDataResponse?.data?.statusCode === 200) {
            const proposalData =
              proposalDataResponse.data.responseData.data || [];

            const statusMappings = [
              { id: 1, label: "Draft" },
              { id: 2, label: "Sent" },
              { id: 6, label: "Accepted" },
              { id: 7, label: "Declined" },
            ];

            statusMappings.forEach(({ id, label }) => {
              const filteredData = proposalData.filter(
                (item) => item.statusID === id,
              );

              const dataRows = filteredData.map((item) => [
                item.prefix,
                item.clientName,
                item.businessTypeName,
                item.businessNatureName,
                formatValue(item.recurringPrice, 1),
                formatValue(item.oneOffPrice, 1),
                label,
                item.lastUpdatedOn ||
                  item.acceptDeclineDate ||
                  item.sentOn ||
                  item.createdOn ||
                  "-",
                item.createdOn || "-",
                item.statusID !== 1 && item.statusID !== 3 ? item.sentOn : "-",
                item.statusID === 6 ? item.acceptDeclineDate : "-",
                item.statusID === 7 ? item.acceptDeclineDate : "-",
              ]);

              baseRowsProposal.push(...dataRows);
            });
          }

          let baseRowsContract = [];

          if (common.enableEL === 1) {
            const contractHeader = [
              "Ref Id",
              "Prospect Name",
              "Prospect Type",
              "Nature Of Business",
              "Recurring Price",
              "One Off Price",
              "Status",
              "Last Updated On",
              "Drafted On Date",
              "Sent On Date",
              "Viewed On Date",
              "Signed On Date",
              "Declined On Date",
              "Void On Date",
            ];

            baseRowsContract.push(contractHeader);
            baseRowsContract.push([]);

            const contractDataResponse = await GetEngagementList({
              organisationKeyID: common.organisationKeyID,
              pageSize: 30,
              pageNo: 0,
              userKeyID: common.userKeyID || null,
              fromDate: fromDateForExport === "" ? null : fromDateForExport,
              toDate: toDateForExport === "" ? null : toDateForExport,
            });

            if (contractDataResponse?.data?.statusCode === 200) {
              const contractData =
                contractDataResponse.data.responseData.data || [];

              const statusMappings = [
                { id: 1, label: "Draft" },
                { id: 2, label: "Sent" },
                { id: 4, label: "Viewed" },
                { id: 5, label: "Signed" },
                { id: 7, label: "Declined" },
                { id: 8, label: "Void" },
              ];

              statusMappings.forEach(({ id, label }) => {
                const filteredData = contractData.filter(
                  (item) => item.statusID === id,
                );

                const dataRows = filteredData.map((item) => [
                  item.prefix,
                  item.clientName,
                  item.businessTypeName,
                  item.businessNatureName,
                  formatValue(item.recurringPrice, 1),
                  formatValue(item.oneOffPrice, 1),
                  label,
                  item.lastUpdatedOn
                    ? item.lastUpdatedOn
                    : item.statusID === 5
                      ? GetOnlyDate(item.signedOn)
                      : (item.declinedOn ??
                        item.viewedOn ??
                        item.sentOn ??
                        item.createdOn ??
                        "-"),
                  item.createdOn || "-",
                  item.sentOn || "-",
                  item.viewedOn || "-",
                  item.statusID === 5 ? GetOnlyDate(item.signedOn) : "-",
                  item.statusID === 7 ? item.declinedOn : "-",
                  item.statusID === 8 ? item.lastUpdatedOn : "-",
                ]);

                baseRowsContract.push(...dataRows);
              });
            }
          }

          const worksheetData = [...headersArray, ...baseRows];
          const worksheetProposalData = [...headersArray, ...baseRowsProposal];
          const worksheetContractData = [...headersArray, ...baseRowsContract];

          const workbook = XLSX.utils.book_new();
          const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
          const worksheetProposal = XLSX.utils.aoa_to_sheet(
            worksheetProposalData,
          );
          const worksheetContract = XLSX.utils.aoa_to_sheet(
            worksheetContractData,
          );

          const getWidths = (rows) =>
            rows
              .reduce((widths, row) => {
                row.forEach((cell, i) => {
                  const value =
                    cell !== null && cell !== undefined ? String(cell) : "";
                  widths[i] = Math.max(widths[i] || 0, value.length);
                });
                return widths;
              }, [])
              .map((w) => ({ wch: w + 2 }));

          worksheet["!cols"] = getWidths(worksheetData);
          worksheetProposal["!cols"] = getWidths(worksheetProposalData);
          worksheetContract["!cols"] = getWidths(worksheetContractData);

          XLSX.utils.book_append_sheet(workbook, worksheet, "Summary");

          if (common.organisationKeyID) {
            XLSX.utils.book_append_sheet(
              workbook,
              worksheetProposal,
              "Proposal",
            );

            if (common.enableEL === 1) {
              XLSX.utils.book_append_sheet(
                workbook,
                worksheetContract,
                "Engagement Letter",
              );
            }
          }

          XLSX.writeFile(
            workbook,
            `Dashboard_Data_${orgName}_${filterHeading}.xlsx`,
          );

          await DashboardCountData(fromDateForExport, toDateForExport);
        } else {
          console.error("No data available for export");
        }
      } else {
        console.error("Failed to fetch data for export");
      }
    } catch (error) {
      console.error("Error during export:", error);
    }
  };

  const DashboardCountData = async (startDate, endDate) => {
    if (
      common?.organisationKeyID === "" ||
      common?.organisationKeyID === undefined ||
      common?.userKeyID === "" ||
      common?.userKeyID === undefined
    ) {
      return;
    }

    setDashboardCount([]);
    setLoader(true);

    try {
      getWeekDateRange();

      const StartDate = startDate ? startDate.format("YYYY-MM-DD") : null;
      const EndDate = endDate ? endDate.format("YYYY-MM-DD") : null;

      const response = await DashboardCountList({
        organisationKeyID: common.organisationKeyID,
        pageNo: 0,
        pageSize: 30,
        fromDate: StartDate,
        toDate: EndDate,
        userKeyID: common.userKeyID,
      });

      if (response) {
        if (response?.data?.statusCode === 200) {
          setDashboardCountListLoader(true);

          if (startDate !== undefined && endDate !== undefined) {
            setLoader(false);
          }

          if (response?.data?.responseData?.currencyID) {
            dispatch(
              updateState({
                currency: getCurrencySymbol(
                  response.data.responseData.currencyID,
                ),
              }),
            );
            setCurrencyID(response.data.responseData.currencyID);
          } else {
            setCurrencyID(1);
          }

          if (response?.data?.responseData?.data) {
            setDashboardCount(response.data.responseData.data);
          }
        } else {
          setDashboardCountListLoader(true);

          if (startDate !== undefined && endDate !== undefined) {
            setLoader(false);
          }

          setErrorMessage(response?.data?.errorMessage);
        }

        setTimeout(() => setLoader(false), 2000);
        return response;
      }
    } catch (error) {
      console.log(error);

      if (startDate !== undefined && endDate !== undefined) {
        setLoader(false);
      }

      setTimeout(() => setLoader(false), 2000);
      setDashboardCountListLoader(true);
    }
  };

  const handleCalenderFilterChange = (option) => {
    const dateFormat = "mm-dd-yyyy";
    setSelectedOption(option);

    const applyPreset = (filter) => {
      const dates = GetCustomDate(dateFormat, filter);

      setFromDateForFilter(dates.fromDate);
      setToDateForFilter(dates.toDate);
      setFromDateForExport(dates.fromDate);
      setToDateForExport(dates.toDate);

      DashboardCountData(dates.fromDate, dates.toDate);
      setShowDatePicker(false);
    };

    switch (option.value) {
      case CalenderFilterEnum.All:
        DashboardCountData(null, null);
        setFromDateForFilter(null);
        setToDateForFilter(null);
        setFromDateForExport(null);
        setToDateForExport(null);
        setShowDatePicker(false);
        break;
      case CalenderFilterEnum.This_Week:
        applyPreset(CalenderFilterEnum.This_Week);
        break;
      case CalenderFilterEnum.Last_Week:
        applyPreset(CalenderFilterEnum.Last_Week);
        break;
      case CalenderFilterEnum.This_Month:
        applyPreset(CalenderFilterEnum.This_Month);
        break;
      case CalenderFilterEnum.Last_Month:
        applyPreset(CalenderFilterEnum.Last_Month);
        break;
      case CalenderFilterEnum.This_Quarter:
        applyPreset(CalenderFilterEnum.This_Quarter);
        break;
      case CalenderFilterEnum.Last_Quarter:
        applyPreset(CalenderFilterEnum.Last_Quarter);
        break;
      case CalenderFilterEnum.This_6_Months:
        applyPreset(CalenderFilterEnum.This_6_Months);
        break;
      case CalenderFilterEnum.Last_6_Months:
        applyPreset(CalenderFilterEnum.Last_6_Months);
        break;
      case CalenderFilterEnum.This_Year:
        applyPreset(CalenderFilterEnum.This_Year);
        break;
      case CalenderFilterEnum.Last_Year:
        applyPreset(CalenderFilterEnum.Last_Year);
        break;
      case CalenderFilterEnum.Custom_Date_Range:
        setShowDatePicker(true);
        break;
      default:
        break;
    }
  };

  const OrganisationLocalListData = async () => {
    const OrganisationList = localStorage.getItem("OrganisationLocalList");

    if (!OrganisationList) return;

    const OrganisationListData = JSON.parse(OrganisationList);
    setOrganisationsList(OrganisationListData);

    let organisationData = [];

    if (common.organisationKeyID == null) {
      organisationData = await OrganisationListData.find(
        (item) => null == item.organisationKeyID,
      );
    } else if (common.organisationKeyID == "") {
      organisationData = OrganisationListData[0];
    } else {
      organisationData = await OrganisationListData.find(
        (item) =>
          common.organisationKeyID?.toUpperCase() ==
          item.organisationKeyID?.toUpperCase(),
      );
    }

    if (organisationData == undefined) return;

    localStorage.setItem(
      "userAccess",
      JSON.stringify(organisationData.accessList),
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
            break;
        }
      });
    } else {
      setEngagementName("");
      setProposalName("");
      setProspectName("");
    }

    if (OrganisationListData && common.organisationKeyID === "") {
      dispatch(
        updateState({
          businessTypeID: organisationData.businessTypeID,
          organisationKeyID: organisationData.organisationKeyID,
          professionTypeLists: organisationData.professionTypeLists,
          organisationCount: OrganisationListData.length,
          enableEL: organisationData.enableEL,
          currencyID: organisationData.currencyID,
          currency: getCurrencySymbol(organisationData.currencyID),
        }),
      );
    }
  };

  const getOrganizationNameByKeyID = (organisationsList, organisationKeyID) => {
    return (
      organisationsList.find(
        (org) => org.organisationKeyID === organisationKeyID,
      )?.organisationName || ""
    );
  };

  const orgName = getOrganizationNameByKeyID(
    organisationsList,
    common.organisationKeyID,
  );

  const GetOrganisationsListData = async (KeyID) => {
    try {
      setLoader(true);

      const response = await GetOrganisationLookupList(KeyID);

      if (
        response?.data?.statusCode === 200 &&
        response?.data?.responseData?.data
      ) {
        getOrganisationLookupListApiCallCount = 0;

        const OrganisationsListData = response.data.responseData.data;

        localStorage.removeItem("OrganisationLocalList");
        localStorage.setItem(
          "OrganisationLocalList",
          JSON.stringify(OrganisationsListData),
        );

        setOrganisationsList(OrganisationsListData);

        let organisationData;

        if (common.organisationKeyID == null) {
          organisationData = await OrganisationsListData.find(
            (item) => null == item.organisationKeyID,
          );
        } else if (common.organisationKeyID == "") {
          organisationData = OrganisationsListData[0];
        } else {
          organisationData = await OrganisationsListData.find(
            (item) =>
              common.organisationKeyID?.toUpperCase() ==
              item.organisationKeyID?.toUpperCase(),
          );
        }

        if (organisationData == undefined) return;

        localStorage.setItem(
          "userAccess",
          JSON.stringify(organisationData.accessList),
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
                break;
            }
          });

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
            }),
          );
        } else if (
          getOrganisationLookupListApiCallCount < maxCountToRecallApi
        ) {
          setOrgLoaderList(true);
          getOrganisationLookupListApiCallCount += 1;
          setTimeout(() => GetOrganisationsListData(KeyID), 2000);
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

  const handleAddData = (type, proposalValue) => {
    setModelRequestData((prevData) => ({
      ...prevData,
      Draft: type === "Draft" ? proposalValue : null,
      Sent: type === "Sent" ? proposalValue : null,
      Accepted: type === "Accepted" ? proposalValue : null,
      Decline: type === "Decline" ? proposalValue : null,
    }));

    const addFilterData = {
      proposalType: proposalValue,
      selectedOption: selectedOption ? selectedOption.value : null,
      fromDate: fromDateForFilter ? fromDateForFilter.toISOString() : null,
      toDate: toDateForFilter ? toDateForFilter.toISOString() : null,
    };

    if (common.organisationKeyID !== null) {
      navigate("/proposals", { state: addFilterData });
    }
  };

  const GetHandleChangeFilter = (type, proposalValue) => {
    setModelRequestData((prevData) => ({
      ...prevData,
      Draft: type === "Draft" ? proposalValue : null,
      Void: type === "Void" ? proposalValue : null,
      Sent: type === "Sent" ? proposalValue : null,
      Accepted: type === "Accepted" ? proposalValue : null,
      Decline: type === "Decline" ? proposalValue : null,
      Signed: type === "Signed" ? proposalValue : null,
      Awaited: type === "Awaiting" ? proposalValue : null,
    }));

    const addFilterData = {
      proposalType: proposalValue,
      selectedOption: selectedOption || null,
      fromDate: fromDateForFilter ? fromDateForFilter.toISOString() : null,
      toDate: toDateForFilter ? toDateForFilter.toISOString() : null,
    };

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
  };

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
  };

  const calculateGBPAmount = (onOffValue, recurringValue) => {
    const total = Number(onOffValue || 0) + Number(recurringValue || 0);
    const currencySymbol = getCurrencySymbol(currencyID);

    const formatWithCommas = (value) =>
      new Intl.NumberFormat("en-GB", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      }).format(value);

    if (total >= 1_000_000_000_000) {
      const value = Math.ceil((total / 1_000_000_000_000) * 10) / 10;
      return `${currencySymbol}${formatWithCommas(value)}t`;
    }

    if (total >= 1_000_000_000) {
      const value = Math.ceil((total / 1_000_000_000) * 10) / 10;
      return `${currencySymbol}${formatWithCommas(value)}b`;
    }

    if (total >= 1_000_000) {
      const value = Math.ceil((total / 1_000_000) * 10) / 10;
      return `${currencySymbol}${formatWithCommas(value)}m`;
    }

    if (total >= 1_000) {
      const value = Math.ceil((total / 1_000) * 10) / 10;
      return `${currencySymbol}${formatWithCommas(value)}k`;
    }

    return new Intl.NumberFormat(currencyID === 3 ? "en-US" : "en-GB", {
      style: "currency",
      currency:
        currencyID === 1
          ? "GBP"
          : currencyID === 2
            ? "EUR"
            : currencyID === 3
              ? "USD"
              : "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(total);
  };

  const DashboardMetricCard = ({
    title,
    count,
    amount,
    icon,
    tone = "neutral",
    primary = false,
    onClick,
  }) => (
    <article
      className={`nd-card ${primary ? "nd-card--primary" : ""} ${
        common.organisationKeyID !== null ? "nd-card--clickable" : ""
      }`}
      onClick={onClick}
    >
      <div className="nd-card__top">
        <span className={`nd-card__icon nd-card__icon--${tone}`}>
          <img src={icon} alt="" />
        </span>

        <span className="nd-card__amount">{amount}</span>
      </div>

      <div className="nd-card__bottom">
        <span className="nd-card__title">{title}</span>
        <strong className="nd-card__count">{count ?? 0}</strong>
      </div>
    </article>
  );

  const firstName =
    common?.name?.trim()?.split(" ")?.[0] || common?.name || "there";

  return (
    <div className="main-content nd-page">
      <div className="nd-page__inner">
        {accessCount === undefined || loader ? (
          <div className="center-screen">
            <div className="text-center">
              <h5 className="mt-4">Loading...</h5>
            </div>
          </div>
        ) : accessCount !== 0 ? (
          <>
            <header className="nd-welcome">
              <h1>Welcome, {firstName}!</h1>
              <p>Here's what's happening with your practice today.</p>
            </header>

            <div className="nd-toolbar">
              <div className="nd-period">
                <CalendarDays
                  className="nd-period__icon"
                  size={16}
                  strokeWidth={1.8}
                />

                <Select
                  className="nd-period__select"
                  classNamePrefix="nd-select"
                  options={Utils.CalenderFilter}
                  value={selectedOption}
                  onChange={handleCalenderFilterChange}
                  isSearchable={false}
                />
              </div>

              <button
                className="nd-export"
                type="button"
                onClick={handleExport}
              >
                <Download size={18} strokeWidth={1.9} />
                <span>Export</span>
              </button>
            </div>

            {showDatePicker && (
              <div className="nd-custom-dates">
                <DatePicker
                  value={fromDate.toDate()}
                  maxDate={toDate.toDate()}
                  onChange={handleFromDateChange}
                />

                <DatePicker
                  value={toDate.toDate()}
                  minDate={fromDate.toDate()}
                  maxDate={dayjs().toDate()}
                  onChange={handleToDateChange}
                />
              </div>
            )}

            <div className="nd-layout">
              <section className="nd-grid">
                {(userAccessData.Admin_Proposal_CanView ||
                  common.organisationKeyID == null) && (
                  <>
                    <DashboardMetricCard
                      title={`Draft ${proposalName}`}
                      count={dashboardCount?.quotationDraft}
                      amount={calculateGBPAmount(
                        dashboardCount.quotationDraft_AmountOneOff,
                        dashboardCount.quotationDraft_AmountRecc,
                      )}
                      icon={`/assets/icons/draft.svg`}
                      tone="neutral"
                      primary
                      onClick={() => handleAddData("Draft", statusID.Draft)}
                    />

                    <DashboardMetricCard
                      title={`${proposalName} Sent`}
                      count={dashboardCount?.quotationSent}
                      amount={calculateGBPAmount(
                        dashboardCount.quotationSent_AmountOneOff,
                        dashboardCount.quotationSent_AmountRecc,
                      )}
                      icon={`/assets/icons/send.svg`}
                      tone="blue"
                      onClick={() => handleAddData("Sent", statusID.Sent)}
                    />

                    <DashboardMetricCard
                      title={`${proposalName} Accepted`}
                      count={dashboardCount?.quotationAccepted}
                      amount={calculateGBPAmount(
                        dashboardCount.quotationAccepted_AmountOneOff,
                        dashboardCount.quotationAccepted_AmountRecc,
                      )}
                      icon={`/assets/icons/tick.svg`}
                      tone="green"
                      onClick={() =>
                        handleAddData("Accepted", statusID.Accepted)
                      }
                    />

                    {(common.enableEL == 0 || common.enableEL == null) && (
                      <>
                        <DashboardMetricCard
                          title={`${proposalName} Awaiting Response`}
                          count={dashboardCount?.quotationAwaitingSignature}
                          amount={calculateGBPAmount(
                            dashboardCount.quotationAwaitingSignatureEnd_AmountRecc,
                            dashboardCount.quotationAwaitingSignatureEnd_AmountOneOff,
                          )}
                          icon={`/assets/icons/draftEL.svg`}
                          tone="neutral"
                          onClick={() =>
                            handleAddData("Sent", statusID.Awaiting_Signature)
                          }
                        />

                        <DashboardMetricCard
                          title={`${proposalName} Declined`}
                          count={dashboardCount?.quotationDeclined}
                          amount={calculateGBPAmount(
                            dashboardCount.quotationDeclined_AmountOneOff,
                            dashboardCount.quotationDeclined_AmountRecc,
                          )}
                          icon={`/assets/icons/cross.svg`}
                          tone="red"
                          onClick={() =>
                            handleAddData("Decline", statusID.Declined)
                          }
                        />
                      </>
                    )}
                  </>
                )}

                {(common.enableEL == 1 || common.enableEL == null) &&
                  (userAccessData.Admin_Engagement_Latter_CanView ||
                    common.organisationKeyID == null) && (
                    <>
                      <DashboardMetricCard
                        title={`Draft ${EngagementName}`}
                        count={dashboardCount?.contractDraft}
                        amount={calculateGBPAmount(
                          dashboardCount.contractDraft_AmountOneOff,
                          dashboardCount.contractDraft_AmountRecc,
                        )}
                        icon={`/assets/icons/draftEL.svg`}
                        tone="neutral"
                        onClick={() =>
                          GetHandleChangeFilter("Draft", statusID.Draft)
                        }
                      />

                      {dashboardCount?.contractVoid > 0 && (
                        <DashboardMetricCard
                          title={`Voided ${EngagementName}`}
                          count={dashboardCount?.contractVoid}
                          amount={calculateGBPAmount(
                            dashboardCount.contractVoid_AmountOneOff,
                            dashboardCount.contractVoid_AmountRecc,
                          )}
                          icon={`/assets/icons/cross.svg`}
                          tone="red"
                          onClick={() =>
                            GetHandleChangeFilter("Void", statusID.Void)
                          }
                        />
                      )}

                      <DashboardMetricCard
                        title={`${EngagementName} Sent`}
                        count={dashboardCount?.contractSent}
                        amount={calculateGBPAmount(
                          dashboardCount.contractSent_AmountOneOff,
                          dashboardCount.contractSent_AmountRecc,
                        )}
                        icon={`/assets/icons/attachment.svg`}
                        tone="blue"
                        onClick={() =>
                          GetHandleChangeFilter("Sent", statusID.Sent)
                        }
                      />

                      <DashboardMetricCard
                        title={`${EngagementName} Viewed`}
                        count={dashboardCount?.contractAwaitingSignature}
                        amount={calculateGBPAmount(
                          dashboardCount.contractViewed_AmountRecc,
                          dashboardCount.contractViewed_AmountOneOff,
                        )}
                        icon={`/assets/icons/eye.svg`}
                        tone="neutral"
                        onClick={() =>
                          GetHandleChangeFilter(
                            "Viewed",
                            statusID.Awaiting_Signature,
                          )
                        }
                      />

                      <DashboardMetricCard
                        title={`${EngagementName} Signed`}
                        count={dashboardCount?.contractSigned}
                        amount={calculateGBPAmount(
                          dashboardCount.contractSigned_AmountOneOff,
                          dashboardCount.contractSigned_AmountRecc,
                        )}
                        icon={`/assets/icons/sign.svg`}
                        tone="green"
                        onClick={() =>
                          GetHandleChangeFilter("Signed", statusID.Signed)
                        }
                      />

                      <DashboardMetricCard
                        title={`${EngagementName} Declined`}
                        count={dashboardCount?.contractDeclined}
                        amount={calculateGBPAmount(
                          dashboardCount.contractDeclined_AmountOneOff,
                          dashboardCount.contractDeclined_AmountRecc,
                        )}
                        icon={`/assets/icons/draftEL.svg`}
                        tone="red"
                        onClick={() =>
                          GetHandleChangeFilter("Decline", statusID.Declined)
                        }
                      />
                    </>
                  )}
              </section>

              {(userAccessData.Admin_Activity_Log_CanView ||
                common.organisationKeyID == null) && (
                <aside className="nd-activity">
                  <h2>Recent Activity</h2>

                  {activityLogsList.length === 0 ? (
                    <div className="nd-activity__empty">
                      No Activity Logs Found Today..
                    </div>
                  ) : (
                    <ol className="nd-activity__list">
                      {activityLogsList.map((ActivityLogList, index) => (
                        <li
                          className="nd-activity__item"
                          key={`${ActivityLogList?.logDateTime}-${index}`}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/${ActivityLogList?.moduleURL}`)
                            }
                          >
                            {ActivityLogList.logMessage
                              ?.replace(/quotation/g, proposalName)
                              ?.replace(/client/g, prospectName)
                              ?.replace(/contract/g, EngagementName)}
                          </button>

                          <span>{ActivityLogList.logDateTime}</span>
                        </li>
                      ))}
                    </ol>
                  )}

                  <button
                    className="nd-activity__view-all"
                    type="button"
                    onClick={handleActivityLog}
                  >
                    View All
                  </button>
                </aside>
              )}
            </div>
          </>
        ) : (
          <div className="error-template text-center">
            <h1>Oops!</h1>
            <h2>No Permission</h2>
            <div className="error-details">
              Sorry, No Permission , Please Contact Admin!
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default NewDashboard;
