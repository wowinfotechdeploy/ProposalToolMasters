/* global $ */
import React, { useContext } from "react";
import { AuthContextProvider } from "../../../../AuthContext/AuthContext";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { AccessKeyBaseUrl } from "../../../../Base-Url/Base_Url";
const AccessKeyUsesModal = (props) => {
    const moduleName = "Access Key"
    const {
        getCrudButtonTextName,
    } = useContext(AuthContextProvider);
    return (
        <div
            //   style={{ display: "none" }}
            class={props.class}
            id={props.id}
            tabIndex={props.tabIndex}
            aria-labelledby={props.aria_labelledby}
            aria-hidden={props.aria_hidden}
            data-bs-backdrop="static"
            data-bs-keyboard="false"
        >
            <div class="modal-dialog modal-md modal-dialog-centered">
                <div class="modal-content">
                    {/*Heading Start */}
                    <div class="modal-header bg-light p-3">
                        <h5 class="modal-title" id="exampleModalLabel">
                            {moduleName} Uses
                        </h5>
                        {/* Close Button Start */}
                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            id="close-modal"
                        >
                            {/* Close Button End */}
                        </button>
                    </div>
                    {/*Heading End */}

                    <div class="modal-body">
                        <div class="p-3">

                            <div className="d-flex justify-content-center flex-column">
                                <h5>
                                    {moduleName} Uses:
                                </h5>
                                <p>Follow these steps to authenticate using the access key:</p>
                                <ol>
                                    <li>Call below API from your website.<br></br>
                                        API: <b>{`${AccessKeyBaseUrl}/api/login/authenticate?accessKey={Token}`}</b>
                                    </li>
                                    <li>After calling the above API, you will receive the redirection URL in the response.<br></br>
                                        Response:<br></br>
                                        <b> {`{redirectUrl: redirectUrl}`}</b>
                                    </li>
                                    <li>Open the redirection URL in a new tab or popup.</li>
                                    <li>Finish.</li>
                                </ol>

                            </div>
                        </div>
                    </div>

                    {/*Modal body End */}
                    {/*Footer body button Start */}
                    <div class="modal-footer">
                        <div class="hstack gap-2 justify-content-end">
                            <button
                                type="button"
                                class="btn btn-success create-item-btn"
                                data-bs-dismiss="modal"
                            >
                                Ok
                            </button>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AccessKeyUsesModal;
