/* global $ */
import React, { useState, useEffect, useRef, useContext } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { resetState } from "../redux/Persist";
import { UpdateUsersLoginSessionTime } from "../redux/Services/User/UsersApi";
import { AuthContextProvider } from "../AuthContext/AuthContext";
import SetTimeoutComponentModel from "./SessionTimeOutModel";
import { ERROR_MESSAGES } from "./GlobalMessage";
import { useNavigate } from "react-router-dom";
import SuccessModal from "./SuccessModal";

const SetTimeoutComponent = (props) => {
  const dispatch = useDispatch();
  const { setLoader, logoutTimeUpModal, setLogoutTimeUpModal } = useContext(AuthContextProvider);
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [logoutTime, setLogoutTimeFormLocal] = useState("");
  const [error, setError] = useState(false);
  const timerRef = useRef(null);
  const countdownRef = useRef(null);
  const [countdown, setCountdown] = useState(0); // New countdown state
  const common = useSelector((state) => state.Storage);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const handleCloseModal = () => {
    localStorage.clear();
    dispatch(resetState());
    navigate("/login");
  };

  const resetTimer = (milliseconds) => {
    let Seconds = Number(milliseconds);
    if (timerRef.current) clearTimeout(timerRef.current);

    // Reset countdown with the provided time
    setCountdown(milliseconds / 1000); // Set countdown in seconds

    timerRef.current = setTimeout(() => {
      const modalElement = $("#" + "LogoutTimeUpModal");
      if (!modalElement.is(":visible")) {
        modalElement.modal("show");
        setLogoutTimeUpModal({
          ...logoutTimeUpModal,
          isPopupOpen: true,
          popupOpenTime: new Date(),
        });
      }
    }, Seconds);
  };

  const startCountdown = (milliseconds) => {
    if (countdownRef.current) clearInterval(countdownRef.current);

    countdownRef.current = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(countdownRef.current); // Stop countdown at zero
          handleCloseModal(); // Trigger logout modal when countdown ends
          return 0;
        }
        return prevCountdown - 1; // Decrease countdown
      });
    }, 1000);
  };

  const setLogoutTime = async () => {
    if (logoutTime === undefined || logoutTime === null || logoutTime === "") {
      setError(true);
      return;
    }
    const minutes = Number(logoutTime, 10);
    if (isNaN(minutes)) {
      setError(true);
      return;
    } else {
      setError(false);
      const milliseconds = minutes * 60 * 1000;
      await UpdateUsersLoginSessionTimeData(common.userKeyID, logoutTime);
      localStorage.setItem("logoutMilliseconds", milliseconds);
      setSuccessMessage("Session Timeout Set successfully!");
      resetTimer(milliseconds);
      startCountdown(milliseconds); // Start countdown when session time is set
      localStorage.setItem("lastInteraction", new Date().toISOString());
    }
  };

  const UpdateUsersLoginSessionTimeData = async (userKeyID, LoginSessionTime) => {
    setLoader(true);
    try {
      const response = await UpdateUsersLoginSessionTime(userKeyID, LoginSessionTime);
      const data = response.data;
      if (data.statusCode === 200) {
        setLoader(false);
        setOpenSuccessModal(true);
        $("#" + "LogoutTimeUpModal").modal("hide");
        props.handleCloseSessionModel();
      } else {
        console.error("Error fetching data from the API");
        setLoader(false);
      }
    } catch (error) {
      console.error("Error fetching data from the API", error);
      setLoader(false);
    }
  };

  const handleLogoutTimeChange = (event) => {
    let inputValue = event.target.value.trim();
    const sanitizedInput = inputValue.replace(/[^0-9-]/g, '');
    let parsedInput = parseInt(sanitizedInput, 10);

    if (isNaN(parsedInput)) {
      parsedInput = "";
      setError(true);
    } else if (parsedInput < 1 || parsedInput > 1440) {
      return;
    } else {
      setError(false);
    }

    event.target.value = parsedInput.toString();
    setLogoutTimeFormLocal(parsedInput.toString());
  };

  useEffect(() => {
    const handleMouseMove = () => {
      const storedMilliseconds = localStorage.getItem("logoutMilliseconds");
      if (storedMilliseconds) {
        resetTimer(Number(storedMilliseconds));
        startCountdown(Number(storedMilliseconds)); // Restart countdown on mouse movement
        localStorage.setItem("lastInteraction", new Date().toISOString());
      }
    };

    const handleStorageChange = (event) => {
      if (event.key === "logoutMilliseconds") {
        const storedMilliseconds = localStorage.getItem("logoutMilliseconds");
        if (storedMilliseconds) {
          resetTimer(Number(storedMilliseconds));
        }
      }
      if (event.key === "lastInteraction") {
        const storedMilliseconds = localStorage.getItem("logoutMilliseconds");
        if (storedMilliseconds) {
          resetTimer(Number(storedMilliseconds));
        }
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("storage", handleStorageChange);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const storedMilliseconds = localStorage.getItem("logoutMilliseconds");
    if (storedMilliseconds) {
      resetTimer(Number(storedMilliseconds));
    }
  }, []);

  useEffect(() => {
    const storedMilliseconds = localStorage.getItem("logoutMilliseconds");
    if (storedMilliseconds) {
      const milliseconds = parseInt(storedMilliseconds, 10);
      const minutes = milliseconds / (1000 * 60);
      setLogoutTimeFormLocal(minutes.toString());
    }
  }, [props.isOpenSessionTimeout]);

  const handleClose = () => {
    $("#" + props.id).modal("hide");
    setOpenSuccessModal(false);
  };

  return (
    <div>
      <Modal show={props.isOpenSessionTimeout} centered size="md">
        <Modal.Header>
          <h6 className="modal-title">Set Session Timeout</h6>
          <button
            type="button"
            className="btn-close"
            onClick={() => {
              props.handleCloseSessionModel();
              setError(false);
            }}
          ></button>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-body">
            <div className="tab-content">
              <div className="row">
                <div className="col-lg-4">
                  <div className="col-md-3 col-sm-12 text-start text-md-end">
                    <label htmlFor="logout-time-input" className="fieldset-label mt-2">
                      Enter Session Timeout<span className="text-danger">*</span>
                    </label>
                  </div>
                </div>
                <div className="col-md-8 col-sm-12">
                  <div className="input-group">
                    <input
                      type="text"
                      id="logout-time-input"
                      className="input-text"
                      placeholder="Session Timeout (in minutes)"
                      required
                      pattern="\d*"
                      value={logoutTime}
                      maxLength={4}
                      onChange={handleLogoutTimeChange}
                      onKeyDown={(e) => {
                        if (e.key === "." || e.key === "e" || e.key === "+" || e.key === "-") {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                  {error && <label className="validation mt-2">{ERROR_MESSAGES}</label>}
                </div>
              </div>
              {/* Countdown Timer */}
              {/* <div className="row mt-3">
                <div className="col-md-12 text-center">
                  <h5>Time Remaining: {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, "0")}</h5>
                </div>
              </div> */}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="hstack gap-2 justify-content-end">
            <button type="submit" className="btn btn-md btn-success create-item-btn" id="add-btn" onClick={setLogoutTime}>
              Submit
            </button>
          </div>
        </Modal.Footer>
      </Modal>
      <SetTimeoutComponentModel class="modal fade" tabIndex="-1" aria_labelledby="exampleModalLabel" aria_hidden="true" handleCloseModal={handleCloseModal} />
      <SuccessModal
        handleClose={handleClose}
        setOpenSuccessModal={setOpenSuccessModal}
        openSuccessModal={openSuccessModal}
        modelAction={"Update"}
        message={"Session Timeout"}
      />
    </div>
  );
};

export default SetTimeoutComponent;
