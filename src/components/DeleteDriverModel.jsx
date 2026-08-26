import React, { useContext, useState } from "react";
import "../pages/configure/global-constants/PredefineGlobalConstant.css";
import { AuthContextProvider } from "../AuthContext/AuthContext";

const DeleteDriverModal = (props) => {
  const {
    proposalName,
    EngagementName,
    prospectName
  } = useContext(AuthContextProvider);
  return (
    <>
      <div
        style={{
          display: (props.openSuccessModal || props.openErrorModal) && "none",
          zIndex: "99999",
        }}
        className="modal fade zoomIn designed-popup"
        id="DeleteDriverModel"
        aria-hidden="true"
        aria-labelledby="secondModalLabel"
        tabIndex="0"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div class="modal-dialog modal-md modal-dialog-centered pricing-driver-popup">
          <div className="modal-content">
            {/* <div style={{ padding: "10px", display: "flex", justifyContent: "right" }}> */}
            <div
              className="modal-header"
              style={{ paddingBottom: "10px", background: "rgb(237 237 237)" }}
            >
              <button
                className="btn-close"
                onClick={props.handleClose}
                id="btn-close"
                type="button"
              ></button>
            </div>
            {/* <div class="separator"></div> */}
            <div className="modal-body DeleteDriver-scroll">
              <div className="text-center">
                <div className="fs-15 mx-4 mx-sm-3">
                  {/* Conditional Rendering based on modelRequestData.Action */}
                  {props.modelRequestData.Action == "AccessModel" && (
                    <>
                      <p>
                        <div
                          style={{
                            height: "80px",
                            width: "80px",
                            borderStyle: "solid",
                            borderWidth: "4px",
                            borderRadius: "50%",
                            borderColor: "rgb(238, 162, 54)",
                            position: "relative",
                            margin: " 20px auto",
                            boxSizing: "content-box",
                            animation:
                              "0.75s ease 0s infinite alternate none running pulseWarning",
                          }}
                        >
                          <span
                            style={{
                              width: "5px",
                              position: "absolute",
                              left: "50%",
                              height: "47px",
                              top: "10px",
                              borderRadius: "2px",
                              marginLeft: "-2px",
                              backgroundColor: "rgb(240, 173, 78)",
                              animation:
                                "0.75s ease 0s infinite alternate none running pulseWarningIns",
                            }}
                          ></span>
                          <span
                            style={{
                              position: "absolute",
                              width: "7px",
                              height: "7px",
                              borderRadius: "50%",
                              marginLeft: "-3px",
                              left: "50%",
                              bottom: "10px",
                              backgroundColor: "rgb(240, 173, 78)",
                              animation:
                                "0.75s ease 0s infinite alternate none running pulseWarningIns",
                            }}
                          ></span>
                        </div>
                      </p>
                      <h4 class="text-dark">Are you sure?</h4>

                      <span class="text-muted mb-0">
                        Are you sure you want to unselect all access?
                      </span>
                    </>
                  )}
                  {props.modelRequestData.Action == "PricingDriverDelete" && (
                    <>
                      <div style={{ whiteSpace: "pre-line" }}>{props.modelRequestData.message}</div>
                      {props.modelRequestData.ServiceName.map((module) => (
                        <div key={module.moduleName}>
                          <div>
                            <b>{module.moduleName === "ServicePackage" ? "Package" : module.moduleName
                              ?.replace(/Quotation/g, proposalName)
                              ?.replace(/Contract/g, EngagementName)}</b>
                          </div>
                          <div style={{ textAlign: "left" }}>
                            <ul className="desined-list">
                              {module.recordList.map((record) => (
                                <li key={record.keyID}>
                                  <span>{record.name}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                  {props.modelRequestData.Action === "ClientDelete" && (
                    <>
                      <div>{props.modelRequestData.message}</div>

                      {props.modelRequestData.clientExistsInModule?.length > 0 && (
                        <>
                          {props.modelRequestData.clientExistsInModule.map((client, i) => (
                            <div key={i}>
                              <div>
                                <b>{prospectName} : {client.clientName}</b>
                              </div>
                              <div style={{ textAlign: "left" }}>
                                <ul className="desined-list">
                                  {client.quotes.length > 0 && (
                                    <>
                                      <li><b>{proposalName}</b></li>
                                      {client.quotes.map((quote, index) => (
                                        <li key={`quote-${index}`}>
                                          <span>{quote}</span>
                                        </li>
                                      ))}
                                    </>
                                  )}
                                  {client.contracts.length > 0 && (
                                    <>
                                      <li><b>{EngagementName}</b></li>
                                      {client.contracts.map((contract, index) => (
                                        <li key={`contract-${index}`}>
                                          <span>{contract}</span>
                                        </li>
                                      ))}
                                    </>
                                  )}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </>
                      )}


                    </>
                  )}
                  {props.modelRequestData.Action === "ServiceFeeInflation" && (
                    <>
                      <p className="text-muted mb-0">
                        {props.modelRequestData.message}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div
              class="modal-footer"
              style={{ background: "rgb(237 237 237)" }}
            >
              <div class="hstack gap-2 justify-content-end">
                {(props.modelRequestData.Action == "PricingDriverDelete" || 
                  props.modelRequestData.Action === "ClientDelete" || 
                  props.modelRequestData.Action === "ServiceFeeInflation") && (
                  <button
                    type="button"
                    onClick={props.handleClose}
                    className="btn btn-md btn-success create-item-btn"
                  // data-bs-dismiss="modal"
                  >
                    <span>Close</span>
                  </button>
                )}
                {props.modelRequestData.Action == "AccessModel" && (
                  <button
                    type="button"
                    onClick={props.handleClose}
                    class="btn btn-md btn-light cancel-item-btn"
                  // data-bs-dismiss="modal"
                  >
                    <span>Cancel</span>
                  </button>
                )}
                {props.modelRequestData.Action == "AccessModel" && (
                  <button
                    type="button"
                    onClick={props.UpdatedStatus}
                    class="btn btn-md btn-success create-item-btn"
                  // data-bs-dismiss="modal"
                  >
                    <span>Yes, Change It!</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </Modal> */}
    </>
  );
};

export default DeleteDriverModal;
