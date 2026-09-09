/* global $ */
import React, { useContext, useState } from "react";

import errorImage from "../assets/images/gif/wired-outline-1140-error.gif";
import { useDispatch } from "react-redux";
import { resetState } from "../redux/Persist";
import { useNavigate } from "react-router-dom";
import { AuthContextProvider } from "../AuthContext/AuthContext";
import "./SessionTimeOutModel-redesign.css";

const SetTimeoutComponent = () => {
  const { setLoader, logoutTimeUpModal, setLogoutTimeUpModal } =
    useContext(AuthContextProvider);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCloseModal = () => {
    setShowModal(false);
    localStorage.clear();
    dispatch(resetState());
    navigate("/login");
    setShowModal(false);
  };

  const handleStayLogin = () => {
    setShowModal(false);
    $("#" + "LogoutTimeUpModal").modal("hide");
    setLogoutTimeUpModal({
      ...logoutTimeUpModal,
      isPopupOpen: false,
      popupCloseTime: new Date(),
    });
    // Handle stay login logic here
  };

  return (
    <div>
      <div
        className={`modal fade session-timeout-warning-modal ${
          showModal ? "show" : ""
        }`}
        id="LogoutTimeUpModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden={!showModal}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        style={{ zIndex: "9999999" }}
      >
        <div className="modal-dialog modal-md modal-dialog-centered session-timeout-warning-dialog">
          <div className="modal-content session-timeout-warning-content">
            <div className="modal-header session-timeout-warning-header">
              <div className="session-timeout-warning-heading">
                <span className="session-timeout-warning-heading-icon">
                  <i className="ri-timer-flash-line"></i>
                </span>

                <div>
                  <h6 className="modal-title">Session Timeout</h6>
                  <p>Your current session has reached its timeout limit.</p>
                </div>
              </div>
            </div>

            <div className="modal-body session-timeout-warning-body">
              <div className="session-timeout-warning-message">
                <div className="session-timeout-warning-image-wrap">
                  <img
                    src={errorImage}
                    alt="error_Img"
                    className="session-timeout-warning-image"
                  />
                </div>

                <div className="session-timeout-warning-copy">
                  <h4>Time's up!</h4>
                  <p>
                    Your session is about to end. Log out now or stay connected
                    to continue working.
                  </p>
                </div>
              </div>
            </div>

            <div className="modal-footer session-timeout-warning-footer">
              <button
                type="button"
                className="btn session-timeout-warning-logout-btn"
                data-bs-dismiss="modal"
                onClick={handleCloseModal}
              >
                Log Out
              </button>

              <button
                type="button"
                className="btn btn-success create-item-btn session-timeout-warning-stay-btn"
                onClick={handleStayLogin}
              >
                <i className="ri-refresh-line"></i>
                <span>Stay Connected</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetTimeoutComponent;
