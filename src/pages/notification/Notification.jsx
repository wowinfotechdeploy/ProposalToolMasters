import React, { useContext, useEffect, useState } from "react";
import "./Notification.css";
import "./Notification-redesign.css";
import { AuthContextProvider } from "../../AuthContext/AuthContext";
import Footer from "../../components/Footer";
import { GetNotificationList } from "../../redux/Services/Setting/NotificationApi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../../components/PaginationModel";
import NoResultFoundModel from "../../components/NoResultFoundModel";
const Notification = () => {
  const common = useSelector((state) => state.Storage);
  const [notificationList, setNotificationList] = useState();
  const [notificationCount, setNotificationCount] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  let getNotificationListApiCallCount = 0;
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const {
    setLoader,
    setTopbar,
    setListCount,
    maxCountToRecallApi,
    proposalName,
    prospectName,
    EngagementName,
    isMobile,
    isMobileRecords,
    listCount,
    desktopRecords,
    totalPage,
  } = useContext(AuthContextProvider);

  const pageSize = isMobile ? isMobileRecords : desktopRecords;
  useEffect(() => {
    setTopbar("block");
    setCurrentPage(1);
    GetNotification(currentPage);
  }, []);

  const GetNotification = async (i) => {
    setNotificationList([]);
    setLoader(true);
    const pageNoList = i - 1;
    try {
      const response = await GetNotificationList({
        pageNo: pageNoList,
        organisationKeyID: common.organisationKeyID,
        // pageNo: 0,
        // pageSize: pageSize,
        pageSize: isMobile ? 6 : 10,
        userKeyID: common.userKeyID,
      });

      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoader(false);
          getNotificationListApiCallCount = 0;
          if (response?.data?.responseData?.data) {
            const totalCount = response.data.totalCount;
            const NotificationListData = response?.data?.responseData?.data;
            if (pageNoList > 0 && NotificationListData.length === 0) {
              let newPageNo = Number(pageNoList);
              if (newPageNo > 1) {
                newPageNo = newPageNo - 1;
              }
              GetNotification(newPageNo);
              setCurrentPage(pageNoList);
              return;
            }
            setListCount(totalCount);
            setNotificationList(NotificationListData);
          }
        } else {
          if (getNotificationListApiCallCount < maxCountToRecallApi) {
            getNotificationListApiCallCount += 1;
            setTimeout(() => {
              GetNotification(i);
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

  const handlePageChange = async (pageNumber) => {
    setCurrentPage(pageNumber);
    await GetNotification(pageNumber); // Call your function with the selected page number
  };

  return (
    <div className="notification-redesign">
      <div className="notification-page">
        {/* =========================
            PAGE HEADER
            ========================= */}
        {/* <div className="notification-page-header">
          <div>
            <h1>Notifications</h1>
            <p>Track proposal, engagement letter and workspace activity.</p>
          </div>
        </div> */}

        {/* =========================
            NOTIFICATION TIMELINE
            ========================= */}
        <section className="notification-list-card">
          <div className="notification-list-card-header">
            <div>
              <h2>Recent Notifications</h2>
              <p>Review your latest activity and open the related record.</p>
            </div>

            {listCount > 0 && (
              <span className="notification-count">
                {listCount} {listCount === 1 ? "notification" : "notifications"}
              </span>
            )}
          </div>

          <div className="notification-list-body">
            {notificationList && notificationList.length > 0 ? (
              <div className="notification-timeline">
                {/* Keep the original first-half mapping and replacements exactly as-is */}
                <ol className="notification-feed">
                  {notificationList
                    .slice(0, Math.ceil(notificationList.length / 2))
                    .map((notificationVal, index) => (
                      <li key={index} className="notification-feed-item">
                        <span className="notification-timeline-dot"></span>

                        <div className="notification-card">
                          <div className="notification-card-icon">
                            <i className="ri-notification-3-line"></i>
                          </div>

                          <div className="notification-card-content">
                            <div className="notification-card-top">
                              <strong className="notification-card-title">
                                {notificationVal.title
                                  ?.replace(/quote/g, proposalName)
                                  ?.replace(/client/g, prospectName)
                                  ?.replace(/Quotation/g, prospectName)
                                  ?.replace(/contract/g, EngagementName)}
                              </strong>

                              <span className="notification-card-date">
                                {notificationVal.notificationDate.replace(
                                  /^(.+\d{4})\s+(.+)$/,
                                  (match, p1, p2) => `${p1}  •  ${p2.trim()}`,
                                )}
                              </span>
                            </div>

                            <span
                              className="notification-card-message"
                              onClick={() => {
                                navigate(`/${notificationVal.moduleURL}`);
                              }}
                            >
                              {notificationVal?.message
                                ?.replace(/quotation/g, proposalName)
                                ?.replace(/client/g, prospectName)
                                ?.replace(/contract/g, EngagementName)}
                            </span>
                          </div>

                          <span className="notification-card-arrow">
                            <i className="ri-arrow-right-s-line"></i>
                          </span>
                        </div>
                      </li>
                    ))}
                </ol>

                {/* Keep the original second-half mapping and replacements exactly as-is */}
                <ol className="notification-feed notification-feed-continuation">
                  {notificationList
                    .slice(Math.ceil(notificationList.length / 2))
                    .map((notificationVal, index) => (
                      <li key={index} className="notification-feed-item">
                        <span className="notification-timeline-dot"></span>

                        <div className="notification-card">
                          <div className="notification-card-icon">
                            <i className="ri-notification-3-line"></i>
                          </div>

                          <div className="notification-card-content">
                            <div className="notification-card-top">
                              <strong className="notification-card-title">
                                {notificationVal.title
                                  ?.replace(/quote/g, proposalName)
                                  ?.replace(/Quotation/g, proposalName)
                                  ?.replace(/client/g, prospectName)
                                  ?.replace(/contract/g, EngagementName)}
                              </strong>

                              <span className="notification-card-date">
                                {notificationVal.notificationDate.replace(
                                  /^(.+\d{4})\s+(.+)$/,
                                  (match, p1, p2) => `${p1}  •  ${p2.trim()}`,
                                )}
                              </span>
                            </div>

                            <span
                              className="notification-card-message"
                              onClick={() => {
                                navigate(`/${notificationVal.moduleURL}`);
                              }}
                            >
                              {notificationVal?.message
                                ?.replace(/quotation/g, proposalName)
                                ?.replace(/client/g, prospectName)
                                ?.replace(/contract/g, EngagementName)}
                            </span>
                          </div>

                          <span className="notification-card-arrow">
                            <i className="ri-arrow-right-s-line"></i>
                          </span>
                        </div>
                      </li>
                    ))}
                </ol>
              </div>
            ) : (
              <div className="notification-empty-state">
                <NoResultFoundModel name={" Notification "} />
              </div>
            )}
          </div>

          {listCount > pageSize && (
            <div className="notification-pagination">
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
      </div>

      <div className="notification-footer-wrap">
        <Footer />
      </div>

      <button className="btn btn-danger btn-icon" id="back-to-top">
        <i className="ri-arrow-up-line"></i>
      </button>
    </div>
  );
};

export default Notification;
