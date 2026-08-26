import React, { useContext, useEffect, useState } from "react";
import "./Notification.css";
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
    <div className="container-fluid">
      {/* <div class="main-content"> */}
        <div class="services page-background">
          <div class="">
            <div class="row">
              <div class="col-lg-12">
                <div class="card">
                  {/* end card header  */}
                  <div class="card-body mb-2">
                    <div id="customerList" style={{marginTop: "3rem"}}>
                      <div class="bg-light border-bottom px-2">
                        <div class="">
                          <div className="row">
                <div className="col-md-4 col-4">
              <h4 class="page-display-title fw-bold">Notifications</h4>
            </div>
          </div>
          <div class="">
            <div class="row">
              <div class="col-12 mt-3">
                <div class="card cus-card">
                  <div
                    class="card-body"
                  >
                    {notificationList && notificationList.length > 0 ? (
                      <div class="row">
                        <div class="col-md-6">
                          <ol class="activity-feed ">
                            {notificationList
                              .slice(0, Math.ceil(notificationList.length / 2))
                              .map((notificationVal, index) => (
                                <li key={index} class="feed-item">
                                  <div class="feed-item-list">
                                    <span class="date">
                                      <strong>
                                        {notificationVal.title
                                          ?.replace(/quote/g, proposalName)
                                          ?.replace(/client/g, prospectName)
                                          ?.replace(/Quotation/g, prospectName)
                                          ?.replace(
                                            /contract/g,
                                            EngagementName
                                          )}{" "}
                                       {notificationVal.notificationDate.replace(/^(.+\d{4})\s+(.+)$/, (match, p1, p2) => `[ ${p1}  (${p2.trim()}) ]`)}                                       
                                      </strong>
                                    </span>

                                    <span
                                      style={{
                                        color: "blue",
                                        cursor: "pointer",
                                      }}
                                      class="activity-text"
                                      onClick={() => {
                                        navigate(
                                          `/${notificationVal.moduleURL}`
                                        );
                                      }}
                                    >
                                      {notificationVal?.message
                                        ?.replace(/quotation/g, proposalName)
                                        ?.replace(/client/g, prospectName)
                                        ?.replace(/contract/g, EngagementName)}
                                    </span>
                                  </div>
                                </li>
                              ))}
                          </ol>
                        </div>
                        <div class="col-md-6">
                          <ol class="activity-feed">
                            {notificationList
                              .slice(Math.ceil(notificationList.length / 2))
                              .map((notificationVal, index) => (
                                <li key={index} class="feed-item">
                                  <div class="feed-item-list">
                                    <span class="date">
                                      <strong>
                                        {notificationVal.title
                                          ?.replace(/quote/g, proposalName)
                                          ?.replace(/Quotation/g, proposalName)
                                          ?.replace(/client/g, prospectName)
                                          ?.replace(
                                            /contract/g,
                                            EngagementName
                                          )}{" "}
                                      {notificationVal.notificationDate.replace(/^(.+\d{4})\s+(.+)$/, (match, p1, p2) => `[ ${p1}  (${p2.trim()}) ]`)}
                                      </strong>
                                    </span>

                                    <span
                                      style={{
                                        color: "blue",
                                        cursor: "pointer",
                                      }}
                                      class="activity-text"
                                      onClick={() => {
                                        navigate(
                                          `/${notificationVal.moduleURL}`
                                        );
                                      }}
                                    >
                                      {notificationVal?.message
                                        ?.replace(/quotation/g, proposalName)
                                        ?.replace(/client/g, prospectName)
                                        ?.replace(/contract/g, EngagementName)}
                                    </span>
                                  </div>
                                </li>
                              ))}
                          </ol>
                        </div>
                      </div>
                    ) : (
                      <NoResultFoundModel name={" Notification "} />
                    )}

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
          </div>
        </div>
        </div>
        </div>
        </div>
        </div>
        </div>
        </div>
        </div>
      </div>
      <button class="btn btn-danger btn-icon" id="back-to-top">
        <i class="ri-arrow-up-line"></i>
      </button>
      <Footer />
    </div>
  );
};

export default Notification;
