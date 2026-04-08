/* global $ */
import React, { useEffect, useState, useRef, useContext } from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import { AuthContextProvider } from "../AuthContext/AuthContext";
function SubscriptionView(props) {
  const {
    EngagementName,
    proposalName,
    setLoader,
    formatValue,
    formatValueWithoutCurrencySymbol,
  } = useContext(AuthContextProvider);
  console.log(props.subscriptionPackageObj, "props.subscriptionPackageObj");
  return (
    <div>
      <div
        class={props.class}
        id={props.id}
        tabIndex={props.tabIndex}
        aria-labelledby={props.aria_labelledby}
        aria-hidden={props.aria_hidden}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div className="modal-dialog model-large modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header  p-3">
              <h5 class="modal-title" id="exampleModalLabel">
                {props.title}
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="close-modal"
              ></button>
            </div>

            <div>
              <div className="tab-content">
                <div className="container-fluid">
                  <Row>
                    <Col md="6">
                      <Card
                        className="pricing-box d-flex shadow-lg p-3 rounded"
                        style={{ marginTop: "15px", height: "56vh" }}
                      >
                        <div className="media">
                          <i className="ion ion-ios-airplane h1 align-self-center"></i>
                          <div className="media-body text-start">
                            <h6 className="text-dark text-center ">
                              Subscription Details
                            </h6>
                            <div className="pricing-features mt-5  mr-3 align-items-start ">
                              <p className=" mb-1 text-dark text-nowrap ">
                                <b>Package Name</b>:{" "}
                                {props.subscriptionPackageObj.packageName}
                              </p>
                              <p className=" mb-1 text-dark text-nowrap">
                                <b>Payment Frequency</b>:{" "}
                                {/* {props.subscriptionPackageObj.packageName} */}
                                {props.subscriptionPackageObj
                                  .paymentFrequencyID === 1
                                  ? "Yearly"
                                  : props.subscriptionPackageObj
                                        .paymentFrequencyID === 4
                                    ? "Monthly"
                                    : ""}
                              </p>
                              <p className=" mb-1 text-dark text-nowrap">
                                <b>Days</b>:{" "}
                                {props.subscriptionPackageObj
                                  .paymentFrequencyID === 1
                                  ? "365 Days"
                                  : props.subscriptionPackageObj
                                        .paymentFrequencyID === 4
                                    ? "30 Days"
                                    : "-"}
                              </p>
                              <p className=" mb-1 text-dark text-nowrap">
                                <b>Subscription Date</b>:{" "}
                                {props.subscriptionPackageObj
                                  .subscriptionStartDate === null
                                  ? "-"
                                  : props.subscriptionPackageObj
                                      .subscriptionStartDate}
                              </p>

                              <p className=" mb-1 text-dark text-nowrap">
                                <b>Next Renewal Date</b>:{" "}
                                {props.subscriptionPackageObj.renewDate === null
                                  ? "-"
                                  : props.subscriptionPackageObj.renewDate}
                              </p>
                              <p className=" mb-1 text-dark text-nowrap">
                                <b>Payment Status</b>:{" "}
                                {props.subscriptionPackageObj.paymentStatus}
                              </p>
                              <p className=" mb-1 text-dark text-nowrap">
                                <b>Subscription Status</b>:{" "}
                                {
                                  <div
                                    className="p-1   rounded text-nowrap"
                                    style={{
                                      color:
                                        props.subscriptionPackageObj
                                          .subscriptionStatus === "Active"
                                          ? "#008000"
                                          : props.subscriptionPackageObj
                                                .subscriptionStatus ===
                                              "Expired"
                                            ? "#FF0000"
                                            : props.subscriptionPackageObj
                                                  .subscriptionStatus ===
                                                "Pending"
                                              ? "#DAA520"
                                              : props.subscriptionPackageObj
                                                    .subscriptionStatus ===
                                                  "InActive"
                                                ? "#772424"
                                                : "gray",
                                      width: "100px",
                                      padding: "1px 8px", // Add padding to the button
                                      display: "inline-block", // Ensure button stays in line
                                      borderRadius: "0.5rem", // Adjust border radius
                                    }}
                                  >
                                    {
                                      props.subscriptionPackageObj
                                        .subscriptionStatus
                                    }
                                  </div>
                                }
                              </p>
                              <p className="mt-0 mb-1 text-dark">
                                <b>Remaining E-Signatures</b>:{" "}
                                {props.subscriptionPackageObj
                                  .remainingESignatures < 0
                                  ? 0
                                  : props.subscriptionPackageObj
                                      .remainingESignatures}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Col>
                    <Col md="6">
                      <Card
                        className="pricing-box d-flex shadow-lg p-3 rounded"
                        style={{ marginTop: "15px", height: "56vh" }}
                      >
                        <div className="media">
                          <i className="ion ion-ios-airplane h1 align-self-center"></i>
                          <div className="media-body text-start">
                            <h6 className="text-dark text-center">
                              Package Details
                            </h6>
                            <p
                              style={{ fontWeight: "600" }}
                              className="text-dark text-center "
                            >
                              {formatValue(
                                props.subscriptionPackageObj?.yearlyValuePlan /
                                  12,
                              )}
                              /Month
                            </p>
                            <div className="pricing-features ">
                              <p className="mt-0 mb-1 text-dark">
                                {props.subscriptionPackageObj?.prepareQuote ==
                                true ? (
                                  <span
                                    style={{ color: "green" }}
                                    className="fa fa-check"
                                  ></span>
                                ) : (
                                  <span
                                    style={{ color: "red", marginRight: "2px" }}
                                    className="fa fa-times"
                                  ></span>
                                )}
                                <span style={{ marginLeft: "10px" }}>
                                  {" "}
                                  Prepare {proposalName}
                                </span>
                              </p>
                              <p className="mt-0 mb-1 text-dark">
                                {props.subscriptionPackageObj?.sendQuote ===
                                true ? (
                                  <span
                                    style={{ color: "green" }}
                                    className="fa fa-check"
                                  ></span>
                                ) : (
                                  <span
                                    style={{ color: "red", marginRight: "2px" }}
                                    className="fa fa-times"
                                  ></span>
                                )}
                                <span style={{ marginLeft: "10px" }}>
                                  {" "}
                                  Send {proposalName}
                                </span>
                              </p>
                              <p className="mt-0 mb-1 text-dark">
                                {props.subscriptionPackageObj
                                  ?.prepareContract === true ? (
                                  <span
                                    style={{ color: "green" }}
                                    className="fa fa-check"
                                  ></span>
                                ) : (
                                  <span
                                    style={{ color: "red", marginRight: "2px" }}
                                    className="fa fa-times"
                                  ></span>
                                )}
                                <span style={{ marginLeft: "10px" }}>
                                  {" "}
                                  Prepare {EngagementName} (EL)
                                </span>
                              </p>
                              <p className="mt-0 mb-1 text-dark">
                                {props.subscriptionPackageObj?.signContract ===
                                true ? (
                                  <span
                                    style={{ color: "green" }}
                                    className="fa fa-check"
                                  ></span>
                                ) : (
                                  <span
                                    style={{ color: "red", marginRight: "2px" }}
                                    className="fa fa-times"
                                  ></span>
                                )}
                                <span style={{ marginLeft: "10px" }}>
                                  {" "}
                                  Send And Digitally Sign The EL:{" "}
                                  {
                                    props.subscriptionPackageObj
                                      ?.eSignaturePerMonth
                                  }
                                  /Month
                                </span>
                              </p>
                              <p className="mt-0 mb-1 text-dark">
                                {props.subscriptionPackageObj?.isMailBox ===
                                  null ||
                                !props.subscriptionPackageObj?.isMailBox ? (
                                  <span
                                    style={{ color: "red", marginRight: "2px" }}
                                    className="fa fa-times"
                                  ></span>
                                ) : (
                                  <span
                                    style={{ color: "green" }}
                                    className="fa fa-check"
                                  ></span>
                                )}
                                {"  "}
                                <span style={{ marginLeft: "10px" }}>
                                  {" "}
                                  Personalized Outgoing Mailbox
                                </span>
                              </p>
                              <p className="mt-0 mb-1 text-dark">
                                {props.subscriptionPackageObj?.apiIntegration ==
                                true ? (
                                  <span
                                    style={{ color: "green" }}
                                    className="fa fa-check"
                                  ></span>
                                ) : (
                                  <span
                                    style={{ color: "red", marginRight: "2px" }}
                                    className="fa fa-times"
                                  ></span>
                                )}
                                <span style={{ marginLeft: "10px" }}>
                                  {" "}
                                  API Integration
                                </span>
                              </p>
                              <p className="mt-0 mb-1 text-dark">
                                {props.subscriptionPackageObj
                                  ?.enablePdfToCsv === null ||
                                !props.subscriptionPackageObj
                                  ?.enablePdfToCsv ? (
                                  <span
                                    style={{
                                      color: "red",
                                      marginRight: "2px",
                                    }}
                                    className="fa fa-times"
                                  ></span>
                                ) : (
                                  <span
                                    style={{
                                      color: "green",
                                    }}
                                    className="fa fa-check"
                                  ></span>
                                )}
                                {"  "}
                                <span
                                  style={{
                                    marginLeft: "10px",
                                  }}
                                >
                                  {" "}
                                  PDF To CSV
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionView;
