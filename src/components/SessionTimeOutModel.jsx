/* global $ */
import React, { useContext, useState } from "react";

import errorImage from "../assets/images/gif/wired-outline-1140-error.gif";
import { useDispatch } from "react-redux";
import { resetState } from "../redux/Persist";
import { useNavigate } from "react-router-dom";
import { AuthContextProvider } from "../AuthContext/AuthContext";

const SetTimeoutComponent = () => {
    const { setLoader, logoutTimeUpModal,
        setLogoutTimeUpModal } = useContext(AuthContextProvider);
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
            popupCloseTime: new Date()
        })
        // Handle stay login logic here
    };

    return (
        <div>
            {/* Button to trigger modal */}
            {/* <button onClick={handleShowModal}>Show Timeout Modal</button> */}

            {/* Modal markup */}
            <div
                className={`modal fade ${showModal ? "show" : ""}`}
                id="LogoutTimeUpModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden={!showModal}
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                style={{ zIndex: "9999999" }}
            >
                <div className="modal-dialog modal-md modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header bg-light p-3">
                            <h6>Session Timeout</h6>
                            {/* <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={handleCloseModal}
                            ></button> */}
                        </div>
                        <div className="modal-body">
                            {/* Modal body content */}
                            <div className="text-center mb-3">
                                {/* Error image */}
                                <img
                                    src={errorImage}
                                    alt="error_Img"
                                    height="70px"
                                    width="70px"
                                />
                            </div>
                            <p className="text-center mb-3">Time's up! Logging out now.</p>
                        </div>
                        <div className="modal-footer">
                            {/* Modal footer buttons */}
                            <div className="hstack gap-2 justify-content-end">
                                <button
                                    type="button"
                                    className="btn btn-md btn-light"
                                    data-bs-dismiss="modal"
                                    onClick={handleCloseModal}
                                >
                                    Log Out
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-md btn-success create-item-btn"
                                    onClick={handleStayLogin}
                                >
                                    Stay Connected
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SetTimeoutComponent;
